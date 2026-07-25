import { VisitorVerificationClient, CONTRACT_ADDRESS, getProofServerUrl } from './integration/contract.js';

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
  const proofProviderEl = document.getElementById('proofProviderEl');
  const explorerProofServerEl = document.getElementById('explorerProofServerEl');

  const isLocal = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
  const proofUrl = getProofServerUrl();

  if (contractAddrEl) contractAddrEl.textContent = CONTRACT_ADDRESS;

  if (proofProviderEl) {
    proofProviderEl.textContent = isLocal ? "http://localhost:6300 (Local Docker)" : "Midnight Preprod Cloud ZK Service";
  }
  if (explorerProofServerEl) {
    explorerProofServerEl.textContent = isLocal ? "http://localhost:6300 (Status: ONLINE)" : "Midnight Preprod ZK Infrastructure (ONLINE)";
  }

  let count = 1;
  const status = client.getWalletStatus();
  let walletConnected = status.connected;
  let walletAddress = status.address || '';

  // Sync wallet UI state across pages
  const updateWalletUI = () => {
    if (walletConnected && connectWalletBtn && walletAddress) {
      connectWalletBtn.textContent = `🟢 ${walletAddress.substring(0, 10)}...`;
      connectWalletBtn.style.background = '#10b981';
      connectWalletBtn.title = "Connected to Browser Midnight Lace Wallet (Click to Disconnect)";
    } else if (connectWalletBtn) {
      connectWalletBtn.textContent = 'Connect Wallet';
      connectWalletBtn.style.background = 'linear-gradient(135deg, var(--amber-500), var(--amber-600))';
      connectWalletBtn.title = "Connect Midnight Lace Wallet";
    }
  };

  updateWalletUI();

  connectWalletBtn?.addEventListener('click', async () => {
    if (!walletConnected) {
      if (logBoxEl) {
        logBoxEl.innerHTML += `<div class="log-line info">> Requesting connection to browser Midnight Lace Wallet extension...</div>`;
      }
      try {
        const res = await client.connectWallet();
        walletConnected = true;
        walletAddress = res.walletAddress;
        updateWalletUI();

        if (logBoxEl) {
          logBoxEl.innerHTML += `<div class="log-line success">> [BROWSER WALLET CONNECTED] Address: ${res.walletAddress}</div>`;
          logBoxEl.innerHTML += `<div class="log-line info">> [FAUCET LINK] Need test tokens? Visit <a href="https://faucet.preprod.midnight.network" target="_blank" style="color:var(--amber-600); text-decoration:underline;">Midnight Preprod Faucet</a></div>`;
          logBoxEl.scrollTop = logBoxEl.scrollHeight;
        }
      } catch (err: any) {
        walletConnected = false;
        walletAddress = '';
        updateWalletUI();

        const errorMsg = err?.message || "Failed to connect to Midnight Lace Wallet extension.";
        alert(`Wallet Connection Error:\n\n${errorMsg}`);

        if (logBoxEl) {
          logBoxEl.innerHTML += `<div class="log-line" style="color:#ef4444;">> [ERROR] ${errorMsg}</div>`;
          logBoxEl.scrollTop = logBoxEl.scrollHeight;
        }
      }
    } else {
      client.disconnectWallet();
      walletConnected = false;
      walletAddress = '';
      updateWalletUI();

      if (logBoxEl) {
        logBoxEl.innerHTML += `<div class="log-line info">> Wallet disconnected from browser session.</div>`;
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
      logBoxEl.innerHTML += `<div class="log-line info">> [STEP 1/4] Constructing private witnesses secretPasscode() & visitorNonce()...</div>`;
      logBoxEl.innerHTML += `<div class="log-line info">> [STEP 2/4] Midnight Proof Server executing Compact ZK circuit (${isLocal ? 'port 6300' : 'Preprod Remote'})...</div>`;
      logBoxEl.scrollTop = logBoxEl.scrollHeight;
    }

    client.setVisitorPasscode(passcode);

    setTimeout(async () => {
      if (progressFill) progressFill.style.width = '65%';

      try {
        const result = await client.verifyCheckIn(verifier);

        // Update wallet state if auto-connected
        walletConnected = true;
        walletAddress = result.signedBy || walletAddress;
        updateWalletUI();

        setTimeout(() => {
          if (progressFill) progressFill.style.width = '100%';

          count++;
          if (visitorCountEl) visitorCountEl.textContent = count.toString();
          if (heroVisitorCountEl) heroVisitorCountEl.textContent = count.toString();
          if (lastCommitmentEl) lastCommitmentEl.textContent = result.commitmentHex || '0x...';

          if (logBoxEl) {
            logBoxEl.innerHTML += `<div class="log-line info">> [STEP 3/4] Signed by Lace Wallet: ${result.signedBy} | Fee: ${result.txFee} ${result.txFeeAsset}</div>`;
            logBoxEl.innerHTML += `<div class="log-line success">> [STEP 4/4] Proof Verified & Submitted! On-Chain Commitment: ${result.commitmentHex} | TxHash: ${result.txHash}</div>`;
            logBoxEl.scrollTop = logBoxEl.scrollHeight;
          }

          setTimeout(() => {
            if (progressBar) progressBar.style.display = 'none';
            if (progressFill) progressFill.style.width = '0%';
          }, 800);

        }, 400);
      } catch (err: any) {
        if (progressBar) progressBar.style.display = 'none';
        alert(`Check-in Error: ${err?.message}`);
        if (logBoxEl) {
          logBoxEl.innerHTML += `<div class="log-line" style="color:#ef4444;">> [ERROR] ${err?.message}</div>`;
        }
      }
    }, 400);
  });
});
