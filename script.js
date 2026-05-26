const progress = document.getElementById('progress');
const menuBtn = document.getElementById('menuBtn');
const navLinks = document.getElementById('navLinks');

menuBtn.addEventListener('click', () => navLinks.classList.toggle('open'));
navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => navLinks.classList.remove('open')));

window.addEventListener('scroll', () => {
  const scrollTop = window.scrollY;
  const height = document.documentElement.scrollHeight - window.innerHeight;
  progress.style.width = `${(scrollTop / height) * 100}%`;
});

const revealEls = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('visible');
  });
}, { threshold: 0.12 });
revealEls.forEach(el => revealObserver.observe(el));

const demoData = {
  wisdm: { base: 0.57, sensitivity: 0.045, min: 0.08 },
  motionsense: { base: 0.60, sensitivity: 0.065, min: -0.05 },
  hhar: { base: 0.58, sensitivity: 0.060, min: -0.02 },
  wesad: { base: 0.84, sensitivity: 0.115, min: -0.30 }
};

const demoDataset = document.getElementById('demoDataset');
const epsilon = document.getElementById('epsilon');
const epsValue = document.getElementById('epsValue');
const baseSim = document.getElementById('baseSim');
const attackSim = document.getElementById('attackSim');
const attackLoss = document.getElementById('attackLoss');
const simText = document.getElementById('simText');
const lossText = document.getElementById('lossText');
const simMeter = document.getElementById('simMeter');
const lossMeter = document.getElementById('lossMeter');
const advPoint = document.getElementById('advPoint');
const driftArrow = document.getElementById('driftArrow');

function updateDemo() {
  const data = demoData[demoDataset.value];
  const eps = Number(epsilon.value);
  const after = Math.max(data.min, data.base - eps * data.sensitivity);
  const loss = Math.min(1.35, 1 - after);
  const simPct = Math.max(0, Math.min(100, after * 100));
  const lossPct = Math.max(0, Math.min(100, loss * 78));

  epsValue.textContent = eps;
  baseSim.textContent = data.base.toFixed(2);
  attackSim.textContent = after.toFixed(2);
  attackLoss.textContent = loss.toFixed(2);
  simText.textContent = after.toFixed(2);
  lossText.textContent = loss.toFixed(2);
  simMeter.style.width = `${simPct}%`;
  lossMeter.style.width = `${lossPct}%`;

  advPoint.style.left = `${46 + eps * 4.2}%`;
  advPoint.style.top = `${44 + eps * 1.3}%`;
  driftArrow.style.width = `${85 + eps * 18}px`;
  driftArrow.style.transform = `rotate(${14 + eps * 2.2}deg)`;
}

demoDataset.addEventListener('change', updateDemo);
epsilon.addEventListener('input', updateDemo);
updateDemo();

const resultData = {
  wisdm: {
    label: 'WISDM',
    pgd: {
      image: 'images/pgd_wisdm.png',
      title: 'WISDM: PGD Steps vs. Epsilon',
      text: 'WISDM shows activity-level variation. Failed attacks are concentrated at large PGD budgets, while successful attacks require fewer steps as ε increases.'
    },
    norm: {
      image: 'images/norm_wisdm.png',
      title: 'WISDM: L∞ vs. L2 Perturbation Norms',
      text: 'The perturbation norms increase with attack strength. WISDM includes both successful and failed cases, showing more variable robustness across activities.'
    },
    insight: ['Activity-level variation is clear.', 'Downstairs is more vulnerable than Standing and Walking.', 'Larger perturbations improve attack reliability.']
  },
  motionsense: {
    label: 'MotionSense',
    pgd: {
      image: 'images/pgd_motionsense.png',
      title: 'MotionSense: PGD Steps vs. Epsilon',
      text: 'MotionSense is highly sensitive to small positive perturbations. Many attacks succeed with very few PGD steps once ε becomes positive.'
    },
    norm: {
      image: 'images/norm_motionsense.png',
      title: 'MotionSense: L∞ vs. L2 Perturbation Norms',
      text: 'The norm plot shows a clear monotonic growth pattern, indicating that stronger embedding perturbations align with more reliable attack success.'
    },
    insight: ['Small ε values are enough for success.', 'Successful attacks need fewer optimization steps.', 'The dataset is sensitive to embedding-level perturbation.']
  },
  hhar: {
    label: 'HHAR',
    pgd: {
      image: 'images/pgd_hhar.png',
      title: 'HHAR: PGD Steps vs. Epsilon',
      text: 'HHAR shows reliable attack success for positive perturbation values. Failed attacks mainly occur at ε = 0 or negative perturbation settings.'
    },
    norm: {
      image: 'images/norm_hhar.png',
      title: 'HHAR: L∞ vs. L2 Perturbation Norms',
      text: 'HHAR has a strong relationship between perturbation magnitude and success, with successful samples increasing as the norm becomes larger.'
    },
    insight: ['Positive perturbations strongly affect alignment.', 'PGD steps drop after attack success.', 'HHAR confirms cross-device vulnerability.']
  },
  wesad: {
    label: 'WESAD',
    pgd: {
      image: 'images/pgd_wesad.png',
      title: 'WESAD: PGD Steps vs. Epsilon',
      text: 'WESAD stress and non-stress embeddings are highly sensitive. Nearly all nonzero perturbations succeed quickly.'
    },
    norm: {
      image: 'images/norm_wesad.png',
      title: 'WESAD: L∞ vs. L2 Perturbation Norms',
      text: 'WESAD shows larger L2 values and high attack success, suggesting strong sensitivity in the physiological embedding space.'
    },
    insight: ['Stress and non-stress classes are vulnerable.', 'Nonzero perturbations often succeed quickly.', 'Physiological alignment needs stronger defenses.']
  }
};

