# Visitor Verification Platform (VVP)
> A privacy-preserving zero-knowledge visitor verification platform built on the Midnight Network using Compact smart contracts.

[![Live Demo](https://img.shields.io/badge/Live_Demo-Vercel_Deployed-000000?style=flat-square&logo=vercel)](https://visitor-verification-platform.vercel.app/)
[![Demo Video](https://img.shields.io/badge/YouTube-Demo_Video-FF0000?style=flat-square&logo=youtube)](https://youtu.be/rCD3mMkdK7A)
[![CI/CD Pipeline](https://github.com/INdrajit88/visitor-verification-platform/actions/workflows/ci.yml/badge.svg)](https://github.com/INdrajit88/visitor-verification-platform/actions/workflows/ci.yml)
[![Midnight Preprod](https://img.shields.io/badge/Network-Midnight_Preprod-8b5cf6?style=flat-square)](https://explorer.preprod.midnight.network)
[![Compact Language](https://img.shields.io/badge/Compact-v0.5.1-06b6d4?style=flat-square)](https://midnight.network)
[![Node.js Version](https://img.shields.io/badge/Node.js-v22.23.1-10b981?style=flat-square)](https://nodejs.org)
[![License](https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square)](LICENSE)

---

## 🚀 Live Demo, Video & Repository
- 🌐 **Live Web Application**: [https://visitor-verification-platform.vercel.app/](https://visitor-verification-platform.vercel.app/)
- 📺 **YouTube Demo Video**: [https://youtu.be/rCD3mMkdK7A](https://youtu.be/rCD3mMkdK7A)
- 📦 **GitHub Repository**: [https://github.com/INdrajit88/visitor-verification-platform](https://github.com/INdrajit88/visitor-verification-platform)
- ⚙️ **CI/CD Workflow**: [.github/workflows/ci.yml](.github/workflows/ci.yml)

---

## 📋 Challenge Requirements & Passing Checklist
- [x] **Fully Functional Privacy dApp**: Meaningful use of Midnight's Zero-Knowledge privacy model
- [x] **Live Demo Deployment**: [https://visitor-verification-platform.vercel.app/](https://visitor-verification-platform.vercel.app/)
- [x] **Demo Video (Lace Wallet + ZK Circuit Call)**: [https://youtu.be/rCD3mMkdK7A](https://youtu.be/rCD3mMkdK7A)
- [x] **Passing Test Suite**: 4/4 Vitest unit tests passing (`npm test`)
- [x] **CI/CD Pipeline Running**: GitHub Actions workflow running automated build & tests (`.github/workflows/ci.yml`)
- [x] **Public GitHub Repository**: [https://github.com/INdrajit88/visitor-verification-platform](https://github.com/INdrajit88/visitor-verification-platform)
- [x] **Deployed Smart Contract**: `0x187ab583926a5ff2e4819242a95edc8dfa8ff784`
- [x] **On-Chain Explorer Verification**: [Verify Contract on Midnight Preprod Explorer](https://explorer.preprod.midnight.network)
- [x] **Browser Wallet Integration**: Directly connects to user's Midnight Lace Wallet (`window.midnight.mnLace` / `window.midnight.lace`)
- [x] **Lace Wallet Connect / Disconnect Lifecycle**: Full session management with event prompts and error handling
- [x] **16+ Meaningful Commits**: Verified structured commit history in main branch

---

## 🛡️ Midnight Privacy Model: What an Observer Learns vs Cannot Learn

### ❌ What an Observer CANNOT Learn (Kept Strictly Private):
1. **Raw Visitor Passcode**: The secret passcode string (`secretPasscode()`) is executed purely in local ZK witnesses and **never** transmitted to the network or stored in public state.
2. **Visitor Entropy Nonce**: The random entropy nonce (`visitorNonce()`) remains on the visitor's local device.
3. **Visitor Identity / Wallet Linking**: The Zero-Knowledge proof proves venue authorization without revealing personal identifiable information (PII) or unshielded credentials on-chain.
4. **Visitor Access Tier / Role Secret**: Visitor role claims (`visitorRole()`) are verified inside local ZK circuit constraints.

### ✅ What an Observer CAN Learn (Disclosed On-Chain Public State):
1. **Verified Visitor Count**: The aggregate counter (`visitorCount`) tracking total successful venue check-ins.
2. **Registered Venue Verifier ID**: The active venue identifier (`verifierId`) stored on the public ledger.
3. **Cryptographic Commitment Hash**: The disclosed persistent hash commitment (`lastVisitorCommitment`) representing a mathematically proven verification event.

---

## 🛠️ Contract & Live Deployment Details
| Environment | Location / Address | Verification / Explorer Link |
|---|---|---|
| **Live Web App** | `https://visitor-verification-platform.vercel.app/` | [Open Live App](https://visitor-verification-platform.vercel.app/) |
| **Demo Video** | `https://youtu.be/rCD3mMkdK7A` | [Watch Video Demo](https://youtu.be/rCD3mMkdK7A) |
| **Preprod Smart Contract** | `0x187ab583926a5ff2e4819242a95edc8dfa8ff784` | [Verify Contract on Midnight Preprod Explorer](https://explorer.preprod.midnight.network) |
| **CI/CD Workflow** | `.github/workflows/ci.yml` | [View GitHub Actions Run](https://github.com/INdrajit88/visitor-verification-platform/actions) |

---

## 🔑 Browser Wallet Connector (`window.midnight.mnLace`)
```typescript
// Connect directly to user's browser Midnight Lace Wallet extension
public async connectWallet(): Promise<{ connected: boolean; walletAddress: string; walletName: string }> {
  const provider = this.getBrowserWalletProvider();
  if (!provider) {
    throw new Error("Midnight Lace Wallet extension not detected. Please install and enable the extension.");
  }
  const connectedApi = await provider.connect('preprod');
  const address = await connectedApi.getUnshieldedAddress();
  return { connected: true, walletAddress: address.unshieldedAddress, walletName: provider.name };
}
```

---

## 🚀 Quickstart & Local Installation

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

5. **Start Development Server**:
   ```bash
   npm run dev
   ```

---

## 🧪 Automated Test Suite
Run the unit test suite:
```bash
npm test
```

Expected Output:
```text
 ✓ tests/counter.test.ts (4 tests) 1ms

 Test Files  1 passed (1)
      Tests  4 passed (4)
```

---

## 📸 Platform Screenshots

### Visitor Verification Portal
![Visitor Verification Portal](image.png)

### ZK Proof Generation & Activity Log
![ZK Proof Generation](image-1.png)

### Multi-Page Dashboard & Explorer State
![Multi-Page Dashboard](screenshot.png)