const dataset = document.getElementById('dataset');
const epsilon = document.getElementById('epsilon');
const epsValue = document.getElementById('epsValue');
const originalSim = document.getElementById('originalSim');
const advSim = document.getElementById('advSim');
const loss = document.getElementById('loss');
const simLabel = document.getElementById('simLabel');
const lossLabel = document.getElementById('lossLabel');
const simFill = document.getElementById('simFill');
const lossFill = document.getElementById('lossFill');
const advDot = document.getElementById('advDot');
const driftLine = document.getElementById('driftLine');

const data = {
  wisdm: { base: 0.57, sensitivity: 0.045, min: 0.08 },
  motionsense: { base: 0.60, sensitivity: 0.065, min: -0.05 },
  hhar: { base: 0.58, sensitivity: 0.06, min: -0.02 },
  wesad: { base: 0.84, sensitivity: 0.115, min: -0.30 }
};

function updateDemo() {
  const d = data[dataset.value];
  const eps = Number(epsilon.value);
  const after = Math.max(d.min, d.base - eps * d.sensitivity);
  const attackLoss = Math.min(1.35, 1 - after);
  const simPct = Math.max(0, Math.min(100, after * 100));
  const lossPct = Math.max(0, Math.min(100, attackLoss * 80));
  const x = 44 + eps * 4.2;
  const y = 42 + eps * 1.3;

  epsValue.textContent = eps;
  originalSim.textContent = d.base.toFixed(2);
  advSim.textContent = after.toFixed(2);
  loss.textContent = attackLoss.toFixed(2);
  simLabel.textContent = after.toFixed(2);
  lossLabel.textContent = attackLoss.toFixed(2);
  simFill.style.width = simPct + '%';
  lossFill.style.width = lossPct + '%';
  advDot.style.left = x + '%';
  advDot.style.top = y + '%';
  driftLine.style.width = (95 + eps * 18) + 'px';
}

dataset.addEventListener('change', updateDemo);
epsilon.addEventListener('input', updateDemo);
updateDemo();
