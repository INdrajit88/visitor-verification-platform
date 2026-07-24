import { VisitorVerificationClient, CONTRACT_ADDRESS } from './integration/contract.js';

document.addEventListener('DOMContentLoaded', () => {
  const client = new VisitorVerificationClient();
  
  const contractAddrEl = document.getElementById('contractAddr');
  const visitorCountEl = document.getElementById('visitorCount');
  const heroVisitorCountEl = document.getElementById('heroVisitorCount');
  const lastCommitmentEl = document.getElementById('lastCommitment');
  const logBoxEl = document.getElementById('logBox');
  const formEl = document.getElementById('verifyForm') as HTMLFormElement;
  const verifierInput = document.getElementById('verifierInput') as HTMLInputElement;
  const passcodeInput = document.getElementById('passcodeInput') as HTMLInputElement;
  const progressBar = document.getElementById('progressBar');
  const progressFill = document.getElementById('progressFill');
  const connectWalletBtn = document.getElementById('connectWalletBtn');

  if (contractAddrEl) contractAddrEl.textContent = CONTRACT_ADDRESS;

  let count = 1;
  let walletConnected = sessionStorage.getItem('vvp_wallet_connected') === 'true';
  let walletAddress = sessionStorage.getItem('vvp_wallet_address') || '';

  // Restore wallet UI state if already connected
  if (walletConnected && connectWalletBtn && walletAddress) {
    connectWalletBtn.textContent = `🟢 ${walletAddress.substring(0, 10)}...`;
    connectWalletBtn.style.background = '#10b981';
    connectWalletBtn.title = "Connected via Midnight DApp Connector API (Click to Disconnect)";
  }

  connectWalletBtn?.addEventListener('click', async () => {
    if (!walletConnected) {
      if (logBoxEl) {
        logBoxEl.innerHTML += `<div class="log-line info">> Requesting Midnight Lace Wallet connection...</div>`;
      }
      const res = await client.connectWallet();
      walletConnected = true;
      walletAddress = res.walletAddress;
      
      sessionStorage.setItem('vvp_wallet_connected', 'true');
      sessionStorage.setItem('vvp_wallet_address', res.walletAddress);

      if (connectWalletBtn) {
        connectWalletBtn.textContent = `🟢 ${res.walletAddress.substring(0, 10)}...`;
        connectWalletBtn.style.background = '#10b981';
        connectWalletBtn.title = "Connected via Midnight DApp Connector API (Click to Disconnect)";
      }
      if (logBoxEl) {
        logBoxEl.innerHTML += `<div class="log-line success">> [WALLET CONNECTED] Address: ${res.walletAddress} (${res.mode.toUpperCase()})</div>`;
        logBoxEl.scrollTop = logBoxEl.scrollHeight;
      }
    } else {
      client.disconnectWallet();
      walletConnected = false;
      walletAddress = '';

      sessionStorage.removeItem('vvp_wallet_connected');
      sessionStorage.removeItem('vvp_wallet_address');

      if (connectWalletBtn) {
        connectWalletBtn.textContent = 'Connect Wallet';
        connectWalletBtn.style.background = 'linear-gradient(135deg, var(--amber-500), var(--amber-600))';
        connectWalletBtn.title = "Connect Midnight Lace Wallet";
      }
      if (logBoxEl) {
        logBoxEl.innerHTML += `<div class="log-line info">> Wallet disconnected successfully.</div>`;
        logBoxEl.scrollTop = logBoxEl.scrollHeight;
      }
    }
  });

  formEl?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const verifier = verifierInput.value;
    const passcode = passcodeInput.value;

    if (!passcode || passcode.trim().length === 0) {
      alert("Please enter a private passcode to generate ZK witness!");
      return;
    }

    if (progressBar && progressFill) {
      progressBar.style.display = 'block';
      progressFill.style.width = '15%';
    }

    if (logBoxEl) {
      logBoxEl.innerHTML += `<div class="log-line info">> [STEP 1/3] Constructing private witness secretPasscode()...</div>`;
      logBoxEl.innerHTML += `<div class="log-line info">> [STEP 2/3] Midnight Proof Server executing Compact ZK circuit (port 6300)...</div>`;
      logBoxEl.scrollTop = logBoxEl.scrollHeight;
    }

    client.setVisitorPasscode(passcode);

    setTimeout(async () => {
      if (progressFill) progressFill.style.width = '65%';

      const result = await client.verifyCheckIn(verifier);

      setTimeout(() => {
        if (progressFill) progressFill.style.width = '100%';

        count++;
        if (visitorCountEl) visitorCountEl.textContent = count.toString();
        if (heroVisitorCountEl) heroVisitorCountEl.textContent = count.toString();
        if (lastCommitmentEl) lastCommitmentEl.textContent = result.commitmentHex || '0x...';

        if (logBoxEl) {
          logBoxEl.innerHTML += `<div class="log-line success">> [STEP 3/3] Proof Verified! Disclosed Commitment On-Chain: ${result.commitmentHex}</div>`;
          logBoxEl.scrollTop = logBoxEl.scrollHeight;
        }

        setTimeout(() => {
          if (progressBar) progressBar.style.display = 'none';
          if (progressFill) progressFill.style.width = '0%';
        }, 800);

      }, 400);
    }, 400);
  });
});
