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
  now: "Founding AI R&D Hire (MTS), Research Engineering track — building agentic systems 0→1.",
  bio: "AI Engineer with 2+ years building production ML — deep learning, agentic AI systems, and scalable deployment. I design custom agents, fine-tune LLMs, and ship end-to-end ML pipelines with MLOps discipline: $50K+ in cost savings, 92% model accuracy, and 40% faster time-to-production.",
  links: {
    book: "https://calendar.app.google/eeGsWhoaFQDMm84g9",
    telegram: "https://t.me/HashBBR",
    linkedin: "https://www.linkedin.com/in/hashmi-babar/",
    github: "https://github.com/ibabarhashmi",
    x: null
  },
  impact: [
    { value: "$50K+", label: "cost savings delivered" },
    { value: "92%", label: "model accuracy (CV)" },
    { value: "+25%", label: "LLM contextual understanding" },
    { value: "−60%", label: "manual audit review" },
    { value: "3", label: "business units running my agentic SDK" }
  ],
  experience: [
    { role: "AI Engineer", org: "QuillAI Network (QuillAudits)", start: "Jul 2024", end: "Aug 2026",
      points: [
        "Built production deep-learning models for smart-contract vulnerability detection: +25% audit accuracy, −60% manual review.",
        "Engineered custom agentic AI systems on the Anthropic Claude SDK (tool-calling loops, agent harness) and shipped a developer-facing SDK across 3 business units.",
        "Partnered with C-level stakeholders on client deployments.",
        "Fine-tuned LLMs for +25% contextual understanding."
      ] },
    { role: "AI/ML Researcher", org: "QuillAudits", start: "Sep 2023", end: "Jun 2024",
      points: [
        "Led an AI blockchain-auditing tool that lifted client engagement 30%.",
        "Ran statistical modelling across 100K+ smart contracts, identifying 95% of vulnerabilities.",
        "Performed due-diligence analysis on $50M+ in investments.",
        "Drove Agile delivery 35% faster."
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
      summary: "Policy and guardrail layer for LLM agents — keeps tool-calling loops grounded and safe.",
      highlights: [],
      stack: ["Python"], repo: "https://github.com/ibabarhashmi/Guardrails" },
    { name: "DesiRAG", tag: "Voice RAG · Hindi",
      summary: "Hindi voice RAG over MSMARCO-XI: hybrid retrieval with guardrails and sub-20ms latency. Built for HH Goa 2026.",
      highlights: ["Hybrid retrieval", "Sub-20ms latency", "Guardrailed"],
      stack: ["Python", "RAG", "Voice"], repo: "https://github.com/ibabarhashmi/DesiRAG" },
    { name: "MEP Industrial Elements Detection", tag: "Construction tech · CV",
      summary: "Open-set detection of mechanical, electrical and plumbing elements with GroundingDINO, served through a real-time AWS inference API.",
      highlights: ["85% accuracy on 1K+ images", "500+ daily inspections", "−40% false positives"],
      stack: ["GroundingDINO", "PyTorch", "AWS"], repo: null },
    { name: "Real-Time Pothole Detection", tag: "Public infrastructure · CV",
      summary: "YOLOv8 detector streaming through Kafka into a Streamlit dashboard, with REST APIs on AWS.",
      highlights: ["92% accuracy", "Sub-5s processing", "1,000+ detections"],
      stack: ["YOLOv8", "Kafka", "Streamlit", "AWS"], repo: null }
  ],
  stack: {
    "AI / ML": ["PyTorch", "TensorFlow", "Transformers", "Hugging Face", "Anthropic SDK", "Custom agent frameworks"],
    "Computer Vision": ["YOLOv8", "GroundingDINO", "OpenCV", "VLMs"],
    "MLOps & Cloud": ["AWS", "OCI", "Docker", "CI/CD", "Model monitoring"],
    "Engineering": ["Python", "TypeScript", "Bun", "Solidity", "SQL/NoSQL", "TDD", "Agent harness design", "SDK design"],
    "Data": ["Pandas", "NumPy", "Matplotlib", "Plotly", "Streamlit"]
  },
  certifications: [
    { name: "Agentic AI Certified Associate", issuer: "Oracle", date: "Jul 2026" },
    { name: "Copado Certified AI", issuer: "Copado", date: "Jul 2026" },
    { name: "OCI Generative AI Certified Professional", issuer: "Oracle", date: "Jul 2024" },
    { name: "Prompt & AI Engineering Certification", issuer: "MFT", date: "Jun 2024" }
  ],
  domains: ["Blockchain / Web3 security", "Construction tech (MEP)", "Public infrastructure CV", "FinTech risk scoring"],
  vibe: "Agents that tell the truth.",
  workingHoursIST: [10, 19],
  githubFallback: {
    public_repos: 18, followers: 1, stars: 6,
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
