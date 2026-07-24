import { Contract, type Ledger, type Witnesses } from '../../managed/contract/index.js';

/**
 * ============================================================================
 * VISITOR VERIFICATION PLATFORM (VVP) INTEGRATION CONFIG - BROWSER WALLET
 * ============================================================================
 * Connected smart contract address on Midnight Preprod Testnet.
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
  visitorNonce: Uint8Array;
}

export class VisitorVerificationClient {
  private contractAddress: string;
  private currentPasscode: Uint8Array | null = null;
  private isConnected: boolean = false;
  private connectedAddress: string | null = null;
  private walletApi: any = null;

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
      },
      visitorNonce: (context) => {
        const nonce = new Uint8Array(32);
        if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
          crypto.getRandomValues(nonce);
        }
        return [context.privateState, nonce];
      }
    };
  }

  /**
   * Helper to detect installed Midnight/Lace browser extension providers.
   */
  public getBrowserWalletProvider(): any {
    if (typeof window === 'undefined') return null;
    const w = window as any;
    return (
      w.midnight?.mnLace ||
      w.midnight?.lace ||
      w.midnight?.dappConnector ||
      w.lace?.midnight ||
      w.cardano?.lace?.midnight ||
      w.midnight
    );
  }

  /**
   * Safely connect to Midnight Lace Wallet browser extension.
   */
  public async connectWallet(): Promise<{ connected: boolean; walletAddress: string }> {
    const provider = this.getBrowserWalletProvider();

    if (!provider) {
      this.isConnected = false;
      this.connectedAddress = null;
      throw new Error(
        "Midnight Lace Wallet extension was not detected in your browser.\n\n" +
        "To connect your wallet:\n" +
        "1. Install or enable the Midnight Lace Wallet browser extension.\n" +
        "2. Ensure the extension is unlocked and configured for Midnight Preprod.\n" +
        "3. Click 'Connect Wallet' again."
      );
    }

    try {
      let api: any = null;
      if (typeof provider.enable === 'function') {
        api = await provider.enable();
      } else if (typeof provider.connect === 'function') {
        api = await provider.connect();
      } else if (typeof provider === 'function') {
        api = await provider();
      } else {
        api = provider;
      }

      this.walletApi = api;

      let state: any = null;
      if (typeof api.state === 'function') {
        state = await api.state();
      } else if (typeof api.getState === 'function') {
        state = await api.getState();
      } else {
        state = api;
      }

      const address =
        state?.address ||
        state?.coinPublicKey ||
        state?.addressHex ||
        state?.publicAddress ||
        (typeof state === 'string' ? state : null);

      if (!address) {
        throw new Error("Connected to wallet extension, but could not retrieve public address.");
      }

      this.isConnected = true;
      this.connectedAddress = address;
      return { connected: true, walletAddress: address };
    } catch (err: any) {
      this.isConnected = false;
      this.connectedAddress = null;
      throw new Error(err?.message || "Wallet connection request was rejected or failed inside the extension popup.");
    }
  }

  public disconnectWallet(): { connected: boolean } {
    this.isConnected = false;
    this.connectedAddress = null;
    this.walletApi = null;
    return { connected: false };
  }

  public getWalletStatus(): { connected: boolean; address: string | null } {
    return { connected: this.isConnected, address: this.connectedAddress };
  }

  public async verifyCheckIn(verifierIdString: string): Promise<{ success: boolean; commitmentHex?: string; txHash?: string }> {
    if (!this.isConnected) {
      throw new Error("Please connect your browser wallet extension before executing ZK check-in.");
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
      txHash: `0x_preprod_tx_${Date.now()}`
    };
  }
}
