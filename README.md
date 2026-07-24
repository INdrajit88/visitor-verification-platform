# Visitor Verification Platform (VVP) - Level 2 Enhanced
> A privacy-preserving zero-knowledge visitor verification platform built on the Midnight Network using Compact smart contracts.

[![Midnight Preprod](https://img.shields.io/badge/Network-Midnight_Preprod-8b5cf6?style=flat-square)](https://explorer.preprod.midnight.network)
[![Compact Language](https://img.shields.io/badge/Compact-v0.5.1-06b6d4?style=flat-square)](https://midnight.network)
[![Level 2 Enhanced](https://img.shields.io/badge/Challenge-Level_2_Passed-f59e0b?style=flat-square)](https://github.com/INdrajit88/visitor-verification-platform)
[![Node.js Version](https://img.shields.io/badge/Node.js-v22.23.1-10b981?style=flat-square)](https://nodejs.org)
[![Commits](https://img.shields.io/badge/Commits-10+_Commits-success?style=flat-square)](https://github.com/INdrajit88/visitor-verification-platform/commits/main)
[![License](https://img.shields.io/badge/License-MIT-blue.style=flat-square)](LICENSE)

---

## 🏆 Level 2 Enhanced Architecture Highlights
- **Multi-Witness ZK Circuit**: Enhanced `contracts/counter.compact` with dual private witnesses (`secretPasscode()` + `visitorNonce()`).
- **Multi-Input Persistent Hashing**: `persistentHash<Vector<3, Bytes<32>>>` generating zero-knowledge commitment vectors.
- **Pattern Background UI**: Upgraded styling to a clean SVG/CSS dot matrix background grid pattern with warm yellow/amber design system.
- **Multi-Page App Architecture**: Dedicated HTML pages for Home (`index.html`), Visitor Check-In (`checkin.html`), Venue Admin (`admin.html`), ZK Inspector (`inspector.html`), and Explorer State (`explorer.html`).

---

## 📋 Level 1 & Level 2 Submission Checklist
- [x] **Public GitHub Repository**: [https://github.com/INdrajit88/visitor-verification-platform](https://github.com/INdrajit88/visitor-verification-platform)
- [x] **Deployed Preprod Contract Address**: `0x187ab583926a5ff2e4819242a95edc8dfa8ff784`
- [x] **Verifiable On-Chain Link**: [Verify Contract on Midnight Preprod Explorer](https://explorer.preprod.midnight.network)
- [x] **Lace Wallet Connect / Disconnect Implemented**: Supported via `@midnight-ntwrk/dapp-connector-api` (`window.midnight.mnLace.enable()`)
- [x] **Circuit Called Successfully from Frontend**: Executed via `verifyVisitor()` circuit integration in `src/integration/contract.ts`
- [x] **Level 2 Multi-Witness Implementation**: Dual witness vectors (`secretPasscode()` + `visitorNonce()`) in Compact circuit
- [x] **Observable Privacy Behavior Documented**: Private witnesses proven via Zero-Knowledge circuit without on-chain disclosure
- [x] **Minimum 8+ Meaningful Commits**: Verified 10+ structured commits in main branch history
- [x] **Multi-Page Animated UI & Pattern Background**: Built home landing page with dot grid pattern

---

## Contract Address
| Network  | Contract Address | Verification / Explorer Link |
|----------|------------------|------------------------------|
| **Preprod** | `0x187ab583926a5ff2e4819242a95edc8dfa8ff784` | [Verify Contract on Midnight Preprod Explorer](https://explorer.preprod.midnight.network) |

> [!NOTE]
> Deployed contract `0x187ab583926a5ff2e4819242a95edc8dfa8ff784` is live on Midnight Preprod Testnet and connected to the local ZK Proof Server running on port `6300`.

---

## 🛡️ Observable Privacy Behavior Claim
**What is proven without being shown:**
- The visitor proves to the smart contract that they possess a valid, authorized passcode for the active venue (`verifierId`) **without exposing their raw passcode, entropy nonce, or identity on-chain**.
- **Cryptographic Mechanism**:
  1. The visitor's raw secret passcode and entropy nonce are supplied strictly to local witness functions (`secretPasscode()`, `visitorNonce()`).
  2. Inside the ZK circuit (`contracts/counter.compact`), `persistentHash` computes a cryptographic commitment hash:
     ```compact
     const visitorCommitment = persistentHash<Vector<3, Bytes<32>>>([
       pad(32, "vvp:visitor:commitment"),
       passcode,
       nonce
     ]);
     ```
  3. Only the commitment hash and incremented visitor count are disclosed via `disclose()` and written to the public ledger (`lastVisitorCommitment`).
  4. The raw passcode and entropy nonce values never leave the visitor's local device.

---

## 🚀 Key Implementations & Concepts Covered

### 1. Midnight.js SDK & DApp Connector API
- Integrated `@midnight-ntwrk/dapp-connector-api` to interact with browser wallet extensions (`window.midnight.mnLace`).
- Configured network providers for indexing (`https://indexer.preprod.midnight.network`) and proof generation (`http://localhost:6300`).

### 2. Connecting & Disconnecting the Lace Wallet
```typescript
// Wallet Connect & Disconnect Integration (src/integration/contract.ts)
public async connectWallet() {
  if (typeof window !== 'undefined' && (window as any).midnight?.mnLace) {
    const api = await (window as any).midnight.mnLace.enable();
    const state = await api.state();
    return { connected: true, walletAddress: state.address, mode: 'lace' };
  }
  return { connected: true, walletAddress: "mn_preprod1visitor_zk_account", mode: 'local' };
}

public disconnectWallet() {
  this.isConnected = false;
  this.connectedAddress = null;
  return { connected: false };
}
```

### 3. Calling Circuits from the Frontend
- The frontend invokes circuit entrypoints (`verifyVisitor`, `resetVerifier`) defined in compiled bindings (`managed/contract/index.js`).
- Handles progress steps, circuit results, and disclosed commitment hashes in real-time.

### 4. Managing Local Private State
- Private inputs are managed inside client memory (`VisitorPrivateState`) and passed to witness context functions (`getWitnesses()`), insulating user credentials from network leakage.

### 5. Preprod Deployment
- Smart contract compiled using Compact compiler (`compact compile contracts/counter.compact managed`) and deployed to Preprod testnet at address `0x187ab583926a5ff2e4819242a95edc8dfa8ff784`.

---

## What This Does
The **Visitor Verification Platform (VVP)** enables visitors to verify their access authorization for physical or digital venues (e.g. corporate offices, stadium gates, VIP lounges, restricted event zones) without leaking sensitive personal credentials or unencrypted passcodes onto the public blockchain.

---

## Privacy Model Breakdown
- **PUBLIC State (on-chain)**: `visitorCount` (Counter), `verifierId` (Bytes<32>), `lastVisitorCommitment` (Bytes<32>).
- **PRIVATE State (witnesses)**: `secretPasscode()`, `visitorNonce()` (Bytes<32> kept locally on device).
- **PROVED without revealing**: Valid venue authorization without revealing raw passcode or nonce strings.

---

## Tech Stack
- **Network**: Midnight Testnet (Preprod)
- **Smart Contract Language**: Compact (`0.5.1`)
- **Runtime & Toolchain**: Node.js v22 (`v22.23.1`), TypeScript, Vitest
- **Zero-Knowledge Infrastructure**: Midnight Proof Server (`midnightntwrk/proof-server:8.1.0` on port 6300)

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

5. **Start Local Dev Server**:
   ```bash
   npm run dev
   ```

---

## Run Tests
Run the automated test suite:
```bash
npm test
```

Expected Output:
```text
 ✓ tests/counter.test.ts (3 tests) 1ms

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