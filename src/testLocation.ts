import process from "node:process";
import { createLibp2p } from "libp2p";
import { tcp } from "@libp2p/tcp";
import { noise } from "@chainsafe/libp2p-noise";
import { mplex } from "@libp2p/mplex";
import { multiaddr } from "multiaddr";

import { ReferencePoint, EstimatedLocation } from "./types";
import { multilaterationTriangulation } from "./utils";

async function main() {
  const node = await createLibp2p({
    addresses: {
      // add a listen address (localhost) to accept TCP connections on a random port
      listen: ["/ip4/127.0.0.1/tcp/0"],
    },
    transports: [tcp()],
    connectionEncryption: [noise()],
    streamMuxers: [mplex()],
  });

  // start libp2p
  await node.start();
  console.log("libp2p has started");

  // print out listening addresses
  console.log("listening on addresses:");
  node.getMultiaddrs().forEach((addr) => {
    console.log(addr.toString());
  });

  // ping peer
  const addresses0: ReferencePoint = {
    ip: "/ip4/50.19.25.33/tcp/34885/p2p/12D3KooWBK3hBKzgjXaGXFJVwD2TSNFJiytwkEsRzRXjAc9S11No",
    latitude: 39.043756,
    longitude: -77.487442,
    name: "N. Virginia",
    id: 0,
  };

  const address1: ReferencePoint = {
    ip: "/ip4/35.91.197.225/tcp/40719/p2p/12D3KooWANbVZeTE7D5EAQbPJ7TykHeRa9RmFxgUHgzgHHdRQdvy",
    latitude: 45.523064,
    longitude: -122.676483,
    name: "oregon",
    id: 1,
  };

  const address2: ReferencePoint = {
    ip: "/ip4/54.153.28.171/tcp/44343/p2p/12D3KooWAV6tzb6YGGerVxijjZzwgJ2EU3MxxGZCEYTn2LXHnnzE",
    latitude: 37.774929,
    longitude: -122.419416,
    name: "san francisco",
    id: 2,
  };

  const addresses: ReferencePoint[] = [addresses0, address1, address2];

  try {
    const ma0 = multiaddr(addresses0.ip) as any;
    console.log(`pinging remote peer at ${addresses0.ip}`);
    const latency0 = await node.ping(ma0);
    console.log(`pinged ${addresses0.ip} in ${latency0}ms`);
    addresses0.latency = latency0;
  } catch (err) {
    console.log(err);
  }

  try {
    const ma1 = multiaddr(address1.ip) as any;
    console.log(`pinging remote peer at ${address1.ip}`);
    const latency1 = await node.ping(ma1);
    console.log(`pinged ${address1.ip} in ${latency1}ms`);
    address1.latency = latency1;
  } catch (err) {
    console.log(err);
  }

  try {
    const ma2 = multiaddr(address2.ip) as any;
    console.log(`pinging remote peer at ${address2.ip}`);
    const latency2 = await node.ping(ma2);
    console.log(`pinged ${address2.ip} in ${latency2}ms`);
    address2.latency = latency2;
  } catch (err) {
    console.log(err);
  }

  console.log(addresses);
  const referencePoints = addresses.filter((address) => address.latency);
  const estimatedLocation: EstimatedLocation =
    multilaterationTriangulation(referencePoints);
  console.log(estimatedLocation);

  const stop = async () => {
    // stop libp2p
    await node.stop();
    console.log("libp2p has stopped");
    process.exit(0);
  };

  process.on("SIGTERM", stop);
  process.on("SIGINT", stop);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
