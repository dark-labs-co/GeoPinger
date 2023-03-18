import process from "node:process";
import { createLibp2p } from "libp2p";
import { tcp } from "@libp2p/tcp";
import { noise } from "@chainsafe/libp2p-noise";
import { mplex } from "@libp2p/mplex";
import { multiaddr } from "multiaddr";
import express from "express";

const app = express();

const node = await createLibp2p({
  addresses: {
    // add a listen address (localhost) to accept TCP connections on a random port
    listen: ["/ip4/0.0.0.0/tcp/0"],
  },
  transports: [tcp()],
  connectionEncryption: [noise()],
  streamMuxers: [mplex()],
});

// start libp2p
await node.start();

//return the listening addresses
const addresses = node.getMultiaddrs();

const stop = async () => {
  // stop libp2p
  await node.stop();
  console.log("libp2p has stopped");
  process.exit(0);
};

process.on("SIGINT", stop);
process.on("SIGTERM", stop);

app.get("/addresses", (req, res) => {
  res.send(addresses);
});

app.get("/ping", async (req, res) => {
  if (!req.query.address) {
    res.send("No address provided");
    return;
  }

  const ma = multiaddr(req.query.address);
  console.log(`pinging remote peer at ${req.query.address}`);
  const latency = await node.ping(ma);
  console.log(`pinged ${req.query.address} in ${latency}ms`);
  res.send(`pinged ${req.query.address} in ${latency}ms`);
});
