const menuBtn = document.getElementById('menuBtn');
const navLinks = document.getElementById('navLinks');
menuBtn.addEventListener('click', () => navLinks.classList.toggle('open'));

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

const demoData = {
  wisdm: { base: 0.57, sensitivity: 0.045, min: 0.08 },
  motionsense: { base: 0.60, sensitivity: 0.065, min: -0.05 },
  hhar: { base: 0.58, sensitivity: 0.06, min: -0.02 },
  wesad: { base: 0.84, sensitivity: 0.115, min: -0.30 }
};

function updateDemo() {
  const d = demoData[dataset.value];
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

const graphInfo = {
  similarity: {
    all: {
      src: 'images/similarity_loss_all.png',
      title: 'Similarity and Loss Changes',
      caption: 'This graph summarizes original similarity, adversarial similarity, loss before attack, and loss after attack across WISDM, MotionSense, and HHAR activities.'
    }
  },
  pgd: {
    wisdm: { src: 'images/pgd_wisdm.png', title: 'WISDM: PGD Steps vs. Epsilon', caption: 'WISDM shows activity-level variation. Failed attacks often require the full PGD budget, while successful attacks need fewer steps as epsilon increases.' },
    motionsense: { src: 'images/pgd_motionsense.png', title: 'MotionSense: PGD Steps vs. Epsilon', caption: 'MotionSense is sensitive to small positive perturbations. Successful attacks can occur with very few PGD steps.' },
    hhar: { src: 'images/pgd_hhar.png', title: 'HHAR: PGD Steps vs. Epsilon', caption: 'HHAR shows strong sensitivity: after epsilon becomes positive, attacks often succeed with a small number of optimization steps.' },
    wesad: { src: 'images/pgd_wesad.png', title: 'WESAD: PGD Steps vs. Epsilon', caption: 'WESAD stress and non-stress embeddings are highly sensitive, with attacks succeeding quickly for nonzero perturbations.' }
  },
  norm: {
    wisdm: { src: 'images/norm_wisdm.png', title: 'WISDM: L∞ vs. L2 Perturbation Norms', caption: 'The norm plot shows how perturbation magnitude grows with attack strength and how success varies across the embedding space.' },
    motionsense: { src: 'images/norm_motionsense.png', title: 'MotionSense: L∞ vs. L2 Perturbation Norms', caption: 'MotionSense shows a clear relationship between L∞ and L2 norms under successful embedding-level perturbations.' },
    hhar: { src: 'images/norm_hhar.png', title: 'HHAR: L∞ vs. L2 Perturbation Norms', caption: 'HHAR results show that stronger perturbations generally produce more reliable attack success.' },
    wesad: { src: 'images/norm_wesad.png', title: 'WESAD: L∞ vs. L2 Perturbation Norms', caption: 'WESAD has larger L2 ranges, showing high sensitivity in the physiological embedding space.' }
  }
};

const graphOrder = ['similarity', 'pgd', 'norm'];
const datasetOrder = ['wisdm', 'motionsense', 'hhar', 'wesad'];
let activeGraph = 'similarity';
let activeDataset = 'wisdm';

const resultImage = document.getElementById('resultImage');
const resultTitle = document.getElementById('resultTitle');
const resultCaption = document.getElementById('resultCaption');
const chipButtons = document.querySelectorAll('.chip');
const tabButtons = document.querySelectorAll('.tab');
const prevGraph = document.getElementById('prevGraph');
const nextGraph = document.getElementById('nextGraph');

function updateResultGraph() {
  let info;
  if (activeGraph === 'similarity') {
    info = graphInfo.similarity.all;
    tabButtons.forEach(btn => btn.disabled = true);
  } else {
    info = graphInfo[activeGraph][activeDataset];
    tabButtons.forEach(btn => btn.disabled = false);
  }
  resultImage.src = info.src;
  resultImage.alt = info.title;
  resultTitle.textContent = info.title;
  resultCaption.textContent = info.caption;
  chipButtons.forEach(btn => btn.classList.toggle('active', btn.dataset.graph === activeGraph));
  tabButtons.forEach(btn => btn.classList.toggle('active', btn.dataset.dataset === activeDataset));
}

chipButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    activeGraph = btn.dataset.graph;
    updateResultGraph();
  });
});

tabButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    activeDataset = btn.dataset.dataset;
    updateResultGraph();
  });
});

prevGraph.addEventListener('click', () => {
  const index = graphOrder.indexOf(activeGraph);
  activeGraph = graphOrder[(index - 1 + graphOrder.length) % graphOrder.length];
  updateResultGraph();
});

nextGraph.addEventListener('click', () => {
  const index = graphOrder.indexOf(activeGraph);
  activeGraph = graphOrder[(index + 1) % graphOrder.length];
  updateResultGraph();
});

updateResultGraph();

const imageModal = document.getElementById('imageModal');
const modalImage = document.getElementById('modalImage');
const modalClose = document.getElementById('modalClose');
resultImage.addEventListener('click', () => {
  modalImage.src = resultImage.src;
  modalImage.alt = resultImage.alt;
  imageModal.classList.add('open');
  imageModal.setAttribute('aria-hidden', 'false');
});
modalClose.addEventListener('click', closeModal);
imageModal.addEventListener('click', (event) => {
  if (event.target === imageModal) closeModal();
});
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') closeModal();
});
function closeModal() {
  imageModal.classList.remove('open');
  imageModal.setAttribute('aria-hidden', 'true');
}
