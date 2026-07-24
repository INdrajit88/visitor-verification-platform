import { Contract, type Ledger, type Witnesses } from '../../managed/contract/index.js';

/**
 * ============================================================================
 * VISITOR VERIFICATION PLATFORM (VVP) INTEGRATION CONFIG
 * ============================================================================
 * The deployed smart contract address placeholder.
 * In Step 7, after manual deployment to Preprod, this placeholder will be
 * backfilled with the actual deployed contract address string.
 */
export const CONTRACT_ADDRESS = "0x187ab583926a5ff2e4819242a95edc8dfa8ff784";

export const NETWORK_CONFIG = {
  networkId: "preprod",
  indexerUrl: "https://indexer.preprod.midnight.network",
  proofServerUrl: "http://localhost:6300",
  nodeUrl: "https://rpc.preprod.midnight.network"
};

export interface VisitorPrivateState {
  secretPasscode: Uint8Array;
}

export class VisitorVerificationClient {
  private contractAddress: string;
  private currentPasscode: Uint8Array | null = null;

  constructor(address: string = CONTRACT_ADDRESS) {
    this.contractAddress = address;
  }

  public setVisitorPasscode(passcode: string): void {
    const encoder = new TextEncoder();
    const bytes = new Uint8Array(32);
    const encoded = encoder.encode(passcode);
    bytes.set(encoded.subarray(0, 32));
    this.currentPasscode = bytes;
  }

  public getWitnesses(): Witnesses<VisitorPrivateState> {
    return {
      secretPasscode: (context) => {
        const passcode = this.currentPasscode || new Uint8Array(32);
        return [context.privateState, passcode];
      }
    };
  }

  public async connectWallet(): Promise<{ connected: boolean; walletAddress?: string }> {
    if (typeof window !== 'undefined' && (window as any).midnight?.mnLace) {
      const api = await (window as any).midnight.mnLace.enable();
      const state = await api.state();
      return { connected: true, walletAddress: state.address };
    }
    // Simulation / fallback mode for local testing
    return { connected: true, walletAddress: "mn_preprod_visitor_demo_wallet_address" };
  }

  public async verifyCheckIn(verifierIdString: string): Promise<{ success: boolean; commitmentHex?: string; txHash?: string }> {
    if (this.contractAddress === "TBD") {
      console.warn("Contract address is set to placeholder 'TBD'. Please deploy the contract in Step 7 to receive a live address.");
    }

    const verifierIdBytes = new Uint8Array(32);
    const encoded = new TextEncoder().encode(verifierIdString);
    verifierIdBytes.set(encoded.subarray(0, 32));

    const passcode = this.currentPasscode || new Uint8Array(32);
    const commitmentHex = Array.from(passcode)
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');

    return {
      success: true,
      commitmentHex: `0x${commitmentHex.substring(0, 32)}`,
      txHash: `0x_mock_tx_${Date.now()}`
    };
  }
}
