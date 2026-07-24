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

  if (contractAddrEl) contractAddrEl.textContent = CONTRACT_ADDRESS;

  let count = 1;

  formEl?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const verifier = verifierInput.value;
    const passcode = passcodeInput.value;

    if (progressBar && progressFill) {
      progressBar.style.display = 'block';
      progressFill.style.width = '20%';
    }

    if (logBoxEl) {
      logBoxEl.innerHTML += `<div class="log-line info">> [CIRCUIT EXECUTION] Constructing ZK witness for venue: ${verifier}...</div>`;
    }

    client.setVisitorPasscode(passcode);

    setTimeout(async () => {
      if (progressFill) progressFill.style.width = '70%';

      const result = await client.verifyCheckIn(verifier);

      setTimeout(() => {
        if (progressFill) progressFill.style.width = '100%';

        count++;
        if (visitorCountEl) visitorCountEl.textContent = count.toString();
        if (heroVisitorCountEl) heroVisitorCountEl.textContent = count.toString();
        if (lastCommitmentEl) lastCommitmentEl.textContent = result.commitmentHex || '0x...';

        if (logBoxEl) {
          logBoxEl.innerHTML += `<div class="log-line success">> [DISCLOSED COMMITMENT] Verified on-chain: ${result.commitmentHex}</div>`;
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
