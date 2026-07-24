# Visitor Verification Platform (VVP)
> A privacy-preserving zero-knowledge visitor verification system built on the Midnight Network using Compact.

## Contract Address
| Network  | Address                          |
|----------|-----------------------------------|
| Preprod  | `0x187ab583926a5ff2e4819242a95edc8dfa8ff784` |

## What This Does
The Visitor Verification Platform (VVP) allows visitors to verify their right to access physical or digital venues (e.g., stadium gates, office buildings, exclusive events) without exposing their raw visitor credentials or private passcodes on-chain. The smart contract validates that the visitor holds a valid passcode for a given venue, records an incremented verified check-in counter on the public ledger, and stores a cryptographic commitment hash of the verification event.

## Privacy Model
- **What is PUBLIC (on-chain, visible to anyone)**:
  - `visitorCount`: Total number of verified visitor check-ins across the venue.
  - `verifierId`: The active venue or verifier ID hash.
  - `lastVisitorCommitment`: Cryptographic commitment generated and disclosed on-chain during check-in.
- **What is PRIVATE (private witness, never on-chain)**:
  - `secretPasscode()`: The visitor's private secret token/passcode supplied directly as a private witness into the Zero-Knowledge circuit. It is kept locally and never transmitted or recorded on-chain.
- **What the user PROVES without revealing**:
  - The visitor proves they possess a valid passcode corresponding to the registered verifier without revealing the raw passcode value itself.

## Tech Stack
- Midnight network, Compact language (`0.5.1`), Node.js v22 (`v22.23.1`), Docker (Proof Server port 6300).

## Prerequisites
- Node.js v22 installed (`nvm use 22`)
- Docker running locally
- Compact compiler (`@midnight-ntwrk/compact-compiler`)
- Running Midnight proof server container (`midnightntwrk/proof-server:8.1.0` on port 6300)

## Setup
1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd VVP
   ```
2. Switch to Node v22 and install dependencies:
   ```bash
   nvm use 22
   npm install
   ```
3. Ensure the Midnight proof server is running on port 6300:
   ```bash
   docker run -d -p 6300:6300 midnightntwrk/proof-server:8.1.0
   ```
4. Compile the Compact contract:
   ```bash
   compact compile contracts/counter.compact managed
   ```

## Run Tests
Run the automated test suite covering circuit logic, state transitions, and zero-knowledge privacy assertions:
```bash
npm test
```

## Initial Idea
The Visitor Verification Platform (VVP) was conceived to address critical privacy risks in modern physical and digital access management systems. Traditional visitor check-in mechanisms force guests to surrender sensitive personal data (such as government IDs, phone numbers, or unencrypted access codes) to centralized venue databases, exposing visitors to data breaches and unwanted tracking.

VVP leverages Midnight's zero-knowledge smart contract framework (written in Compact) to decouple access verification from identity exposure:
- **Zero-Knowledge Visitor Proofs**: Visitors prove they hold a valid passcode for a target venue directly inside a zero-knowledge circuit without ever writing their secret credential or identity to the public ledger.
- **Verifiable Auditability**: Venues maintain an immutable, on-chain record of total verified check-ins and cryptographic commitment hashes without managing high-risk PII databases.
- **Real-World Applications**: Ideal for corporate office guest check-ins, VIP event access control, restricted facility management, and privacy-first venue ticketing.

## Screenshots
![alt text](<Screenshot 2026-07-25 at 2.44.38 AM.png>)