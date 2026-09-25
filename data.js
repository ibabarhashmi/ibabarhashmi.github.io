"use strict";
window.SITE = {
  name: "Babar Hashmi",
  title: "AI Engineer — Machine Learning Specialist",
  location: "Bangalore, India",
  relocation: "Open to relocation",
  availability: "Available remote — globally",
  email: "ibabarhashmi@yahoo.com",
  phone: null,
  avatar: "assets/avatar.png",
  avatarFallback: "https://avatars.githubusercontent.com/u/112765907?v=4",
  resume: "assets/resume.pdf",
  now: "Founding AI engineer (MTS, research engineering) at QuillAI Network — building agent systems from the first prototype to production.",
  bio: "AI engineer with 3 years of applied ML, most of it as the first AI hire at QuillAudits (now QuillAI Network). I started with no team and no existing pipeline, and built the models, agent workflows and developer SDK that the company now ships. Day to day that means fine-tuning LLMs for detection tasks, designing agent loops, and writing the docs and tests that keep results honest.",
  links: {
    book: "https://calendar.app.google/eeGsWhoaFQDMm84g9",
    telegram: "https://t.me/HashBBR",
    linkedin: "https://www.linkedin.com/in/hashmi-babar/",
    github: "https://github.com/ibabarhashmi",
    x: null
  },
  impact: [
    { value: "+25%", label: "audit accuracy from production detection models" },
    { value: "−60%", label: "manual review time on audits" },
    { value: "93%", label: "ERC20 predictive-check accuracy" },
    { value: "7 axes", label: "deterministic DeFi risk scorecard" },
    { value: "100K+", label: "smart contracts analysed" }
  ],
  experience: [
    { role: "Founding AI Engineer (MTS, Research Engineering)", org: "QuillAI Network (QuillAudits)", start: "Jul 2024", end: "Present",
      points: [
        "Shipped production deep-learning models for smart-contract vulnerability detection, hardened by red-teaming — catching what automated analysis misses.",
        "First AI hire: set up the research-to-production process, then designed agent workflows with MCP tool-calling on open agent frameworks and shipped a developer SDK used across 3 business units.",
        "Onboarded early users and debugged their deployments until things actually worked.",
        "Fine-tuned LLMs for real detection tasks; rebuilt ML pipelines as the problem got clearer."
      ] },
    { role: "AI/ML Researcher", org: "QuillAudits", start: "Sep 2023", end: "Jun 2024",
      points: [
        "Built and launched QuillShield, an AI smart-contract auditing tool, as its lead AI engineer.",
        "Ran statistical modelling across 100K+ smart contracts for vulnerability research.",
        "Turned research into tools, including due-diligence analysis for market decisions.",
        "Delivered with cross-functional Agile teams; wrote the internal docs that kept the work honest."
      ] }
  ],
  projects: [
    { name: "Financial Strategy Risk Scoring Engine", tag: "FinTech · Agents",
      summary: "Deterministic scorecard over 7 risk axes using point-in-time market data, paired with a groundedness-gated LLM whose verifier rejects any claim it can't trace to data.",
      highlights: ["Validated on historical crashes", "One-command verification pipeline"],
      stack: ["TypeScript", "LLM", "Verifier"], repo: "https://github.com/ibabarhashmi/organon" },
    { name: "Agentic-Auditor", tag: "Security · Agents",
      summary: "User-friendly, on-the-go AI smart-contract auditor — Vite + TypeScript front end with Gemini-assisted audit flow.",
      highlights: ["AI-assisted audit UX", "Client-ready reporting"],
      stack: ["TypeScript", "Vite", "Gemini"], repo: "https://github.com/ibabarhashmi/Agentic-Auditor" },
    { name: "GoldenHour", tag: "Security · Fraud response",
      summary: "First response for cyber fraud.",
      highlights: [],
      stack: ["TypeScript"], repo: "https://github.com/ibabarhashmi/GoldenHour" },
    { name: "Guardrails", tag: "AI safety",
      summary: "TODO: confirm — one line on what this repo does.",
      highlights: [],
      stack: ["Python"], repo: "https://github.com/ibabarhashmi/Guardrails" },
    { name: "DesiRAG", tag: "Voice RAG · Hindi",
      summary: "Hindi voice RAG over MSMARCO-XI with hybrid retrieval and guardrails. Built for HH Goa 2026.",
      highlights: ["Hybrid retrieval", "Guardrailed"],
      stack: ["Python", "RAG", "Voice"], repo: "https://github.com/ibabarhashmi/DesiRAG" },
    { name: "ERC20 Attribute Predictor", tag: "Security · ML",
      summary: "ML model that extracts attributes of ERC20 contracts from Solidity source and bytecode.",
      highlights: [], stack: ["Python", "ML", "Solidity"], repo: "https://github.com/ibabarhashmi/ERC20-Attribute-Predictor" },
    { name: "Vuln-Detector", tag: "Security · ML",
      summary: "TODO: confirm — smart-contract vulnerability detection experiments.",
      highlights: [], stack: ["Python", "Jupyter"], repo: "https://github.com/ibabarhashmi/Vuln-Detector" },
    { name: "MEP Industrial Elements Detection", tag: "Construction tech · CV",
      summary: "Open-set detection of mechanical, electrical and plumbing elements with GroundingDINO, served through a real-time AWS inference API.",
      highlights: ["Open-set detection with GroundingDINO", "Real-time AWS inference API"],
      stack: ["GroundingDINO", "PyTorch", "AWS"], repo: null },
    { name: "Real-Time Pothole Detection", tag: "Public infrastructure · CV",
      summary: "YOLOv8 detector streaming through Kafka into a Streamlit dashboard, with REST APIs on AWS.",
      highlights: ["Kafka streaming pipeline", "Streamlit dashboard + REST APIs"],
      stack: ["YOLOv8", "Kafka", "Streamlit", "AWS"], repo: null }
  ],
  stack: {
    "AI / ML": ["PyTorch", "TensorFlow", "Transformers", "Open agent frameworks", "Custom agent frameworks", "LLM fine-tuning"],
    "Computer Vision": ["YOLOv8", "GroundingDINO", "OpenCV", "VLMs"],
    "MLOps & Cloud": ["AWS", "OCI", "Docker", "CI/CD", "Model monitoring", "Inference optimization", "vLLM"],
    "Engineering": ["Python", "TypeScript", "Bun", "Solidity", "SQL/NoSQL", "REST APIs", "TDD", "Agent harness design", "SDK design", "Eval & red-teaming"],
    "Data": ["Pandas", "NumPy", "Matplotlib", "Plotly", "Streamlit"]
  },
  certifications: [
    { name: "Agentic AI Certified Associate", issuer: "Oracle", date: "Jul 2026" },
    { name: "Copado Certified AI", issuer: "Copado", date: "Jul 2026" },
    { name: "OCI Generative AI Certified Professional", issuer: "Oracle", date: "Jul 2024" },
    { name: "Prompt & AI Engineering Certification", issuer: "MFT", date: "Jun 2024" }
  ],
  domains: ["Blockchain / Web3 security", "Construction tech (MEP)", "Public infrastructure CV", "FinTech risk scoring", "Multi-modal AI systems"],
  vibe: "Agents that tell the truth.",
  workingHoursIST: [10, 19],
  githubFallback: {
    public_repos: 19, followers: 1, stars: 2,
    avatar: "https://avatars.githubusercontent.com/u/112765907?v=4",
    languages: { "TypeScript": 4, "Python": 2 },
    recent: [
      { name: "DesiRAG", description: "HH Goa 2026 — Hindi voice RAG over MSMARCO-XI: hybrid retrieval, guardrails, sub-20ms latency", language: "Python", stars: 0, url: "https://github.com/ibabarhashmi/DesiRAG" },
      { name: "organon", description: "Is this DeFi yield real, and what could kill it? An ML scorecard, not an opinion.", language: "TypeScript", stars: 0, url: "https://github.com/ibabarhashmi/organon" },
      { name: "GoldenHour", description: "First response for cyber fraud", language: "TypeScript", stars: 1, url: "https://github.com/ibabarhashmi/GoldenHour" },
      { name: "Agentic-Auditor", description: "User Friendly On the Go, AI Smart Contract Auditor", language: "TypeScript", stars: 0, url: "https://github.com/ibabarhashmi/Agentic-Auditor" }
    ]
  }
};
