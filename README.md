# Mohd Shahid Portfolio

Personal portfolio for Mohd Shahid, a Computer Vision and Machine Learning Engineer. The site presents production-focused video analytics experience, selected public projects, technical capabilities, and contact details for relevant opportunities.

**Live site:** [msaligs.github.io](https://msaligs.github.io/)

## What the portfolio covers

- Production computer-vision work: YOLO, NVIDIA DeepStream, OpenCV, multi-camera video analytics, OCR, tracking, and real-time event processing.
- Systems work: Apache Kafka, Redis, Docker Compose, Linux, POSIX shared-memory IPC, and Python services.
- Public projects: music genre classification, bank telemarketing prediction, and a full-stack home-services marketplace.

The professional-work section includes only information that is appropriate to make public. The project-notes section provides the design and implementation context that would be too detailed for a one-page résumé.

## Run locally

This is a static site; no package installation or build step is required.

```bash
python3 -m http.server 4173
```

Open [http://localhost:4173](http://localhost:4173).

## Update the résumé

The résumé download is intentionally fixed to one stable path:

```text
assets/resume.pdf
```

To publish a new version, replace that PDF while keeping the filename exactly `resume.pdf`. The website’s download buttons will continue to work without any HTML, CSS, or JavaScript changes.

## Project structure

```text
index.html              Page content and portfolio copy
assets/css/style.css    Responsive visual design
assets/js/main.js       Mobile navigation behaviour
assets/resume.pdf       Downloadable résumé
assets/data/            Supporting portfolio data
```

## Deployment

The repository is deployed as a GitHub Pages site from the `main` branch. After committing and pushing changes, GitHub Pages publishes the updated static files.
