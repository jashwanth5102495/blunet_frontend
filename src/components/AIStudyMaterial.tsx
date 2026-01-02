import { useState, useEffect } from 'react';
import { clsx } from 'clsx';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Search,
  Menu,
  X,
  ChevronDown,
  ChevronRight,
  CheckCircle,
  Globe,
  Monitor,
  Maximize,
  Settings,
  BookOpen,
  PlayCircle,
  FileText,
} from 'lucide-react';
import StarBorder from './StarBorder';

// --- Types ---

interface Lesson {
  title: string;
  content: string; // HTML content
  examples: string[];
  duration?: string;
}

interface Module {
  id: number;
  title: string;
  duration: string;
  description: string;
  lessons: Lesson[];
  videoLinks?: { label: string; url: string }[];
}

interface Resource {
  type: 'video' | 'document';
  title: string;
  duration: string;
  description: string;
}

// --- Data ---

const resources: Resource[] = [
  {
    type: 'video',
    title: 'AI Tools Mastery Introduction',
    duration: '15 min',
    description: 'Overview of the complete AI Tools Mastery program'
  },
  {
    type: 'document',
    title: 'Course Handbook & Guidelines',
    duration: '30 min read',
    description: 'Complete guide to course structure and requirements'
  },
  {
    type: 'video',
    title: 'Setting Up Your AI Toolkit',
    duration: '45 min',
    description: 'Step-by-step setup for all AI tools and platforms'
  },
  {
    type: 'document',
    title: 'Enterprise AI Best Practices',
    duration: '20 min read',
    description: 'Professional guidelines for AI tool usage in business'
  }
];

