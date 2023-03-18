# GeoPinger: Decentralized Location Estimator

The GeoPinger Libp2p Ping Geolocation Library is a decentralized geolocation system that uses the Libp2p Ping protocol to estimate a node's location based on the latency measurements to other nodes. The system features a challenge-response protocol and a smart contract for logging scores, which encourages honest participation and improves the security of the geolocation process.

## Features

- Decentralized geolocation system using Libp2p Ping protocol.
- Challenge-response protocol to verify node's honest participation.
- Smart contract for logging scores and managing node registration.
- Reputation system and reward mechanism for incentivizing nodes.

## How it Works

1. Nodes register themselves on the smart contract by staking a minimum amount of tokens and providing their initial latitude and longitude.
2. Nodes solve a challenge and verify their solutions before participating in the geolocation process.
3. Nodes use the Libp2p Ping protocol to measure latency to other registered nodes.
4. The system calculates an estimated location for a node using multilateration triangulation based on latency measurements.
5. Nodes update their scores on the smart contract based on their challenge completion and participation in the geolocation process.
6. Nodes can retrieve scores of other nodes using the `getScore` function and incorporate them into the reputation system or reward mechanism.

## Installation

To install the dependencies, run:

```bash
npm install
```

## Usage

1. Compile and deploy the `GeolocationStaking.sol` smart contract to a local Ethereum network.
2. Update the `geolocationStakingAddress` in `index.ts` with the deployed contract address.
3. Run the main script to start a Libp2p node and participate in the geolocation process:

```bash
npm run start
```

4. To test the geolocation system with sample nodes and their latencies, run:

```bash
npm run testLocation
```

## Contributing

Contributions are welcome! Feel free to submit issues or pull requests for improvements or new features.

## License

This project is licensed under the MIT License.