const summaryGraph = {
  image: 'images/similarity_loss_all.png',
  title: 'Overall Similarity and Loss Changes',
  text: 'Across datasets and activities, the attack reduces adversarial similarity and increases contrastive loss, showing consistent sensor-text misalignment.'
};

let currentDataset = 'wisdm';
let currentGraph = 'pgd';
const datasetOrder = ['wisdm', 'motionsense', 'hhar', 'wesad'];

const tabs = document.querySelectorAll('.tab');
const graphBtns = document.querySelectorAll('.graph-btn');
const resultImage = document.getElementById('resultImage');
const resultTitle = document.getElementById('resultTitle');
const resultText = document.getElementById('resultText');
const resultInsights = document.getElementById('resultInsights');

function setActiveButtons() {
  tabs.forEach(btn => btn.classList.toggle('active', btn.dataset.dataset === currentDataset));
  graphBtns.forEach(btn => btn.classList.toggle('active', btn.dataset.graph === currentGraph));
}

function renderInsights() {
  const insights = resultData[currentDataset].insight;
  resultInsights.innerHTML = `
    <div><strong>Observation</strong><span>${insights[0]}</span></div>
    <div><strong>Effect</strong><span>${insights[1]}</span></div>
    <div><strong>Takeaway</strong><span>${insights[2]}</span></div>
  `;
}

function updateResult() {
  const item = currentGraph === 'summary' ? summaryGraph : resultData[currentDataset][currentGraph];
  resultImage.style.opacity = 0;
  setTimeout(() => {
    resultImage.src = item.image;
    resultImage.alt = item.title;
    resultTitle.textContent = item.title;
    resultText.textContent = item.text;
    resultImage.style.opacity = 1;
  }, 140);
  setActiveButtons();
  renderInsights();
}

tabs.forEach(btn => btn.addEventListener('click', () => {
  currentDataset = btn.dataset.dataset;
  if (currentGraph === 'summary') currentGraph = 'pgd';
  updateResult();
}));

graphBtns.forEach(btn => btn.addEventListener('click', () => {
  currentGraph = btn.dataset.graph;
  updateResult();
}));

document.getElementById('prevResult').addEventListener('click', () => {
  const index = datasetOrder.indexOf(currentDataset);
  currentDataset = datasetOrder[(index - 1 + datasetOrder.length) % datasetOrder.length];
  if (currentGraph === 'summary') currentGraph = 'pgd';
  updateResult();
});

document.getElementById('nextResult').addEventListener('click', () => {
  const index = datasetOrder.indexOf(currentDataset);
  currentDataset = datasetOrder[(index + 1) % datasetOrder.length];
  if (currentGraph === 'summary') currentGraph = 'pgd';
  updateResult();
});

const lightbox = document.getElementById('lightbox');
const lightboxImage = document.getElementById('lightboxImage');
const closeLightbox = document.getElementById('closeLightbox');

resultImage.addEventListener('click', () => {
  lightboxImage.src = resultImage.src;
  lightbox.classList.add('open');
  lightbox.setAttribute('aria-hidden', 'false');
});
closeLightbox.addEventListener('click', () => {
  lightbox.classList.remove('open');
  lightbox.setAttribute('aria-hidden', 'true');
});
lightbox.addEventListener('click', (e) => {
  if (e.target === lightbox) closeLightbox.click();
});

updateResult();