const courseData: Module[] = [
  {
    id: 1,
    title: 'Module 1: Prompt Engineering Mastery',
    duration: '2 weeks',
    description: 'Foundations of great prompts: structure, context, constraints, style, and JSON.',
    lessons: [
      {
        title: 'Introduction & Outcomes',
        content: `
          <h3>What you will learn</h3>
          <ul>
            <li>Design prompts that reliably achieve business outcomes</li>
            <li>Use refinement loops and critique to improve results</li>
            <li>Produce structured outputs (JSON) for apps</li>
          </ul>
          <h3>What is a prompt?</h3>
          <p>A prompt is the set of instructions you give to a generative model. It includes the role you assign, the task to perform, any input or context, constraints and rules, and the format you expect in the output. Clear prompts reduce ambiguity and produce consistent, high‑quality results.</p>
          <h3>Why draft proper prompts?</h3>
          <ul>
            <li>Improves accuracy and reduces retries</li>
            <li>Aligns outputs with business objectives and style guides</li>
            <li>Enables predictable parsing for automations and APIs</li>
          </ul>
          <h3>Why is Prompt Engineering important?</h3>
          <ul>
            <li>Transforms vague requests into measurable specifications</li>
            <li>Controls risk with constraints, validation, and governance</li>
            <li>Scales workflows by standardizing templates and JSON schemas</li>
          </ul>
        `,
        examples: [
          'Turn vague requests into clear, measurable prompts',
          'Add constraints to improve accuracy',
          'Produce JSON from natural text'
        ]
      },
      {
        title: 'Setup & Tools',
        content: `
          <h3>Accounts & Environment</h3>
          <ul>
            <li>Create accounts: OpenAI (ChatGPT), Anthropic (Claude), Stability (Stable Diffusion), Midjourney, Promptly AI (optional)</li>
            <li>Install VS Code or your preferred editor for testing prompts</li>
            <li>Use official playgrounds to iterate quickly and save templates</li>
          </ul>

          <h3>Subscriptions & Pricing Overview</h3>
          <ul>
            <li><strong>OpenAI ChatGPT</strong>: Free tier available; paid plans unlock larger context, faster responses, and tools.</li>
            <li><strong>Anthropic Claude</strong>: Free tier limited; paid plans provide higher rate limits and advanced models.</li>
            <li><strong>Midjourney</strong>: Paid subscription required for image generation; different tiers for usage volume.</li>
            <li><strong>Stable Diffusion</strong>: Free/open-source models available; cost is mainly GPU time if you run locally or in cloud.</li>
            <li><strong>Runway/Synthesia/Luma/Pika</strong>: Typically paid, with trial credits; pricing varies by plan and usage.</li>
            <li><strong>Automation (n8n/Make/Zapier)</strong>: Free tiers for small workflows; paid tiers unlock advanced features and higher limits.</li>
          </ul>
          <p class="text-gray-400 text-sm">Note: Pricing and availability change frequently. Always check official sites for current details and follow terms of service.</p>

          <h3>Setup Details</h3>
          <ul>
            <li>Store API keys securely using environment variables or a secrets manager.</li>
            <li>Create reusable prompt files/templates and version them in Git.</li>
            <li>Use JSON schemas for structured outputs and validate before consumption.</li>
          </ul>

          <h3>VPN Access (for regions where tools aren’t released)</h3>
          <div class="bg-gray-900/50 border border-gray-700 rounded p-3">
            <p class="mb-2">If a tool isn’t available in India, you can consider a reputable VPN:</p>
            <ul>
              <li>Choose a trusted provider with servers in supported countries.</li>
              <li>Connect to a region where the tool is available, then access the site.</li>
              <li>Respect local laws and each tool’s terms of service; avoid policy violations.</li>
            </ul>
          </div>
        `,
        examples: [
          'Create OpenAI and Anthropic accounts',
          'Set up local environment variables',
          'Test connectivity to APIs'
        ]
      },
      {
        title: 'Prompt Formats, Types & Examples',
        content: `
            <h3>Prompt Format</h3>
            <div class="bg-gray-900/50 border border-gray-700 rounded p-3 mb-4">
              <pre class="whitespace-pre-wrap break-words overflow-x-auto text-sm text-gray-100">Subject + Style + Composition + Lighting + Mood + Constraints (aspect, seed, background, post-processing)</pre>
            </div>
            <h3>Types of Prompts</h3>
            <ul>
              <li>Descriptive: Focus on subject and details</li>
              <li>Stylistic: Emphasize art style or brand look</li>
              <li>Instructional: Specify framing, aspect, constraints</li>
              <li>Reference-based: Include links or named styles</li>
            </ul>
            <h3>RICE for Image Prompts</h3>
            <p><strong>Role</strong>: Art director; <strong>Intent</strong>: brand hero; <strong>Context & Constraints</strong>: style, composition, aspect; <strong>Examples</strong>: reference pairs.</p>
            <div class="bg-gray-900/50 border border-gray-700 rounded p-3 mb-4">
              <strong>Template</strong>
              <pre class="whitespace-pre-wrap break-words overflow-x-auto text-sm text-gray-100">{
  "role": "Art director",
  "intent": "Create a product hero image",
  "context": "Brand: minimal, modern; Subject: wireless earbuds",
  "constraints": ["3:2 aspect", "soft daylight", "center composition", "plain background"],
  "examples": [{ "refStyle": "https://example.com/moodboard.jpg", "notes": "high-key lighting" }]
}</pre>
            </div>
            <div class="bg-gray-900/50 border border-gray-700 rounded p-3">
              <strong>DALL·E / Midjourney Prompt</strong>
              <pre class="whitespace-pre-wrap break-words overflow-x-auto text-sm text-gray-100">Minimal product hero of wireless earbuds, soft daylight, high-key lighting, center composition, plain background, 3:2 aspect, brand style: modern minimal, crisp detail</pre>
            </div>
            <br /><br />
            <h4>Proper Prompt Example</h4>
            <div class="bg-gray-900/50 border border-gray-700 rounded p-3 mb-4">
              <pre class="whitespace-pre-wrap break-words overflow-x-auto text-sm text-gray-100">Subject: Wireless earbuds on clean background
Style: Modern minimal, commercial product photography
Composition: Centered, ample negative space
Lighting: Soft daylight, high-key
Constraints: 3:2 aspect, plain background, seed=12345
Post: Subtle sharpening</pre>
            </div>
            <h4>Expected Image Preview</h4>
            <div class="bg-gray-800/50 border border-gray-700 rounded p-3 text-center">
              <div class="w-full h-40 bg-gray-700 rounded flex items-center justify-center">
                <span class="text-gray-300 text-sm">Preview: Clean product hero, centered; soft daylight; plain background (3:2)</span>
              </div>
            </div>
            <br /><br />
            <h4>Expected Result</h4>
            <div class="bg-gray-900/50 border border-gray-700 rounded p-3">
              <pre class="whitespace-pre-wrap break-words overflow-x-auto text-sm text-gray-100">Image: Clean product hero, centered
Lighting: Soft daylight, high-key
Background: Plain, minimal
Aspect: 3:2
Variants: 4 with seed tracking</pre>
            </div>
        `,
        examples: [
          'Write a role+intent prompt and compare with a vague prompt',
          'Switch temperature and observe output differences',
          'Add a schema and validate the returned JSON'
        ]
      }
    ],
    videoLinks: [
      { label: 'Andrej Karpathy — Zero to Hero Playlist', url: 'https://www.youtube.com/watch?v=VMj-3S1tku0&list=PLAqhIrjkxbuWI23v9cThsA9GvCAUhRvKZ' },
      { label: 'OpenAI — Official YouTube Channel', url: 'https://www.youtube.com/@OpenAI' },
      { label: 'AssemblyAI — Prompt Engineering Tips', url: 'https://www.youtube.com/@AssemblyAI' }
    ]
  },
  {
    id: 2,
    title: 'Module 2: Image Creation Suite',
    duration: '3 weeks',
    description: 'Create production-ready images for brands and marketing.',
    lessons: [
      {
        title: 'Introduction',
        content: `
          <h3>How LLMs and Image Models Create Images</h3>
          <p>
            Modern image generation pairs <strong>LLMs</strong> (for understanding and structuring your intent) with
            <strong>image models</strong> (for rendering pixels). LLMs help you craft precise, constraint‑driven prompts
            and convert them to structured parameters. Image models—such as diffusion or transformer‑based generators—
            turn that structured description into images by iteratively denoising latent representations until the
            result matches your prompt.
          </p>
          <h3>What actually happens</h3>
          <ol>
            <li><strong>Intent</strong>: You describe the subject, style, mood, and constraints.</li>
            <li><strong>LLM assist</strong>: The LLM clarifies details, expands descriptors, and outputs a structured prompt (often JSON).</li>
            <li><strong>Image generation</strong>: The image model (e.g., DALL·E, Midjourney, Stable Diffusion) uses text embeddings and guidance scales to produce candidates.</li>
            <li><strong>Refine</strong>: You adjust parameters (composition, lighting, seed, negative prompts) and regenerate or upscale.</li>
          </ol>
          <h3>Tools in this suite</h3>
          <ul>
            <li><strong>DALL·E 3</strong>: Brand‑safe outputs with strong text understanding.</li>
            <li><strong>Midjourney</strong>: High‑fidelity, stylized imagery with rich parameter controls.</li>
            <li><strong>Stable Diffusion</strong>: Full customization via models, LoRA, ControlNet, seeds, and pipelines.</li>
          </ul>
        `,
        examples: [
          'Compare outputs across the three tools',
          'Pick the right tool for the brief',
          'Define style guides for consistency'
        ]
      },
      {
        title: 'Setup & Tools',
        content: `
          <h3>Accounts & Environment</h3>
          <ul>
            <li>Create accounts: DALL·E, Midjourney, Stability AI</li>
            <li>Use official web UIs or Discord (Midjourney)</li>
            <li>Organize assets in folders; track seeds/params</li>
          </ul>
          <h3>Subscriptions & Pricing</h3>
          <ul>
            <li>DALL·E: pay-per-use via credits; check current pricing</li>
            <li>Midjourney: subscription tiers by usage volume</li>
            <li>Stable Diffusion: local (free) or cloud GPU costs</li>
          </ul>
          <h3>Open-Source Image Tools</h3>
          <ul>
            <li>Stable Diffusion WebUI (AUTOMATIC1111)</li>
            <li>ComfyUI (node-based workflows)</li>
            <li>InvokeAI (user-friendly SD interface)</li>
            <li>Fooocus (prompt-focused SD)</li>
            <li>Diffusers (Python library by Hugging Face)</li>
          </ul>
          <h3>VPN Access (if tools are region-restricted)</h3>
          <div class="bg-gray-900/50 border border-gray-700 rounded p-3">
            <p class="mb-2">Choose reputable providers, connect to supported regions, and follow terms of service.</p>
          </div>
        `,
        examples: [
          'Track seeds for reproducible variants',
          'Save style guides and prompt templates',
          'Store references and color palettes'
        ]
      },
      {
        title: 'Best Practices & Guardrails',
        content: `
          <h3>Quality & Ethics</h3>
          <ul>
            <li>Use references responsibly; avoid copyrighted styles unless licensed</li>
            <li>Document prompts, params, seeds, and post-processing</li>
            <li>Upscale and retouch for final delivery</li>
          </ul>
          <h3>What not to use</h3>
          <ul>
            <li>Avoid trademarked or copyrighted brand assets without permission</li>
            <li>Do not use disallowed terms or impersonate artists</li>
            <li>Avoid overly vague prompts (causes inconsistent results)</li>
          </ul>
          <h3>Tips for best outcomes</h3>
          <ul>
            <li>Be explicit: subject, style, composition, lighting, constraints</li>
            <li>Use seeds to reproduce and iterate variants</li>
            <li>Track parameters; maintain a prompt library</li>
            <li>Post-process: upscale, denoise, color-correct when needed</li>
          </ul>
        `,
        examples: [
          'Create a deliverable checklist',
          'Document licensing per asset',
          'Standardize export settings'
        ]
      }
    ],
    videoLinks: [
      { label: 'OpenAI — DALL·E 3 Overview', url: 'https://www.youtube.com/@OpenAI' },
      { label: 'Stability AI — Stable Diffusion Tutorials', url: 'https://www.youtube.com/@StabilityAI' }
    ]
  },
  {
    id: 3,
    title: 'Module 3: Video Creation & Animation',
    duration: '3 weeks',
    description: 'Generate, edit, and animate videos with modern AI tools.',
    lessons: [
      {
        title: 'Introduction',
        content: `
          <h3>How AI videos are generated</h3>
          <p>
            Modern AI video systems extend image generation with <em>temporal consistency</em> and motion. Under the hood, they use
            diffusion or transformer-based models that synthesize frames and maintain coherence across time using motion guidance,
            optical flow, and conditioning (camera paths, prompts, or reference images).
          </p>
          <ul>
            <li><strong>Text‑to‑Video</strong>: frames are generated from a text prompt; models balance appearance and motion.</li>
            <li><strong>Image‑to‑Video</strong>: a reference image is animated; appearance is preserved while motion is synthesized.</li>
            <li><strong>Control & Conditioning</strong>: camera trajectory, masks/inpainting, depth/edges, style LoRAs, and seeds.</li>
            <li><strong>Pipeline</strong>: prompt → frame synthesis → temporal smoothing → upscale → encode (e.g., H.264/H.265).</li>
          </ul>
          <p>
            The result is a short clip (typically 4–12 seconds) where each frame is consistent with the previous ones.
            Duration, resolution, and motion complexity depend on the tool and your subscription tier.
          </p>
        `,
        examples: [
          'Storyboard a short brand film',
          'Compare tools for a specific brief',
          'Design animated brand openers'
        ]
      },
      {
        title: 'Installation & Setup',
        content: `
          <h3>Tools & Availability</h3>
          <ul>
            <li><strong>Google Veo</strong> (Veo 2, Veo 3): limited access; text‑to‑video and image‑to‑video demos.</li>
            <li><strong>Seedens 3 Video AI</strong>: stylized motion generation with plan-based limits.</li>
            <li><strong>Kling AI</strong>: cinematic camera paths; regional sign‑up requirements may apply.</li>
            <li><strong>Runway Gen‑3</strong>, <strong>Luma Dream Machine</strong>, <strong>Pika</strong>: widely available, fast iteration.</li>
            <li><strong>Stable Video Diffusion</strong> (open source): extend SD images into motion for experiments.</li>
          </ul>
          <h3>Setup Checklist</h3>
          <ul>
            <li>Create accounts and choose a plan (free vs pro) for higher resolution/duration.</li>
            <li>Enable brand assets: logo, fonts, palettes, and reference images; prepare project folders.</li>
            <li>Install <code>ffmpeg</code> for trimming, stitching, re‑encoding, and audio normalization.</li>
            <li>Know limits: clip length, daily generations, aspect ratios (16:9, 9:16, 1:1), usage policies.</li>
            <li>Respect content restrictions and licensing; avoid disallowed likenesses or copyrighted footage.</li>
          </ul>
        `,
        examples: [
          'Import brand assets for consistency',
          'Prepare scripts and voice settings',
          'Organize project files and exports'
        ]
      },
      {
        title: 'How to Use: Quickstarts',
        content: `
          <h3>Draft prompts the right way</h3>
          <p>Teach both <strong>Text‑to‑Video</strong> and <strong>Image‑to‑Video</strong>. Use role, intent, motion, timing, composition, and constraints.</p>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="bg-gray-900/50 border border-gray-700 rounded p-3">
              <div class="text-sm text-gray-400 mb-2">Text‑to‑Video: Template</div>
              <pre class="whitespace-pre-wrap break-words overflow-x-auto text-sm text-gray-100">Role: cinematographer
Intent: 10–12s hero clip showcasing [product]
Look: cinematic, soft natural light, subtle grain
Motion: slow dolly‑in on subject, slight parallax; camera path center → close
Composition: rule of thirds; subject centered at start; reveal logo at 80%
Constraints: no flicker, no jittery edges, brand‑safe visuals
Output: 1080p 16:9, bitrate 10 Mbps, seed=42</pre>
            </div>
            <div class="bg-gray-900/50 border border-gray-700 rounded p-3">
              <div class="text-sm text-gray-400 mb-2">Image‑to‑Video: Template</div>
              <pre class="whitespace-pre-wrap break-words overflow-x-auto text-sm text-gray-100">Reference: high‑res product photo (PNG)
Intent: 8–10s motion with camera orbit and gentle lighting changes
Preserve: exact colors, logo sharpness, product geometry
Motion: slow orbit (15°), ease‑in‑out; add shallow DOF shift
Masks: lock background; animate reflections only
Output: 1080p square or 9:16 variant; seed=1337</pre>
            </div>
          </div>
        `,
        examples: [
          'Create 10–20s promotional clips',
          'Generate multilingual onboarding content',
          'Create transitions for social posts'
        ]
      }
    ],
    videoLinks: [
      { label: 'Runway ML — Gen-2 Tutorials', url: 'https://www.youtube.com/@RunwayML' },
      { label: 'Luma AI — Dream Machine', url: 'https://www.youtube.com/@LumaLabsAI' },
      { label: 'Pika Labs — Motion Design', url: 'https://www.youtube.com/@PikaLabs' }
    ]
  },
  {
    id: 4,
    title: 'Module 4: AI Agents & Automations',
    duration: '3 weeks',
    description: 'Use n8n to orchestrate AI calls with triggers, functions, and HTTP nodes.',
    lessons: [
      {
        title: 'Introduction',
        content: `
          <h3>What is an Agent?</h3>
          <p>An AI agent plans tasks, calls tools/APIs, uses memory, and returns results autonomously — like a smart orchestrator connecting your LLM to email, CRMs, docs, and databases.</p>
          <img src="/img/agents-overview.svg" alt="AI Agent overview diagram" class="w-full h-auto rounded mb-3" />
          <h3>What agents can automate</h3>
          <ul>
            <li>Summarize support tickets and route them to teams</li>
            <li>Generate reports from APIs and publish to Sheets/Docs</li>
            <li>Process forms, enrich leads, and notify Slack/Email</li>
          </ul>
        `,
        examples: [
          'Summarize tickets and route to teams',
          'Generate weekly reports automatically',
          'Classify leads and notify sales'
        ]
      },
      {
        title: 'Installation & Setup',
        content: `
          <h3>Tools to build agents</h3>
          <img src="/img/agents-tools.svg" alt="Tools and integrations for agents" class="w-full h-auto rounded mb-3" />
          <ul>
            <li><strong>n8n</strong> (self-host or cloud): visual workflow builder with nodes for APIs, email, databases.</li>
            <li><strong>Zapier/Make</strong>: fast integrations for common apps and triggers.</li>
            <li><strong>Python</strong>: custom agents using packages like <code>requests</code>, <code>pydantic</code>, <code>fastapi</code>, <code>langchain</code> or <code>crewai</code>, <code>sqlalchemy</code>.</li>
          </ul>
          <h3>n8n Setup</h3>
          <ol>
            <li>Create an account (cloud) or run locally via Docker.</li>
            <li>Add credentials (API keys, OAuth) and test nodes.</li>
            <li>Create a workflow: trigger → action nodes → conditional → output.</li>
          </ol>
        `,
        examples: [
          'Store secrets securely',
          'Create n8n credentials and test nodes',
          'Set webhook triggers for scenarios'
        ]
      },
      {
        title: 'How to Use: Build a workflow',
        content: `
          <h3>Build a Support Summarizer (n8n)</h3>
          <img src="/img/agents-workflow.svg" alt="Agent workflow diagram" class="w-full h-auto rounded mb-3" />
          <ol>
            <li><strong>Trigger</strong>: HTTP Webhook node receives a support ticket (JSON).</li>
            <li><strong>Validate</strong>: Code node validates required fields (email, subject, body).</li>
            <li><strong>LLM Summarize</strong>: OpenAI/Claude node creates a concise summary and priority.</li>
            <li><strong>Route</strong>: If priority=high, send Slack; else create a row in Google Sheets.</li>
            <li><strong>Notify</strong>: Gmail node sends an acknowledgement email.</li>
            <li><strong>Persist</strong>: PostgreSQL node stores ticket + summary for analytics.</li>
          </ol>
        `,
        examples: [
          'Lead enrichment pipeline',
          'Content generation and publishing',
          'Notification routing system'
        ]
      }
    ],
    videoLinks: [
      { label: 'n8n — Automation Tutorials', url: 'https://www.youtube.com/@n8n-io' },
      { label: 'Zapier — Integrations & Workflows', url: 'https://www.youtube.com/@Zapier' },
      { label: 'Make.com — Advanced Scenarios', url: 'https://www.youtube.com/@MakeHQ' }
    ]
  },
  {
    id: 5,
    title: 'Module 5: Trading & Stock Insights with AI',
    duration: '2 weeks',
    description: 'Use AI to accelerate reading, summarization, and idea generation for trading.',
    lessons: [
      {
        title: 'Introduction & Disclaimer',
        content: `
          <h3>AI tools for trading research</h3>
          <img src="/img/trading-intro.svg" alt="AI Trading overview" class="w-full h-auto rounded mb-3" />
          <p><strong>Educational only.</strong> This module focuses on research workflows and reproducible analysis. Nothing here is financial advice or a guarantee of performance. Treat outputs as hypotheses to be validated with transparent, data-driven methods.</p>
          <p>Use AI to accelerate reading, summarization, and idea generation. Think of it as a research assistant that helps you:
            <br/>— Aggregate and summarize market news and filings
            <br/>— Brainstorm signals and features to test (e.g., momentum, volatility regimes, sentiment shifts)
            <br/>— Draft structured research notes with clear assumptions, caveats, and references
          </p>
        `,
        examples: [
          'Write Grok prompts for regime analysis',
          'Draft a personal risk policy',
          'List biases and guardrails upfront'
        ]
      },
      {
        title: 'Installation & Setup',
        content: `
          <h3>Platforms: crypto & stocks</h3>
          <img src="/img/trading-setup.svg" alt="Trading platforms setup" class="w-full h-auto rounded mb-3" />
          <ul>
            <li><strong>Crypto</strong>: Binance, Coinbase, Kraken — use API keys and sandbox/testnet where available; never store raw keys in notebooks.</li>
            <li><strong>Stocks</strong>: Alpaca (paper trading), Polygon/Yahoo Finance for data; TradingView for charting and quick visual validation.</li>
            <li><strong>Environment</strong>: Python + venv, notebooks; pin dependencies, cache data responsibly, and record all data sources.</li>
          </ul>
        `,
        examples: [
          'Configure paper trading accounts',
          'Fetch prices and headlines safely',
          'Set up a research notebook'
        ]
      }
    ],
    videoLinks: [
      { label: 'QuantConnect — Quant Tutorials', url: 'https://www.youtube.com/@QuantConnect' }
    ]
  },
  {
    id: 6,
    title: 'Module 6: Security with AI',
    duration: '2 weeks',
    description: 'AI for Security — responsibly applied to reconnaissance, log analysis, and anomaly detection.',
    lessons: [
      {
        title: 'Introduction & Why AI Matters',
        content: `
          <h3>AI for Security — responsibly applied</h3>
          <p>AI accelerates reconnaissance, log analysis, anomaly detection, and documentation. Used responsibly, it helps defenders map assets, spot misconfigurations, and triage events faster. This module is <strong>education-focused</strong> — practice in an isolated lab, follow local laws, and obtain permission for any testing.</p>
          <ul>
            <li>Use AI to summarize findings, generate checklists, and suggest next steps.</li>
            <li>Integrate model outputs with established tools; never rely on AI alone.</li>
            <li>Maintain ethics: consent, least privilege, data minimization, and disclosure policies.</li>
          </ul>
        `,
        examples: [
          'Generate a recon plan from asset inventory',
          'Summarize logs for anomalies',
          'Draft a remediation checklist'
        ]
      },
      {
        title: 'Reconnaissance Tools: Nmap & recon-ng',
        content: `
          <h3>Discover and profile assets</h3>
          <p>Nmap provides port scanning, service fingerprinting, and scriptable checks (NSE). recon-ng offers a framework for OSINT modules and data enrichment.</p>
          <div class="bg-gray-900/50 border border-gray-700 rounded p-3 mb-3">
            <strong>Examples</strong>
            <pre class="whitespace-pre-wrap break-words overflow-x-auto text-sm text-gray-100"># Nmap quick scan
nmap -sV -T4 10.0.0.0/24

# Nmap with NSE scripts
nmap --script vuln -p- target.example</pre>
          </div>
          <p>Use AI to summarize findings, propose next modules, and track evidence. Store outputs in a structured format (JSON) for later review.</p>
        `,
        examples: [
          'Run Nmap scans and summarize services',
          'Use recon-ng to expand hosts and domains',
          'Create a JSON evidence log'
        ]
      }
    ]
  },
  {
    id: 7,
    title: 'Module 7: Coding with A.I',
    duration: '3 weeks',
    description: 'Use AI to plan, scaffold, code, test, and refactor applications.',
    lessons: [
      {
        title: 'Introduction',
        content: `
          <h3>Use AI as a coding partner</h3>
          <ul>
            <li>Plan features and break tasks down</li>
            <li>Generate scaffolds and boilerplate</li>
            <li>Write tests and refactor iteratively</li>
          </ul>
        `,
        examples: [
          'Turn a product idea into task list',
          'Generate a project scaffold',
          'Refactor code with AI suggestions'
        ]
      },
      {
        title: 'Installation & Setup',
        content: `
          <h3>Dev environment</h3>
          <ul>
            <li>Install Node.js, Git, and VS Code</li>
            <li>Configure an AI assistant or API keys</li>
            <li>Create a repo and run a starter project</li>
          </ul>
          <pre>npm create vite@latest myapp -- --template react-ts\ncd myapp && npm install && npm run dev</pre>
        `,
        examples: [
          'Initialize repo and CI',
          'Set environment variables securely',
          'Run dev server and tests'
        ]
      }
    ]
  }
];

