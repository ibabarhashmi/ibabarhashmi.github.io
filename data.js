"use strict";
window.SITE = {
  name: "Babar Hashmi",
  title: "AI Engineer - Agents, LLMs, Computer Vision",
  careerStart: "2023-09",
  location: "Bangalore, India",
  relocation: "Open to relocation",
  availability: "Available remote - globally",
  email: "ibabarhashmi@yahoo.com",
  phone: null,
  avatar: "assets/avatar.png",
  avatarFallback: "https://avatars.githubusercontent.com/u/112765907?v=4",
  resume: "assets/resume.pdf",
  now: "Founding AI engineer at QuillAI Network, building agent systems from first prototype to production.",
  bio: "AI engineer with {years} years of applied ML, most of it as the first AI hire at QuillAudits (now QuillAI Network). I started with no team and no existing pipeline, and built the models, agent workflows, and developer SDK that the company now ships. Day to day that means fine-tuning LLMs for detection tasks, designing agent loops, and writing the docs and tests that keep results honest.",
  links: {
    book: "https://calendar.app.google/eeGsWhoaFQDMm84g9",
    telegram: "https://t.me/HashBBR",
    linkedin: "https://www.linkedin.com/in/hashmi-babar/",
    github: "https://github.com/ibabarhashmi",
    x: null
  },
  impact: [
    { value: "+25%", label: "higher detection precision on labeled contracts" },
    { value: "60%", label: "less manual review time on audits" },
    { value: "93%", label: "accuracy on ERC20 safety checks" },
    { value: "3", label: "business units shipping on the developer SDK" },
    { value: "100K+", label: "smart contracts analyzed to date" }
  ],
  impactNote: "Measured on the QuillAI audit pipeline: detection-model precision on labeled contracts, review hours before and after rollout, 100K+ contracts scanned to date.",
  stackDaily: ["PyTorch", "Devtools", "Open agent frameworks", "AWS", "Python"],
  experience: [
    { role: "Founding AI Engineer (MTS, Research Engineering)", org: "QuillAI Network (QuillAudits)", start: "Jul 2024", end: "Present",
      points: [
        "Shipped production deep-learning models for smart-contract vulnerability detection, hardened by red teaming. They catch what static analysis misses.",
        "First AI hire: set up the research-to-production process, then designed agent workflows with MCP tool calling on open agent frameworks and shipped a developer SDK used across 3 business units.",
        "Onboarded early users and debugged their deployments until results held up in production.",
        "Fine-tuned LLMs for detection tasks and rebuilt ML pipelines as the problem got clearer."
      ] },
    { role: "AI/ML Researcher", org: "QuillAudits", start: "Sep 2023", end: "Jun 2024",
      points: [
        "Built and launched QuillShield, an AI smart-contract auditing tool, as its lead AI engineer.",
        "Ran statistical modeling across 100K+ smart contracts for vulnerability research.",
        "Turned research into tools, including due diligence analysis for market decisions.",
        "Delivered with cross-functional Agile teams and wrote the internal docs that kept results reproducible."
      ] }
  ],
  projects: [
    { name: "Financial Strategy Risk Scoring Engine", tag: "Featured - FinTech / Agents", cat: "agents", featured: true,
      summary: "Crash recall on dated backtests leads: deterministic scorecard over 7 risk axes on point-in-time market data, paired with a groundedness-gated LLM whose verifier rejects any claim it cannot trace to data.",
      highlights: ["Validated on historical crashes", "One-command verification pipeline", "Eval: crash recall on dated backtests"],
      stack: ["TypeScript", "LLM", "Verifier"], repo: "https://github.com/ibabarhashmi/organon" },
    { name: "Agentic-Auditor", tag: "Featured - Security / Agents", cat: "agents", featured: true,
      summary: "Measured finding precision on labeled contracts: on-the-go AI smart-contract auditor with a Gemini assisted flow and client ready reports in a Vite plus TypeScript front end.",
      highlights: ["AI assisted audit UX", "Client ready reporting", "Eval: finding precision on labeled contracts"],
      stack: ["TypeScript", "Vite", "Gemini"], repo: "https://github.com/ibabarhashmi/Agentic-Auditor" },
    { name: "GoldenHour", tag: "Security / Fraud response", cat: "security",
      summary: "Triage checklist for cyber fraud response. Collects evidence fast and drafts the first report.",
      highlights: ["Evidence checklist", "Draft first report"],
      stack: ["TypeScript"], repo: "https://github.com/ibabarhashmi/GoldenHour" },
    { name: "Guardrails", tag: "AI safety", cat: "security",
      summary: "Input/output firewall for LLM apps: prompt-injection and PII checks that run in CI before deploy.",
      highlights: ["Prompt injection checks", "PII redaction"],
      stack: ["Python"], repo: "https://github.com/ibabarhashmi/Guardrails" },
    { name: "DesiRAG", tag: "Voice RAG / Hindi", cat: "agents",
      summary: "Hindi voice RAG over multilingual search passages, with hybrid retrieval and guardrails. Built for HH Goa 2026.",
      highlights: ["Hybrid retrieval", "Guardrailed"],
      stack: ["Python", "RAG", "Voice"], repo: "https://github.com/ibabarhashmi/DesiRAG" },
    { name: "Vuln-Detector", tag: "Security / ML", cat: "security",
      summary: "Experiment harness for contract-vulnerability baselines feeding the production detection models.",
      highlights: ["Baseline models"], stack: ["Python", "Jupyter"], repo: "https://github.com/ibabarhashmi/Vuln-Detector" },
    { name: "MEP Industrial Elements Detection", tag: "Construction tech / CV", cat: "cv",
      summary: "Open-set detection of mechanical, electrical and plumbing elements with GroundingDINO, served through a real-time AWS inference API.",
      highlights: ["No fixed label set: open vocabulary", "Live AWS inference API"],
      stack: ["GroundingDINO", "PyTorch", "AWS"], repo: null },
    { name: "Real-Time Pothole Detection", tag: "Public infrastructure / CV", cat: "cv",
      summary: "YOLOv8 detector streaming through Kafka into a Streamlit dashboard, with REST APIs on AWS.",
      highlights: ["Kafka streaming pipeline", "Streamlit dashboard plus REST APIs"],
      stack: ["YOLOv8", "Kafka", "Streamlit", "AWS"], repo: null }
  ],
  stack: {
    "AI / ML": ["PyTorch", "TensorFlow", "Transformers", "Open agent frameworks", "Devtools", "LLM fine-tuning"],
    "Computer Vision": ["YOLOv8", "GroundingDINO", "OpenCV", "VLMs"],
    "MLOps & Cloud": ["AWS", "OCI", "Docker", "CI/CD", "Model monitoring", "Inference optimization", "vLLM"],
    "Engineering": ["Python", "TypeScript", "Bun", "Solidity", "SQL/NoSQL", "REST APIs", "TDD", "Agent harness design", "SDK design", "Eval and red teaming"],
    "Data": ["Pandas", "NumPy", "Matplotlib", "Plotly", "Streamlit"]
  },
  certifications: [
    { name: "OCI Generative AI Certified Professional", issuer: "Oracle", date: "Jul 2024" },
    { name: "Agentic AI Certified Associate", issuer: "Oracle", date: "Jul 2026" },
    { name: "Copado Certified AI", issuer: "Copado", date: "Jul 2026" },
    { name: "Prompt & AI Engineering Certification", issuer: "MFT", date: "Jun 2024" }
  ],
  domains: ["Blockchain / Web3 security", "Construction tech (MEP)", "Public infrastructure computer vision", "FinTech risk scoring", "Multi-modal AI systems"],
  contactTitle: "Let's build agents that tell the truth.",
  contactBody: "Available for remote work, worldwide. Based in Bangalore (IST, UTC+5:30) - replies within a day.",
  vibe: "Agents that tell the truth.",
  workingHoursIST: [10, 19],
  githubFallback: {
    public_repos: 19, followers: 1, stars: 2,
    avatar: "https://avatars.githubusercontent.com/u/112765907?v=4",
    languages: { "TypeScript": 4, "Python": 2 },
    recent: [
      { name: "DesiRAG", description: "Hindi voice RAG over multilingual search passages: hybrid retrieval, guardrails, sub-20ms latency", language: "Python", stars: 0, url: "https://github.com/ibabarhashmi/DesiRAG" },
      { name: "organon", description: "Is this DeFi yield real, and what could kill it? An ML scorecard, not an opinion.", language: "TypeScript", stars: 0, url: "https://github.com/ibabarhashmi/organon" },
      { name: "GoldenHour", description: "First response checklist for cyber fraud", language: "TypeScript", stars: 1, url: "https://github.com/ibabarhashmi/GoldenHour" },
      { name: "Agentic-Auditor", description: "On-the-go AI smart contract auditor", language: "TypeScript", stars: 0, url: "https://github.com/ibabarhashmi/Agentic-Auditor" }
    ]
  }
};
