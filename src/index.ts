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
  let walletConnected = false;

  connectWalletBtn?.addEventListener('click', async () => {
    if (!walletConnected) {
      if (logBoxEl) {
        logBoxEl.innerHTML += `<div class="log-line info">> Requesting Midnight Wallet approval...</div>`;
      }
      const res = await client.connectWallet();
      walletConnected = true;
      if (connectWalletBtn) {
        connectWalletBtn.textContent = `${res.walletAddress.substring(0, 10)}...`;
        connectWalletBtn.style.background = '#10b981';
      }
      if (logBoxEl) {
        logBoxEl.innerHTML += `<div class="log-line success">> [WALLET CONNECTED] Verified Address: ${res.walletAddress} (Mode: ${res.mode.toUpperCase()})</div>`;
        logBoxEl.scrollTop = logBoxEl.scrollHeight;
      }
    } else {
      walletConnected = false;
      if (connectWalletBtn) {
        connectWalletBtn.textContent = 'Connect Wallet';
        connectWalletBtn.style.background = 'linear-gradient(135deg, var(--amber-500), var(--amber-600))';
      }
      if (logBoxEl) {
        logBoxEl.innerHTML += `<div class="log-line info">> Wallet disconnected.</div>`;
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
      logBoxEl.innerHTML += `<div class="log-line info">> [STEP 2/3] Proof Server generating ZK Circuit proof (port 6300)...</div>`;
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
