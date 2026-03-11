import { useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Header from './Header';

// Types
type CategoryKey = 'web' | 'web3' | 'ai_ml' | 'cyber' | 'networking' | 'mobile' | 'ai_agents' | 'llm_dev';

interface ProjectItem {
  id: string;
  title: string;
  summary: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

interface Category {
  key: CategoryKey;
  label: string;
  color: string; // tailwind color class
}

const CATEGORIES: Category[] = [
  { key: 'web', label: 'Web Development', color: 'bg-blue-500' },
  { key: 'web3', label: 'Web3', color: 'bg-purple-500' },
  { key: 'ai_ml', label: 'AI/ML', color: 'bg-emerald-500' },
  { key: 'cyber', label: 'Cybersecurity', color: 'bg-red-500' },
  { key: 'networking', label: 'Networking', color: 'bg-cyan-500' },
  { key: 'mobile', label: 'Mobile Apps (React+Expo)', color: 'bg-orange-500' },
  { key: 'ai_agents', label: 'AI Agents', color: 'bg-pink-500' },
  { key: 'llm_dev', label: 'LLM Development', color: 'bg-yellow-500' }
];

// Helper to make IDs URL safe
const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

// Generate 20 items per category (curated problem statements)
const PROJECTS: Record<CategoryKey, ProjectItem[]> = {
  web: [
    { id: 'web-ecom-store', title: 'E-commerce Storefront with Cart & Checkout', summary: 'Build a modern React + Node e-commerce app with product listing, cart, and checkout. Integrate payments and order tracking.', difficulty: 'intermediate' },
    { id: 'web-saas-dashboard', title: 'SaaS Admin Analytics Dashboard', summary: 'Create a responsive dashboard using charts, filters, auth, and role-based access. Persist data via REST APIs.', difficulty: 'advanced' },
    { id: 'web-blog-cms', title: 'Headless Blog CMS', summary: 'Build a headless CMS with markdown editing, tags, search, and static site generation.', difficulty: 'intermediate' },
    { id: 'web-social-feed', title: 'Social Feed with Reactions & Comments', summary: 'Implement real-time feed, reactions, mentions, and notifications. Use WebSockets for live updates.', difficulty: 'advanced' },
    { id: 'web-task-manager', title: 'Kanban Task Manager', summary: 'Drag-and-drop board with lists, tasks, subtasks and due dates. Sync state to backend.', difficulty: 'beginner' },
    { id: 'web-portfolio', title: 'Developer Portfolio Builder', summary: 'Build a portfolio generator where users assemble sections, themes, and publish via static hosting.', difficulty: 'beginner' },
    { id: 'web-video-stream', title: 'Video Library & Streaming', summary: 'Upload, transcode, stream and bookmark videos. Include search and watch history.', difficulty: 'advanced' },
    { id: 'web-realtime-chat', title: 'Realtime Chat with Groups', summary: 'Multi-room chat with profiles, typing indicators, media upload, and online presence.', difficulty: 'intermediate' },
    { id: 'web-forms-builder', title: 'Forms Builder + Submissions', summary: 'Visual form builder with validation, themes and submission analytics.', difficulty: 'intermediate' },
    { id: 'web-finance-tracker', title: 'Personal Finance Tracker', summary: 'Track income/expenses with budgets, charts and recurring rules. Export CSV/PDF.', difficulty: 'beginner' },
    { id: 'web-map-geo', title: 'Geo Maps & Nearby Search', summary: 'Map-based search for places with filters, bookmarks and routes.', difficulty: 'intermediate' },
    { id: 'web-learning-platform', title: 'Learning Platform (Courses + Quizzes)', summary: 'Host courses with lessons, quizzes, completion certificates and progress tracking.', difficulty: 'advanced' },
    { id: 'web-ticketing', title: 'Support Ticketing System', summary: 'Multi-tenant ticketing, priorities, SLA timers and status history.', difficulty: 'intermediate' },
    { id: 'web-events', title: 'Events & Booking', summary: 'Create an events listing with seats, booking, reminders and calendar sync.', difficulty: 'intermediate' },
    { id: 'web-hotel', title: 'Hotel Booking Engine', summary: 'Search, compare and reserve rooms with payment, cancellation & refund flows.', difficulty: 'advanced' },
    { id: 'web-health-tracker', title: 'Health Metrics Tracker', summary: 'Track steps, sleep, water intake with goals and charts. OAuth to external APIs.', difficulty: 'beginner' },
    { id: 'web-job-board', title: 'Job Board with Applications', summary: 'List jobs, filter by skills, accept applications with resume upload.', difficulty: 'intermediate' },
    { id: 'web-recipe-app', title: 'Recipe App with Meal Plans', summary: 'Create weekly plans, shopping lists and nutrition stats.', difficulty: 'beginner' },
    { id: 'web-real-estate', title: 'Real Estate Listings', summary: 'Property search, map pins, saved searches and agent contact flow.', difficulty: 'intermediate' },
    { id: 'web-subscriptions', title: 'Subscriptions & Billing', summary: 'Stripe-powered subscriptions, dunning, invoices and customer portal.', difficulty: 'advanced' },
  ],
  web3: [
    { id: 'web3-nft-market', title: 'NFT Marketplace', summary: 'Mint, list, buy and sell NFTs. Wallet connect and on-chain metadata.', difficulty: 'advanced' },
    { id: 'web3-token-dapp', title: 'ERC-20 Token Dashboard', summary: 'Create, mint and transfer tokens with a dashboard and gas estimations.', difficulty: 'intermediate' },
    { id: 'web3-vote', title: 'On-chain Voting DAO', summary: 'Propose, vote and execute DAO actions with snapshot-like UX.', difficulty: 'advanced' },
    { id: 'web3-lottery', title: 'Decentralized Lottery', summary: 'Fair lottery smart contract with randomness and prize distribution.', difficulty: 'advanced' },
    { id: 'web3-defi-lend', title: 'DeFi Lending Demo', summary: 'Supply, borrow and repay with interest calculation and collateral.', difficulty: 'advanced' },
    { id: 'web3-ens-tools', title: 'ENS Toolkit', summary: 'Search and manage ENS names with records and avatar support.', difficulty: 'intermediate' },
    { id: 'web3-wallet', title: 'Multi-Chain Wallet', summary: 'Basic wallet with balances, transfers and chain switching.', difficulty: 'intermediate' },
    { id: 'web3-bridge', title: 'Token Bridge (Concept)', summary: 'Simulate cross-chain transfers with proof displays and statuses.', difficulty: 'advanced' },
    { id: 'web3-prediction', title: 'Prediction Market', summary: 'Create markets, trade shares and settle outcomes via oracle.', difficulty: 'advanced' },
    { id: 'web3-crowdfund', title: 'Crowdfunding DApp', summary: 'Launch campaigns with milestones, refunds and governance voting.', difficulty: 'intermediate' },
    { id: 'web3-sbt', title: 'Soulbound Certificates', summary: 'Issue non-transferable certificates for completion/identity.', difficulty: 'intermediate' },
    { id: 'web3-random-nft', title: 'Randomized NFT Mint', summary: 'Chainlink VRF-based trait assignment for NFT mint.', difficulty: 'advanced' },
    { id: 'web3-insurance', title: 'Parametric Insurance', summary: 'Policy payouts triggered by external data feeds.', difficulty: 'advanced' },
    { id: 'web3-file-store', title: 'IPFS File Storage App', summary: 'Upload and pin files with metadata and pinning service.', difficulty: 'beginner' },
    { id: 'web3-stream-pay', title: 'Streaming Payments', summary: 'Continuous payment flows with vesting and withdrawal.', difficulty: 'advanced' },
    { id: 'web3-game-items', title: 'Game Items Marketplace', summary: 'Tradable game assets with rarity and auctions.', difficulty: 'intermediate' },
    { id: 'web3-oauth', title: 'Web3 Login & Badges', summary: 'Login via wallet, issue badges and gated content.', difficulty: 'beginner' },
    { id: 'web3-kyc', title: 'Privacy-Preserving KYC', summary: 'Zero-knowledge proofs for verifiable KYC claims.', difficulty: 'advanced' },
    { id: 'web3-subscriptions', title: 'On-chain Subscriptions', summary: 'Recurring payments with smart contract billing.', difficulty: 'advanced' },
    { id: 'web3-oracle', title: 'Oracle Demo', summary: 'Consume external data with oracle updates and caching.', difficulty: 'intermediate' },
  ],
  ai_ml: [
    { id: 'ai-ml-fraud', title: 'Fraud Detection (Tabular ML)', summary: 'Train models to detect fraudulent transactions with feature engineering.', difficulty: 'intermediate' },
    { id: 'ai-ml-vision', title: 'Image Classification', summary: 'Train CNNs on custom datasets and evaluate with confusion matrices.', difficulty: 'beginner' },
    { id: 'ai-ml-nlp-sentiment', title: 'Sentiment Analysis', summary: 'Build a text classifier using transformers with evaluation metrics.', difficulty: 'intermediate' },
    { id: 'ai-ml-forecast', title: 'Time Series Forecasting', summary: 'Predict trends using ARIMA/LSTM and compare baselines.', difficulty: 'advanced' },
    { id: 'ai-ml-recsys', title: 'Recommendation System', summary: 'Collaborative filtering with implicit feedback and A/B tests.', difficulty: 'advanced' },
    { id: 'ai-ml-ocr', title: 'OCR Pipeline', summary: 'Extract text from images, clean and index with search.', difficulty: 'intermediate' },
    { id: 'ai-ml-chatbot', title: 'FAQ Chatbot', summary: 'Intent classification + retrieval; deploy with web UI.', difficulty: 'beginner' },
    { id: 'ai-ml-anomaly', title: 'Anomaly Detection', summary: 'Detect anomalies in sensor data using isolation forest.', difficulty: 'intermediate' },
    { id: 'ai-ml-style', title: 'Neural Style Transfer', summary: 'Apply artistic styles to photos; optimize quality vs speed.', difficulty: 'advanced' },
    { id: 'ai-ml-object-det', title: 'Object Detection', summary: 'Train YOLO/SSD models with bounding boxes and mAP evaluation.', difficulty: 'advanced' },
    { id: 'ai-ml-speech', title: 'Speech Command Recognition', summary: 'Classify short audio commands using MFCC features.', difficulty: 'beginner' },
    { id: 'ai-ml-qa', title: 'Doc Q&A', summary: 'Retrieval augmented QA over PDFs using embeddings.', difficulty: 'intermediate' },
    { id: 'ai-ml-rl', title: 'Reinforcement Learning Agent', summary: 'Train RL agents in simple environments and compare policies.', difficulty: 'advanced' },
    { id: 'ai-ml-tabnet', title: 'TabNet for Structured Data', summary: 'Experiment with TabNet on Kaggle-like datasets.', difficulty: 'intermediate' },
    { id: 'ai-ml-auto-ml', title: 'AutoML Pipeline', summary: 'Build feature selection and model search with tracking.', difficulty: 'advanced' },
    { id: 'ai-ml-ethics', title: 'Bias & Fairness Audit', summary: 'Analyze datasets for bias and evaluate fairness metrics.', difficulty: 'intermediate' },
    { id: 'ai-ml-seg', title: 'Image Segmentation', summary: 'Train UNet for semantic segmentation; measure IoU.', difficulty: 'advanced' },
    { id: 'ai-ml-cluster', title: 'Clustering + Visualization', summary: 'Apply k-means/DBSCAN and visualize with t-SNE/UMAP.', difficulty: 'beginner' },
    { id: 'ai-ml-serve', title: 'Model Serving API', summary: 'Deploy models behind REST with caching and monitoring.', difficulty: 'intermediate' },
    { id: 'ai-ml-tracking', title: 'Experiment Tracking', summary: 'Use MLflow/Weights & Biases to track runs and metrics.', difficulty: 'intermediate' },
  ],
  cyber: [
    { id: 'cyber-threat-model', title: 'Threat Modeling Toolkit', summary: 'Design attack trees and STRIDE analysis for sample systems.', difficulty: 'beginner' },
    { id: 'cyber-web-pentest', title: 'Web Pentesting Lab', summary: 'Build a DVWA-style lab; practice SQLi, XSS, CSRF and fixes.', difficulty: 'intermediate' },
    { id: 'cyber-network-monitor', title: 'Network Monitoring', summary: 'Packet capture, IDS alerts, dashboards and incident reports.', difficulty: 'advanced' },
    { id: 'cyber-password-hash', title: 'Password Hashing & Cracking', summary: 'Explore hashing, salting, rainbow tables and defenses.', difficulty: 'beginner' },
    { id: 'cyber-log-analyzer', title: 'Log Analysis for Incidents', summary: 'Collect and analyze logs to detect suspicious activity.', difficulty: 'intermediate' },
    { id: 'cyber-malware', title: 'Malware Analysis Sandbox', summary: 'Static/dynamic analysis in safe environments with reports.', difficulty: 'advanced' },
    { id: 'cyber-waf', title: 'Simple WAF', summary: 'Implement rules to block attacks and log attempts.', difficulty: 'advanced' },
    { id: 'cyber-auth-hardening', title: 'Auth Hardening Guide', summary: '2FA, session security, device checks and secure storage.', difficulty: 'beginner' },
    { id: 'cyber-forensics', title: 'Digital Forensics Case', summary: 'Recover evidence, timeline events and chain-of-custody docs.', difficulty: 'intermediate' },
    { id: 'cyber-cloud-sec', title: 'Cloud Security Baseline', summary: 'IAM policies, encryption, backups and incident response.', difficulty: 'intermediate' },
    { id: 'cyber-phishing', title: 'Phishing Simulation', summary: 'Run organizational phishing tests and report metrics.', difficulty: 'advanced' },
    { id: 'cyber-ransomware', title: 'Ransomware Playbook', summary: 'Create response procedures and backup strategies.', difficulty: 'beginner' },
    { id: 'cyber-api-sec', title: 'API Security Testing', summary: 'Fuzzing endpoints, rate limits, scopes and OWASP API Top 10.', difficulty: 'advanced' },
    { id: 'cyber-iam', title: 'Identity & Access Mgmt', summary: 'RBAC/ABAC policies, audit logs and least-privilege reviews.', difficulty: 'intermediate' },
    { id: 'cyber-secrets', title: 'Secrets Management', summary: 'Vault/KMS integration, rotation and scanning CI.', difficulty: 'intermediate' },
    { id: 'cyber-supply', title: 'Supply Chain Risk', summary: 'SBOM, signature verification and dependency audits.', difficulty: 'advanced' },
    { id: 'cyber-dlp', title: 'Data Loss Prevention', summary: 'Policies, detectors and response automation.', difficulty: 'advanced' },
    { id: 'cyber-zero-trust', title: 'Zero Trust Blueprint', summary: 'Micro-segmentation, identity-aware routing and posture checks.', difficulty: 'advanced' },
    { id: 'cyber-vuln', title: 'Vulnerability Scanner', summary: 'Scan hosts/services; report CVEs and remediation steps.', difficulty: 'intermediate' },
    { id: 'cyber-compliance', title: 'Compliance Playbook', summary: 'GDPR/ISO/NIST mapping and continuous compliance scripts.', difficulty: 'intermediate' },
  ],
  networking: [
    { id: 'net-topology', title: 'Office Network Topology', summary: 'Design L2/L3 topology with VLANs, routing and redundancy.', difficulty: 'beginner' },
    { id: 'net-dns', title: 'DNS Management System', summary: 'Manage zones/records, health checks and failover.', difficulty: 'intermediate' },
    { id: 'net-load-bal', title: 'HTTP Load Balancer', summary: 'Reverse proxy with weighted routing and health checks.', difficulty: 'advanced' },
    { id: 'net-monitor', title: 'Network Monitoring Stack', summary: 'SNMP polling, alerts and dashboards for devices.', difficulty: 'intermediate' },
    { id: 'net-firewall', title: 'Firewall Rules Designer', summary: 'Simulate rules, audit logs and test scenarios.', difficulty: 'beginner' },
    { id: 'net-wifi', title: 'Secure Wi-Fi Deployment', summary: 'Plan coverage, authentication and guest access policies.', difficulty: 'intermediate' },
    { id: 'net-sdn', title: 'SDN Controller Demo', summary: 'Flow rules, path optimization and failure recovery.', difficulty: 'advanced' },
    { id: 'net-vpn', title: 'Site-to-Site VPN', summary: 'Design IPSec tunnels with routing and ACLs.', difficulty: 'intermediate' },
    { id: 'net-traffic', title: 'Traffic Analyzer', summary: 'Capture/inspect traffic and visualize top talkers.', difficulty: 'intermediate' },
    { id: 'net-voip', title: 'VoIP Setup', summary: 'SIP server, phones, QoS and call recording.', difficulty: 'advanced' },
    { id: 'net-nat', title: 'NAT Gateway', summary: 'Outbound NAT, port forwarding and logging.', difficulty: 'beginner' },
    { id: 'net-bgp', title: 'BGP Route Lab', summary: 'Advertise/learn prefixes with route policies.', difficulty: 'advanced' },
    { id: 'net-dhcp', title: 'DHCP Management', summary: 'Leases, reservations and monitoring.', difficulty: 'beginner' },
    { id: 'net-ha', title: 'HA Architecture', summary: 'VRRP pairs, failover tests and DR runbooks.', difficulty: 'advanced' },
    { id: 'net-dos', title: 'DoS Simulation', summary: 'Generate traffic, rate-limit and mitigation.', difficulty: 'advanced' },
    { id: 'net-sdn-tele', title: 'Telemetry Pipeline', summary: 'Stream telemetry to time-series DB with alerts.', difficulty: 'advanced' },
    { id: 'net-ipam', title: 'IPAM System', summary: 'Track allocations, subnets and ownership.', difficulty: 'intermediate' },
    { id: 'net-zerotier', title: 'ZeroTier Virtual LAN', summary: 'Virtual networks across sites with ACLs.', difficulty: 'beginner' },
    { id: 'net-qos', title: 'QoS Policy Lab', summary: 'Classify traffic and enforce bandwidth policies.', difficulty: 'intermediate' },
    { id: 'net-wireguard', title: 'WireGuard Mesh', summary: 'Automate WireGuard peer mesh across nodes.', difficulty: 'advanced' },
  ],
  mobile: [
    { id: 'mob-fitness', title: 'Fitness Tracker (React Native + Expo)', summary: 'Track workouts, goals, reminders and Apple/Google Health sync.', difficulty: 'beginner' },
    { id: 'mob-todo', title: 'Offline-first Todo App', summary: 'Use SQLite/storage sync with conflict resolution.', difficulty: 'beginner' },
    { id: 'mob-chat', title: 'Realtime Chat App', summary: 'Channel lists, DMs, push notifications and media upload.', difficulty: 'intermediate' },
    { id: 'mob-commerce', title: 'Mobile Commerce', summary: 'Catalog, cart, checkout, and order tracking.', difficulty: 'intermediate' },
    { id: 'mob-map', title: 'Map & Navigation', summary: 'Location search, routing and geofencing alerts.', difficulty: 'intermediate' },
    { id: 'mob-notes', title: 'Notes App', summary: 'Rich text notes, tagging and sync.', difficulty: 'beginner' },
    { id: 'mob-recipe', title: 'Recipe Planner', summary: 'Meal plans, grocery lists and timers.', difficulty: 'beginner' },
    { id: 'mob-expenses', title: 'Expense Manager', summary: 'Track expenses, budgets and charts.', difficulty: 'beginner' },
    { id: 'mob-travel', title: 'Travel Planner', summary: 'Itineraries, bookings and offline maps.', difficulty: 'intermediate' },
    { id: 'mob-habits', title: 'Habit Tracker', summary: 'Reminders, streaks and analytics.', difficulty: 'beginner' },
    { id: 'mob-education', title: 'Learning Companion', summary: 'Micro-courses, quizzes and certificates.', difficulty: 'intermediate' },
    { id: 'mob-appointments', title: 'Appointment Booking', summary: 'Schedule management with reminders and payments.', difficulty: 'intermediate' },
    { id: 'mob-events', title: 'Events App', summary: 'Discover events, tickets and check-ins.', difficulty: 'intermediate' },
    { id: 'mob-health', title: 'Personal Health Journal', summary: 'Symptoms log, meds schedule and charts.', difficulty: 'beginner' },
    { id: 'mob-podcast', title: 'Podcast Player', summary: 'Subscriptions, playlists and downloads.', difficulty: 'beginner' },
    { id: 'mob-flashcards', title: 'Flashcards Study', summary: 'SRS quizzes with decks and progress.', difficulty: 'beginner' },
    { id: 'mob-news', title: 'News Reader', summary: 'Feeds, bookmarks and offline reading.', difficulty: 'beginner' },
    { id: 'mob-language', title: 'Language Learning', summary: 'Vocabulary practice, audio and streaks.', difficulty: 'intermediate' },
    { id: 'mob-transport', title: 'Transport Booking', summary: 'Bus/train tickets with seat selection.', difficulty: 'intermediate' },
    { id: 'mob-smart-home', title: 'Smart Home Control', summary: 'Control devices, scenes and automations.', difficulty: 'advanced' },
  ],
  ai_agents: [
    { id: 'agents-helpdesk', title: 'Helpdesk Agent', summary: 'Email and chat triage with suggested responses and escalation.', difficulty: 'intermediate' },
    { id: 'agents-sales', title: 'Sales Outreach Agent', summary: 'Personalized outreach with CRM sync and opt-out handling.', difficulty: 'advanced' },
    { id: 'agents-doc', title: 'Document Assistant', summary: 'Summarize and answer questions from documents.', difficulty: 'beginner' },
    { id: 'agents-coder', title: 'Coding Copilot', summary: 'Code generation, refactoring and reviews for small repos.', difficulty: 'advanced' },
    { id: 'agents-ops', title: 'Ops Runbook Agent', summary: 'Execute runbooks and surface logs/metrics context.', difficulty: 'advanced' },
    { id: 'agents-data', title: 'Data ETL Agent', summary: 'Automate ingestion, cleaning and report generation.', difficulty: 'advanced' },
    { id: 'agents-planner', title: 'Planner with Tools', summary: 'Multi-step planner using tools for research/action.', difficulty: 'intermediate' },
    { id: 'agents-travel', title: 'Travel Concierge', summary: 'Plan itineraries, bookings and constraints.', difficulty: 'beginner' },
    { id: 'agents-cs', title: 'Customer Support Agent', summary: 'Resolve issues, fetch KB answers and ticket updates.', difficulty: 'intermediate' },
    { id: 'agents-health', title: 'Health Assistant', summary: 'Track symptoms and suggest actions with disclaimers.', difficulty: 'beginner' },
    { id: 'agents-coach', title: 'Personal Coach Agent', summary: 'Goals, habits and progress check-ins.', difficulty: 'beginner' },
    { id: 'agents-interview', title: 'Interview Agent', summary: 'Ask questions, evaluate and recommend candidates.', difficulty: 'advanced' },
    { id: 'agents-security', title: 'Security Analyst Agent', summary: 'Investigate alerts, propose actions and report.', difficulty: 'advanced' },
    { id: 'agents-finance', title: 'Finance Advisor Agent', summary: 'Budget suggestions and savings planning.', difficulty: 'beginner' },
    { id: 'agents-rag', title: 'RAG Pipeline Agent', summary: 'Search company docs; answer and cite sources.', difficulty: 'intermediate' },
    { id: 'agents-edu', title: 'Tutor Agent', summary: 'Explain concepts and quiz students with hints.', difficulty: 'beginner' },
    { id: 'agents-qa', title: 'QA Tester Agent', summary: 'Generate test cases and run checks with reports.', difficulty: 'intermediate' },
    { id: 'agents-project', title: 'Project Manager Agent', summary: 'Create plans, assign tasks and track status.', difficulty: 'intermediate' },
    { id: 'agents-news', title: 'News Digest Agent', summary: 'Collect headlines and summarize daily.', difficulty: 'beginner' },
    { id: 'agents-opsbot', title: 'Ops Bot with Tools', summary: 'CLI/API tools to run diagnostics and actions.', difficulty: 'advanced' },
  ],
  llm_dev: [
    { id: 'llm-mini-rag', title: 'Mini RAG App', summary: 'Embed documents, search and answer with citations.', difficulty: 'beginner' },
    { id: 'llm-chat-ui', title: 'Chat UI with History', summary: 'Build a chat UI with session persistence and export.', difficulty: 'beginner' },
    { id: 'llm-evals', title: 'LLM Evals Harness', summary: 'Create eval sets, metrics and dashboards for prompts.', difficulty: 'intermediate' },
    { id: 'llm-agents', title: 'Tool-Enabled Agents', summary: 'Integrate tools for web, DB and file actions.', difficulty: 'advanced' },
    { id: 'llm-finetune', title: 'Fine-tune Classifier', summary: 'Fine-tune a small model for classification tasks.', difficulty: 'advanced' },
    { id: 'llm-guardrails', title: 'Guardrails & Filters', summary: 'Implement safety filters and content policies.', difficulty: 'advanced' },
    { id: 'llm-plugins', title: 'Plugin System', summary: 'Design plugin API for adding new tools/providers.', difficulty: 'advanced' },
    { id: 'llm-index', title: 'Indexing Pipeline', summary: 'Chunking strategies and index maintenance jobs.', difficulty: 'intermediate' },
    { id: 'llm-prompt-lib', title: 'Prompt Library', summary: 'Reusable prompt templates with parameters and tests.', difficulty: 'beginner' },
    { id: 'llm-sql', title: 'Text-to-SQL', summary: 'Generate SQL from natural language with schema-aware prompts.', difficulty: 'advanced' },
    { id: 'llm-doc-chat', title: 'Doc Chat App', summary: 'Multi-file doc chat with citations and highlights.', difficulty: 'intermediate' },
    { id: 'llm-code', title: 'Code Assistant', summary: 'Explain, refactor and generate code with diffs.', difficulty: 'advanced' },
    { id: 'llm-ecomm', title: 'E-commerce Q&A', summary: 'Shopping assistant with product search and answers.', difficulty: 'intermediate' },
    { id: 'llm-lint', title: 'Prompt Linter', summary: 'Lint prompts for pitfalls and suggest fixes.', difficulty: 'intermediate' },
    { id: 'llm-multimodal', title: 'Multimodal Demo', summary: 'Combine text+image inputs with generation.', difficulty: 'advanced' },
    { id: 'llm-summarizer', title: 'Summarizer Service', summary: 'Summarize long content with endpoints and quotas.', difficulty: 'beginner' },
    { id: 'llm-agent-ui', title: 'Agent Orchestration UI', summary: 'Visualize agent steps, memory and tool calls.', difficulty: 'advanced' },
    { id: 'llm-live', title: 'Live Streaming Responses', summary: 'Server-sent events streaming with partial tokens.', difficulty: 'intermediate' },
    { id: 'llm-translation', title: 'Translation Tool', summary: 'Translate content with quality checks and caching.', difficulty: 'beginner' },
    { id: 'llm-policy', title: 'Policy Compliance Checker', summary: 'Check content against policies with reports.', difficulty: 'advanced' },
  ],
};

const ProjectsCatalog: React.FC = () => {
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState<CategoryKey>((params.get('cat') as CategoryKey) || 'web');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);
  const [difficulty, setDifficulty] = useState<'all'|'beginner'|'intermediate'|'advanced'>('all');

  // Derived list
  const list = useMemo(() => {
    const base = PROJECTS[selectedCategory];
    return base.filter(p => (
      (!searchQuery || p.title.toLowerCase().includes(searchQuery.toLowerCase())) &&
      (difficulty === 'all' || p.difficulty === difficulty)
    ));
  }, [selectedCategory, searchQuery, difficulty]);

  const onSelectCategory = (key: CategoryKey) => {
    setSelectedCategory(key);
    setSelectedProject(null);
    params.set('cat', key);
    setParams(params, { replace: true });
  };

  const onEnroll = (project: ProjectItem) => {
    const slug = slugify(`${selectedCategory}-${project.id}`);
    navigate(`/projects/enroll?project=${slug}&cat=${selectedCategory}`);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        {/* Top split: hero left, filters right */}
        <div className="grid lg:grid-cols-12 gap-6 mb-8">
          <section className="lg:col-span-8">
            <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6">
              {/* Intro */}
              <h1 className="text-3xl font-bold tracking-tight">Explore Real-World Projects</h1>
              <p className="text-white/70 mt-2">Build practical experience with curated projects across AI, Web, Mobile, and Cloud. Learn by doing with guided outcomes, starter repos, and support.</p>
              {/* Mini cards */}
              <div className="mt-6 grid sm:grid-cols-2 gap-4">
                <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                  <h3 className="text-base font-semibold mb-2">Advantages for Students</h3>
                  <ul className="text-white/80 text-sm space-y-2">
                    <li>Hands-on portfolio pieces</li>
                    <li>Industry-relevant problem statements</li>
                    <li>Support and review guidance</li>
                  </ul>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                  <h3 className="text-base font-semibold mb-2">How It Works</h3>
                  <ul className="text-white/80 text-sm space-y-2">
                    <li>Pick a project and enroll</li>
                    <li>Receive docs, hints, and assets</li>
                    <li>Implement and submit for feedback</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Filters panel moved to right */}
          <aside className="lg:col-span-4">
            <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6">
              {/* existing filters content */}
              {/* Search */}
              <div>
                <label className="text-sm text-white/70">Search</label>
                <input className="mt-1 w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Search projects" value={searchQuery} onChange={(e)=>setSearchQuery(e.target.value)} />
               </div>
               {/* Difficulty */}
               <div className="mt-4">
                 <label className="text-sm text-white/70">Difficulty</label>
                 <div className="mt-2 flex flex-wrap gap-2">
                   {(['beginner', 'intermediate', 'advanced'] as const).map((d) => (
                     <button key={d} onClick={() => setDifficulty(d)} className={`px-3 py-1 rounded-full border text-sm ${difficulty===d ? 'bg-white/20 border-white/40' : 'bg-white/5 border-white/20 hover:bg-white/10'}`}>{d}</button>
                   ))}
                 </div>
               </div>
               {/* Category */}
               <div className="mt-4">
                 <label className="text-sm text-white/70">Category</label>
                <div className="mt-2 flex flex-wrap gap-2">
                  {CATEGORIES.map(cat => (
                    <button key={cat.key} onClick={()=>onSelectCategory(cat.key)} className={`px-3 py-1 rounded-full border text-sm ${selectedCategory===cat.key ? 'bg-white/20 border-white/40' : 'bg-white/5 border-white/20 hover:bg-white/10'}`}>{cat.label}</button>
                  ))}
                </div>
               </div>
             </div>
           </aside>
         </div>
 
         {/* Projects list + detail section */}
         <div className="grid lg:grid-cols-12 gap-6">
           <div className="lg:col-span-8">
             <div className="grid sm:grid-cols-2 gap-4">
                 {list.map(item => (
                   <button key={item.id} onClick={()=>setSelectedProject(item)} className="text-left bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-4 hover:bg-white/10">
                     <div className="flex items-center justify-between">
                       <h3 className="font-semibold">{item.title}</h3>
                       <span className={`text-xs px-2 py-1 rounded-full border ${item.difficulty==='beginner' ? 'bg-green-500/20 border-green-400 text-green-100' : item.difficulty==='intermediate' ? 'bg-yellow-500/20 border-yellow-400 text-yellow-100' : 'bg-red-500/20 border-red-400 text-red-100'}`}>{item.difficulty}</span>
                     </div>
                     <p className="text-white/70 text-sm mt-2 line-clamp-3">{item.summary}</p>
                   </button>
                 ))}
               </div>
           </div>
           <div className="lg:col-span-4">
             <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6">
                 {selectedProject ? (
                   <div>
                     <h3 className="text-lg font-semibold">{selectedProject.title}</h3>
                     <p className="text-white/70 text-sm mt-2">{selectedProject.summary}</p>
                     <div className="mt-4 flex gap-2">
                       <button onClick={()=>onEnroll(selectedProject as ProjectItem)} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">Enroll</button>
                       <button onClick={()=>setSelectedProject(null)} className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg border border-white/20">Close</button>
                     </div>
                   </div>
                 ) : (
                   <div className="text-white/60 text-sm">Select a project to see details</div>
                 )}
               </div>
           </div>
         </div>
       </div>
     </div>
   );
};

export default ProjectsCatalog;
