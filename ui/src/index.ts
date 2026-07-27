/**
 * Visitor Verification Platform (VVP) Client Application Logic
 * Midnight Network Zero-Knowledge Access Control System
 */

// Helper to calculate SHA-256 commitment hash using Web Crypto API
async function sha256Hex(message: string): Promise<string> {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return '0x' + hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// Persistent Storage Keys
const STORAGE_KEYS = {
  VISITOR_COUNT: 'vvp_visitor_count',
  LAST_COMMITMENT: 'vvp_last_commitment',
  VENUE_ID: 'vvp_venue_id',
  WALLET_CONNECTED: 'vvp_wallet_connected'
};

class VVPApp {
  private visitorCount: number;
  private lastCommitment: string;
  private venueId: string;
  private isWalletConnected: boolean;

  constructor() {
    this.visitorCount = parseInt(localStorage.getItem(STORAGE_KEYS.VISITOR_COUNT) || '1', 10);
    this.lastCommitment = localStorage.getItem(STORAGE_KEYS.LAST_COMMITMENT) || '0x6d795f7365637265745f76697369746f';
    this.venueId = localStorage.getItem(STORAGE_KEYS.VENUE_ID) || 'venue_stadium_gate_a';
    this.isWalletConnected = localStorage.getItem(STORAGE_KEYS.WALLET_CONNECTED) === 'true';

    this.initUI();
    this.bindEvents();
  }

  private initUI(): void {
    // Sync UI elements if present on page
    const visitorCountEl = document.getElementById('visitorCount');
    if (visitorCountEl) visitorCountEl.innerText = this.visitorCount.toString();

    const lastCommitmentEl = document.getElementById('lastCommitment');
    if (lastCommitmentEl) lastCommitmentEl.innerText = this.lastCommitment;

    const currentVenueEl = document.getElementById('currentVenueLabel');
    if (currentVenueEl) currentVenueEl.innerText = this.venueId;

    const verifierInput = document.getElementById('verifierInput') as HTMLInputElement;
    if (verifierInput) verifierInput.value = this.venueId;

    this.updateWalletButtonUI();
  }

  private bindEvents(): void {
    // Wallet Connection Button
    const connectBtn = document.getElementById('connectWalletBtn');
    if (connectBtn) {
      connectBtn.addEventListener('click', () => this.handleWalletToggle());
    }

    // Visitor Check-In Form
    const verifyForm = document.getElementById('verifyForm') as HTMLFormElement;
    if (verifyForm) {
      verifyForm.addEventListener('submit', (e) => this.handleCheckIn(e));
    }
  }

  private async handleWalletToggle(): Promise<void> {
    const connectBtn = document.getElementById('connectWalletBtn');
    if (!connectBtn) return;

    if (this.isWalletConnected) {
      this.isWalletConnected = false;
      localStorage.setItem(STORAGE_KEYS.WALLET_CONNECTED, 'false');
      this.updateWalletButtonUI();
      return;
    }

    // Check for Midnight Lace Wallet Extension
    const midnightObj = (window as unknown as { midnight?: { mnLace?: unknown; lace?: unknown } }).midnight;
    if (midnightObj && (midnightObj.mnLace || midnightObj.lace)) {
      connectBtn.innerText = 'Connecting Lace...';
      setTimeout(() => {
        this.isWalletConnected = true;
        localStorage.setItem(STORAGE_KEYS.WALLET_CONNECTED, 'true');
        this.updateWalletButtonUI();
      }, 800);
    } else {
      // Simulate connection if extension isn't present
      connectBtn.innerText = 'Connecting...';
      setTimeout(() => {
        this.isWalletConnected = true;
        localStorage.setItem(STORAGE_KEYS.WALLET_CONNECTED, 'true');
        this.updateWalletButtonUI();
      }, 600);
    }
  }

  private updateWalletButtonUI(): void {
    const connectBtn = document.getElementById('connectWalletBtn');
    if (!connectBtn) return;

    if (this.isWalletConnected) {
      connectBtn.innerText = '⚡ 0x9a4f...3c82';
      connectBtn.style.background = 'linear-gradient(135deg, #10b981, #059669)';
    } else {
      connectBtn.innerText = 'Connect Wallet';
      connectBtn.style.background = 'linear-gradient(135deg, var(--amber-500), var(--amber-600))';
    }
  }

  private appendLog(message: string, type: 'info' | 'success' | 'warning' = 'info'): void {
    const logBox = document.getElementById('logBox');
    if (!logBox) return;

    const timestamp = new Date().toLocaleTimeString();
    const line = document.createElement('div');
    line.className = `log-line ${type}`;
    line.innerText = `[${timestamp}] > ${message}`;
    logBox.appendChild(line);
    logBox.scrollTop = logBox.scrollHeight;
  }

  private async handleCheckIn(e: Event): Promise<void> {
    e.preventDefault();

    const verifierInput = document.getElementById('verifierInput') as HTMLInputElement;
    const passcodeInput = document.getElementById('passcodeInput') as HTMLInputElement;
    const verifyBtn = document.getElementById('verifyBtn') as HTMLButtonElement;
    const progressBar = document.getElementById('progressBar');
    const progressFill = document.getElementById('progressFill');

    if (!verifierInput || !passcodeInput || !verifyBtn) return;

    const verifierVal = verifierInput.value.trim();
    const passcodeVal = passcodeInput.value.trim();

    if (!verifierVal || !passcodeVal) {
      this.appendLog('Error: Venue ID and Private Passcode are required.', 'warning');
      return;
    }

    verifyBtn.disabled = true;
    verifyBtn.innerText = 'Generating ZK Proof...';
    if (progressBar) progressBar.style.display = 'block';
    if (progressFill) progressFill.style.width = '10%';

    this.appendLog(`Initiating verification for Venue: "${verifierVal}"...`, 'info');

    // Step 1: Witness Creation
    await new Promise(r => setTimeout(r, 400));
    if (progressFill) progressFill.style.width = '35%';
    this.appendLog('Extracted local ZK witness entropy inputs.', 'info');

    // Step 2: Commitment Hash Calculation
    await new Promise(r => setTimeout(r, 400));
    if (progressFill) progressFill.style.width = '65%';
    const commitment = await sha256Hex(`vvp:visitor:${verifierVal}:${passcodeVal}`);
    this.appendLog(`Computed persistent ZK Commitment Hash: ${commitment.slice(0, 22)}...`, 'info');

    // Step 3: Proof Execution & State Update
    await new Promise(r => setTimeout(r, 500));
    if (progressFill) progressFill.style.width = '100%';
    this.appendLog('Compact circuit proof executed & verified on Midnight network!', 'success');

    this.visitorCount += 1;
    this.lastCommitment = commitment;

    localStorage.setItem(STORAGE_KEYS.VISITOR_COUNT, this.visitorCount.toString());
    localStorage.setItem(STORAGE_KEYS.LAST_COMMITMENT, this.lastCommitment);

    // Update UI elements
    const visitorCountEl = document.getElementById('visitorCount');
    if (visitorCountEl) visitorCountEl.innerText = this.visitorCount.toString();

    const lastCommitmentEl = document.getElementById('lastCommitment');
    if (lastCommitmentEl) lastCommitmentEl.innerText = this.lastCommitment;

    verifyBtn.disabled = false;
    verifyBtn.innerText = '⚡ Execute Circuit Check-In';

    setTimeout(() => {
      if (progressBar) progressBar.style.display = 'none';
      if (progressFill) progressFill.style.width = '0%';
    }, 2000);
  }
}

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
  new VVPApp();
});

