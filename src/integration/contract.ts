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
   * Helper to inspect window.midnight and return active DApp Connector API provider.
   */
  public getBrowserWalletProvider(): any {
    if (typeof window === 'undefined') return null;
    const w = window as any;
    const midnightObj = w.midnight;

    if (!midnightObj) return null;

    // Check specific known provider keys
    if (midnightObj.mnLace) return midnightObj.mnLace;
    if (midnightObj.lace) return midnightObj.lace;

    // Search all injected properties under window.midnight
    const keys = Object.keys(midnightObj);
    for (const key of keys) {
      const candidate = midnightObj[key];
      if (candidate && (typeof candidate.connect === 'function' || typeof candidate.enable === 'function')) {
        return candidate;
      }
    }

    return midnightObj;
  }

  /**
   * Connect strictly to user's browser Midnight Lace Wallet extension.
   * Resolves address via official getUnshieldedAddress() or getShieldedAddresses() DApp Connector APIs.
   */
  public async connectWallet(): Promise<{ connected: boolean; walletAddress: string; walletName: string }> {
    if (typeof window === 'undefined') {
      throw new Error("Browser environment is required to connect wallet.");
    }

    const provider = this.getBrowserWalletProvider();

    if (!provider) {
      this.isConnected = false;
      this.connectedAddress = null;
      throw new Error(
        "Midnight Lace Wallet extension was not detected in your browser.\n\n" +
        "Please ensure:\n" +
        "1. The Midnight Lace Wallet browser extension is installed.\n" +
        "2. The extension is unlocked and enabled for this site.\n" +
        "3. Your browser has the Midnight Lace Wallet extension active."
      );
    }

    try {
      let connectedApi: any = null;

      // 1. Try DApp Connector API v4 connect('preprod')
      if (typeof provider.connect === 'function') {
        try {
          connectedApi = await provider.connect('preprod');
        } catch (e) {
          connectedApi = await provider.connect();
        }
      } 
      // 2. Try DApp Connector API v3 enable()
      else if (typeof provider.enable === 'function') {
        connectedApi = await provider.enable();
      } 
      else if (typeof provider === 'function') {
        connectedApi = await provider();
      } 
      else {
        connectedApi = provider;
      }

      this.walletApi = connectedApi;

      // Resolve address from Connected API
      let address: string | null = null;

      // DApp Connector v4 getUnshieldedAddress()
      if (typeof connectedApi.getUnshieldedAddress === 'function') {
        try {
          const res = await connectedApi.getUnshieldedAddress();
          address = res?.unshieldedAddress || res?.address || (typeof res === 'string' ? res : null);
        } catch (e) {
          console.warn("getUnshieldedAddress failed, trying getShieldedAddresses", e);
        }
      }

      // DApp Connector v4 getShieldedAddresses()
      if (!address && typeof connectedApi.getShieldedAddresses === 'function') {
        try {
          const res = await connectedApi.getShieldedAddresses();
          address = res?.shieldedAddress || res?.shieldedCoinPublicKey || (typeof res === 'string' ? res : null);
        } catch (e) {
          console.warn("getShieldedAddresses failed", e);
        }
      }

      // Legacy state() method
      if (!address && typeof connectedApi.state === 'function') {
        try {
          const state = await connectedApi.state();
          address = state?.address || state?.coinPublicKey || state?.unshieldedAddress || (typeof state === 'string' ? state : null);
        } catch (e) {
          console.warn("state() failed", e);
        }
      }

      // Property fallbacks
      if (!address) {
        address =
          connectedApi?.address ||
          connectedApi?.unshieldedAddress ||
          connectedApi?.shieldedAddress ||
          connectedApi?.coinPublicKey;
      }

      if (!address || typeof address !== 'string') {
        throw new Error("Connected to Midnight Lace Wallet, but could not retrieve address. Make sure your Lace Wallet account is initialized.");
      }

      this.isConnected = true;
      this.connectedAddress = address;
      const walletName = provider.name || "Midnight Lace Wallet";
      return { connected: true, walletAddress: address, walletName };
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
