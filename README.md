# Visitor Verification Platform (VVP)
> A privacy-preserving zero-knowledge visitor verification platform built on the Midnight Network using Compact smart contracts.

[![Midnight Preprod](https://img.shields.io/badge/Network-Midnight_Preprod-8b5cf6?style=flat-square)](https://explorer.preprod.midnight.network)
[![Compact Language](https://img.shields.io/badge/Compact-v0.5.1-06b6d4?style=flat-square)](https://midnight.network)
[![Node.js Version](https://img.shields.io/badge/Node.js-v22.23.1-10b981?style=flat-square)](https://nodejs.org)
[![License](https://img.shields.io/badge/License-MIT-blue.style=flat-square)](LICENSE)

---

## Contract Address
| Network  | Contract Address | Verification / Explorer Link |
|----------|------------------|------------------------------|
| **Preprod** | `0x187ab583926a5ff2e4819242a95edc8dfa8ff784` | [Verify Contract on Midnight Preprod Explorer](https://explorer.preprod.midnight.network) |

> [!NOTE]
> Deployed contract `0x187ab583926a5ff2e4819242a95edc8dfa8ff784` is live on Midnight Preprod Testnet and connected to the local ZK Proof Server running on port `6300`.

---

## What This Does
The **Visitor Verification Platform (VVP)** enables visitors to verify their access authorization for physical or digital venues (e.g. corporate offices, stadium gates, VIP lounges, restricted event zones) without leaking sensitive personal credentials or unencrypted passcodes onto the public blockchain.

Using Zero-Knowledge cryptography on Midnight:
1. The smart contract validates that a visitor holds a valid venue passcode inside a Compact ZK circuit.
2. An incremented public check-in counter (`visitorCount`) and commitment hash (`lastVisitorCommitment`) are recorded on-chain.
3. The visitor's private passcode (`secretPasscode`) remains strictly on the visitor's local device as a private witness.

---

## Privacy Model
- **What is PUBLIC (on-chain, visible to anyone)**:
  - `visitorCount`: Total count of verified visitor check-ins across the venue.
  - `verifierId`: Bytes<32> identifier representing the active venue or gate verifier.
  - `lastVisitorCommitment`: Cryptographic commitment hash generated and disclosed via `disclose()` during verification.
- **What is PRIVATE (private witness, kept locally)**:
  - `secretPasscode()`: Private visitor passcode/token supplied directly into the Zero-Knowledge circuit. It is never written to the ledger or broadcast over the network.
- **What the user PROVES without revealing**:
  - The visitor proves possession of a valid passcode corresponding to the registered verifier without revealing the raw passcode string itself.

---

## Tech Stack
- **Network**: Midnight Testnet (Preprod)
- **Smart Contract Language**: Compact (`0.5.1`)
- **Runtime & Toolchain**: Node.js v22 (`v22.23.1`), TypeScript, Vitest
- **Zero-Knowledge Infrastructure**: Midnight Proof Server (`midnightntwrk/proof-server:8.1.0` on port 6300)

---

## Prerequisites
Before running or testing locally, ensure you have:
1. **Node.js v22** (`nvm use 22`)
2. **Docker Desktop** running locally
3. **Compact Compiler** installed globally:
   ```bash
   npm install -g @midnight-ntwrk/compact-compiler
   ```

---

## Setup & Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/INdrajit88/visitor-verification-platform.git
   cd visitor-verification-platform
   ```

2. **Set Node version and install dependencies**:
   ```bash
   nvm use 22
   npm install
   ```

3. **Start the Midnight Proof Server container**:
   ```bash
   docker run -d -p 6300:6300 midnightntwrk/proof-server:8.1.0
   ```

4. **Compile the Compact contract**:
   ```bash
   compact compile contracts/counter.compact managed
   ```

5. **Deploy contract to Preprod (manual trigger)**:
   ```bash
   NODE_OPTIONS="--max-old-space-size=12288" npm run deploy
   ```

---

## Run Tests
Execute the automated test suite covering Zero-Knowledge circuit execution, state transitions, and private witness protection:

```bash
npm test
```

Expected Output:
```text
 ✓ tests/counter.test.ts (3 tests) 7ms

 Test Files  1 passed (1)
      Tests  3 passed (3)
```

---

## Initial Idea
The Visitor Verification Platform (VVP) was conceived to address critical privacy risks in modern physical and digital access management systems. Traditional visitor check-in mechanisms force guests to surrender sensitive personal data (such as government IDs, phone numbers, or unencrypted access codes) to centralized venue databases, exposing visitors to data breaches and unwanted tracking.

VVP leverages Midnight's zero-knowledge smart contract framework (written in Compact) to decouple access verification from identity exposure:
- **Zero-Knowledge Visitor Proofs**: Visitors prove they hold a valid passcode for a target venue directly inside a zero-knowledge circuit without ever writing their secret credential or identity to the public ledger.
- **Verifiable Auditability**: Venues maintain an immutable, on-chain record of total verified check-ins and cryptographic commitment hashes without managing high-risk PII databases.
- **Real-World Applications**: Ideal for corporate office guest check-ins, VIP event access control, restricted facility management, and privacy-first venue ticketing.

---

## Screenshots
![Visitor Verification Platform Screenshot](screenshot.png)