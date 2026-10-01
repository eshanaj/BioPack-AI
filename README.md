# BioPack AI – Evidence-Grounded Food Packaging Intelligence

> **Make Better Packaging Decisions with Food Science.**

BioPack AI is a decision-support system that helps food businesses identify suitable packaging materials based on their product properties and storage conditions. Instead of relying entirely on packaging expert guesswork, the system evaluates factors such as **moisture, temperature, humidity, shelf-life requirements, oxygen sensitivity, and product characteristics** to generate practical packaging recommendations.

Built with a modern **React and TypeScript frontend**, BioPack AI combines food-science calculations, packaging-material data, hard-constraint screening, and **TOPSIS multi-criteria ranking** to recommend suitable packaging materials. For fresh produce, it additionally applies **Q10-based respiration kinetics and Modified Atmosphere Packaging (MAP) calculations** to estimate packaging and gas requirements.

## Live Demo

**Frontend (Vercel):** [https://bio-pack-ai-sigma.vercel.app/](https://bio-pack-ai-sigma.vercel.app/)

## Features

- Fresh Produce and Processed Food analysis modes
- Select from pre-loaded commodities or enter a custom product
- Product-specific packaging requirement calculation
- Q10-based respiration adjustment for fresh produce
- OTR and WVTR requirement estimation
- Packaging material screening using scientific constraints
- TOPSIS-based multi-criteria material ranking
- Budget, balanced, barrier, and sustainability priorities
- Ranked packaging recommendations with plain-language explanations
- Cost-tiered material alternatives
- Eco-friendly alternatives with shelf-life trade-offs
- Modified Atmosphere Packaging (MAP) gas calculations
- Equilibrium O₂ and CO₂ estimation for applicable fresh produce
- Chilling-injury warnings where applicable
- What-if analysis for changing storage conditions
- Packaging material comparison
- Packaging benchmarking
- Packaging specification generation
- Validation and testing recommendations
- Evidence and audit-trail generation
- Scientific source and evidence tracking
- English, Hindi, and Marathi language support
- Browser-based voice/read-aloud assistance
- Responsive user interface with light and dark modes

## Tech Stack

| Layer                | Technology                              |
| -------------------- | --------------------------------------- |
| Frontend             | React 19, TypeScript                    |
| Build Tool           | Vite                                    |
| Styling              | Tailwind CSS                            |
| UI Icons             | Lucide React                            |
| Animations           | Motion                                  |
| Core Logic           | TypeScript Decision/Rule Engine         |
| Ranking              | TOPSIS                                  |
| Fresh Produce Model  | Q10 Respiration Kinetics + MAP          |
| Data                 | Local Commodity, Material & Source Data |
| Internationalization | English, Hindi & Marathi                |
| Voice                | Web Speech API                          |
| Testing              | TypeScript / TSX Tests                  |
| Deployment           | Vercel                                  |
| Version Control      | Git & GitHub                            |

## Project Structure

```text
BioPack-AI/
├── src/
│   ├── components/
│   │   ├── views/
│   │   │   ├── AnalyzeView.tsx
│   │   │   ├── AuditView.tsx
│   │   │   ├── BenchmarkView.tsx
│   │   │   ├── CompareView.tsx
│   │   │   ├── FreshProduceView.tsx
│   │   │   ├── HomeView.tsx
│   │   │   ├── KnowledgeView.tsx
│   │   │   ├── ReportsView.tsx
│   │   │   ├── SpecGeneratorView.tsx
│   │   │   ├── SystemStatusView.tsx
│   │   │   ├── ValidationView.tsx
│   │   │   └── WhatIfView.tsx
│   │   ├── EvidenceGraphModal.tsx
│   │   ├── Footer.tsx
│   │   ├── Navbar.tsx
│   │   ├── RoleLoginModal.tsx
│   │   └── VoiceButton.tsx
│   │
│   ├── context/
│   │   ├── AuthContext.tsx
│   │   └── ThemeContext.tsx
│   │
│   ├── data/
│   │   ├── benchmarks.ts
│   │   ├── commodities.ts
│   │   ├── materials.ts
│   │   └── sources.ts
│   │
│   ├── engine/
│   │   ├── audit.ts
│   │   ├── map.ts
│   │   ├── mlGate.ts
│   │   ├── recommend.ts
│   │   ├── requirements.ts
│   │   ├── rules.ts
│   │   ├── speech.ts
│   │   └── topsis.ts
│   │
│   ├── locales/
│   │   ├── en.ts
│   │   ├── hi.ts
│   │   ├── mr.ts
│   │   └── i18n.tsx
│   │
│   ├── tests/
│   │   └── engine.test.ts
│   │
│   ├── types/
│   │   └── index.ts
│   │
│   ├── App.tsx
│   ├── index.css
│   └── main.tsx
│
├── .env.example
├── index.html
├── metadata.json
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## How It Works

1. User selects **Fresh Produce** or **Processed Food** mode.
2. User selects a pre-loaded commodity or enters a custom product.
3. Product and storage parameters such as temperature, humidity, shelf-life target, and product properties are entered.
4. BioPack AI calculates the packaging requirements based on the selected product and conditions.
5. For fresh produce, the system adjusts respiration using the **Q10 temperature relationship** and derives the required oxygen transmission characteristics.
6. Candidate packaging materials are screened against hard packaging requirements.
7. Suitable materials are ranked using **TOPSIS multi-criteria decision analysis**.
8. The system displays the recommended material, specifications, alternatives, cost tier, sustainability trade-offs, and explanation.
9. For applicable fresh produce, MAP calculations estimate the equilibrium **O₂ and CO₂** environment inside the package.
10. The user can further compare materials, run what-if scenarios, benchmark options, and review validation/audit information.

## Local Setup

### Prerequisites

- Node.js
- npm
- Git

### Clone the Repository

```bash
git clone https://github.com/eshanaj/BioPack-AI.git
cd BioPack-AI
```

### Install Dependencies

```bash
npm install
```

### Run the Development Server

```bash
npm run dev
```

Application runs at:

```text
http://localhost:3000
```

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Environment Variables

The project includes an `.env.example` file for environment configuration.

```env
GEMINI_API_KEY=YOUR_GEMINI_API_KEY
APP_URL=YOUR_APP_URL
```

The core packaging recommendation engine operates through the application's local decision and calculation logic rather than relying on a trained external machine-learning model.

## Methodology

### Fresh Produce

For fresh produce, BioPack AI uses the **Q10 temperature coefficient approach** to adjust respiration according to storage temperature.

The workflow is:

```text
Base Respiration Rate
        ↓
Q10 Temperature Adjustment
        ↓
Temperature-Adjusted Respiration
        ↓
Oxygen Requirement
        ↓
Required OTR
        ↓
Packaging Material Screening
        ↓
TOPSIS Ranking
```

The calculated requirements are then compared against the packaging-material database to identify suitable materials.

### Processed Food

For processed food, the system applies deterministic rules based on product characteristics and packaging-barrier requirements.

Examples include:

- High moisture sensitivity → stronger moisture barrier requirement
- High oxygen sensitivity → lower OTR requirement
- High oil/fat content → increased oxidation/fat resistance requirement
- High humidity exposure → stricter moisture protection
- High handling stress → stronger mechanical requirements

### TOPSIS Ranking

After hard constraints are applied, suitable packaging materials are ranked using **TOPSIS (Technique for Order Preference by Similarity to Ideal Solution)**.

The ranking can consider:

| Criterion        | Purpose                      |
| ---------------- | ---------------------------- |
| OTR              | Oxygen barrier performance   |
| WVTR             | Moisture barrier performance |
| Cost             | Packaging affordability      |
| Sustainability   | Environmental preference     |
| Tensile Strength | Mechanical performance       |

Different user priorities can change the relative importance of these criteria.

### MAP Calculation

For applicable fresh produce, BioPack AI estimates the gas environment inside the package using:

- Respiration rate
- Storage temperature
- Product mass
- Film surface area
- Packaging OTR
- Respiration quotient
- Target oxygen range

The system provides estimated equilibrium **O₂ and CO₂ concentrations** and identifies whether the selected packaging is potentially too restrictive or too permeable.

## Model

BioPack AI currently uses a **scientific rule-based and formula-driven decision engine**, rather than a trained machine-learning model.

The current system combines:

- Q10 respiration kinetics
- OTR/WVTR permeability matching
- Packaging-material properties
- Product-property rules
- Hard-constraint screening
- TOPSIS multi-criteria ranking
- MAP calculations

The project also contains an ML data-sufficiency gate. A trained predictive ML model is not presented as active when the available verified empirical data is insufficient for reliable model training.

This approach keeps the current recommendations **transparent, explainable, and traceable**.

## Deployment

| Service           | Platform               |
| ----------------- | ---------------------- |
| Frontend          | Vercel                 |
| Application Logic | Client-side TypeScript |
| Source Code       | GitHub                 |

## Future Improvements

- Add a trained ML/regression model for empirical shelf-life prediction
- Expand the verified commodity database
- Expand the packaging-material database
- Add QR-based packaging traceability
- Develop a dedicated mobile application for farmers
- Increase real-world packaging validation datasets
- Add larger empirical shelf-life datasets
- Introduce advanced predictive shelf-life modelling

## Team

Developed as a food-packaging decision-support project focused on making scientifically informed packaging selection more accessible to food businesses, farmers, researchers, and other stakeholders.

## License

This project is intended for **educational, research, and prototype purposes**.

Packaging recommendations should be validated through appropriate laboratory testing, supplier specifications, regulatory requirements, and real-world shelf-life studies before commercial deployment.
