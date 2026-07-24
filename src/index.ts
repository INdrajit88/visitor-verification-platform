import { VisitorVerificationClient, CONTRACT_ADDRESS } from './integration/contract.js';

document.addEventListener('DOMContentLoaded', () => {
  const client = new VisitorVerificationClient();
  
  const contractAddrEl = document.getElementById('contractAddr');
  const visitorCountEl = document.getElementById('visitorCount');
  const lastCommitmentEl = document.getElementById('lastCommitment');
  const logBoxEl = document.getElementById('logBox');
  const formEl = document.getElementById('verifyForm') as HTMLFormElement;
  const verifierInput = document.getElementById('verifierInput') as HTMLInputElement;
  const passcodeInput = document.getElementById('passcodeInput') as HTMLInputElement;

  if (contractAddrEl) contractAddrEl.textContent = CONTRACT_ADDRESS;

  let count = 0;

  formEl?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const verifier = verifierInput.value;
    const passcode = passcodeInput.value;

    if (logBoxEl) {
      logBoxEl.innerHTML += `<br>> Generating ZK circuit proof for venue: ${verifier}...`;
    }

    client.setVisitorPasscode(passcode);
    const result = await client.verifyCheckIn(verifier);

    count++;
    if (visitorCountEl) visitorCountEl.textContent = count.toString();
    if (lastCommitmentEl) lastCommitmentEl.textContent = result.commitmentHex || '0x...';

    if (logBoxEl) {
      logBoxEl.innerHTML += `<br><span style="color:#10b981;">> [SUCCESS] Disclosed commitment: ${result.commitmentHex}</span>`;
      logBoxEl.scrollTop = logBoxEl.scrollHeight;
    }
  });
});
