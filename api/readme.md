# Libp2p Ping Geolocation API

This codebase demonstrates how to use Libp2p to create a simple API server for pinging remote peers and retrieving the listening addresses of the running node. It uses the Express.js framework to handle HTTP requests and Libp2p for peer-to-peer communication.

## Purpose

The purpose of this codebase is to provide a simple API for users to ping remote peers using a Libp2p node and retrieve the listening addresses of the node. The API exposes two endpoints: `/addresses` to fetch the listening addresses and `/ping` to ping a remote peer by providing their multiaddress.

## How it works

1. The Libp2p node is created and started on the client machine, listening on all available network interfaces and a random port.
2. The Express.js app is set up with two endpoints: `/addresses` and `/ping`.
3. The `/addresses` endpoint returns the listening addresses of the running Libp2p node.
4. The `/ping` endpoint pings a remote peer when provided with their multiaddress as a query parameter and returns the latency.

## Usage

1. Install the required dependencies:

```
npm install libp2p @libp2p/tcp @chainsafe/libp2p-noise @libp2p/mplex multiaddr express
```

2. Run the main script:

```
node index.js
```

3. Access the API endpoints:

- To fetch the listening addresses, send a GET request to `http://localhost:3000/addresses`.
- To ping a remote peer, send a GET request to `http://localhost:3000/ping?address=<multiaddress>`.

## Dependencies

- [libp2p](https://github.com/libp2p/js-libp2p)
- [@libp2p/tcp](https://github.com/libp2p/js-libp2p-tcp)
- [@chainsafe/libp2p-noise](https://github.com/ChainSafe/js-libp2p-noise)
- [@libp2p/mplex](https://github.com/libp2p/js-libp2p-mplex)
- [multiaddr](https://github.com/multiformats/js-multiaddr)
- [express](https://github.com/expressjs/express)

## License

This codebase is released under the [MIT License](https://opensource.org/licenses/MIT).