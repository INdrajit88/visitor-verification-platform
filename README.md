# Visitor Verification Platform (VVP)
> A privacy-preserving zero-knowledge visitor verification platform built on the Midnight Network using Compact smart contracts.

[![Live Demo](https://img.shields.io/badge/Live_Demo-Vercel_Deployed-000000?style=flat-square&logo=vercel)](https://visitor-verification-platform.vercel.app/)
[![Midnight Preprod](https://img.shields.io/badge/Network-Midnight_Preprod-8b5cf6?style=flat-square)](https://explorer.preprod.midnight.network)
[![Compact Language](https://img.shields.io/badge/Compact-v0.5.1-06b6d4?style=flat-square)](https://midnight.network)
[![Node.js Version](https://img.shields.io/badge/Node.js-v22.23.1-10b981?style=flat-square)](https://nodejs.org)
[![License](https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square)](LICENSE)

---

## 🚀 Live Demo & Repository
- 🌐 **Live Web Application**: [https://visitor-verification-platform.vercel.app/](https://visitor-verification-platform.vercel.app/)
- 📦 **GitHub Repository**: [https://github.com/INdrajit88/visitor-verification-platform](https://github.com/INdrajit88/visitor-verification-platform)

---

## 📋 Platform Capability Checklist
- [x] **Live Demo Deployment**: [https://visitor-verification-platform.vercel.app/](https://visitor-verification-platform.vercel.app/)
- [x] **Public GitHub Repository**: [https://github.com/INdrajit88/visitor-verification-platform](https://github.com/INdrajit88/visitor-verification-platform)
- [x] **Deployed Smart Contract**: `0x187ab583926a5ff2e4819242a95edc8dfa8ff784`
- [x] **On-Chain Explorer Verification**: [Verify Contract on Midnight Preprod Explorer](https://explorer.preprod.midnight.network)
- [x] **Browser Wallet Integration**: Directly connects to user's Midnight Lace Wallet (`window.midnight.mnLace` / `window.midnight.lace`)
- [x] **Lace Wallet Connect / Disconnect Lifecycle**: Full session management with event prompts and error handling
- [x] **Zero-Knowledge Circuit Execution**: Executed via `verifyVisitor()` circuit integration in `src/integration/contract.ts`
- [x] **Dual Private Witness Architecture**: Passcode and entropy nonce witnesses processed in local proof server
- [x] **Observable Privacy Guarantee**: Credentials verified in zero-knowledge without on-chain disclosure of raw passcodes
- [x] **Multi-Page Production Web Application**: Modular multi-page UI with dot matrix background styling

---

## Contract & Live Deployment Details
| Environment | Location / Address | Verification / Explorer Link |
|---|---|---|
| **Live Web App** | `https://visitor-verification-platform.vercel.app/` | [Open Live App](https://visitor-verification-platform.vercel.app/) |
| **Preprod Smart Contract** | `0x187ab583926a5ff2e4819242a95edc8dfa8ff784` | [Verify Contract on Midnight Preprod Explorer](https://explorer.preprod.midnight.network) |

> [!NOTE]
> Deployed contract `0x187ab583926a5ff2e4819242a95edc8dfa8ff784` is live on Midnight Preprod Testnet and connected to the Midnight ZK Proof Service infrastructure.

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

## 🛡️ Observable Privacy Guarantee
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
  4. Raw passcode strings and entropy nonces never leave the visitor's local browser environment.

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

## Automated Test Suite
Run the unit test suite:
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

## 📸 Platform Screenshots

### Visitor Verification Portal
![Visitor Verification Portal](image.png)

### ZK Proof Generation & Activity Log
![ZK Proof Generation](image-1.png)

### Multi-Page Dashboard & Explorer State
![Multi-Page Dashboard](screenshot.png)