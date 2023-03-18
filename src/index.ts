import process from "node:process";
import { createLibp2p } from "libp2p";
import { tcp } from "@libp2p/tcp";
import { noise } from "@chainsafe/libp2p-noise";
import { mplex } from "@libp2p/mplex";
import { multiaddr } from "multiaddr";
import { ethers } from "ethers";

import { ReferencePoint, EstimatedLocation } from "./types";
import { multilaterationTriangulation } from "./utils";

// Set up the Ethereum provider
const provider = new ethers.providers.getDefaultProvider();

// Set the GeolocationStaking contract address and ABI
const geolocationStakingAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
const geolocationStakingAbi = [
  "function getStakedAmount(address _address) public view returns (uint256)",
  "function getScore(address _address) public view returns (uint256)",
  "function getRegistered(address _address) public view returns (bool)",
  "function getNodeInfo(address _address) public view returns (uint256, uint256, bool)",
];

// Create the GeolocationStaking contract instance
const geolocationStaking = new ethers.Contract(
  geolocationStakingAddress,
  geolocationStakingAbi,
  provider
);

// Define the node addresses to check
const nodes = ["0x0", "0x1", "0x2"];

async function main() {
  // Create libp2p node
  const node = await createLibp2p({
    addresses: {
      // Add a listen address (localhost) to accept TCP connections on a random port
      listen: ["/ip4/127.0.0.1/tcp/0"],
    },
    transports: [tcp()],
    connectionEncryption: [noise()],
    streamMuxers: [mplex()],
  });

  // Start libp2p node
  await node.start();
  console.log("libp2p has started");

  // Print out listening addresses
  console.log("listening on addresses:");
  node.getMultiaddrs().forEach((addr) => {
    console.log(addr.toString());
  });

  // Initialize the addresses array
  const addresses = [] as any;

  // Iterate through the nodes, checking their scores, making sure they are in different locations, and pinging them if necessary
  for (const nodeAddress of nodes) {
    // Get the node's stake, score, and registration status
    const [stake, score, registered, latitude, longitude] =
      await geolocationStaking.getNodeInfo(nodeAddress);

    console.log(
      `Node ${nodeAddress} has stake: ${stake}, score: ${score}, registered: ${registered}, latitude: ${latitude}, longitude: ${longitude}`
    );

    // If the node's score is greater than 50 and it is registered, ping it
    if (score > 50 && registered === true) {
      const ma = multiaddr(nodeAddress) as any;
      console.log(`pinging remote peer at ${nodeAddress}`);
      const latency = await node.ping(ma);
      console.log(`pinged ${nodeAddress} in ${latency}ms`);
      addresses.push({
        ip: nodeAddress,
        latency: latency,
        latitude: latitude,
        longitude: longitude,
      });
    }
  }

  // Get the reference points
  const referencePoints = addresses as ReferencePoint[];

  // Calculate the estimated location using multilateration triangulation
  const estimatedLocation: EstimatedLocation =
    multilaterationTriangulation(referencePoints);
  console.log(estimatedLocation);

  // Function to stop the libp2p node and exit the process
  const stop = async () => {
    // Stop libp2p
    await node.stop();
    console.log("libp2p has stopped");
    process.exit(0);
  };

  // Register stop function to handle process termination signals
  process.on("SIGTERM", stop);
  process.on("SIGINT", stop);
}

// Run the main function and catch any errors
main().catch((error) => {
  console.error(error);
  process.exit(1);
});