// --- Components ---

const Header = () => {
  const navigate = useNavigate();

  return (
    <header className="fixed top-0 left-0 w-full h-[60px] z-50 bg-[#1e1e1e] border-b border-[#333] flex items-center justify-between px-4 shadow-md">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
          {/* Placeholder for Logo */}
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-xs">BN</span>
          </div>
          <span className="text-gray-300 text-sm font-semibold hidden md:block">BluNet Academy</span>
        </div>
        <div className="h-6 w-[1px] bg-gray-600 mx-2 hidden md:block"></div>
        <h1 className="text-white text-lg font-medium truncate">Ethical Hacker & AI Mastery</h1>
      </div>

      <div className="flex items-center gap-4 text-gray-400">
        <button className="flex items-center gap-1 hover:text-white transition-colors text-sm">
          <Globe className="w-4 h-4" />
          <span className="hidden sm:inline">EN</span>
        </button>
        <button className="hover:text-white transition-colors" aria-label="Accessibility">
          <Settings className="w-5 h-5" />
        </button>
        <button className="hover:text-white transition-colors" aria-label="Fullscreen">
          <Maximize className="w-5 h-5" />
        </button>
        <button
          onClick={() => navigate('/')}
          className="hover:text-white transition-colors"
          aria-label="Close"
        >
          <X className="w-6 h-6" />
        </button>
      </div>
    </header>
  );
};

