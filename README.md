# Breaking Sensor-Text Alignment Demo Website

Demo website for the CVPR 2026 paper:

**Breaking Sensor-Text Alignment: Cross-Modal Attack on Contrastive Multimodal Human Activity Recognition**

Website link:

https://malithi-gif.github.io/breaking-sensor-text/

## Overview

This website visualizes a cross-modal embedding poisoning attack on contrastive multimodal human activity recognition. It explains the difference between traditional HAR and contrastive sensor-text HAR, shows how sensor-text misalignment happens, and provides interactive result graphs.

## Website Features

- Introduction section with live website link
- Concept section for traditional HAR vs contrastive HAR
- Concept section for sensor-text misalignment attack
- Interactive epsilon perturbation demo
- Interactive result graph viewer
- Dataset tabs for WISDM, MotionSense, HHAR, and WESAD
- Graph type controls for PGD steps and L∞/L2 norm plots
- Click-to-enlarge graph preview

## Files

- `index.html` — main website page
- `style.css` — website design and animations
- `script.js` — interactive controls and graph viewer
- `images/` — architecture diagrams and result graphs

## GitHub Pages

Upload all files directly to the repository root. The repository should look like this:

```text
breaking-sensor-text/
├── index.html
├── style.css
├── script.js
├── README.md
└── images/
```

Then enable GitHub Pages:

```text
Settings → Pages → Deploy from a branch → main → /root → Save
```