const Sidebar = ({
  activeTab,
  setActiveTab,
  activeModuleId,
  setActiveModuleId,
  activeLessonIndex,
  setActiveLessonIndex,
  completedLessons
}: {
  activeTab: 'outline' | 'resources';
  setActiveTab: (tab: 'outline' | 'resources') => void;
  activeModuleId: number;
  setActiveModuleId: (id: number) => void;
  activeLessonIndex: number;
  setActiveLessonIndex: (index: number) => void;
  completedLessons: Set<string>;
}) => {
  const [expandedModules, setExpandedModules] = useState<Set<number>>(new Set([activeModuleId]));
  const [searchQuery, setSearchQuery] = useState('');

  // Auto-expand the active module when it changes
  useEffect(() => {
    setExpandedModules(prev => {
      const newSet = new Set(prev);
      newSet.add(activeModuleId);
      return newSet;
    });
  }, [activeModuleId]);

  const toggleModule = (id: number) => {
    setExpandedModules(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const filteredModules = courseData.filter(m =>
    m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.lessons.some(l => l.title.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="fixed top-[60px] left-0 w-[300px] h-[calc(100vh-60px)] bg-[#252526] border-r border-[#333] flex flex-col z-40 transition-transform duration-300 transform md:translate-x-0 -translate-x-full md:block hidden">
      {/* Tabs */}
      <div className="flex border-b border-[#333]">
        <button
          onClick={() => setActiveTab('outline')}
          className={`flex-1 py-3 text-sm font-medium transition-colors border-b-2 ${activeTab === 'outline'
            ? 'border-[#00bceb] text-white bg-[#1e1e1e]'
            : 'border-transparent text-gray-400 hover:text-gray-200 hover:bg-[#2d2d2d]'
            }`}
        >
          <div className="flex items-center justify-center gap-2">
            <BookOpen className="w-4 h-4" />
            Course Outline
          </div>
        </button>
        <button
          onClick={() => setActiveTab('resources')}
          className={`flex-1 py-3 text-sm font-medium transition-colors border-b-2 ${activeTab === 'resources'
            ? 'border-[#00bceb] text-white bg-[#1e1e1e]'
            : 'border-transparent text-gray-400 hover:text-gray-200 hover:bg-[#2d2d2d]'
            }`}
        >
          <div className="flex items-center justify-center gap-2">
            <FileText className="w-4 h-4" />
            Resources
          </div>
        </button>
      </div>

      {/* Search */}
      <div className="p-4 border-b border-[#333]">
        <div className="relative">
          <input
            type="text"
            placeholder="Search course outline"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#1e1e1e] border border-[#333] rounded px-3 py-2 pl-9 text-sm text-white focus:outline-none focus:border-[#00bceb] transition-colors"
          />
          <Search className="absolute left-2.5 top-2.5 w-4 h-4 text-gray-500" />
        </div>
      </div>

      {/* Content List */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {activeTab === 'outline' ? (
          <div className="pb-4">
            <div className="px-4 py-3 flex items-center justify-between hover:bg-[#2d2d2d] cursor-pointer transition-colors border-b border-[#333]">
              <span className="text-sm font-medium text-white">Course Introduction</span>
              <CheckCircle className="w-4 h-4 text-green-500" />
            </div>

            {filteredModules.map(module => {
              const isExpanded = expandedModules.has(module.id);
              const isActive = activeModuleId === module.id;
              // Calculate progress for this module
              const moduleCompletedLessons = module.lessons.filter((_, idx) =>
                completedLessons.has(`${module.id}-${idx}`)
              ).length;
              const progressPercent = Math.round((moduleCompletedLessons / module.lessons.length) * 100);

              return (
                <div key={module.id} className="border-b border-[#333]">
                  <div
                    onClick={() => toggleModule(module.id)}
                    className={`px-4 py-3 cursor-pointer hover:bg-[#2d2d2d] transition-colors ${isActive ? 'bg-[#2d2d2d]' : ''}`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <h3 className="text-sm font-medium text-gray-200 leading-tight mb-1">{module.title}</h3>
                        <div className="w-full bg-gray-700 h-1 rounded-full overflow-hidden">
                          <div
                            className="bg-[#00bceb] h-full transition-all duration-300"
                            style={{ width: `${progressPercent}%` }}
                          />
                        </div>
                      </div>
                      {isExpanded ? (
                        <ChevronDown className="w-4 h-4 text-gray-400 mt-1" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-gray-400 mt-1" />
                      )}
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="bg-[#1e1e1e]">
                      {module.lessons.map((lesson, idx) => {
                        const lessonKey = `${module.id}-${idx}`;
                        const isCompleted = completedLessons.has(lessonKey);
                        const isLessonActive = isActive && activeLessonIndex === idx;

                        return (
                          <div
                            key={idx}
                            onClick={() => {
                              setActiveModuleId(module.id);
                              setActiveLessonIndex(idx);
                            }}
                            className={clsx(
                              'pl-8 pr-4 py-3 cursor-pointer flex items-center gap-3 transition-colors border-l-[3px]',
                              isLessonActive
                                ? 'border-[#00bceb] bg-[#252526]'
                                : 'border-transparent hover:bg-[#252526] text-gray-400'
                            )}
                          >
                            <div className={`w-4 h-4 flex-shrink-0 ${isCompleted ? 'text-green-500' : 'text-gray-600'}`}>
                              {isCompleted ? <CheckCircle className="w-full h-full" /> : <div className="w-3.5 h-3.5 rounded-full border border-gray-600 ml-[1px]" />}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className={clsx(
                                'text-sm truncate',
                                isLessonActive ? 'text-white font-medium' : 'text-gray-400'
                              )}>
                                {module.id}.{idx + 1} {lesson.title}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-4">
            {resources.map((res, idx) => (
              <div key={idx} className="mb-4 p-3 bg-[#2d2d2d] rounded hover:bg-[#333] transition-colors cursor-pointer border border-[#333]">
                <div className="flex items-center gap-2 mb-2">
                  {res.type === 'video' ? <PlayCircle className="w-4 h-4 text-[#00bceb]" /> : <FileText className="w-4 h-4 text-orange-400" />}
                  <span className="text-xs font-medium text-gray-400 uppercase">{res.type}</span>
                </div>
                <h4 className="text-sm font-medium text-white mb-1">{res.title}</h4>
                <p className="text-xs text-gray-400 mb-2">{res.description}</p>
                <span className="text-xs text-gray-500">{res.duration}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const AIStudyMaterial = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { moduleId } = useParams();

  // State
  const [activeTab, setActiveTab] = useState<'outline' | 'resources'>('outline');
  const [activeModuleId, setActiveModuleId] = useState(1);
  const [activeLessonIndex, setActiveLessonIndex] = useState(0);
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(new Set());

  // Handle URL parameters
  useEffect(() => {
    if (moduleId) {
      // Parse "module-1" -> 1
      const id = parseInt(moduleId.replace('module-', ''), 10);
      if (!isNaN(id)) {
        setActiveModuleId(id);
        setActiveLessonIndex(0);
      }
    }
  }, [moduleId]);

  // Handle navigation from other pages (legacy state support)
  useEffect(() => {
    if (location.state && location.state.moduleId) {
      setActiveModuleId(location.state.moduleId);
      setActiveLessonIndex(0); // Default to first lesson
    }
  }, [location.state]);

  // Mark lesson as completed when visited
  useEffect(() => {
    setCompletedLessons(prev => {
      const newSet = new Set(prev);
      newSet.add(`${activeModuleId}-${activeLessonIndex}`);
      return newSet;
    });
  }, [activeModuleId, activeLessonIndex]);

  const currentModule = courseData.find(m => m.id === activeModuleId) || courseData[0];
  const currentLesson = currentModule.lessons[activeLessonIndex];

  // Previous/Next Navigation
  const handlePrev = () => {
    if (activeLessonIndex > 0) {
      setActiveLessonIndex(activeLessonIndex - 1);
    } else {
      // Go to previous module's last lesson
      const prevModuleIndex = courseData.findIndex(m => m.id === activeModuleId) - 1;
      if (prevModuleIndex >= 0) {
        const prevModule = courseData[prevModuleIndex];
        setActiveModuleId(prevModule.id);
        setActiveLessonIndex(prevModule.lessons.length - 1);
      }
    }
  };

  const handleNext = () => {
    if (activeLessonIndex < currentModule.lessons.length - 1) {
      setActiveLessonIndex(activeLessonIndex + 1);
    } else {
      // Go to next module's first lesson
      const nextModuleIndex = courseData.findIndex(m => m.id === activeModuleId) + 1;
      if (nextModuleIndex < courseData.length) {
        const nextModule = courseData[nextModuleIndex];
        setActiveModuleId(nextModule.id);
        setActiveLessonIndex(0);
      }
    }
  };

  return (
    <div className="bg-[#121212] min-h-screen text-gray-200 font-sans selection:bg-[#00bceb] selection:text-black">
      <Header />
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab}
        activeModuleId={activeModuleId}
        setActiveModuleId={setActiveModuleId}
        activeLessonIndex={activeLessonIndex}
        setActiveLessonIndex={setActiveLessonIndex}
        completedLessons={completedLessons}
      />

      {/* Main Content Viewer */}
      <main className="md:ml-[300px] mt-[60px] h-[calc(100vh-60px)] overflow-y-auto bg-[#121212]">
        {/* Breadcrumb Bar */}
        <div className="sticky top-0 z-30 bg-[#1e1e1e]/95 backdrop-blur border-b border-[#333] px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <Menu className="w-5 h-5 md:hidden cursor-pointer" />
            <span className="hidden sm:inline hover:text-white cursor-pointer" onClick={() => setActiveModuleId(1)}>Course Home</span>
            <ChevronRight className="w-4 h-4 hidden sm:block" />
            <span className="truncate max-w-[150px] sm:max-w-none hover:text-white cursor-pointer">{currentModule.title}</span>
            <ChevronRight className="w-4 h-4" />
            <span className="text-white font-medium truncate">{currentModule.id}.{activeLessonIndex + 1} {currentLesson.title}</span>
          </div>
          <div className="flex items-center gap-3">
             {/* Navigation Arrows */}
             <button 
               onClick={handlePrev}
               disabled={activeModuleId === 1 && activeLessonIndex === 0}
               className="p-1.5 rounded hover:bg-[#333] disabled:opacity-30 transition-colors"
             >
               <ChevronDown className="w-5 h-5 rotate-90" />
             </button>
             <button 
               onClick={handleNext}
               disabled={activeModuleId === courseData[courseData.length - 1].id && activeLessonIndex === currentModule.lessons.length - 1}
               className="p-1.5 rounded hover:bg-[#333] disabled:opacity-30 transition-colors"
             >
               <ChevronDown className="w-5 h-5 -rotate-90" />
             </button>
          </div>
        </div>

        {/* Hero Content Section */}
        <div className="relative w-full h-[300px] md:h-[400px] bg-gray-900 overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-transparent to-black/40 z-10" />
          <img 
            src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop" 
            alt="Lab Environment" 
            className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700 ease-out"
          />
          <div className="absolute bottom-0 left-0 w-full p-8 z-20">
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-2 drop-shadow-lg">
              {currentModule.id}.{activeLessonIndex + 1} {currentLesson.title}
            </h1>
            <p className="text-gray-300 flex items-center gap-2 animate-pulse">
              Scroll to begin <ChevronDown className="w-4 h-4" />
            </p>
          </div>
        </div>

        {/* Content Body */}
        <div className="max-w-4xl mx-auto px-6 py-12">
          {/* Lesson Content */}
          <article className="prose prose-invert prose-lg max-w-none">
            <div dangerouslySetInnerHTML={{ __html: currentLesson.content }} />
            
            {/* Special Component for Module 2: Image Creation Suite */}
            {activeModuleId === 2 && activeLessonIndex === 0 && (
              <div className="mt-8 not-prose">
                <div className="p-6 bg-gradient-to-br from-blue-900/20 to-purple-900/20 border border-blue-500/20 rounded-xl">
                   <h4 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                     <span className="text-2xl">🚀</span> Try It Now!
                   </h4>
                   <p className="text-gray-300 mb-6">Ready to create your own professional content? Try these cutting-edge AI tools:</p>
                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <StarBorder<'a'>
                        as="a" 
                        href="https://openai.com/dall-e-3" 
                        target="_blank" 
                        className="block text-center"
                        color="cyan"
                        speed="5s"
                      >
                        <div className="flex items-center justify-center gap-2 text-white">
                          <span>Try DALL-E 3</span>
                        </div>
                      </StarBorder>
                      <StarBorder<'a'>
                        as="a" 
                        href="https://www.midjourney.com" 
                        target="_blank" 
                        className="block text-center"
                        color="purple"
                        speed="5s"
                      >
                         <div className="flex items-center justify-center gap-2 text-white">
                           <span>Try Midjourney</span>
                         </div>
                      </StarBorder>
                   </div>
                </div>
              </div>
            )}
          </article>

          {/* Examples Section */}
          {currentLesson.examples && currentLesson.examples.length > 0 && (
             <div className="mt-12 pt-8 border-t border-[#333]">
               <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                 <Monitor className="w-5 h-5 text-[#00bceb]" />
                 Practical Exercises
               </h3>
               <div className="grid gap-4">
                 {currentLesson.examples.map((example, idx) => (
                   <div key={idx} className="bg-[#1e1e1e] border border-[#333] rounded-lg p-4 hover:border-[#00bceb]/50 transition-colors group cursor-pointer">
                     <div className="flex items-start gap-3">
                       <div className="w-6 h-6 rounded-full bg-[#2d2d2d] flex items-center justify-center text-xs text-[#00bceb] font-mono mt-0.5 group-hover:bg-[#00bceb] group-hover:text-black transition-colors">
                         {idx + 1}
                       </div>
                       <p className="text-gray-300 group-hover:text-white transition-colors">{example}</p>
                     </div>
                   </div>
                 ))}
               </div>
             </div>
          )}

          {/* Next Lesson Button */}
          <div className="mt-16 flex justify-end">
            <button 
              onClick={handleNext}
              className="group flex items-center gap-3 px-6 py-3 bg-[#00bceb] text-black font-semibold rounded-full hover:bg-[#00a0c9] transition-all transform hover:scale-105"
            >
              {activeModuleId === courseData[courseData.length - 1].id && activeLessonIndex === currentModule.lessons.length - 1 
                ? 'Finish Course' 
                : 'Next Lesson'
              }
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
        
        {/* Footer */}
        <footer className="border-t border-[#333] py-8 mt-12 bg-[#1e1e1e]">
          <div className="max-w-4xl mx-auto px-6 text-center text-gray-500 text-sm">
            <p>&copy; 2024 BluNet Academy. All rights reserved.</p>
            <p className="mt-2">Inspired by Cisco Networking Academy Learning Experience.</p>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default AIStudyMaterial;
