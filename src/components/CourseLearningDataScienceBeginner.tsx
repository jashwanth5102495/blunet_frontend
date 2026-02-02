import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { courseIntros } from '../data/courseIntroData';
import { askLLM, ChatMessage } from '../services/llm';
import { Mic, Send, BookOpen, Search, CheckCircle, ChevronDown, ChevronRight, ChevronLeft, Terminal, Code, Play, RotateCcw, Loader2 } from 'lucide-react';
import { clsx } from 'clsx';

// --- Types ---

interface Lesson {
  title: string;
  content: string; // HTML content
  duration?: string;
  syntax?: { title: string; content: string }[];
  terminalCommands?: string[];
  terminalGuide?: string; // HTML content for terminal instructions
  initialCode?: string;
}

interface Module {
  id: string; // e.g., 'module-1'
  title: string;
  duration: string;
  description: string;
  lessons: Lesson[];
}

// --- Data ---

const courseData: Module[] = [
  {
    id: 'module-1',
    title: 'Module 1 — Introduction to Data Science',
    duration: '1 week',
    description: 'Overview of Data Science, roles, lifecycle, and tools.',
    lessons: [
      {
        title: 'What is Data Science?',
        content: `
          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">1. Definition of Data Science</h2>
          <p class="mb-4 text-gray-700 dark:text-gray-300">Data Science is an interdisciplinary field that focuses on extracting meaningful insights, patterns, and knowledge from data using a combination of:</p>
          <ul class="list-disc pl-6 mb-4 text-gray-700 dark:text-gray-300 space-y-1">
            <li>Mathematics & Statistics</li>
            <li>Programming</li>
            <li>Domain knowledge</li>
            <li>Machine Learning & Artificial Intelligence</li>
          </ul>
          <p class="mb-4 text-gray-700 dark:text-gray-300">In simple terms:</p>
          <p class="mb-4 text-gray-700 dark:text-gray-300"><strong>Data Science turns raw data into useful information that supports decision-making.</strong></p>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">2. Why Data Science Exists</h2>
          <p class="mb-4 text-gray-700 dark:text-gray-300">In today’s digital world:</p>
          <ul class="list-disc pl-6 mb-4 text-gray-700 dark:text-gray-300 space-y-1">
            <li>Every app, website, sensor, and business generates huge amounts of data</li>
            <li>Raw data alone is useless unless it is analyzed</li>
            <li>Organizations need data-driven decisions, not guesses</li>
          </ul>
          <p class="mb-4 text-gray-700 dark:text-gray-300">Data Science exists to:</p>
          <ul class="list-disc pl-6 mb-4 text-gray-700 dark:text-gray-300 space-y-1">
            <li>Analyze large datasets</li>
            <li>Discover hidden patterns</li>
            <li>Predict future outcomes</li>
            <li>Automate intelligent decisions</li>
          </ul>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">3. What Kind of Problems Does Data Science Solve?</h2>
          <p class="mb-4 text-gray-700 dark:text-gray-300">Data Science helps answer questions like:</p>
          <ul class="list-disc pl-6 mb-4 text-gray-700 dark:text-gray-300 space-y-1">
            <li>Why are sales decreasing?</li>
            <li>Which customers are likely to leave?</li>
            <li>What product should be recommended to a user?</li>
            <li>Will a loan applicant default?</li>
            <li>Can we predict future demand?</li>
          </ul>
          <p class="mb-4 text-gray-700 dark:text-gray-300">These problems are solved using data, logic, and models, not intuition.</p>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">4. Core Components of Data Science</h2>
          <p class="mb-4 text-gray-700 dark:text-gray-300">Data Science is not a single skill—it is a combination of multiple disciplines:</p>
          <ul class="list-disc pl-6 mb-4 text-gray-700 dark:text-gray-300 space-y-1">
            <li><strong>Data Collection:</strong> Gathering data from databases, files, APIs, sensors, or the web</li>
            <li><strong>Data Cleaning:</strong> Removing errors, duplicates, and missing values</li>
            <li><strong>Data Analysis:</strong> Understanding trends and patterns in data</li>
            <li><strong>Data Visualization:</strong> Presenting insights using charts and graphs</li>
            <li><strong>Machine Learning:</strong> Teaching machines to learn from data and make predictions</li>
            <li><strong>Decision Making:</strong> Using insights to support business or real-world decisions</li>
          </ul>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">5. Types of Data Used in Data Science</h2>
          <p class="mb-4 text-gray-700 dark:text-gray-300">Data Scientists work with:</p>
          <ul class="list-disc pl-6 mb-4 text-gray-700 dark:text-gray-300 space-y-1">
            <li>Numbers (sales, prices, scores)</li>
            <li>Text (reviews, messages, emails)</li>
            <li>Images (photos, medical scans)</li>
            <li>Videos (CCTV, social media)</li>
            <li>Logs and sensor data</li>
          </ul>
          <p class="mb-4 text-gray-700 dark:text-gray-300">This makes Data Science applicable across every industry.</p>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">6. Data Science in Simple Words (Beginner Friendly)</h2>
          <p class="mb-4 text-gray-700 dark:text-gray-300">Think of Data Science like this:</p>
          <ul class="list-disc pl-6 mb-4 text-gray-700 dark:text-gray-300 space-y-1">
            <li><strong>Data</strong> = Raw ingredients</li>
            <li><strong>Data Scientist</strong> = Chef</li>
            <li><strong>Tools & Algorithms</strong> = Cooking techniques</li>
            <li><strong>Insights</strong> = Final dish</li>
          </ul>
          <p class="mb-4 text-gray-700 dark:text-gray-300">A Data Scientist takes raw data and cooks it into useful insights.</p>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">7. Key Characteristics of Data Science</h2>
          <ul class="list-disc pl-6 mb-4 text-gray-700 dark:text-gray-300 space-y-1">
            <li>Data-driven</li>
            <li>Problem-oriented</li>
            <li>Requires logical thinking</li>
            <li>Uses programming and mathematics</li>
            <li>Focuses on real-world impact</li>
          </ul>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">8. Importance of Data Science Today</h2>
          <p class="mb-4 text-gray-700 dark:text-gray-300">Data Science is critical because:</p>
          <ul class="list-disc pl-6 mb-4 text-gray-700 dark:text-gray-300 space-y-1">
            <li>Businesses rely on analytics</li>
            <li>AI systems are built on data</li>
            <li>Automation depends on predictions</li>
            <li>Digital transformation is data-centered</li>
          </ul>
          <p class="mb-4 text-gray-700 dark:text-gray-300">Almost every modern system today is powered by data science.</p>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">9. Summary</h2>
          <ul class="list-disc pl-6 mb-4 text-gray-700 dark:text-gray-300 space-y-1">
            <li>Data Science is the science of extracting insights from data</li>
            <li>It combines programming, statistics, and machine learning</li>
            <li>It helps organizations make smart, data-backed decisions</li>
            <li>It is one of the most in-demand skills globally</li>
          </ul>
        `,
        duration: '15 min',
        syntax: [
          {
            title: "Conceptual Representation of Data Science Workflow",
            content: "Data → Cleaning → Analysis → Visualization → Model → Insights → Decision"
          },
          {
            title: "Basic Example of Data Science Thinking",
            content: "Problem: Predict house prices\\nSteps:\\n1. Collect house data\\n2. Clean missing values\\n3. Analyze price trends\\n4. Build prediction model\\n5. Predict future prices"
          },
          {
            title: "Common Terminologies",
            content: "Dataset: Collection of data\\nFeature: Input variable\\nTarget: Output variable\\nModel: Mathematical representation\\nPrediction: Estimated outcome"
          },
          {
            title: "Pseudo-Code Representation",
            content: "Load Data\\nClean Data\\nAnalyze Data\\nBuild Model\\nGenerate Insights"
          }
        ],
        initialCode: `# Example 1: Understanding Data as Input
# Sample data: daily sales values
sales = [1200, 1500, 1700, 1600, 1800]

# Print raw data
print("Raw Sales Data:", sales)

# Example 2: Simple Data Insight
# Calculate total and average sales
total_sales = sum(sales)
average_sales = total_sales / len(sales)

print("Total Sales:", total_sales)
print("Average Sales:", average_sales)

# Example 3: Simple Decision from Data
# Decision making based on data
if average_sales > 1500:
    print("Sales performance is good.")
else:
    print("Sales performance needs improvement.")
`
      },
      {
        title: 'Evolution of Data Science',
        content: `
          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">1. Introduction to the Evolution of Data Science</h2>
          <p class="mb-4 text-gray-700 dark:text-gray-300">Data Science did not appear overnight. It evolved gradually as:</p>
          <ul class="list-disc pl-6 mb-4 text-gray-700 dark:text-gray-300 space-y-1">
            <li>Data volume increased</li>
            <li>Computing power improved</li>
            <li>Businesses demanded smarter decisions</li>
          </ul>
          <p class="mb-4 text-gray-700 dark:text-gray-300">The evolution of Data Science is closely tied to the history of data, statistics, computers, and artificial intelligence.</p>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">2. Early Stage: Traditional Data Analysis (Before 1970s)</h2>
          <p class="mb-4 text-gray-700 dark:text-gray-300">In the early days:</p>
          <ul class="list-disc pl-6 mb-4 text-gray-700 dark:text-gray-300 space-y-1">
            <li>Data was small and structured</li>
            <li>Analysis was done manually</li>
            <li>Focus was on basic statistics</li>
          </ul>
          <p class="mb-4 text-gray-700 dark:text-gray-300">Key characteristics:</p>
          <ul class="list-disc pl-6 mb-4 text-gray-700 dark:text-gray-300 space-y-1">
            <li>Paper-based records</li>
            <li>Simple calculations</li>
            <li>Limited storage</li>
            <li>No automation</li>
          </ul>
          <p class="mb-4 text-gray-700 dark:text-gray-300">📌 <strong>Primary Users:</strong> Statisticians, economists, researchers</p>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">3. Database Era (1970s – 1990s)</h2>
          <p class="mb-4 text-gray-700 dark:text-gray-300">With the introduction of computers:</p>
          <ul class="list-disc pl-6 mb-4 text-gray-700 dark:text-gray-300 space-y-1">
            <li>Data storage moved to databases</li>
            <li>Businesses started storing digital records</li>
            <li>SQL became popular</li>
          </ul>
          <p class="mb-4 text-gray-700 dark:text-gray-300">Key developments:</p>
          <ul class="list-disc pl-6 mb-4 text-gray-700 dark:text-gray-300 space-y-1">
            <li>Relational databases</li>
            <li>Structured data tables</li>
            <li>Query-based analysis</li>
          </ul>
          <p class="mb-4 text-gray-700 dark:text-gray-300">📌 <strong>Focus:</strong> “What happened?” (Descriptive analytics)</p>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">4. Business Intelligence Era (1990s – 2005)</h2>
          <p class="mb-4 text-gray-700 dark:text-gray-300">As businesses grew:</p>
          <ul class="list-disc pl-6 mb-4 text-gray-700 dark:text-gray-300 space-y-1">
            <li>Large volumes of transactional data emerged</li>
            <li>Tools were created to analyze business performance</li>
          </ul>
          <p class="mb-4 text-gray-700 dark:text-gray-300">Key advancements:</p>
          <ul class="list-disc pl-6 mb-4 text-gray-700 dark:text-gray-300 space-y-1">
            <li>Data warehouses</li>
            <li>OLAP systems</li>
            <li>Reporting dashboards</li>
            <li>Excel-based analytics</li>
          </ul>
          <p class="mb-4 text-gray-700 dark:text-gray-300">📌 <strong>Focus:</strong> “What is happening in the business?”</p>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">5. Big Data Era (2005 – 2012)</h2>
          <p class="mb-4 text-gray-700 dark:text-gray-300">The rise of:</p>
          <ul class="list-disc pl-6 mb-4 text-gray-700 dark:text-gray-300 space-y-1">
            <li>Internet</li>
            <li>Social media</li>
            <li>Smartphones</li>
            <li>Sensors and IoT</li>
          </ul>
          <p class="mb-4 text-gray-700 dark:text-gray-300">Resulted in:</p>
          <ul class="list-disc pl-6 mb-4 text-gray-700 dark:text-gray-300 space-y-1">
            <li>Massive amounts of unstructured data</li>
            <li>Traditional tools becoming insufficient</li>
          </ul>
          <p class="mb-4 text-gray-700 dark:text-gray-300">Key technologies:</p>
          <ul class="list-disc pl-6 mb-4 text-gray-700 dark:text-gray-300 space-y-1">
            <li>Hadoop</li>
            <li>Distributed computing</li>
            <li>NoSQL databases</li>
          </ul>
          <p class="mb-4 text-gray-700 dark:text-gray-300">📌 <strong>Focus:</strong> “How do we store and process huge data?”</p>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">6. Machine Learning & AI Era (2012 – Present)</h2>
          <p class="mb-4 text-gray-700 dark:text-gray-300">This phase marked the true rise of Data Science.</p>
          <p class="mb-4 text-gray-700 dark:text-gray-300">Key changes:</p>
          <ul class="list-disc pl-6 mb-4 text-gray-700 dark:text-gray-300 space-y-1">
            <li>Algorithms learned patterns automatically</li>
            <li>Predictive and prescriptive analytics emerged</li>
            <li>AI systems became practical</li>
          </ul>
          <p class="mb-4 text-gray-700 dark:text-gray-300">Technologies involved:</p>
          <ul class="list-disc pl-6 mb-4 text-gray-700 dark:text-gray-300 space-y-1">
            <li>Machine Learning</li>
            <li>Deep Learning</li>
            <li>Cloud computing</li>
            <li>GPUs</li>
          </ul>
          <p class="mb-4 text-gray-700 dark:text-gray-300">📌 <strong>Focus:</strong> “What will happen next?” and “What should we do?”</p>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">7. Modern Data Science (Present Day)</h2>
          <p class="mb-4 text-gray-700 dark:text-gray-300">Today, Data Science includes:</p>
          <ul class="list-disc pl-6 mb-4 text-gray-700 dark:text-gray-300 space-y-1">
            <li>End-to-end pipelines</li>
            <li>Real-time analytics</li>
            <li>Automated decision-making</li>
            <li>AI-powered applications</li>
          </ul>
          <p class="mb-4 text-gray-700 dark:text-gray-300">Modern systems:</p>
          <ul class="list-disc pl-6 mb-4 text-gray-700 dark:text-gray-300 space-y-1">
            <li>Recommendation engines</li>
            <li>Fraud detection</li>
            <li>Autonomous systems</li>
            <li>Intelligent chatbots</li>
          </ul>
          <p class="mb-4 text-gray-700 dark:text-gray-300">Data Science has become a core pillar of digital transformation.</p>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">8. Key Factors Driving Evolution</h2>
          <p class="mb-4 text-gray-700 dark:text-gray-300">The evolution of Data Science was driven by:</p>
          <ul class="list-disc pl-6 mb-4 text-gray-700 dark:text-gray-300 space-y-1">
            <li>Increase in data volume</li>
            <li>Faster computing power</li>
            <li>Cloud infrastructure</li>
            <li>Open-source tools</li>
            <li>Business demand for insights</li>
          </ul>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">9. Summary of Evolution</h2>
          <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse mb-4 text-gray-700 dark:text-gray-300">
            <thead>
              <tr>
                <th class="border-b border-gray-600 p-2">Era</th>
                <th class="border-b border-gray-600 p-2">Key Focus</th>
              </tr>
            </thead>
            <tbody>
              <tr><td class="p-2 border-b border-gray-700">Traditional Statistics</td><td class="p-2 border-b border-gray-700">Manual analysis</td></tr>
              <tr><td class="p-2 border-b border-gray-700">Databases</td><td class="p-2 border-b border-gray-700">Data storage & queries</td></tr>
              <tr><td class="p-2 border-b border-gray-700">Business Intelligence</td><td class="p-2 border-b border-gray-700">Reports & dashboards</td></tr>
              <tr><td class="p-2 border-b border-gray-700">Big Data</td><td class="p-2 border-b border-gray-700">Scalability</td></tr>
              <tr><td class="p-2 border-b border-gray-700">AI & ML</td><td class="p-2 border-b border-gray-700">Predictions & automation</td></tr>
            </tbody>
          </table>
          </div>
        `,
        duration: '15 min',
        syntax: [
          {
            title: "Timeline Representation",
            content: "Statistics → Databases → Business Intelligence → Big Data → Machine Learning → AI"
          },
          {
            title: "Evolution Based on Analytics Type",
            content: "Descriptive → Diagnostic → Predictive → Prescriptive"
          },
          {
            title: "Conceptual Flow",
            content: "Data Collection\\n     ↓\\nData Storage\\n     ↓\\nData Analysis\\n     ↓\\nPrediction\\n     ↓\\nAutomated Decisions"
          },
          {
            title: "Key Terminologies",
            content: "Descriptive Analytics: Explains past data\\nPredictive Analytics: Forecasts future\\nPrescriptive Analytics: Suggests actions\\nBig Data: Extremely large datasets\\nAI: Systems that mimic intelligence"
          }
        ],
        initialCode: `# Example 1: Traditional Statistical Analysis
# Basic statistical analysis
data = [10, 12, 15, 18, 20]

print("Minimum:", min(data))
print("Maximum:", max(data))
print("Average:", sum(data) / len(data))


# 📌 Explanation:
# This represents early-stage data analysis using basic statistics.

# Example 2: Pattern Detection (Modern Thinking)
# Identify trend
if data[-1] > data[0]:
    print("Data shows an increasing trend.")
else:
    print("No clear trend detected.")


# 📌 Explanation:
# This reflects modern analytical thinking, where patterns matter.

# Example 3: Predictive Idea (Conceptual)
# Simple future prediction logic
next_value = data[-1] + 2
print("Predicted next value:", next_value)


# 📌 Explanation:
# This demonstrates how evolution moved towards prediction, a core goal of modern Data Science.
`
      },
      {
        title: 'Data Science vs Data Analytics vs AI vs ML',
        content: `
          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">1. Understanding the Difference</h2>
          <p class="mb-4 text-gray-700 dark:text-gray-300">In today’s technology-driven world, the terms Data Science, Data Analytics, Artificial Intelligence (AI), and Machine Learning (ML) are often used interchangeably. However, each of these fields has a distinct purpose, scope, and role. Understanding their differences is critical for beginners, as it helps in choosing the right career path and applying the correct approach to problem-solving.</p>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">2. What is Data Science?</h2>
          <p class="mb-4 text-gray-700 dark:text-gray-300">Data Science is a broad interdisciplinary field that focuses on extracting meaningful insights from data. It combines statistics, programming, machine learning, and domain expertise to analyze both structured and unstructured data. Data Science covers the entire lifecycle of data, from collection and cleaning to analysis, modeling, and decision-making.</p>
          <p class="mb-4 text-gray-700 dark:text-gray-300"><strong>Key Points:</strong></p>
          <ul class="list-disc pl-6 mb-4 text-gray-700 dark:text-gray-300 space-y-1">
            <li>Works with large and complex datasets</li>
            <li>Combines statistics, programming, and ML</li>
            <li>Focuses on insight generation and prediction</li>
            <li>End-to-end data handling process</li>
          </ul>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">3. What is Data Analytics?</h2>
          <p class="mb-4 text-gray-700 dark:text-gray-300">Data Analytics is a subset of Data Science that focuses primarily on analyzing historical data to understand what has already happened. The main goal is to identify trends, patterns, and insights that help organizations improve current operations and make informed decisions.</p>
          <p class="mb-4 text-gray-700 dark:text-gray-300"><strong>Key Points:</strong></p>
          <ul class="list-disc pl-6 mb-4 text-gray-700 dark:text-gray-300 space-y-1">
            <li>Focuses on past and present data</li>
            <li>Uses descriptive and diagnostic analysis</li>
            <li>Involves dashboards, reports, and KPIs</li>
            <li>Limited predictive capabilities</li>
          </ul>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">4. What is Artificial Intelligence (AI)?</h2>
          <p class="mb-4 text-gray-700 dark:text-gray-300">Artificial Intelligence refers to the development of systems that can simulate human intelligence. AI systems can perform tasks such as reasoning, decision-making, speech recognition, and image understanding. AI is a broader concept that includes multiple technologies, including machine learning.</p>
          <p class="mb-4 text-gray-700 dark:text-gray-300"><strong>Key Points:</strong></p>
          <ul class="list-disc pl-6 mb-4 text-gray-700 dark:text-gray-300 space-y-1">
            <li>Mimics human intelligence</li>
            <li>Focuses on automation and decision-making</li>
            <li>Includes ML, NLP, robotics, and vision</li>
            <li>Goal is intelligent behavior</li>
          </ul>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">5. What is Machine Learning (ML)?</h2>
          <p class="mb-4 text-gray-700 dark:text-gray-300">Machine Learning is a subset of AI that enables systems to learn from data without being explicitly programmed. Instead of following fixed rules, ML models identify patterns in data and improve their performance over time through experience.</p>
          <p class="mb-4 text-gray-700 dark:text-gray-300"><strong>Key Points:</strong></p>
          <ul class="list-disc pl-6 mb-4 text-gray-700 dark:text-gray-300 space-y-1">
            <li>Learns patterns from data</li>
            <li>Improves performance over time</li>
            <li>Uses algorithms and models</li>
            <li>Powers predictive systems</li>
          </ul>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">6. How These Fields Are Connected</h2>
          <p class="mb-4 text-gray-700 dark:text-gray-300">These fields are hierarchically connected. Data Science uses Machine Learning to build predictive models. Machine Learning is a technique used within Artificial Intelligence. Data Analytics focuses on insights from existing data and often serves as the foundation for Data Science projects.</p>
          <p class="mb-4 text-gray-700 dark:text-gray-300"><strong>Relationship Summary:</strong></p>
          <ul class="list-disc pl-6 mb-4 text-gray-700 dark:text-gray-300 space-y-1">
            <li>Data Analytics ⊂ Data Science</li>
            <li>Machine Learning ⊂ Artificial Intelligence</li>
            <li>Data Science uses both Analytics and ML</li>
          </ul>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">7. Real-World Example (Simple Explanation)</h2>
          <p class="mb-4 text-gray-700 dark:text-gray-300">Consider an online shopping platform:</p>
          <ul class="list-disc pl-6 mb-4 text-gray-700 dark:text-gray-300 space-y-1">
            <li><strong>Data Analytics:</strong> Analyzes last month’s sales report</li>
            <li><strong>Data Science:</strong> Predicts future customer purchases</li>
            <li><strong>Machine Learning:</strong> Builds recommendation models</li>
            <li><strong>AI:</strong> Powers smart chatbots and voice assistants</li>
          </ul>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">8. Summary</h2>
          <p class="mb-4 text-gray-700 dark:text-gray-300">While these terms are related, they serve different roles in solving data-driven problems. Understanding these differences helps learners build a strong foundation and choose the right learning path.</p>
        `,
        duration: '20 min',
        syntax: [
          {
            title: "Conceptual Comparison Table",
            content: "Aspect | Data Analytics | Data Science | Machine Learning | Artificial Intelligence\\nScope | Narrow | Broad | Medium | Very Broad\\nFocus | Past data | Insights & prediction | Learning from data | Intelligent behavior\\nData Type | Structured | Structured & unstructured | Large datasets | All data types\\nOutcome | Reports | Models & insights | Predictions | Automation"
          },
          {
            title: "Hierarchy Representation",
            content: "Artificial Intelligence\\n        ↓\\nMachine Learning\\n        ↓\\nData Science\\n        ↓\\nData Analytics"
          },
          {
            title: "Problem-Solving Approach",
            content: "Data Analytics → Understand Past\\nData Science → Predict Future\\nMachine Learning → Learn Patterns\\nAI → Act Intelligently"
          }
        ],
        initialCode: `# Example 1: Data Analytics (Descriptive)
sales = [1200, 1500, 1800, 1600, 2000]

average_sales = sum(sales) / len(sales)
print("Average Sales:", average_sales)


# 📌 Explanation:
# This is Data Analytics, focused on understanding historical data.

# Example 2: Simple Data Science Logic (Prediction Concept)
# Simple future prediction logic
predicted_sales = sales[-1] + 200
print("Predicted Next Sales:", predicted_sales)


# 📌 Explanation:
# This demonstrates Data Science thinking, where future outcomes are estimated.

# Example 3: ML Idea (Pattern-Based Decision)
if predicted_sales > average_sales:
    print("Sales trend is increasing.")
else:
    print("Sales trend is stable.")


# 📌 Explanation:
# This reflects Machine Learning logic, where decisions are driven by patterns.
`
      },
      {
        title: 'Real-World Applications of Data Science',
        content: `
          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">1. Introduction</h2>
          <p class="mb-4 text-gray-700 dark:text-gray-300">Data Science is not just a theoretical concept; it is deeply integrated into our daily lives and modern industries. Almost every digital service we use today—whether online shopping, banking, healthcare, or entertainment—relies on Data Science to function efficiently. By analyzing data and extracting insights, organizations can improve performance, reduce risks, and deliver personalized experiences.</p>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">2. Data Science in Business and Marketing</h2>
          <p class="mb-4 text-gray-700 dark:text-gray-300">In the business world, Data Science is widely used to understand customer behavior and improve decision-making. Companies analyze customer data to identify buying patterns, predict demand, and optimize pricing strategies. Marketing teams use data-driven insights to target the right audience and measure campaign performance accurately.</p>
          <p class="mb-4 text-gray-700 dark:text-gray-300"><strong>Key Applications:</strong></p>
          <ul class="list-disc pl-6 mb-4 text-gray-700 dark:text-gray-300 space-y-1">
            <li>Customer segmentation</li>
            <li>Sales forecasting</li>
            <li>Personalized marketing</li>
            <li>Churn prediction</li>
          </ul>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">3. Data Science in Finance and Banking</h2>
          <p class="mb-4 text-gray-700 dark:text-gray-300">The finance sector uses Data Science to manage risk, detect fraud, and automate financial decisions. Banks and financial institutions analyze transaction data to identify suspicious activities and assess creditworthiness. Data Science also plays a major role in algorithmic trading and financial forecasting.</p>
          <p class="mb-4 text-gray-700 dark:text-gray-300"><strong>Key Applications:</strong></p>
          <ul class="list-disc pl-6 mb-4 text-gray-700 dark:text-gray-300 space-y-1">
            <li>Fraud detection</li>
            <li>Credit scoring</li>
            <li>Risk analysis</li>
            <li>Stock price prediction</li>
          </ul>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">4. Data Science in Healthcare</h2>
          <p class="mb-4 text-gray-700 dark:text-gray-300">In healthcare, Data Science helps improve patient care and operational efficiency. Medical data such as patient records, lab reports, and medical images are analyzed to assist doctors in diagnosis and treatment planning. Predictive models can also forecast disease outbreaks and patient risks.</p>
          <p class="mb-4 text-gray-700 dark:text-gray-300"><strong>Key Applications:</strong></p>
          <ul class="list-disc pl-6 mb-4 text-gray-700 dark:text-gray-300 space-y-1">
            <li>Disease prediction</li>
            <li>Medical image analysis</li>
            <li>Patient monitoring</li>
            <li>Drug discovery</li>
          </ul>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">5. Data Science in E-Commerce and Retail</h2>
          <p class="mb-4 text-gray-700 dark:text-gray-300">E-commerce platforms heavily rely on Data Science to enhance customer experience. Recommendation systems suggest products based on user behavior, while demand prediction helps manage inventory efficiently. Pricing strategies are also optimized using data-driven insights.</p>
          <p class="mb-4 text-gray-700 dark:text-gray-300"><strong>Key Applications:</strong></p>
          <ul class="list-disc pl-6 mb-4 text-gray-700 dark:text-gray-300 space-y-1">
            <li>Product recommendations</li>
            <li>Inventory management</li>
            <li>Price optimization</li>
            <li>Customer behavior analysis</li>
          </ul>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">6. Data Science in Social Media and Entertainment</h2>
          <p class="mb-4 text-gray-700 dark:text-gray-300">Social media platforms and streaming services use Data Science to personalize content and improve user engagement. By analyzing user interactions, platforms can recommend relevant videos, posts, or music, keeping users engaged for longer periods.</p>
          <p class="mb-4 text-gray-700 dark:text-gray-300"><strong>Key Applications:</strong></p>
          <ul class="list-disc pl-6 mb-4 text-gray-700 dark:text-gray-300 space-y-1">
            <li>Content recommendation</li>
            <li>Sentiment analysis</li>
            <li>User engagement tracking</li>
            <li>Trend detection</li>
          </ul>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">7. Data Science in Transportation and Smart Cities</h2>
          <p class="mb-4 text-gray-700 dark:text-gray-300">Transportation systems use Data Science to optimize routes, reduce traffic congestion, and improve safety. Smart city initiatives analyze data from sensors and cameras to enhance urban planning and resource management.</p>
          <p class="mb-4 text-gray-700 dark:text-gray-300"><strong>Key Applications:</strong></p>
          <ul class="list-disc pl-6 mb-4 text-gray-700 dark:text-gray-300 space-y-1">
            <li>Traffic prediction</li>
            <li>Route optimization</li>
            <li>Autonomous vehicles</li>
            <li>Smart infrastructure planning</li>
          </ul>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">8. Data Science in Education</h2>
          <p class="mb-4 text-gray-700 dark:text-gray-300">Educational platforms use Data Science to personalize learning experiences and track student performance. Predictive analytics helps identify students who may need additional support.</p>
          <p class="mb-4 text-gray-700 dark:text-gray-300"><strong>Key Applications:</strong></p>
          <ul class="list-disc pl-6 mb-4 text-gray-700 dark:text-gray-300 space-y-1">
            <li>Personalized learning</li>
            <li>Student performance analysis</li>
            <li>Dropout prediction</li>
            <li>Online exam analytics</li>
          </ul>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">9. Summary</h2>
          <p class="mb-4 text-gray-700 dark:text-gray-300">Data Science impacts almost every industry by enabling data-driven decisions, automation, and intelligent systems. Its applications continue to expand as data availability and technology grow.</p>
        `,
        duration: '15 min',
        syntax: [
          {
            title: "Application Flow Representation",
            content: "Data Collection\\n     ↓\\nData Analysis\\n     ↓\\nPattern Detection\\n     ↓\\nPrediction / Recommendation\\n     ↓\\nBusiness Decision"
          },
          {
            title: "Industry vs Application Mapping",
            content: "Industry | Data Science Application\\nBusiness | Sales & customer insights\\nFinance | Fraud & risk detection\\nHealthcare | Disease prediction\\nRetail | Recommendation systems\\nMedia | Content personalization\\nTransport | Traffic optimization\\nEducation | Learning analytics"
          },
          {
            title: "Decision-Making Model",
            content: "Historical Data → Insights → Prediction → Action"
          }
        ],
        initialCode: `# Example 1: Business Sales Analysis
monthly_sales = [50000, 52000, 58000, 60000, 65000]

average_sales = sum(monthly_sales) / len(monthly_sales)
print("Average Monthly Sales:", average_sales)


# 📌 Explanation:
# Used in business analytics to understand performance.

# Example 2: Simple Recommendation Logic (E-Commerce)
user_views = ["Laptop", "Laptop", "Phone", "Laptop"]

if user_views.count("Laptop") > 2:
    print("Recommend Laptop accessories.")
else:
    print("Recommend trending products.")


# 📌 Explanation:
# Basic idea behind recommendation systems.

# Example 3: Risk Detection Concept (Finance)
transaction_amount = 95000

if transaction_amount > 50000:
    print("High-value transaction: Review required.")
else:
    print("Transaction is normal.")


# 📌 Explanation:
# Illustrates fraud detection logic used in banking systems.
`
      },
      {
        title: 'Roles in Data Science (Analyst, Scientist, Engineer)',
        content: `
          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">1. Introduction</h2>
          <p class="mb-4 text-gray-700 dark:text-gray-300">Data Science is a broad field, and it is not handled by a single role. In real-world organizations, different professionals handle different stages of the data lifecycle. The most common roles are Data Analyst, Data Scientist, and Data Engineer. Each role has a unique responsibility, skill set, and career path, but all work together to convert raw data into valuable insights.</p>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">2. Data Analyst</h2>
          <p class="mb-4 text-gray-700 dark:text-gray-300">A Data Analyst focuses on understanding historical data and transforming it into meaningful reports and dashboards. The main goal of a Data Analyst is to help businesses understand what has already happened and why it happened. This role is often the entry point into the data domain.</p>
          <p class="mb-2 font-semibold text-gray-900 dark:text-white">Key Responsibilities:</p>
          <ul class="list-disc pl-6 mb-4 text-gray-700 dark:text-gray-300 space-y-1">
            <li>Collecting and cleaning structured data</li>
            <li>Analyzing past trends and patterns</li>
            <li>Creating reports and dashboards</li>
            <li>Supporting business decision-making</li>
          </ul>
          <p class="mb-2 font-semibold text-gray-900 dark:text-white">Key Skills:</p>
          <ul class="list-disc pl-6 mb-4 text-gray-700 dark:text-gray-300 space-y-1">
            <li>SQL and Excel</li>
            <li>Basic Python or R</li>
            <li>Data visualization tools</li>
            <li>Business understanding</li>
          </ul>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">3. Data Scientist</h2>
          <p class="mb-4 text-gray-700 dark:text-gray-300">A Data Scientist works on advanced data analysis and predictive modeling. This role goes beyond reporting and focuses on predicting future outcomes and solving complex business problems using machine learning and statistical techniques.</p>
          <p class="mb-2 font-semibold text-gray-900 dark:text-white">Key Responsibilities:</p>
          <ul class="list-disc pl-6 mb-4 text-gray-700 dark:text-gray-300 space-y-1">
            <li>Analyzing large and complex datasets</li>
            <li>Building machine learning models</li>
            <li>Performing statistical analysis</li>
            <li>Extracting actionable insights</li>
          </ul>
          <p class="mb-2 font-semibold text-gray-900 dark:text-white">Key Skills:</p>
          <ul class="list-disc pl-6 mb-4 text-gray-700 dark:text-gray-300 space-y-1">
            <li>Python or R programming</li>
            <li>Statistics and probability</li>
            <li>Machine learning algorithms</li>
            <li>Data visualization and storytelling</li>
          </ul>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">4. Data Engineer</h2>
          <p class="mb-4 text-gray-700 dark:text-gray-300">A Data Engineer focuses on data infrastructure and pipelines. This role ensures that data is collected, stored, processed, and made available in a reliable and scalable manner. Data Engineers build the foundation that Analysts and Scientists rely on.</p>
          <p class="mb-2 font-semibold text-gray-900 dark:text-white">Key Responsibilities:</p>
          <ul class="list-disc pl-6 mb-4 text-gray-700 dark:text-gray-300 space-y-1">
            <li>Designing data pipelines</li>
            <li>Managing databases and data warehouses</li>
            <li>Handling big data systems</li>
            <li>Ensuring data quality and availability</li>
          </ul>
          <p class="mb-2 font-semibold text-gray-900 dark:text-white">Key Skills:</p>
          <ul class="list-disc pl-6 mb-4 text-gray-700 dark:text-gray-300 space-y-1">
            <li>SQL and database systems</li>
            <li>Python, Java, or Scala</li>
            <li>Big data tools (Hadoop, Spark)</li>
            <li>Cloud platforms</li>
          </ul>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">5. How These Roles Work Together</h2>
          <p class="mb-4 text-gray-700 dark:text-gray-300">In a real organization:</p>
          <ul class="list-disc pl-6 mb-4 text-gray-700 dark:text-gray-300 space-y-1">
            <li><strong>Data Engineers</strong> prepare and manage the data</li>
            <li><strong>Data Analysts</strong> analyze historical data and create reports</li>
            <li><strong>Data Scientists</strong> build predictive and intelligent models</li>
          </ul>
          <p class="mb-4 text-gray-700 dark:text-gray-300">Each role is essential, and none can function effectively without the others.</p>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">6. Choosing the Right Role</h2>
          <p class="mb-4 text-gray-700 dark:text-gray-300">Choosing a role depends on:</p>
          <ul class="list-disc pl-6 mb-4 text-gray-700 dark:text-gray-300 space-y-1">
            <li>Interest in coding vs analysis</li>
            <li>Interest in infrastructure vs modeling</li>
            <li>Business focus vs technical depth</li>
          </ul>
          <p class="mb-4 text-gray-700 dark:text-gray-300">There is no “better” role—each has strong career demand and growth.</p>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">7. Summary</h2>
          <ul class="list-disc pl-6 mb-4 text-gray-700 dark:text-gray-300 space-y-1">
            <li>Data roles are specialized but interconnected.</li>
            <li>Understanding these roles helps beginners plan their learning path and career goals effectively.</li>
          </ul>
        `,
        duration: '25 min',
        syntax: [
          {
            title: "Role Comparison Table",
            content: "Aspect | Data Analyst | Data Scientist | Data Engineer\\nPrimary Focus | Past data | Future prediction | Data systems\\nTools | Excel, SQL, BI tools | Python, ML, Statistics | SQL, Spark, Cloud\\nOutput | Reports & dashboards | Models & insights | Data pipelines\\nComplexity | Medium | High | High"
          },
          {
            title: "Data Lifecycle Mapping",
            content: "Data Engineer → Data Analyst → Data Scientist"
          },
          {
            title: "Problem Perspective",
            content: "What happened?  → Data Analyst\\nWhat will happen? → Data Scientist\\nHow is data delivered? → Data Engineer"
          }
        ],
        initialCode: `# 💡 Simple examples to show how each role interacts with data.

# Example 1: Data Analyst View
sales = [1200, 1400, 1600, 1800]

average_sales = sum(sales) / len(sales)
print("Average Sales:", average_sales)


# 📌 Explanation:
# Shows historical data analysis, typical for a Data Analyst.

# Example 2: Data Scientist View (Prediction Concept)
predicted_sales = sales[-1] + 200
print("Predicted Next Sales:", predicted_sales)


# 📌 Explanation:
# Represents predictive modeling thinking of a Data Scientist.

# Example 3: Data Engineer View (Data Handling Concept)
raw_data = "1200,1400,1600,1800"
processed_data = raw_data.split(",")

print("Processed Data:", processed_data)


# 📌 Explanation:
# Shows data processing, a key responsibility of a Data Engineer.
`
      },
      {
        title: 'Data Science Lifecycle',
        content: `
          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">1. Introduction</h2>
          <p class="mb-4 text-gray-700 dark:text-gray-300">The Data Science Lifecycle is a structured process that describes how data science projects are executed from start to finish. It provides a systematic approach to solving data-driven problems and ensures that raw data is converted into meaningful insights and actionable decisions. Understanding this lifecycle is essential for beginners, as it forms the foundation for all real-world data science projects.</p>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">2. Stage 1: Problem Understanding</h2>
          <p class="mb-4 text-gray-700 dark:text-gray-300">Every data science project begins with a clear understanding of the problem. At this stage, the goal is to define what needs to be solved and what success looks like. A poorly defined problem can lead to incorrect analysis and misleading results.</p>
          <p class="mb-2 font-semibold text-gray-900 dark:text-white">Key Points:</p>
          <ul class="list-disc pl-6 mb-4 text-gray-700 dark:text-gray-300 space-y-1">
            <li>Understand business or real-world objectives</li>
            <li>Define clear goals and success metrics</li>
            <li>Identify constraints and assumptions</li>
          </ul>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">3. Stage 2: Data Collection</h2>
          <p class="mb-4 text-gray-700 dark:text-gray-300">Once the problem is defined, relevant data must be collected. Data can come from various sources such as databases, files, APIs, sensors, or external platforms. The quality of collected data directly impacts the quality of the final outcome.</p>
          <p class="mb-2 font-semibold text-gray-900 dark:text-white">Key Points:</p>
          <ul class="list-disc pl-6 mb-4 text-gray-700 dark:text-gray-300 space-y-1">
            <li>Collect data from reliable sources</li>
            <li>Identify structured and unstructured data</li>
            <li>Ensure sufficient data volume</li>
          </ul>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">4. Stage 3: Data Cleaning and Preparation</h2>
          <p class="mb-4 text-gray-700 dark:text-gray-300">Raw data is often incomplete, inconsistent, and noisy. This stage focuses on cleaning the data to make it suitable for analysis. Data preparation is one of the most time-consuming but critical steps in the lifecycle.</p>
          <p class="mb-2 font-semibold text-gray-900 dark:text-white">Key Points:</p>
          <ul class="list-disc pl-6 mb-4 text-gray-700 dark:text-gray-300 space-y-1">
            <li>Handle missing values</li>
            <li>Remove duplicates and errors</li>
            <li>Convert data into usable formats</li>
          </ul>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">5. Stage 4: Exploratory Data Analysis (EDA)</h2>
          <p class="mb-4 text-gray-700 dark:text-gray-300">EDA involves analyzing the cleaned data to understand patterns, trends, and relationships. Visualization and summary statistics are commonly used to gain insights and guide further modeling decisions.</p>
          <p class="mb-2 font-semibold text-gray-900 dark:text-white">Key Points:</p>
          <ul class="list-disc pl-6 mb-4 text-gray-700 dark:text-gray-300 space-y-1">
            <li>Identify trends and correlations</li>
            <li>Detect outliers</li>
            <li>Gain data-driven insights</li>
          </ul>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">6. Stage 5: Model Building</h2>
          <p class="mb-4 text-gray-700 dark:text-gray-300">In this stage, machine learning or statistical models are built using the prepared data. The model learns patterns from the data to make predictions or classifications.</p>
          <p class="mb-2 font-semibold text-gray-900 dark:text-white">Key Points:</p>
          <ul class="list-disc pl-6 mb-4 text-gray-700 dark:text-gray-300 space-y-1">
            <li>Select appropriate algorithms</li>
            <li>Train models using data</li>
            <li>Optimize model performance</li>
          </ul>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">7. Stage 6: Model Evaluation</h2>
          <p class="mb-4 text-gray-700 dark:text-gray-300">After building a model, it must be evaluated to ensure it performs well and meets the project objectives. Evaluation helps identify overfitting, underfitting, and potential improvements.</p>
          <p class="mb-2 font-semibold text-gray-900 dark:text-white">Key Points:</p>
          <ul class="list-disc pl-6 mb-4 text-gray-700 dark:text-gray-300 space-y-1">
            <li>Measure model accuracy and performance</li>
            <li>Compare multiple models</li>
            <li>Validate results using test data</li>
          </ul>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">8. Stage 7: Deployment</h2>
          <p class="mb-4 text-gray-700 dark:text-gray-300">Once the model is validated, it is deployed into a real-world environment where it can be used by users or integrated into applications. Deployment makes the model useful beyond experimentation.</p>
          <p class="mb-2 font-semibold text-gray-900 dark:text-white">Key Points:</p>
          <ul class="list-disc pl-6 mb-4 text-gray-700 dark:text-gray-300 space-y-1">
            <li>Integrate model into applications</li>
            <li>Ensure scalability and reliability</li>
            <li>Monitor model behavior</li>
          </ul>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">9. Stage 8: Monitoring and Maintenance</h2>
          <p class="mb-4 text-gray-700 dark:text-gray-300">Data science projects do not end after deployment. Models must be continuously monitored and updated as new data becomes available or business conditions change.</p>
          <p class="mb-2 font-semibold text-gray-900 dark:text-white">Key Points:</p>
          <ul class="list-disc pl-6 mb-4 text-gray-700 dark:text-gray-300 space-y-1">
            <li>Monitor model performance</li>
            <li>Detect data or model drift</li>
            <li>Retrain models when required</li>
          </ul>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">10. Summary</h2>
          <p class="mb-4 text-gray-700 dark:text-gray-300">The Data Science Lifecycle is an iterative process, meaning stages may repeat as new insights emerge. Following this lifecycle ensures structured, reliable, and effective data science solutions.</p>
        `,
        duration: '30 min',
        syntax: [
          {
            title: "Lifecycle Flow Representation",
            content: "Problem Understanding\\n        ↓\\nData Collection\\n        ↓\\nData Cleaning & Preparation\\n        ↓\\nExploratory Data Analysis\\n        ↓\\nModel Building\\n        ↓\\nModel Evaluation\\n        ↓\\nDeployment\\n        ↓\\nMonitoring & Maintenance"
          },
          {
            title: "Simplified Lifecycle View",
            content: "Define → Collect → Clean → Analyze → Model → Deploy → Improve"
          },
          {
            title: "Stage Purpose Mapping",
            content: "Stage | Purpose\\nProblem Understanding | Define goals\\nData Collection | Gather data\\nData Cleaning | Prepare data\\nEDA | Discover patterns\\nModel Building | Learn from data\\nEvaluation | Validate performance\\nDeployment | Use in real world\\nMonitoring | Maintain accuracy"
          }
        ],
        initialCode: `# 💡 This example shows how the lifecycle starts with data and ends with insight.

# Example 1: Data Collection and Preparation
# Raw data collection
data = [1200, None, 1500, 1600, None, 1800]

# Data cleaning
cleaned_data = [value for value in data if value is not None]
print("Cleaned Data:", cleaned_data)


# 📌 Explanation:
# Represents data cleaning, a key lifecycle stage.

# Example 2: Exploratory Analysis
average_value = sum(cleaned_data) / len(cleaned_data)
print("Average Value:", average_value)


# 📌 Explanation:
# Shows EDA, where insights are extracted.

# Example 3: Decision Making (Model Concept)
if average_value > 1500:
    print("Performance is strong.")
else:
    print("Performance needs improvement.")


# 📌 Explanation:
# Illustrates decision-making, which is the final goal of the lifecycle.
`
      },
      {
        title: 'Types of Data (Structured, Semi-Structured, Unstructured)',
        content: `
          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">1. Introduction</h2>
          <p class="mb-4 text-gray-700 dark:text-gray-300">Data is the foundation of Data Science, but not all data is the same. Depending on its format, organization, and structure, data is broadly classified into Structured, Semi-Structured, and Unstructured data. Understanding these types is essential because the tools, storage methods, and analysis techniques used in Data Science depend heavily on the nature of the data.</p>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">2. Structured Data</h2>
          <p class="mb-4 text-gray-700 dark:text-gray-300">Structured data is data that is highly organized and follows a predefined format or schema. It is typically stored in rows and columns, making it easy to search, query, and analyze using traditional tools such as databases and spreadsheets.</p>
          <p class="mb-4 text-gray-700 dark:text-gray-300">This type of data is commonly used in business applications and is the easiest form of data to process and analyze.</p>
          <p class="mb-2 font-semibold text-gray-900 dark:text-white">Key Characteristics:</p>
          <ul class="list-disc pl-6 mb-4 text-gray-700 dark:text-gray-300 space-y-1">
            <li>Fixed format (rows and columns)</li>
            <li>Easy to store in databases</li>
            <li>Easy to analyze using SQL and Excel</li>
            <li>Highly organized</li>
          </ul>
          <p class="mb-2 font-semibold text-gray-900 dark:text-white">Examples:</p>
          <ul class="list-disc pl-6 mb-4 text-gray-700 dark:text-gray-300 space-y-1">
            <li>Employee records</li>
            <li>Sales transactions</li>
            <li>Student marks</li>
            <li>Bank account details</li>
          </ul>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">3. Semi-Structured Data</h2>
          <p class="mb-4 text-gray-700 dark:text-gray-300">Semi-structured data does not follow a strict tabular format, but it still contains tags, keys, or markers that provide structure. This type of data lies between structured and unstructured data and is commonly used in web and application systems.</p>
          <p class="mb-4 text-gray-700 dark:text-gray-300">Semi-structured data requires specialized tools and programming techniques for effective analysis.</p>
          <p class="mb-2 font-semibold text-gray-900 dark:text-white">Key Characteristics:</p>
          <ul class="list-disc pl-6 mb-4 text-gray-700 dark:text-gray-300 space-y-1">
            <li>Partial structure</li>
            <li>Uses tags or key-value pairs</li>
            <li>Flexible schema</li>
            <li>Easier to modify than structured data</li>
          </ul>
          <p class="mb-2 font-semibold text-gray-900 dark:text-white">Examples:</p>
          <ul class="list-disc pl-6 mb-4 text-gray-700 dark:text-gray-300 space-y-1">
            <li>JSON files</li>
            <li>XML files</li>
            <li>Log files</li>
            <li>API responses</li>
          </ul>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">4. Unstructured Data</h2>
          <p class="mb-4 text-gray-700 dark:text-gray-300">Unstructured data has no predefined format or structure. It is the most abundant type of data in the modern world and is more complex to process and analyze. Specialized techniques such as Natural Language Processing (NLP) and Computer Vision are often required.</p>
          <p class="mb-2 font-semibold text-gray-900 dark:text-white">Key Characteristics:</p>
          <ul class="list-disc pl-6 mb-4 text-gray-700 dark:text-gray-300 space-y-1">
            <li>No fixed format</li>
            <li>Difficult to analyze directly</li>
            <li>Requires advanced processing</li>
            <li>Large in volume</li>
          </ul>
          <p class="mb-2 font-semibold text-gray-900 dark:text-white">Examples:</p>
          <ul class="list-disc pl-6 mb-4 text-gray-700 dark:text-gray-300 space-y-1">
            <li>Text documents</li>
            <li>Emails</li>
            <li>Images</li>
            <li>Videos</li>
            <li>Audio files</li>
          </ul>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">5. Comparison of Data Types</h2>
          <p class="mb-4 text-gray-700 dark:text-gray-300">Understanding the difference between data types helps data scientists choose the right tools and techniques for analysis.</p>
          <p class="mb-4 text-gray-700 dark:text-gray-300"><strong>Quick Comparison:</strong></p>
          <ul class="list-disc pl-6 mb-4 text-gray-700 dark:text-gray-300 space-y-1">
            <li>Structured data → easiest to analyze</li>
            <li>Semi-structured data → flexible but organized</li>
            <li>Unstructured data → complex and rich in information</li>
          </ul>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">6. Why Data Type Matters in Data Science</h2>
          <p class="mb-4 text-gray-700 dark:text-gray-300">The type of data determines:</p>
          <ul class="list-disc pl-6 mb-4 text-gray-700 dark:text-gray-300 space-y-1">
            <li>Storage method</li>
            <li>Processing approach</li>
            <li>Analysis technique</li>
            <li>Tools and technologies used</li>
          </ul>
          <p class="mb-4 text-gray-700 dark:text-gray-300">For example, SQL works well with structured data, while Python and AI models are required for unstructured data.</p>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">7. Summary</h2>
          <p class="mb-4 text-gray-700 dark:text-gray-300">Modern Data Science works with all three types of data. A skilled data scientist understands how to identify data types and apply the appropriate tools to extract meaningful insights.</p>
        `,
        duration: '25 min',
        syntax: [
          {
            title: "Data Type Classification Flow",
            content: "Data\\n ├── Structured\\n ├── Semi-Structured\\n └── Unstructured"
          },
          {
            title: "Comparison Table",
            content: "Feature | Structured | Semi-Structured | Unstructured\\nFormat | Fixed | Flexible | No format\\nStorage | Tables | JSON / XML | Files\\nAnalysis | Easy | Moderate | Complex\\nExamples | Sales data | API data | Images, text"
          },
          {
            title: "Tool Mapping",
            content: "Structured → SQL, Excel\\nSemi-Structured → Python, JSON Parsers\\nUnstructured → NLP, Computer Vision"
          }
        ],
        initialCode: `# 💡 Simple examples to demonstrate each data type.

# Example 1: Structured Data
# Structured data using a table-like structure
students = {
    "Name": ["Amit", "Sara", "John"],
    "Marks": [85, 90, 78]
}

print(students)


# 📌 Explanation:
# Represents structured data stored in columns.

# Example 2: Semi-Structured Data
# Semi-structured data using JSON-like format
employee = {
    "id": 101,
    "name": "Ravi",
    "skills": ["Python", "SQL", "Data Analysis"]
}

print(employee)


# 📌 Explanation:
# Represents semi-structured data using key-value pairs.

# Example 3: Unstructured Data
# Unstructured data example
text_data = "Data Science is transforming industries."
print(text_data)


# 📌 Explanation:
# Represents unstructured textual data.
`
      },
      {
        title: 'Data Science Tools Overview',
        content: `
          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">1. Introduction</h2>
          <p class="mb-4 text-gray-700 dark:text-gray-300">Data Science relies heavily on tools and technologies to collect, process, analyze, visualize, and model data. Because data science involves multiple stages—from raw data handling to advanced machine learning—no single tool is sufficient. Instead, a combination of tools is used at different stages of the Data Science lifecycle. Understanding these tools helps beginners choose the right technology for the right task.</p>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">2. Programming Languages Used in Data Science</h2>
          <p class="mb-4 text-gray-700 dark:text-gray-300">Programming languages form the backbone of Data Science. They are used to manipulate data, perform analysis, build models, and automate workflows. Among many languages, a few dominate due to their flexibility and community support.</p>
          <p class="mb-2 font-semibold text-gray-900 dark:text-white">Common Languages:</p>
          <ul class="list-disc pl-6 mb-4 text-gray-700 dark:text-gray-300 space-y-1">
            <li><strong>Python:</strong> Most popular; easy to learn and powerful</li>
            <li><strong>R:</strong> Strong in statistics and data analysis</li>
            <li><strong>SQL:</strong> Used for querying and managing databases</li>
          </ul>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">3. Data Analysis and Manipulation Tools</h2>
          <p class="mb-4 text-gray-700 dark:text-gray-300">These tools help clean, transform, and analyze data efficiently. They are widely used during data preprocessing and exploratory analysis.</p>
          <p class="mb-2 font-semibold text-gray-900 dark:text-white">Key Tools:</p>
          <ul class="list-disc pl-6 mb-4 text-gray-700 dark:text-gray-300 space-y-1">
            <li><strong>NumPy:</strong> Numerical computations</li>
            <li><strong>Pandas:</strong> Data manipulation and analysis</li>
            <li><strong>Excel:</strong> Basic analysis and reporting</li>
          </ul>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">4. Data Visualization Tools</h2>
          <p class="mb-4 text-gray-700 dark:text-gray-300">Visualization tools help convert numerical data into visual formats that are easy to understand. They are crucial for identifying patterns and communicating insights.</p>
          <p class="mb-2 font-semibold text-gray-900 dark:text-white">Key Tools:</p>
          <ul class="list-disc pl-6 mb-4 text-gray-700 dark:text-gray-300 space-y-1">
            <li><strong>Matplotlib:</strong> Basic plotting</li>
            <li><strong>Seaborn:</strong> Statistical visualizations</li>
            <li><strong>Tableau / Power BI:</strong> Interactive dashboards</li>
          </ul>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">5. Machine Learning and AI Tools</h2>
          <p class="mb-4 text-gray-700 dark:text-gray-300">Machine learning tools are used to build predictive models and intelligent systems. These tools provide ready-made algorithms and frameworks.</p>
          <p class="mb-2 font-semibold text-gray-900 dark:text-white">Key Tools:</p>
          <ul class="list-disc pl-6 mb-4 text-gray-700 dark:text-gray-300 space-y-1">
            <li><strong>Scikit-learn:</strong> Machine learning algorithms</li>
            <li><strong>TensorFlow:</strong> Deep learning framework</li>
            <li><strong>PyTorch:</strong> Neural network development</li>
          </ul>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">6. Big Data and Cloud Tools</h2>
          <p class="mb-4 text-gray-700 dark:text-gray-300">When data becomes very large, traditional systems are insufficient. Big data and cloud tools allow scalable storage and processing.</p>
          <p class="mb-2 font-semibold text-gray-900 dark:text-white">Key Tools:</p>
          <ul class="list-disc pl-6 mb-4 text-gray-700 dark:text-gray-300 space-y-1">
            <li><strong>Hadoop:</strong> Distributed data storage</li>
            <li><strong>Apache Spark:</strong> Fast data processing</li>
            <li><strong>AWS, Azure, GCP:</strong> Cloud platforms</li>
          </ul>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">7. Data Collection and Integration Tools</h2>
          <p class="mb-4 text-gray-700 dark:text-gray-300">These tools help gather data from multiple sources and integrate it into systems for analysis.</p>
          <p class="mb-2 font-semibold text-gray-900 dark:text-white">Key Tools:</p>
          <ul class="list-disc pl-6 mb-4 text-gray-700 dark:text-gray-300 space-y-1">
            <li><strong>APIs:</strong> Data access from applications</li>
            <li><strong>Web Scraping tools:</strong> Extracting data from websites</li>
            <li><strong>ETL tools:</strong> Extract, Transform, Load processes</li>
          </ul>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">8. Why Tool Selection Matters</h2>
          <p class="mb-4 text-gray-700 dark:text-gray-300">Choosing the right tool ensures:</p>
          <ul class="list-disc pl-6 mb-4 text-gray-700 dark:text-gray-300 space-y-1">
            <li>Faster development</li>
            <li>Better scalability</li>
            <li>Accurate analysis</li>
            <li>Efficient collaboration</li>
          </ul>
          <p class="mb-4 text-gray-700 dark:text-gray-300">Beginners should focus on mastering Python, Pandas, visualization tools, and basic ML libraries first.</p>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">9. Summary</h2>
          <p class="mb-4 text-gray-700 dark:text-gray-300">Data Science tools support every stage of the data lifecycle. A successful data scientist knows which tool to use and when, rather than trying to use one tool for everything.</p>
        `,
        duration: '25 min',
        syntax: [
          {
            title: "Tool Mapping to Data Science Lifecycle",
            content: "Data Collection → APIs, Databases\\nData Cleaning → Pandas, NumPy\\nEDA → Pandas, Matplotlib, Seaborn\\nModeling → Scikit-learn, TensorFlow\\nDeployment → Cloud Platforms"
          },
          {
            title: "Category-Wise Tool List",
            content: "Category | Tools\\nProgramming | Python, R, SQL\\nAnalysis | Pandas, NumPy\\nVisualization | Matplotlib, Seaborn\\nML | Scikit-learn, TensorFlow\\nBig Data | Spark, Hadoop\\nCloud | AWS, Azure, GCP"
          },
          {
            title: "Beginner Tool Focus",
            content: "Python → Pandas → Visualization → Basic ML"
          }
        ],
        initialCode: `# 💡 Demonstrates how tools work together in Data Science.

# Example 1: Using Python for Data Analysis
import pandas as pd

data = {
    "Product": ["A", "B", "C"],
    "Sales": [1200, 1500, 1800]
}

df = pd.DataFrame(data)
print("Dataframe:")
print(df)


# 📌 Explanation:
# Shows how Pandas is used for data handling.

# Example 2: Basic Visualization
import matplotlib.pyplot as plt

plt.figure(figsize=(5, 3))
plt.bar(df["Product"], df["Sales"])
plt.xlabel("Product")
plt.ylabel("Sales")
plt.title("Product Sales")
plt.show()


# 📌 Explanation:
# Illustrates data visualization, a core Data Science task.

# Example 3: Simple Insight
print("Highest Sales:", df["Sales"].max())


# 📌 Explanation:
# Shows how tools generate insights from data.
`
      },
      {
        title: 'Career Path & Industry Expectations',
        content: `
          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">1. Career Path</h2>
          <p class="mb-4 text-gray-700 dark:text-gray-300">High demand for skilled professionals with a mix of coding, math, and business skills.</p>
        `,
        duration: '15 min'
      }
    ]
  },
  {
    id: 'module-2',
    title: 'Module 2 — Programming Fundamentals with Python',
    duration: '1 week',
    description: 'Master the building blocks of Python: variables, control flow, functions, and standard libraries.',
    lessons: [
      {
        title: 'Introduction to Python',
        content: `
          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">1. What is Python?</h2>
          <p class="mb-4 text-gray-700 dark:text-gray-300">Python is a high-level programming language, meaning you write code closer to human language and do not manage low-level details like memory directly.</p>
          <p class="mb-4 text-gray-700 dark:text-gray-300">It was created by Guido van Rossum and first released in 1991, and today it is one of the most widely used languages in industry and academia.</p>
          <p class="mb-4 text-gray-700 dark:text-gray-300">Python is an interpreted language: code is executed line by line by the Python interpreter, which makes development, debugging, and experimentation faster.</p>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">2. Why Python is Popular</h2>
          <p class="mb-4 text-gray-700 dark:text-gray-300">Python emphasizes simplicity and readability, using clear English-like keywords and indentation instead of many braces or symbols.</p>
          <p class="mb-4 text-gray-700 dark:text-gray-300">It is free, open source, and runs on all major platforms (Windows, macOS, Linux), which makes it accessible to anyone.</p>
          <p class="mb-4 text-gray-700 dark:text-gray-300">Python supports multiple paradigms: procedural, object‑oriented, and functional styles can all be used in the same program.</p>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">3. Key Features of Python (Data Science Perspective)</h2>
          <ul class="list-disc pl-6 mb-4 text-gray-700 dark:text-gray-300 space-y-1">
            <li><strong>Rich standard library and ecosystem:</strong> modules for file handling, networking, math, and more come built‑in, plus powerful external libraries like NumPy, Pandas, Matplotlib, and scikit‑learn.</li>
            <li><strong>Dynamic typing:</strong> you don’t need to declare variable types; Python figures them out at runtime, helping you write code faster.</li>
            <li><strong>Strong integration with data science and AI tools:</strong> including frameworks for machine learning, deep learning, and big data processing.</li>
          </ul>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">4. Where Python Is Used</h2>
          <ul class="list-disc pl-6 mb-4 text-gray-700 dark:text-gray-300 space-y-1">
            <li><strong>Web development:</strong> back‑end APIs, web applications with frameworks such as Django and Flask.</li>
            <li><strong>Data analysis, machine learning, and deep learning:</strong> using libraries such as NumPy, Pandas, scikit‑learn, TensorFlow, and PyTorch.</li>
            <li><strong>Automation and scripting:</strong> writing small programs to automate repetitive tasks, scientific computing, and system administration.</li>
          </ul>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">5. Why Python for Data Science (Course Context)</h2>
          <ul class="list-disc pl-6 mb-4 text-gray-700 dark:text-gray-300 space-y-1">
            <li>Python covers the entire data science pipeline: data collection, cleaning, exploration, visualization, modeling, and deployment.</li>
            <li>The syntax is beginner‑friendly, so you can focus on understanding data science concepts instead of fighting with complex language rules.</li>
            <li>Most modern data science tools, tutorials, and communities use Python, which gives you better support, learning resources, and job relevance.</li>
          </ul>
        `,
        duration: '30 min',
        syntax: [
          {
            title: "Basic Python Program",
            content: "# Simple Python program\\nprint(\"Hello, Data Science with Python!\")"
          },
          {
            title: "Comments",
            content: "# This is a single-line comment\\n\\n\"\"\"\\nThis is a multi-line comment\\noften used for documentation.\\n\"\"\""
          },
          {
            title: "Basic Data Types (Preview)",
            content: "# Integer\\nage = 21\\n\\n# Float\\nheight = 5.9\\n\\n# String\\nname = \"Aisha\"\\n\\n# Boolean\\nis_student = True"
          },
          {
            title: "Simple Input and Output (Preview)",
            content: "# Output\\nprint(\"Welcome to Python for Data Science!\")\\n\\n# Input (reads text from user)\\nuser_name = input(\"Enter your name: \")\\nprint(\"Hello,\", user_name)"
          },
          {
            title: "Simple Expression",
            content: "# Basic arithmetic expression\\na = 10\\nb = 3\\nresult = a + b * 2\\nprint(\"Result:\", result)"
          }
        ],
        initialCode: `# Exercise 1: Your First Program
# Task: Print a welcome message for this course
print("Welcome to the Data Science Course with Python!")


# Exercise 2: Personalized Greeting
# Task: Ask the user for their name and greet them
# Note: Input prompt may vary based on environment
name = input("Enter your name: ")
print("Hello " + name + ", welcome to Python for Data Science!")


# Exercise 3: Simple Calculator Expression
# Task: Perform a simple arithmetic operation
x = 10
y = 4
sum_value = x + y
product_value = x * y

print("Sum:", sum_value)
print("Product:", product_value)


# Exercise 4: Data Science Motivation Print
# Task: Print why you want to learn data science
print("I am learning Data Science to work with real-world data and build intelligent applications.")
`
      },
      {
        title: 'Python Installation & Environment Setup',
        content: `
          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">1. Two Main Options for Data Science</h2>
          <p class="mb-4 text-gray-700 dark:text-gray-300">You can install Python in two common ways: the official Python installer from python.org or a data‑science distribution like Anaconda.</p>
          <p class="mb-4 text-gray-700 dark:text-gray-300">For data science, Anaconda is popular because it bundles Python with many pre‑installed libraries (NumPy, Pandas, etc.) and provides easy environment management via Conda.</p>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">2. Installing Python from python.org (General Approach)</h2>
          <p class="mb-4 text-gray-700 dark:text-gray-300">Download the latest stable Python 3 installer for your OS from the official downloads page (Windows, macOS, or Linux).</p>
          <p class="mb-4 text-gray-700 dark:text-gray-300">Run the installer, choose “Add Python to PATH” on Windows, accept the defaults, and finish the installation; on macOS, open the installer package and follow the “Continue” steps until completion.</p>
          <p class="mb-4 text-gray-700 dark:text-gray-300">After installation, you can open a terminal (or Command Prompt/PowerShell on Windows) and run <code>python --version</code> or <code>python3 --version</code> to verify that Python is installed.</p>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">3. Installing Anaconda (Recommended for This Course)</h2>
          <p class="mb-4 text-gray-700 dark:text-gray-300">Anaconda is a distribution of Python tailored for data science, including Conda (a package and environment manager) and many scientific libraries and tools.</p>
          <p class="mb-4 text-gray-700 dark:text-gray-300">You download the Anaconda individual edition installer for your OS, run it, accept the license, keep the default install location, and complete the setup.</p>
          <p class="mb-4 text-gray-700 dark:text-gray-300">Once installed, you can launch Anaconda Navigator or use the Anaconda Prompt/terminal to create isolated environments like <code>conda create -n ds_env python=3.11</code> and then activate them with <code>conda activate ds_env</code>.</p>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">4. What Is a Python Environment (and Why It Matters)</h2>
          <p class="mb-4 text-gray-700 dark:text-gray-300">A Python environment is an isolated space with its own Python version and set of installed packages, so different projects do not conflict with each other.</p>
          <p class="mb-4 text-gray-700 dark:text-gray-300">Tools like Conda (<code>conda create</code>, <code>conda activate</code>) or venv (<code>python -m venv venv</code>) help you create project‑specific environments that keep dependencies clean and reproducible.</p>
          <p class="mb-4 text-gray-700 dark:text-gray-300">For data science projects, using a dedicated environment per project is considered best practice to avoid version conflicts between libraries.</p>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">5. Basic IDE/Editor Setup (VS Code Example)</h2>
          <p class="mb-4 text-gray-700 dark:text-gray-300">After installing Python, you can use Visual Studio Code (VS Code) with the official Python extension to get IntelliSense, linting, and debugging.</p>
          <p class="mb-4 text-gray-700 dark:text-gray-300">Within VS Code, you select the interpreter or environment (e.g., your Conda or venv environment) so that the editor runs code using the correct Python and packages.</p>
        `,
        duration: '30 min',
        terminalCommands: ['python --version', 'python3 --version', 'conda env list'],
        terminalGuide: '<p>Use these commands to verify your installation and check available environments.</p>',
        syntax: [
          {
            title: "Check Python Version",
            content: "# Windows (Command Prompt or PowerShell)\\npython --version\\n# or\\npython -V\\n\\n# macOS / Linux (sometimes python refers to Python 2)\\npython3 --version"
          },
          {
            title: "Using pip (Official Python)",
            content: "# Upgrade pip\\npython -m pip install --upgrade pip\\n\\n# Install a package\\npip install numpy\\n\\n# Install multiple packages\\npip install pandas matplotlib"
          },
          {
            title: "Creating and Activating a venv Environment",
            content: "# Create a virtual environment named venv\\npython -m venv venv\\n\\n# Activate on Windows\\nvenv\\\\Scripts\\\\activate\\n\\n# Activate on macOS / Linux\\nsource venv/bin/activate\\n\\n# Deactivate environment\\ndeactivate"
          },
          {
            title: "Basic Conda Environment Commands (Anaconda)",
            content: "# Create a new environment with a specific Python version\\nconda create -n ds_env python=3.11\\n\\n# Activate the environment\\nconda activate ds_env\\n\\n# Install packages into this environment\\nconda install numpy pandas matplotlib\\n\\n# List environments\\nconda env list"
          }
        ],
        initialCode: `# Exercise 1: Verify Python Is Working
# Task: Print a simple confirmation message
print("Python is installed and running correctly!")


# Exercise 2: Display Environment Information (Basic)
# Task: Show Python version from inside Python
import sys

print("Major version:", sys.version_info.major)
print("Minor version:", sys.version_info.minor)
print("Full version string:")
print(sys.version)


# Exercise 3: Test Data Science Packages (Anaconda or pip)
# Task: Confirm core data science libraries are available
import numpy as np
import pandas as pd

print("NumPy version:", np.__version__)
print("Pandas version:", pd.__version__)

data = [1, 2, 3, 4]
arr = np.array(data)
series = pd.Series(data)

print("NumPy array:", arr)
print("Pandas Series:")
print(series)


# Exercise 4: Simple Script Check
# Task: Run a small script to confirm everything works end-to-end
message = "Environment setup complete. Ready for Module 3!"
for i in range(3):
    print(i + 1, "-", message)
`
      },
      {
        title: 'Variables and Data Types',
        content: `
          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">1. What is a Variable?</h2>
          <p class="mb-4 text-gray-700 dark:text-gray-300">A variable is a named storage location in memory that holds a value while your program runs, such as a number, a piece of text, or a Boolean flag.</p>
          <p class="mb-4 text-gray-700 dark:text-gray-300">In Python, you create a variable the moment you assign a value to it; you do not need a separate declaration statement like in C or Java.</p>
          <p class="mb-4 text-gray-700 dark:text-gray-300">Technically, data types in Python are classes, and variables are instances (objects) of those classes, which fits with Python’s object‑oriented nature.</p>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">2. Rules and Best Practices for Variable Names</h2>
          <p class="mb-4 text-gray-700 dark:text-gray-300">Variable names can contain letters, digits, and underscores, but they must not start with a digit.</p>
          <p class="mb-4 text-gray-700 dark:text-gray-300">Names are case‑sensitive, so <code>age</code>, <code>Age</code>, and <code>AGE</code> are three different identifiers, and you must avoid Python keywords like <code>if</code>, <code>for</code>, or <code>class</code> as variable names.</p>
          <p class="mb-4 text-gray-700 dark:text-gray-300">For readability (important in data science notebooks), prefer descriptive names like <code>total_sales</code>, <code>customer_count</code>, or <code>mean_salary</code> instead of <code>a</code>, <code>b</code>, or <code>x1</code>.</p>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">3. How Assignment Works in Python</h2>
          <p class="mb-4 text-gray-700 dark:text-gray-300">Python uses the <code>=</code> operator to assign a value to a variable: the expression on the right is evaluated, and the result is bound to the name on the left.</p>
          <p class="mb-4 text-gray-700 dark:text-gray-300">You can reassign a variable to a value of a different data type at any time (for example, from an integer to a string), which is possible because Python uses dynamic typing.</p>
          <p class="mb-4 text-gray-700 dark:text-gray-300">Multiple variables can be assigned in one line (e.g., <code>x, y, z = 1, 2, 3</code>), and you can also swap values directly: <code>x, y = y, x</code>.</p>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">4. Overview of Built‑in Data Type Categories</h2>
          <p class="mb-4 text-gray-700 dark:text-gray-300">Python’s built‑in data types include numeric types (int, float, complex), text type (str), sequence types (list, tuple, range), mapping type (dict), set types (set, frozenset), and Boolean type (bool).</p>
          <p class="mb-4 text-gray-700 dark:text-gray-300">For data science, you frequently combine these core types with higher‑level structures from libraries like NumPy arrays and Pandas Series/DataFrames, but everything builds on these basics.</p>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">5. Numeric Types: int, float, complex</h2>
          <ul class="list-disc pl-6 mb-4 text-gray-700 dark:text-gray-300 space-y-1">
            <li><strong>int:</strong> Represents whole numbers of arbitrary size, such as 0, -10, or 987654321, which is useful for counts and indices.</li>
            <li><strong>float:</strong> Represents real numbers with decimals, such as 3.14 or -0.001, commonly used for measurements, probabilities, and model parameters.</li>
            <li><strong>complex:</strong> Numbers with a real and an imaginary part (e.g., 3+4j), used less often in standard data analysis but relevant in scientific or signal‑processing domains.</li>
          </ul>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">6. Strings: str</h2>
          <p class="mb-4 text-gray-700 dark:text-gray-300">A string is a sequence of characters enclosed in single quotes ('Hello') or double quotes ("Hello"), both forms are equivalent in Python.</p>
          <p class="mb-4 text-gray-700 dark:text-gray-300">Strings are used for labels, feature names, categories, file paths, and any textual information in your datasets.</p>
          <p class="mb-4 text-gray-700 dark:text-gray-300">Python supports powerful string operations such as concatenation ("data" + "science"), repetition ("ha" * 3), and indexing/slicing (e.g., "Python"[0] gives 'P').</p>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">7. Boolean Type: bool</h2>
          <p class="mb-4 text-gray-700 dark:text-gray-300">The Boolean type has only two values: <code>True</code> and <code>False</code>, which are used in conditions, filtering logic, and flags.</p>
          <p class="mb-4 text-gray-700 dark:text-gray-300">In data science, Boolean masks (arrays/Series of True/False) are widely used to filter rows or apply conditions to a dataset.</p>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">8. Collections (Preview for Later Modules)</h2>
          <p class="mb-4 text-gray-700 dark:text-gray-300">Lists, tuples, sets, and dictionaries are collection types that can hold multiple values, such as a list of ages or a mapping from column names to types.</p>
          <p class="mb-4 text-gray-700 dark:text-gray-300">You will study these in detail in later modules, but at this stage you should recognize that individual variables often store these collections when working with datasets.</p>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">9. Type Checking and Type Conversion (High‑Level Idea)</h2>
          <p class="mb-4 text-gray-700 dark:text-gray-300">You can check the type of a variable using the built‑in <code>type()</code> function, which is essential when debugging or validating input data.</p>
          <p class="mb-4 text-gray-700 dark:text-gray-300">Python allows explicit type conversion (casting), such as converting a string "42" to an integer with <code>int("42")</code>, or converting an integer to a float with <code>float(5)</code>, which is crucial when cleaning raw data.</p>
        `,
        duration: '30 min',
        syntax: [
          {
            title: "Creating Variables",
            content: "# Simple variable assignments\\nage = 21              # int\\nheight = 5.9          # float\\nname = \"Aisha\"        # str\\nis_student = True     # bool"
          },
          {
            title: "Valid vs Invalid Names",
            content: "# Valid\\ntotal_sales = 1000\\n_customer_id = \"C123\"\\ncount2 = 5\\n\\n# Invalid (will cause syntax errors if you uncomment)\\n# 2count = 5\\n# total-sales = 100\\n# for = 10      # 'for' is a Python keyword"
          },
          {
            title: "Reassignment and Dynamic Typing",
            content: "value = 10        # int\\nvalue = \"ten\"     # now str\\nvalue = 10.5      # now float"
          },
          {
            title: "Basic Data Types Examples",
            content: "# Numeric\\nx_int = 10\\ny_float = 3.14\\nz_complex = 2 + 3j\\n\\n# String\\ngreeting = \"Hello, Data Science!\"\\n\\n# Boolean\\nflag = False"
          },
          {
            title: "Checking Types and Simple Conversion",
            content: "x = 42\\nprint(type(x))        # <class 'int'>\\n\\ny = float(x)          # convert int to float\\nprint(y, type(y))     # 42.0 <class 'float'>\\n\\ntext_num = \"123\"\\nnum = int(text_num)   # convert string to int\\nprint(num, type(num)) # 123 <class 'int'>"
          }
        ],
        initialCode: `# Exercise 1: Create and Print Basic Variables
# Task:
# 1. Create variables: your name, age, and whether you are a student.
# 2. Print them with clear labels.

name = "Your Name"
age = 20
is_student = True

print("Name:", name)
print("Age:", age)
print("Is student:", is_student)
print("Type of age:", type(age))
print("Type of is_student:", type(is_student))
`
      },
      {
        title: 'Operators and Expressions',
        content: `
          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">1. Operators vs Expressions</h2>
          <p class="mb-4 text-gray-700 dark:text-gray-300">
            An <strong>operator</strong> is a symbol like <code>+</code>, <code>-</code>, <code>*</code>, <code>==</code>, or <code>and</code> that performs an operation on values or variables.
          </p>
          <p class="mb-4 text-gray-700 dark:text-gray-300">
            An <strong>expression</strong> combines variables, values, and operators (for example <code>2 + 3 * 4</code> or <code>age > 18 and is_student</code>) and evaluates to a single result.
          </p>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">2. Main Types of Operators</h2>
          <p class="mb-4 text-gray-700 dark:text-gray-300">
            Python provides arithmetic, comparison, logical, assignment, identity, and membership operators for different kinds of operations.
          </p>
          <p class="mb-4 text-gray-700 dark:text-gray-300">
            In data science, you use these operators to build formulas, compute new features, and write conditions for filtering and decisions.
          </p>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">3. Arithmetic, Comparison, and Logical Operators</h2>
          <p class="mb-4 text-gray-700 dark:text-gray-300">
            <strong>Arithmetic operators</strong> (<code>+</code>, <code>-</code>, <code>*</code>, <code>/</code>, <code>//</code>, <code>%</code>, <code>**</code>) work on numeric types to perform math like sums, ratios, and powers.
          </p>
          <p class="mb-4 text-gray-700 dark:text-gray-300">
            <strong>Comparison operators</strong> (<code>==</code>, <code>!=</code>, <code>&lt;</code>, <code>&gt;</code>, <code>&lt;=</code>, <code>&gt;=</code>) compare two values and return <code>True</code> or <code>False</code>, forming the basis of conditional logic.
          </p>
          <p class="mb-4 text-gray-700 dark:text-gray-300">
            <strong>Logical operators</strong> <code>and</code>, <code>or</code>, and <code>not</code> combine or invert Boolean expressions, which is essential for stating more complex rules such as multiple filters at once.
          </p>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">4. Assignment, Identity, and Membership</h2>
          <p class="mb-4 text-gray-700 dark:text-gray-300">
            The <strong>assignment operator</strong> <code>=</code> stores the result of an expression in a variable, and augmented assignments like <code>+=</code> or <code>*=</code> update variables in place.
          </p>
          <p class="mb-4 text-gray-700 dark:text-gray-300">
            <strong>Identity operators</strong> <code>is</code> and <code>is not</code> test whether two variables refer to the same object, while <strong>membership operators</strong> <code>in</code> and <code>not in</code> test if a value exists in a sequence or collection.
          </p>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">5. Operator Precedence (Order of Evaluation)</h2>
          <p class="mb-4 text-gray-700 dark:text-gray-300">
            Operator precedence controls which operators run first in an expression, for example multiplication before addition in <code>10 + 5 * 2</code>.
          </p>
          <p class="mb-4 text-gray-700 dark:text-gray-300">
            Parentheses <code>()</code> have the highest precedence and should be used to make complex expressions clear and to ensure they evaluate the way you intend.
          </p>
        `,
        duration: '25 min',
        syntax: [
          { title: "Arithmetic", content: `a = 10\nb = 3\n\nprint(a + b)   # 13\nprint(a - b)   # 7\nprint(a * b)   # 30\nprint(a / b)   # 3.333...\nprint(a // b)  # 3\nprint(a % b)   # 1\nprint(a ** b)  # 1000` },
          { title: "Comparison", content: `x = 5\ny = 2\n\nprint(x == y)   # False\nprint(x != y)   # True\nprint(x > y)    # True\nprint(x < y)    # False\nprint(x >= y)   # True\nprint(x <= y)   # False` },
          { title: "Logical", content: `age = 22\nis_student = True\n\nprint(age > 18 and is_student)   # True\nprint(age < 18 or is_student)    # True\nprint(not is_student)            # False` },
          { title: "Assign/Ident/Member", content: `# Assignment / augmented assignment\ncount = 0\ncount += 1\ncount *= 2\n\n# Identity\na = [1, 2, 3]\nb = a\nc = [1, 2, 3]\n\nprint(a is b)  # True\nprint(a is c)  # False\n\n# Membership\ncities = ["Delhi", "Mumbai", "Bengaluru"]\nprint("Delhi" in cities)         # True\nprint("Chennai" not in cities)   # True` },
          { title: "Precedence", content: `result1 = 10 + 5 * 2       # 20\nresult2 = (10 + 5) * 2     # 30\nprint(result1, result2)` }
        ],
        initialCode: `# Exercise 1: Shopping Bill
# Task: Calculate subtotal, tax, and final amount.

price = 899.0
quantity = 2
tax_rate = 0.18

subtotal = price * quantity
tax = subtotal * tax_rate
final_amount = subtotal + tax

print("Subtotal:", subtotal)
print("Tax:", tax)
print("Final amount:", final_amount)

# Exercise 2: Pass/Fail and Grade Band
# Task: Print pass/fail and grade band.

marks = 73

if marks >= 40:
    print("Result: Pass")
else:
    print("Result: Fail")

if marks >= 80:
    grade = "A"
elif marks >= 60:
    grade = "B"
else:
    grade = "C"

print("Grade:", grade)

# Exercise 3: Customer Filter with Logical Operators
# Task: Check if a customer is a high-value recent customer.

total_spent = 45000
days_since_last_purchase = 20

is_high_value = total_spent >= 40000
is_recent = days_since_last_purchase <= 30

eligible = is_high_value and is_recent

print("High value:", is_high_value)
print("Recent:", is_recent)
print("Eligible for special campaign:", eligible)

# Exercise 4: Precedence Exploration
# Task: Predict then verify each result.

expr1 = 10 + 2 * 3
expr2 = (10 + 2) * 3
expr3 = 100 / 5 * 2
expr4 = 100 / (5 * 2)

print("expr1:", expr1)
print("expr2:", expr2)
print("expr3:", expr3)
print("expr4:", expr4)
`
      },
      {
        title: 'Conditional Statements',
        content: `
          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">1. Idea of Conditional Statements</h2>
          <p class="mb-4 text-gray-700 dark:text-gray-300">
            Conditional statements allow your program to make decisions. Instead of executing every line sequentially, the program can choose which block of code to run based on whether a condition is <code>True</code> or <code>False</code>.
          </p>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">2. The if Statement</h2>
          <p class="mb-4 text-gray-700 dark:text-gray-300">
            The simplest form is the <code>if</code> statement. If the condition is true, the indented block of code runs. If false, it is skipped.
          </p>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">3. Adding Alternatives: else and elif</h2>
          <p class="mb-4 text-gray-700 dark:text-gray-300">
            Use <code>else</code> to specify what happens when the condition is false. Use <code>elif</code> (else if) to check multiple conditions in sequence.
          </p>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">4. Logical Operators</h2>
          <p class="mb-4 text-gray-700 dark:text-gray-300">
            You can combine conditions using <code>and</code> (both must be true), <code>or</code> (at least one must be true), and <code>not</code> (inverses the truth value).
          </p>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">5. Indentation</h2>
          <p class="mb-4 text-gray-700 dark:text-gray-300">
            Python uses indentation (whitespace) to define blocks of code. All statements inside an <code>if</code> block must be indented by the same amount (usually 4 spaces).
          </p>
        `,
        duration: '25 min',
        syntax: [
          { title: "Basic if", content: `temperature = 32\nif temperature > 30:\n    print("It is hot today.")` },
          { title: "If...Else", content: `age = 16\nif age >= 18:\n    print("Adult")\nelse:\n    print("Minor")` },
          { title: "If...Elif...Else", content: `score = 85\nif score >= 90:\n    print("Grade: A")\nelif score >= 80:\n    print("Grade: B")\nelse:\n    print("Grade: C")` },
          { title: "Logical Operators", content: `income = 50000\ncredit_score = 750\n\nif income > 40000 and credit_score > 700:\n    print("Loan Approved")` }
        ],
        initialCode: `# Exercise 1: Simple Discount Check
# Task: If bill_amount >= 1000, apply 10% discount, otherwise no discount.

bill_amount = 1450

if bill_amount >= 1000:
    discount = bill_amount * 0.10
else:
    discount = 0

final_amount = bill_amount - discount

print("Bill amount:", bill_amount)
print("Discount:", discount)
print("Final amount:", final_amount)

# Exercise 2: Temperature Check (Elif)
# Task: Categorize temperature into Hot (>30), Moderate (20-30), or Cold (<20).
temp = 25
print("\\nTemperature:", temp)

if temp > 30:
    print("It's Hot")
elif temp >= 20:
    print("It's Moderate")
else:
    print("It's Cold")

# Exercise 3: Eligibility Check (And/Or)
# Task: Check if a student is eligible (GPA > 3.5 and Attendance > 80).
gpa = 3.8
attendance = 85

print("\\nStudent Record:")
print("GPA:", gpa)
print("Attendance:", attendance)

if gpa > 3.5 and attendance > 80:
    print("Status: Eligible for Honor Roll")
else:
    print("Status: Not Eligible")
`
      },
      {
        title: 'Loops (for, while)',
        content: `
          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">1. Why We Use Loops</h2>
          <p class="mb-4 text-gray-700 dark:text-gray-300">
            Loops let you repeat a block of code multiple times without writing it again and again, which is crucial when processing many data points or rows.
          </p>
          <p class="mb-4 text-gray-700 dark:text-gray-300">
            In Python, the two main loop types are <strong>for loops</strong> (iterate over a sequence) and <strong>while loops</strong> (repeat while a condition is true).
          </p>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">2. for Loop Basics</h2>
          <p class="mb-4 text-gray-700 dark:text-gray-300">
            A <code>for</code> loop iterates directly over items in a sequence such as a list, string, or range, assigning each item to a loop variable in turn.
          </p>
          <p class="mb-4 text-gray-700 dark:text-gray-300">
            This is very common in data science, for example iterating over column names, feature lists, or small collections of values when preparing data.
          </p>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">3. range() with for Loops</h2>
          <p class="mb-4 text-gray-700 dark:text-gray-300">
            The built‑in <code>range()</code> function generates a sequence of numbers, typically used in for loops when you need to loop a specific number of times.
          </p>
          <p class="mb-4 text-gray-700 dark:text-gray-300">
            <code>range(n)</code> goes from 0 to n-1, while <code>range(start, stop, step)</code> lets you specify starting value, stopping value (exclusive), and increment.
          </p>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">4. while Loop Basics</h2>
          <p class="mb-4 text-gray-700 dark:text-gray-300">
            A <code>while</code> loop repeats as long as its condition remains true, checking the condition before every iteration.
          </p>
          <p class="mb-4 text-gray-700 dark:text-gray-300">
            You must update variables inside the loop so that the condition eventually becomes false; otherwise you create an infinite loop.
          </p>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">5. break and continue in Loops</h2>
          <p class="mb-4 text-gray-700 dark:text-gray-300">
            <code>break</code> immediately exits the nearest loop, even if the loop condition is still true or there are items left to process.
          </p>
          <p class="mb-4 text-gray-700 dark:text-gray-300">
            <code>continue</code> skips the rest of the current iteration and moves to the next one, which is useful when you want to ignore certain values or rows based on a condition.
          </p>
        `,
        duration: '25 min',
        syntax: [
          { title: "Basic for Loop", content: `# Loop through a list\ncities = ["Bengaluru", "Delhi", "Mumbai"]\n\nfor city in cities:\n    print("City:", city)` },
          { title: "for with range()", content: `# Print numbers from 0 to 4\nfor i in range(5):\n    print(i)\n\n# Print numbers from 1 to 5\nfor i in range(1, 6):\n    print(i)\n\n# Print even numbers from 0 to 10\nfor i in range(0, 11, 2):\n    print(i)` },
          { title: "Basic while Loop", content: `count = 1\n\nwhile count <= 5:\n    print("Count is:", count)\n    count += 1` },
          { title: "break/continue", content: `# break\nfor i in range(1, 10):\n    if i == 5:\n        break\n    print(i)\n\n# continue\nfor i in range(1, 10):\n    if i == 5:\n        continue\n    print(i)` }
        ],
        initialCode: `# Exercise 1: Sum of First N Numbers (for + range)
# Task: 1. Take a value for n. 2. Compute sum from 1 to n using a for loop.

n = 10
total = 0

for i in range(1, n + 1):
    total += i

print("n:", n)
print("Sum from 1 to n:", total)

# Exercise 2: Count Passing Students
# Task: Count how many marks are >= 40 using a for loop.

marks_list = [35, 67, 80, 39, 50, 90]
pass_count = 0

for marks in marks_list:
    if marks >= 40:
        pass_count += 1

print("Marks:", marks_list)
print("Number of students passed:", pass_count)

# Exercise 3: Simple Menu with while
# Task: Show a simple menu until user chooses to exit.

choice = ""

# NOTE: In this simulated environment, we'll hardcode inputs to demonstrate logic
# because input() requires user interaction.
# We will simulate a sequence of inputs: '1', '2', '3'
simulated_inputs = ["1", "2", "3"]
input_idx = 0

print("\\n--- Starting Menu Simulation ---")
while choice != "3":
    print("\\nMenu:")
    print("1. Say Hello")
    print("2. Show a number list")
    print("3. Exit")

    # Simulating input
    if input_idx < len(simulated_inputs):
        choice = simulated_inputs[input_idx]
        print(f"Enter choice (1/2/3): {choice}")
        input_idx += 1
    else:
        break # Safety break

    if choice == "1":
        print("Hello, Data Science learner!")
    elif choice == "2":
        for i in range(1, 6):
            print(i, end=" ")
        print()
    elif choice == "3":
        print("Exiting...")
    else:
        print("Invalid choice, try again.")

# Exercise 4: Skip Missing Values (continue)
# Task: Skip None values and print only valid numbers.

values = [10, None, 25, 0, None, 42]
print("\\nProcessing values:", values)

for val in values:
    if val is None:
        continue
    print("Valid value:", val)
`
      },
      {
        title: 'Functions in Python',
        content: `
          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">1. What is a Function in Python?</h2>
          <p class="mb-4 text-gray-700 dark:text-gray-300">
            A function in Python is a reusable block of code that performs a specific task. Instead of writing the same logic again and again, functions allow us to write once and use many times. Functions make programs cleaner, modular, readable, and easier to maintain, which is extremely important in Data Science projects where code can become large and complex.
          </p>
          <p class="mb-4 text-gray-700 dark:text-gray-300">
            In real-world Data Science, functions are used to clean data, transform values, calculate statistics, train models, and automate repetitive operations.
          </p>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">2. Why Are Functions Important?</h2>
          <p class="mb-4 text-gray-700 dark:text-gray-300">
            Functions play a critical role in Python programming because they:
            <ul class="list-disc list-inside ml-4">
              <li>Reduce code repetition</li>
              <li>Improve code readability</li>
              <li>Make debugging easier</li>
              <li>Enable modular programming</li>
              <li>Allow collaboration in large projects</li>
            </ul>
          </p>
          <p class="mb-4 text-gray-700 dark:text-gray-300">
            For example, instead of writing the same data-cleaning logic for every dataset, we create one function and reuse it.
          </p>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">3. Types of Functions in Python</h2>
          <p class="mb-4 text-gray-700 dark:text-gray-300">
            Python supports different types of functions based on how they are created and used.
          </p>
          <h3 class="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-200">1. Built-in Functions</h3>
          <p class="mb-4 text-gray-700 dark:text-gray-300">
            These are predefined functions provided by Python. Examples: <code>print()</code>, <code>len()</code>, <code>type()</code>, <code>sum()</code>, <code>max()</code>.
          </p>
          <h3 class="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-200">2. User-Defined Functions</h3>
          <p class="mb-4 text-gray-700 dark:text-gray-300">
            These are functions created by the programmer using the <code>def</code> keyword. They allow custom logic based on application needs.
          </p>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">4. Defining and Using Functions</h2>
          <p class="mb-4 text-gray-700 dark:text-gray-300">
            To define a function in Python:
            <ul class="list-disc list-inside ml-4">
              <li>Use the <code>def</code> keyword</li>
              <li>Provide a function name</li>
              <li>Add parentheses <code>()</code></li>
              <li>Write the function body with proper indentation</li>
            </ul>
          </p>
          <p class="mb-4 text-gray-700 dark:text-gray-300">
            A function executes only when it is called, not when it is defined.
          </p>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">5. Parameters, Arguments, and Return Values</h2>
          <p class="mb-4 text-gray-700 dark:text-gray-300">
            <strong>Parameters</strong> are variables listed in the function definition, while <strong>Arguments</strong> are actual values passed during the call.
          </p>
          <p class="mb-4 text-gray-700 dark:text-gray-300">
            The <code>return</code> statement sends a value back to the caller. If a function does not use return, it returns <code>None</code> by default. In Data Science, return values are heavily used for calculations, data transformations, and feature engineering.
          </p>
        `,
        duration: '25 min',
        syntax: [
          { title: "Basic Syntax", content: `def function_name():\n    # function body\n    statement` },
          { title: "With Parameters", content: `def function_name(parameter1, parameter2):\n    statement` },
          { title: "With Return", content: `def function_name(parameters):\n    return value` },
          { title: "Calling", content: `function_name(arguments)` },
          { title: "Built-in Example", content: `len([1, 2, 3])` }
        ],
        initialCode: `# Example 1: Simple Function
# Defines and calls a function without parameters.

def greet():
    print("Welcome to Data Science with Python")

greet()

# Example 2: Function with Parameters
# Accepts two values and prints their sum.

def add_numbers(a, b):
    print(f"Sum of {a} and {b} is:", a + b)

add_numbers(10, 20)

# Example 3: Function with Return Value
# Returns a value that can be reused later.

def multiply(x, y):
    return x * y

result = multiply(5, 4)
print("Multiplication Result:", result)

# Example 4: Function Used in Data Science Context
# Demonstrates how functions are used for data calculations.

def calculate_average(values):
    return sum(values) / len(values)

data = [10, 20, 30, 40]
avg = calculate_average(data)
print("Data:", data)
print("Average:", avg)
`
      },
      {
        title: 'Python Modules and Packages',
        content: `
          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">1. Idea of Modules and Packages</h2>
          <p class="mb-4 text-gray-700 dark:text-gray-300">
            A <strong>module</strong> is a single <code>.py</code> file containing Python code (functions, classes, variables) that you can reuse in other programs.
          </p>
          <p class="mb-4 text-gray-700 dark:text-gray-300">
            A <strong>package</strong> is a folder that groups related modules together, usually treated as a higher‑level unit for organizing larger projects.
          </p>
          <p class="mb-4 text-gray-700 dark:text-gray-300">
            In data science, many tools you use (NumPy, Pandas, Matplotlib) are provided as modules and packages that you import into your scripts.
          </p>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">2. Importing and Using Modules</h2>
          <p class="mb-4 text-gray-700 dark:text-gray-300">
            You bring a module into your code with the <code>import</code> statement, such as <code>import math</code> or <code>import sys</code>, typically written at the top of the file.
          </p>
          <p class="mb-4 text-gray-700 dark:text-gray-300">
            After importing, you access functions or variables using the module name as a prefix, for example <code>math.sqrt(16)</code> or <code>sys.version.</code>
          </p>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">3. from … import and Aliases</h2>
          <p class="mb-4 text-gray-700 dark:text-gray-300">
            The form <code>from module import name</code> lets you import specific items (e.g., <code>from math import sqrt</code>) so you can call them directly without the module prefix.
          </p>
          <p class="mb-4 text-gray-700 dark:text-gray-300">
            You can create shorter names with <code>as</code>, which is common in data science, for example <code>import numpy as np</code> and <code>import pandas as pd</code>.
          </p>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">4. Installing Packages with pip (High‑Level)</h2>
          <p class="mb-4 text-gray-700 dark:text-gray-300">
            Many external libraries are installed from the Python Package Index (PyPI) using <code>pip</code>, Python’s default package installer.
          </p>
          <p class="mb-4 text-gray-700 dark:text-gray-300">
            You typically run commands like <code>pip install numpy</code> or <code>pip install pandas</code> inside your active environment to add those packages to your project.
          </p>
        `,
        duration: '20 min',
        syntax: [
          { title: "Import Module", content: `import math\n\nprint(math.sqrt(25))\nprint(math.pi)` },
          { title: "Import Specific", content: `from math import sqrt, pi\n\nprint(sqrt(36))\nprint(pi)` },
          { title: "DS Aliases", content: `import numpy as np\nimport pandas as pd\n\narr = np.array([1, 2, 3])\nprint(arr)\n\nseries = pd.Series([10, 20, 30])\nprint(series)` },
          { title: "pip Install", content: `pip install numpy\npip install pandas` }
        ],
        initialCode: `# Exercise 1: Math Module
# Task: Use the math module for basic calculations.

import math

x = 9
print("Square root:", math.sqrt(x))
print("Pi value:", math.pi)

# Exercise 2: from ... import Example
# Task: Import only what you need.

from math import ceil, floor

value = 5.3
print("\\nValue:", value)
print("Ceil:", ceil(value))
print("Floor:", floor(value))

# Exercise 3: Data Science Style Imports
# Task: Use NumPy and Pandas with standard aliases
# (requires numpy and pandas to be installed/loaded).

import numpy as np
import pandas as pd

# Creating a simple array and series to demonstrate usage
data = np.array([1, 2, 3, 4])
s = pd.Series(data)

print("\\nArray:", data)
print("Series:")
print(s)
`
      },
      {
        title: 'Input and Output Operations',
        content: `
          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">1. Console Output with print()</h2>
          <p class="mb-4 text-gray-700 dark:text-gray-300">
            The <code>print()</code> function displays information on the screen, which is how you show results, debug values, and present messages to users.
          </p>
          <p class="mb-4 text-gray-700 dark:text-gray-300">
            <code>print()</code> can take multiple values separated by commas, and it automatically converts them to strings and separates them with a space by default.
          </p>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">2. Console Input with input()</h2>
          <p class="mb-4 text-gray-700 dark:text-gray-300">
            The <code>input()</code> function reads a line of text typed by the user and always returns a string.
          </p>
          <p class="mb-4 text-gray-700 dark:text-gray-300">
            When you need numbers, you convert the returned string using functions like <code>int()</code> or <code>float()</code>, which is very common when collecting numeric data.
          </p>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">3. Basic Formatting Ideas</h2>
          <p class="mb-4 text-gray-700 dark:text-gray-300">
            You can combine text and variables in several ways: using commas in <code>print()</code>, string concatenation (<code>"Total: " + str(total)</code>), or formatted strings (f‑strings) like <code>f"Total: {total}"</code>.
          </p>
          <p class="mb-4 text-gray-700 dark:text-gray-300">
            Well‑formatted output is important in data science scripts and notebooks so that results, metrics, and summaries are easy to read.
          </p>
        `,
        duration: '15 min',
        syntax: [
          { title: "Simple Output", content: `print("Hello, Data Science with Python!")\nname = "Aisha"\nscore = 85\nprint("Name:", name, "Score:", score)` },
          { title: "Basic Input", content: `user_name = input("Enter your name: ")\nprint("Hello,", user_name)` },
          { title: "Input with Conversion", content: `age_str = input("Enter your age: ")\nage = int(age_str)          # convert string to int\nprint("You will be", age + 1, "next year.")` },
          { title: "f-strings", content: `name = "Ravi"\nmarks = 92\nprint(f"Student {name} scored {marks} marks.")` }
        ],
        initialCode: `# Exercise 1: Basic User Greeting
# Task: Ask the user for their name and course, then greet them.

# NOTE: Since input() is interactive, we will simulate inputs here.
# In a real environment, these would be prompts.
simulated_name = "Alex"
simulated_course = "Data Science Beginner"

print(f"Enter your name: {simulated_name}")
name = simulated_name

print(f"Enter your course name: {simulated_course}")
course = simulated_course

print("Hello", name + ", you are enrolled in", course)

# Exercise 2: Simple Marks Calculator
# Task: Read marks of two subjects and show total and average.

simulated_m1 = "85.5"
simulated_m2 = "90.0"

print(f"\\nEnter marks of subject 1: {simulated_m1}")
m1 = float(simulated_m1)

print(f"Enter marks of subject 2: {simulated_m2}")
m2 = float(simulated_m2)

total = m1 + m2
average = total / 2

print("Total:", total)
print("Average:", average)

# Exercise 3: Data Science Motivation Line
# Task: Ask why the user wants to learn data science and print a message.

simulated_reason = "To build cool AI models!"
print(f"\\nWhy do you want to learn Data Science? {simulated_reason}")
reason = simulated_reason

print("Great! You want to learn Data Science because:", reason)
`
      }
    ]
  },
  {
    id: 'module-3',
    title: 'Module 3 — Data Structures and Core Python',
    duration: '1 week',
    description: 'Deep dive into Python data structures, strings, error handling, and file operations.',
    lessons: [
      {
        title: 'Lists and List Operations',
        content: `
          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Introduction to Lists</h2>
          <p class="mb-4 text-gray-700 dark:text-gray-300">
            In Python, a list is a fundamental data structure used to store multiple values in a single variable. Lists are especially important in Data Science because datasets often consist of collections of values such as numbers, categories, text, or even other datasets. A list allows data scientists to organize, access, and manipulate this data efficiently.
          </p>
          <p class="mb-4 text-gray-700 dark:text-gray-300">
            Unlike variables that store only one value, lists can store any number of values, making them ideal for handling raw data before it is processed using advanced libraries like NumPy or Pandas.
          </p>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Key Characteristics of Lists</h2>
          <p class="mb-4 text-gray-700 dark:text-gray-300">
            Lists in Python have several important characteristics that make them powerful and flexible:
            <ul class="list-disc list-inside ml-4">
              <li><strong>Ordered:</strong> Elements maintain the order in which they are added</li>
              <li><strong>Indexed:</strong> Each element has a position starting from index 0</li>
              <li><strong>Mutable:</strong> Elements can be changed after creation</li>
              <li><strong>Allow duplicates:</strong> Same value can appear multiple times</li>
              <li><strong>Support mixed data types:</strong> Integers, floats, strings, etc.</li>
            </ul>
          </p>
          <p class="mb-4 text-gray-700 dark:text-gray-300">
            These characteristics make lists suitable for real-world data handling scenarios.
          </p>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Why Lists Are Important in Data Science</h2>
          <p class="mb-4 text-gray-700 dark:text-gray-300">
            Lists are widely used in Data Science workflows because they:
            <ul class="list-disc list-inside ml-4">
              <li>Store collected data from APIs, files, or sensors</li>
              <li>Hold intermediate results during calculations</li>
              <li>Act as containers before converting data into arrays or DataFrames</li>
              <li>Support iteration for batch processing of data</li>
            </ul>
          </p>
          <p class="mb-4 text-gray-700 dark:text-gray-300">
            For example, while reading a dataset line by line, values are often appended to a list before further processing.
          </p>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Creating Lists in Python</h2>
          <p class="mb-4 text-gray-700 dark:text-gray-300">
            A list is created using square brackets <code>[ ]</code>, with elements separated by commas. Python allows lists to contain elements of the same or different data types.
          </p>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Accessing List Elements</h2>
          <p class="mb-4 text-gray-700 dark:text-gray-300">
            Python uses zero-based indexing, meaning the first element in a list has index 0. Elements can also be accessed from the end using negative indexing, which is helpful in many data analysis tasks.
          </p>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Modifying List Elements</h2>
          <p class="mb-4 text-gray-700 dark:text-gray-300">
            Since lists are mutable, their elements can be updated after creation. This feature is very useful in Data Science when correcting errors, cleaning data, or replacing missing values.
          </p>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Common List Operations</h2>
          <p class="mb-4 text-gray-700 dark:text-gray-300">
            Lists support several operations that are frequently used in data processing:
            <ul class="list-disc list-inside ml-4">
              <li>Adding new elements</li>
              <li>Removing existing elements</li>
              <li>Updating values</li>
              <li>Finding the length of the list</li>
              <li>Iterating through elements</li>
            </ul>
          </p>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Lists in Real-World Data Science</h2>
          <p class="mb-4 text-gray-700 dark:text-gray-300">
            In real Data Science applications, lists are used to:
            <ul class="list-disc list-inside ml-4">
              <li>Store numerical datasets</li>
              <li>Collect feature values</li>
              <li>Maintain records temporarily</li>
              <li>Perform basic statistical calculations</li>
            </ul>
          </p>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Summary</h2>
          <p class="mb-4 text-gray-700 dark:text-gray-300">
            Lists are one of the most essential data structures in Python. Mastering lists is a critical step toward becoming proficient in Data Science, as they form the base for more advanced data structures and libraries.
          </p>
        `,
        duration: '25 min',
        syntax: [
          { title: "Creating a List", content: `numbers = [10, 20, 30, 40]` },
          { title: "Accessing Elements", content: `numbers[0]      # First element\nnumbers[2]      # Third element\nnumbers[-1]     # Last element` },
          { title: "Modifying Elements", content: `numbers[1] = 25` },
          { title: "Adding Elements", content: `numbers.append(50)` },
          { title: "Removing Elements", content: `numbers.remove(20)` },
          { title: "Length of List", content: `len(numbers)` },
          { title: "Looping Through", content: `for value in numbers:\n    print(value)` }
        ],
        initialCode: `# Example 1: Creating and Displaying a List
data = [5, 10, 15, 20]
print(data)

# 📌 Explanation:
# Creates a list and prints all elements.

# Example 2: Accessing Elements
data = [5, 10, 15, 20]
print("First value:", data[0])
print("Last value:", data[-1])

# 📌 Explanation:
# Shows how to access elements using indexing.

# Example 3: Modifying List Values
data = [100, 200, 300]
data[1] = 250
print(data)

# 📌 Explanation:
# Demonstrates updating list elements.

# Example 4: List in Data Science Context
marks = [72, 80, 90, 88]
average = sum(marks) / len(marks)
print("Average Marks:", average)

# 📌 Explanation:
# Uses a list to perform a basic data analysis operation.
`
      },
      {
        title: 'Tuples and Tuple Operations',
        content: `
          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Introduction to Tuples</h2>
          <p class="mb-4 text-gray-700 dark:text-gray-300">
            A tuple is a built-in Python data structure used to store multiple values in a single variable, similar to a list. However, the key difference is that tuples are <strong>immutable</strong>, meaning their values cannot be changed after creation. This immutability makes tuples more secure and reliable for storing fixed data.
          </p>
          <p class="mb-4 text-gray-700 dark:text-gray-300">
            In Data Science, tuples are commonly used to represent constant data, such as coordinates, configuration values, or records that should not be modified during program execution.
          </p>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Key Characteristics of Tuples</h2>
          <p class="mb-4 text-gray-700 dark:text-gray-300">
            Tuples have several defining characteristics:
            <ul class="list-disc list-inside ml-4">
              <li><strong>Ordered:</strong> Elements maintain their order</li>
              <li><strong>Indexed:</strong> Elements are accessed using index values</li>
              <li><strong>Immutable:</strong> Values cannot be changed once created</li>
              <li><strong>Allow duplicates:</strong> Same value can appear multiple times</li>
              <li><strong>Support mixed data types:</strong> Integers, floats, strings, etc.</li>
            </ul>
          </p>
          <p class="mb-4 text-gray-700 dark:text-gray-300">
            These features make tuples suitable for read-only datasets.
          </p>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Why Use Tuples in Data Science</h2>
          <p class="mb-4 text-gray-700 dark:text-gray-300">
            Tuples are preferred in scenarios where data integrity is important:
            <ul class="list-disc list-inside ml-4">
              <li>Storing fixed configuration values</li>
              <li>Representing coordinates or dimensions</li>
              <li>Returning multiple values from a function</li>
              <li>Using as dictionary keys (since they are immutable)</li>
            </ul>
          </p>
          <p class="mb-4 text-gray-700 dark:text-gray-300">
            Because tuples cannot be modified accidentally, they help prevent data errors.
          </p>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Creating Tuples in Python</h2>
          <p class="mb-4 text-gray-700 dark:text-gray-300">
            Tuples are created using parentheses <code>( )</code>, with elements separated by commas. A tuple can contain one or more elements.
          </p>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Accessing Tuple Elements</h2>
          <p class="mb-4 text-gray-700 dark:text-gray-300">
            Just like lists, tuples use zero-based indexing. Elements can be accessed using both positive and negative indices.
          </p>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Tuple Operations</h2>
          <p class="mb-4 text-gray-700 dark:text-gray-300">
            Although tuples are immutable, they support several useful operations:
            <ul class="list-disc list-inside ml-4">
              <li>Indexing</li>
              <li>Slicing</li>
              <li>Iteration</li>
              <li>Concatenation</li>
              <li>Membership testing</li>
            </ul>
          </p>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Tuple Packing and Unpacking</h2>
          <p class="mb-4 text-gray-700 dark:text-gray-300">
            <strong>Packing:</strong> Assigning multiple values to a tuple.<br>
            <strong>Unpacking:</strong> Extracting values from a tuple into variables.
          </p>
          <p class="mb-4 text-gray-700 dark:text-gray-300">
            This feature is widely used in Data Science for handling multiple return values.
          </p>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Tuples vs Lists</h2>
          <div class="overflow-x-auto">
            <table class="min-w-full text-left text-sm whitespace-nowrap mb-4">
              <thead class="uppercase tracking-wider border-b-2 dark:border-gray-700">
                <tr>
                  <th scope="col" class="px-4 py-2">Feature</th>
                  <th scope="col" class="px-4 py-2">List</th>
                  <th scope="col" class="px-4 py-2">Tuple</th>
                </tr>
              </thead>
              <tbody>
                <tr class="border-b dark:border-gray-700">
                  <td class="px-4 py-2">Mutability</td>
                  <td class="px-4 py-2">Mutable</td>
                  <td class="px-4 py-2">Immutable</td>
                </tr>
                <tr class="border-b dark:border-gray-700">
                  <td class="px-4 py-2">Syntax</td>
                  <td class="px-4 py-2"><code>[ ]</code></td>
                  <td class="px-4 py-2"><code>( )</code></td>
                </tr>
                <tr class="border-b dark:border-gray-700">
                  <td class="px-4 py-2">Performance</td>
                  <td class="px-4 py-2">Slower</td>
                  <td class="px-4 py-2">Faster</td>
                </tr>
                <tr class="border-b dark:border-gray-700">
                  <td class="px-4 py-2">Use Case</td>
                  <td class="px-4 py-2">Dynamic data</td>
                  <td class="px-4 py-2">Fixed data</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Summary</h2>
          <p class="mb-4 text-gray-700 dark:text-gray-300">
            Tuples are efficient, safe, and ideal for storing fixed data. Understanding when to use tuples instead of lists is an important skill in Python and Data Science.
          </p>
        `,
        duration: '20 min',
        syntax: [
          { title: "Creating a Tuple", content: `my_tuple = (10, 20, 30)` },
          { title: "Single-Element Tuple", content: `single_tuple = (10,)` },
          { title: "Accessing Elements", content: `my_tuple[0]\nmy_tuple[-1]` },
          { title: "Tuple Slicing", content: `my_tuple[1:3]` },
          { title: "Tuple Packing", content: `data = 1, 2, 3` },
          { title: "Tuple Unpacking", content: `a, b, c = data` },
          { title: "Iterating Through", content: `for item in my_tuple:\n    print(item)` }
        ],
        initialCode: `# Example 1: Creating and Accessing a Tuple
dimensions = (1920, 1080)
print("Width:", dimensions[0])
print("Height:", dimensions[1])

# 📌 Explanation:
# Shows tuple creation and indexing.

# Example 2: Tuple Immutability
colors = ("red", "green", "blue")
# colors[0] = "yellow"  # This will cause an error
print(colors)

# 📌 Explanation:
# Demonstrates that tuple values cannot be changed.

# Example 3: Tuple Unpacking
point = (5, 10)
x, y = point
print("X:", x)
print("Y:", y)

# 📌 Explanation:
# Shows unpacking of tuple values.

# Example 4: Tuple in Data Science Context
def get_stats(values):
    return min(values), max(values)

data = [10, 20, 30, 40]
minimum, maximum = get_stats(data)
print("Min:", minimum)
print("Max:", maximum)

# 📌 Explanation:
# Uses a tuple to return multiple values from a function.
`
      },
      {
        title: 'Sets and Set Operations',
        content: `
          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Introduction to Sets</h2>
          <p class="mb-4 text-gray-700 dark:text-gray-300">
            A set is a built-in Python data structure used to store a collection of <strong>unique</strong> values. Unlike lists and tuples, sets do not allow duplicate elements and do not maintain any specific order. Sets are extremely useful in Data Science when dealing with distinct values, membership testing, and mathematical set operations.
          </p>
          <p class="mb-4 text-gray-700 dark:text-gray-300">
            In real-world data scenarios, sets are often used to remove duplicate records, find common values between datasets, and perform comparisons efficiently.
          </p>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Key Characteristics of Sets</h2>
          <p class="mb-4 text-gray-700 dark:text-gray-300">
            Sets have the following important properties:
            <ul class="list-disc list-inside ml-4">
              <li><strong>Unordered:</strong> No fixed sequence of elements</li>
              <li><strong>Unindexed:</strong> Elements cannot be accessed by index</li>
              <li><strong>Mutable:</strong> Elements can be added or removed</li>
              <li><strong>Unique values only:</strong> Automatically removes duplicates</li>
              <li>Faster membership testing compared to lists</li>
            </ul>
          </p>
          <p class="mb-4 text-gray-700 dark:text-gray-300">
            These characteristics make sets ideal for operations involving uniqueness.
          </p>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Why Sets Are Important in Data Science</h2>
          <p class="mb-4 text-gray-700 dark:text-gray-300">
            Sets are commonly used in Data Science for:
            <ul class="list-disc list-inside ml-4">
              <li>Removing duplicate values from datasets</li>
              <li>Finding common or different elements between datasets</li>
              <li>Performing fast membership checks</li>
              <li>Handling categorical data efficiently</li>
            </ul>
          </p>
          <p class="mb-4 text-gray-700 dark:text-gray-300">
            For example, identifying unique users, unique product IDs, or unique labels is best handled using sets.
          </p>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Creating Sets in Python</h2>
          <p class="mb-4 text-gray-700 dark:text-gray-300">
            A set is created using curly braces <code>{ }</code> or the <code>set()</code> function. Duplicate values are automatically removed.
          </p>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Adding and Removing Elements</h2>
          <p class="mb-4 text-gray-700 dark:text-gray-300">
            Since sets are mutable, elements can be added or removed dynamically. This is useful when data is updated continuously.
          </p>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Set Operations</h2>
          <p class="mb-4 text-gray-700 dark:text-gray-300">
            Python supports mathematical set operations that are highly valuable in data comparison:
            <ul class="list-disc list-inside ml-4">
              <li><strong>Union:</strong> Combine elements from multiple sets</li>
              <li><strong>Intersection:</strong> Find common elements</li>
              <li><strong>Difference:</strong> Find elements present in one set but not another</li>
              <li><strong>Symmetric Difference:</strong> Elements not common to both sets</li>
            </ul>
          </p>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Sets vs Lists and Tuples</h2>
          <div class="overflow-x-auto">
            <table class="min-w-full text-left text-sm whitespace-nowrap mb-4">
              <thead class="uppercase tracking-wider border-b-2 dark:border-gray-700">
                <tr>
                  <th scope="col" class="px-4 py-2">Feature</th>
                  <th scope="col" class="px-4 py-2">List</th>
                  <th scope="col" class="px-4 py-2">Tuple</th>
                  <th scope="col" class="px-4 py-2">Set</th>
                </tr>
              </thead>
              <tbody>
                <tr class="border-b dark:border-gray-700">
                  <td class="px-4 py-2">Ordered</td>
                  <td class="px-4 py-2">Yes</td>
                  <td class="px-4 py-2">Yes</td>
                  <td class="px-4 py-2">No</td>
                </tr>
                <tr class="border-b dark:border-gray-700">
                  <td class="px-4 py-2">Indexed</td>
                  <td class="px-4 py-2">Yes</td>
                  <td class="px-4 py-2">Yes</td>
                  <td class="px-4 py-2">No</td>
                </tr>
                <tr class="border-b dark:border-gray-700">
                  <td class="px-4 py-2">Mutable</td>
                  <td class="px-4 py-2">Yes</td>
                  <td class="px-4 py-2">No</td>
                  <td class="px-4 py-2">Yes</td>
                </tr>
                <tr class="border-b dark:border-gray-700">
                  <td class="px-4 py-2">Duplicates</td>
                  <td class="px-4 py-2">Allowed</td>
                  <td class="px-4 py-2">Allowed</td>
                  <td class="px-4 py-2">Not Allowed</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Summary</h2>
          <p class="mb-4 text-gray-700 dark:text-gray-300">
            Sets provide a powerful way to handle unique data and perform comparisons. In Data Science, they are essential for data cleaning, validation, and analysis tasks involving uniqueness and relationships.
          </p>
        `,
        duration: '20 min',
        syntax: [
          { title: "Creating a Set", content: `my_set = {1, 2, 3, 4}` },
          { title: "Set with Duplicates", content: `data = {1, 2, 2, 3}\n# Result: {1, 2, 3}` },
          { title: "Adding Elements", content: `my_set.add(5)` },
          { title: "Removing Elements", content: `my_set.remove(2)` },
          { title: "Union", content: `set1 | set2` },
          { title: "Intersection", content: `set1 & set2` },
          { title: "Difference", content: `set1 - set2` },
          { title: "Membership Test", content: `3 in my_set` }
        ],
        initialCode: `# Example 1: Creating a Set
values = {10, 20, 30, 30, 40}
print(values)

# 📌 Explanation:
# Demonstrates automatic removal of duplicates.

# Example 2: Adding and Removing Elements
numbers = {1, 2, 3}
numbers.add(4)
numbers.remove(2)
print(numbers)

# 📌 Explanation:
# Shows how sets can be modified.

# Example 3: Set Operations
data_science = {"Python", "SQL", "Pandas"}
machine_learning = {"Python", "NumPy", "TensorFlow"}

common_skills = data_science & machine_learning
print("Common Skills:", common_skills)

# 📌 Explanation:
# Finds common skills using intersection.

# Example 4: Set in Data Cleaning
raw_data = ["A", "B", "A", "C", "B"]
unique_data = set(raw_data)
print(unique_data)

# 📌 Explanation:
# Uses a set to remove duplicates from data.
`
      },
      {
        title: 'Dictionaries and Key-Value Pairs',
        content: `
          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Introduction to Dictionaries</h2>
          <p class="mb-4 text-gray-700 dark:text-gray-300">
            A dictionary in Python is a powerful data structure used to store data in the form of <strong>key–value pairs</strong>. Unlike lists or tuples, dictionaries allow you to access values using meaningful keys instead of numeric indexes. This makes dictionaries extremely useful in Data Science for representing structured data such as records, attributes, and labeled information.
          </p>
          <p class="mb-4 text-gray-700 dark:text-gray-300">
            In real-world Data Science applications, dictionaries are often used to store JSON data, configuration settings, metadata, and feature-value mappings.
          </p>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Key Characteristics of Dictionaries</h2>
          <p class="mb-4 text-gray-700 dark:text-gray-300">
            Dictionaries have the following important properties:
            <ul class="list-disc list-inside ml-4">
              <li><strong>Key–value based structure</strong></li>
              <li><strong>Unordered (conceptually)</strong></li>
              <li><strong>Mutable</strong> – values can be updated</li>
              <li><strong>Keys must be unique</strong></li>
              <li><strong>Fast data retrieval using keys</strong></li>
            </ul>
          </p>
          <p class="mb-4 text-gray-700 dark:text-gray-300">
            Because of their speed and flexibility, dictionaries are one of the most frequently used data structures in Python.
          </p>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Why Dictionaries Are Important in Data Science</h2>
          <p class="mb-4 text-gray-700 dark:text-gray-300">
            Dictionaries are essential in Data Science because they:
            <ul class="list-disc list-inside ml-4">
              <li>Represent structured records (like rows in a dataset)</li>
              <li>Store feature names with corresponding values</li>
              <li>Handle JSON and API responses</li>
              <li>Enable fast lookups and updates</li>
            </ul>
          </p>
          <p class="mb-4 text-gray-700 dark:text-gray-300">
            For example, a single row of data containing attributes like age, salary, and location can be stored neatly in a dictionary.
          </p>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Creating Dictionaries in Python</h2>
          <p class="mb-4 text-gray-700 dark:text-gray-300">
            Dictionaries are created using curly braces <code>{ }</code>, where each key is paired with a value using a colon <code>:</code>.
          </p>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Accessing Dictionary Values</h2>
          <p class="mb-4 text-gray-700 dark:text-gray-300">
            Values are accessed using their corresponding keys. If a key does not exist, Python raises an error unless safe methods are used.
          </p>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Adding and Updating Elements</h2>
          <p class="mb-4 text-gray-700 dark:text-gray-300">
            Dictionaries are mutable, so new key–value pairs can be added, and existing values can be updated easily.
          </p>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Removing Elements</h2>
          <p class="mb-4 text-gray-700 dark:text-gray-300">
            Python provides multiple ways to remove items from dictionaries, depending on the use case.
          </p>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Common Dictionary Methods</h2>
          <p class="mb-4 text-gray-700 dark:text-gray-300">
            Some commonly used dictionary methods include:
            <ul class="list-disc list-inside ml-4">
              <li><code>keys()</code></li>
              <li><code>values()</code></li>
              <li><code>items()</code></li>
              <li><code>get()</code></li>
              <li><code>update()</code></li>
            </ul>
          </p>
          <p class="mb-4 text-gray-700 dark:text-gray-300">
            These methods are heavily used during data exploration and preprocessing.
          </p>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Dictionaries in Data Science Context</h2>
          <p class="mb-4 text-gray-700 dark:text-gray-300">
            Dictionaries are used to:
            <ul class="list-disc list-inside ml-4">
              <li>Store dataset records</li>
              <li>Parse API responses</li>
              <li>Maintain feature mappings</li>
              <li>Count occurrences (frequency analysis)</li>
            </ul>
          </p>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Summary</h2>
          <p class="mb-4 text-gray-700 dark:text-gray-300">
            Dictionaries allow efficient storage and retrieval of structured data. Mastering dictionaries is crucial for working with real-world datasets and APIs in Data Science.
          </p>
        `,
        duration: '25 min',
        syntax: [
          { title: "Creating a Dictionary", content: `student = {\n    "name": "Ravi",\n    "age": 22,\n    "marks": 85\n}` },
          { title: "Accessing Values", content: `student["name"]\nstudent.get("age")` },
          { title: "Adding a New Key-Value Pair", content: `student["grade"] = "A"` },
          { title: "Updating a Value", content: `student["marks"] = 90` },
          { title: "Removing Elements", content: `del student["age"]` },
          { title: "Getting Keys, Values, Items", content: `student.keys()\nstudent.values()\nstudent.items()` }
        ],
        initialCode: `# Example 1: Creating and Accessing a Dictionary
employee = {
    "id": 101,
    "name": "Anita",
    "salary": 50000
}

print(employee["name"])

# 📌 Explanation:
# Accesses dictionary values using keys.

# Example 2: Adding and Updating Values
employee["department"] = "Data Science"
employee["salary"] = 55000
print(employee)

# 📌 Explanation:
# Shows how dictionaries are updated dynamically.

# Example 3: Iterating Through a Dictionary
for key, value in employee.items():
    print(key, ":", value)

# 📌 Explanation:
# Demonstrates dictionary traversal.

# Example 4: Dictionary in Data Science (Frequency Count)
data = ["A", "B", "A", "C", "B", "A"]
frequency = {}

for item in data:
    frequency[item] = frequency.get(item, 0) + 1

print(frequency)

# 📌 Explanation:
# Uses a dictionary to count occurrences in data.`
      },
      {
        title: 'String Manipulation',
        content: `
          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Introduction to Strings</h2>
          <p class="mb-4 text-gray-700 dark:text-gray-300">
            A string in Python is a sequence of characters enclosed in single (' ') or double (" ") quotes. Strings are one of the most widely used data types in Data Science because textual data is everywhere—user inputs, logs, social media data, and textual datasets. Manipulating and analyzing strings is a core skill for a data scientist.
          </p>
          <p class="mb-4 text-gray-700 dark:text-gray-300">
            String manipulation allows you to clean, transform, and analyze text data, which is essential in tasks like feature engineering, NLP (Natural Language Processing), and report generation.
          </p>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Key Characteristics of Strings</h2>
          <ul class="list-disc list-inside ml-4 mb-4 text-gray-700 dark:text-gray-300">
            <li><strong>Ordered:</strong> Characters maintain their order</li>
            <li><strong>Indexed:</strong> Each character can be accessed by position</li>
            <li><strong>Immutable:</strong> Strings cannot be changed in-place</li>
            <li><strong>Iterable:</strong> Can loop through each character</li>
            <li><strong>Supports slicing:</strong> Extract portions of text easily</li>
          </ul>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Why String Manipulation is Important in Data Science</h2>
          <ul class="list-disc list-inside ml-4 mb-4 text-gray-700 dark:text-gray-300">
            <li>Cleaning datasets (removing extra spaces, punctuation)</li>
            <li>Transforming data (converting cases, formatting)</li>
            <li>Extracting insights from text (emails, reviews, logs)</li>
            <li>Preparing textual data for ML models</li>
          </ul>
          <p class="mb-4 text-gray-700 dark:text-gray-300">
            For example, in sentiment analysis, raw user reviews are cleaned and standardized using string manipulation techniques.
          </p>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Common String Operations</h2>
          <ul class="list-disc list-inside ml-4 mb-4 text-gray-700 dark:text-gray-300">
            <li><strong>Accessing Characters:</strong> Using indexing</li>
            <li><strong>Slicing Strings:</strong> Extract parts of a string</li>
            <li><strong>Concatenation:</strong> Joining multiple strings</li>
            <li><strong>Repetition:</strong> Repeating strings using *</li>
            <li><strong>Changing Case:</strong> upper(), lower(), capitalize()</li>
            <li><strong>Trimming Spaces:</strong> strip(), lstrip(), rstrip()</li>
            <li><strong>Splitting and Joining:</strong> split() and join()</li>
            <li><strong>Searching and Replacing:</strong> find(), replace()</li>
            <li><strong>Checking Content:</strong> isalnum(), isalpha(), isdigit()</li>
          </ul>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Strings in Data Science Context</h2>
          <ul class="list-disc list-inside ml-4 mb-4 text-gray-700 dark:text-gray-300">
            <li><strong>Data Cleaning:</strong> Remove unnecessary spaces or characters</li>
            <li><strong>Feature Engineering:</strong> Extract keywords, hashtags, or mentions</li>
            <li><strong>Parsing Logs:</strong> Extract relevant information from text files</li>
            <li><strong>Text Analysis:</strong> Count words, analyze patterns</li>
          </ul>
          <p class="mb-4 text-gray-700 dark:text-gray-300">
            String manipulation is the bridge between raw text data and structured analysis.
          </p>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Summary</h2>
          <p class="mb-4 text-gray-700 dark:text-gray-300">
            Mastering strings and their operations is essential for processing text-based datasets. Efficient string manipulation allows data scientists to prepare clean, structured data for analysis and modeling.
          </p>
        `,
        duration: '25 min',
        syntax: [
          { title: "Creating a String", content: `text = "Data Science is fun!"` },
          { title: "Accessing Characters", content: `text[0]      # First character\\ntext[-1]     # Last character` },
          { title: "Slicing Strings", content: `text[0:4]    # 'Data'\\ntext[5:]     # 'Science is fun!'` },
          { title: "String Methods", content: `text.upper()       # 'DATA SCIENCE IS FUN!'\\ntext.lower()       # 'data science is fun!'\\ntext.replace("fun", "awesome")\\ntext.split()       # ['Data', 'Science', 'is', 'fun!']\\n" ".join(["Data", "Science"])  # 'Data Science'\\ntext.strip()       # Removes leading/trailing spaces` },
          { title: "Checking Content", content: `"text123".isalnum()  # True\\n"text".isalpha()     # True\\n"123".isdigit()      # True` }
        ],
        initialCode: `# Example 1: Accessing and Slicing Strings
sentence = "Data Science"
print(sentence[0])    # D
print(sentence[5:12]) # Science

# Example 2: Changing Case and Trimming
text = "  hello world  "
print(text.upper())
print(text.strip())

# Example 3: Splitting and Joining Strings
words = "Data Science is fun".split()
print(words)
joined = "-".join(words)
print(joined)

# Example 4: String in Data Science Context
review = "I love Python and Data Science!"
# Count number of words
word_count = len(review.split())
print("Number of words:", word_count)`
      },
      {
        title: 'Type Casting and Type Checking',
        content: `
          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Introduction to Type Casting and Type Checking</h2>
          <p class="mb-4 text-gray-700 dark:text-gray-300">
            In Python, type casting refers to the process of converting a variable from one data type to another, while type checking is used to determine the data type of a variable. These concepts are essential in Data Science because datasets often contain mixed data types, and calculations or analyses require consistent types for accuracy.
          </p>
          <p class="mb-4 text-gray-700 dark:text-gray-300">
            For example, numeric data stored as strings must be converted to integers or floats before performing mathematical operations.
          </p>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Why Type Casting and Checking are Important in Data Science</h2>
          <ul class="list-disc list-inside ml-4 mb-4 text-gray-700 dark:text-gray-300">
            <li>Ensure correct operations on data</li>
            <li>Avoid runtime errors due to incompatible types</li>
            <li>Prepare data for machine learning models</li>
            <li>Maintain data consistency across datasets</li>
          </ul>
          <p class="mb-4 text-gray-700 dark:text-gray-300">
            Without type casting, data cleaning and preprocessing can become error-prone, especially when working with CSV files or external data sources.
          </p>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Common Data Types in Python</h2>
          <ul class="list-disc list-inside ml-4 mb-4 text-gray-700 dark:text-gray-300">
            <li><strong>int</strong> – Integer numbers</li>
            <li><strong>float</strong> – Decimal numbers</li>
            <li><strong>str</strong> – Text data</li>
            <li><strong>bool</strong> – Boolean values (True or False)</li>
            <li><strong>list, tuple, set, dict</strong> – Collections of data</li>
          </ul>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Type Checking</h2>
          <p class="mb-4 text-gray-700 dark:text-gray-300">
            Python provides the built-in function <code>type()</code> to check the type of any variable.
          </p>
          <pre class="bg-gray-100 dark:bg-gray-800 p-3 rounded mb-4 text-sm font-mono text-gray-800 dark:text-gray-200">
x = 10
type(x)   # &lt;class 'int'&gt;
          </pre>
          <p class="mb-4 text-gray-700 dark:text-gray-300">
            Type checking is essential before performing conversions or calculations.
          </p>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Type Casting</h2>
          <p class="mb-4 text-gray-700 dark:text-gray-300">
            Python allows explicit type conversion using built-in functions:
          </p>
          <ul class="list-disc list-inside ml-4 mb-4 text-gray-700 dark:text-gray-300">
            <li><code>int()</code> – Convert to integer</li>
            <li><code>float()</code> – Convert to float</li>
            <li><code>str()</code> – Convert to string</li>
            <li><code>bool()</code> – Convert to boolean</li>
          </ul>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Type Casting in Data Science Context</h2>
          <ul class="list-disc list-inside ml-4 mb-4 text-gray-700 dark:text-gray-300">
            <li>Converting text-based numbers into integers/floats for analysis</li>
            <li>Converting categorical variables into strings for labeling</li>
            <li>Boolean conversion for flag columns or conditional filtering</li>
          </ul>
          <p class="mb-4 text-gray-700 dark:text-gray-300">
            For example, survey data collected as text might need type conversion for calculations.
          </p>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Summary</h2>
          <p class="mb-4 text-gray-700 dark:text-gray-300">
            Type casting and checking are fundamental preprocessing steps in Data Science. Proper use ensures that computations are accurate and data pipelines run smoothly.
          </p>
        `,
        duration: '20 min',
        syntax: [
          { title: "Type Checking", content: `x = 25\\nprint(type(x))   # <class 'int'>` },
          { title: "Converting to Integer", content: `y = "100"\\ny_int = int(y)` },
          { title: "Converting to Float", content: `z = "45.67"\\nz_float = float(z)` },
          { title: "Converting to String", content: `num = 50\\nnum_str = str(num)` },
          { title: "Converting to Boolean", content: `flag = 1\\nbool_flag = bool(flag)  # True` }
        ],
        initialCode: `# Example 1: Type Checking
value = 12.5
print("Type of value:", type(value))

# Example 2: Converting String to Integer
age_str = "30"
age = int(age_str)
print("Age:", age, "Type:", type(age))

# Example 3: Converting Integer to Float and String
x = 25
x_float = float(x)
x_str = str(x)
print(x_float, type(x_float))
print(x_str, type(x_str))

# Example 4: Data Science Context
# Convert survey responses from string to numeric for analysis
responses = ["5", "3", "4", "5"]
numeric_responses = [int(r) for r in responses]
average = sum(numeric_responses) / len(numeric_responses)
print("Average Response:", average)`
      },
      {
        title: 'Exception Handling Basics',
        content: `
          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Introduction to Exception Handling</h2>
          <p class="mb-4 text-gray-700 dark:text-gray-300">
            In Python, an exception is an error that occurs during the execution of a program. Exception handling is the process of catching and managing these errors to prevent the program from crashing. In Data Science, handling exceptions is crucial because datasets often contain missing values, incorrect formats, or unexpected inputs. Proper exception handling ensures that the analysis pipeline runs smoothly and reliably.
          </p>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Why Exception Handling is Important in Data Science</h2>
          <ul class="list-disc list-inside ml-4 mb-4 text-gray-700 dark:text-gray-300">
            <li>Prevents program crashes when unexpected data is encountered</li>
            <li>Allows for graceful error messages</li>
            <li>Ensures data processing continues even if some values are problematic</li>
            <li>Helps debug and log errors effectively for large datasets</li>
          </ul>
          <p class="mb-4 text-gray-700 dark:text-gray-300">
            For example, converting a string to an integer may fail if the string contains text. Exception handling prevents the program from stopping and allows corrective action.
          </p>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Common Python Exceptions</h2>
          <p class="mb-4 text-gray-700 dark:text-gray-300">
            Some of the most common exceptions are:
          </p>
          <ul class="list-disc list-inside ml-4 mb-4 text-gray-700 dark:text-gray-300">
            <li><strong>ZeroDivisionError</strong> – Division by zero</li>
            <li><strong>ValueError</strong> – Invalid type conversion or value</li>
            <li><strong>TypeError</strong> – Unsupported operation between types</li>
            <li><strong>IndexError</strong> – Accessing out-of-range index</li>
            <li><strong>KeyError</strong> – Accessing a missing dictionary key</li>
            <li><strong>FileNotFoundError</strong> – File does not exist</li>
          </ul>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Basic Exception Handling Syntax</h2>
          <p class="mb-4 text-gray-700 dark:text-gray-300">
            Python uses the <code>try-except</code> block to handle exceptions:
          </p>
          <pre class="bg-gray-100 dark:bg-gray-800 p-3 rounded mb-4 text-sm font-mono text-gray-800 dark:text-gray-200">
try:
    # Code that may raise an exception
except ExceptionType:
    # Code to handle the exception
          </pre>
          <p class="mb-4 text-gray-700 dark:text-gray-300">
            You can also handle multiple exceptions or use a generic exception.
          </p>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Else and Finally</h2>
          <ul class="list-disc list-inside ml-4 mb-4 text-gray-700 dark:text-gray-300">
            <li><strong>else</strong> – Executes if no exception occurs</li>
            <li><strong>finally</strong> – Executes regardless of whether an exception occurred (used for cleanup)</li>
          </ul>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Exception Handling in Data Science Context</h2>
          <ul class="list-disc list-inside ml-4 mb-4 text-gray-700 dark:text-gray-300">
            <li>Reading files with missing or corrupted data</li>
            <li>Converting mixed-type columns to numeric</li>
            <li>Handling missing keys in JSON responses from APIs</li>
            <li>Skipping invalid rows during data preprocessing</li>
          </ul>
          <p class="mb-4 text-gray-700 dark:text-gray-300">
            Proper exception handling ensures robust and production-ready data pipelines.
          </p>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Summary</h2>
          <p class="mb-4 text-gray-700 dark:text-gray-300">
            Exception handling is essential for building error-tolerant Python programs. For Data Scientists, it helps maintain workflow stability, prevents crashes, and allows better debugging and data validation.
          </p>
        `,
        duration: '20 min',
        syntax: [
          { title: "Basic Try-Except", content: `try:\\n    x = 10 / 0\\nexcept ZeroDivisionError:\\n    print("Cannot divide by zero!")` },
          { title: "Handling Multiple Exceptions", content: `try:\\n    num = int("abc")\\nexcept ValueError:\\n    print("Invalid integer conversion!")\\nexcept TypeError:\\n    print("Type error occurred!")` },
          { title: "Using Else and Finally", content: `try:\\n    x = 10 / 2\\nexcept ZeroDivisionError:\\n    print("Error!")\\nelse:\\n    print("Division successful:", x)\\nfinally:\\n    print("Execution completed")` }
        ],
        initialCode: `# Example 1: Simple Exception Handling
try:
    result = 10 / 0
except ZeroDivisionError:
    print("Cannot divide by zero!")

# 📌 Explanation:
# Catches division by zero error and prints a message instead of crashing.

# Example 2: Handling ValueError
try:
    num = int("Python")
except ValueError:
    print("Invalid conversion! Cannot convert to integer.")

# Example 3: Using Else and Finally
try:
    data = [1, 2, 3]
    print(data[1])
except IndexError:
    print("Index out of range!")
else:
    print("Accessed element successfully")
finally:
    print("Execution completed")

# Example 4: Exception Handling in Data Science Context
data = ["10", "20", "abc", "30"]
numeric_data = []

for item in data:
    try:
        numeric_data.append(int(item))
    except ValueError:
        print(f"Skipping invalid value: {item}")

print("Cleaned numeric data:", numeric_data)

# 📌 Explanation:
# Demonstrates handling invalid entries in a dataset without stopping the program.`
      },
      {
        title: 'File Handling Basics',
        content: `
          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Introduction to File Handling</h2>
          <p class="mb-4 text-gray-700 dark:text-gray-300">
            File handling is the process of reading from and writing to files in Python. In Data Science, datasets are often stored in files like CSV, TXT, or JSON, and being able to read and manipulate these files is crucial. Python provides built-in functions and methods to open, read, write, and close files efficiently.
          </p>
          <p class="mb-4 text-gray-700 dark:text-gray-300">
            Proper file handling allows data scientists to load raw data, preprocess it, and save processed results.
          </p>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Why File Handling is Important in Data Science</h2>
          <ul class="list-disc list-inside ml-4 mb-4 text-gray-700 dark:text-gray-300">
            <li>Load datasets from external sources (CSV, TXT, JSON)</li>
            <li>Save processed data for analysis or reporting</li>
            <li>Handle large datasets in chunks without memory issues</li>
            <li>Automate data extraction and reporting tasks</li>
          </ul>
          <p class="mb-4 text-gray-700 dark:text-gray-300">
            For example, reading a CSV file containing survey data or logging results from experiments requires effective file handling.
          </p>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Common File Operations</h2>
          <ul class="list-disc list-inside ml-4 mb-4 text-gray-700 dark:text-gray-300">
            <li><strong>Opening a File</strong> – Use the <code>open()</code> function</li>
            <li><strong>Reading a File</strong> – Read the content using <code>read()</code>, <code>readline()</code>, or <code>readlines()</code></li>
            <li><strong>Writing to a File</strong> – Write content using <code>write()</code> or <code>writelines()</code></li>
            <li><strong>Closing a File</strong> – Use <code>close()</code> to free resources</li>
            <li><strong>Using with statement</strong> – Automatically closes the file</li>
          </ul>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">File Modes in Python</h2>
          <div class="overflow-x-auto mb-4">
            <table class="min-w-full text-left text-sm whitespace-nowrap">
              <thead class="uppercase tracking-wider border-b-2 dark:border-gray-700 border-gray-200 bg-gray-100 dark:bg-gray-800">
                <tr>
                  <th scope="col" class="px-6 py-4 dark:text-gray-200">Mode</th>
                  <th scope="col" class="px-6 py-4 dark:text-gray-200">Description</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
                <tr>
                  <td class="px-6 py-4 dark:text-gray-300">'r'</td>
                  <td class="px-6 py-4 dark:text-gray-300">Read (default)</td>
                </tr>
                <tr>
                  <td class="px-6 py-4 dark:text-gray-300">'w'</td>
                  <td class="px-6 py-4 dark:text-gray-300">Write (creates new file or overwrites)</td>
                </tr>
                <tr>
                  <td class="px-6 py-4 dark:text-gray-300">'a'</td>
                  <td class="px-6 py-4 dark:text-gray-300">Append (adds content to end of file)</td>
                </tr>
                <tr>
                  <td class="px-6 py-4 dark:text-gray-300">'r+'</td>
                  <td class="px-6 py-4 dark:text-gray-300">Read and write</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">File Handling in Data Science Context</h2>
          <ul class="list-disc list-inside ml-4 mb-4 text-gray-700 dark:text-gray-300">
            <li>Reading large CSV files containing millions of rows</li>
            <li>Writing cleaned and preprocessed datasets to files</li>
            <li>Logging results of analysis for reproducibility</li>
            <li>Automating reports for stakeholders</li>
          </ul>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Summary</h2>
          <p class="mb-4 text-gray-700 dark:text-gray-300">
            File handling is essential for data ingestion and storage. Mastering it ensures data can be accessed, processed, and saved efficiently in Python workflows.
          </p>
        `,
        duration: '20 min',
        syntax: [
          { title: "Opening and Closing", content: `file = open("data.txt", "r")  # Open file in read mode\\ncontent = file.read()\\nfile.close()` },
          { title: "Using with Statement", content: `with open("data.txt", "r") as file:\\n    content = file.read()` },
          { title: "Writing to a File", content: `with open("output.txt", "w") as file:\\n    file.write("Data Science is fun!")` },
          { title: "Appending to a File", content: `with open("output.txt", "a") as file:\\n    file.write("\\nLearn Python for Data Science")` },
          { title: "Reading Lines", content: `with open("data.txt", "r") as file:\\n    lines = file.readlines()` }
        ],
        initialCode: `# Example 1: Reading a File
with open("sample.txt", "r") as file:
    content = file.read()
print(content)

# 📌 Explanation:
# Reads the entire file content and prints it.

# Example 2: Writing to a File
with open("results.txt", "w") as file:
    file.write("Data processed successfully.")

# 📌 Explanation:
# Creates a new file and writes text.

# Example 3: Appending to a File
with open("results.txt", "a") as file:
    file.write("\\nNext step completed.")

# 📌 Explanation:
# Adds new lines to an existing file.

# Example 4: Reading Line by Line
with open("sample.txt", "r") as file:
    for line in file:
        print(line.strip())

# 📌 Explanation:
# Reads each line individually, removes extra spaces, and prints.`
      },
      {
        title: 'Python Coding Best Practices',
        content: `
          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Introduction to Python Coding Best Practices</h2>
          <p class="mb-4 text-gray-700 dark:text-gray-300">
            Writing clean, efficient, and readable code is a critical skill for Data Scientists. Python is designed to be readable and maintainable, but following best practices ensures that your code is scalable, reusable, and error-free. Best practices also make it easier for teams to collaborate on data analysis projects and machine learning pipelines.
          </p>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Why Coding Best Practices Matter in Data Science</h2>
          <ul class="list-disc list-inside ml-4 mb-4 text-gray-700 dark:text-gray-300">
            <li>Improves code readability and maintainability</li>
            <li>Reduces bugs and errors</li>
            <li>Ensures efficient performance on large datasets</li>
            <li>Facilitates collaboration in team projects</li>
            <li>Makes code easier to debug and enhance</li>
          </ul>
          <p class="mb-4 text-gray-700 dark:text-gray-300">
            In real-world Data Science projects, messy code can lead to misinterpretation of data, incorrect results, or slow pipelines.
          </p>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Key Python Coding Best Practices</h2>
          <ul class="list-disc list-inside ml-4 mb-4 text-gray-700 dark:text-gray-300">
            <li><strong>Use Meaningful Variable Names:</strong> Instead of x, y, use age, salary. Makes code self-documenting.</li>
            <li><strong>Follow PEP 8 Guidelines:</strong> Standard Python style guide for indentation, spacing, and naming conventions.</li>
            <li><strong>Write Modular Code with Functions:</strong> Break code into reusable functions for clarity.</li>
            <li><strong>Add Comments and Docstrings:</strong> Explain logic, especially for complex operations.</li>
            <li><strong>Use List Comprehensions and Efficient Loops:</strong> Cleaner and faster than traditional loops.</li>
            <li><strong>Handle Exceptions Gracefully:</strong> Prevent crashes and unexpected errors.</li>
            <li><strong>Avoid Hardcoding Values:</strong> Use variables or configuration files instead of fixed numbers.</li>
            <li><strong>Keep Code DRY (Don’t Repeat Yourself):</strong> Reuse functions instead of duplicating code.</li>
            <li><strong>Test and Validate Your Code:</strong> Unit tests, sample inputs, and assertions ensure reliability.</li>
          </ul>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Best Practices in Data Science Context</h2>
          <ul class="list-disc list-inside ml-4 mb-4 text-gray-700 dark:text-gray-300">
            <li>Naming datasets and variables clearly: <code>customer_data</code>, <code>sales_list</code></li>
            <li>Writing functions for repeated preprocessing steps</li>
            <li>Adding comments in complex data transformations</li>
            <li>Handling exceptions when reading files or APIs</li>
            <li>Modular code for pipelines: cleaning → feature engineering → modeling</li>
          </ul>
          <p class="mb-4 text-gray-700 dark:text-gray-300">
            Good practices reduce errors, make workflows reproducible, and prepare the code for production.
          </p>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Summary</h2>
          <p class="mb-4 text-gray-700 dark:text-gray-300">
            Following Python coding best practices is essential to write robust, maintainable, and professional code. In Data Science, clean and efficient code allows you to process large datasets, build models, and collaborate effectively with other data professionals.
          </p>
        `,
        duration: '20 min',
        syntax: [
          { title: "Meaningful Variable Names", content: `# Bad\nx = [10, 20, 30]\n\n# Good\nages = [10, 20, 30]` },
          { title: "Using Functions for Modular Code", content: `def calculate_average(numbers):\n    return sum(numbers) / len(numbers)\n\nscores = [80, 90, 70]\nprint(calculate_average(scores))` },
          { title: "Comments and Docstrings", content: `# Calculate sum of numbers\ndef total(numbers):\n    """Returns the total sum of a list"""\n    return sum(numbers)` },
          { title: "List Comprehension", content: `numbers = [1, 2, 3, 4, 5]\nsquared = [n**2 for n in numbers]\nprint(squared)` },
          { title: "Exception Handling", content: `try:\n    value = int("abc")\nexcept ValueError:\n    print("Invalid integer conversion")` }
        ],
        initialCode: `# Example 1: Modular and Readable Code
def preprocess_data(data):
    """Removes negative values and returns clean list"""
    clean_data = [x for x in data if x >= 0]
    return clean_data

raw_data = [10, -5, 20, -1, 30]
cleaned = preprocess_data(raw_data)
print(cleaned)


# 📌 Explanation:
# Uses a function and list comprehension for clean, reusable code.

# Example 2: Adding Comments
# Convert strings to integers safely
data = ["1", "2", "a", "4"]
numeric = []

for item in data:
    try:
        numeric.append(int(item))
    except ValueError:
        # Skip invalid entries
        continue

print(numeric)

# Example 3: Using Meaningful Variable Names
# Bad practice
a = [10, 20, 30]

# Good practice
customer_ages = [10, 20, 30]
print(customer_ages)

# 🎯 Learning Outcomes
# After completing this topic, learners will be able to:
# - Write clean, readable, and maintainable Python code
# - Apply modular programming with functions
# - Follow PEP 8 guidelines for professional code
# - Handle exceptions and errors effectively
# - Use best practices in Data Science workflows`
      }
    ]
  },
  {
    id: 'module-4',
    title: 'Module 4 — Python Libraries for Data Science',
    duration: '1 week',
    description: 'Master NumPy and Pandas for high-performance data manipulation and analysis.',
    lessons: [
      {
        title: 'Introduction to NumPy',
        content: `
          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">What is NumPy?</h2>
          <p class="mb-4 text-gray-700 dark:text-gray-300">
            NumPy (Numerical Python) is a core Python library used for numerical computing and data processing in Data Science. It provides powerful tools to work with large datasets, multi-dimensional arrays, and mathematical operations efficiently.
            <br><br>
            In Data Science, handling large volumes of numerical data using regular Python lists becomes slow and inefficient. NumPy solves this problem by offering high-performance array structures and optimized operations written in C, making computations much faster.
          </p>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Why NumPy is Important in Data Science</h2>
          <p class="mb-4 text-gray-700 dark:text-gray-300">
            NumPy forms the foundation of almost all Data Science libraries, including Pandas, SciPy, Matplotlib, Scikit-learn, and deep learning frameworks.
          </p>
          <ul class="list-disc list-inside ml-4 mb-4 text-gray-700 dark:text-gray-300">
            <li><strong>Efficient storage:</strong> optimized for large datasets</li>
            <li><strong>Faster computations:</strong> significantly faster than Python lists</li>
            <li><strong>Multi-dimensional arrays:</strong> support for matrices and tensors</li>
            <li><strong>Built-in functions:</strong> mathematical and statistical tools</li>
            <li><strong>Foundation:</strong> basis for machine learning and scientific computing</li>
          </ul>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Key Features of NumPy</h2>
          <ul class="list-disc list-inside ml-4 mb-4 text-gray-700 dark:text-gray-300">
            <li><strong>N-dimensional Arrays (ndarray):</strong> Store data in rows, columns, and higher dimensions.</li>
            <li><strong>Vectorized Operations:</strong> Perform operations on entire datasets without loops.</li>
            <li><strong>Mathematical Functions:</strong> Includes mean, sum, min, max, standard deviation, etc.</li>
            <li><strong>Broadcasting:</strong> Allows operations between arrays of different shapes.</li>
            <li><strong>Memory Efficiency:</strong> Uses less memory compared to Python lists.</li>
          </ul>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">NumPy vs Python Lists</h2>
          <div class="overflow-x-auto mb-6">
            <table class="min-w-full text-left text-sm whitespace-nowrap">
              <thead class="uppercase tracking-wider border-b-2 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th scope="col" class="px-6 py-4 dark:text-gray-200">Feature</th>
                  <th scope="col" class="px-6 py-4 dark:text-gray-200">Python List</th>
                  <th scope="col" class="px-6 py-4 dark:text-gray-200">NumPy Array</th>
                </tr>
              </thead>
              <tbody class="divide-y dark:divide-gray-700">
                <tr>
                  <td class="px-6 py-4 dark:text-gray-300">Speed</td>
                  <td class="px-6 py-4 dark:text-gray-300">Slower</td>
                  <td class="px-6 py-4 dark:text-gray-300">Much Faster</td>
                </tr>
                <tr>
                  <td class="px-6 py-4 dark:text-gray-300">Memory Usage</td>
                  <td class="px-6 py-4 dark:text-gray-300">High</td>
                  <td class="px-6 py-4 dark:text-gray-300">Optimized</td>
                </tr>
                <tr>
                  <td class="px-6 py-4 dark:text-gray-300">Mathematical Ops</td>
                  <td class="px-6 py-4 dark:text-gray-300">Limited</td>
                  <td class="px-6 py-4 dark:text-gray-300">Extensive</td>
                </tr>
                <tr>
                  <td class="px-6 py-4 dark:text-gray-300">Multi-dimensional</td>
                  <td class="px-6 py-4 dark:text-gray-300">Not native</td>
                  <td class="px-6 py-4 dark:text-gray-300">Built-in</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Summary</h2>
          <p class="mb-4 text-gray-700 dark:text-gray-300">
            NumPy is a fundamental library for numerical computation in Data Science. Mastering NumPy is essential before learning Pandas, data visualization, and machine learning. It allows data scientists to work efficiently with large datasets and perform complex mathematical operations with ease.
          </p>
        `,
        duration: '15 min',
        syntax: [
          { title: "Installing NumPy", content: `pip install numpy` },
          { title: "Importing NumPy", content: `import numpy as np` },
          { title: "Creating a NumPy Array", content: `import numpy as np\n\ndata = np.array([10, 20, 30, 40])\nprint(data)` },
          { title: "Checking Array Type", content: `print(type(data))` },
          { title: "Basic Mathematical Operations", content: `arr = np.array([1, 2, 3, 4])\n\nprint(arr + 2)\nprint(arr * 2)` }
        ],
        initialCode: `# Example 1: Creating and Using NumPy Arrays
import numpy as np

scores = np.array([85, 90, 78, 92])
print("Scores:", scores)


# 📌 Explanation:
# Creates a NumPy array to store numerical data efficiently.

# Example 2: Vectorized Operations
import numpy as np

marks = np.array([60, 70, 80])
updated_marks = marks + 5

print("Updated Marks:", updated_marks)


# 📌 Explanation:
# Adds 5 to all elements without using loops.

# Example 3: Performance Advantage
import numpy as np

numbers = np.array([1, 2, 3, 4, 5])
squared = numbers ** 2

print(squared)`
      },
      {
        title: 'NumPy Arrays and Mathematical Operations',
        content: `
          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Understanding NumPy Arrays</h2>
          <p class="mb-4 text-gray-700 dark:text-gray-300">
            A NumPy array (ndarray) is a powerful data structure used to store numerical data efficiently. Unlike Python lists, NumPy arrays store elements of the same data type, which makes them faster and more memory-efficient.
          </p>
          <ul class="list-disc list-inside ml-4 mb-4 text-gray-700 dark:text-gray-300">
            <li><strong>1-Dimensional (vectors)</strong></li>
            <li><strong>2-Dimensional (matrices)</strong></li>
            <li><strong>Multi-Dimensional (tensors)</strong></li>
          </ul>
          <p class="mb-4 text-gray-700 dark:text-gray-300">
            These arrays form the backbone of data analysis, machine learning models, and scientific computations.
          </p>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Creating NumPy Arrays</h2>
          <p class="mb-4 text-gray-700 dark:text-gray-300">
            NumPy provides multiple ways to create arrays:
          </p>
          <ul class="list-disc list-inside ml-4 mb-4 text-gray-700 dark:text-gray-300">
            <li>From Python lists</li>
            <li>Using built-in functions (zeros, ones, arange, linspace)</li>
            <li>Random number generation</li>
          </ul>
          <p class="mb-4 text-gray-700 dark:text-gray-300">
            Each method serves different use cases in data science workflows.
          </p>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Array Attributes</h2>
          <p class="mb-4 text-gray-700 dark:text-gray-300">
            Important properties of NumPy arrays:
          </p>
          <ul class="list-disc list-inside ml-4 mb-4 text-gray-700 dark:text-gray-300">
            <li><strong>shape:</strong> structure of the array</li>
            <li><strong>ndim:</strong> number of dimensions</li>
            <li><strong>size:</strong> total number of elements</li>
            <li><strong>dtype:</strong> data type of elements</li>
          </ul>
          <p class="mb-4 text-gray-700 dark:text-gray-300">
            Understanding these attributes helps in data preprocessing and model building.
          </p>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Mathematical Operations on NumPy Arrays</h2>
          <p class="mb-4 text-gray-700 dark:text-gray-300">
            NumPy allows element-wise mathematical operations without loops:
          </p>
          <ul class="list-disc list-inside ml-4 mb-4 text-gray-700 dark:text-gray-300">
            <li>Addition</li>
            <li>Subtraction</li>
            <li>Multiplication</li>
            <li>Division</li>
            <li>Power operations</li>
          </ul>
          <p class="mb-4 text-gray-700 dark:text-gray-300">
            This is called <strong>vectorization</strong>, which improves performance and readability.
          </p>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Statistical Operations</h2>
          <p class="mb-4 text-gray-700 dark:text-gray-300">
            NumPy supports built-in statistical functions:
          </p>
          <ul class="list-disc list-inside ml-4 mb-4 text-gray-700 dark:text-gray-300">
            <li>Mean</li>
            <li>Sum</li>
            <li>Minimum and Maximum</li>
            <li>Standard Deviation</li>
            <li>Variance</li>
          </ul>
          <p class="mb-4 text-gray-700 dark:text-gray-300">
            These operations are widely used in Exploratory Data Analysis (EDA).
          </p>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Broadcasting in NumPy</h2>
          <p class="mb-4 text-gray-700 dark:text-gray-300">
            Broadcasting allows NumPy to perform operations on arrays of different shapes by automatically expanding dimensions when possible. This avoids unnecessary data duplication and simplifies calculations.
          </p>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Summary</h2>
          <p class="mb-4 text-gray-700 dark:text-gray-300">
            NumPy arrays enable efficient numerical computing. Their ability to perform fast mathematical and statistical operations makes them essential for data analysis and machine learning tasks.
          </p>
        `,
        duration: '20 min',
        syntax: [
          { title: "Creating Arrays", content: `import numpy as np\n\narr1 = np.array([1, 2, 3, 4])\narr2 = np.array([[1, 2], [3, 4]])` },
          { title: "Array Properties", content: `print(arr1.shape)\nprint(arr1.ndim)\nprint(arr1.size)\nprint(arr1.dtype)` },
          { title: "Mathematical Operations", content: `a = np.array([10, 20, 30])\nb = np.array([1, 2, 3])\n\nprint(a + b)\nprint(a - b)\nprint(a * b)\nprint(a / b)` },
          { title: "Statistical Functions", content: `data = np.array([10, 20, 30, 40])\n\nprint(np.mean(data))\nprint(np.sum(data))\nprint(np.max(data))\nprint(np.std(data))` }
        ],
        initialCode: `# Example 1: Array Creation and Properties
import numpy as np

data = np.array([5, 10, 15, 20])
print("Array:", data)
print("Shape:", data.shape)
print("Dimensions:", data.ndim)
print("Data Type:", data.dtype)

# Example 2: Mathematical Operations
import numpy as np

prices = np.array([100, 200, 300])
discounted_prices = prices * 0.9

print("Discounted Prices:", discounted_prices)


# 📌 Explanation:
# Applies a 10% discount to all values using vectorized operations.

# Example 3: Statistical Analysis
import numpy as np

marks = np.array([70, 80, 90, 85])
average = np.mean(marks)
highest = np.max(marks)

print("Average:", average)
print("Highest:", highest)`
      },
      {
        title: 'Introduction to Pandas',
        content: `
          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">What is Pandas?</h2>
          <p class="mb-4 text-gray-700 dark:text-gray-300">
            Pandas is a powerful Python library used for data manipulation, data analysis, and data cleaning. While NumPy is excellent for numerical computation, Pandas is designed to work with structured data such as tables, spreadsheets, and databases.
            <br><br>
            In real-world Data Science projects, most datasets are stored in CSV files, Excel sheets, SQL tables, or JSON formats. Pandas makes it easy to load, explore, clean, and analyze this data efficiently.
          </p>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Why Pandas is Important in Data Science</h2>
          <p class="mb-4 text-gray-700 dark:text-gray-300">
            Pandas is one of the most widely used libraries in Data Science and Machine Learning because it:
          </p>
          <ul class="list-disc list-inside ml-4 mb-4 text-gray-700 dark:text-gray-300">
            <li>Handles real-world structured data easily</li>
            <li>Provides fast and flexible data manipulation</li>
            <li>Integrates seamlessly with NumPy and visualization libraries</li>
            <li>Simplifies data cleaning and preprocessing</li>
            <li>Is heavily used in EDA and feature engineering</li>
          </ul>
          <p class="mb-4 text-gray-700 dark:text-gray-300">
            Almost every data science workflow begins with Pandas.
          </p>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Core Data Structures in Pandas</h2>
          <p class="mb-4 text-gray-700 dark:text-gray-300">
            Pandas mainly provides two data structures:
          </p>
          <ul class="list-disc list-inside ml-4 mb-4 text-gray-700 dark:text-gray-300">
            <li><strong>1. Series:</strong> One-dimensional labeled array. Similar to a column in a table.</li>
            <li><strong>2. DataFrame:</strong> Two-dimensional tabular data structure. Consists of rows and columns. Similar to Excel spreadsheets or SQL tables.</li>
          </ul>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Key Features of Pandas</h2>
          <ul class="list-disc list-inside ml-4 mb-4 text-gray-700 dark:text-gray-300">
            <li>Labeled data (row and column names)</li>
            <li>Handling missing values easily</li>
            <li>Powerful filtering and selection</li>
            <li>Grouping and aggregation</li>
            <li>Easy data import and export</li>
          </ul>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Pandas vs NumPy</h2>
          <div class="overflow-x-auto mb-6">
            <table class="min-w-full text-left text-sm whitespace-nowrap">
              <thead class="uppercase tracking-wider border-b-2 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th scope="col" class="px-6 py-4 dark:text-gray-200">Feature</th>
                  <th scope="col" class="px-6 py-4 dark:text-gray-200">NumPy</th>
                  <th scope="col" class="px-6 py-4 dark:text-gray-200">Pandas</th>
                </tr>
              </thead>
              <tbody class="divide-y dark:divide-gray-700">
                <tr>
                  <td class="px-6 py-4 dark:text-gray-300">Data Type</td>
                  <td class="px-6 py-4 dark:text-gray-300">Numerical arrays</td>
                  <td class="px-6 py-4 dark:text-gray-300">Tabular & labeled data</td>
                </tr>
                <tr>
                  <td class="px-6 py-4 dark:text-gray-300">Structure</td>
                  <td class="px-6 py-4 dark:text-gray-300">ndarray</td>
                  <td class="px-6 py-4 dark:text-gray-300">Series, DataFrame</td>
                </tr>
                <tr>
                  <td class="px-6 py-4 dark:text-gray-300">Missing Data</td>
                  <td class="px-6 py-4 dark:text-gray-300">Limited</td>
                  <td class="px-6 py-4 dark:text-gray-300">Excellent support</td>
                </tr>
                <tr>
                  <td class="px-6 py-4 dark:text-gray-300">Real-world Data</td>
                  <td class="px-6 py-4 dark:text-gray-300">Less suitable</td>
                  <td class="px-6 py-4 dark:text-gray-300">Ideal</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Summary</h2>
          <p class="mb-4 text-gray-700 dark:text-gray-300">
            Pandas is an essential library for handling real-world datasets. It allows data scientists to load, explore, clean, and transform data efficiently before applying analysis or machine learning techniques.
          </p>
        `,
        duration: '15 min',
        syntax: [
          { title: "Installing Pandas", content: `pip install pandas` },
          { title: "Importing Pandas", content: `import pandas as pd` },
          { title: "Creating a Series", content: `import pandas as pd\n\ndata = pd.Series([10, 20, 30, 40])\nprint(data)` },
          { title: "Creating a DataFrame", content: `import pandas as pd\n\ndata = {\n    "Name": ["A", "B", "C"],\n    "Age": [20, 25, 30]\n}\n\ndf = pd.DataFrame(data)\nprint(df)` }
        ],
        initialCode: `# Example 1: Working with a Series
import pandas as pd

scores = pd.Series([80, 85, 90, 75])
print(scores)


# 📌 Explanation:
# Creates a one-dimensional labeled array.

# Example 2: Creating a DataFrame
import pandas as pd

students = {
    "Name": ["Ravi", "Anita", "John"],
    "Marks": [85, 90, 78]
}

df = pd.DataFrame(students)
print(df)

# Example 3: Basic DataFrame Info
import pandas as pd

data = {
    "Product": ["Pen", "Book", "Laptop"],
    "Price": [10, 50, 50000]
}

df = pd.DataFrame(data)
print(df)
print(df.info())


# 📌 Explanation:
# Displays structure, column names, and data types.`
      },
      {
        title: 'Pandas Series and DataFrames',
        content: `
          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Understanding Pandas Series</h2>
          <p class="mb-4 text-gray-700 dark:text-gray-300">
            A Pandas Series is a one-dimensional labeled data structure capable of holding data of any type (integers, floats, strings, etc.). Each value in a Series is associated with an index, which makes data retrieval fast and intuitive.
            <br><br>
            In Data Science, a Series typically represents:
          </p>
          <ul class="list-disc list-inside ml-4 mb-4 text-gray-700 dark:text-gray-300">
            <li>A single column of a dataset</li>
            <li>Time-series data</li>
            <li>Output variables or feature columns</li>
          </ul>
          <p class="mb-4 text-gray-700 dark:text-gray-300">
            Unlike NumPy arrays, Series have explicit labels, improving clarity and usability.
          </p>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Understanding Pandas DataFrames</h2>
          <p class="mb-4 text-gray-700 dark:text-gray-300">
            A Pandas DataFrame is a two-dimensional, tabular data structure consisting of rows and columns. It is the most commonly used structure in Data Science.
            <br><br>
            A DataFrame can be imagined as:
          </p>
          <ul class="list-disc list-inside ml-4 mb-4 text-gray-700 dark:text-gray-300">
            <li>An Excel spreadsheet</li>
            <li>A SQL table</li>
            <li>A collection of multiple Series objects</li>
          </ul>
          <p class="mb-4 text-gray-700 dark:text-gray-300">
            Each column in a DataFrame is a Series, and each row represents a data record.
          </p>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Why Series and DataFrames are Essential</h2>
          <ul class="list-disc list-inside ml-4 mb-4 text-gray-700 dark:text-gray-300">
            <li>Handle real-world structured data</li>
            <li>Provide flexible indexing and slicing</li>
            <li>Support data filtering and transformation</li>
            <li>Allow easy integration with visualization and ML libraries</li>
          </ul>
          <p class="mb-4 text-gray-700 dark:text-gray-300">
            Almost every data preprocessing, EDA, and ML pipeline relies on DataFrames.
          </p>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Indexing in Series and DataFrames</h2>
          <p class="mb-4 text-gray-700 dark:text-gray-300">
            Indexes allow:
          </p>
          <ul class="list-disc list-inside ml-4 mb-4 text-gray-700 dark:text-gray-300">
            <li>Fast data access</li>
            <li>Label-based selection</li>
            <li>Data alignment during operations</li>
          </ul>
          <p class="mb-4 text-gray-700 dark:text-gray-300">
            Indexes can be default numeric or custom user-defined labels.
          </p>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Basic Operations on Series and DataFrames</h2>
          <p class="mb-4 text-gray-700 dark:text-gray-300">
            Common operations include:
          </p>
          <ul class="list-disc list-inside ml-4 mb-4 text-gray-700 dark:text-gray-300">
            <li>Selecting columns and rows</li>
            <li>Filtering data based on conditions</li>
            <li>Adding or removing columns</li>
            <li>Renaming columns and indexes</li>
          </ul>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Summary</h2>
          <p class="mb-4 text-gray-700 dark:text-gray-300">
            Pandas Series and DataFrames provide powerful, flexible, and intuitive ways to store and manipulate data. Mastering them is essential for performing real-world data analysis efficiently.
          </p>
        `,
        duration: '20 min',
        syntax: [
          { title: "Creating a Series", content: `import pandas as pd\n\nseries = pd.Series([100, 200, 300], index=["A", "B", "C"])\nprint(series)` },
          { title: "Accessing Series Elements", content: `print(series["A"])\nprint(series[1])` },
          { title: "Creating a DataFrame", content: `import pandas as pd\n\ndata = {\n    "Name": ["Alex", "Brian", "Cathy"],\n    "Age": [22, 25, 23],\n    "Marks": [85, 90, 88]\n}\n\ndf = pd.DataFrame(data)\nprint(df)` },
          { title: "Accessing DataFrame Columns", content: `print(df["Name"])` },
          { title: "Accessing Rows Using Index", content: `print(df.loc[0])\nprint(df.iloc[1])` }
        ],
        initialCode: `# Example 1: Series Operations
import pandas as pd

sales = pd.Series([500, 700, 650], index=["Jan", "Feb", "Mar"])
print("February Sales:", sales["Feb"])


# 📌 Explanation:
# Accesses data using labels, improving readability.

# Example 2: DataFrame Creation and Access
import pandas as pd

employees = {
    "Name": ["Amit", "Sara", "John"],
    "Salary": [50000, 60000, 55000]
}

df = pd.DataFrame(employees)
print(df)
print("Salaries:")
print(df["Salary"])

# Example 3: Row Selection
import pandas as pd

data = {
    "Product": ["Pen", "Notebook", "Bag"],
    "Price": [10, 50, 300]
}

df = pd.DataFrame(data)
print(df.loc[1])


# 📌 Explanation:
# Uses loc to access a row by index label.`
      },
      {
        title: 'Reading and Writing Data (CSV, Excel)',
        content: `
          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Why Reading and Writing Data is Important</h2>
          <p class="mb-4 text-gray-700 dark:text-gray-300">
            In real-world Data Science projects, data rarely comes pre-loaded in code. Instead, data is stored in external files such as CSV, Excel, databases, or APIs. Being able to import data into Python and export processed data is a fundamental skill for every data scientist.
            <br><br>
            Pandas provides simple and powerful functions to read and write data from multiple file formats with minimal code.
          </p>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Common Data File Formats</h2>
          <ul class="list-disc list-inside ml-4 mb-4 text-gray-700 dark:text-gray-300">
            <li><strong>CSV (Comma-Separated Values):</strong> Lightweight, widely used, and supported by almost all tools.</li>
            <li><strong>Excel Files (.xlsx):</strong> Common in business and reporting environments.</li>
            <li><strong>Other Formats:</strong> JSON, SQL databases, Parquet (covered in higher levels).</li>
          </ul>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Reading Data Using Pandas</h2>
          <p class="mb-4 text-gray-700 dark:text-gray-300">
            Pandas allows reading files into DataFrames, making them ready for analysis. While reading data, you can:
          </p>
          <ul class="list-disc list-inside ml-4 mb-4 text-gray-700 dark:text-gray-300">
            <li>Specify column names</li>
            <li>Handle missing values</li>
            <li>Select specific columns</li>
            <li>Set index columns</li>
          </ul>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Writing Data Using Pandas</h2>
          <p class="mb-4 text-gray-700 dark:text-gray-300">
            After cleaning or transforming data, it is often necessary to:
          </p>
          <ul class="list-disc list-inside ml-4 mb-4 text-gray-700 dark:text-gray-300">
            <li>Save processed datasets</li>
            <li>Export reports</li>
            <li>Share results with teams</li>
          </ul>
          <p class="mb-4 text-gray-700 dark:text-gray-300">
            Pandas makes exporting DataFrames back to files easy.
          </p>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Common Issues While Reading Data</h2>
          <ul class="list-disc list-inside ml-4 mb-4 text-gray-700 dark:text-gray-300">
            <li>Missing or incorrect file paths</li>
            <li>Encoding problems</li>
            <li>Incorrect delimiters</li>
            <li>Missing headers</li>
          </ul>
          <p class="mb-4 text-gray-700 dark:text-gray-300">
            Understanding these issues helps prevent errors during data loading.
          </p>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Summary</h2>
          <p class="mb-4 text-gray-700 dark:text-gray-300">
            Reading and writing data is the entry and exit point of every data science workflow. Pandas simplifies this process and enables seamless integration between raw data and analysis pipelines.
          </p>
        `,
        duration: '20 min',
        syntax: [
          { title: "Reading a CSV File", content: `import pandas as pd\n\ndf = pd.read_csv("data.csv")\nprint(df.head())` },
          { title: "Reading an Excel File", content: `import pandas as pd\n\ndf = pd.read_excel("data.xlsx")\nprint(df.head())` },
          { title: "Writing to a CSV File", content: `df.to_csv("output.csv", index=False)` },
          { title: "Writing to an Excel File", content: `df.to_excel("output.xlsx", index=False)` },
          { title: "Handling File Path Errors", content: `try:\n    df = pd.read_csv("data.csv")\nexcept FileNotFoundError:\n    print("File not found")` }
        ],
        initialCode: `# Example 1: Reading CSV Data
import pandas as pd

# Sample data creation (simulating file data)
data = {
    "Name": ["A", "B", "C"],
    "Score": [85, 90, 88]
}

df = pd.DataFrame(data)
print(df)


# 📌 Explanation:
# Simulates reading data into a DataFrame.

# Example 2: Writing Data to CSV
import pandas as pd

data = {
    "Product": ["Pen", "Book"],
    "Price": [10, 50]
}

df = pd.DataFrame(data)
df.to_csv("products.csv", index=False)
print("File written successfully")

# Example 3: Exporting to Excel
import pandas as pd

data = {
    "Employee": ["Ravi", "Anita"],
    "Salary": [50000, 60000]
}

df = pd.DataFrame(data)
df.to_excel("employees.xlsx", index=False)
print("Excel file created")

# 🎯 Learning Outcomes
# After completing this topic, learners will be able to:
# - Read CSV and Excel files using Pandas
# - Export DataFrames to files
# - Handle basic file-related errors
# - Integrate external data into analysis workflows`
      },
      {
        title: 'Data Indexing and Filtering',
        content: `
          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">What is Data Indexing?</h2>
          <p class="mb-4 text-gray-700 dark:text-gray-300">
            Data indexing is the process of selecting specific rows or columns from a dataset. In Pandas, indexing allows you to quickly access, modify, and analyze data using labels or numerical positions.
            <br><br>
            Every DataFrame has:
          </p>
          <ul class="list-disc list-inside ml-4 mb-4 text-gray-700 dark:text-gray-300">
            <li><strong>Row index:</strong> identifies each row</li>
            <li><strong>Column index:</strong> identifies each column</li>
          </ul>
          <p class="mb-4 text-gray-700 dark:text-gray-300">
            Indexing is essential when working with large datasets where only a subset of data is needed.
          </p>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Why Indexing and Filtering Matter in Data Science</h2>
          <p class="mb-4 text-gray-700 dark:text-gray-300">
            In real-world datasets, data scientists rarely work with the entire dataset at once. Instead, they:
          </p>
          <ul class="list-disc list-inside ml-4 mb-4 text-gray-700 dark:text-gray-300">
            <li>Select specific columns for analysis</li>
            <li>Filter rows based on conditions</li>
            <li>Extract subsets for modeling or visualization</li>
          </ul>
          <p class="mb-4 text-gray-700 dark:text-gray-300">
            Efficient indexing improves performance and readability.
          </p>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Types of Indexing in Pandas</h2>
          <p class="mb-4 text-gray-700 dark:text-gray-300">
            <strong>1. Column Indexing</strong><br>
            Used to select one or more columns.
            <br><br>
            <strong>2. Row Indexing</strong><br>
            Used to select rows by:
          </p>
          <ul class="list-disc list-inside ml-4 mb-4 text-gray-700 dark:text-gray-300">
            <li><strong>Label (loc)</strong></li>
            <li><strong>Position (iloc)</strong></li>
          </ul>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Filtering Data Using Conditions</h2>
          <p class="mb-4 text-gray-700 dark:text-gray-300">
            Filtering allows you to extract rows based on conditions such as:
          </p>
          <ul class="list-disc list-inside ml-4 mb-4 text-gray-700 dark:text-gray-300">
            <li>Greater than / less than</li>
            <li>Equal to specific values</li>
            <li>Multiple conditions using logical operators</li>
          </ul>
          <p class="mb-4 text-gray-700 dark:text-gray-300">
            This is extremely useful for customer segmentation, sales analysis, and outlier identification.
          </p>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Boolean Indexing</h2>
          <p class="mb-4 text-gray-700 dark:text-gray-300">
            Boolean indexing uses True/False conditions to filter data. Pandas automatically selects rows where the condition evaluates to True.
          </p>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Summary</h2>
          <p class="mb-4 text-gray-700 dark:text-gray-300">
            Data indexing and filtering help you focus on relevant data, reduce complexity, and improve analysis accuracy. These techniques are fundamental to EDA and machine learning workflows.
          </p>
        `,
        duration: '25 min',
        syntax: [
          { title: "Column Indexing", content: `df["Age"]\n\ndf[["Name", "Marks"]]` },
          { title: "Row Indexing Using loc (Label-based)", content: `df.loc[0]\n\ndf.loc[0, "Name"]` },
          { title: "Row Indexing Using iloc (Position-based)", content: `df.iloc[1]\n\ndf.iloc[1, 2]` },
          { title: "Filtering with Conditions", content: `df[df["Marks"] > 80]` },
          { title: "Multiple Conditions", content: `df[(df["Marks"] > 80) & (df["Age"] < 25)]` }
        ],
        initialCode: `# Example 1: Column and Row Selection
import pandas as pd

data = {
    "Name": ["Amit", "Sara", "John"],
    "Age": [22, 25, 23],
    "Marks": [85, 90, 78]
}

df = pd.DataFrame(data)
print(df["Name"])
print(df.loc[1])

# Example 2: Filtering Data
import pandas as pd

data = {
    "Product": ["Pen", "Notebook", "Bag"],
    "Price": [10, 50, 300]
}

df = pd.DataFrame(data)
filtered = df[df["Price"] > 20]
print(filtered)


# 📌 Explanation:
# Filters products costing more than 20.

# Example 3: Multiple Conditions
import pandas as pd

data = {
    "Student": ["Ravi", "Anita", "John"],
    "Marks": [85, 92, 76],
    "Age": [20, 21, 22]
}

df = pd.DataFrame(data)
result = df[(df["Marks"] > 80) & (df["Age"] < 22)]
print(result)

# 🎯 Learning Outcomes
# After completing this topic, learners will be able to:
# - Select rows and columns using indexing
# - Use loc and iloc effectively
# - Filter datasets using conditions
# - Apply boolean indexing for analysis`
      },
      {
        title: 'Data Cleaning Using Pandas',
        content: `
          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">What is Data Cleaning?</h2>
          <p class="mb-4 text-gray-700 dark:text-gray-300">
            Data Cleaning (also known as Data Cleansing or Data Scrubbing) is the process of detecting and correcting (or removing) corrupt, inaccurate, or irrelevant parts of the data.
            <br><br>
            Real-world data is often "dirty"—it contains errors, missing values, and inconsistencies. Data cleaning is the most time-consuming step in a data science project, often taking 60-80% of the total time.
          </p>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">The "Garbage In, Garbage Out" Principle</h2>
          <p class="mb-4 text-gray-700 dark:text-gray-300">
            This principle states that if you feed bad data (garbage) into a model, you will get bad results (garbage) out, no matter how sophisticated your algorithms are.
            <br><br>
            <strong>Clean Data > Complex Algorithms.</strong>
          </p>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Common Data Quality Issues</h2>
          <ul class="list-disc list-inside ml-4 mb-4 text-gray-700 dark:text-gray-300">
            <li><strong>Missing Values:</strong> Empty cells or NaN (Not a Number).</li>
            <li><strong>Duplicate Data:</strong> Repeated rows.</li>
            <li><strong>Inconsistent Formatting:</strong> "New York" vs "new york" vs "NY".</li>
            <li><strong>Incorrect Data Types:</strong> Numbers stored as strings (e.g., "$100").</li>
            <li><strong>Outliers:</strong> Values that don't make sense (e.g., Age = 200).</li>
          </ul>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Data Cleaning Workflow</h2>
          <p class="mb-4 text-gray-700 dark:text-gray-300">
            A typical cleaning process involves:
          </p>
          <ul class="list-disc list-inside ml-4 mb-4 text-gray-700 dark:text-gray-300">
            <li><strong>1. Inspection:</strong> detecting errors using functions like <code>info()</code>, <code>describe()</code>.</li>
            <li><strong>2. Cleaning:</strong> fixing errors (filling missing values, removing duplicates).</li>
            <li><strong>3. Verification:</strong> checking the data again to ensure it's clean.</li>
          </ul>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Pandas Tools for Data Inspection</h2>
          <p class="mb-4 text-gray-700 dark:text-gray-300">
            Before cleaning, you must inspect the data to find issues. Pandas provides powerful tools for this:
          </p>
          <ul class="list-disc list-inside ml-4 mb-4 text-gray-700 dark:text-gray-300">
            <li><code>df.head()</code>: View first few rows.</li>
            <li><code>df.info()</code>: Check data types and missing values.</li>
            <li><code>df.describe()</code>: Check statistical summaries (helps find outliers).</li>
            <li><code>df.value_counts()</code>: Check unique values in a column.</li>
          </ul>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Summary</h2>
          <p class="mb-4 text-gray-700 dark:text-gray-300">
            Data cleaning is the foundation of reliable data analysis. By identifying and fixing issues early, you ensure accurate insights and better model performance.
          </p>
        `,
        duration: '25 min',
        syntax: [
          { title: "Checking Data Info", content: `df.info()` },
          { title: "Checking Missing Values", content: `df.isnull().sum()` },
          { title: "Checking Duplicates", content: `df.duplicated().sum()` },
          { title: "Checking Unique Values", content: `df["Column"].unique()` },
          { title: "Checking Value Counts", content: `df["Column"].value_counts()` }
        ],
        initialCode: `# Example 1: Inspecting a "Dirty" Dataset
import pandas as pd
import numpy as np

# Creating a dirty dataset
data = {
    "Name": ["Alice", "Bob", "Alice", "David", "Eve"],
    "Age": [25, np.nan, 25, 200, 30],  # Missing value, Duplicate, Outlier
    "City": ["New York", "ny", "New York", "London", "London"] # Inconsistent
}

df = pd.DataFrame(data)

print("Original Data:")
print(df)
print("-" * 30)

# 1. Check for Missing Values
print("Missing Values per Column:")
print(df.isnull().sum())
print("-" * 30)

# 2. Check for Duplicates
print("Number of Duplicate Rows:", df.duplicated().sum())
print("-" * 30)

# 3. Check for Inconsistent Text
print("Value Counts for City:")
print(df["City"].value_counts())

# 📌 Explanation:
# This code helps identify missing data, duplicates, and inconsistencies
# before applying any cleaning techniques.`
      },
      {
        title: 'Handling Missing and Duplicate Data',
        duration: '25 min',
        content: `
          <div class="space-y-6 max-w-4xl mx-auto p-6 font-sans text-gray-800 leading-relaxed">
            <div class="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r shadow-sm">
              <h2 class="text-2xl font-bold text-blue-800 mb-2">Understanding Missing Data</h2>
              <p class="text-gray-700 text-lg">
                Missing data occurs when no value is stored for a variable in a dataset. This is very common in real-world data due to data collection errors, optional fields left blank, sensor failures, or human input mistakes.
              </p>
              <p class="text-gray-700 mt-2">
                Handling missing data correctly is crucial because it directly affects data quality, analysis accuracy, and machine learning model performance.
              </p>
            </div>

            <div class="grid md:grid-cols-2 gap-6">
              <div class="bg-white p-5 rounded-lg shadow-md border border-gray-100">
                <h3 class="text-xl font-semibold text-gray-800 mb-3 border-b pb-2">Types of Missing Data</h3>
                <ul class="list-disc pl-5 space-y-2 text-gray-700">
                  <li><strong>MCAR (Missing Completely at Random):</strong> No relationship with other data.</li>
                  <li><strong>MAR (Missing at Random):</strong> Related to other variables.</li>
                  <li><strong>MNAR (Missing Not at Random):</strong> Missing due to underlying reasons.</li>
                </ul>
              </div>
              <div class="bg-white p-5 rounded-lg shadow-md border border-gray-100">
                <h3 class="text-xl font-semibold text-gray-800 mb-3 border-b pb-2">Handling Strategies</h3>
                <ul class="list-disc pl-5 space-y-2 text-gray-700">
                  <li><strong>Remove:</strong> Rows or columns (if missing data is minimal).</li>
                  <li><strong>Fill (Imputation):</strong> Mean, Median, Mode, or Constant values.</li>
                  <li><strong>Forward/Backward Fill:</strong> Propagate valid observations.</li>
                </ul>
              </div>
            </div>

            <div class="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-r shadow-sm">
              <h2 class="text-2xl font-bold text-yellow-800 mb-2">Understanding & Handling Duplicate Data</h2>
              <p class="text-gray-700 mb-3">
                Duplicate data refers to repeated rows in a dataset. Duplicates can inflate counts, bias statistical results, and mislead machine learning models.
              </p>
              <p class="font-semibold text-gray-800">Pandas Functions:</p>
              <ul class="list-disc pl-5 space-y-2 text-gray-700 mt-2">
                <li><code>df.duplicated()</code>: Detect duplicate rows.</li>
                <li><code>df.drop_duplicates()</code>: Remove duplicates.</li>
              </ul>
            </div>

            <div class="bg-green-50 p-5 rounded-lg border border-green-200 shadow-sm">
               <h3 class="text-xl font-bold text-green-800 mb-3">Best Practices</h3>
               <ul class="list-check pl-5 space-y-2 text-gray-700">
                 <li>✅ Always analyze missing values before removing them.</li>
                 <li>✅ Use statistical filling (mean/median) carefully.</li>
                 <li>✅ Never remove duplicates blindly without understanding the data.</li>
               </ul>
            </div>

            <p class="text-gray-600 italic text-center mt-4">
              Proper handling of missing and duplicate data ensures accurate analysis and reliable results.
            </p>
          </div>
        `,
        syntax: [
          { title: "Detecting Missing Values", content: `df.isnull()\n\ndf.isnull().sum()` },
          { title: "Dropping Missing Values", content: `df.dropna()\n\ndf.dropna(axis=1)` },
          { title: "Filling Missing Values", content: `df.fillna(0)\n\ndf["Age"].fillna(df["Age"].median(), inplace=True)` },
          { title: "Detecting Duplicate Rows", content: `df.duplicated()` },
          { title: "Removing Duplicates", content: `df.drop_duplicates()` }
        ],
        initialCode: `# Example 1: Handling Missing Values
import pandas as pd
import numpy as np

# Create dataset with missing values
data = {
    "Name": ["A", "B", "C"],
    "Score": [80, None, 90]
}

df = pd.DataFrame(data)
print("Original DataFrame (with missing values):")
print(df)

# Fill missing scores with the mean
mean_score = df["Score"].mean()
df["Score"].fillna(mean_score, inplace=True)
print("\\nDataFrame after filling missing values with mean:")
print(df)

# Example 2: Dropping Missing Data
print("-" * 30)
data_missing = {
    "Product": ["Pen", None, "Book"],
    "Price": [10, 20, None]
}
df_missing = pd.DataFrame(data_missing)
print("\\nDataFrame with missing data:")
print(df_missing)

cleaned_df = df_missing.dropna()
print("\\nDataFrame after dropping rows with missing values:")
print(cleaned_df)

# Example 3: Removing Duplicate Records
print("-" * 30)
data_dup = {
    "ID": [1, 2, 2, 3],
    "Marks": [85, 90, 90, 88]
}
df_dup = pd.DataFrame(data_dup)
print("\\nDataFrame with duplicates:")
print(df_dup)

df_dedup = df_dup.drop_duplicates()
print("\\nDataFrame after removing duplicates:")
print(df_dedup)`
      },
      {
        title: 'Data Transformation Techniques',
        duration: '25 min',
        content: `
          <div class="space-y-6 max-w-4xl mx-auto p-6 font-sans text-gray-800 leading-relaxed">
            <div class="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r shadow-sm">
              <h2 class="text-2xl font-bold text-blue-800 mb-2">What is Data Transformation?</h2>
              <p class="text-gray-700 text-lg">
                Data transformation is the process of converting data from one format or structure into another to make it suitable for analysis, visualization, or machine learning models. After data cleaning, transformation is the next critical step in the Data Science pipeline.
              </p>
              <p class="text-gray-700 mt-2">
                In real-world datasets, raw data is rarely in the form required for analysis. Data transformation ensures consistency, usability, and improved model performance.
              </p>
            </div>

            <div class="grid md:grid-cols-2 gap-6">
              <div class="bg-white p-5 rounded-lg shadow-md border border-gray-100">
                <h3 class="text-xl font-semibold text-gray-800 mb-3 border-b pb-2">Why It Is Important</h3>
                <ul class="list-disc pl-5 space-y-2 text-gray-700">
                  <li><strong>Prepares data</strong> for machine learning algorithms.</li>
                  <li><strong>Improves interpretability</strong> of the data.</li>
                  <li><strong>Standardizes and normalizes</strong> data values.</li>
                  <li><strong>Enables feature engineering</strong> for better models.</li>
                  <li><strong>Makes datasets compatible</strong> across different tools.</li>
                </ul>
              </div>
              <div class="bg-white p-5 rounded-lg shadow-md border border-gray-100">
                <h3 class="text-xl font-semibold text-gray-800 mb-3 border-b pb-2">Common Techniques</h3>
                <ul class="list-disc pl-5 space-y-2 text-gray-700">
                  <li><strong>Renaming Columns:</strong> Improves clarity.</li>
                  <li><strong>Changing Data Types:</strong> Ensures correct operations.</li>
                  <li><strong>Scaling/Normalization:</strong> Aligns value ranges.</li>
                  <li><strong>Creating New Columns:</strong> Feature engineering.</li>
                  <li><strong>Applying Functions:</strong> Custom logic transformation.</li>
                  <li><strong>Categorical Encoding:</strong> Categories to numbers.</li>
                </ul>
              </div>
            </div>

            <div class="bg-indigo-50 border-l-4 border-indigo-500 p-4 rounded-r shadow-sm">
              <h2 class="text-2xl font-bold text-indigo-800 mb-2">Data Transformation Workflow</h2>
              <div class="flex flex-wrap items-center justify-center gap-4 text-gray-700 font-semibold mt-3">
                <span class="bg-white px-3 py-1 rounded shadow">Raw Data</span>
                <span>→</span>
                <span class="bg-white px-3 py-1 rounded shadow">Data Cleaning</span>
                <span>→</span>
                <span class="bg-indigo-200 px-3 py-1 rounded shadow text-indigo-900 border border-indigo-300">Data Transformation ✅</span>
                <span>→</span>
                <span class="bg-white px-3 py-1 rounded shadow">EDA</span>
                <span>→</span>
                <span class="bg-white px-3 py-1 rounded shadow">Machine Learning</span>
              </div>
              <p class="text-center text-gray-600 mt-3 text-sm">Transformation bridges raw data and meaningful insights.</p>
            </div>

            <div class="bg-green-50 p-5 rounded-lg border border-green-200 shadow-sm">
               <h3 class="text-xl font-bold text-green-800 mb-3">Best Practices</h3>
               <ul class="list-check pl-5 space-y-2 text-gray-700">
                 <li>✅ Always keep a copy of original data.</li>
                 <li>✅ Apply transformations step-by-step.</li>
                 <li>✅ Validate transformed results.</li>
                 <li>✅ Avoid unnecessary transformations.</li>
               </ul>
            </div>

            <p class="text-gray-600 italic text-center mt-4">
              Data transformation converts clean data into analysis-ready data. Using Pandas, data scientists can efficiently reshape, scale, and engineer features.
            </p>
          </div>
        `,
        syntax: [
          { title: "Renaming Columns", content: `df.rename(columns={"old_name": "new_name"}, inplace=True)` },
          { title: "Changing Data Types", content: `df["Age"] = df["Age"].astype(int)` },
          { title: "Creating New Columns", content: `df["Total"] = df["Maths"] + df["Science"]` },
          { title: "Applying Functions", content: `df["Salary_After_Bonus"] = df["Salary"].apply(lambda x: x * 1.1)` },
          { title: "Basic Encoding", content: `df["Gender_Code"] = df["Gender"].map({"Male": 1, "Female": 0})` }
        ],
        initialCode: `# Example 1: Renaming and Type Conversion
import pandas as pd

data = {
    "student_age": ["20", "22", "21"]
}

df = pd.DataFrame(data)
print("Original DataFrame:")
print(df)
print("\\nData Types before conversion:")
print(df.dtypes)

df.rename(columns={"student_age": "Age"}, inplace=True)
df["Age"] = df["Age"].astype(int)

print("\\nTransformed DataFrame:")
print(df)
print("\\nData Types after conversion:")
print(df.dtypes)

# Example 2: Creating New Features
print("-" * 30)
data_marks = {
    "Maths": [80, 90, 85],
    "Science": [75, 88, 92]
}

df_marks = pd.DataFrame(data_marks)
df_marks["Total_Marks"] = df_marks["Maths"] + df_marks["Science"]
print("\\nDataFrame with New Feature (Total_Marks):")
print(df_marks)

# Example 3: Applying Transformations
print("-" * 30)
data_salary = {
    "Salary": [30000, 40000, 50000]
}

df_salary = pd.DataFrame(data_salary)
df_salary["Salary_With_Bonus"] = df_salary["Salary"].apply(lambda x: x + 5000)
print("\\nDataFrame after Applying Function:")
print(df_salary)`
      }
    ]
  },
  {
    id: 'module-5',
    title: 'Module 5 — Data Collection and Data Preprocessing',
    duration: '1 week',
    description: 'Learn to collect, clean, and prepare data for analysis and modeling.',
    lessons: [
      {
        title: 'Understanding Data Sources',
        duration: '15 min',
        content: `
          <div class="space-y-6 max-w-4xl mx-auto p-6 font-sans text-gray-800 leading-relaxed">
            <div class="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r shadow-sm">
              <h2 class="text-2xl font-bold text-blue-800 mb-2">What are Data Sources?</h2>
              <p class="text-gray-700 text-lg">
                A data source is the place from which data is generated, collected, or obtained for analysis. In Data Science, understanding where data comes from is extremely important because the quality, type, and reliability of data directly impact insights and model performance.
              </p>
              <p class="text-gray-700 mt-2">
                Every data science project starts with identifying the right data source before collecting or preprocessing data.
              </p>
            </div>

            <div class="bg-white p-5 rounded-lg shadow-md border border-gray-100">
              <h3 class="text-xl font-semibold text-gray-800 mb-3 border-b pb-2">Why Understanding Data Sources is Important</h3>
              <ul class="list-disc pl-5 space-y-2 text-gray-700">
                <li><strong>Choose relevant and reliable data</strong></li>
                <li><strong>Identify potential data quality issues early</strong></li>
                <li><strong>Decide appropriate data collection methods</strong></li>
                <li><strong>Understand data limitations and biases</strong></li>
                <li><strong>Design effective preprocessing pipelines</strong></li>
              </ul>
            </div>

            <div class="space-y-4">
              <h3 class="text-2xl font-bold text-gray-800">Types of Data Sources</h3>
              
              <div class="grid md:grid-cols-2 gap-6">
                <div class="bg-green-50 p-4 rounded-lg border border-green-200">
                  <h4 class="font-bold text-green-900 mb-2">1. Primary Data Sources</h4>
                  <p class="text-sm text-gray-700 mb-2">Collected directly for a specific purpose.</p>
                  <ul class="list-disc pl-5 text-sm text-gray-600">
                    <li>Surveys, Interviews, Sensor data, Experiments</li>
                  </ul>
                  <p class="text-xs mt-2 text-green-800"><strong>Pros:</strong> Highly relevant. <strong>Cons:</strong> Costly, Time-consuming.</p>
                </div>

                <div class="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                  <h4 class="font-bold text-yellow-900 mb-2">2. Secondary Data Sources</h4>
                  <p class="text-sm text-gray-700 mb-2">Already collected by others and reused.</p>
                  <ul class="list-disc pl-5 text-sm text-gray-600">
                    <li>CSV/Excel datasets, Gov portals, Research papers</li>
                  </ul>
                  <p class="text-xs mt-2 text-yellow-800"><strong>Pros:</strong> Easy availability. <strong>Cons:</strong> Quality issues.</p>
                </div>

                <div class="bg-purple-50 p-4 rounded-lg border border-purple-200">
                  <h4 class="font-bold text-purple-900 mb-2">3. Internal Data Sources</h4>
                  <p class="text-sm text-gray-700 mb-2">Generated within an organization.</p>
                  <ul class="list-disc pl-5 text-sm text-gray-600">
                    <li>Sales data, Logs, Transactions</li>
                  </ul>
                </div>

                <div class="bg-orange-50 p-4 rounded-lg border border-orange-200">
                  <h4 class="font-bold text-orange-900 mb-2">4. External Data Sources</h4>
                  <p class="text-sm text-gray-700 mb-2">Collected from outside the organization.</p>
                  <ul class="list-disc pl-5 text-sm text-gray-600">
                    <li>APIs, Web scraping, Third-party datasets</li>
                  </ul>
                </div>
              </div>
            </div>

            <div class="bg-gray-50 p-5 rounded-lg border border-gray-200 shadow-sm">
              <h3 class="text-xl font-bold text-gray-800 mb-3">Structured vs Unstructured</h3>
              <div class="grid grid-cols-2 gap-4">
                 <div>
                   <h5 class="font-semibold text-gray-900">Structured Sources</h5>
                   <p class="text-gray-600 text-sm">Databases, Excel, CSV (Fixed schema)</p>
                 </div>
                 <div>
                   <h5 class="font-semibold text-gray-900">Unstructured Sources</h5>
                   <p class="text-gray-600 text-sm">Text, Images, Videos, Emails</p>
                 </div>
              </div>
            </div>

            <p class="text-gray-600 italic text-center mt-4">
              Data sources define the foundation of a data science project. Knowing the type, origin, and structure ensures correct analysis.
            </p>
          </div>
        `,
        syntax: [
          { title: "Loading CSV", content: `import pandas as pd\n\ndf = pd.read_csv("data.csv")` },
          { title: "Loading Excel", content: `import pandas as pd\n\ndf = pd.read_excel("data.xlsx")` },
          { title: "Simulated API Data", content: `# Data received from an API is often JSON\ndata = {\n    "temperature": 30,\n    "humidity": 60\n}` }
        ],
        initialCode: `# Example 1: Using a Secondary Data Source
import pandas as pd

data = {
    "City": ["Delhi", "Mumbai", "Chennai"],
    "Population": [19000000, 20000000, 11000000]
}

df = pd.DataFrame(data)
print("Secondary Data Source (Simulated Dataset):")
print(df)

# Example 2: Internal Business Data Source
print("-" * 30)
sales_data = {
    "Product": ["A", "B", "C"],
    "Sales": [500, 700, 600]
}

df_sales = pd.DataFrame(sales_data)
print("\\nInternal Data Source (Sales Records):")
print(df_sales)

# Example 3: Understanding Structured Data
print("-" * 30)
students = {
    "Name": ["Ravi", "Anita"],
    "Marks": [85, 90]
}

df_students = pd.DataFrame(students)
print("\\nStructured Data Example:")
print(df_students)`
      },
      {
        title: 'Data Collection Methods',
        duration: '15 min',
        content: `
          <div class="space-y-6 max-w-4xl mx-auto p-6 font-sans text-gray-800 leading-relaxed">
            <div class="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r shadow-sm">
              <h2 class="text-2xl font-bold text-blue-800 mb-2">What is Data Collection?</h2>
              <p class="text-gray-700 text-lg">
                Data collection is the process of gathering raw data from various sources for analysis and decision-making. In Data Science, the accuracy, completeness, and relevance of collected data directly influence the quality of insights and machine learning models.
              </p>
              <p class="text-gray-700 mt-2">
                Choosing the right method depends on project objectives, data type, availability, and constraints (time/cost).
              </p>
            </div>

            <div class="bg-white p-5 rounded-lg shadow-md border border-gray-100">
              <h3 class="text-xl font-semibold text-gray-800 mb-3 border-b pb-2">Why It Matters</h3>
              <ul class="list-disc pl-5 space-y-2 text-gray-700">
                <li><strong>Ensures data relevance</strong> to the problem.</li>
                <li><strong>Reduces noise</strong> and irrelevant information.</li>
                <li><strong>Improves data quality</strong> from the start.</li>
                <li><strong>Minimizes preprocessing efforts</strong> later.</li>
              </ul>
              <p class="text-red-600 text-sm mt-2 font-medium">Incorrect methods can lead to biased or unusable datasets.</p>
            </div>

            <div class="space-y-4">
              <h3 class="text-2xl font-bold text-gray-800">Common Collection Methods</h3>
              
              <div class="grid md:grid-cols-2 gap-6">
                <div class="bg-indigo-50 p-4 rounded-lg border border-indigo-200">
                  <h4 class="font-bold text-indigo-900 mb-2">1. Surveys & Questionnaires</h4>
                  <p class="text-sm text-gray-700 mb-1">Collecting structured data directly from users.</p>
                  <ul class="list-disc pl-5 text-xs text-gray-600">
                    <li>Forms, Feedback surveys</li>
                    <li><strong>Pros:</strong> Direct input. <strong>Cons:</strong> Bias, Low sample size.</li>
                  </ul>
                </div>

                <div class="bg-pink-50 p-4 rounded-lg border border-pink-200">
                  <h4 class="font-bold text-pink-900 mb-2">2. Observational Data</h4>
                  <p class="text-sm text-gray-700 mb-1">Observing behaviors without interaction.</p>
                  <ul class="list-disc pl-5 text-xs text-gray-600">
                    <li>Website logs, Clickstream data</li>
                  </ul>
                </div>

                <div class="bg-green-50 p-4 rounded-lg border border-green-200">
                  <h4 class="font-bold text-green-900 mb-2">3. Automated Systems</h4>
                  <p class="text-sm text-gray-700 mb-1">Data collected by systems/software.</p>
                  <ul class="list-disc pl-5 text-xs text-gray-600">
                    <li>IoT Sensors, Transaction logs</li>
                    <li>Highly reliable and scalable.</li>
                  </ul>
                </div>

                <div class="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                  <h4 class="font-bold text-yellow-900 mb-2">4. Web Scraping & APIs</h4>
                  <p class="text-sm text-gray-700 mb-1">Extracting data from web/external services.</p>
                  <ul class="list-disc pl-5 text-xs text-gray-600">
                    <li>Scraping: Prices, Jobs (Ethical caution ⚠️)</li>
                    <li>APIs: Weather, Finance (Structured access)</li>
                  </ul>
                </div>
              </div>
            </div>

            <div class="bg-gray-50 p-5 rounded-lg border border-gray-200 shadow-sm">
              <h3 class="text-xl font-bold text-gray-800 mb-3">Choosing the Right Method</h3>
              <div class="flex flex-wrap gap-2">
                <span class="bg-white border border-gray-300 px-3 py-1 rounded text-sm text-gray-700">Data Accuracy</span>
                <span class="bg-white border border-gray-300 px-3 py-1 rounded text-sm text-gray-700">Volume</span>
                <span class="bg-white border border-gray-300 px-3 py-1 rounded text-sm text-gray-700">Frequency</span>
                <span class="bg-white border border-gray-300 px-3 py-1 rounded text-sm text-gray-700">Privacy & Compliance</span>
              </div>
            </div>

            <p class="text-gray-600 italic text-center mt-4">
              Data collection is the first active step. Selecting the correct method ensures reliable, relevant, and high-quality datasets.
            </p>
          </div>
        `,
        syntax: [
          { title: "Simulating Survey Data", content: `survey_data = {\n    "Age": [20, 25, 30],\n    "Feedback": ["Good", "Average", "Excellent"]\n}` },
          { title: "Reading Existing Dataset", content: `import pandas as pd\n\ndf = pd.read_csv("survey_results.csv")` },
          { title: "API Data (Conceptual)", content: `# Example of API response format\napi_data = {\n    "temperature": 28,\n    "humidity": 65\n}` }
        ],
        initialCode: `# Example 1: Survey Data Collection
import pandas as pd

survey = {
    "User": ["U1", "U2", "U3"],
    "Rating": [4, 5, 3]
}

df = pd.DataFrame(survey)
print("Survey Data (User Ratings):")
print(df)

# Example 2: Automated System Data
print("-" * 30)
system_logs = {
    "UserID": [101, 102, 103],
    "Login_Count": [5, 3, 8]
}

df_logs = pd.DataFrame(system_logs)
print("\\nAutomated System Data (Logs):")
print(df_logs)

# Example 3: External Dataset Usage
print("-" * 30)
data = {
    "Country": ["India", "USA", "UK"],
    "GDP": [3.4, 25.5, 3.1]
}

df_gdp = pd.DataFrame(data)
print("\\nExternal Dataset (GDP Data):")
print(df_gdp)`
      },
      {
        title: 'Importing Data from Different Sources',
        duration: '20 min',
        content: `
          <div class="space-y-6 max-w-4xl mx-auto p-6 font-sans text-gray-800 leading-relaxed">
            <div class="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r shadow-sm">
              <h2 class="text-2xl font-bold text-blue-800 mb-2">What Does “Importing Data” Mean?</h2>
              <p class="text-gray-700 text-lg">
                Importing data is the process of loading data from external sources into a programming environment (like Python) so it can be analyzed, cleaned, transformed, and modeled.
              </p>
              <p class="text-gray-700 mt-2">
                In real-world data science projects, data almost never exists in one clean format. It comes from multiple sources, multiple formats, and multiple systems.
              </p>
            </div>

            <div class="bg-white p-5 rounded-lg shadow-md border border-gray-100">
              <h3 class="text-xl font-semibold text-gray-800 mb-3 border-b pb-2">Why It Is Critical</h3>
              <ul class="list-disc pl-5 space-y-2 text-gray-700">
                <li><strong>Diverse Formats:</strong> CSV, Excel, JSON, SQL, APIs.</li>
                <li><strong>Multiple Sources:</strong> Real projects involve many inputs.</li>
                <li><strong>Ensures Quality:</strong> Correct import prevents data loss and corruption.</li>
              </ul>
              <p class="text-red-600 text-sm mt-2 font-medium">Incorrect import causes missing values, wrong types, and data corruption.</p>
            </div>

            <div class="space-y-4">
              <h3 class="text-2xl font-bold text-gray-800">Common Data Sources</h3>
              
              <div class="grid md:grid-cols-2 gap-6">
                <div class="bg-indigo-50 p-4 rounded-lg border border-indigo-200">
                  <h4 class="font-bold text-indigo-900 mb-2">📂 1. CSV Files</h4>
                  <p class="text-sm text-gray-700 mb-1">Most common format. Lightweight & easy to read.</p>
                  <ul class="list-disc pl-5 text-xs text-gray-600">
                    <li>Each row = record, Column = attribute.</li>
                  </ul>
                </div>

                <div class="bg-green-50 p-4 rounded-lg border border-green-200">
                  <h4 class="font-bold text-green-900 mb-2">📊 2. Excel Files</h4>
                  <p class="text-sm text-gray-700 mb-1">Widely used in business. Human-friendly.</p>
                  <ul class="list-disc pl-5 text-xs text-gray-600">
                    <li>Supports multiple sheets.</li>
                  </ul>
                </div>

                <div class="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                  <h4 class="font-bold text-yellow-900 mb-2">🧾 3. JSON Files</h4>
                  <p class="text-sm text-gray-700 mb-1">Nested/Semi-structured data.</p>
                  <ul class="list-disc pl-5 text-xs text-gray-600">
                    <li>Common in API responses & web apps.</li>
                  </ul>
                </div>

                <div class="bg-purple-50 p-4 rounded-lg border border-purple-200">
                  <h4 class="font-bold text-purple-900 mb-2">🗄️ 4. Databases (SQL)</h4>
                  <p class="text-sm text-gray-700 mb-1">Large-scale structured storage.</p>
                  <ul class="list-disc pl-5 text-xs text-gray-600">
                    <li>High performance, integrity, security.</li>
                  </ul>
                </div>
                
                <div class="bg-pink-50 p-4 rounded-lg border border-pink-200 md:col-span-2">
                  <h4 class="font-bold text-pink-900 mb-2">🌐 5. APIs & Web Data</h4>
                  <p class="text-sm text-gray-700 mb-1">Real-time access via HTTP requests.</p>
                  <ul class="list-disc pl-5 text-xs text-gray-600">
                    <li>Weather, Finance, Social Media (usually JSON).</li>
                  </ul>
                </div>
              </div>
            </div>

            <div class="bg-red-50 p-5 rounded-lg border border-red-200 shadow-sm">
              <h3 class="text-xl font-bold text-red-800 mb-3">⚠️ Common Challenges</h3>
              <ul class="list-disc pl-5 space-y-2 text-gray-700">
                <li>Encoding issues (UTF-8 vs ASCII)</li>
                <li>Missing headers or incorrect delimiters</li>
                <li>Nested structures (JSON)</li>
                <li>Large file sizes</li>
              </ul>
            </div>

            <div class="bg-green-50 p-5 rounded-lg border border-green-200 shadow-sm">
               <h3 class="text-xl font-bold text-green-800 mb-3">Best Practices</h3>
               <ul class="list-check pl-5 space-y-2 text-gray-700">
                 <li>✅ Always preview data (<code>head()</code>).</li>
                 <li>✅ Check data types (<code>info()</code>).</li>
                 <li>✅ Handle missing values early.</li>
                 <li>✅ Validate column names.</li>
               </ul>
            </div>

            <p class="text-gray-600 italic text-center mt-4">
              Correct data import is the foundation of reliable analysis.
            </p>
          </div>
        `,
        syntax: [
          { title: "Import CSV", content: `import pandas as pd\n\ndf = pd.read_csv("data.csv")` },
          { title: "Import Excel", content: `df = pd.read_excel("data.xlsx")` },
          { title: "Import JSON", content: `df = pd.read_json("data.json")` },
          { title: "Import SQL (SQLite)", content: `import sqlite3\nimport pandas as pd\n\nconn = sqlite3.connect("database.db")\ndf = pd.read_sql("SELECT * FROM users", conn)` },
          { title: "Import API (Conceptual)", content: `import requests\n\nresponse = requests.get("https://api.example.com/data")\ndata = response.json()` }
        ],
        initialCode: `# Example 1: Importing CSV Data
import pandas as pd

data = {
    "Name": ["A", "B", "C"],
    "Score": [85, 90, 88]
}

df = pd.DataFrame(data)
print("CSV Data (Simulated):")
print(df)

# Example 2: Importing Excel-like Data
print("-" * 30)
marks = {
    "Student": ["X", "Y", "Z"],
    "Marks": [70, 80, 90]
}

df_excel = pd.DataFrame(marks)
print("\\nExcel Data (Simulated):")
print(df_excel)

# Example 3: Importing JSON-like Data
print("-" * 30)
json_data = [
    {"City": "Delhi", "Temp": 32},
    {"City": "Mumbai", "Temp": 30}
]

df_json = pd.DataFrame(json_data)
print("\\nJSON Data (Simulated):")
print(df_json)`
      },
      {
        title: 'Understanding Dataset Structure',
        duration: '15 min',
        content: `
          <div class="space-y-6 max-w-4xl mx-auto p-6 font-sans text-gray-800 leading-relaxed">
            <div class="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r shadow-sm">
              <h2 class="text-2xl font-bold text-blue-800 mb-2">What is Dataset Structure?</h2>
              <p class="text-gray-700 text-lg">
                A dataset structure describes how data is organized, stored, and represented inside a dataset. Think of it as a blueprint that tells you what data exists, how it is arranged, and how different parts relate to each other.
              </p>
              <p class="text-gray-700 mt-2">
                Before cleaning or analyzing data, understanding its structure is critical to avoid logical errors and ensure model accuracy.
              </p>
            </div>

            <div class="bg-white p-5 rounded-lg shadow-md border border-gray-100">
              <h3 class="text-xl font-semibold text-gray-800 mb-3 border-b pb-2">Core Components</h3>
              <div class="grid md:grid-cols-3 gap-4">
                <div class="bg-indigo-50 p-3 rounded text-center">
                   <h4 class="font-bold text-indigo-900">1. Rows</h4>
                   <p class="text-xs text-gray-600">Records / Observations</p>
                   <p class="text-xs text-gray-500 mt-1">(e.g., One Customer)</p>
                </div>
                <div class="bg-green-50 p-3 rounded text-center">
                   <h4 class="font-bold text-green-900">2. Columns</h4>
                   <p class="text-xs text-gray-600">Features / Variables</p>
                   <p class="text-xs text-gray-500 mt-1">(e.g., Age, Price)</p>
                </div>
                <div class="bg-purple-50 p-3 rounded text-center">
                   <h4 class="font-bold text-purple-900">3. Index</h4>
                   <p class="text-xs text-gray-600">Unique Identifier</p>
                   <p class="text-xs text-gray-500 mt-1">(Reference/Slicing)</p>
                </div>
              </div>
            </div>

            <div class="space-y-4">
              <h3 class="text-2xl font-bold text-gray-800">Types of Structures</h3>
              <ul class="list-disc pl-5 space-y-2 text-gray-700">
                <li><strong>Tabular Data:</strong> Rows & Columns (CSV, Excel, SQL).</li>
                <li><strong>Semi-Structured:</strong> Flexible/Nested (JSON, XML).</li>
                <li><strong>Unstructured:</strong> No fixed format (Text, Images).</li>
              </ul>
            </div>

            <div class="bg-yellow-50 p-5 rounded-lg border border-yellow-200 shadow-sm">
              <h3 class="text-xl font-bold text-yellow-800 mb-3">Key Characteristics to Examine</h3>
              <div class="grid md:grid-cols-2 gap-4 text-sm text-gray-700">
                <ul class="list-check space-y-1">
                   <li>✅ Number of rows/columns</li>
                   <li>✅ Column names</li>
                   <li>✅ Data types (Num, Cat, Bool, Date)</li>
                </ul>
                <ul class="list-check space-y-1">
                   <li>✅ Missing values</li>
                   <li>✅ Duplicate records</li>
                   <li>✅ Relationships between columns</li>
                </ul>
              </div>
            </div>

            <div class="bg-red-50 p-5 rounded-lg border border-red-200 shadow-sm">
              <h3 class="text-xl font-bold text-red-800 mb-3">Common Problems</h3>
              <ul class="list-disc pl-5 space-y-2 text-gray-700">
                <li>Incorrect column names</li>
                <li>Mixed data types</li>
                <li>Extra whitespace</li>
                <li>Hidden missing values</li>
              </ul>
            </div>

            <p class="text-gray-600 italic text-center mt-4">
              Understanding structure helps identify relevant features, detect quality issues early, and choose correct preprocessing techniques.
            </p>
          </div>
        `,
        syntax: [
          { title: "Check Shape", content: `df.shape` },
          { title: "View Columns", content: `df.columns` },
          { title: "Dataset Info", content: `df.info()` },
          { title: "Preview Data", content: `df.head()` },
          { title: "Check Types", content: `df.dtypes` },
          { title: "Check Index", content: `df.index` }
        ],
        initialCode: `# Example 1: Creating and Inspecting Dataset Structure
import pandas as pd

data = {
    "Name": ["A", "B", "C"],
    "Age": [22, 25, 23],
    "Score": [85.5, 90.0, 88.0]
}

df = pd.DataFrame(data)

print("DataFrame:")
print(df)
print("\\nShape (Rows, Columns):", df.shape)
print("\\nColumn Names:", df.columns)

# Example 2: Checking Dataset Info
print("-" * 30)
print("Dataset Info:")
print(df.info())

# Example 3: Checking Data Types
print("-" * 30)
print("Data Types:")
print(df.dtypes)`
      },
      {
        title: 'Data Quality Issues',
        duration: '20 min',
        content: `
          <div class="space-y-6 max-w-4xl mx-auto p-6 font-sans text-gray-800 leading-relaxed">
            <div class="bg-red-50 border-l-4 border-red-500 p-4 rounded-r shadow-sm">
              <h2 class="text-2xl font-bold text-red-800 mb-2">What are Data Quality Issues?</h2>
              <p class="text-gray-700 text-lg">
                Data quality issues refer to problems in a dataset that reduce its accuracy, reliability, and usability.
                In real-world projects, raw data is rarely perfect. Identifying and fixing quality issues is a critical responsibility of a data scientist.
              </p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="bg-white p-5 rounded-lg shadow border border-gray-200">
                <h3 class="text-xl font-semibold text-gray-800 mb-3 border-b pb-2">Why Data Quality Matters</h3>
                <ul class="list-disc list-inside space-y-2 text-gray-700">
                  <li><strong>Trustworthy insights</strong></li>
                  <li><strong>Reliable models</strong></li>
                  <li><strong>Reduced preprocessing effort</strong></li>
                  <li><strong>Better decision-making</strong></li>
                </ul>
                <div class="mt-4 p-3 bg-gray-100 rounded text-center italic font-semibold text-gray-600">
                  “Garbage in → Garbage out”
                </div>
              </div>
              <div class="bg-white p-5 rounded-lg shadow border border-gray-200">
                <h3 class="text-xl font-semibold text-gray-800 mb-3 border-b pb-2">Impact of Poor Quality</h3>
                <ul class="list-disc list-inside space-y-2 text-gray-700">
                  <li>Incorrect analysis</li>
                  <li>Biased insights</li>
                  <li>Poor machine learning performance</li>
                  <li>Wrong business decisions</li>
                </ul>
              </div>
            </div>

            <div class="bg-white p-6 rounded-lg shadow-md border border-gray-200">
              <h3 class="text-2xl font-bold text-gray-800 mb-4">Common Types of Data Quality Issues</h3>
              <div class="space-y-4">
                <details class="group border rounded-lg p-2 bg-gray-50 hover:bg-white transition-colors">
                  <summary class="font-semibold text-lg cursor-pointer text-blue-700 flex justify-between items-center">
                    1. Missing Data
                    <span class="text-gray-400 group-open:rotate-180 transition-transform">▼</span>
                  </summary>
                  <div class="mt-2 text-gray-700 pl-4 border-l-2 border-blue-200">
                    <p>Occurs when values are absent (e.g., empty cells, NaN, None).</p>
                    <p class="text-sm text-gray-500 mt-1">Causes: Data entry errors, system failures, incomplete surveys.</p>
                  </div>
                </details>

                <details class="group border rounded-lg p-2 bg-gray-50 hover:bg-white transition-colors">
                  <summary class="font-semibold text-lg cursor-pointer text-blue-700 flex justify-between items-center">
                    2. Duplicate Data
                    <span class="text-gray-400 group-open:rotate-180 transition-transform">▼</span>
                  </summary>
                  <div class="mt-2 text-gray-700 pl-4 border-l-2 border-blue-200">
                    <p>Occurs when the same record appears more than once.</p>
                    <p class="text-sm text-gray-500 mt-1">Impact: Skewed statistics, biased model training.</p>
                  </div>
                </details>

                <details class="group border rounded-lg p-2 bg-gray-50 hover:bg-white transition-colors">
                  <summary class="font-semibold text-lg cursor-pointer text-blue-700 flex justify-between items-center">
                    3. Incorrect or Invalid Data
                    <span class="text-gray-400 group-open:rotate-180 transition-transform">▼</span>
                  </summary>
                  <div class="mt-2 text-gray-700 pl-4 border-l-2 border-blue-200">
                    <p>Data that is logically incorrect (e.g., Age = -5, Salary = "High").</p>
                  </div>
                </details>

                <details class="group border rounded-lg p-2 bg-gray-50 hover:bg-white transition-colors">
                  <summary class="font-semibold text-lg cursor-pointer text-blue-700 flex justify-between items-center">
                    4. Inconsistent Data
                    <span class="text-gray-400 group-open:rotate-180 transition-transform">▼</span>
                  </summary>
                  <div class="mt-2 text-gray-700 pl-4 border-l-2 border-blue-200">
                    <p>Same information stored in different formats (e.g., "Male", "M", "male", different date formats).</p>
                  </div>
                </details>

                <details class="group border rounded-lg p-2 bg-gray-50 hover:bg-white transition-colors">
                  <summary class="font-semibold text-lg cursor-pointer text-blue-700 flex justify-between items-center">
                    5. Outdated Data
                    <span class="text-gray-400 group-open:rotate-180 transition-transform">▼</span>
                  </summary>
                  <div class="mt-2 text-gray-700 pl-4 border-l-2 border-blue-200">
                    <p>Data that no longer reflects current conditions (e.g., old prices, expired user info).</p>
                  </div>
                </details>

                <details class="group border rounded-lg p-2 bg-gray-50 hover:bg-white transition-colors">
                  <summary class="font-semibold text-lg cursor-pointer text-blue-700 flex justify-between items-center">
                    6. Noise and Outliers
                    <span class="text-gray-400 group-open:rotate-180 transition-transform">▼</span>
                  </summary>
                  <div class="mt-2 text-gray-700 pl-4 border-l-2 border-blue-200">
                    <p>Extreme values that do not represent normal behavior (e.g., sudden spikes, measurement errors).</p>
                  </div>
                </details>

                <details class="group border rounded-lg p-2 bg-gray-50 hover:bg-white transition-colors">
                  <summary class="font-semibold text-lg cursor-pointer text-blue-700 flex justify-between items-center">
                    7. Data Type Mismatch
                    <span class="text-gray-400 group-open:rotate-180 transition-transform">▼</span>
                  </summary>
                  <div class="mt-2 text-gray-700 pl-4 border-l-2 border-blue-200">
                    <p>Occurs when a column has an incorrect data type (e.g., numbers stored as strings).</p>
                  </div>
                </details>
              </div>
            </div>

            <div class="bg-green-50 border-l-4 border-green-500 p-4 rounded-r shadow-sm">
              <h3 class="text-xl font-bold text-green-800 mb-2">Identifying Data Quality Issues</h3>
              <p class="text-gray-700 mb-2">Data scientists use several methods to spot these issues:</p>
              <ul class="list-disc list-inside text-gray-700 space-y-1 ml-4">
                <li>Data summaries (info, describe)</li>
                <li>Visual inspection (head, tail)</li>
                <li>Statistical checks</li>
                <li>Automated validation rules</li>
              </ul>
            </div>

            <div class="bg-gray-800 text-white p-5 rounded-lg shadow-lg">
              <h3 class="text-xl font-bold mb-3 text-yellow-400">Best Practices</h3>
              <ul class="space-y-2 text-gray-300">
                <li class="flex items-center"><span class="mr-2">✅</span> Validate data at collection stage</li>
                <li class="flex items-center"><span class="mr-2">✅</span> Use standardized formats</li>
                <li class="flex items-center"><span class="mr-2">✅</span> Remove or fix duplicates</li>
                <li class="flex items-center"><span class="mr-2">✅</span> Document all data cleaning steps</li>
                <li class="flex items-center"><span class="mr-2">✅</span> Regularly audit datasets</li>
              </ul>
            </div>
          </div>
        `,
        syntax: [
          { title: "Check for Missing Values", content: `df.isnull().sum()` },
          { title: "Check for Duplicate Rows", content: `df.duplicated().sum()` },
          { title: "Detect Data Types", content: `df.dtypes` },
          { title: "Basic Statistical Summary", content: `df.describe()` },
          { title: "Check Unique Values", content: `df['column_name'].unique()` }
        ],
        initialCode: `# Example 1: Detecting Missing Values
import pandas as pd
import numpy as np

data = {
    "Name": ["A", "B", "C", None],
    "Age": [22, None, 25, 23]
}

df = pd.DataFrame(data)
print("--- Dataset with Missing Values ---")
print(df)
print("\\nMissing values count:")
print(df.isnull().sum())

# Example 2: Detecting Duplicate Records
data2 = {
    "ID": [1, 2, 2, 3],
    "Score": [80, 85, 85, 90]
}

df2 = pd.DataFrame(data2)
print("\\n--- Dataset with Duplicates ---")
print(df2)
print("\\nDuplicate rows count:", df2.duplicated().sum())

# Example 3: Identifying Inconsistent Data
data3 = {
    "Gender": ["Male", "M", "male", "Female"]
}

df3 = pd.DataFrame(data3)
print("\\n--- Inconsistent Data ---")
print("Unique Gender values found:")
print(df3["Gender"].unique())`
      },
      {
        title: 'Handling Missing Values',
        duration: '20 min',
        content: `
          <div class="space-y-6 max-w-4xl mx-auto p-6 font-sans text-gray-800 leading-relaxed">
            <div class="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r shadow-sm">
              <h2 class="text-2xl font-bold text-blue-800 mb-2">What are Missing Values?</h2>
              <p class="text-gray-700 text-lg">
                Missing values occur when no data value is stored for a variable in a dataset. In Python and Pandas, missing values are commonly represented as:
              </p>
              <ul class="list-disc list-inside text-gray-700 mt-2 ml-4">
                <li><strong>NaN</strong> (Not a Number)</li>
                <li><strong>None</strong></li>
                <li><strong>Empty cells</strong></li>
              </ul>
              <p class="text-gray-700 mt-2">
                Handling missing values correctly is essential because many algorithms cannot work with missing data directly.
              </p>
            </div>

            <div class="bg-white p-5 rounded-lg shadow border border-gray-200">
              <h3 class="text-xl font-semibold text-gray-800 mb-3 border-b pb-2">Why Handling Missing Values is Important</h3>
              <p class="text-gray-700 mb-2">If missing values are ignored:</p>
              <ul class="list-disc list-inside space-y-2 text-gray-700 ml-4">
                <li>Statistical calculations become inaccurate</li>
                <li>Machine learning models may fail</li>
                <li>Bias can be introduced into results</li>
                <li>Data integrity is compromised</li>
              </ul>
              <p class="text-gray-700 mt-2 font-medium">Proper handling ensures reliable and consistent analysis.</p>
            </div>

            <div class="bg-white p-5 rounded-lg shadow border border-gray-200">
              <h3 class="text-xl font-semibold text-gray-800 mb-3 border-b pb-2">Common Causes of Missing Values</h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="bg-gray-50 p-3 rounded">
                  <ul class="list-disc list-inside text-gray-700 space-y-1">
                    <li>Human data entry errors</li>
                    <li>Sensor or system failure</li>
                    <li>Incomplete surveys</li>
                  </ul>
                </div>
                <div class="bg-gray-50 p-3 rounded">
                  <ul class="list-disc list-inside text-gray-700 space-y-1">
                    <li>Data merging issues</li>
                    <li>Optional fields not filled</li>
                  </ul>
                </div>
              </div>
            </div>

            <div class="bg-white p-6 rounded-lg shadow-md border border-gray-200">
              <h3 class="text-2xl font-bold text-gray-800 mb-4">Types of Missing Data</h3>
              <div class="space-y-4">
                <div class="border-l-4 border-yellow-400 pl-4 py-2 bg-yellow-50 rounded-r">
                  <h4 class="font-bold text-lg text-gray-800">1. Missing Completely at Random (MCAR)</h4>
                  <p class="text-gray-700">Missing values occur randomly and do not depend on other data.</p>
                  <p class="text-sm text-gray-500 mt-1">Example: Random sensor failure.</p>
                </div>
                <div class="border-l-4 border-orange-400 pl-4 py-2 bg-orange-50 rounded-r">
                  <h4 class="font-bold text-lg text-gray-800">2. Missing at Random (MAR)</h4>
                  <p class="text-gray-700">Missing values depend on other observed variables.</p>
                  <p class="text-sm text-gray-500 mt-1">Example: Income missing for a specific age group.</p>
                </div>
                <div class="border-l-4 border-red-400 pl-4 py-2 bg-red-50 rounded-r">
                  <h4 class="font-bold text-lg text-gray-800">3. Missing Not at Random (MNAR)</h4>
                  <p class="text-gray-700">Missing values depend on the missing value itself.</p>
                  <p class="text-sm text-gray-500 mt-1">Example: Users not reporting low salaries.</p>
                </div>
              </div>
            </div>

            <div class="bg-white p-6 rounded-lg shadow-md border border-gray-200">
              <h3 class="text-2xl font-bold text-gray-800 mb-4">Techniques to Handle Missing Values</h3>
              
              <div class="mb-6">
                <h4 class="font-bold text-lg text-indigo-700 mb-2">1. Removing Missing Values</h4>
                <p class="text-gray-700 mb-2">Used when dataset is large and missing values are few.</p>
                <ul class="list-disc list-inside text-gray-700 ml-4 mb-2">
                  <li>Remove rows</li>
                  <li>Remove columns</li>
                </ul>
                <p class="text-red-600 font-medium text-sm">⚠️ Risk: Loss of important data</p>
              </div>

              <div class="mb-6">
                <h4 class="font-bold text-lg text-indigo-700 mb-2">2. Replacing with Statistical Values</h4>
                <ul class="list-disc list-inside text-gray-700 ml-4">
                  <li><strong>Mean:</strong> for numerical data</li>
                  <li><strong>Median:</strong> robust to outliers</li>
                  <li><strong>Mode:</strong> for categorical data</li>
                </ul>
              </div>

              <div class="mb-6">
                <h4 class="font-bold text-lg text-indigo-700 mb-2">3. Forward Fill and Backward Fill</h4>
                <p class="text-gray-700">Used mainly in time-series data.</p>
                <ul class="list-disc list-inside text-gray-700 ml-4 mt-1">
                  <li><strong>Forward fill (ffill):</strong> Uses previous value</li>
                  <li><strong>Backward fill (bfill):</strong> Uses next value</li>
                </ul>
              </div>
              
              <div>
                <h4 class="font-bold text-lg text-indigo-700 mb-2">4. Custom or Domain-Based Imputation</h4>
                <ul class="list-disc list-inside text-gray-700 ml-4">
                  <li>Using business logic</li>
                  <li>Using fixed or calculated values</li>
                </ul>
              </div>
            </div>

            <div class="bg-gray-800 text-white p-5 rounded-lg shadow-lg">
              <h3 class="text-xl font-bold mb-3 text-yellow-400">Best Practices</h3>
              <ul class="space-y-2 text-gray-300">
                <li class="flex items-center"><span class="mr-2">✅</span> Never ignore missing values</li>
                <li class="flex items-center"><span class="mr-2">✅</span> Analyze pattern before fixing</li>
                <li class="flex items-center"><span class="mr-2">✅</span> Prefer median over mean for skewed data</li>
                <li class="flex items-center"><span class="mr-2">✅</span> Document all imputation decisions</li>
                <li class="flex items-center"><span class="mr-2">✅</span> Avoid unnecessary data loss</li>
              </ul>
            </div>
          </div>
        `,
        syntax: [
          { title: "Check Missing Values", content: `df.isnull().sum()` },
          { title: "Remove Rows", content: `df.dropna()` },
          { title: "Remove Columns", content: `df.dropna(axis=1)` },
          { title: "Fill with Mean/Median", content: `df['Age'].fillna(df['Age'].mean())\ndf['Age'].fillna(df['Age'].median())` },
          { title: "Fill with Mode", content: `df['Gender'].fillna(df['Gender'].mode()[0])` },
          { title: "Forward/Backward Fill", content: `df.fillna(method='ffill')\ndf.fillna(method='bfill')` }
        ],
        initialCode: `# Example 1: Identifying Missing Values
import pandas as pd
import numpy as np

data = {
    "Name": ["A", "B", None, "D"],
    "Age": [22, np.nan, 25, 24]
}

df = pd.DataFrame(data)
print("--- Original DataFrame ---")
print(df)
print("\\nMissing values count:")
print(df.isnull().sum())

# Example 2: Removing Missing Values
cleaned_df = df.dropna()
print("\\n--- After Dropping Missing Values ---")
print(cleaned_df)

# Example 3: Filling Missing Values
# Create a fresh copy to demonstrate filling
df_filled = df.copy()
df_filled['Age'] = df_filled['Age'].fillna(df_filled['Age'].mean())
df_filled['Name'] = df_filled['Name'].fillna("Unknown")
print("\\n--- After Filling Missing Values ---")
print(df_filled)

# Example 4: Forward Fill
print("\\n--- Forward Fill Example ---")
df_ffill = df.fillna(method='ffill')
print(df_ffill)`
      },
      {
        title: 'Encoding Categorical Data',
        duration: '20 min',
        content: `
          <div class="space-y-6 max-w-4xl mx-auto p-6 font-sans text-gray-800 leading-relaxed">
            <div class="bg-purple-50 border-l-4 border-purple-500 p-4 rounded-r shadow-sm">
              <h2 class="text-2xl font-bold text-purple-800 mb-2">What is Categorical Data?</h2>
              <p class="text-gray-700 text-lg">
                Categorical data represents values that belong to distinct categories or labels rather than numerical quantities.
                Most machine learning algorithms cannot work directly with text or category labels, so categorical data must be converted into numerical form — a process called <strong>encoding</strong>.
              </p>
              <div class="mt-4 bg-white p-3 rounded border border-purple-200">
                <p class="font-semibold text-gray-800">Examples:</p>
                <ul class="list-disc list-inside text-gray-700 ml-2">
                  <li><strong>Gender:</strong> Male, Female</li>
                  <li><strong>City:</strong> Delhi, Mumbai, Chennai</li>
                  <li><strong>Product Type:</strong> Electronics, Clothing</li>
                </ul>
              </div>
            </div>

            <div class="bg-white p-5 rounded-lg shadow border border-gray-200">
              <h3 class="text-xl font-semibold text-gray-800 mb-3 border-b pb-2">Why Encoding is Required</h3>
              <p class="text-gray-700 mb-2">Machine learning models perform mathematical computations and measure distances. Text labels cannot be processed directly.</p>
              <div class="flex flex-col md:flex-row gap-4 mt-3">
                <div class="flex-1 bg-gray-50 p-3 rounded">
                  <h4 class="font-bold text-gray-700 mb-1">Encoding enables:</h4>
                  <ul class="list-disc list-inside text-gray-600 text-sm">
                    <li>Conversion of categories to numbers</li>
                    <li>Preservation of meaningful information</li>
                    <li>Model training</li>
                  </ul>
                </div>
              </div>
            </div>

            <div class="bg-white p-6 rounded-lg shadow-md border border-gray-200">
              <h3 class="text-2xl font-bold text-gray-800 mb-4">Types of Categorical Data</h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="border rounded-lg p-4 bg-blue-50">
                  <h4 class="font-bold text-lg text-blue-800 mb-2">1. Nominal Data</h4>
                  <p class="text-gray-700 mb-2">No natural order.</p>
                  <p class="text-sm text-gray-500">Example: Color, City, Gender</p>
                </div>
                <div class="border rounded-lg p-4 bg-green-50">
                  <h4 class="font-bold text-lg text-green-800 mb-2">2. Ordinal Data</h4>
                  <p class="text-gray-700 mb-2">Has a meaningful order.</p>
                  <p class="text-sm text-gray-500">Example: Education level, Ratings (Low, Medium, High)</p>
                </div>
              </div>
            </div>

            <div class="bg-white p-6 rounded-lg shadow-md border border-gray-200">
              <h3 class="text-2xl font-bold text-gray-800 mb-4">Common Encoding Techniques</h3>
              
              <div class="mb-6 border-b pb-4">
                <h4 class="font-bold text-lg text-indigo-700 mb-2">1. Label Encoding</h4>
                <p class="text-gray-700 mb-2">Each category is assigned a unique numeric value (e.g., Male → 0, Female → 1).</p>
                <p class="text-sm text-gray-600 mb-1"><strong>Use when:</strong> Categories are ordinal (order matters).</p>
                <p class="text-red-600 font-medium text-sm">⚠️ Can mislead models if used on nominal data.</p>
              </div>

              <div class="mb-6 border-b pb-4">
                <h4 class="font-bold text-lg text-indigo-700 mb-2">2. One-Hot Encoding</h4>
                <p class="text-gray-700 mb-2">Creates new binary columns for each category (e.g., City_Delhi, City_Mumbai).</p>
                <p class="text-sm text-gray-600"><strong>Use when:</strong> Categories are nominal (no natural order).</p>
              </div>

              <div class="mb-6">
                <h4 class="font-bold text-lg text-indigo-700 mb-2">3. Dummy Encoding</h4>
                <p class="text-gray-700">Similar to one-hot encoding but removes one column to avoid redundancy (dummy variable trap).</p>
              </div>
            </div>

            <div class="bg-gray-800 text-white p-5 rounded-lg shadow-lg">
              <h3 class="text-xl font-bold mb-3 text-yellow-400">Best Practices</h3>
              <ul class="space-y-2 text-gray-300">
                <li class="flex items-center"><span class="mr-2">✅</span> Understand category type (Nominal vs Ordinal)</li>
                <li class="flex items-center"><span class="mr-2">✅</span> Avoid label encoding for nominal data</li>
                <li class="flex items-center"><span class="mr-2">✅</span> Monitor dimensionality (too many columns)</li>
                <li class="flex items-center"><span class="mr-2">✅</span> Apply same encoding to train and test data</li>
              </ul>
            </div>
          </div>
        `,
        syntax: [
          { title: "Label Encoding", content: `from sklearn.preprocessing import LabelEncoder\nle = LabelEncoder()\ndf['Gender'] = le.fit_transform(df['Gender'])` },
          { title: "One-Hot Encoding", content: `pd.get_dummies(df, columns=['City'])` },
          { title: "Drop First (Dummy)", content: `pd.get_dummies(df, columns=['City'], drop_first=True)` },
          { title: "Check Encoded Columns", content: `df.head()` }
        ],
        initialCode: `# Example 1: Label Encoding
import pandas as pd
from sklearn.preprocessing import LabelEncoder

data = {
    "Gender": ["Male", "Female", "Female", "Male"]
}

df = pd.DataFrame(data)
print("--- Original Data ---")
print(df)

le = LabelEncoder()
df['Gender_Encoded'] = le.fit_transform(df['Gender'])

print("\\n--- Label Encoded ---")
print(df)

# Example 2: One-Hot Encoding
data2 = {
    "City": ["Delhi", "Mumbai", "Chennai"]
}

df2 = pd.DataFrame(data2)
print("\\n--- Original City Data ---")
print(df2)

encoded_df = pd.get_dummies(df2, columns=['City'])
print("\\n--- One-Hot Encoded ---")
print(encoded_df)

# Example 3: Dummy Encoding (Drop First)
encoded_df_drop = pd.get_dummies(df2, columns=['City'], drop_first=True)
print("\\n--- Dummy Encoded (Drop First) ---")
print(encoded_df_drop)`
      },
      {
        title: 'Feature Selection Basics',
        duration: '20 min',
        content: `
          <div class="space-y-6 max-w-4xl mx-auto p-6 font-sans text-gray-800 leading-relaxed">
            <div class="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r shadow-sm">
              <h2 class="text-2xl font-bold text-blue-800 mb-2">What is Feature Selection?</h2>
              <p class="text-gray-700 text-lg">
                Feature selection is the process of choosing the most relevant variables (features) from a dataset for building a predictive model.
                Not all features in a dataset contribute to meaningful insights; some may be redundant, irrelevant, or noisy, which can reduce model accuracy.
              </p>
              <p class="text-gray-700 mt-2 font-medium">
                Feature selection helps simplify models, reduce computation time, and improve performance.
              </p>
            </div>

            <div class="bg-white p-5 rounded-lg shadow border border-gray-200">
              <h3 class="text-xl font-semibold text-gray-800 mb-3 border-b pb-2">Why Feature Selection is Important</h3>
              <ul class="list-disc list-inside space-y-2 text-gray-700">
                <li><strong>Reduces overfitting:</strong> Prevents model from learning noise.</li>
                <li><strong>Improves model accuracy:</strong> Focuses on impactful variables.</li>
                <li><strong>Reduces training time:</strong> Fewer features mean faster computation.</li>
                <li><strong>Makes data more interpretable:</strong> Easier to understand key drivers.</li>
                <li><strong>Removes redundant features:</strong> Eliminates duplicate information.</li>
              </ul>
            </div>

            <div class="bg-white p-6 rounded-lg shadow-md border border-gray-200">
              <h3 class="text-2xl font-bold text-gray-800 mb-4">Common Feature Selection Techniques</h3>
              
              <div class="mb-6 border-b pb-4">
                <h4 class="font-bold text-lg text-indigo-700 mb-2">1. Filter Methods</h4>
                <p class="text-gray-700 mb-2">Use statistical techniques to evaluate feature importance independently of any machine learning model.</p>
                <p class="text-sm text-gray-600 mb-1"><strong>Examples:</strong> Correlation coefficient, Chi-square test.</p>
                <div class="flex gap-4 mt-2 text-sm">
                  <span class="text-green-600 font-semibold">Pros: Simple, Fast</span>
                  <span class="text-red-600 font-semibold">Cons: Ignores feature interactions</span>
                </div>
              </div>

              <div class="mb-6 border-b pb-4">
                <h4 class="font-bold text-lg text-indigo-700 mb-2">2. Wrapper Methods</h4>
                <p class="text-gray-700 mb-2">Evaluate subsets of features by training models iteratively.</p>
                <p class="text-sm text-gray-600 mb-1"><strong>Examples:</strong> Forward Selection, Backward Elimination.</p>
                <div class="flex gap-4 mt-2 text-sm">
                  <span class="text-green-600 font-semibold">Pros: Considers interactions</span>
                  <span class="text-red-600 font-semibold">Cons: Computationally expensive</span>
                </div>
              </div>

              <div class="mb-6">
                <h4 class="font-bold text-lg text-indigo-700 mb-2">3. Embedded Methods</h4>
                <p class="text-gray-700 mb-2">Feature selection occurs during the model training process itself.</p>
                <p class="text-sm text-gray-600 mb-1"><strong>Examples:</strong> Lasso Regression, Decision Trees / Random Forest.</p>
                <div class="flex gap-4 mt-2 text-sm">
                  <span class="text-green-600 font-semibold">Pros: Efficient, Integrated</span>
                  <span class="text-red-600 font-semibold">Cons: Model-specific</span>
                </div>
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="bg-gray-50 p-5 rounded-lg border border-gray-200">
                <h3 class="text-lg font-bold text-gray-800 mb-2">Correlation-Based Selection</h3>
                <p class="text-gray-700 text-sm mb-2">Compute correlation between features and target.</p>
                <ul class="list-disc list-inside text-gray-600 text-sm">
                  <li>Highly correlated features → Keep</li>
                  <li>Low or no correlation → Remove</li>
                  <li>Use <code>df.corr()</code> in Python</li>
                </ul>
              </div>
              <div class="bg-gray-50 p-5 rounded-lg border border-gray-200">
                <h3 class="text-lg font-bold text-gray-800 mb-2">Feature Importance from Models</h3>
                <p class="text-gray-700 text-sm mb-2">Tree-based models can provide importance scores.</p>
                <ul class="list-disc list-inside text-gray-600 text-sm">
                  <li>Decision Trees, Random Forest</li>
                  <li>Select features with high importance scores</li>
                </ul>
              </div>
            </div>

            <div class="bg-gray-800 text-white p-5 rounded-lg shadow-lg mt-6">
              <h3 class="text-xl font-bold mb-3 text-yellow-400">Best Practices</h3>
              <ul class="space-y-2 text-gray-300">
                <li class="flex items-center"><span class="mr-2">✅</span> Always analyze features before model training</li>
                <li class="flex items-center"><span class="mr-2">✅</span> Remove constant or near-constant features</li>
                <li class="flex items-center"><span class="mr-2">✅</span> Avoid highly correlated redundant features</li>
                <li class="flex items-center"><span class="mr-2">✅</span> Combine feature selection with domain knowledge</li>
              </ul>
            </div>
          </div>
        `,
        syntax: [
          { title: "Check Correlation", content: `df.corr()` },
          { title: "Variance Threshold", content: `from sklearn.feature_selection import VarianceThreshold\nselector = VarianceThreshold(threshold=0.1)\nX_new = selector.fit_transform(X)` },
          { title: "Feature Importance (RF)", content: `from sklearn.ensemble import RandomForestClassifier\nmodel = RandomForestClassifier()\nmodel.fit(X, y)\nprint(model.feature_importances_)` }
        ],
        initialCode: `# Example 1: Correlation Matrix
import pandas as pd

data = {
    "Math": [80, 90, 85, 70],
    "Science": [75, 88, 92, 65],
    "English": [85, 87, 80, 78]
}

df = pd.DataFrame(data)
print("--- Correlation Matrix ---")
print(df.corr())

# Example 2: Feature Selection with Variance
from sklearn.feature_selection import VarianceThreshold

data2 = {
    "Feature1": [0, 0, 0, 0], # Constant feature (Variance = 0)
    "Feature2": [1, 2, 3, 4],
    "Feature3": [5, 6, 7, 8]
}

df2 = pd.DataFrame(data2)
print("\\n--- Original Features ---")
print(df2)

selector = VarianceThreshold(threshold=0.1)
X_new = selector.fit_transform(df2)
print("\\n--- Features after Variance Selection (Feature1 removed) ---")
print(X_new)

# Example 3: Feature Importance Using Random Forest
from sklearn.ensemble import RandomForestClassifier

# Create dummy data
X = pd.DataFrame({
    "Feature1": [1, 2, 3, 4],
    "Feature2": [5, 6, 7, 8],
    "Feature3": [9, 10, 11, 12]
})
y = [0, 1, 0, 1]

model = RandomForestClassifier(random_state=42)
model.fit(X, y)
print("\\n--- Feature Importances ---")
for name, score in zip(X.columns, model.feature_importances_):
    print(f"{name}: {score:.4f}")`
      },
      {
        title: 'Data Preprocessing Pipeline',
        duration: '25 min',
        content: `
          <div class="space-y-6 max-w-4xl mx-auto p-6 font-sans text-gray-800 leading-relaxed">
            <div class="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r shadow-sm">
              <h2 class="text-2xl font-bold text-blue-800 mb-2">What is a Data Preprocessing Pipeline?</h2>
              <p class="text-gray-700 text-lg">
                A data preprocessing pipeline is a systematic sequence of steps used to clean, transform, and prepare raw data for analysis or machine learning models. It automates the workflow, ensuring that data is processed consistently every time.
              </p>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div class="bg-white p-6 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow duration-300">
                <h3 class="text-xl font-semibold text-green-700 mb-3">Key Benefits</h3>
                <ul class="list-disc list-inside text-gray-600 space-y-2">
                  <li><strong>Consistency:</strong> Apply the same transformations to train and test data.</li>
                  <li><strong>Automation:</strong> Reduces manual errors and speeds up the process.</li>
                  <li><strong>Reproducibility:</strong> Ensures the workflow can be repeated easily.</li>
                  <li><strong>Scalability:</strong> Handles large datasets efficiently.</li>
                </ul>
              </div>
              <div class="bg-white p-6 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow duration-300">
                <h3 class="text-xl font-semibold text-purple-700 mb-3">Pipeline Structure</h3>
                <ul class="list-disc list-inside text-gray-600 space-y-2">
                  <li><strong>Data Ingestion:</strong> Loading raw data from sources.</li>
                  <li><strong>Cleaning:</strong> Handling missing values, duplicates, and errors.</li>
                  <li><strong>Transformation:</strong> Scaling, encoding, and feature engineering.</li>
                  <li><strong>Integration:</strong> Combining data from multiple sources.</li>
                </ul>
              </div>
            </div>
            <div class="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-r shadow-sm mt-6">
              <h3 class="text-lg font-bold text-yellow-800 mb-2">Why Use Pipelines?</h3>
              <p class="text-gray-700">
                Pipelines prevent data leakage (using information from the test set during training) and simplify the code by chaining multiple steps into a single object.
              </p>
            </div>
          </div>
        `,
        syntax: [
          { title: "Simple Pipeline Example", content: `from sklearn.preprocessing import StandardScaler, OneHotEncoder\nfrom sklearn.compose import ColumnTransformer\nfrom sklearn.pipeline import Pipeline\nfrom sklearn.impute import SimpleImputer\n\n# Define transformers for numerical and categorical data\nnumeric_transformer = Pipeline(steps=[\n    ('imputer', SimpleImputer(strategy='mean')),\n    ('scaler', StandardScaler())\n])\n\ncategorical_transformer = Pipeline(steps=[\n    ('imputer', SimpleImputer(strategy='most_frequent')),\n    ('encoder', OneHotEncoder(drop='first'))\n])\n\n# Combine transformers using ColumnTransformer\npreprocessor = ColumnTransformer(\n    transformers=[\n        ('num', numeric_transformer, ['Age', 'Salary']),\n        ('cat', categorical_transformer, ['Gender', 'City'])\n    ])` }
        ],
        initialCode: `# Example 1: Simple Data Preprocessing Pipeline\nimport pandas as pd\nfrom sklearn.preprocessing import StandardScaler, OneHotEncoder\nfrom sklearn.compose import ColumnTransformer\nfrom sklearn.pipeline import Pipeline\nfrom sklearn.impute import SimpleImputer\n\n# Create a sample DataFrame with missing values\ndata = {\n    "Age": [25, None, 30, 22],\n    "Salary": [50000, 60000, None, 45000],\n    "Gender": ["Male", "Female", None, "Male"],\n    "City": ["Delhi", "Mumbai", "Chennai", "Delhi"]\n}\ndf = pd.DataFrame(data)\n\n# Define features\nnumeric_features = ['Age', 'Salary']\ncategorical_features = ['Gender', 'City']\n\n# Define transformers\nnumeric_transformer = Pipeline(steps=[\n    ('imputer', SimpleImputer(strategy='mean')),\n    ('scaler', StandardScaler())\n])\n\ncategorical_transformer = Pipeline(steps=[\n    ('imputer', SimpleImputer(strategy='most_frequent')),\n    ('encoder', OneHotEncoder(drop='first'))\n])\n\n# Create the preprocessor\npreprocessor = ColumnTransformer(\n    transformers=[\n        ('num', numeric_transformer, numeric_features),\n        ('cat', categorical_transformer, categorical_features)\n    ])\n\n# Fit and transform the data\nprocessed_data = preprocessor.fit_transform(df)\n\nprint("Original DataFrame:")\nprint(df)\nprint("\\nProcessed Data (NumPy Array):")\nprint(processed_data)`
      }
    ]
  },
  {
    id: 'module-6',
    title: 'Module 6 — Exploratory Data Analysis (EDA)',
    duration: '1 week',
    description: 'Uncover patterns, spot anomalies, and check assumptions with EDA.',
    lessons: [
      {
        title: 'Introduction to Exploratory Data Analysis',
        duration: '15 min',
        content: `
          <div class="space-y-6 max-w-4xl mx-auto p-6 font-sans text-gray-800 leading-relaxed">
            <div class="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r shadow-sm">
              <h2 class="text-2xl font-bold text-blue-800 mb-2">What is Exploratory Data Analysis (EDA)?</h2>
              <p class="text-gray-700 text-lg">
                Exploratory Data Analysis (EDA) is the process of investigating, summarizing, and visualizing a dataset to understand its structure, relationships, patterns, and anomalies before building models.
              </p>
              <p class="text-gray-700 text-lg mt-2">
                EDA helps data scientists gain insights, identify data quality issues, and decide preprocessing or modeling strategies. Think of EDA as “getting to know your data” before making any major decisions.
              </p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div class="bg-white p-6 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow duration-300">
                <h3 class="text-xl font-semibold text-green-700 mb-3">Why EDA is Important</h3>
                <ul class="list-disc list-inside text-gray-600 space-y-2">
                  <li>Provides a deep understanding of the data</li>
                  <li>Detects outliers and anomalies</li>
                  <li>Reveals patterns and relationships between features</li>
                  <li>Guides feature engineering and selection</li>
                  <li>Helps in choosing appropriate machine learning models</li>
                </ul>
              </div>
              <div class="bg-white p-6 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow duration-300">
                <h3 class="text-xl font-semibold text-purple-700 mb-3">Key Components of EDA</h3>
                <ul class="list-disc list-inside text-gray-600 space-y-2">
                  <li><strong>Data Summarization:</strong> Mean, median, mode, min, max, std.</li>
                  <li><strong>Data Visualization:</strong> Histograms, box plots, scatter plots.</li>
                  <li><strong>Data Cleaning Insights:</strong> Identify missing values, duplicates.</li>
                  <li><strong>Relationship Analysis:</strong> Correlation, trends, patterns.</li>
                </ul>
              </div>
            </div>

            <div class="mt-8">
              <h3 class="text-2xl font-bold text-gray-800 mb-4">Types of EDA</h3>
              <div class="space-y-4">
                <div class="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <h4 class="font-bold text-lg text-indigo-700">1. Univariate Analysis</h4>
                  <p class="text-gray-600">Examines one variable at a time.</p>
                  <p class="text-gray-500 text-sm mt-1">Example: Distribution of ages of users (Histogram, Box Plot).</p>
                </div>
                <div class="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <h4 class="font-bold text-lg text-indigo-700">2. Bivariate Analysis</h4>
                  <p class="text-gray-600">Examines relationship between two variables.</p>
                  <p class="text-gray-500 text-sm mt-1">Example: Age vs Salary (Scatter Plot, Correlation).</p>
                </div>
                <div class="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <h4 class="font-bold text-lg text-indigo-700">3. Multivariate Analysis</h4>
                  <p class="text-gray-600">Examines relationships among multiple variables.</p>
                  <p class="text-gray-500 text-sm mt-1">Example: Age, Salary, and Gender influencing purchase behavior (Pairplot, Heatmap).</p>
                </div>
              </div>
            </div>

            <div class="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-r shadow-sm mt-6">
              <h3 class="text-lg font-bold text-yellow-800 mb-2">Steps in EDA</h3>
              <ol class="list-decimal list-inside text-gray-700 space-y-1">
                <li>Understand data types (numerical, categorical, datetime)</li>
                <li>Summarize data (mean, median, std, frequency counts)</li>
                <li>Visualize distributions (histograms, boxplots)</li>
                <li>Explore relationships (scatterplots, correlation matrices)</li>
                <li>Identify anomalies and outliers</li>
                <li>Document insights to guide feature engineering</li>
              </ol>
            </div>
            
            <div class="mt-6">
                <h3 class="text-lg font-bold text-gray-800 mb-2">Common EDA Tools in Python</h3>
                <ul class="list-disc list-inside text-gray-600">
                    <li><strong>Pandas:</strong> Data summarization</li>
                    <li><strong>Matplotlib:</strong> Basic visualization</li>
                    <li><strong>Seaborn:</strong> Advanced statistical visualization</li>
                    <li><strong>NumPy:</strong> Mathematical operations</li>
                    <li><strong>Plotly:</strong> Interactive visualizations</li>
                </ul>
            </div>
          </div>
        `,
        syntax: [
          { title: "Summary of Dataset", content: `df.info()\ndf.describe()\ndf.head()\ndf.tail()` },
          { title: "Univariate Visualization (Histogram)", content: `import matplotlib.pyplot as plt\n\ndf['Age'].hist()\nplt.show()` },
          { title: "Bivariate Visualization (Scatter Plot)", content: `plt.scatter(df['Age'], df['Salary'])\nplt.xlabel('Age')\nplt.ylabel('Salary')\nplt.show()` },
          { title: "Correlation Matrix", content: `import seaborn as sns\n\nsns.heatmap(df.corr(), annot=True)` }
        ],
        initialCode: `# Example 1: Basic Data Summary\nimport pandas as pd\n\ndata = {\n    "Age": [25, 30, 22, 28],\n    "Salary": [50000, 60000, 45000, 52000],\n    "Department": ["HR", "IT", "IT", "Finance"]\n}\n\ndf = pd.DataFrame(data)\n\nprint(df.info())\nprint(df.describe())\nprint(df.head())\n\n# Example 2: Univariate Visualization\nimport matplotlib.pyplot as plt\n\ndf['Age'].hist()\nplt.title("Age Distribution")\nplt.xlabel("Age")\nplt.ylabel("Frequency")\nplt.show()\n\n# Example 3: Bivariate Visualization\nplt.scatter(df['Age'], df['Salary'])\nplt.title("Age vs Salary")\nplt.xlabel("Age")\nplt.ylabel("Salary")\nplt.show()`
      },
      {
        title: 'Descriptive Statistics',
        duration: '20 min',
        content: `
          <div class="space-y-6 max-w-4xl mx-auto p-6 font-sans text-gray-800 leading-relaxed">
            <div class="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r shadow-sm">
              <h2 class="text-2xl font-bold text-blue-800 mb-2">What are Descriptive Statistics?</h2>
              <p class="text-gray-700 text-lg">
                Descriptive statistics summarize and describe the main features of a dataset using numerical measures. They provide a quick overview of the data, helping data scientists understand distributions, trends, and variability.
              </p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div class="bg-white p-6 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow duration-300">
                <h3 class="text-xl font-semibold text-green-700 mb-3">Why Descriptive Statistics are Important</h3>
                <ul class="list-disc list-inside text-gray-600 space-y-2">
                  <li>Quickly understand dataset properties</li>
                  <li>Identify anomalies, outliers, and missing values</li>
                  <li>Guide data cleaning and preprocessing</li>
                  <li>Serve as a foundation for inferential statistics and modeling</li>
                </ul>
              </div>
              <div class="bg-white p-6 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow duration-300">
                <h3 class="text-xl font-semibold text-purple-700 mb-3">Types of Descriptive Statistics</h3>
                <ul class="list-disc list-inside text-gray-600 space-y-2">
                  <li><strong>Measures of Central Tendency:</strong> Mean, Median, Mode (Typical value).</li>
                  <li><strong>Measures of Dispersion:</strong> Range, Variance, Standard Deviation (Spread).</li>
                  <li><strong>Measures of Shape:</strong> Skewness, Kurtosis (Distribution characteristics).</li>
                  <li><strong>Frequency Distribution:</strong> Count of occurrences (Categorical data).</li>
                </ul>
              </div>
            </div>

            <div class="mt-8">
              <h3 class="text-2xl font-bold text-gray-800 mb-4">Key Measures Explained</h3>
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div class="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                  <h4 class="font-bold text-lg text-indigo-700">Mean</h4>
                  <p class="text-gray-600 text-sm">Average value. Sensitive to outliers.</p>
                </div>
                <div class="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                  <h4 class="font-bold text-lg text-indigo-700">Median</h4>
                  <p class="text-gray-600 text-sm">Middle value. Robust to outliers.</p>
                </div>
                <div class="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                  <h4 class="font-bold text-lg text-indigo-700">Mode</h4>
                  <p class="text-gray-600 text-sm">Most frequent value. Useful for categorical data.</p>
                </div>
                <div class="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                  <h4 class="font-bold text-lg text-indigo-700">Variance/SD</h4>
                  <p class="text-gray-600 text-sm">Measures spread. SD is easier to interpret.</p>
                </div>
              </div>
              <div class="mt-4 bg-gray-50 p-4 rounded-lg border border-gray-200">
                 <h4 class="font-bold text-lg text-indigo-700 mb-2">Measures of Shape</h4>
                 <ul class="list-disc list-inside text-gray-600 space-y-1">
                    <li><strong>Skewness:</strong> Measures symmetry (Positive: tail right, Negative: tail left).</li>
                    <li><strong>Kurtosis:</strong> Measures "tailedness" (High: extreme outliers).</li>
                 </ul>
              </div>
            </div>

            <div class="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-r shadow-sm mt-6">
              <h3 class="text-lg font-bold text-yellow-800 mb-2">Descriptive Statistics in Python</h3>
              <p class="text-gray-700">
                Pandas provides <code>.describe()</code> for a comprehensive numerical summary. You can also use individual functions like <code>mean()</code>, <code>median()</code>, <code>mode()</code>, <code>std()</code>, and <code>var()</code>.
              </p>
            </div>
          </div>
        `,
        syntax: [
          { title: "Summary Statistics", content: `import pandas as pd\n\ndf.describe()` },
          { title: "Individual Measures", content: `df['Age'].mean()\ndf['Age'].median()\ndf['Age'].mode()\ndf['Age'].std()\ndf['Age'].var()` }
        ],
        initialCode: `# Example 1: Basic Descriptive Statistics\nimport pandas as pd\n\ndata = {\n    "Age": [25, 30, 22, 28, 35],\n    "Salary": [50000, 60000, 45000, 52000, 58000],\n    "Department": ["HR", "IT", "IT", "Finance", "HR"]\n}\n\ndf = pd.DataFrame(data)\n\n# Basic descriptive statistics\nprint("Dataset Summary:\\n", df.describe())\n\n# Measures for Age\nprint("\\nMean Age:", df['Age'].mean())\nprint("Median Age:", df['Age'].median())\nprint("Mode Age:", df['Age'].mode()[0])\nprint("Standard Deviation Age:", df['Age'].std())\nprint("Variance Age:", df['Age'].var())`
      },
      {
        title: 'Data Distribution Analysis',
        duration: '20 min',
        content: `
          <div class="space-y-6 max-w-4xl mx-auto p-6 font-sans text-gray-800 leading-relaxed">
            <div class="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r shadow-sm">
              <h2 class="text-2xl font-bold text-blue-800 mb-2">What is Data Distribution Analysis?</h2>
              <p class="text-gray-700 text-lg">
                Data distribution analysis examines how the values of a variable are spread or distributed across a dataset. It helps understand patterns, detect anomalies, and select appropriate statistical or machine learning methods.
              </p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div class="bg-white p-6 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow duration-300">
                <h3 class="text-xl font-semibold text-green-700 mb-3">Why Distribution Analysis Matters</h3>
                <ul class="list-disc list-inside text-gray-600 space-y-2">
                  <li>Influences statistical tests and model assumptions</li>
                  <li>Helps detect outliers or extreme values</li>
                  <li>Guides transformation decisions (e.g., log, normalization)</li>
                  <li>Provides insights into feature importance and relationships</li>
                </ul>
              </div>
              <div class="bg-white p-6 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow duration-300">
                <h3 class="text-xl font-semibold text-purple-700 mb-3">Key Concepts</h3>
                <ul class="list-disc list-inside text-gray-600 space-y-2">
                  <li><strong>Probability Distribution:</strong> Normal, Uniform, Exponential.</li>
                  <li><strong>Skewness:</strong> Asymmetry (Positive: tail right, Negative: tail left).</li>
                  <li><strong>Kurtosis:</strong> Tailedness (High: more outliers, Low: less extreme).</li>
                  <li><strong>Outliers:</strong> Values deviating significantly.</li>
                </ul>
              </div>
            </div>

            <div class="mt-8">
              <h3 class="text-2xl font-bold text-gray-800 mb-4">Steps for Data Distribution Analysis</h3>
              <ol class="list-decimal list-inside text-gray-700 space-y-2">
                <li><strong>Visualize Distribution:</strong> Histogram, Box Plot, Density Plot.</li>
                <li><strong>Compute Statistical Measures:</strong> Mean, Median, Mode, SD, Skewness, Kurtosis.</li>
                <li><strong>Detect Outliers:</strong> Use IQR or Z-score methods.</li>
                <li><strong>Interpret Patterns:</strong> Decide on transformations and models.</li>
              </ol>
            </div>

            <div class="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-r shadow-sm mt-6">
              <h3 class="text-lg font-bold text-yellow-800 mb-2">Common Visualizations</h3>
              <ul class="list-disc list-inside text-gray-700 space-y-1">
                <li><strong>Histogram:</strong> Frequency of values.</li>
                <li><strong>Box Plot:</strong> Median, quartiles, outliers.</li>
                <li><strong>Density Plot:</strong> Smooth estimation of distribution.</li>
                <li><strong>Violin Plot:</strong> Combines box plot and density.</li>
              </ul>
            </div>
          </div>
        `,
        syntax: [
          { title: "Histogram", content: `import matplotlib.pyplot as plt\ndf['Age'].hist(bins=10)` },
          { title: "Box Plot", content: `import seaborn as sns\nsns.boxplot(x=df['Age'])` },
          { title: "Density Plot", content: `sns.kdeplot(df['Age'], shade=True)` },
          { title: "Skewness & Kurtosis", content: `print("Skewness:", df['Age'].skew())\nprint("Kurtosis:", df['Age'].kurt())` }
        ],
        initialCode: `# Example 1: Data Distribution Analysis\nimport pandas as pd\nimport matplotlib.pyplot as plt\nimport seaborn as sns\n\ndata = {\n    "Age": [25, 30, 22, 28, 35, 40, 29, 31, 33, 27]\n}\n\ndf = pd.DataFrame(data)\n\n# Histogram\nplt.figure(figsize=(6, 4))\nplt.hist(df['Age'], bins=5, color='skyblue', edgecolor='black')\nplt.title("Age Distribution")\nplt.xlabel("Age")\nplt.ylabel("Frequency")\nplt.show()\n\n# Box plot\nplt.figure(figsize=(6, 4))\nsns.boxplot(x=df['Age'])\nplt.title("Age Boxplot")\nplt.show()\n\n# Density plot\nplt.figure(figsize=(6, 4))\nsns.kdeplot(df['Age'], fill=True)\nplt.title("Age Density Plot")\nplt.show()\n\n# Skewness and Kurtosis
print("Skewness:", df['Age'].skew())
print("Kurtosis:", df['Age'].kurt())`
      },
      {
        title: 'Data Aggregation and Grouping',
        content: `
          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">What is Data Aggregation?</h2>
          <p class="mb-4 text-gray-700 dark:text-gray-300">
            Data aggregation involves transforming data into a summary form. It is a crucial step in data analysis to understand trends and patterns within subsets of data.
            <br><br>
            The most common way to aggregate data in Pandas is using the <code>groupby()</code> function. This follows the <strong>Split-Apply-Combine</strong> strategy:
          </p>
          <ul class="list-disc list-inside mb-4 text-gray-700 dark:text-gray-300">
            <li><strong>Split:</strong> The data is split into groups based on some criteria (e.g., Department).</li>
            <li><strong>Apply:</strong> A function is applied to each group independently (e.g., Mean Salary).</li>
            <li><strong>Combine:</strong> The results are combined into a new data structure.</li>
          </ul>

          <h3 class="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Common Aggregation Functions</h3>
          <ul class="list-disc list-inside mb-4 text-gray-700 dark:text-gray-300">
            <li><code>mean()</code>: Average value</li>
            <li><code>sum()</code>: Total sum</li>
            <li><code>count()</code>: Number of non-null items</li>
            <li><code>min()</code> / <code>max()</code>: Minimum / Maximum value</li>
            <li><code>std()</code>: Standard deviation</li>
          </ul>
        `,
        duration: '25 min',
        syntax: [
          { title: "Basic Grouping", content: `df.groupby('Department')['Salary'].mean()` },
          { title: "Multiple Aggregations", content: `df.groupby('Department')['Salary'].agg(['mean', 'sum', 'max', 'min'])` },
          { title: "Multi-Column Grouping", content: `df.groupby(['Department', 'Gender'])['Salary'].mean()` },
          { title: "Value Counts", content: `df['Department'].value_counts()` }
        ],
        initialCode: `# Example 1: Data Aggregation and Grouping
import pandas as pd

# Creating a sample dataset
data = {
    "Department": ["HR", "IT", "HR", "IT", "Sales", "Sales", "IT"],
    "Employee": ["Alice", "Bob", "Charlie", "David", "Eve", "Frank", "Grace"],
    "Salary": [50000, 80000, 55000, 85000, 60000, 62000, 90000],
    "Gender": ["F", "M", "M", "M", "F", "M", "F"]
}

df = pd.DataFrame(data)

print("Original DataFrame:")
print(df)
print("-" * 30)

# 1. Average Salary by Department
print("Average Salary by Department:")
print(df.groupby('Department')['Salary'].mean())
print("-" * 30)

# 2. Multiple Aggregations
print("Salary Stats by Department:")
print(df.groupby('Department')['Salary'].agg(['mean', 'min', 'max']))
print("-" * 30)

# 3. Grouping by Multiple Columns
print("Avg Salary by Dept & Gender:")
print(df.groupby(['Department', 'Gender'])['Salary'].mean())
print("-" * 30)

# 4. Counting Employees per Department
print("Employee Count per Department:")
print(df['Department'].value_counts())`
      },
      {
        title: 'Outlier Detection',
        content: `
          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">What are Outliers?</h2>
          <p class="mb-4 text-gray-700 dark:text-gray-300">
            Outliers are data points that differ significantly from other observations in a dataset. They can distort analysis, affect model performance, and lead to incorrect conclusions if not handled properly.
          </p>
          <p class="mb-2 text-gray-700 dark:text-gray-300"><strong>Examples:</strong></p>
          <ul class="list-disc list-inside mb-4 text-gray-700 dark:text-gray-300">
            <li>A student scoring 1000 marks in a test where the maximum is 100.</li>
            <li>A salary entry of 1,000,000 in a dataset where most salaries are under 100,000.</li>
          </ul>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Why Detecting Outliers is Important</h2>
          <ul class="list-disc list-inside mb-4 text-gray-700 dark:text-gray-300">
            <li>Outliers can bias statistical measures like mean and standard deviation.</li>
            <li>Machine learning models (especially linear models) are sensitive to outliers.</li>
            <li>Helps clean data and improve predictive performance.</li>
            <li>Provides insights into unusual or rare events.</li>
          </ul>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Types of Outliers</h2>
          <ul class="list-disc list-inside mb-4 text-gray-700 dark:text-gray-300">
            <li><strong>Global Outliers (Point Anomalies):</strong> Individual points that deviate from the overall dataset (e.g., a single extremely high salary).</li>
            <li><strong>Contextual Outliers (Conditional Anomalies):</strong> Deviations within a specific context (e.g., high temperature is normal in summer but unusual in winter).</li>
            <li><strong>Collective Outliers:</strong> A group of observations is anomalous together (e.g., sudden spike in website traffic).</li>
          </ul>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Methods for Detecting Outliers</h2>
          <h3 class="text-lg font-semibold mb-2 text-gray-900 dark:text-white">1. Visualization Methods</h3>
          <ul class="list-disc list-inside mb-4 text-gray-700 dark:text-gray-300">
            <li><strong>Box Plot:</strong> Shows outliers outside the interquartile range (IQR).</li>
            <li><strong>Scatter Plot:</strong> Detect anomalies in relationships.</li>
            <li><strong>Histogram:</strong> Reveals extreme values.</li>
          </ul>
          
          <h3 class="text-lg font-semibold mb-2 text-gray-900 dark:text-white">2. Statistical Methods</h3>
          <ul class="list-disc list-inside mb-4 text-gray-700 dark:text-gray-300">
            <li><strong>Z-score Method:</strong> Measures number of standard deviations from the mean. Common threshold: |Z| > 3.</li>
            <li><strong>IQR Method:</strong> IQR = Q3 – Q1. Outlier if < Q1 – 1.5IQR or > Q3 + 1.5IQR.</li>
          </ul>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Handling Outliers</h2>
          <ul class="list-disc list-inside mb-4 text-gray-700 dark:text-gray-300">
            <li><strong>Remove Outliers:</strong> Useful for clearly erroneous values.</li>
            <li><strong>Transform Data:</strong> Log, square root, or Box-Cox transformation to reduce skewness.</li>
            <li><strong>Impute Values:</strong> Replace outliers with mean, median, or percentile values.</li>
            <li><strong>Keep Outliers:</strong> When they are valid and meaningful (e.g., fraud detection).</li>
          </ul>
        `,
        duration: '25 min',
        syntax: [
          { title: "Box Plot", content: `import seaborn as sns\n\nsns.boxplot(x=df['Salary'])` },
          { title: "Z-score Method", content: `from scipy import stats\nimport numpy as np\n\nz_scores = np.abs(stats.zscore(df['Salary']))\noutliers = df[z_scores > 3]` },
          { title: "IQR Method", content: `Q1 = df['Salary'].quantile(0.25)\nQ3 = df['Salary'].quantile(0.75)\nIQR = Q3 - Q1\n\noutliers = df[(df['Salary'] < Q1 - 1.5*IQR) | (df['Salary'] > Q3 + 1.5*IQR)]` }
        ],
        initialCode: `# Example 1: Outlier Detection
import pandas as pd
import seaborn as sns
from scipy import stats
import numpy as np
import matplotlib.pyplot as plt

# Sample dataset
data = {
    "Salary": [50000, 52000, 60000, 58000, 70000, 1000000]  # 1000000 is an outlier
}
df = pd.DataFrame(data)

# Boxplot visualization
print("Generating Boxplot...")
plt.figure(figsize=(6, 4))
sns.boxplot(x=df['Salary'])
plt.title("Salary Boxplot")
plt.show()

# Z-score method
print("-" * 30)
print("Z-score Method:")
z_scores = np.abs(stats.zscore(df['Salary']))
outliers_z = df[z_scores > 3]
print("Outliers using Z-score:\n", outliers_z)

# IQR method
print("-" * 30)
print("IQR Method:")
Q1 = df['Salary'].quantile(0.25)
Q3 = df['Salary'].quantile(0.75)
IQR = Q3 - Q1
outliers_iqr = df[(df['Salary'] < Q1 - 1.5*IQR) | (df['Salary'] > Q3 + 1.5*IQR)]
print("Outliers using IQR:\n", outliers_iqr)`
      },
      {
        title: 'Correlation and Relationships',
        content: `
          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">What is Correlation?</h2>
          <p class="mb-4 text-gray-700 dark:text-gray-300">
            Correlation measures the strength and direction of the relationship between two variables. It helps to understand whether changes in one variable are associated with changes in another.
          </p>
          <ul class="list-disc list-inside mb-4 text-gray-700 dark:text-gray-300">
            <li><strong>Positive correlation:</strong> Both variables increase or decrease together.</li>
            <li><strong>Negative correlation:</strong> One variable increases while the other decreases.</li>
            <li><strong>No correlation:</strong> No apparent relationship.</li>
          </ul>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Why Understanding Relationships is Important</h2>
          <ul class="list-disc list-inside mb-4 text-gray-700 dark:text-gray-300">
            <li>Helps identify patterns and dependencies.</li>
            <li>Assists in feature selection for machine learning models.</li>
            <li>Reduces multicollinearity issues in regression.</li>
            <li>Guides data visualization and analysis strategy.</li>
          </ul>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Types of Correlation</h2>
          <ul class="list-disc list-inside mb-4 text-gray-700 dark:text-gray-300">
            <li><strong>Pearson Correlation (Linear Relationship):</strong> Measures linear relationship between two continuous variables. Values range from -1 to 1.</li>
            <li><strong>Spearman Rank Correlation (Monotonic Relationship):</strong> Measures monotonic relationship (not necessarily linear). Useful for ordinal variables.</li>
            <li><strong>Kendall’s Tau:</strong> Measures strength of association based on ranking. Less sensitive to outliers.</li>
          </ul>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Interpreting Correlation Coefficients</h2>
          <div class="overflow-x-auto mb-4">
            <table class="min-w-full text-left text-sm whitespace-nowrap">
              <thead class="uppercase tracking-wider border-b-2 dark:border-neutral-600 border-gray-200 bg-gray-50 dark:bg-neutral-800">
                <tr>
                  <th scope="col" class="px-6 py-3">Value</th>
                  <th scope="col" class="px-6 py-3">Strength</th>
                  <th scope="col" class="px-6 py-3">Interpretation</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200 dark:divide-neutral-600">
                <tr><td class="px-6 py-4">0.0–0.3</td><td class="px-6 py-4">Weak</td><td class="px-6 py-4">Low relationship</td></tr>
                <tr><td class="px-6 py-4">0.3–0.7</td><td class="px-6 py-4">Moderate</td><td class="px-6 py-4">Noticeable relationship</td></tr>
                <tr><td class="px-6 py-4">0.7–1.0</td><td class="px-6 py-4">Strong</td><td class="px-6 py-4">Strong relationship</td></tr>
                <tr><td class="px-6 py-4">Negative</td><td class="px-6 py-4">Inverse</td><td class="px-6 py-4">As one increases, other decreases</td></tr>
              </tbody>
            </table>
          </div>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Visualizing Relationships</h2>
          <ul class="list-disc list-inside mb-4 text-gray-700 dark:text-gray-300">
            <li><strong>Scatter Plot:</strong> Visualize trends between two numerical variables.</li>
            <li><strong>Heatmap:</strong> Visualize correlation between multiple variables.</li>
            <li><strong>Pairplot:</strong> Explore relationships for multiple variables.</li>
          </ul>
        `,
        duration: '20 min',
        syntax: [
          { title: "Compute Pearson Correlation", content: `df.corr()  # Default is Pearson` },
          { title: "Compute Spearman Correlation", content: `df.corr(method='spearman')` },
          { title: "Visualize Correlation Heatmap", content: `import seaborn as sns\nimport matplotlib.pyplot as plt\n\nsns.heatmap(df.corr(), annot=True, cmap='coolwarm')\nplt.show()` },
          { title: "Scatter Plot for Relationship", content: `plt.scatter(df['Age'], df['Salary'])\nplt.xlabel('Age')\nplt.ylabel('Salary')\nplt.title('Age vs Salary')\nplt.show()` }
        ],
        initialCode: `# Example 1: Correlation Analysis
import pandas as pd
import seaborn as sns
import matplotlib.pyplot as plt

# Sample dataset
data = {
    "Age": [25, 30, 22, 28, 35, 40, 29],
    "Salary": [50000, 60000, 45000, 52000, 58000, 72000, 55000],
    "Experience": [2, 5, 1, 3, 7, 10, 4]
}

df = pd.DataFrame(data)

# Pearson Correlation
print("Correlation Matrix:")
print(df.corr())
print("-" * 30)

# Heatmap
print("Generating Heatmap...")
plt.figure(figsize=(6, 4))
sns.heatmap(df.corr(), annot=True, cmap='coolwarm')
plt.title("Correlation Matrix")
plt.show()

# Scatter plot Age vs Salary
print("Generating Scatter Plot...")
plt.figure(figsize=(6, 4))
plt.scatter(df['Age'], df['Salary'])
plt.title("Age vs Salary")
plt.xlabel("Age")
plt.ylabel("Salary")
plt.show()`
      },
      {
        title: 'EDA Using Pandas',
        content: `
          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">What is EDA Using Pandas?</h2>
          <p class="mb-4 text-gray-700 dark:text-gray-300">
            EDA using Pandas involves leveraging the Pandas library in Python to explore, summarize, and analyze datasets efficiently.
            <br><br>
            Pandas provides built-in functions for data inspection, summarization, filtering, grouping, handling missing values, and basic visualizations. Using Pandas for EDA is fast, effective, and widely used in the data science workflow.
          </p>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Why Use Pandas for EDA?</h2>
          <ul class="list-disc list-inside mb-4 text-gray-700 dark:text-gray-300">
            <li>Quick data inspection with <code>head()</code>, <code>tail()</code>, <code>info()</code>.</li>
            <li>Descriptive statistics with <code>describe()</code>.</li>
            <li>Filtering and slicing using conditions.</li>
            <li>Grouping and aggregation.</li>
            <li>Handles missing data easily.</li>
            <li>Supports integration with Matplotlib and Seaborn for visualization.</li>
          </ul>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Key Pandas Functions for EDA</h2>
          <ul class="list-disc list-inside mb-4 text-gray-700 dark:text-gray-300">
            <li><strong>Data Inspection:</strong> <code>df.head()</code>, <code>df.tail()</code>, <code>df.info()</code>.</li>
            <li><strong>Descriptive Statistics:</strong> <code>df.describe()</code>, <code>df['col'].value_counts()</code>.</li>
            <li><strong>Filtering & Slicing:</strong> <code>df[df['Age'] > 30]</code>, <code>df[['Age', 'Salary']]</code>.</li>
            <li><strong>Grouping & Aggregation:</strong> <code>df.groupby('Dept')['Salary'].mean()</code>.</li>
            <li><strong>Missing Data:</strong> <code>df.isnull().sum()</code>, <code>df.fillna(val)</code>, <code>df.dropna()</code>.</li>
          </ul>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">EDA Workflow Using Pandas</h2>
          <ol class="list-decimal list-inside mb-4 text-gray-700 dark:text-gray-300">
            <li>Load dataset.</li>
            <li>Inspect data types, shape, and summary.</li>
            <li>Handle missing values and duplicates.</li>
            <li>Explore distributions and relationships.</li>
            <li>Perform grouping and aggregation.</li>
            <li>Document insights.</li>
          </ol>
        `,
        duration: '20 min',
        syntax: [
          { title: "Basic Data Inspection", content: `df.head()\ndf.tail()\ndf.info()\ndf.describe()\ndf.shape\ndf.columns` },
          { title: "Filtering and Selecting", content: `df[df['Age'] > 30]\ndf[['Name', 'Salary']]` },
          { title: "Grouping and Aggregation", content: `df.groupby('Department')['Salary'].mean()\ndf.groupby('Department')['Salary'].agg(['mean', 'sum', 'max'])` },
          { title: "Handling Missing Values", content: `df.isnull().sum()\ndf.fillna(0, inplace=True)\ndf.dropna(inplace=True)` }
        ],
        initialCode: `# Example 1: EDA Using Pandas
import pandas as pd
import numpy as np

# Sample dataset
data = {
    "Name": ["Alice", "Bob", "Charlie", "David", "Eva"],
    "Age": [25, 30, 22, 28, None],
    "Salary": [50000, 60000, 45000, 52000, 58000],
    "Department": ["HR", "IT", "IT", "Finance", "HR"]
}

df = pd.DataFrame(data)

# Data inspection
print("First 5 rows:")
print(df.head())
print("-" * 30)

print("Dataset info:")
print(df.info())
print("-" * 30)

print("Descriptive statistics:")
print(df.describe())
print("-" * 30)

# Handling missing values
print("Missing values per column:")
print(df.isnull().sum())
print("-" * 30)

# Filling missing Age with mean
mean_age = df['Age'].mean()
df['Age'].fillna(mean_age, inplace=True)
print("After filling missing Age:")
print(df)
print("-" * 30)

# Grouping & aggregation
print("Mean Salary per Department:")
mean_salary = df.groupby('Department')['Salary'].mean()
print(mean_salary)`
      },
      {
        title: 'Extracting Insights from Data',
        content: `
          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">What Does “Extracting Insights” Mean?</h2>
          <p class="mb-4 text-gray-700 dark:text-gray-300">
            Extracting insights from data is the process of analyzing data patterns, trends, and relationships to generate actionable information. Insights help organizations and analysts make data-driven decisions.
            <br><br>
            It goes beyond numbers and statistics to answer questions like:
          </p>
          <ul class="list-disc list-inside mb-4 text-gray-700 dark:text-gray-300">
            <li>Which factors influence outcomes?</li>
            <li>What patterns or anomalies exist?</li>
            <li>How can this data guide decisions?</li>
          </ul>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Importance of Extracting Insights</h2>
          <ul class="list-disc list-inside mb-4 text-gray-700 dark:text-gray-300">
            <li>Converts raw data into business value.</li>
            <li>Improves decision-making and strategy.</li>
            <li>Identifies opportunities, risks, and trends.</li>
            <li>Helps communicate findings to stakeholders.</li>
          </ul>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Steps to Extract Insights</h2>
          <ol class="list-decimal list-inside mb-4 text-gray-700 dark:text-gray-300">
            <li><strong>Understand the Context:</strong> Know the business problem and identify relevant metrics/KPIs.</li>
            <li><strong>Explore the Data:</strong> Perform EDA (visualizations, summary statistics) and detect anomalies.</li>
            <li><strong>Analyze Relationships:</strong> Correlation analysis, grouping, and trends over time.</li>
            <li><strong>Form Hypotheses:</strong> Make testable assumptions based on observations.</li>
            <li><strong>Validate Insights:</strong> Check consistency with domain knowledge.</li>
            <li><strong>Present Findings:</strong> Use tables, charts, and dashboards to highlight actionable points.</li>
          </ol>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Common Techniques</h2>
          <ul class="list-disc list-inside mb-4 text-gray-700 dark:text-gray-300">
            <li><strong>Descriptive Analysis:</strong> What happened? (summary stats, counts)</li>
            <li><strong>Diagnostic Analysis:</strong> Why did it happen? (correlations, group comparisons)</li>
            <li><strong>Trend Analysis:</strong> How values change over time (line charts, time series)</li>
            <li><strong>Comparative Analysis:</strong> Compare categories or groups</li>
          </ul>
        `,
        duration: '20 min',
        syntax: [
          { title: "Example Using Pandas", content: `# Mean salary by department\ndf.groupby('Department')['Salary'].mean()\n\n# Count of employees per department\ndf['Department'].value_counts()\n\n# Correlation between Age and Salary\ndf['Age'].corr(df['Salary'])` },
          { title: "Visualization for Insights", content: `import matplotlib.pyplot as plt\nimport seaborn as sns\n\n# Salary distribution by department\nsns.boxplot(x='Department', y='Salary', data=df)\nplt.show()\n\n# Scatter plot Age vs Salary\nplt.scatter(df['Age'], df['Salary'])\nplt.xlabel('Age')\nplt.ylabel('Salary')\nplt.show()` }
        ],
        initialCode: `# Example 1: Extracting Insights
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns

# Sample dataset
data = {
    "Employee": ["A", "B", "C", "D", "E", "F"],
    "Department": ["HR", "IT", "IT", "Finance", "HR", "Finance"],
    "Age": [25, 30, 28, 35, 27, 40],
    "Salary": [50000, 60000, 65000, 70000, 52000, 72000]
}

df = pd.DataFrame(data)

# Insights: Average salary per department
print("Average Salary per Department:")
avg_salary = df.groupby('Department')['Salary'].mean()
print(avg_salary)
print("-" * 30)

# Employee count per department
print("Employee Count per Department:")
count_emp = df['Department'].value_counts()
print(count_emp)
print("-" * 30)

# Correlation between Age and Salary
print("Correlation between Age and Salary:", df['Age'].corr(df['Salary']))
print("-" * 30)

# Visualization: Salary by Department
print("Generating Boxplot...")
plt.figure(figsize=(6, 4))
sns.boxplot(x='Department', y='Salary', data=df)
plt.title("Salary Distribution by Department")
plt.show()

# Scatter plot Age vs Salary
print("Generating Scatter Plot...")
plt.figure(figsize=(6, 4))
plt.scatter(df['Age'], df['Salary'])
plt.xlabel('Age')
plt.ylabel('Salary')
plt.title('Age vs Salary')
plt.show()`
      },
      {
        title: 'EDA Case Study',
        duration: '30 min',
        content: `
          <div class="space-y-6 max-w-4xl mx-auto p-6 font-sans text-gray-800 leading-relaxed">
            <div class="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r shadow-sm">
              <h2 class="text-2xl font-bold text-blue-800 mb-2">What is an EDA Case Study?</h2>
              <p class="text-gray-700 text-lg">
                An EDA case study is a practical example where you perform end-to-end exploratory data analysis on a real or sample dataset.
                It demonstrates how to apply all EDA techniques: summarization, visualization, correlation, outlier detection, and insights extraction.
              </p>
              <p class="text-gray-700 text-lg mt-2">
                Case studies help learners connect theory with practice and understand how EDA guides real-world decisions.
              </p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div class="bg-white p-6 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow duration-300">
                <h3 class="text-xl font-semibold text-green-700 mb-3">Objectives of an EDA Case Study</h3>
                <ul class="list-disc list-inside text-gray-600 space-y-2">
                  <li>Explore dataset structure and quality</li>
                  <li>Identify patterns, trends, and relationships</li>
                  <li>Detect anomalies and outliers</li>
                  <li>Generate actionable insights</li>
                  <li>Prepare data for modeling</li>
                </ul>
              </div>
              <div class="bg-white p-6 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow duration-300">
                <h3 class="text-xl font-semibold text-purple-700 mb-3">Key Takeaways</h3>
                <ul class="list-disc list-inside text-gray-600 space-y-2">
                  <li>A case study integrates all EDA concepts</li>
                  <li>Helps learners practice systematically</li>
                  <li>Provides hands-on experience before modeling</li>
                  <li>Bridges theory with real-world application</li>
                </ul>
              </div>
            </div>

            <div class="mt-8">
              <h3 class="text-2xl font-bold text-gray-800 mb-4">Steps in a Case Study</h3>
              <div class="space-y-4">
                <div class="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <h4 class="font-bold text-lg text-indigo-700">1. Load the Dataset</h4>
                  <p class="text-gray-600">Import CSV, Excel, or database data.</p>
                </div>
                <div class="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <h4 class="font-bold text-lg text-indigo-700">2. Inspect the Data</h4>
                  <p class="text-gray-600">Use <code>head()</code>, <code>tail()</code>, <code>info()</code>, <code>describe()</code>.</p>
                </div>
                <div class="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <h4 class="font-bold text-lg text-indigo-700">3. Data Cleaning</h4>
                  <p class="text-gray-600">Handle missing values and duplicates. Correct data types.</p>
                </div>
                <div class="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <h4 class="font-bold text-lg text-indigo-700">4. Univariate Analysis</h4>
                  <p class="text-gray-600">Histograms, box plots, value counts.</p>
                </div>
                <div class="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <h4 class="font-bold text-lg text-indigo-700">5. Bivariate and Multivariate Analysis</h4>
                  <p class="text-gray-600">Scatter plots, correlation matrix, pairplots.</p>
                </div>
                <div class="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <h4 class="font-bold text-lg text-indigo-700">6. Outlier Detection</h4>
                  <p class="text-gray-600">Z-score, IQR, and visualization.</p>
                </div>
                <div class="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <h4 class="font-bold text-lg text-indigo-700">7. Extract Insights</h4>
                  <p class="text-gray-600">Summarize trends, relationships, and anomalies.</p>
                </div>
                <div class="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <h4 class="font-bold text-lg text-indigo-700">8. Visualization & Reporting</h4>
                  <p class="text-gray-600">Use charts to communicate findings.</p>
                </div>
              </div>
            </div>

            <div class="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-r shadow-sm mt-6">
              <h3 class="text-lg font-bold text-yellow-800 mb-2">Example Scenario</h3>
              <p class="text-gray-700"><strong>Dataset:</strong> Employee data of a company</p>
              <p class="text-gray-700"><strong>Columns:</strong> Employee Name, Department, Age, Salary</p>
              <p class="text-gray-700 mt-2"><strong>Questions to Answer:</strong></p>
              <ul class="list-disc list-inside text-gray-700 space-y-1">
                <li>Which department has the highest average salary?</li>
                <li>Are salaries correlated with age?</li>
                <li>Are there any outliers in salary?</li>
                <li>What trends can we observe about employee distribution?</li>
              </ul>
            </div>

            <div class="mt-6">
              <h3 class="text-lg font-bold text-gray-800 mb-2">Best Practices</h3>
              <ul class="list-disc list-inside text-gray-600">
                  <li>Treat the case study as a mini-project</li>
                  <li>Apply all EDA techniques systematically</li>
                  <li>Document all steps, observations, and insights</li>
                  <li>Use visualizations to communicate results clearly</li>
                  <li>Validate insights with domain knowledge</li>
              </ul>
            </div>
          </div>
        `,
        syntax: [
          {
            title: "Load & Inspect",
            content: `import pandas as pd\nimport matplotlib.pyplot as plt\nimport seaborn as sns\nimport numpy as np\n\n# Load dataset\ndf = pd.read_csv('employee_data.csv')  # Example file\n\n# Inspect dataset\ndf.info()\ndf.describe()\ndf.head()`
          },
          {
            title: "Handling Missing Values",
            content: `df['Age'].fillna(df['Age'].mean(), inplace=True)\ndf.dropna(inplace=True)`
          },
          {
            title: "Univariate Analysis",
            content: `df['Salary'].hist()\nsns.boxplot(x='Salary', data=df)`
          },
          {
            title: "Bivariate Analysis",
            content: `plt.scatter(df['Age'], df['Salary'])\nsns.heatmap(df.corr(), annot=True)`
          },
          {
            title: "Outlier Detection (IQR)",
            content: `Q1 = df['Salary'].quantile(0.25)\nQ3 = df['Salary'].quantile(0.75)\nIQR = Q3 - Q1\noutliers = df[(df['Salary'] < Q1 - 1.5*IQR) | (df['Salary'] > Q3 + 1.5*IQR)]`
          },
          {
            title: "Extract Insights",
            content: `avg_salary = df.groupby('Department')['Salary'].mean()\nemp_count = df['Department'].value_counts()\ncorrelation = df['Age'].corr(df['Salary'])`
          }
        ],
        initialCode: `# Example 1: EDA Case Study
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns

# Sample dataset
data = {
    "Employee": ["A", "B", "C", "D", "E", "F", "G"],
    "Department": ["HR", "IT", "IT", "Finance", "HR", "Finance", "IT"],
    "Age": [25, 30, 28, 35, 27, 40, 32],
    "Salary": [50000, 60000, 65000, 70000, 52000, 72000, 67000]
}

df = pd.DataFrame(data)

# Inspect data
print("Dataset Info:\\n", df.info())
print("\\nDescriptive Stats:\\n", df.describe())

# Univariate Analysis
print("\\nGenerating Salary Histogram...")
# df['Salary'].hist() # Not supported in this environment without display
# plt.title("Salary Distribution")
# plt.show()

# sns.boxplot(x='Salary', data=df)
# plt.show()

# Bivariate Analysis
print("Generating Age vs Salary Scatter Plot...")
# plt.scatter(df['Age'], df['Salary'])
# plt.xlabel('Age')
# plt.ylabel('Salary')
# plt.title('Age vs Salary')
# plt.show()

# sns.heatmap(df.corr(), annot=True, cmap='coolwarm')
# plt.show()

# Outlier Detection (IQR)
Q1 = df['Salary'].quantile(0.25)
Q3 = df['Salary'].quantile(0.75)
IQR = Q3 - Q1
outliers = df[(df['Salary'] < Q1 - 1.5*IQR) | (df['Salary'] > Q3 + 1.5*IQR)]
print("\\nOutliers:\\n", outliers)

# Extract Insights
avg_salary = df.groupby('Department')['Salary'].mean()
print("\\nAverage Salary per Department:\\n", avg_salary)

emp_count = df['Department'].value_counts()
print("\\nEmployee Count per Department:\\n", emp_count)

correlation = df['Age'].corr(df['Salary'])
print("\\nCorrelation between Age and Salary:", correlation)`
      }
    ]
  },
  {
    id: 'module-7',
    title: 'Module 7 — Data Visualization Techniques',
    duration: '1 week',
    description: 'Communicate insights effectively using Matplotlib and Seaborn.',
    lessons: [
      {
        title: 'Importance of Data Visualization',
        duration: '15 min',
        content: `
          <div class="space-y-6 max-w-4xl mx-auto p-6 font-sans text-gray-800 dark:text-gray-200 leading-relaxed">
            <div class="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 p-4 rounded-r shadow-sm">
              <h2 class="text-2xl font-bold text-blue-800 dark:text-blue-300 mb-2">What is Data Visualization?</h2>
              <p class="text-gray-700 dark:text-gray-300 text-lg">
                Data visualization is the graphical representation of data to help understand patterns, trends, and insights.
                It turns raw numbers into meaningful visual stories, making data easier to interpret.
              </p>
              <ul class="list-disc list-inside text-gray-700 dark:text-gray-300 mt-2 space-y-1">
                <li>Helps communicate insights quickly and effectively</li>
                <li>Essential for both exploratory analysis and reporting</li>
                <li>Bridges the gap between data and decision-making</li>
              </ul>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow duration-300">
                <h3 class="text-xl font-semibold text-green-700 dark:text-green-400 mb-3">Why Data Visualization is Important</h3>
                <ul class="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2">
                  <li><strong>Simplifies Complex Data:</strong> Large datasets are easier to understand visually.</li>
                  <li><strong>Identifies Trends and Patterns:</strong> Detect changes over time and correlations.</li>
                  <li><strong>Detects Anomalies and Outliers:</strong> Outliers are visible through charts like box plots.</li>
                  <li><strong>Supports Decision-Making:</strong> Stakeholders can make informed decisions faster.</li>
                  <li><strong>Enhances Storytelling:</strong> Visuals help explain findings clearly.</li>
                </ul>
              </div>
              <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow duration-300">
                <h3 class="text-xl font-semibold text-purple-700 dark:text-purple-400 mb-3">Types of Data Visualizations</h3>
                <ul class="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2">
                  <li><strong>Univariate Plots:</strong> Single variable (Histogram, Box plot).</li>
                  <li><strong>Bivariate Plots:</strong> Two variables (Scatter plot, Line plot).</li>
                  <li><strong>Multivariate Plots:</strong> Multiple variables (Pairplot, Heatmap).</li>
                  <li><strong>Categorical Data:</strong> Bar chart, Pie chart, Countplot.</li>
                </ul>
              </div>
            </div>

            <div class="mt-8">
              <h3 class="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">Impact of Visualization in Data Science</h3>
              <div class="space-y-4">
                <div class="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                  <h4 class="font-bold text-lg text-indigo-700 dark:text-indigo-400">Exploratory Data Analysis</h4>
                  <p class="text-gray-600 dark:text-gray-300">Identify trends, patterns, and anomalies early in the process.</p>
                </div>
                <div class="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                  <h4 class="font-bold text-lg text-indigo-700 dark:text-indigo-400">Model Interpretation</h4>
                  <p class="text-gray-600 dark:text-gray-300">Explain model results and predictions to non-technical stakeholders.</p>
                </div>
                <div class="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                  <h4 class="font-bold text-lg text-indigo-700 dark:text-indigo-400">Business Reporting</h4>
                  <p class="text-gray-600 dark:text-gray-300">Communicate KPIs and performance metrics effectively.</p>
                </div>
                <div class="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                  <h4 class="font-bold text-lg text-indigo-700 dark:text-indigo-400">Predictive Analytics</h4>
                  <p class="text-gray-600 dark:text-gray-300">Show forecast trends and future scenarios.</p>
                </div>
              </div>
            </div>

            <div class="mt-6">
              <h3 class="text-lg font-bold text-gray-800 dark:text-gray-100 mb-2">Best Practices</h3>
              <ul class="list-disc list-inside text-gray-600 dark:text-gray-300">
                  <li>Choose the right type of chart for your data</li>
                  <li>Keep visuals clean and readable</li>
                  <li>Use colors and labels meaningfully</li>
                  <li>Avoid misleading scales or distortions</li>
                  <li>Combine visuals with context and insights</li>
              </ul>
            </div>
          </div>
        `,
        syntax: [
          {
            title: "Bar Plot",
            content: `import pandas as pd\nimport matplotlib.pyplot as plt\n\n# Example data\ndata = {\n    "Department": ["HR", "IT", "Finance", "IT", "HR", "Finance"],\n    "Salary": [50000, 60000, 70000, 65000, 52000, 72000]\n}\ndf = pd.DataFrame(data)\n\n# Bar plot\ndf.groupby('Department')['Salary'].mean().plot(kind='bar')\nplt.title("Average Salary per Department")\nplt.ylabel("Salary")\nplt.show()`
          },
          {
            title: "Pie Chart",
            content: `import matplotlib.pyplot as plt\n\n# Pie chart\ndf['Department'].value_counts().plot(kind='pie', autopct='%1.1f%%')\nplt.title("Employee Distribution by Department")\nplt.show()`
          }
        ],
        initialCode: `# Example 1: Importance of Data Visualization
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns

# Sample dataset
data = {
    "Employee": ["A", "B", "C", "D", "E", "F"],
    "Department": ["HR", "IT", "IT", "Finance", "HR", "Finance"],
    "Salary": [50000, 60000, 65000, 70000, 52000, 72000]
}

df = pd.DataFrame(data)

# Bar chart: Average salary per department
print("Generating Bar Chart...")
avg_salary = df.groupby('Department')['Salary'].mean()
avg_salary.plot(kind='bar', color='skyblue')
plt.title("Average Salary per Department")
plt.ylabel("Salary")
plt.show()

# Pie chart: Employee distribution
print("Generating Pie Chart...")
df['Department'].value_counts().plot(kind='pie', autopct='%1.1f%%', startangle=90, colors=['skyblue','lightgreen','salmon'])
plt.title("Employee Distribution by Department")
plt.ylabel("")
plt.show()`
      },
      {
        title: 'Introduction to Matplotlib',
        duration: '20 min',
        content: `
          <div class="space-y-6 max-w-4xl mx-auto p-6 font-sans text-gray-800 dark:text-gray-200 leading-relaxed">
            <div class="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 p-4 rounded-r shadow-sm">
              <h2 class="text-2xl font-bold text-blue-800 dark:text-blue-300 mb-2">What is Matplotlib?</h2>
              <p class="text-gray-700 dark:text-gray-300 text-lg">
                Matplotlib is a popular Python library for data visualization.
                It allows creating static, animated, and interactive plots for analyzing and communicating data.
              </p>
              <ul class="list-disc list-inside text-gray-700 dark:text-gray-300 mt-2 space-y-1">
                <li>Provides full control over plot elements (axes, colors, labels, etc.)</li>
                <li>Works well with Pandas, NumPy, and Python data structures</li>
                <li>Forms the foundation for higher-level libraries like Seaborn</li>
              </ul>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow duration-300">
                <h3 class="text-xl font-semibold text-green-700 dark:text-green-400 mb-3">Why Use Matplotlib?</h3>
                <ul class="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2">
                  <li><strong>Flexibility:</strong> Customize every element of a plot (colors, markers, styles).</li>
                  <li><strong>Compatibility:</strong> Works with Python’s data science stack (NumPy, Pandas, SciPy).</li>
                  <li><strong>Wide Range of Plots:</strong> Line plots, bar charts, scatter plots, histograms, pie charts, etc.</li>
                  <li><strong>Integration:</strong> Easily combined with Jupyter Notebook, Seaborn, or interactive tools.</li>
                </ul>
              </div>
              <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow duration-300">
                <h3 class="text-xl font-semibold text-purple-700 dark:text-purple-400 mb-3">Key Components of a Plot</h3>
                <ul class="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2">
                  <li><strong>Figure:</strong> The entire canvas.</li>
                  <li><strong>Axes:</strong> Area where data is plotted.</li>
                  <li><strong>Axis:</strong> X-axis and Y-axis.</li>
                  <li><strong>Plot Elements:</strong> Lines, markers, colors, labels, and legends.</li>
                </ul>
              </div>
            </div>

            <div class="mt-8">
              <h3 class="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">Steps to Create a Plot</h3>
              <ol class="list-decimal list-inside text-gray-700 dark:text-gray-300 space-y-2 bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                <li>Import Matplotlib: <code>import matplotlib.pyplot as plt</code></li>
                <li>Prepare your data (lists, arrays, Pandas series)</li>
                <li>Use a plotting function (<code>plt.plot</code>, <code>plt.bar</code>, etc.)</li>
                <li>Add labels, title, and legend</li>
                <li>Display the plot with <code>plt.show()</code></li>
              </ol>
            </div>

            <div class="mt-8">
              <h3 class="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">Common Plot Types</h3>
              <div class="overflow-x-auto">
                <table class="min-w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <thead class="bg-gray-100 dark:bg-gray-700">
                    <tr>
                      <th class="py-2 px-4 border-b border-gray-200 dark:border-gray-600 text-left text-gray-700 dark:text-gray-200 font-semibold">Plot Type</th>
                      <th class="py-2 px-4 border-b border-gray-200 dark:border-gray-600 text-left text-gray-700 dark:text-gray-200 font-semibold">Use Case</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr class="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td class="py-2 px-4 border-b border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300">Line Plot</td>
                      <td class="py-2 px-4 border-b border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300">Trend over time</td>
                    </tr>
                    <tr class="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td class="py-2 px-4 border-b border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300">Bar Chart</td>
                      <td class="py-2 px-4 border-b border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300">Comparing categories</td>
                    </tr>
                    <tr class="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td class="py-2 px-4 border-b border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300">Histogram</td>
                      <td class="py-2 px-4 border-b border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300">Distribution of a numeric variable</td>
                    </tr>
                    <tr class="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td class="py-2 px-4 border-b border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300">Scatter Plot</td>
                      <td class="py-2 px-4 border-b border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300">Relationship between two numeric variables</td>
                    </tr>
                     <tr class="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td class="py-2 px-4 border-b border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300">Pie Chart</td>
                      <td class="py-2 px-4 border-b border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300">Proportion of categories</td>
                    </tr>
                     <tr class="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td class="py-2 px-4 border-b border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300">Box Plot</td>
                      <td class="py-2 px-4 border-b border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300">Detect outliers and visualize spread</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div class="mt-6">
              <h3 class="text-lg font-bold text-gray-800 dark:text-gray-100 mb-2">Best Practices</h3>
              <ul class="list-disc list-inside text-gray-600 dark:text-gray-300">
                  <li>Always label axes and title plots</li>
                  <li>Use legends for multiple datasets</li>
                  <li>Choose appropriate chart types for your data</li>
                  <li>Avoid clutter; keep visuals clean and interpretable</li>
              </ul>
            </div>

            <div class="mt-8">
              <h3 class="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">🎯 Learning Outcomes</h3>
              <div class="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-100 dark:border-blue-800">
                <p class="text-gray-700 dark:text-gray-300 mb-2 font-medium">After completing this topic, learners will be able to:</p>
                <ul class="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-1">
                  <li>Understand the purpose and importance of Matplotlib</li>
                  <li>Create basic line, bar, and histogram plots</li>
                  <li>Customize plot elements (title, labels, markers, colors)</li>
                  <li>Prepare data visualizations for analysis and presentation</li>
                </ul>
              </div>
            </div>
          </div>
        `,
        syntax: [
          {
            title: "Basic Line Plot",
            content: `import matplotlib.pyplot as plt

x = [1, 2, 3, 4, 5]
y = [10, 15, 12, 18, 20]

plt.plot(x, y, label='Line 1', color='blue', marker='o')
plt.xlabel('X-axis')
plt.ylabel('Y-axis')
plt.title('Basic Line Plot')
plt.legend()
plt.show()`
          },
          {
            title: "Bar Plot Example",
            content: `categories = ['A', 'B', 'C', 'D']
values = [5, 7, 3, 8]

plt.bar(categories, values, color='skyblue')
plt.title('Bar Chart Example')
plt.xlabel('Categories')
plt.ylabel('Values')
plt.show()`
          },
          {
            title: "Histogram Example",
            content: `data = [12, 15, 12, 18, 22, 25, 17, 20, 15]

plt.hist(data, bins=5, color='lightgreen', edgecolor='black')
plt.title('Histogram Example')
plt.xlabel('Value')
plt.ylabel('Frequency')
plt.show()`
          }
        ],
        initialCode: `# Example: Introduction to Matplotlib
import matplotlib.pyplot as plt

# Sample data
months = ['Jan', 'Feb', 'Mar', 'Apr', 'May']
sales = [200, 250, 220, 300, 270]

# Line plot
plt.plot(months, sales, color='blue', marker='o', linestyle='-', label='Sales')
plt.title('Monthly Sales')
plt.xlabel('Month')
plt.ylabel('Sales')
plt.legend()
plt.show()

# Bar plot
plt.bar(months, sales, color='orange')
plt.title('Monthly Sales Bar Chart')
plt.xlabel('Month')
plt.ylabel('Sales')
plt.show()

# Histogram
ages = [22, 25, 27, 22, 30, 28, 24, 26, 25, 27]
plt.hist(ages, bins=5, color='lightblue', edgecolor='black')
plt.title('Age Distribution')
plt.xlabel('Age')
plt.ylabel('Frequency')
plt.show()

# 📌 Best Practices
# 1. Start with simple plots before adding complexity
# 2. Always add labels, title, and legend
# 3. Use color coding for multiple datasets
# 4. Keep the visualization clean and interpretable`
      },
      {
        title: 'Line Charts and Bar Charts',
        duration: '25 min',
        content: `
          <div class="space-y-6 max-w-4xl mx-auto p-6 font-sans text-gray-800 dark:text-gray-200 leading-relaxed">
            <div class="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 p-4 rounded-r shadow-sm">
              <h2 class="text-2xl font-bold text-blue-800 dark:text-blue-300 mb-2">Line Charts</h2>
              <p class="text-gray-700 dark:text-gray-300 text-lg">
                A line chart is used to visualize trends over time or ordered sequences.
                Each point represents a value, and points are connected by a line.
              </p>
              <p class="mt-2 text-gray-600 dark:text-gray-400">Ideal for time series data, trends, and continuous variables.</p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                <h3 class="text-xl font-semibold text-green-700 dark:text-green-400 mb-3">Key Points</h3>
                <ul class="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2">
                  <li>Shows trends clearly over time or order</li>
                  <li>Can have multiple lines to compare different datasets</li>
                  <li>Use markers for highlighting data points</li>
                </ul>
              </div>
              <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                <h3 class="text-xl font-semibold text-purple-700 dark:text-purple-400 mb-3">Example Uses</h3>
                <ul class="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2">
                  <li>Monthly sales trends</li>
                  <li>Stock price movements</li>
                  <li>Temperature changes over time</li>
                </ul>
              </div>
            </div>

            <div class="mt-8">
              <div class="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 p-4 rounded-r shadow-sm">
                <h2 class="text-2xl font-bold text-blue-800 dark:text-blue-300 mb-2">Bar Charts</h2>
                <p class="text-gray-700 dark:text-gray-300 text-lg">
                  A bar chart displays categorical data using rectangular bars.
                  Bar length represents the value of the variable.
                </p>
                <p class="mt-2 text-gray-600 dark:text-gray-400">Can be vertical or horizontal. Useful for comparing categories.</p>
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                <h3 class="text-xl font-semibold text-green-700 dark:text-green-400 mb-3">Key Points</h3>
                <ul class="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2">
                  <li>Compare categories side by side</li>
                  <li>Can include stacked bars for subcategories</li>
                  <li>Color coding enhances interpretation</li>
                </ul>
              </div>
              <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                <h3 class="text-xl font-semibold text-purple-700 dark:text-purple-400 mb-3">Example Uses</h3>
                <ul class="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2">
                  <li>Sales by region</li>
                  <li>Employee count by department</li>
                  <li>Product revenue comparisons</li>
                </ul>
              </div>
            </div>

            <div class="mt-8">
              <h3 class="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">Differences Between Line and Bar Charts</h3>
              <div class="overflow-x-auto">
                <table class="min-w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <thead class="bg-gray-100 dark:bg-gray-700">
                    <tr>
                      <th class="py-2 px-4 border-b border-gray-200 dark:border-gray-600 text-left text-gray-700 dark:text-gray-200 font-semibold">Feature</th>
                      <th class="py-2 px-4 border-b border-gray-200 dark:border-gray-600 text-left text-gray-700 dark:text-gray-200 font-semibold">Line Chart</th>
                      <th class="py-2 px-4 border-b border-gray-200 dark:border-gray-600 text-left text-gray-700 dark:text-gray-200 font-semibold">Bar Chart</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr class="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td class="py-2 px-4 border-b border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300">Data Type</td>
                      <td class="py-2 px-4 border-b border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300">Continuous/Sequential</td>
                      <td class="py-2 px-4 border-b border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300">Categorical</td>
                    </tr>
                    <tr class="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td class="py-2 px-4 border-b border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300">Purpose</td>
                      <td class="py-2 px-4 border-b border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300">Show trends over time</td>
                      <td class="py-2 px-4 border-b border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300">Compare categories</td>
                    </tr>
                    <tr class="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td class="py-2 px-4 border-b border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300">Visualization</td>
                      <td class="py-2 px-4 border-b border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300">Connected points</td>
                      <td class="py-2 px-4 border-b border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300">Separate bars</td>
                    </tr>
                    <tr class="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td class="py-2 px-4 border-b border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300">Multiple Series</td>
                      <td class="py-2 px-4 border-b border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300">Multiple lines possible</td>
                      <td class="py-2 px-4 border-b border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300">Multiple bars possible</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div class="mt-6">
              <h3 class="text-lg font-bold text-gray-800 dark:text-gray-100 mb-2">Best Practices</h3>
              <ul class="list-disc list-inside text-gray-600 dark:text-gray-300">
                <li>Use line charts for trends and bar charts for comparisons</li>
                <li>Label axes and add title and legend</li>
                <li>Avoid clutter: don’t include too many categories in bar charts</li>
                <li>Use consistent colors and spacing</li>
              </ul>
            </div>
            
            <div class="mt-8">
              <h3 class="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">🎯 Learning Outcomes</h3>
              <div class="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-100 dark:border-blue-800">
                <p class="text-gray-700 dark:text-gray-300 mb-2 font-medium">After completing this topic, learners will be able to:</p>
                <ul class="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-1">
                  <li>Create line charts to visualize trends over time</li>
                  <li>Create vertical and horizontal bar charts to compare categories</li>
                  <li>Customize charts with titles, labels, legends, and colors</li>
                  <li>Choose the appropriate chart type based on analysis needs</li>
                </ul>
              </div>
            </div>
          </div>
        `,
        syntax: [
          {
            title: "Line Chart Example",
            content: `import matplotlib.pyplot as plt

months = ['Jan', 'Feb', 'Mar', 'Apr', 'May']
sales = [200, 250, 220, 300, 270]

plt.plot(months, sales, marker='o', color='blue', linestyle='-', label='Sales')
plt.title('Monthly Sales Trend')
plt.xlabel('Month')
plt.ylabel('Sales')
plt.legend()
plt.show()`
          },
          {
            title: "Bar Chart Example",
            content: `departments = ['HR', 'IT', 'Finance', 'Marketing']
avg_salary = [52000, 65000, 70000, 60000]

plt.bar(departments, avg_salary, color='skyblue')
plt.title('Average Salary by Department')
plt.xlabel('Department')
plt.ylabel('Average Salary')
plt.show()`
          },
          {
            title: "Horizontal Bar Chart",
            content: `plt.barh(departments, avg_salary, color='lightgreen')
plt.title('Average Salary by Department')
plt.xlabel('Average Salary')
plt.ylabel('Department')
plt.show()`
          }
        ],
        initialCode: `# Example: Line and Bar Charts
import matplotlib.pyplot as plt

# Sample data
months = ['Jan', 'Feb', 'Mar', 'Apr', 'May']
sales = [200, 250, 220, 300, 270]

departments = ['HR', 'IT', 'Finance', 'Marketing']
avg_salary = [52000, 65000, 70000, 60000]

# Line Chart: Monthly Sales
print("Generating Monthly Sales Line Chart...")
plt.plot(months, sales, marker='o', linestyle='-', color='blue', label='Sales')
plt.title('Monthly Sales Trend')
plt.xlabel('Month')
plt.ylabel('Sales')
plt.legend()
plt.show()

# Vertical Bar Chart: Average Salary
print("Generating Average Salary Bar Chart...")
plt.bar(departments, avg_salary, color='skyblue')
plt.title('Average Salary by Department')
plt.xlabel('Department')
plt.ylabel('Average Salary')
plt.show()

# Horizontal Bar Chart
print("Generating Horizontal Bar Chart...")
plt.barh(departments, avg_salary, color='lightgreen')
plt.title('Average Salary by Department (Horizontal)')
plt.xlabel('Average Salary')
plt.ylabel('Department')
plt.show()

# 📌 Best Practices
# - Choose chart type based on data type and objective
# - Always label axes, title, and legend
# - Use consistent colors and formatting for multiple charts
# - Highlight key points using markers or color`
      },
      {
        title: 'Histograms and Box Plots',
        duration: '25 min',
        content: `
          <div class="space-y-6 max-w-4xl mx-auto p-6 font-sans text-gray-800 dark:text-gray-200 leading-relaxed">
            <div class="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 p-4 rounded-r shadow-sm">
              <h2 class="text-2xl font-bold text-blue-800 dark:text-blue-300 mb-2">Histograms</h2>
              <p class="text-gray-700 dark:text-gray-300 text-lg">
                A histogram is a graphical representation of the distribution of a numeric variable.
                It divides data into bins (intervals) and shows the frequency of values in each bin.
              </p>
              <p class="mt-2 text-gray-600 dark:text-gray-400">Ideal for understanding data distribution, skewness, and spread.</p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                <h3 class="text-xl font-semibold text-green-700 dark:text-green-400 mb-3">Key Points</h3>
                <ul class="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2">
                  <li>Shows how often values occur</li>
                  <li>Helps identify skewed distributions</li>
                  <li>Useful for detecting outliers</li>
                </ul>
              </div>
              <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                <h3 class="text-xl font-semibold text-purple-700 dark:text-purple-400 mb-3">Example Uses</h3>
                <ul class="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2">
                  <li>Examining age distribution in a population</li>
                  <li>Visualizing sales frequencies</li>
                  <li>Analyzing test scores</li>
                </ul>
              </div>
            </div>

            <div class="mt-8">
              <div class="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 p-4 rounded-r shadow-sm">
                <h2 class="text-2xl font-bold text-blue-800 dark:text-blue-300 mb-2">Box Plots (Whisker Plots)</h2>
                <p class="text-gray-700 dark:text-gray-300 text-lg">
                  A box plot summarizes data using five key statistics:
                  Minimum, Q1 (25th percentile), Median (Q2), Q3 (75th percentile), Maximum.
                </p>
                <p class="mt-2 text-gray-600 dark:text-gray-400">Can also identify outliers using whiskers.</p>
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                <h3 class="text-xl font-semibold text-green-700 dark:text-green-400 mb-3">Key Points</h3>
                <ul class="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2">
                  <li>Box represents interquartile range (IQR)</li>
                  <li>Median is shown inside the box</li>
                  <li>Outliers are plotted individually</li>
                </ul>
              </div>
              <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                <h3 class="text-xl font-semibold text-purple-700 dark:text-purple-400 mb-3">Example Uses</h3>
                <ul class="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2">
                  <li>Compare salary distributions across departments</li>
                  <li>Detect outliers in exam scores</li>
                  <li>Visualize spread and symmetry of data</li>
                </ul>
              </div>
            </div>

            <div class="mt-8">
              <h3 class="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">Differences Between Histogram and Box Plot</h3>
              <div class="overflow-x-auto">
                <table class="min-w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <thead class="bg-gray-100 dark:bg-gray-700">
                    <tr>
                      <th class="py-2 px-4 border-b border-gray-200 dark:border-gray-600 text-left text-gray-700 dark:text-gray-200 font-semibold">Feature</th>
                      <th class="py-2 px-4 border-b border-gray-200 dark:border-gray-600 text-left text-gray-700 dark:text-gray-200 font-semibold">Histogram</th>
                      <th class="py-2 px-4 border-b border-gray-200 dark:border-gray-600 text-left text-gray-700 dark:text-gray-200 font-semibold">Box Plot</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr class="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td class="py-2 px-4 border-b border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300">Purpose</td>
                      <td class="py-2 px-4 border-b border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300">Frequency distribution</td>
                      <td class="py-2 px-4 border-b border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300">Summary statistics & outliers</td>
                    </tr>
                    <tr class="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td class="py-2 px-4 border-b border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300">Data Type</td>
                      <td class="py-2 px-4 border-b border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300">Numeric</td>
                      <td class="py-2 px-4 border-b border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300">Numeric</td>
                    </tr>
                    <tr class="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td class="py-2 px-4 border-b border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300">Visual</td>
                      <td class="py-2 px-4 border-b border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300">Bars representing bins</td>
                      <td class="py-2 px-4 border-b border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300">Box with whiskers</td>
                    </tr>
                    <tr class="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td class="py-2 px-4 border-b border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300">Outlier Detection</td>
                      <td class="py-2 px-4 border-b border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300">Hard to spot</td>
                      <td class="py-2 px-4 border-b border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300">Easily visible</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div class="mt-6">
              <h3 class="text-lg font-bold text-gray-800 dark:text-gray-100 mb-2">Best Practices</h3>
              <ul class="list-disc list-inside text-gray-600 dark:text-gray-300">
                <li>Use histograms to see distribution shape</li>
                <li>Use box plots to compare distributions and detect outliers</li>
                <li>Combine both for better insights</li>
                <li>Choose appropriate bin size for histograms</li>
              </ul>
            </div>
          </div>
        `,
        syntax: [
          {
            title: "Histogram Example",
            content: `import matplotlib.pyplot as plt\n\nages = [22, 25, 27, 22, 30, 28, 24, 26, 25, 27]\n\nplt.hist(ages, bins=5, color='lightblue', edgecolor='black')\nplt.title('Age Distribution')\nplt.xlabel('Age')\nplt.ylabel('Frequency')\nplt.show()`
          },
          {
            title: "Box Plot Example",
            content: `import matplotlib.pyplot as plt\n\nsalaries = [50000, 60000, 65000, 70000, 52000, 72000]\n\nplt.boxplot(salaries, patch_artist=True, notch=True)\nplt.title('Salary Distribution')\nplt.ylabel('Salary')\nplt.show()`
          },
          {
            title: "Box Plot for Multiple Categories",
            content: `import pandas as pd\nimport matplotlib.pyplot as plt\n\ndata = {\n    "Department": ["HR", "IT", "IT", "Finance", "HR", "Finance"],\n    "Salary": [50000, 60000, 65000, 70000, 52000, 72000]\n}\n\ndf = pd.DataFrame(data)\n\ndf.boxplot(column='Salary', by='Department', patch_artist=True)\nplt.title('Salary Distribution by Department')\nplt.suptitle('')  # Remove default title\nplt.ylabel('Salary')\nplt.show()`
          }
        ],
        initialCode: `# Example: Histogram and Box Plots
import matplotlib.pyplot as plt
import pandas as pd

# Sample data
ages = [22, 25, 27, 22, 30, 28, 24, 26, 25, 27]
salaries = [50000, 60000, 65000, 70000, 52000, 72000]

# Histogram
print("Generating Histogram...")
plt.hist(ages, bins=5, color='lightblue', edgecolor='black')
plt.title('Age Distribution')
plt.xlabel('Age')
plt.ylabel('Frequency')
plt.show()

# Box plot
print("Generating Box Plot...")
plt.boxplot(salaries, patch_artist=True, notch=True)
plt.title('Salary Distribution')
plt.ylabel('Salary')
plt.show()

# Box plot by department
print("Generating Box Plot by Department...")
data = {
    "Department": ["HR", "IT", "IT", "Finance", "HR", "Finance"],
    "Salary": [50000, 60000, 65000, 70000, 52000, 72000]
}
df = pd.DataFrame(data)
df.boxplot(column='Salary', by='Department', patch_artist=True)
plt.title('Salary Distribution by Department')
plt.suptitle('')
plt.ylabel('Salary')
plt.show()

# 📌 Best Practices
# - Choose bin size carefully in histograms
# - Use notched box plots to compare medians
# - Combine histograms and box plots for detailed insight
# - Visualizations should clearly highlight patterns and outliers`
      },
      {
        title: 'Scatter and Bubble Charts',
        duration: '25 min',
        content: `
          <div class="space-y-6 max-w-4xl mx-auto p-6 font-sans text-gray-800 dark:text-gray-200 leading-relaxed">
            <div class="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 p-4 rounded-r shadow-sm">
              <h2 class="text-2xl font-bold text-blue-800 dark:text-blue-300 mb-2">Scatter Charts</h2>
              <p class="text-gray-700 dark:text-gray-300 text-lg">
                A scatter chart (scatter plot) visualizes the relationship between two numeric variables.
                Each point represents a pair of values (x, y).
              </p>
              <p class="mt-2 text-gray-600 dark:text-gray-400">Ideal for detecting correlations, clusters, and trends.</p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                <h3 class="text-xl font-semibold text-green-700 dark:text-green-400 mb-3">Key Points</h3>
                <ul class="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2">
                  <li>Helps identify positive, negative, or no correlation</li>
                  <li>Useful in regression analysis and outlier detection</li>
                  <li>Can include multiple groups by color or marker</li>
                </ul>
              </div>
              <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                <h3 class="text-xl font-semibold text-purple-700 dark:text-purple-400 mb-3">Example Uses</h3>
                <ul class="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2">
                  <li>Age vs Salary</li>
                  <li>Hours studied vs Exam score</li>
                  <li>Marketing spend vs Sales</li>
                </ul>
              </div>
            </div>

            <div class="mt-8">
              <div class="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 p-4 rounded-r shadow-sm">
                <h2 class="text-2xl font-bold text-blue-800 dark:text-blue-300 mb-2">Bubble Charts</h2>
                <p class="text-gray-700 dark:text-gray-300 text-lg">
                  A bubble chart is an extension of a scatter chart where a third variable is represented by the size of the bubble.
                  Shows relationships between three numeric variables.
                </p>
                <p class="mt-2 text-gray-600 dark:text-gray-400">Size conveys an additional dimension of information.</p>
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                <h3 class="text-xl font-semibold text-green-700 dark:text-green-400 mb-3">Example Uses</h3>
                <ul class="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2">
                  <li>Country population (size) vs GDP vs Life expectancy</li>
                  <li>Product sales vs Profit vs Market share</li>
                </ul>
              </div>
            </div>

            <div class="mt-8">
              <h3 class="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">Differences Between Scatter and Bubble Charts</h3>
              <div class="overflow-x-auto">
                <table class="min-w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <thead class="bg-gray-100 dark:bg-gray-700">
                    <tr>
                      <th class="py-2 px-4 border-b border-gray-200 dark:border-gray-600 text-left text-gray-700 dark:text-gray-200 font-semibold">Feature</th>
                      <th class="py-2 px-4 border-b border-gray-200 dark:border-gray-600 text-left text-gray-700 dark:text-gray-200 font-semibold">Scatter Chart</th>
                      <th class="py-2 px-4 border-b border-gray-200 dark:border-gray-600 text-left text-gray-700 dark:text-gray-200 font-semibold">Bubble Chart</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr class="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td class="py-2 px-4 border-b border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300">Dimensions</td>
                      <td class="py-2 px-4 border-b border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300">2 numeric variables</td>
                      <td class="py-2 px-4 border-b border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300">3 numeric variables</td>
                    </tr>
                    <tr class="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td class="py-2 px-4 border-b border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300">Size Indicator</td>
                      <td class="py-2 px-4 border-b border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300">Fixed</td>
                      <td class="py-2 px-4 border-b border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300">Represents a variable</td>
                    </tr>
                    <tr class="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td class="py-2 px-4 border-b border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300">Purpose</td>
                      <td class="py-2 px-4 border-b border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300">Show correlation/trends</td>
                      <td class="py-2 px-4 border-b border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300">Show correlation with extra info</td>
                    </tr>
                    <tr class="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td class="py-2 px-4 border-b border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300">Use Case</td>
                      <td class="py-2 px-4 border-b border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300">Regression analysis</td>
                      <td class="py-2 px-4 border-b border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300">Multi-dimensional comparisons</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div class="mt-6">
              <h3 class="text-lg font-bold text-gray-800 dark:text-gray-100 mb-2">Best Practices</h3>
              <ul class="list-disc list-inside text-gray-600 dark:text-gray-300">
                <li>Label axes and add title</li>
                <li>Use color or marker shape for multiple categories</li>
                <li>Avoid overcrowding with too many points</li>
                <li>Use bubble size carefully for visual clarity</li>
              </ul>
            </div>
            
            <div class="mt-8">
              <h3 class="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">🎯 Learning Outcomes</h3>
              <div class="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-100 dark:border-blue-800">
                <p class="text-gray-700 dark:text-gray-300 mb-2 font-medium">After completing this topic, learners will be able to:</p>
                <ul class="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-1">
                  <li>Create scatter plots to visualize relationships between variables</li>
                  <li>Use bubble charts to represent three variables</li>
                  <li>Differentiate scatter vs bubble charts and their use cases</li>
                  <li>Customize scatter/bubble plots with colors, sizes, and markers</li>
                </ul>
              </div>
            </div>
          </div>
        `,
        syntax: [
          {
            title: "Scatter Plot Example",
            content: `import matplotlib.pyplot as plt\n\n# Sample data\nage = [22, 25, 28, 30, 35]\nsalary = [50000, 60000, 65000, 70000, 75000]\n\nplt.scatter(age, salary, color='blue')\nplt.title('Age vs Salary')\nplt.xlabel('Age')\nplt.ylabel('Salary')\nplt.show()`
          },
          {
            title: "Bubble Chart Example",
            content: `import matplotlib.pyplot as plt\n\nage = [22, 25, 28, 30, 35]\nsalary = [50000, 60000, 65000, 70000, 75000]\nexperience = [1, 3, 5, 7, 10]  # Bubble size\n\nplt.scatter(age, salary, s=[e*50 for e in experience], color='green', alpha=0.5)\nplt.title('Age vs Salary with Experience as Bubble Size')\nplt.xlabel('Age')\nplt.ylabel('Salary')\nplt.show()`
          },
          {
            title: "Scatter Plot with Multiple Categories",
            content: `import matplotlib.pyplot as plt\n\nage = [22, 25, 28, 30, 35, 40]\nsalary = [50000, 60000, 65000, 70000, 75000, 80000]\ndepartment = ['HR','IT','IT','Finance','HR','Finance']\ncolors = ['red' if d=='HR' else 'blue' if d=='IT' else 'green' for d in department]\n\nplt.scatter(age, salary, c=colors)\nplt.title('Age vs Salary by Department')\nplt.xlabel('Age')\nplt.ylabel('Salary')\nplt.show()`
          }
        ],
        initialCode: `# Example: Scatter and Bubble Charts
import matplotlib.pyplot as plt

# Sample data
age = [22, 25, 28, 30, 35, 40]
salary = [50000, 60000, 65000, 70000, 75000, 80000]
experience = [1, 3, 5, 7, 10, 12]  # Bubble size
department = ['HR','IT','IT','Finance','HR','Finance']

# Scatter plot
print("Generating Scatter Plot...")
plt.scatter(age, salary, color='blue')
plt.title('Age vs Salary')
plt.xlabel('Age')
plt.ylabel('Salary')
plt.show()

# Bubble chart
print("Generating Bubble Chart...")
plt.scatter(age, salary, s=[e*50 for e in experience], color='green', alpha=0.5)
plt.title('Age vs Salary with Experience as Bubble Size')
plt.xlabel('Age')
plt.ylabel('Salary')
plt.show()

# Scatter with categories
print("Generating Scatter Plot with Categories...")
colors = ['red' if d=='HR' else 'blue' if d=='IT' else 'green' for d in department]
plt.scatter(age, salary, c=colors)
plt.title('Age vs Salary by Department')
plt.xlabel('Age')
plt.ylabel('Salary')
plt.show()

# 📌 Best Practices
# - Use scatter for relationships and bubble for 3D comparisons
# - Always label axes and provide title
# - Color and size can enhance clarity for multiple groups
# - Avoid over-plotting with too many points`
      },
      {
        title: 'Introduction to Seaborn',
        duration: '20 min',
        content: `
          <div class="space-y-6 max-w-4xl mx-auto p-6 font-sans text-gray-800 dark:text-gray-200 leading-relaxed">
            <div class="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 p-4 rounded-r shadow-sm">
              <h2 class="text-2xl font-bold text-blue-800 dark:text-blue-300 mb-2">What is Seaborn?</h2>
              <p class="text-gray-700 dark:text-gray-300 text-lg">
                Seaborn is a Python data visualization library built on top of Matplotlib.
                It provides a high-level interface for creating informative and attractive statistical graphics.
              </p>
              <ul class="list-disc list-inside mt-2 text-gray-600 dark:text-gray-400">
                <li>Simplifies creation of complex visualizations</li>
                <li>Integrates seamlessly with Pandas DataFrames</li>
                <li>Provides built-in themes and color palettes for better visuals</li>
              </ul>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                <h3 class="text-xl font-semibold text-green-700 dark:text-green-400 mb-3">Why Use Seaborn?</h3>
                <ul class="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2">
                  <li><span class="font-semibold">Ease of Use:</span> Less code required than Matplotlib for complex plots</li>
                  <li><span class="font-semibold">Attractive Visuals:</span> Built-in color palettes, styles, and themes</li>
                  <li><span class="font-semibold">Statistical Plots:</span> Supports plots like boxplots, violin plots, pairplots, heatmaps</li>
                  <li><span class="font-semibold">Integration:</span> Works well with Pandas, NumPy, and Matplotlib</li>
                </ul>
              </div>
              <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                <h3 class="text-xl font-semibold text-purple-700 dark:text-purple-400 mb-3">Key Features</h3>
                <ul class="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2">
                  <li>Built-in datasets for practice</li>
                  <li>Automatic aggregation of data for plots</li>
                  <li>Advanced plot types for statistical analysis</li>
                  <li>Easy customization of colors, labels, and legends</li>
                </ul>
              </div>
            </div>

            <div class="mt-8">
              <h3 class="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">Common Seaborn Plots</h3>
              <div class="overflow-x-auto">
                <table class="min-w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <thead class="bg-gray-100 dark:bg-gray-700">
                    <tr>
                      <th class="py-2 px-4 border-b border-gray-200 dark:border-gray-600 text-left text-gray-700 dark:text-gray-200 font-semibold">Plot Type</th>
                      <th class="py-2 px-4 border-b border-gray-200 dark:border-gray-600 text-left text-gray-700 dark:text-gray-200 font-semibold">Use Case</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr class="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td class="py-2 px-4 border-b border-gray-200 dark:border-gray-600 font-mono text-blue-600 dark:text-blue-400">sns.barplot</td>
                      <td class="py-2 px-4 border-b border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300">Compare categories</td>
                    </tr>
                    <tr class="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td class="py-2 px-4 border-b border-gray-200 dark:border-gray-600 font-mono text-blue-600 dark:text-blue-400">sns.boxplot</td>
                      <td class="py-2 px-4 border-b border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300">Visualize distributions and outliers</td>
                    </tr>
                    <tr class="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td class="py-2 px-4 border-b border-gray-200 dark:border-gray-600 font-mono text-blue-600 dark:text-blue-400">sns.heatmap</td>
                      <td class="py-2 px-4 border-b border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300">Correlation matrices or 2D data</td>
                    </tr>
                    <tr class="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td class="py-2 px-4 border-b border-gray-200 dark:border-gray-600 font-mono text-blue-600 dark:text-blue-400">sns.scatterplot</td>
                      <td class="py-2 px-4 border-b border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300">Relationship between variables</td>
                    </tr>
                    <tr class="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td class="py-2 px-4 border-b border-gray-200 dark:border-gray-600 font-mono text-blue-600 dark:text-blue-400">sns.pairplot</td>
                      <td class="py-2 px-4 border-b border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300">Multiple variable relationships</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div class="mt-6">
              <h3 class="text-lg font-bold text-gray-800 dark:text-gray-100 mb-2">Best Practices</h3>
              <ul class="list-disc list-inside text-gray-600 dark:text-gray-300">
                <li>Start with simple plots before using advanced features</li>
                <li>Use built-in color palettes for clarity</li>
                <li>Integrate with Matplotlib for customized visuals</li>
                <li>Always label axes, title, and legend for clarity</li>
              </ul>
            </div>
            
            <div class="mt-8">
              <h3 class="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">🎯 Learning Outcomes</h3>
              <div class="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-100 dark:border-blue-800">
                <p class="text-gray-700 dark:text-gray-300 mb-2 font-medium">After completing this topic, learners will be able to:</p>
                <ul class="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-1">
                  <li>Understand the purpose and features of Seaborn</li>
                  <li>Create bar plots, box plots, scatter plots, and heatmaps</li>
                  <li>Visualize statistical relationships effectively</li>
                  <li>Integrate Seaborn with Pandas and Matplotlib for customized visuals</li>
                </ul>
              </div>
            </div>
          </div>
        `,
        syntax: [
          {
            title: "Basic Seaborn Example",
            content: `import seaborn as sns\nimport matplotlib.pyplot as plt\nimport pandas as pd\n\n# Sample dataset\ndata = {\n    "Department": ["HR", "IT", "IT", "Finance", "HR", "Finance"],\n    "Salary": [50000, 60000, 65000, 70000, 52000, 72000],\n    "Age": [25, 30, 28, 35, 27, 40]\n}\n\ndf = pd.DataFrame(data)\n\n# Bar plot\nsns.barplot(x='Department', y='Salary', data=df)\nplt.title('Average Salary by Department')\nplt.show()\n\n# Box plot\nsns.boxplot(x='Department', y='Salary', data=df)\nplt.title('Salary Distribution by Department')\nplt.show()`
          },
          {
            title: "Heatmap Example",
            content: `# Correlation heatmap\ncorr = df.corr()\nsns.heatmap(corr, annot=True, cmap='coolwarm')\nplt.title('Correlation Heatmap')\nplt.show()`
          }
        ],
        initialCode: `# Example: Introduction to Seaborn
import seaborn as sns
import matplotlib.pyplot as plt
import pandas as pd

# Sample data
data = {
    "Department": ["HR", "IT", "IT", "Finance", "HR", "Finance"],
    "Salary": [50000, 60000, 65000, 70000, 52000, 72000],
    "Age": [25, 30, 28, 35, 27, 40]
}

df = pd.DataFrame(data)

# Bar plot
print("Generating Bar Plot...")
sns.barplot(x='Department', y='Salary', data=df, palette='pastel')
plt.title('Average Salary by Department')
plt.show()

# Box plot
print("Generating Box Plot...")
sns.boxplot(x='Department', y='Salary', data=df, palette='Set2')
plt.title('Salary Distribution by Department')
plt.show()

# Correlation heatmap
print("Generating Correlation Heatmap...")
# Note: In a real environment, you might need to select only numeric columns for correlation
# For this simple dataset, Pandas might handle it or we select explicitly
numeric_df = df.select_dtypes(include=['float64', 'int64'])
sns.heatmap(numeric_df.corr(), annot=True, cmap='coolwarm')
plt.title('Correlation Heatmap')
plt.show()

# Scatter plot with Seaborn
print("Generating Scatter Plot...")
sns.scatterplot(x='Age', y='Salary', hue='Department', data=df, s=100)
plt.title('Age vs Salary by Department')
plt.show()

# 📌 Best Practices
# - Use color palettes to differentiate categories
# - Combine Seaborn with Matplotlib for customized visuals
# - Label all axes, titles, and legends clearly
# - Start with simple plots, then explore statistical visualizations`
      },
      {
        title: 'Visualizing Relationships',
        duration: '25 min',
        content: `
          <div class="space-y-6 max-w-4xl mx-auto p-6 font-sans text-gray-800 dark:text-gray-200 leading-relaxed">
            <div class="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 p-4 rounded-r shadow-sm">
              <h2 class="text-2xl font-bold text-blue-800 dark:text-blue-300 mb-2">What is Relationship Visualization?</h2>
              <p class="text-gray-700 dark:text-gray-300 text-lg">
                Visualizing relationships is about understanding how variables interact.
                It helps identify correlations, patterns, clusters, or trends between numeric or categorical variables.
              </p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                <h3 class="text-xl font-semibold text-green-700 dark:text-green-400 mb-3">Key Points</h3>
                <ul class="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2">
                  <li>Reveals dependencies or associations between variables</li>
                  <li>Detects positive, negative, or no correlation</li>
                  <li>Helps in predictive modeling and feature selection</li>
                </ul>
              </div>
              <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                <h3 class="text-xl font-semibold text-purple-700 dark:text-purple-400 mb-3">Example Use Cases</h3>
                <ul class="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2">
                  <li>Sales vs Marketing Spend</li>
                  <li>Age vs Salary</li>
                  <li>Temperature vs Ice Cream Sales</li>
                  <li>Study Hours vs Exam Scores</li>
                </ul>
              </div>
            </div>

            <div class="mt-8">
              <h3 class="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">Common Techniques</h3>
              <div class="overflow-x-auto">
                <table class="min-w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <thead class="bg-gray-100 dark:bg-gray-700">
                    <tr>
                      <th class="py-2 px-4 border-b border-gray-200 dark:border-gray-600 text-left text-gray-700 dark:text-gray-200 font-semibold">Technique</th>
                      <th class="py-2 px-4 border-b border-gray-200 dark:border-gray-600 text-left text-gray-700 dark:text-gray-200 font-semibold">Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr class="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td class="py-2 px-4 border-b border-gray-200 dark:border-gray-600 font-semibold text-blue-600 dark:text-blue-400">Scatter Plots</td>
                      <td class="py-2 px-4 border-b border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300">Shows relationship between two numeric variables. Can include color/size.</td>
                    </tr>
                    <tr class="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td class="py-2 px-4 border-b border-gray-200 dark:border-gray-600 font-semibold text-blue-600 dark:text-blue-400">Pair Plots (Seaborn)</td>
                      <td class="py-2 px-4 border-b border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300">Plots all pairwise relationships in a dataset (scatter + histograms).</td>
                    </tr>
                    <tr class="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td class="py-2 px-4 border-b border-gray-200 dark:border-gray-600 font-semibold text-blue-600 dark:text-blue-400">Correlation Heatmaps</td>
                      <td class="py-2 px-4 border-b border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300">Visualizes correlation coefficients. Helps identify strong/weak relationships.</td>
                    </tr>
                    <tr class="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td class="py-2 px-4 border-b border-gray-200 dark:border-gray-600 font-semibold text-blue-600 dark:text-blue-400">Line Plots</td>
                      <td class="py-2 px-4 border-b border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300">Shows relationships over time or sequences (trends).</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div class="mt-6">
              <h3 class="text-lg font-bold text-gray-800 dark:text-gray-100 mb-2">Best Practices</h3>
              <ul class="list-disc list-inside text-gray-600 dark:text-gray-300">
                <li>Start by plotting simple scatter plots</li>
                <li>Use color, size, or shape to differentiate groups</li>
                <li>Combine scatter plots with regression lines for clarity</li>
                <li>Use heatmaps for datasets with many numeric features</li>
              </ul>
            </div>
          </div>
        `,
        syntax: [
          {
            title: "Scatter Plot with Regression",
            content: `import seaborn as sns\nimport matplotlib.pyplot as plt\nimport pandas as pd\n\n# Sample dataset\ndata = {\n    "Age": [22, 25, 28, 30, 35, 40],\n    "Salary": [50000, 60000, 65000, 70000, 75000, 80000]\n}\ndf = pd.DataFrame(data)\n\n# Scatter plot with regression line\nsns.regplot(x='Age', y='Salary', data=df)\nplt.title('Age vs Salary with Trend Line')\nplt.show()`
          },
          {
            title: "Pair Plot & Heatmap",
            content: `# Pair plot\nsns.pairplot(df)\nplt.show()\n\n# Correlation heatmap\ncorr = df.corr()\nsns.heatmap(corr, annot=True, cmap='coolwarm')\nplt.title('Correlation Heatmap')\nplt.show()`
          }
        ],
        initialCode: `# Example: Visualizing Relationships
import pandas as pd
import seaborn as sns
import matplotlib.pyplot as plt

# Sample data
data = {
    "Age": [22, 25, 28, 30, 35, 40],
    "Salary": [50000, 60000, 65000, 70000, 75000, 80000],
    "Experience": [1, 3, 5, 7, 10, 12]
}
df = pd.DataFrame(data)

# Scatter plot
print("Generating Scatter Plot...")
sns.scatterplot(x='Age', y='Salary', data=df, s=100)
plt.title('Age vs Salary')
plt.show()

# Scatter with regression line
print("Generating Regression Plot...")
sns.regplot(x='Age', y='Salary', data=df)
plt.title('Age vs Salary with Trend Line')
plt.show()

# Pair plot
print("Generating Pair Plot...")
sns.pairplot(df)
plt.show()

# Correlation heatmap
print("Generating Correlation Heatmap...")
sns.heatmap(df.corr(), annot=True, cmap='coolwarm')
plt.title('Correlation Heatmap')
plt.show()

# 📌 Best Practices
# - Use scatter and regression plots to explore relationships
# - Use pair plots for datasets with multiple numeric variables
# - Correlation heatmaps are great for quick insights in large datasets
# - Always label axes, titles, and legends for clarity`
      },
      {
        title: 'Dashboard-Style Visualizations (Basic)',
        duration: '25 min',
        content: `
          <div class="space-y-6 max-w-4xl mx-auto p-6 font-sans text-gray-800 dark:text-gray-200 leading-relaxed">
            <div class="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 p-4 rounded-r shadow-sm">
              <h2 class="text-2xl font-bold text-blue-800 dark:text-blue-300 mb-2">What are Dashboard-Style Visualizations?</h2>
              <p class="text-gray-700 dark:text-gray-300 text-lg">
                A dashboard is a single-page interface that displays multiple visualizations together.
                It combines charts, tables, and KPIs to summarize key insights and provides a quick, interactive view of data.
              </p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                <h3 class="text-xl font-semibold text-green-700 dark:text-green-400 mb-3">Key Points</h3>
                <ul class="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2">
                  <li>Helps stakeholders monitor metrics in real-time</li>
                  <li>Can include bar charts, line charts, scatter plots, and tables</li>
                  <li>Enables comparison across multiple dimensions</li>
                </ul>
              </div>
              <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                <h3 class="text-xl font-semibold text-purple-700 dark:text-purple-400 mb-3">Benefits</h3>
                <ul class="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2">
                  <li><strong>Quick Decision-Making:</strong> Consolidates multiple visualizations.</li>
                  <li><strong>Trend Monitoring:</strong> Shows historical vs current data.</li>
                  <li><strong>Data Storytelling:</strong> Visuals together create a clear narrative.</li>
                </ul>
              </div>
            </div>

            <div class="mt-8">
              <h3 class="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">Example Use Cases</h3>
              <div class="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                <ul class="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2">
                  <li><strong>Sales dashboard:</strong> Total sales, sales by region, trends over time</li>
                  <li><strong>HR dashboard:</strong> Employee count, average salary, age distribution</li>
                  <li><strong>Finance dashboard:</strong> Revenue vs expense, profit trends, outliers</li>
                </ul>
              </div>
            </div>

            <div class="mt-6">
              <h3 class="text-lg font-bold text-gray-800 dark:text-gray-100 mb-2">Best Practices</h3>
              <ul class="list-disc list-inside text-gray-600 dark:text-gray-300">
                <li>Keep dashboards simple and focused</li>
                <li>Use consistent color schemes</li>
                <li>Label axes, titles, and legends clearly</li>
                <li>Group related visualizations logically</li>
                <li>Highlight important KPIs</li>
              </ul>
            </div>

            <div class="mt-8">
              <h3 class="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">🎯 Learning Outcomes</h3>
              <div class="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-100 dark:border-blue-800">
                <p class="text-gray-700 dark:text-gray-300 mb-2 font-medium">After completing this topic, learners will be able to:</p>
                <ul class="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-1">
                  <li>Understand the concept of dashboard-style visualizations</li>
                  <li>Create dashboards using Matplotlib subplots</li>
                  <li>Combine multiple charts for a comprehensive view</li>
                  <li>Design dashboards with clarity and focus on key metrics</li>
                </ul>
              </div>
            </div>
          </div>
        `,
        syntax: [
          {
            title: "Simple Dashboard (Subplots)",
            content: `import matplotlib.pyplot as plt\n\n# Sample data\nmonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May']\nsales = [200, 250, 220, 300, 270]\nexpenses = [150, 180, 160, 200, 190]\nprofit = [50, 70, 60, 100, 80]\n\nfig, axs = plt.subplots(2, 2, figsize=(10,8))\n\n# Line plot: Sales trend\naxs[0, 0].plot(months, sales, marker='o', color='blue')\naxs[0, 0].set_title('Sales Trend')\n\n# Bar plot: Expenses\naxs[0, 1].bar(months, expenses, color='orange')\naxs[0, 1].set_title('Expenses')\n\n# Line plot: Profit\naxs[1, 0].plot(months, profit, marker='o', color='green')\naxs[1, 0].set_title('Profit Trend')\n\n# Hide empty subplot\naxs[1, 1].axis('off')\n\nplt.tight_layout()\nplt.show()`
          },
          {
            title: "Adding Titles & Labels",
            content: `fig, axs = plt.subplots(1, 2, figsize=(12,5))\n\n# Sales\naxs[0].bar(months, sales, color='skyblue')\naxs[0].set_title('Monthly Sales')\naxs[0].set_xlabel('Month')\naxs[0].set_ylabel('Sales')\n\n# Expenses\naxs[1].bar(months, expenses, color='salmon')\naxs[1].set_title('Monthly Expenses')\naxs[1].set_xlabel('Month')\naxs[1].set_ylabel('Expenses')\n\nplt.tight_layout()\nplt.show()`
          }
        ],
        initialCode: `# Example: Dashboard-Style Visualization
import matplotlib.pyplot as plt

# Sample data
months = ['Jan', 'Feb', 'Mar', 'Apr', 'May']
sales = [200, 250, 220, 300, 270]
expenses = [150, 180, 160, 200, 190]
profit = [50, 70, 60, 100, 80]

# Dashboard with subplots
print("Generating Dashboard...")
fig, axs = plt.subplots(2, 2, figsize=(10,8))

# Sales trend
axs[0, 0].plot(months, sales, marker='o', color='blue')
axs[0, 0].set_title('Sales Trend')

# Expenses
axs[0, 1].bar(months, expenses, color='orange')
axs[0, 1].set_title('Expenses')

# Profit
axs[1, 0].plot(months, profit, marker='o', color='green')
axs[1, 0].set_title('Profit Trend')

# Hide empty plot
axs[1, 1].axis('off')

plt.tight_layout()
plt.show()

# 📌 Best Practices
# - Keep dashboards simple, clear, and uncluttered
# - Group related plots together
# - Use consistent colors, fonts, and labels
# - Highlight important KPIs or metrics
# - Use subplots effectively to maximize space`
      },
      {
        title: 'Visualization Best Practices',
        duration: '15 min',
        content: `
          <div class="space-y-6 max-w-4xl mx-auto p-6 font-sans text-gray-800 dark:text-gray-200 leading-relaxed">
            <div class="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 p-4 rounded-r shadow-sm">
              <h2 class="text-2xl font-bold text-blue-800 dark:text-blue-300 mb-2">Why Best Practices Matter</h2>
              <p class="text-gray-700 dark:text-gray-300 text-lg">
                Good data visualization is not just about making charts — it’s about communicating insights clearly and accurately.
                Poor visualization can mislead or confuse the audience, even if the underlying data is correct.
              </p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                <h3 class="text-xl font-semibold text-green-700 dark:text-green-400 mb-3">Key Principles</h3>
                <ul class="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2">
                  <li><strong>Clarity:</strong> Avoid clutter, ensure readability.</li>
                  <li><strong>Accuracy:</strong> Represent data truthfully, avoid distortion.</li>
                  <li><strong>Simplicity:</strong> Keep charts simple, remove unnecessary 3D effects.</li>
                  <li><strong>Consistency:</strong> Use uniform colors and styles.</li>
                  <li><strong>Context:</strong> Provide units, time periods, or references.</li>
                </ul>
              </div>
              <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                <h3 class="text-xl font-semibold text-red-700 dark:text-red-400 mb-3">Common Mistakes</h3>
                <ul class="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2">
                  <li>Overcrowding charts with too many data points</li>
                  <li>Using pie charts for too many categories</li>
                  <li>Inconsistent axis scales</li>
                  <li>Using misleading visuals (e.g., truncated axes)</li>
                  <li>Ignoring accessibility (color blindness)</li>
                </ul>
              </div>
            </div>

            <div class="mt-8">
              <h3 class="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">Best Practices by Plot Type</h3>
              <div class="overflow-x-auto">
                <table class="min-w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <thead class="bg-gray-100 dark:bg-gray-700">
                    <tr>
                      <th class="py-2 px-4 border-b border-gray-200 dark:border-gray-600 text-left text-gray-700 dark:text-gray-200 font-semibold">Plot Type</th>
                      <th class="py-2 px-4 border-b border-gray-200 dark:border-gray-600 text-left text-gray-700 dark:text-gray-200 font-semibold">Best Practices</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr class="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td class="py-2 px-4 border-b border-gray-200 dark:border-gray-600 font-semibold text-blue-600 dark:text-blue-400">Line Chart</td>
                      <td class="py-2 px-4 border-b border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300">Highlight trends clearly; avoid too many lines.</td>
                    </tr>
                    <tr class="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td class="py-2 px-4 border-b border-gray-200 dark:border-gray-600 font-semibold text-blue-600 dark:text-blue-400">Bar Chart</td>
                      <td class="py-2 px-4 border-b border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300">Start axes at zero; use appropriate spacing.</td>
                    </tr>
                    <tr class="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td class="py-2 px-4 border-b border-gray-200 dark:border-gray-600 font-semibold text-blue-600 dark:text-blue-400">Histogram</td>
                      <td class="py-2 px-4 border-b border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300">Choose suitable bin sizes; label axes.</td>
                    </tr>
                    <tr class="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td class="py-2 px-4 border-b border-gray-200 dark:border-gray-600 font-semibold text-blue-600 dark:text-blue-400">Scatter Plot</td>
                      <td class="py-2 px-4 border-b border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300">Use color/size for groups; avoid overplotting.</td>
                    </tr>
                    <tr class="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td class="py-2 px-4 border-b border-gray-200 dark:border-gray-600 font-semibold text-blue-600 dark:text-blue-400">Box Plot</td>
                      <td class="py-2 px-4 border-b border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300">Show outliers; label axes and categories.</td>
                    </tr>
                    <tr class="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td class="py-2 px-4 border-b border-gray-200 dark:border-gray-600 font-semibold text-blue-600 dark:text-blue-400">Heatmap</td>
                      <td class="py-2 px-4 border-b border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300">Use meaningful color palettes; include annotation.</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div class="mt-8">
              <h3 class="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">🎯 Learning Outcomes</h3>
              <div class="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-100 dark:border-blue-800">
                <p class="text-gray-700 dark:text-gray-300 mb-2 font-medium">After completing this topic, learners will be able to:</p>
                <ul class="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-1">
                  <li>Apply best practices in all types of data visualizations</li>
                  <li>Create clear, accurate, and effective plots</li>
                  <li>Design dashboards and charts that communicate insights efficiently</li>
                  <li>Avoid common visualization mistakes that mislead or confuse</li>
                </ul>
              </div>
            </div>
          </div>
        `,
        syntax: [
          {
            title: "Combined Best Practices",
            content: `import matplotlib.pyplot as plt\nimport seaborn as sns\nimport pandas as pd\n\n# Sample data\ndata = {\n    "Month": ['Jan', 'Feb', 'Mar', 'Apr', 'May'],\n    "Sales": [200, 250, 220, 300, 270],\n    "Expenses": [150, 180, 160, 200, 190]\n}\ndf = pd.DataFrame(data)\n\n# Combined plot with best practices\nplt.figure(figsize=(8,5))\nplt.plot(df['Month'], df['Sales'], marker='o', color='blue', label='Sales')\nplt.plot(df['Month'], df['Expenses'], marker='s', color='orange', label='Expenses')\n\nplt.title('Monthly Sales vs Expenses', fontsize=14)\nplt.xlabel('Month', fontsize=12)\nplt.ylabel('Amount', fontsize=12)\nplt.legend()\nplt.grid(True)\nplt.tight_layout()\nplt.show()`
          }
        ],
        initialCode: `# Example: Applying Visualization Best Practices
import matplotlib.pyplot as plt
import seaborn as sns
import pandas as pd

# Sample data
data = {
    "Month": ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
    "Sales": [200, 250, 220, 300, 270],
    "Expenses": [150, 180, 160, 200, 190]
}
df = pd.DataFrame(data)

# Line chart applying best practices
print("Generating Best Practices Line Chart...")
plt.figure(figsize=(8,5))
plt.plot(df['Month'], df['Sales'], marker='o', color='blue', label='Sales')
plt.plot(df['Month'], df['Expenses'], marker='s', color='orange', label='Expenses')

plt.title('Monthly Sales vs Expenses', fontsize=14)
plt.xlabel('Month', fontsize=12)
plt.ylabel('Amount', fontsize=12)
plt.legend()
plt.grid(True)
plt.tight_layout()
plt.show()

# Seaborn example with good practices
print("Generating Best Practices Bar Chart...")
sns.barplot(x='Month', y='Sales', data=df, palette='pastel')
plt.title('Monthly Sales', fontsize=14)
plt.xlabel('Month')
plt.ylabel('Sales')
plt.show()

# 📌 Key Takeaways
# - Clear, accurate, and simple visuals enhance understanding
# - Label axes, titles, and legends consistently
# - Choose chart types appropriate for the data and audience
# - Avoid clutter and focus on key insights`
      }
    ]
  },
  {
    id: 'module-8',
    title: 'Module 8 — Introduction to Machine Learning',
    duration: '2 weeks',
    description: 'Understand the basics of ML, types of learning, and simple algorithms.',
    lessons: [
      {
        title: 'Basics of Machine Learning',
        duration: '25 min',
        content: `
          <div class="space-y-6 max-w-4xl mx-auto p-6 font-sans text-gray-800 dark:text-gray-200 leading-relaxed">
            <div class="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 p-4 rounded-r shadow-sm">
              <h2 class="text-2xl font-bold text-blue-800 dark:text-blue-300 mb-2">What is Machine Learning?</h2>
              <p class="text-gray-700 dark:text-gray-300 text-lg">
                Machine Learning (ML) is a subset of Artificial Intelligence (AI) that enables systems to learn from data and improve from experience without being explicitly programmed.
              </p>
              <p class="mt-2 text-gray-600 dark:text-gray-400">Instead of writing rules, we feed data to algorithms to build models.</p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                <h3 class="text-xl font-semibold text-green-700 dark:text-green-400 mb-3">Traditional Programming</h3>
                <ul class="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2">
                  <li><strong>Input:</strong> Data + Rules</li>
                  <li><strong>Output:</strong> Answers</li>
                  <li><strong>Logic:</strong> Explicitly coded (If-Else)</li>
                  <li><strong>Best for:</strong> Deterministic tasks</li>
                </ul>
              </div>
              <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                <h3 class="text-xl font-semibold text-purple-700 dark:text-purple-400 mb-3">Machine Learning</h3>
                <ul class="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2">
                  <li><strong>Input:</strong> Data + Answers</li>
                  <li><strong>Output:</strong> Rules (Model)</li>
                  <li><strong>Logic:</strong> Learned patterns</li>
                  <li><strong>Best for:</strong> Complex/Probabilistic tasks</li>
                </ul>
              </div>
            </div>

            <div class="mt-8">
              <h3 class="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">The Machine Learning Workflow</h3>
              <div class="bg-gray-50 dark:bg-gray-700/50 p-6 rounded-lg border border-gray-200 dark:border-gray-600">
                <ol class="list-decimal list-inside space-y-3 text-gray-700 dark:text-gray-300 text-lg">
                  <li><span class="font-semibold text-blue-600 dark:text-blue-400">Data Collection:</span> Gathering relevant data.</li>
                  <li><span class="font-semibold text-blue-600 dark:text-blue-400">Data Preparation:</span> Cleaning and formatting data.</li>
                  <li><span class="font-semibold text-blue-600 dark:text-blue-400">Model Training:</span> Feeding data to an algorithm.</li>
                  <li><span class="font-semibold text-blue-600 dark:text-blue-400">Model Evaluation:</span> Testing accuracy with new data.</li>
                  <li><span class="font-semibold text-blue-600 dark:text-blue-400">Prediction:</span> Using the model for insights.</li>
                </ol>
              </div>
            </div>

            <div class="mt-8">
              <h3 class="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">Benefits and Limitations</h3>
              <div class="overflow-x-auto">
                <table class="min-w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <thead class="bg-gray-100 dark:bg-gray-700">
                    <tr>
                      <th class="py-2 px-4 border-b border-gray-200 dark:border-gray-600 text-left text-gray-700 dark:text-gray-200 font-semibold">Pros</th>
                      <th class="py-2 px-4 border-b border-gray-200 dark:border-gray-600 text-left text-gray-700 dark:text-gray-200 font-semibold">Cons</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr class="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td class="py-2 px-4 border-b border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300">Handles large/complex data</td>
                      <td class="py-2 px-4 border-b border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300">Requires high-quality data</td>
                    </tr>
                    <tr class="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td class="py-2 px-4 border-b border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300">Automates decision making</td>
                      <td class="py-2 px-4 border-b border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300">Can be computationally expensive</td>
                    </tr>
                    <tr class="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td class="py-2 px-4 border-b border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300">Continuous improvement</td>
                      <td class="py-2 px-4 border-b border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300">"Black box" nature (hard to interpret)</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            
            <div class="mt-8">
              <h3 class="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">🎯 Learning Outcomes</h3>
              <div class="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-100 dark:border-blue-800">
                <p class="text-gray-700 dark:text-gray-300 mb-2 font-medium">After completing this topic, learners will be able to:</p>
                <ul class="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-1">
                  <li>Define Machine Learning and its relationship to AI</li>
                  <li>Explain the basic ML workflow from data to prediction</li>
                  <li>Differentiate between traditional programming and ML</li>
                  <li>Recognize common real-world applications of ML</li>
                </ul>
              </div>
            </div>
          </div>
        `,
        syntax: [
          {
            title: "Basic ML Workflow",
            content: `# Example: Predicting outcomes using ML conceptually 
            
# Step 1: Import libraries 
from sklearn.model_selection import train_test_split 
from sklearn.linear_model import LinearRegression 

# Step 2: Sample data 
X = [[1], [2], [3], [4], [5]]  # Feature: Hours studied 
y = [10, 20, 30, 40, 50]       # Output: Scores 

# Step 3: Split data 
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2) 

# Step 4: Train model 
model = LinearRegression() 
model.fit(X_train, y_train) 

# Step 5: Make prediction 
predicted = model.predict(X_test) 
print("Predicted Scores:", predicted)`
          }
        ],
        initialCode: `# Example: Basics of Machine Learning (Linear Regression)
import numpy as np
from sklearn.linear_model import LinearRegression
import matplotlib.pyplot as plt

# 1. Prepare Data
# Feature: Hours Studied (reshaped for sklearn)
X = np.array([1, 2, 3, 4, 5, 6, 7, 8]).reshape(-1, 1)
# Target: Exam Score
y = np.array([15, 25, 35, 45, 55, 65, 75, 85])

print("Data Prepared:")
print("Hours:", X.flatten())
print("Scores:", y)

# 2. Train Model
print("\\nTraining Linear Regression Model...")
model = LinearRegression()
model.fit(X, y)

# 3. Make Predictions
hours_to_predict = np.array([[9], [10]])
predictions = model.predict(hours_to_predict)

print(f"Prediction for 9 hours: {predictions[0]:.2f}")
print(f"Prediction for 10 hours: {predictions[1]:.2f}")

# 4. Visualize
print("\\nGenerating Visualization...")
plt.scatter(X, y, color='blue', label='Actual Data')
plt.plot(X, model.predict(X), color='red', label='Regression Line')
plt.scatter(hours_to_predict, predictions, color='green', marker='x', s=100, label='Predictions')
plt.title('Hours Studied vs Exam Score')
plt.xlabel('Hours Studied')
plt.ylabel('Score')
plt.legend()
plt.show()

# 📌 Key Takeaways
# - ML models learn patterns from data (Input -> Output)
# - Linear Regression finds the best-fitting line
# - We can use the trained model to predict future values`
      },
      {
        title: 'Types of Machine Learning',
        duration: '20 min',
        content: `
          <div class="space-y-6 max-w-4xl mx-auto p-6 font-sans text-gray-800 dark:text-gray-200 leading-relaxed">
            <div class="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 p-4 rounded-r shadow-sm">
              <h2 class="text-2xl font-bold text-blue-800 dark:text-blue-300 mb-2">Machine Learning Categories</h2>
              <p class="text-gray-700 dark:text-gray-300 text-lg">
                Machine Learning (ML) can be broadly classified into three main types based on the nature of data and the learning process:
                Supervised Learning, Unsupervised Learning, and Reinforcement Learning.
              </p>
            </div>

            <div class="space-y-6 mt-6">
              <!-- Supervised Learning -->
              <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                <h3 class="text-xl font-semibold text-green-700 dark:text-green-400 mb-3">1. Supervised Learning</h3>
                <p class="text-gray-700 dark:text-gray-300 mb-2">
                  <strong>Definition:</strong> The model is trained on a labeled dataset, meaning the input data is paired with the correct output.
                  The model learns the mapping from input to output to make predictions.
                </p>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div>
                    <h4 class="font-semibold text-gray-800 dark:text-gray-200">Key Points:</h4>
                    <ul class="list-disc list-inside text-gray-600 dark:text-gray-300 text-sm">
                      <li>Uses input-output pairs</li>
                      <li>Goal: Predict outcomes for new/unseen data</li>
                    </ul>
                  </div>
                  <div>
                    <h4 class="font-semibold text-gray-800 dark:text-gray-200">Example Use Cases:</h4>
                    <ul class="list-disc list-inside text-gray-600 dark:text-gray-300 text-sm">
                      <li>Predicting house prices (Regression)</li>
                      <li>Email spam detection (Classification)</li>
                      <li>Student score prediction</li>
                    </ul>
                  </div>
                </div>
                <p class="mt-3 text-sm text-gray-500 dark:text-gray-400"><strong>Common Algorithms:</strong> Linear Regression, Logistic Regression, Decision Trees, Random Forests</p>
              </div>

              <!-- Unsupervised Learning -->
              <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                <h3 class="text-xl font-semibold text-purple-700 dark:text-purple-400 mb-3">2. Unsupervised Learning</h3>
                <p class="text-gray-700 dark:text-gray-300 mb-2">
                  <strong>Definition:</strong> The model is trained on unlabeled data, meaning there is no predefined output.
                  The goal is to identify patterns, clusters, or relationships in the data.
                </p>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div>
                    <h4 class="font-semibold text-gray-800 dark:text-gray-200">Key Points:</h4>
                    <ul class="list-disc list-inside text-gray-600 dark:text-gray-300 text-sm">
                      <li>No target variable</li>
                      <li>Goal: Find hidden structure or groupings</li>
                    </ul>
                  </div>
                  <div>
                    <h4 class="font-semibold text-gray-800 dark:text-gray-200">Example Use Cases:</h4>
                    <ul class="list-disc list-inside text-gray-600 dark:text-gray-300 text-sm">
                      <li>Customer segmentation</li>
                      <li>Fraud detection (Anomaly Detection)</li>
                      <li>Dimensionality reduction</li>
                    </ul>
                  </div>
                </div>
                <p class="mt-3 text-sm text-gray-500 dark:text-gray-400"><strong>Common Algorithms:</strong> K-Means Clustering, Hierarchical Clustering, PCA</p>
              </div>

              <!-- Reinforcement Learning -->
              <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                <h3 class="text-xl font-semibold text-orange-700 dark:text-orange-400 mb-3">3. Reinforcement Learning</h3>
                <p class="text-gray-700 dark:text-gray-300 mb-2">
                  <strong>Definition:</strong> The model learns by interacting with the environment and receiving rewards or penalties based on actions.
                  Focuses on learning strategies to maximize cumulative rewards.
                </p>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div>
                    <h4 class="font-semibold text-gray-800 dark:text-gray-200">Key Points:</h4>
                    <ul class="list-disc list-inside text-gray-600 dark:text-gray-300 text-sm">
                      <li>Uses trial and error</li>
                      <li>Reward-based learning</li>
                    </ul>
                  </div>
                  <div>
                    <h4 class="font-semibold text-gray-800 dark:text-gray-200">Example Use Cases:</h4>
                    <ul class="list-disc list-inside text-gray-600 dark:text-gray-300 text-sm">
                      <li>Robotics (navigation)</li>
                      <li>Game AI (Chess, Go)</li>
                      <li>Self-driving cars</li>
                    </ul>
                  </div>
                </div>
                <p class="mt-3 text-sm text-gray-500 dark:text-gray-400"><strong>Common Algorithms:</strong> Q-Learning, Deep Q-Networks (DQN)</p>
              </div>
            </div>

            <div class="mt-8">
              <h3 class="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">Summary Comparison</h3>
              <div class="overflow-x-auto">
                <table class="min-w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <thead class="bg-gray-100 dark:bg-gray-700">
                    <tr>
                      <th class="py-2 px-4 border-b border-gray-200 dark:border-gray-600 text-left text-gray-700 dark:text-gray-200 font-semibold">Type</th>
                      <th class="py-2 px-4 border-b border-gray-200 dark:border-gray-600 text-left text-gray-700 dark:text-gray-200 font-semibold">Data Type</th>
                      <th class="py-2 px-4 border-b border-gray-200 dark:border-gray-600 text-left text-gray-700 dark:text-gray-200 font-semibold">Goal</th>
                      <th class="py-2 px-4 border-b border-gray-200 dark:border-gray-600 text-left text-gray-700 dark:text-gray-200 font-semibold">Example Algorithms</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr class="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td class="py-2 px-4 border-b border-gray-200 dark:border-gray-600 font-medium text-gray-800 dark:text-gray-200">Supervised</td>
                      <td class="py-2 px-4 border-b border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300">Labeled</td>
                      <td class="py-2 px-4 border-b border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300">Predict outputs</td>
                      <td class="py-2 px-4 border-b border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300">Linear Regression, Decision Tree</td>
                    </tr>
                    <tr class="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td class="py-2 px-4 border-b border-gray-200 dark:border-gray-600 font-medium text-gray-800 dark:text-gray-200">Unsupervised</td>
                      <td class="py-2 px-4 border-b border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300">Unlabeled</td>
                      <td class="py-2 px-4 border-b border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300">Find patterns/clusters</td>
                      <td class="py-2 px-4 border-b border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300">K-Means, PCA</td>
                    </tr>
                    <tr class="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td class="py-2 px-4 border-b border-gray-200 dark:border-gray-600 font-medium text-gray-800 dark:text-gray-200">Reinforcement</td>
                      <td class="py-2 px-4 border-b border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300">Environment</td>
                      <td class="py-2 px-4 border-b border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300">Learn optimal strategy</td>
                      <td class="py-2 px-4 border-b border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300">Q-Learning, DQN</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div class="mt-6">
              <h3 class="text-lg font-bold text-gray-800 dark:text-gray-100 mb-2">Best Practices</h3>
              <ul class="list-disc list-inside text-gray-600 dark:text-gray-300">
                <li>Use supervised learning when labeled data is available</li>
                <li>Use unsupervised learning to discover hidden patterns</li>
                <li>Use reinforcement learning for dynamic decision-making tasks</li>
                <li>Understand the problem type before choosing an algorithm</li>
              </ul>
            </div>
            
            <div class="mt-8">
              <h3 class="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">🎯 Learning Outcomes</h3>
              <div class="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-100 dark:border-blue-800">
                <p class="text-gray-700 dark:text-gray-300 mb-2 font-medium">After completing this topic, learners will be able to:</p>
                <ul class="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-1">
                  <li>Identify types of machine learning</li>
                  <li>Distinguish between supervised, unsupervised, and reinforcement learning</li>
                  <li>Understand when to use each type</li>
                  <li>Apply basic Python examples for supervised and unsupervised learning</li>
                </ul>
              </div>
            </div>
          </div>
        `,
        syntax: [
          {
            title: "Supervised vs Unsupervised",
            content: `# Supervised Learning Example (Linear Regression) 
from sklearn.linear_model import LinearRegression 

# Labeled data: Hours studied -> Scores 
X = [[1], [2], [3], [4], [5]] 
y = [10, 20, 30, 40, 50] 

model = LinearRegression() 
model.fit(X, y) 
predicted = model.predict([[6]]) 
print("Predicted Score:", predicted) 

# Unsupervised Learning Example (K-Means Clustering) 
from sklearn.cluster import KMeans 

# Unlabeled data: Customer spending 
data = [[5, 200], [6, 220], [8, 280], [9, 300], [3, 150]] 
kmeans = KMeans(n_clusters=2, random_state=42) 
kmeans.fit(data) 
print("Cluster Labels:", kmeans.labels_)`
          }
        ],
        initialCode: `# Example: Types of Machine Learning (Supervised vs Unsupervised)
from sklearn.linear_model import LinearRegression
from sklearn.cluster import KMeans
import numpy as np

# --- 1. Supervised Learning ---
print("--- Supervised Learning (Linear Regression) ---")
# Feature: Hours studied
X = [[1], [2], [3], [4], [5]]
# Target: Scores
y = [10, 20, 30, 40, 50]

model = LinearRegression()
model.fit(X, y)

# Predict for 6 hours
predicted = model.predict([[6]])
print(f"Input: 6 hours -> Predicted Score: {predicted[0]:.2f}")
print("Note: The model learned the pattern (Score = Hours * 10)")

print("\\n" + "="*40 + "\\n")

# --- 2. Unsupervised Learning ---
print("--- Unsupervised Learning (K-Means Clustering) ---")
# Unlabeled data: [Transactions, Spending]
data = [[5, 200], [6, 220], [8, 280], [9, 300], [3, 150]]
print(f"Data Points: {data}")

kmeans = KMeans(n_clusters=2, random_state=42, n_init=10)
kmeans.fit(data)

print("Cluster Labels:", kmeans.labels_)
print("Note: The model grouped data into 2 clusters without knowing 'correct' answers")

# 📌 Key Takeaways
# - Supervised: Learned from labeled pairs (Hours -> Score)
# - Unsupervised: Found groups in raw data (Clustering)`
      },
      {
        title: 'Supervised Learning Concepts',
        duration: '25 min',
        content: `
          <div class="space-y-6 max-w-4xl mx-auto p-6 font-sans text-gray-800 dark:text-gray-200 leading-relaxed">
            <div class="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 p-4 rounded-r shadow-sm">
              <h2 class="text-2xl font-bold text-blue-800 dark:text-blue-300 mb-2">What is Supervised Learning?</h2>
              <p class="text-gray-700 dark:text-gray-300 text-lg">
                Supervised Learning is a type of machine learning where the algorithm is trained on labeled data, meaning each input comes with a known output.
              </p>
              <p class="mt-2 text-gray-600 dark:text-gray-400">The model learns the relationship between input features and target output. <strong>Goal:</strong> Predict outputs for new/unseen data.</p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                <h3 class="text-xl font-semibold text-green-700 dark:text-green-400 mb-3">Key Concepts</h3>
                <ul class="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-3">
                  <li><strong>Features (Independent Variables):</strong> The input data used for prediction (e.g., Hours studied, Age).</li>
                  <li><strong>Target/Label (Dependent Variable):</strong> The output we want to predict (e.g., Exam scores, Salary).</li>
                  <li><strong>Training Data:</strong> The dataset used to train the model.</li>
                  <li><strong>Test Data:</strong> Separate dataset used to evaluate model performance.</li>
                </ul>
              </div>
              <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                <h3 class="text-xl font-semibold text-purple-700 dark:text-purple-400 mb-3">Steps in Supervised Learning</h3>
                <ol class="list-decimal list-inside text-gray-600 dark:text-gray-300 space-y-2">
                  <li><strong>Collect Data:</strong> Ensure it is labeled.</li>
                  <li><strong>Preprocess Data:</strong> Handle missing values, encode categories.</li>
                  <li><strong>Split Data:</strong> Training and testing sets.</li>
                  <li><strong>Select Model:</strong> Choose algorithm based on problem.</li>
                  <li><strong>Train Model:</strong> Fit model on training data.</li>
                  <li><strong>Evaluate Model:</strong> Check accuracy on test data.</li>
                  <li><strong>Make Predictions:</strong> Use model on new/unseen data.</li>
                </ol>
              </div>
            </div>

            <div class="mt-8">
              <h3 class="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">Common Algorithms</h3>
              <div class="overflow-x-auto">
                <table class="min-w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <thead class="bg-gray-100 dark:bg-gray-700">
                    <tr>
                      <th class="py-2 px-4 border-b border-gray-200 dark:border-gray-600 text-left text-gray-700 dark:text-gray-200 font-semibold">Algorithm</th>
                      <th class="py-2 px-4 border-b border-gray-200 dark:border-gray-600 text-left text-gray-700 dark:text-gray-200 font-semibold">Use Case</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr class="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td class="py-2 px-4 border-b border-gray-200 dark:border-gray-600 font-medium text-blue-600 dark:text-blue-400">Linear Regression</td>
                      <td class="py-2 px-4 border-b border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300">Predict continuous values</td>
                    </tr>
                    <tr class="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td class="py-2 px-4 border-b border-gray-200 dark:border-gray-600 font-medium text-blue-600 dark:text-blue-400">Logistic Regression</td>
                      <td class="py-2 px-4 border-b border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300">Predict binary outcomes</td>
                    </tr>
                    <tr class="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td class="py-2 px-4 border-b border-gray-200 dark:border-gray-600 font-medium text-blue-600 dark:text-blue-400">Decision Trees</td>
                      <td class="py-2 px-4 border-b border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300">Classification & regression</td>
                    </tr>
                    <tr class="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td class="py-2 px-4 border-b border-gray-200 dark:border-gray-600 font-medium text-blue-600 dark:text-blue-400">Random Forest</td>
                      <td class="py-2 px-4 border-b border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300">Ensemble method for better accuracy</td>
                    </tr>
                    <tr class="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td class="py-2 px-4 border-b border-gray-200 dark:border-gray-600 font-medium text-blue-600 dark:text-blue-400">SVM</td>
                      <td class="py-2 px-4 border-b border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300">Classification problems</td>
                    </tr>
                    <tr class="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td class="py-2 px-4 border-b border-gray-200 dark:border-gray-600 font-medium text-blue-600 dark:text-blue-400">KNN</td>
                      <td class="py-2 px-4 border-b border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300">Classification & regression</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div class="mt-6">
              <h3 class="text-lg font-bold text-gray-800 dark:text-gray-100 mb-2">Best Practices</h3>
              <ul class="list-disc list-inside text-gray-600 dark:text-gray-300">
                <li>Always split data into training and test sets</li>
                <li>Start with simple models before moving to complex ones</li>
                <li>Preprocess data carefully: handle missing values, scale features</li>
                <li>Evaluate using appropriate metrics: Accuracy, RMSE, MAE, etc.</li>
              </ul>
            </div>
            
            <div class="mt-8">
              <h3 class="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">🎯 Learning Outcomes</h3>
              <div class="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-100 dark:border-blue-800">
                <p class="text-gray-700 dark:text-gray-300 mb-2 font-medium">After completing this topic, learners will be able to:</p>
                <ul class="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-1">
                  <li>Understand supervised learning concepts</li>
                  <li>Identify features and target variables</li>
                  <li>Train and evaluate a basic supervised learning model</li>
                  <li>Recognize common algorithms and their applications</li>
                </ul>
              </div>
            </div>
          </div>
        `,
        syntax: [
          {
            title: "Linear Regression Example",
            content: `from sklearn.model_selection import train_test_split 
from sklearn.linear_model import LinearRegression 

# Sample dataset: Hours studied -> Scores 
X = [[1], [2], [3], [4], [5]]  # Feature 
y = [10, 20, 30, 40, 50]       # Target 

# Split data 
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42) 

# Train model 
model = LinearRegression() 
model.fit(X_train, y_train) 

# Make predictions 
predicted = model.predict(X_test) 
print("Predicted Scores:", predicted) 

# Evaluate model 
accuracy = model.score(X_test, y_test) 
print("Model Accuracy:", accuracy)`
          }
        ],
        initialCode: `# Example: Supervised Learning (Linear Regression)
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
import numpy as np

# 1. Dataset: Hours studied vs Scores
# Features (X) must be 2D array
X = [[1], [2], [3], [4], [5], [6], [7], [8]]
# Target (y) is 1D array
y = [10, 20, 30, 40, 50, 60, 70, 80]

print("Dataset created.")
print(f"X (Hours): {X}")
print(f"y (Scores): {y}")

# 2. Split into training and test sets
# test_size=0.2 means 20% data for testing
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

print("\\nData Split:")
print(f"Training set size: {len(X_train)}")
print(f"Test set size: {len(X_test)}")

# 3. Train Linear Regression model
print("\\nTraining Model...")
model = LinearRegression()
model.fit(X_train, y_train)

# 4. Predict scores
print("Predicting on Test Set...")
predicted = model.predict(X_test)
print(f"Test Input: {X_test}")
print(f"Predicted Scores: {predicted}")
print(f"Actual Scores: {y_test}")

# 5. Evaluate accuracy
# For Linear Regression, score() returns R^2
accuracy = model.score(X_test, y_test)
print(f"Model Accuracy (R^2 Score): {accuracy:.2f}")

# 📌 Key Takeaways
# - Splitting data ensures we test on unseen examples
# - model.fit() trains the algorithm
# - model.predict() generates outputs for new data`
      },
      {
        title: 'Unsupervised Learning Concepts',
        duration: '25 min',
        content: `
          <div class="space-y-6 max-w-4xl mx-auto p-6 font-sans text-gray-800 dark:text-gray-200 leading-relaxed">
            <div class="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 p-4 rounded-r shadow-sm">
              <h2 class="text-2xl font-bold text-blue-800 dark:text-blue-300 mb-2">What is Unsupervised Learning?</h2>
              <p class="text-gray-700 dark:text-gray-300 text-lg">
                Unsupervised Learning is a type of machine learning where the algorithm is trained on unlabeled data, meaning there is no predefined output.
              </p>
              <p class="mt-2 text-gray-600 dark:text-gray-400">The goal is to discover hidden patterns, structures, or groupings in the data. Often used for exploration and clustering.</p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                <h3 class="text-xl font-semibold text-purple-700 dark:text-purple-400 mb-3">Key Concepts</h3>
                <ul class="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-3">
                  <li><strong>Features (Independent Variables):</strong> Input data used to detect patterns.</li>
                  <li><strong>Clusters or Groups:</strong> The output is not labeled; the algorithm identifies natural groupings.</li>
                  <li><strong>Dimensionality Reduction:</strong> Simplifies data by reducing the number of features while retaining important information.</li>
                  <li><strong>Distance/Similarity Measures:</strong> Algorithms use distance metrics (like Euclidean distance) to find clusters.</li>
                </ul>
              </div>
              <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                <h3 class="text-xl font-semibold text-green-700 dark:text-green-400 mb-3">Steps in Unsupervised Learning</h3>
                <ol class="list-decimal list-inside text-gray-600 dark:text-gray-300 space-y-2">
                  <li><strong>Collect Data:</strong> Unlabeled dataset.</li>
                  <li><strong>Preprocess Data:</strong> Handle missing values, normalize features.</li>
                  <li><strong>Choose Algorithm:</strong> Clustering or dimensionality reduction.</li>
                  <li><strong>Train Model:</strong> Fit the algorithm to the data.</li>
                  <li><strong>Analyze Patterns:</strong> Interpret clusters, reduced dimensions, or associations.</li>
                </ol>
              </div>
            </div>

            <div class="mt-8">
              <h3 class="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">Common Algorithms</h3>
              <div class="overflow-x-auto">
                <table class="min-w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <thead class="bg-gray-100 dark:bg-gray-700">
                    <tr>
                      <th class="py-2 px-4 border-b border-gray-200 dark:border-gray-600 text-left text-gray-700 dark:text-gray-200 font-semibold">Algorithm</th>
                      <th class="py-2 px-4 border-b border-gray-200 dark:border-gray-600 text-left text-gray-700 dark:text-gray-200 font-semibold">Use Case</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr class="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td class="py-2 px-4 border-b border-gray-200 dark:border-gray-600 font-medium text-purple-600 dark:text-purple-400">K-Means Clustering</td>
                      <td class="py-2 px-4 border-b border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300">Grouping similar data points</td>
                    </tr>
                    <tr class="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td class="py-2 px-4 border-b border-gray-200 dark:border-gray-600 font-medium text-purple-600 dark:text-purple-400">Hierarchical Clustering</td>
                      <td class="py-2 px-4 border-b border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300">Nested clusters visualization</td>
                    </tr>
                    <tr class="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td class="py-2 px-4 border-b border-gray-200 dark:border-gray-600 font-medium text-purple-600 dark:text-purple-400">DBSCAN</td>
                      <td class="py-2 px-4 border-b border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300">Density-based clustering</td>
                    </tr>
                    <tr class="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td class="py-2 px-4 border-b border-gray-200 dark:border-gray-600 font-medium text-purple-600 dark:text-purple-400">PCA</td>
                      <td class="py-2 px-4 border-b border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300">Reducing feature dimensions</td>
                    </tr>
                    <tr class="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td class="py-2 px-4 border-b border-gray-200 dark:border-gray-600 font-medium text-purple-600 dark:text-purple-400">Autoencoders</td>
                      <td class="py-2 px-4 border-b border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300">Feature extraction, compression</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div class="mt-6">
              <h3 class="text-lg font-bold text-gray-800 dark:text-gray-100 mb-2">Applications</h3>
              <ul class="list-disc list-inside text-gray-600 dark:text-gray-300 grid grid-cols-1 md:grid-cols-2 gap-2">
                <li><strong>Customer Segmentation:</strong> Group customers by behavior</li>
                <li><strong>Market Basket Analysis:</strong> Find products bought together</li>
                <li><strong>Anomaly Detection:</strong> Detect unusual transactions (fraud)</li>
                <li><strong>Data Compression:</strong> Reduce high-dimensional data (PCA)</li>
              </ul>
            </div>

            <div class="mt-6">
              <h3 class="text-lg font-bold text-gray-800 dark:text-gray-100 mb-2">Best Practices</h3>
              <ul class="list-disc list-inside text-gray-600 dark:text-gray-300">
                <li>Scale or normalize features for better clustering results</li>
                <li>Choose the number of clusters wisely (e.g., Elbow Method)</li>
                <li>Visualize clusters using scatter plots or dimensionality reduction</li>
                <li>Use unsupervised learning for exploration or pattern discovery, not direct prediction</li>
              </ul>
            </div>
            
            <div class="mt-8">
              <h3 class="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">🎯 Learning Outcomes</h3>
              <div class="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-100 dark:border-blue-800">
                <p class="text-gray-700 dark:text-gray-300 mb-2 font-medium">After completing this topic, learners will be able to:</p>
                <ul class="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-1">
                  <li>Understand unsupervised learning concepts</li>
                  <li>Apply clustering algorithms like K-Means</li>
                  <li>Analyze patterns and groupings in unlabeled data</li>
                  <li>Understand applications like segmentation and anomaly detection</li>
                </ul>
              </div>
            </div>
          </div>
        `,
        syntax: [
          {
            title: "K-Means Clustering Example",
            content: `from sklearn.cluster import KMeans 
import numpy as np 

# Sample data: Customers [Age, Annual Spending] 
data = np.array([[25, 50000], [30, 60000], [22, 52000], 
                 [35, 70000], [28, 58000], [40, 80000]]) 

# Create KMeans model with 2 clusters 
kmeans = KMeans(n_clusters=2, random_state=42) 
kmeans.fit(data) 

# Cluster labels for each point 
labels = kmeans.labels_ 
print("Cluster Labels:", labels) 

# Cluster centers 
centers = kmeans.cluster_centers_ 
print("Cluster Centers:\\n", centers)`
          }
        ],
        initialCode: `# Example: Unsupervised Learning (K-Means Clustering)
from sklearn.cluster import KMeans
import numpy as np

# 1. Customer data: [Age, Annual Spending]
# Unlabeled data - we don't know who is a "High Spender" vs "Low Spender"
data = np.array([
    [25, 50000], 
    [30, 60000], 
    [22, 52000], 
    [35, 70000], 
    [28, 58000], 
    [40, 80000]
])

print("Customer Data (Age, Spending):")
print(data)

# 2. KMeans Clustering
# We want to group them into 2 clusters
print("\\nInitializing K-Means with 2 clusters...")
# n_init=10 is a best practice to avoid warnings in newer sklearn versions
kmeans = KMeans(n_clusters=2, random_state=42, n_init=10)

# 3. Train Model
kmeans.fit(data)

# 4. Results
print("\\n--- Results ---")
print("Cluster Labels (0 or 1 for each customer):")
print(kmeans.labels_)

print("\\nCluster Centers (Average Age & Spending for each group):")
print(kmeans.cluster_centers_)

# 📌 Interpretation
# The algorithm likely grouped customers into:
# - Lower spending / younger
# - Higher spending / older
# This is done purely based on data patterns!`
      },
      {
        title: 'Common Machine Learning Terminology',
        duration: '25 min',
        content: `
          <div class="space-y-6 max-w-4xl mx-auto p-6 font-sans text-gray-800 dark:text-gray-200 leading-relaxed">
            <div class="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 p-4 rounded-r shadow-sm">
              <h2 class="text-2xl font-bold text-blue-800 dark:text-blue-300 mb-2">Key Machine Learning Terms</h2>
              <p class="text-gray-700 dark:text-gray-300 text-lg">
                Machine learning has its own set of key terms that are important to understand before building models.
              </p>
            </div>

            <div class="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                <h3 class="font-bold text-lg text-blue-600 dark:text-blue-400 mb-2">1. Dataset</h3>
                <p class="text-gray-600 dark:text-gray-300 text-sm">A collection of data used for training or testing a model. Can be structured (tables), unstructured (images, text), or semi-structured (JSON, XML).</p>
              </div>
              <div class="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                <h3 class="font-bold text-lg text-blue-600 dark:text-blue-400 mb-2">2. Feature / Attribute</h3>
                <p class="text-gray-600 dark:text-gray-300 text-sm">An input variable used by the model to make predictions. Example: In house price prediction, features = size, location, number of bedrooms.</p>
              </div>
              <div class="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                <h3 class="font-bold text-lg text-blue-600 dark:text-blue-400 mb-2">3. Target / Label</h3>
                <p class="text-gray-600 dark:text-gray-300 text-sm">The output variable we want to predict. Example: House price in the same prediction problem.</p>
              </div>
              <div class="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                <h3 class="font-bold text-lg text-blue-600 dark:text-blue-400 mb-2">4. Training Set</h3>
                <p class="text-gray-600 dark:text-gray-300 text-sm">Portion of the dataset used to train the model. The model learns patterns from this data.</p>
              </div>
              <div class="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                <h3 class="font-bold text-lg text-blue-600 dark:text-blue-400 mb-2">5. Test Set</h3>
                <p class="text-gray-600 dark:text-gray-300 text-sm">Portion of the dataset used to evaluate model performance on unseen data.</p>
              </div>
              <div class="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                <h3 class="font-bold text-lg text-blue-600 dark:text-blue-400 mb-2">6. Overfitting</h3>
                <p class="text-gray-600 dark:text-gray-300 text-sm">When a model performs very well on training data but poorly on new data. Usually caused by a too complex model.</p>
              </div>
              <div class="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                <h3 class="font-bold text-lg text-blue-600 dark:text-blue-400 mb-2">7. Underfitting</h3>
                <p class="text-gray-600 dark:text-gray-300 text-sm">When a model fails to capture patterns in the training data. Usually caused by a too simple model.</p>
              </div>
              <div class="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                <h3 class="font-bold text-lg text-blue-600 dark:text-blue-400 mb-2">8. Accuracy</h3>
                <p class="text-gray-600 dark:text-gray-300 text-sm">Measure of how many predictions are correct. Important for classification problems.</p>
              </div>
              <div class="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                <h3 class="font-bold text-lg text-blue-600 dark:text-blue-400 mb-2">9. Precision & Recall</h3>
                <p class="text-gray-600 dark:text-gray-300 text-sm">Precision: Out of predicted positives, how many are actually positive. Recall: Out of actual positives, how many did the model identify correctly.</p>
              </div>
              <div class="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                <h3 class="font-bold text-lg text-blue-600 dark:text-blue-400 mb-2">10. Loss / Cost Function</h3>
                <p class="text-gray-600 dark:text-gray-300 text-sm">A function that measures error between predicted and actual values. Goal: Minimize loss during training.</p>
              </div>
              <div class="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                <h3 class="font-bold text-lg text-blue-600 dark:text-blue-400 mb-2">11. Epoch</h3>
                <p class="text-gray-600 dark:text-gray-300 text-sm">One complete pass of the training dataset through the learning algorithm.</p>
              </div>
              <div class="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                <h3 class="font-bold text-lg text-blue-600 dark:text-blue-400 mb-2">12. Hyperparameters</h3>
                <p class="text-gray-600 dark:text-gray-300 text-sm">Settings configured before training, like learning rate, number of trees, or layers in neural networks.</p>
              </div>
              <div class="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                <h3 class="font-bold text-lg text-blue-600 dark:text-blue-400 mb-2">13. Model Evaluation Metrics</h3>
                <p class="text-gray-600 dark:text-gray-300 text-sm">Regression: MAE, MSE, RMSE, R². Classification: Accuracy, Precision, Recall, F1-score.</p>
              </div>
              <div class="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                <h3 class="font-bold text-lg text-blue-600 dark:text-blue-400 mb-2">14. Cross-Validation</h3>
                <p class="text-gray-600 dark:text-gray-300 text-sm">Technique to evaluate model performance on multiple data splits to avoid overfitting.</p>
              </div>
              <div class="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                <h3 class="font-bold text-lg text-blue-600 dark:text-blue-400 mb-2">15. Feature Engineering</h3>
                <p class="text-gray-600 dark:text-gray-300 text-sm">Process of creating new features or transforming existing ones to improve model performance.</p>
              </div>
            </div>

            <div class="mt-6">
              <h3 class="text-lg font-bold text-gray-800 dark:text-gray-100 mb-2">Best Practices</h3>
              <ul class="list-disc list-inside text-gray-600 dark:text-gray-300">
                <li>Always understand key terms before training models</li>
                <li>Track accuracy and loss to evaluate performance</li>
                <li>Use cross-validation to reduce overfitting</li>
                <li>Apply feature engineering for better model results</li>
              </ul>
            </div>
            
            <div class="mt-8">
              <h3 class="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">🎯 Learning Outcomes</h3>
              <div class="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-100 dark:border-blue-800">
                <p class="text-gray-700 dark:text-gray-300 mb-2 font-medium">After completing this topic, learners will be able to:</p>
                <ul class="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-1">
                  <li>Understand common ML terminology</li>
                  <li>Differentiate between features, labels, training/test sets</li>
                  <li>Recognize model evaluation metrics</li>
                  <li>Apply basic Python code to evaluate model performance</li>
                </ul>
              </div>
            </div>
          </div>
        `,
        syntax: [
          {
            title: "Model Evaluation (MSE)",
            content: `from sklearn.model_selection import train_test_split 
from sklearn.linear_model import LinearRegression 
from sklearn.metrics import mean_squared_error 

# Sample dataset 
X = [[1], [2], [3], [4], [5]] 
y = [10, 20, 30, 40, 50] 

# Split dataset 
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42) 

# Train model 
model = LinearRegression() 
model.fit(X_train, y_train) 

# Predict 
y_pred = model.predict(X_test) 

# Calculate error (Loss) 
mse = mean_squared_error(y_test, y_pred) 
print("Mean Squared Error:", mse)`
          }
        ],
        initialCode: `# Example: Model Terminology & Evaluation
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_squared_error, r2_score
import numpy as np

# 1. Dataset
# Features (X): Input variables
X = [[1], [2], [3], [4], [5], [6], [7], [8]]
# Target (y): Output variable (Label)
y = [10, 20, 30, 40, 50, 60, 70, 80]

print("Dataset:")
print(f"Features (X): {X}")
print(f"Target (y): {y}")

# 2. Split Data (Training Set vs Test Set)
# We reserve 20% for testing (evaluation)
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

print("\\nSplitting Data...")
print(f"Training Set: {len(X_train)} samples")
print(f"Test Set: {len(X_test)} samples")

# 3. Train Model
print("\\nTraining Linear Regression Model...")
model = LinearRegression()
model.fit(X_train, y_train)

# 4. Predict
# Using the model on unseen data (Test Set)
y_pred = model.predict(X_test)
print(f"Predictions on Test Set: {y_pred}")
print(f"Actual Values: {y_test}")

# 5. Evaluate (Metrics)
# MSE: Average squared difference between estimated values and the actual value
mse = mean_squared_error(y_test, y_pred)
# R2: Proportion of the variance in the dependent variable that is predictable
r2 = r2_score(y_test, y_pred)

print("\\nEvaluation Metrics:")
print(f"Mean Squared Error (MSE): {mse:.2f}")
print(f"R² Score: {r2:.2f}")

# 📌 Key Terminology Recap:
# - Training Set: Used to teach the model
# - Test Set: Used to validate performance
# - Loss Function (MSE): Measures how 'wrong' the model is (Lower is better)`
      },
      {
        title: 'Data Splitting (Train & Test)',
        content: `
          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">1. Why Split Data?</h2>
          <p class="mb-4 text-gray-700 dark:text-gray-300">In Machine Learning, we cannot test a model on the same data used to train it. Doing so leads to <strong>Overfitting</strong>—where the model memorizes the data instead of learning patterns.</p>
          <p class="mb-4 text-gray-700 dark:text-gray-300">To properly evaluate performance, we split the dataset into:</p>
          <ul class="list-disc pl-6 mb-4 text-gray-700 dark:text-gray-300 space-y-1">
            <li><strong>Training Set (70-80%):</strong> Used to teach the model.</li>
            <li><strong>Test Set (20-30%):</strong> Used to evaluate how well the model generalizes to new, unseen data.</li>
          </ul>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">2. Key Concepts</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div class="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800">
              <h3 class="font-semibold text-blue-800 dark:text-blue-300 mb-2">Training Data</h3>
              <p class="text-sm text-gray-700 dark:text-gray-300">The "textbook" the model studies. It includes both features (questions) and targets (answers).</p>
            </div>
            <div class="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-100 dark:border-green-800">
              <h3 class="font-semibold text-green-800 dark:text-green-300 mb-2">Test Data</h3>
              <p class="text-sm text-gray-700 dark:text-gray-300">The "final exam." The model has never seen this data before. We use it to calculate accuracy.</p>
            </div>
          </div>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">3. Splitting Strategies</h2>
          <p class="mb-4 text-gray-700 dark:text-gray-300">There are two common ways to split data:</p>
          <ul class="list-disc pl-6 mb-4 text-gray-700 dark:text-gray-300 space-y-1">
            <li><strong>Simple Random Split:</strong> Randomly selects rows for training and testing. Good for large, balanced datasets.</li>
            <li><strong>Stratified Split:</strong> Ensures that the proportion of classes (e.g., Spam vs Not Spam) remains the same in both training and test sets. Essential for imbalanced data.</li>
          </ul>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">4. Best Practices</h2>
          <ul class="list-disc pl-6 mb-4 text-gray-700 dark:text-gray-300 space-y-1">
            <li>Always split <strong>before</strong> any data transformation (scaling, imputation) to prevent data leakage.</li>
            <li>Use a fixed <code>random_state</code> (seed) for reproducibility.</li>
            <li>Typical split ratios: 80/20 or 70/30.</li>
          </ul>
        `,
        duration: '20 min',
        syntax: [
          {
            title: "Simple Train-Test Split",
            content: `from sklearn.model_selection import train_test_split\n\nX_train, X_test, y_train, y_test = train_test_split(\n    X, y, \n    test_size=0.2, \n    random_state=42\n)`
          },
          {
            title: "Stratified Split (Classification)",
            content: `X_train, X_test, y_train, y_test = train_test_split(\n    X, y, \n    test_size=0.2, \n    stratify=y, \n    random_state=42\n)`
          },
          {
            title: "Check Split Sizes",
            content: `print(X_train.shape, X_test.shape)`
          }
        ],
        initialCode: `# Example: Data Splitting Strategies
from sklearn.model_selection import train_test_split
import numpy as np

# 1. Create Dummy Data
# Features (X): 20 samples, 2 features each
X = np.arange(20).reshape(10, 2)
# Target (y): Class labels (0 or 1) - Imbalanced (8 zeros, 2 ones)
y = [0, 0, 0, 0, 0, 0, 0, 0, 1, 1]

print("Original Dataset:")
print(f"Features (X) shape: {X.shape}")
print(f"Target (y) counts: {np.bincount(y)} (0s vs 1s)")

# 2. Simple Random Split
# Might miss the minority class in the test set if we are unlucky
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=42)

print("\\n--- Simple Random Split (30% Test) ---")
print(f"Train y counts: {np.bincount(y_train)}")
print(f"Test y counts: {np.bincount(y_test)}")

# 3. Stratified Split
# Ensures the test set has the same proportion of classes as the original
X_train_strat, X_test_strat, y_train_strat, y_test_strat = train_test_split(
    X, y, test_size=0.3, stratify=y, random_state=42
)

print("\\n--- Stratified Split (30% Test) ---")
print(f"Train y counts: {np.bincount(y_train_strat)}")
print(f"Test y counts: {np.bincount(y_test_strat)}")

# 📌 Observation:
# Notice how Stratified Split tries to keep at least one example of the minority class (1) in the test set,
# whereas simple random split might put all 1s in the training set.`
      },
      {
        title: 'Introduction to Simple ML Algorithms',
        content: `
          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">1. What Are Simple ML Algorithms?</h2>
          <p class="mb-4 text-gray-700 dark:text-gray-300">Simple ML algorithms are basic models used to solve common problems in machine learning. They are easy to understand, implement, and interpret, making them great for beginners to start building predictive models.</p>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">2. Types of Simple ML Algorithms</h2>
          <div class="space-y-4 mb-6">
            <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <h3 class="font-semibold text-blue-600 dark:text-blue-400">1. Linear Regression (Supervised)</h3>
              <p class="text-sm text-gray-700 dark:text-gray-300 mt-1">Predicts a continuous numeric output assuming a linear relationship.</p>
              <p class="text-xs text-gray-500 dark:text-gray-400 mt-1"><em>Formula: y = mX + b</em></p>
              <p class="text-xs text-gray-500 dark:text-gray-400"><em>Example: Predicting house prices, sales.</em></p>
            </div>

            <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <h3 class="font-semibold text-green-600 dark:text-green-400">2. Logistic Regression (Supervised)</h3>
              <p class="text-sm text-gray-700 dark:text-gray-300 mt-1">Used for binary classification (0 or 1). Predicts probability.</p>
              <p class="text-xs text-gray-500 dark:text-gray-400 mt-1"><em>Example: Spam detection, loan approval.</em></p>
            </div>

            <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <h3 class="font-semibold text-purple-600 dark:text-purple-400">3. Decision Tree (Supervised)</h3>
              <p class="text-sm text-gray-700 dark:text-gray-300 mt-1">Tree-like structure to make decisions based on conditions.</p>
              <p class="text-xs text-gray-500 dark:text-gray-400 mt-1"><em>Example: Customer segmentation, credit scoring.</em></p>
            </div>

            <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <h3 class="font-semibold text-orange-600 dark:text-orange-400">4. K-Nearest Neighbors (KNN) (Supervised)</h3>
              <p class="text-sm text-gray-700 dark:text-gray-300 mt-1">Classifies based on majority vote of nearest neighbors.</p>
              <p class="text-xs text-gray-500 dark:text-gray-400 mt-1"><em>Example: Recommendation systems.</em></p>
            </div>

            <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <h3 class="font-semibold text-red-600 dark:text-red-400">5. K-Means Clustering (Unsupervised)</h3>
              <p class="text-sm text-gray-700 dark:text-gray-300 mt-1">Groups similar data points into clusters.</p>
              <p class="text-xs text-gray-500 dark:text-gray-400 mt-1"><em>Example: Customer segmentation.</em></p>
            </div>

            <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <h3 class="font-semibold text-teal-600 dark:text-teal-400">6. Naive Bayes (Supervised)</h3>
              <p class="text-sm text-gray-700 dark:text-gray-300 mt-1">Based on Bayes theorem; assumes features are independent.</p>
              <p class="text-xs text-gray-500 dark:text-gray-400 mt-1"><em>Example: Text classification.</em></p>
            </div>
          </div>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">3. Choosing a Simple Algorithm</h2>
          <ul class="list-disc pl-6 mb-4 text-gray-700 dark:text-gray-300 space-y-1">
            <li><strong>Regression problem</strong> → Linear Regression</li>
            <li><strong>Classification problem</strong> → Logistic Regression, Decision Tree, KNN</li>
            <li><strong>Clustering problem</strong> → K-Means</li>
          </ul>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">4. Key Points</h2>
          <ul class="list-disc pl-6 mb-4 text-gray-700 dark:text-gray-300 space-y-1">
            <li>Simple algorithms are fast and interpretable.</li>
            <li>They are a starting point before moving to complex models.</li>
            <li>Easy to implement in Python using scikit-learn.</li>
            <li>Great for learning ML workflow concepts.</li>
          </ul>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">5. Best Practices</h2>
          <ul class="list-disc pl-6 mb-4 text-gray-700 dark:text-gray-300 space-y-1">
            <li>Start with simple algorithms before moving to complex ones.</li>
            <li>Understand the strengths and limitations of each model.</li>
            <li>Use linear models for small datasets.</li>
            <li>Evaluate model performance using appropriate metrics.</li>
          </ul>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">6. Learning Outcomes</h2>
          <p class="mb-4 text-gray-700 dark:text-gray-300">After completing this topic, learners will be able to:</p>
          <ul class="list-disc pl-6 mb-4 text-gray-700 dark:text-gray-300 space-y-1">
            <li>Identify basic machine learning algorithms.</li>
            <li>Apply Linear Regression, Logistic Regression, Decision Trees, KNN, K-Means.</li>
            <li>Understand which algorithm to use for different problem types.</li>
            <li>Implement simple ML algorithms in Python.</li>
          </ul>
        `,
        duration: '25 min',
        syntax: [
          {
            title: "Python Example: Linear Regression",
            content: `from sklearn.model_selection import train_test_split\nfrom sklearn.linear_model import LinearRegression\n\n# Dataset: Hours studied vs Scores\nX = [[1], [2], [3], [4], [5]]\ny = [10, 20, 30, 40, 50]\n\n# Split dataset\nX_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2)\n\n# Train Linear Regression model\nmodel = LinearRegression()\nmodel.fit(X_train, y_train)\n\n# Predict\ny_pred = model.predict(X_test)\nprint("Predicted Scores:", y_pred)`
          },
          {
            title: "Python Example: K-Means Clustering",
            content: `from sklearn.cluster import KMeans\nimport numpy as np\n\n# Data: Customer [Age, Annual Spending]\ndata = np.array([[25, 50000], [30, 60000], [22, 52000],\n                 [35, 70000], [28, 58000], [40, 80000]])\n\n# KMeans model\nkmeans = KMeans(n_clusters=2, random_state=42)\nkmeans.fit(data)\n\n# Cluster labels\nprint("Cluster Labels:", kmeans.labels_)`
          }
        ],
        initialCode: `# Example: Simple ML Algorithms (Linear Regression & K-Means)
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
from sklearn.cluster import KMeans
import numpy as np

# --- 1. Supervised: Linear Regression ---
print("--- 1. Linear Regression (Supervised) ---")
# Dataset: Hours studied (X) vs Scores (y)
X = [[1], [2], [3], [4], [5]]
y = [10, 20, 30, 40, 50]

print(f"Features (X): {X}")
print(f"Target (y): {y}")

# Split Data
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Train Model
lr_model = LinearRegression()
lr_model.fit(X_train, y_train)

# Predict
y_pred = lr_model.predict(X_test)
print(f"Prediction for X_test {X_test}: {y_pred}")
print(f"Actual Value: {y_test}")


# --- 2. Unsupervised: K-Means Clustering ---
print("\\n--- 2. K-Means Clustering (Unsupervised) ---")
# Data: Customer [Age, Annual Spending]
data = np.array([
    [25, 50000], [30, 60000], [22, 52000],
    [35, 70000], [28, 58000], [40, 80000]
])
print("Customer Data (Age, Spending):")
print(data)

# Train KMeans Model (Group into 2 clusters)
kmeans = KMeans(n_clusters=2, random_state=42, n_init=10)
kmeans.fit(data)

# Resulting Clusters
print("Cluster Labels (0 or 1):", kmeans.labels_)
print("Cluster Centers:", kmeans.cluster_centers_)

# 📌 Explanation:
# - Linear Regression found the pattern y = 10 * X
# - K-Means grouped customers based on their age and spending similarity`
      },
      {
        title: 'Model Evaluation Basics',
        content: `
          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">1. Why Model Evaluation is Important</h2>
          <p class="mb-4 text-gray-700 dark:text-gray-300">After training a machine learning model, it’s crucial to assess its performance. Evaluation ensures the model generalizes well to unseen data and helps in selecting the best model for the task.</p>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">2. Key Concepts</h2>
          
          <div class="mb-6">
            <h3 class="font-semibold text-gray-800 dark:text-gray-200 mb-2">Training Accuracy vs Test Accuracy</h3>
            <ul class="list-disc pl-6 mb-4 text-gray-700 dark:text-gray-300 space-y-1">
              <li><strong>Training Accuracy:</strong> How well the model fits the training data.</li>
              <li><strong>Test Accuracy:</strong> How well the model predicts unseen data.</li>
            </ul>
            <p class="text-sm text-red-600 dark:text-red-400 italic">Large difference between Training and Test Accuracy usually indicates Overfitting.</p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div class="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-100 dark:border-red-800">
              <h3 class="font-semibold text-red-800 dark:text-red-300 mb-2">Overfitting</h3>
              <p class="text-sm text-gray-700 dark:text-gray-300">Model memorizes training data (noise and all) but fails on new data.</p>
              <p class="text-xs text-gray-500 dark:text-gray-400 mt-1"><em>Analogy: Memorizing answers without understanding the concept.</em></p>
            </div>
            <div class="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-100 dark:border-yellow-800">
              <h3 class="font-semibold text-yellow-800 dark:text-yellow-300 mb-2">Underfitting</h3>
              <p class="text-sm text-gray-700 dark:text-gray-300">Model is too simple to capture patterns in the data.</p>
              <p class="text-xs text-gray-500 dark:text-gray-400 mt-1"><em>Analogy: Trying to solve calculus with basic addition rules.</em></p>
            </div>
          </div>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">3. Confusion Matrix (Classification)</h2>
          <p class="mb-4 text-gray-700 dark:text-gray-300">A table that summarizes prediction results.</p>
          <ul class="list-disc pl-6 mb-4 text-gray-700 dark:text-gray-300 space-y-1">
            <li><strong>TP (True Positive):</strong> Correctly predicted positive (e.g., Spam correctly identified as Spam).</li>
            <li><strong>TN (True Negative):</strong> Correctly predicted negative (e.g., Not Spam correctly identified as Not Spam).</li>
            <li><strong>FP (False Positive):</strong> Incorrectly predicted positive (Type I Error).</li>
            <li><strong>FN (False Negative):</strong> Incorrectly predicted negative (Type II Error).</li>
          </ul>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">4. Evaluation Metrics</h2>
          <div class="overflow-x-auto mb-6">
            <table class="w-full text-left border-collapse text-gray-700 dark:text-gray-300">
              <thead>
                <tr class="bg-gray-100 dark:bg-gray-800">
                  <th class="border-b border-gray-300 dark:border-gray-600 p-2">Metric</th>
                  <th class="border-b border-gray-300 dark:border-gray-600 p-2">Use Case</th>
                  <th class="border-b border-gray-300 dark:border-gray-600 p-2">Concept</th>
                </tr>
              </thead>
              <tbody>
                <tr><td class="p-2 border-b border-gray-200 dark:border-gray-700">Accuracy</td><td class="p-2 border-b border-gray-200 dark:border-gray-700">Classification</td><td class="p-2 border-b border-gray-200 dark:border-gray-700">(TP + TN) / Total</td></tr>
                <tr><td class="p-2 border-b border-gray-200 dark:border-gray-700">Precision</td><td class="p-2 border-b border-gray-200 dark:border-gray-700">Classification</td><td class="p-2 border-b border-gray-200 dark:border-gray-700">TP / (TP + FP)</td></tr>
                <tr><td class="p-2 border-b border-gray-200 dark:border-gray-700">Recall</td><td class="p-2 border-b border-gray-200 dark:border-gray-700">Classification</td><td class="p-2 border-b border-gray-200 dark:border-gray-700">TP / (TP + FN)</td></tr>
                <tr><td class="p-2 border-b border-gray-200 dark:border-gray-700">F1-Score</td><td class="p-2 border-b border-gray-200 dark:border-gray-700">Classification</td><td class="p-2 border-b border-gray-200 dark:border-gray-700">Harmonic mean of Precision & Recall</td></tr>
                <tr><td class="p-2 border-b border-gray-200 dark:border-gray-700">MAE/MSE</td><td class="p-2 border-b border-gray-200 dark:border-gray-700">Regression</td><td class="p-2 border-b border-gray-200 dark:border-gray-700">Error measurement (lower is better)</td></tr>
                <tr><td class="p-2 border-b border-gray-200 dark:border-gray-700">R² Score</td><td class="p-2 border-b border-gray-200 dark:border-gray-700">Regression</td><td class="p-2 border-b border-gray-200 dark:border-gray-700">Variance explained (closer to 1 is better)</td></tr>
              </tbody>
            </table>
          </div>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">5. Applications</h2>
          <ul class="list-disc pl-6 mb-4 text-gray-700 dark:text-gray-300 space-y-1">
            <li><strong>Spam Detection:</strong> Focus on Precision and Recall.</li>
            <li><strong>House Price Prediction:</strong> Focus on MAE, RMSE, R².</li>
            <li><strong>Fraud Detection:</strong> Focus on F1-Score and Recall (catching fraud is critical).</li>
          </ul>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">6. Best Practices</h2>
          <ul class="list-disc pl-6 mb-4 text-gray-700 dark:text-gray-300 space-y-1">
            <li>Always evaluate models on <strong>test data</strong>, never on training data.</li>
            <li>Choose metrics based on the problem type (Classification vs Regression).</li>
            <li>Check for overfitting (High Train Accuracy, Low Test Accuracy).</li>
            <li>Use cross-validation for more reliable performance estimation.</li>
          </ul>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">7. Learning Outcomes</h2>
          <p class="mb-4 text-gray-700 dark:text-gray-300">After completing this topic, learners will be able to:</p>
          <ul class="list-disc pl-6 mb-4 text-gray-700 dark:text-gray-300 space-y-1">
            <li>Understand the importance of model evaluation.</li>
            <li>Apply metrics for regression and classification.</li>
            <li>Interpret confusion matrix, accuracy, precision, recall, and F1-score.</li>
            <li>Identify overfitting and underfitting in models.</li>
          </ul>
        `,
        duration: '20 min',
        syntax: [
          {
            title: "Python Example: Evaluate Linear Regression",
            content: `from sklearn.model_selection import train_test_split\nfrom sklearn.linear_model import LinearRegression\nfrom sklearn.metrics import mean_squared_error, r2_score\n\n# Dataset: Hours studied vs Scores\nX = [[1], [2], [3], [4], [5]]\ny = [10, 20, 30, 40, 50]\n\n# Split dataset\nX_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)\n\n# Train model\nmodel = LinearRegression()\nmodel.fit(X_train, y_train)\n\n# Predict\ny_pred = model.predict(X_test)\n\n# Evaluate\nmse = mean_squared_error(y_test, y_pred)\nr2 = r2_score(y_test, y_pred)\n\nprint("Mean Squared Error:", mse)\nprint("R² Score:", r2)`
          },
          {
            title: "Python Example: Evaluate Classification",
            content: `from sklearn.model_selection import train_test_split\nfrom sklearn.metrics import confusion_matrix, accuracy_score, precision_score, recall_score, f1_score\nfrom sklearn.linear_model import LogisticRegression\n\n# Sample classification dataset\nX = [[1], [2], [3], [4], [5], [6]]\ny = [0, 0, 0, 1, 1, 1]\n\nX_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.33, random_state=42)\n\n# Train Logistic Regression\nmodel = LogisticRegression()\nmodel.fit(X_train, y_train)\ny_pred = model.predict(X_test)\n\n# Evaluate\nprint("Confusion Matrix:\\n", confusion_matrix(y_test, y_pred))\nprint("Accuracy:", accuracy_score(y_test, y_pred))\nprint("Precision:", precision_score(y_test, y_pred))\nprint("Recall:", recall_score(y_test, y_pred))\nprint("F1-Score:", f1_score(y_test, y_pred))`
          }
        ],
        initialCode: `# Example: Model Evaluation (Regression & Classification)
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression, LogisticRegression
from sklearn.metrics import mean_squared_error, r2_score, confusion_matrix, accuracy_score, precision_score, recall_score, f1_score
import numpy as np

# --- 1. Regression Evaluation ---
print("--- 1. Regression Evaluation ---")
X_reg = [[1], [2], [3], [4], [5]]
y_reg = [10, 20, 30, 40, 50]

X_train_r, X_test_r, y_train_r, y_test_r = train_test_split(X_reg, y_reg, test_size=0.2, random_state=42)

lr_model = LinearRegression()
lr_model.fit(X_train_r, y_train_r)
y_pred_r = lr_model.predict(X_test_r)

print(f"Test Set (Regression): {y_test_r}")
print(f"Predictions: {y_pred_r}")
print("Regression MSE:", mean_squared_error(y_test_r, y_pred_r))
print("Regression R²:", r2_score(y_test_r, y_pred_r))


# --- 2. Classification Evaluation ---
print("\\n--- 2. Classification Evaluation ---")
# Simple dataset: 0 = Negative, 1 = Positive
X_clf = [[1], [2], [3], [4], [5], [6]]
y_clf = [0, 0, 0, 1, 1, 1]

X_train_c, X_test_c, y_train_c, y_test_c = train_test_split(X_clf, y_clf, test_size=0.33, random_state=42)

log_model = LogisticRegression()
log_model.fit(X_train_c, y_train_c)
y_pred_c = log_model.predict(X_test_c)

print(f"Test Set (Classification): {y_test_c}")
print(f"Predictions: {y_pred_c}")
print("Confusion Matrix:\\n", confusion_matrix(y_test_c, y_pred_c))
print("Accuracy:", accuracy_score(y_test_c, y_pred_c))
print("Precision:", precision_score(y_test_c, y_pred_c))
print("Recall:", recall_score(y_test_c, y_pred_c))
print("F1-Score:", f1_score(y_test_c, y_pred_c))

# 📌 Explanation:
# - Regression metrics (MSE, R2) measure "how close" predictions are.
# - Classification metrics (Accuracy, Precision, Recall) measure "correctness" of categories.`
      },
      {
        title: 'Beginner-Level ML Use Cases',
        content: `
          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">1. Real-World Applications</h2>
          <p class="mb-4 text-gray-700 dark:text-gray-300">Machine Learning is applied across many real-world scenarios. Understanding these use cases helps connect theory with practice.</p>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            <!-- 1. House Prices -->
            <div class="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800">
              <h3 class="font-semibold text-blue-800 dark:text-blue-300 mb-2">1. Predicting House Prices</h3>
              <p class="text-xs font-bold text-gray-500 uppercase mb-1">Regression</p>
              <p class="text-sm text-gray-700 dark:text-gray-300"><strong>Problem:</strong> Predict price based on size, location, etc.</p>
              <p class="text-sm text-gray-700 dark:text-gray-300 mt-1"><strong>Algorithm:</strong> Linear Regression</p>
            </div>

            <!-- 2. Spam Detection -->
            <div class="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-100 dark:border-green-800">
              <h3 class="font-semibold text-green-800 dark:text-green-300 mb-2">2. Email Spam Detection</h3>
              <p class="text-xs font-bold text-gray-500 uppercase mb-1">Classification</p>
              <p class="text-sm text-gray-700 dark:text-gray-300"><strong>Problem:</strong> Classify emails as spam or not.</p>
              <p class="text-sm text-gray-700 dark:text-gray-300 mt-1"><strong>Algorithm:</strong> Logistic Regression, Naive Bayes</p>
            </div>

            <!-- 3. Customer Segmentation -->
            <div class="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-100 dark:border-purple-800">
              <h3 class="font-semibold text-purple-800 dark:text-purple-300 mb-2">3. Customer Segmentation</h3>
              <p class="text-xs font-bold text-gray-500 uppercase mb-1">Clustering</p>
              <p class="text-sm text-gray-700 dark:text-gray-300"><strong>Problem:</strong> Group customers by behavior.</p>
              <p class="text-sm text-gray-700 dark:text-gray-300 mt-1"><strong>Algorithm:</strong> K-Means</p>
            </div>

            <!-- 4. Student Score Prediction -->
            <div class="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-100 dark:border-orange-800">
              <h3 class="font-semibold text-orange-800 dark:text-orange-300 mb-2">4. Student Score Prediction</h3>
              <p class="text-xs font-bold text-gray-500 uppercase mb-1">Regression</p>
              <p class="text-sm text-gray-700 dark:text-gray-300"><strong>Problem:</strong> Predict scores based on study hours.</p>
              <p class="text-sm text-gray-700 dark:text-gray-300 mt-1"><strong>Algorithm:</strong> Linear Regression</p>
            </div>

            <!-- 5. Loan Approval -->
            <div class="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-100 dark:border-red-800">
              <h3 class="font-semibold text-red-800 dark:text-red-300 mb-2">5. Loan Approval</h3>
              <p class="text-xs font-bold text-gray-500 uppercase mb-1">Classification</p>
              <p class="text-sm text-gray-700 dark:text-gray-300"><strong>Problem:</strong> Approve or reject loan application.</p>
              <p class="text-sm text-gray-700 dark:text-gray-300 mt-1"><strong>Algorithm:</strong> Decision Tree, Logistic Regression</p>
            </div>

            <!-- 6. Product Recommendation -->
            <div class="p-4 bg-teal-50 dark:bg-teal-900/20 rounded-lg border border-teal-100 dark:border-teal-800">
              <h3 class="font-semibold text-teal-800 dark:text-teal-300 mb-2">6. Product Recommendation</h3>
              <p class="text-xs font-bold text-gray-500 uppercase mb-1">Hybrid / Clustering</p>
              <p class="text-sm text-gray-700 dark:text-gray-300"><strong>Problem:</strong> Recommend products based on history.</p>
              <p class="text-sm text-gray-700 dark:text-gray-300 mt-1"><strong>Algorithm:</strong> K-Means, Collaborative Filtering</p>
            </div>

            <!-- 7. Fraud Detection -->
            <div class="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg border border-indigo-100 dark:border-indigo-800">
              <h3 class="font-semibold text-indigo-800 dark:text-indigo-300 mb-2">7. Fraud Detection</h3>
              <p class="text-xs font-bold text-gray-500 uppercase mb-1">Classification</p>
              <p class="text-sm text-gray-700 dark:text-gray-300"><strong>Problem:</strong> Identify fraudulent transactions.</p>
              <p class="text-sm text-gray-700 dark:text-gray-300 mt-1"><strong>Algorithm:</strong> Logistic Regression, Decision Tree</p>
            </div>

            <!-- 8. Sales Forecasting -->
            <div class="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-100 dark:border-yellow-800">
              <h3 class="font-semibold text-yellow-800 dark:text-yellow-300 mb-2">8. Sales Forecasting</h3>
              <p class="text-xs font-bold text-gray-500 uppercase mb-1">Regression / Time Series</p>
              <p class="text-sm text-gray-700 dark:text-gray-300"><strong>Problem:</strong> Predict future sales.</p>
              <p class="text-sm text-gray-700 dark:text-gray-300 mt-1"><strong>Algorithm:</strong> Linear Regression, ARIMA</p>
            </div>

            <!-- 9. Sentiment Analysis -->
            <div class="p-4 bg-pink-50 dark:bg-pink-900/20 rounded-lg border border-pink-100 dark:border-pink-800">
              <h3 class="font-semibold text-pink-800 dark:text-pink-300 mb-2">9. Sentiment Analysis</h3>
              <p class="text-xs font-bold text-gray-500 uppercase mb-1">Classification (NLP)</p>
              <p class="text-sm text-gray-700 dark:text-gray-300"><strong>Problem:</strong> Positive, Negative, or Neutral review?</p>
              <p class="text-sm text-gray-700 dark:text-gray-300 mt-1"><strong>Algorithm:</strong> Naive Bayes, Logistic Regression</p>
            </div>
          </div>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">2. Best Practices</h2>
          <ul class="list-disc pl-6 mb-4 text-gray-700 dark:text-gray-300 space-y-1">
            <li>Start with simple, interpretable models.</li>
            <li>Preprocess data carefully (handle missing values, encoding, scaling).</li>
            <li>Evaluate models using appropriate metrics (Accuracy for classification, MSE for regression).</li>
            <li>Visualize results to understand patterns.</li>
            <li>Gradually move to more complex algorithms as needed.</li>
          </ul>

          <h2 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">3. Learning Outcomes</h2>
          <p class="mb-4 text-gray-700 dark:text-gray-300">After completing this topic, learners will be able to:</p>
          <ul class="list-disc pl-6 mb-4 text-gray-700 dark:text-gray-300 space-y-1">
            <li>Understand real-world use cases of ML.</li>
            <li>Implement regression and classification models in Python.</li>
            <li>Apply ML to prediction, clustering, and recommendation tasks.</li>
            <li>Connect theory with practical applications.</li>
          </ul>
        `,
        duration: '20 min',
        syntax: [
          {
            title: "Python Example: Simple Regression Use Case",
            content: `from sklearn.linear_model import LinearRegression\nfrom sklearn.model_selection import train_test_split\n\n# Example: Predict student scores based on hours studied\nX = [[2], [4], [6], [8], [10]]  # Hours studied\ny = [20, 40, 60, 80, 100]       # Scores\n\n# Split dataset\nX_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)\n\n# Train model\nmodel = LinearRegression()\nmodel.fit(X_train, y_train)\n\n# Predict\ny_pred = model.predict(X_test)\nprint("Predicted Scores:", y_pred)`
          },
          {
            title: "Python Example: Simple Classification Use Case",
            content: `from sklearn.model_selection import train_test_split\nfrom sklearn.linear_model import LogisticRegression\nfrom sklearn.metrics import accuracy_score\n\n# Example: Email spam detection\nX = [[0], [1], [0], [1], [0]]  # Features (0=not spam, 1=spam indicator)\ny = [0, 1, 0, 1, 0]           # Labels (0=not spam, 1=spam)\n\nX_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)\nmodel = LogisticRegression()\nmodel.fit(X_train, y_train)\ny_pred = model.predict(X_test)\n\nprint("Predicted Labels:", y_pred)\nprint("Accuracy:", accuracy_score(y_test, y_pred))`
          }
        ],
        initialCode: `# Example: ML Use Cases (Regression & Classification)
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression, LogisticRegression
from sklearn.metrics import accuracy_score
import numpy as np

# --- 1. Regression Use Case: Student Scores ---
print("--- 1. Regression: Student Score Prediction ---")
# Feature: Hours studied
X_reg = [[2], [4], [6], [8], [10]]
# Target: Exam Score
y_reg = [20, 40, 60, 80, 100]

print(f"Study Hours: {X_reg}")
print(f"Scores: {y_reg}")

X_train_r, X_test_r, y_train_r, y_test_r = train_test_split(X_reg, y_reg, test_size=0.2, random_state=42)

lr_model = LinearRegression()
lr_model.fit(X_train_r, y_train_r)

print(f"Predicted Score for {X_test_r} hours: {lr_model.predict(X_test_r)}")


# --- 2. Classification Use Case: Spam Detection ---
print("\\n--- 2. Classification: Spam Detection ---")
# Feature: [Contains 'Free'] (0=No, 1=Yes)
X_clf = [[0], [1], [0], [1], [0]]
# Target: Is Spam? (0=No, 1=Yes)
y_clf = [0, 1, 0, 1, 0]

print(f"Email Features: {X_clf}")
print(f"Labels (Spam?): {y_clf}")

X_train_c, X_test_c, y_train_c, y_test_c = train_test_split(X_clf, y_clf, test_size=0.2, random_state=42)

log_model = LogisticRegression()
log_model.fit(X_train_c, y_train_c)
y_pred_c = log_model.predict(X_test_c)

print(f"Predicted Labels for {X_test_c}: {y_pred_c}")
print("Accuracy:", accuracy_score(y_test_c, y_pred_c))

# 📌 Explanation:
# - Regression helps predict continuous values (Scores).
# - Classification helps categorize data (Spam vs Not Spam).`
      }
    ]
  }
];

// --- Components ---

type FloatingDockProps = {
  isDark: boolean;
  onToggleTheme: () => void;
  onPrevModule: () => void;
  disabledPrev: boolean;
  onNextModule: () => void;
  disabledNext: boolean;
  onHome: () => void;
};

const FloatingDock = ({ isDark, onToggleTheme, onPrevModule, disabledPrev, onNextModule, disabledNext, onHome }: FloatingDockProps) => (
  <div className={`fixed top-4 left-1/2 -translate-x-1/2 z-40 rounded-2xl shadow-lg border ${isDark ? 'bg-white/10 border-white/20' : 'bg-white/60 border-gray-300/40'} backdrop-blur-xl px-3 py-2 flex items-center gap-2`} aria-label="Quick actions dock">
    <button
      onClick={onHome}
      className={`px-3 py-2 rounded-lg text-sm font-medium ${isDark ? 'bg-white/10 text-white hover:bg-white/15' : 'bg-gray-100 text-gray-900 hover:bg-gray-200'}`}
      aria-label="Go to Student Portal"
      title="Student Portal"
    >
      <span className="inline-flex items-center gap-1">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M3 10.5L12 3l9 7.5v9a1.5 1.5 0 0 1-1.5 1.5H4.5A1.5 1.5 0 0 1 3 19.5v-9z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M9 21V12h6v9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Home
      </span>
    </button>
    <div className="mx-1 h-6 w-px bg-gray-300/60 dark:bg-white/20" aria-hidden />
    <button
      onClick={onToggleTheme}
      className={`px-3 py-2 rounded-lg text-sm font-medium ${isDark ? 'bg-white/10 text-white hover:bg-white/15' : 'bg-gray-100 text-gray-900 hover:bg-gray-200'}`}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {isDark ? 'Light Mode' : 'Dark Mode'}
    </button>
    <button
      onClick={onPrevModule}
      disabled={disabledPrev}
      className={`px-3 py-2 rounded-lg text-sm font-medium ${disabledPrev ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : (isDark ? 'bg-black text-white hover:bg-gray-900' : 'bg-blue-600 text-white hover:bg-blue-500')}`}
      aria-label="Go to previous module"
    >
      Previous Module
    </button>
    <button
      onClick={onNextModule}
      disabled={disabledNext}
      className={`px-3 py-2 rounded-lg text-sm font-medium ${disabledNext ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : (isDark ? 'bg-black text-white hover:bg-gray-900' : 'bg-blue-600 text-white hover:bg-blue-500')}`}
      aria-label="Go to next module"
    >
      Next Module
    </button>
  </div>
);

type ChatPanelProps = {
  isDark: boolean;
  messages: ChatMessage[];
  loading: boolean;
  onSend: (text: string) => void;
};

function ChatPanel({ isDark, messages, loading, onSend }: ChatPanelProps) {
  const [text, setText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSend = () => {
    if (text.trim() && !loading) {
      onSend(text.trim());
      setText('');
    }
  };

  return (
    <aside
      className={`${
        isDark
          ? 'bg-gradient-to-br from-white/15 to-white/5 border-white/20'
          : 'bg-gradient-to-br from-white/70 to-white/40 border-gray-300/40'
      } backdrop-blur-2xl backdrop-saturate-150 w-full lg:sticky lg:top-4 lg:self-start h-[calc(100vh-240px)] min-h-[520px] rounded-2xl border p-4 flex flex-col shadow-lg ring-1 ${
        isDark ? 'ring-white/10' : 'ring-white/60'
      }`}
    >
      <div
        className={`flex flex-col items-start gap-0.5 pb-3 border-b ${
          isDark ? 'border-white/20 bg-white/10' : 'border-[#00bceb]/30 bg-white/60'
        } backdrop-blur-xl rounded-lg px-3 py-2`}
      >
        <h3 className={`text-sm font-medium ${isDark ? 'text-white' : 'text-[#00bceb]'}`}>Personal Teacher</h3>
        <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Ask me anything about the components</span>
      </div>

      <div className={`flex-1 min-h-0 overflow-y-auto space-y-4 py-4 ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'assistant' ? 'justify-start' : 'justify-end'}`}>
            <div
              className={`${
                msg.role === 'assistant'
                  ? isDark
                    ? 'bg-white/10 backdrop-blur-xl text-white border border-white/20'
                    : 'bg-[#00bceb] text-white border border-[#00bceb]'
                  : isDark
                  ? 'bg-black/60 backdrop-blur-xl text-white border border-white/20'
                  : 'bg-blue-600/70 backdrop-blur-xl text-white border border-blue-300/40'
              } max-w-[85%] rounded-2xl px-4 py-3 shadow-sm whitespace-pre-wrap break-words leading-relaxed text-[15px]`}
            >
              {msg.content}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div
              className={`${
                isDark ? 'bg-white/10 backdrop-blur-xl border border-white/20' : 'bg-[#00bceb] border border-[#00bceb]'
              } rounded-2xl px-4 py-3 shadow-sm`}
            >
              <span className={`text-sm ${isDark ? 'text-white/70' : 'text-white/90'}`}>Thinking...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="pt-4 border-t space-y-3">
        <div
          className={`flex items-center gap-2 ${
            isDark ? 'bg-white/10 border-white/20' : 'bg-white/60 border-gray-300/40'
          } backdrop-blur-xl rounded-xl border p-2 shadow-sm`}
        >
          <button
            className={`p-2 rounded ${isDark ? 'hover:bg-white/15' : 'hover:bg-white'} shrink-0`}
            aria-label="Voice input (not implemented)"
          >
            <Mic className={`h-5 w-5 ${isDark ? 'text-white/80' : 'text-gray-700'}`} />
          </button>
          <input
            type="text"
            className={`flex-1 bg-transparent outline-none min-w-0 ${
              isDark ? 'text-white placeholder-white/60' : 'text-gray-900 placeholder-gray-600'
            }`}
            placeholder="Type your message..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSend();
              }
            }}
            disabled={loading}
          />
          <button
            className={`flex items-center gap-2 px-4 py-2 rounded-md ${
              isDark ? 'bg-white text-gray-900' : 'bg-[#00bceb] text-white'
            } disabled:opacity-50 shrink-0`}
            onClick={handleSend}
            disabled={loading || !text.trim()}
          >
            <Send className="h-4 w-4" />
            {loading ? 'Sending...' : 'Send'}
          </button>
        </div>
      </div>
    </aside>
  );
}

const Sidebar = ({
  activeModuleId,
  setActiveModuleId,
  activeLessonIndex,
  setActiveLessonIndex,
  completedLessons
}: {
  activeModuleId: string;
  setActiveModuleId: (id: string) => void;
  activeLessonIndex: number;
  setActiveLessonIndex: (index: number) => void;
  completedLessons: Set<string>;
}) => {
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set([activeModuleId]));
  const [searchQuery, setSearchQuery] = useState('');

  // Auto-expand the active module when it changes
  useEffect(() => {
    setExpandedModules(prev => {
      const newSet = new Set(prev);
      newSet.add(activeModuleId);
      return newSet;
    });
  }, [activeModuleId]);

  const toggleModule = (id: string) => {
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
    <div className="w-[350px] bg-[#1e1e1e] border-r border-[#333] flex flex-col h-full">
      {/* Search */}
      <div className="p-4 border-b border-[#333]">
        <div className="relative">
          <input
            type="text"
            placeholder="Search course outline"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#121212] border border-[#333] rounded px-3 py-2 pl-9 text-sm text-gray-300 focus:outline-none focus:border-[#00bceb] transition-colors placeholder-gray-600"
          />
          <Search className="absolute left-2.5 top-2.5 w-4 h-4 text-gray-500" />
        </div>
      </div>

      {/* Content List */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
          <div className="pb-4">
            <div className="px-4 py-4 flex items-center justify-between hover:bg-[#2d2d2d] cursor-pointer transition-colors border-b border-[#333]">
              <div>
                 <span className="text-sm font-semibold text-white block">Course Introduction</span>
                 <div className="w-full bg-gray-700 h-1 rounded-full overflow-hidden mt-2 w-32">
                    <div className="bg-green-500 h-full w-full" />
                 </div>
              </div>
              <div className="flex flex-col items-end">
                 <CheckCircle className="w-5 h-5 text-green-500 mb-1" />
                 <span className="text-xs text-gray-400">100%</span>
              </div>
            </div>

            {filteredModules.map(module => {
              const isExpanded = expandedModules.has(module.id);
              const isActive = activeModuleId === module.id;
              
              // Calculate progress for this module (mock logic)
              const moduleCompletedLessons = module.lessons.filter((_, idx) =>
                completedLessons.has(`${module.id}-${idx}`)
              ).length;
              const progressPercent = Math.round((moduleCompletedLessons / module.lessons.length) * 100);

              return (
                <div key={module.id} className="border-b border-[#333]">
                  <div
                    onClick={() => toggleModule(module.id)}
                    className={`px-4 py-4 cursor-pointer hover:bg-[#2d2d2d] transition-colors ${isActive ? 'bg-[#2d2d2d]' : ''}`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <h3 className="text-sm font-bold text-white leading-tight mb-2">{module.title}</h3>
                        <div className="w-full bg-gray-700 h-1 rounded-full overflow-hidden">
                          <div
                            className="bg-green-500 h-full transition-all duration-300"
                            style={{ width: `${progressPercent}%` }}
                          />
                        </div>
                      </div>
                      <div className="flex flex-col items-end justify-between h-full gap-2">
                        {isExpanded ? (
                          <div className="bg-[#3e3e42] p-1 rounded hover:bg-[#4e4e52]">
                             <ChevronDown className="w-4 h-4 text-gray-300" />
                          </div>
                        ) : (
                          <div className="bg-[#3e3e42] p-1 rounded hover:bg-[#4e4e52]">
                             <ChevronRight className="w-4 h-4 text-gray-300" />
                          </div>
                        )}
                        <span className="text-xs text-gray-400">{progressPercent}%</span>
                      </div>
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="bg-[#121212] py-2">
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
                              'pl-6 pr-4 py-3 cursor-pointer flex items-center gap-3 transition-colors relative',
                              isLessonActive
                                ? 'bg-[#2d2d2d]'
                                : 'hover:bg-[#1e1e1e]'
                            )}
                          >
                             {/* Active indicator line */}
                             {isLessonActive && (
                               <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-green-500" />
                             )}

                             {/* Status Icon */}
                             <div className="flex-shrink-0 z-10">
                                {isCompleted ? (
                                   <CheckCircle className="w-5 h-5 text-green-500" />
                                ) : (
                                   <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${isLessonActive ? 'border-green-500' : 'border-gray-600'}`}>
                                      {isLessonActive && <div className="w-2 h-2 rounded-full bg-green-500" />}
                                   </div>
                                )}
                             </div>

                             {/* Dashed line connector */}
                             {idx !== module.lessons.length - 1 && (
                                <div className="absolute left-[33px] top-[30px] bottom-[-14px] w-[1px] border-l border-dashed border-gray-600 z-0" />
                             )}

                            <div className="flex-1 min-w-0">
                              <div className={clsx(
                                'text-sm font-medium truncate mb-0.5',
                                isLessonActive ? 'text-white' : 'text-gray-400'
                              )}>
                                {module.id.split('-')[1]}.{idx + 1} {lesson.title}
                              </div>
                            </div>
                            
                            <span className="text-xs text-gray-600">{lesson.duration}</span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
      </div>
    </div>
  );
};

const CourseLearningDataScienceBeginner: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  // State
  const [activeModuleId, setActiveModuleId] = useState<string>('module-1');
  const [activeLessonIndex, setActiveLessonIndex] = useState(0);
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(new Set(['module-1-0']));
  
  // Content Tab State
  const [activeContentTab, setActiveContentTab] = useState<'lesson' | 'syntax' | 'compiler'>('lesson');

  // Compiler State
  const [pyodide, setPyodide] = useState<any>(null);
  const [isPyodideLoading, setIsPyodideLoading] = useState(false);
  const [pyodideOutput, setPyodideOutput] = useState<string>('');
  const [pythonCode, setPythonCode] = useState<string>(`import numpy as np
import pandas as pd
import matplotlib.pyplot as plt

# Create sample data
data = {
    'Category': ['A', 'B', 'C', 'D'],
    'Values': [10, 25, 15, 30]
}
df = pd.DataFrame(data)

print("DataFrame Head:")
print(df)

# Note: Plotting support is basic in this live environment.
# Use print() to see your data structures.
`);

  // Load Pyodide
  useEffect(() => {
    if (activeContentTab === 'compiler' && !pyodide) {
      const loadPython = async () => {
        setIsPyodideLoading(true);
        setPyodideOutput('Initializing Python environment...\nLoading standard libraries...');
        try {
            if (!document.querySelector('script[src="https://cdn.jsdelivr.net/pyodide/v0.26.0/full/pyodide.js"]')) {
                const script = document.createElement('script');
                script.src = "https://cdn.jsdelivr.net/pyodide/v0.26.0/full/pyodide.js";
                script.async = true;
                document.head.appendChild(script);
                await new Promise(resolve => script.onload = resolve);
            }

            // @ts-ignore
            const pyodideInstance = await window.loadPyodide({
                indexURL: "https://cdn.jsdelivr.net/pyodide/v0.26.0/full/"
            });

            setPyodideOutput(prev => prev + '\nPython loaded. Installing data science packages (numpy, pandas, matplotlib, seaborn, scipy, scikit-learn)...\nThis may take a minute or two on the first load.');
            
            await pyodideInstance.loadPackage("micropip");
            const micropip = pyodideInstance.pyimport("micropip");
            // Install packages sequentially or together
            await micropip.install(["numpy", "pandas", "matplotlib", "seaborn", "scipy", "scikit-learn"]);
            
            setPyodide(pyodideInstance);
            setPyodideOutput(prev => prev + '\n\nReady! Environment configured with NumPy, Pandas, Matplotlib, Seaborn, SciPy, Scikit-learn.\nType your code and click Run.');
        } catch (err) {
            console.error("Failed to load Pyodide:", err);
            setPyodideOutput(prev => prev + '\nError loading Python environment. Please refresh the page or check your internet connection.');
        } finally {
            setIsPyodideLoading(false);
        }
      };
      loadPython();
    }
  }, [activeContentTab, pyodide]);

  const runPythonCode = async () => {
    if (!pyodide) return;
    setPyodideOutput('');
    
    // Clear previous plots if any (manual DOM manipulation)
    const plotDiv = document.getElementById('plot-output');
    if (plotDiv) plotDiv.innerHTML = '';

    try {
        pyodide.setStdout({ batched: (msg: string) => setPyodideOutput(prev => prev + msg + '\n') });
        pyodide.setStderr({ batched: (msg: string) => setPyodideOutput(prev => prev + 'Error: ' + msg + '\n') });
        
        // Setup matplotlib backend to target our div
        // We use the inline backend which Pyodide supports, but we need to ensure it renders to our specific div
        await pyodide.runPythonAsync(`
import matplotlib.pyplot as plt
import io, base64

# Reset figure
plt.clf()
`);

        await pyodide.runPythonAsync(pythonCode);

        // Check if any plot was created and try to display it
        // Note: Real "live" plotting in Pyodide usually requires the pyodide-matplotlib package or specific canvas setup.
        // For now, we will capture print output reliably. 
        // If the user uses plt.show(), Pyodide might append it to the body.
        // We will try a simple workaround:
        await pyodide.runPythonAsync(`
# Attempt to save plot to a buffer if one exists
if plt.get_fignums():
    import io, base64
    buf = io.BytesIO()
    plt.savefig(buf, format='png')
    buf.seek(0)
    img_str = 'data:image/png;base64,' + base64.b64encode(buf.read()).decode('utf-8')
    # We can't easily pass this back to JS state in this simple eval, 
    # but we could print a special delimiter or use a callback.
    # For now, we'll just print a message if a plot was generated.
    print("\\n[Plot generated - Visualization support coming soon]")
`);

    } catch (err: any) {
        setPyodideOutput(prev => prev + '\nTraceback:\n' + err.toString());
    }
  };


  // Identify current module/lesson
  const activeModule = useMemo(() => courseData.find(m => m.id === activeModuleId) || courseData[0], [activeModuleId]);
  const activeLesson = useMemo(() => activeModule?.lessons[activeLessonIndex], [activeModule, activeLessonIndex]);

  // Update Python code when lesson changes
  useEffect(() => {
    if (activeLesson?.initialCode) {
      setPythonCode(activeLesson.initialCode);
    }
  }, [activeLesson]);

  // Chat State
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'assistant', content: 'Hello! I am your personal Data Science teacher. How can I help you today?' }
  ]);
  const [loading, setLoading] = useState(false);
  const [showCompletionModal, setShowCompletionModal] = useState(false);

  const handleSendMessage = async (text: string) => {
    const newMsg: ChatMessage = { role: 'user', content: text };
    const updated = [...messages, newMsg];
    setMessages(updated);
    setLoading(true);

    try {
      // Use course context for better AI responses
      const answer = await askLLM(text, updated, {
        courseContext: {
          courseName: 'Data Science Beginner',
          moduleName: activeModule?.title,
          lessonTitle: activeLesson?.title,
          lessonContent: activeLesson?.content.replace(/<[^>]*>/g, '').substring(0, 1500)
        }
      });
      setMessages(prev => [...prev, { role: 'assistant', content: answer }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I encountered an error connecting to the AI tutor.' }]);
    } finally {
      setLoading(false);
    }
  };

  // Helper to render text with clickable links
  const renderContentWithLinks = (content: string) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const parts = content.split(urlRegex);
    
    return parts.map((part, i) => {
      if (part.match(urlRegex)) {
        return (
          <a 
            key={i} 
            href={part} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-[#00bceb] hover:underline"
          >
            {part}
          </a>
        );
      }
      return part;
    });
  };

  // Sync slug with active module if needed
  useEffect(() => {
    if (slug && slug !== activeModuleId) {
       const found = courseData.find(m => m.id === slug);
       if (found) setActiveModuleId(slug);
    }
  }, [slug]);


  // Navigation handlers (Adapted for FloatingDock)
  const handleNextModule = () => {
    const currentModuleIndex = courseData.findIndex(m => m.id === activeModuleId);
    if (currentModuleIndex < courseData.length - 1) {
      const nextModule = courseData[currentModuleIndex + 1];
      setActiveModuleId(nextModule.id);
      setActiveLessonIndex(0);
    }
  };

  const handlePrevModule = () => {
    const currentModuleIndex = courseData.findIndex(m => m.id === activeModuleId);
    if (currentModuleIndex > 0) {
      const prevModule = courseData[currentModuleIndex - 1];
      setActiveModuleId(prevModule.id);
      setActiveLessonIndex(0);
    }
  };

  const handleHome = () => {
    navigate('/student-portal');
  };
  
  // Calculate disabled states for FloatingDock
  const currentModuleIndex = courseData.findIndex(m => m.id === activeModuleId);
  const disabledPrev = currentModuleIndex === 0;
  const disabledNext = currentModuleIndex === courseData.length - 1;

  return (
    <div className={`flex h-screen ${isDark ? 'bg-[#121212] text-white' : 'bg-gray-50 text-gray-900'} overflow-hidden font-sans`}>
      <Sidebar 
        activeModuleId={activeModuleId}
        setActiveModuleId={setActiveModuleId}
        activeLessonIndex={activeLessonIndex}
        setActiveLessonIndex={setActiveLessonIndex}
        completedLessons={completedLessons}
      />

      {/* CENTER - MAIN CONTENT */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative bg-[#121212]">
         {/* Top Navigation Bar */}
         <div className="h-[50px] bg-[#1e1e1e] border-b border-[#333] flex items-center justify-between px-4 z-20">
            <div className="flex items-center gap-2 text-sm text-gray-400">
               <span className="cursor-pointer hover:text-white" onClick={() => navigate('/data-science-beginner')}>Data Science Beginner</span>
               <ChevronRight className="w-4 h-4" />
               <span className="text-white truncate max-w-[300px]">{activeLesson.title}</span>
            </div>
            <div className="flex items-center gap-4">
               <button onClick={toggleTheme} className="text-gray-400 hover:text-white" title="Toggle Theme">
                  {isDark ? '☀' : '☾'}
               </button>
               <span className="text-xs font-bold bg-[#333] px-2 py-1 rounded text-white">EN</span>
            </div>
         </div>

         {/* Content Scroll Area */}
         <div id="content-scroll-area" className="flex-1 overflow-y-auto w-full relative">
             {/* Hero / Banner Section */}
             <div className="relative w-full h-[300px] shrink-0">
                <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-transparent to-black/60 z-10" />
                <img 
                   src={courseIntros['data-science-beginner']?.heroImg || "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&w=1200"}
                   alt="Data Science Background" 
                   className="w-full h-full object-cover"
                   onError={(e) => {
                      e.currentTarget.src = "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&w=1200";
                   }}
                />
                
                <div className="absolute bottom-0 left-0 w-full p-8 z-20">
                   <h1 className="text-4xl font-bold text-white mb-2 shadow-sm drop-shadow-lg">
                      {activeModule.id.split('-')[1]}.{activeLessonIndex + 1} {activeLesson.title}
                   </h1>
                   <div className="flex items-center gap-2 text-white/80 animate-bounce mt-4 cursor-pointer" onClick={() => {
                      document.getElementById('content-scroll-area')?.scrollTo({ top: 300, behavior: 'smooth' });
                   }}>
                      <span className="text-sm font-medium">Scroll to begin</span>
                      <ChevronDown className="w-4 h-4" />
                   </div>
                </div>

                <button 
                   className="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-blue-600/90 hover:bg-blue-500 text-white p-2 rounded-r-lg shadow-lg transition-transform hover:scale-110"
                   onClick={() => {
                      if (activeLessonIndex > 0) setActiveLessonIndex(activeLessonIndex - 1);
                   }}
                   disabled={activeLessonIndex === 0}
                   style={{ opacity: activeLessonIndex === 0 ? 0 : 1 }}
                >
                   <ChevronRight className="w-6 h-6 rotate-180" />
                </button>
                <button 
                   className="absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-blue-600/90 hover:bg-blue-500 text-white p-2 rounded-l-lg shadow-lg transition-transform hover:scale-110"
                   onClick={() => {
                      if (activeLessonIndex < activeModule.lessons.length - 1) setActiveLessonIndex(activeLessonIndex + 1);
                   }}
                   disabled={activeLessonIndex === activeModule.lessons.length - 1}
                   style={{ opacity: activeLessonIndex === activeModule.lessons.length - 1 ? 0 : 1 }}
                >
                   <ChevronRight className="w-6 h-6" />
                </button>
             </div>

             {/* Tabs Navigation */}
             <div className="sticky top-0 z-30 flex items-center gap-6 px-8 lg:px-16 border-b border-[#333] bg-[#1e1e1e] shrink-0">
                <button 
                   onClick={() => setActiveContentTab('lesson')}
                   className={clsx("py-4 text-sm font-medium border-b-2 transition-colors flex items-center gap-2", activeContentTab === 'lesson' ? "border-[#00bceb] text-white" : "border-transparent text-gray-400 hover:text-white")}
                >
                   <BookOpen className="w-4 h-4" /> Lesson
                </button>
                <button 
                   onClick={() => setActiveContentTab('syntax')}
                   className={clsx("py-4 text-sm font-medium border-b-2 transition-colors flex items-center gap-2", activeContentTab === 'syntax' ? "border-[#00bceb] text-white" : "border-transparent text-gray-400 hover:text-white")}
                >
                   <Code className="w-4 h-4" /> Syntax
                </button>
                <button 
                   onClick={() => setActiveContentTab('compiler')}
                   className={clsx("py-4 text-sm font-medium border-b-2 transition-colors flex items-center gap-2", activeContentTab === 'compiler' ? "border-[#00bceb] text-white" : "border-transparent text-gray-400 hover:text-white")}
                >
                   <Play className="w-4 h-4" /> Python Lab
                </button>
             </div>

             {/* Content Body */}
             <div className="p-8 lg:px-16 w-full">
                <div className="max-w-screen-2xl mx-auto grid grid-cols-1 xl:grid-cols-3 gap-8">
                   <div className="xl:col-span-2">

                    {/* Tab Content */}
                    <div className="min-h-[500px]">
                       {activeContentTab === 'lesson' && (
                          <div className="animate-fadeIn">
                             <div 
                               className={`prose ${isDark ? 'prose-invert' : ''} prose-lg max-w-none prose-headings:text-[#00bceb] prose-a:text-blue-400 prose-code:text-[#00bceb] prose-pre:bg-[#1e1e1e] prose-pre:border prose-pre:border-[#333]`}
                               dangerouslySetInnerHTML={{ __html: activeLesson.content }} 
                             />
                             
                             {/* Navigation Buttons */}
                             <div className="mt-12 flex justify-between items-center py-8 border-t border-gray-800">
                                <button 
                                   onClick={() => {
                                      if (activeLessonIndex > 0) {
                                         setActiveLessonIndex(activeLessonIndex - 1);
                                      } else {
                                         handlePrevModule();
                                      }
                                   }}
                                   disabled={activeLessonIndex === 0 && currentModuleIndex === 0}
                                   className={`flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-colors ${
                                      (activeLessonIndex === 0 && currentModuleIndex === 0)
                                      ? 'text-gray-600 cursor-not-allowed' 
                                      : 'bg-[#2d2d2d] hover:bg-[#3e3e42] text-white'
                                   }`}
                                >
                                   <ChevronLeft className="w-4 h-4" /> Previous
                                </button>
                                
                                <button 
                                   onClick={() => {
                                      // Mark current as completed
                                      setCompletedLessons(prev => new Set(prev).add(`${activeModuleId}-${activeLessonIndex}`));
                                      
                                      if (activeLessonIndex < activeModule.lessons.length - 1) {
                                         setActiveLessonIndex(activeLessonIndex + 1);
                                      } else if (currentModuleIndex < courseData.length - 1) {
                                         handleNextModule();
                                      } else {
                                         setShowCompletionModal(true);
                                      }
                                   }}
                                   className="flex items-center gap-2 px-6 py-3 rounded-full font-medium bg-[#00bceb] hover:bg-[#00a0c6] text-white transition-colors shadow-lg shadow-[#00bceb]/20"
                                >
                                   {activeLessonIndex === activeModule.lessons.length - 1 && currentModuleIndex === courseData.length - 1 ? 'Finish Course' : 'Next Topic'}
                                   <ChevronRight className="w-4 h-4" />
                                </button>
                             </div>
                          </div>
                       )}

                       {activeContentTab === 'syntax' && (
                          <div className="space-y-6 animate-fadeIn">
                             <h2 className="text-2xl font-bold text-white mb-6">Syntax & Resources</h2>
                             {activeLesson.syntax ? (
                                activeLesson.syntax.map((item, idx) => (
                                   <div key={idx} className="bg-[#1e1e1e] border border-[#333] rounded-lg overflow-hidden shadow-md">
                                      <div className="px-4 py-3 bg-[#252526] border-b border-[#333] font-mono text-sm text-[#00bceb] font-bold">
                                         {item.title}
                                      </div>
                                      <div className="p-6 font-mono text-sm text-gray-300 whitespace-pre-wrap bg-[#121212]">
                                         {renderContentWithLinks(item.content)}
                                      </div>
                                   </div>
                                ))
                             ) : (
                                <div className="text-center py-16 text-gray-500 bg-[#1e1e1e]/50 rounded-xl border border-[#333] border-dashed">
                                   <Code className="w-16 h-16 mx-auto mb-4 opacity-30" />
                                   <p className="text-lg">No syntax examples available for this lesson.</p>
                                </div>
                             )}
                          </div>
                       )}

                       {activeContentTab === 'compiler' && (
                          <div className="h-full flex flex-col animate-fadeIn gap-4 min-h-[600px]">
                             <div className="flex items-center justify-between mb-2">
                                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                    <Terminal className="w-5 h-5 text-[#00bceb]" />
                                    Python Live Lab
                                </h2>
                                <div className="flex gap-2">
                                    <button 
                                        onClick={() => setPythonCode('')}
                                        className="p-2 rounded-lg bg-[#2d2d2d] hover:bg-[#3e3e42] text-gray-300 transition-colors"
                                        title="Clear Code"
                                    >
                                        <RotateCcw className="w-4 h-4" />
                                    </button>
                                    <button 
                                        onClick={runPythonCode}
                                        disabled={!pyodide || isPyodideLoading}
                                        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                                            !pyodide || isPyodideLoading 
                                            ? 'bg-gray-600 cursor-not-allowed opacity-50' 
                                            : 'bg-green-600 hover:bg-green-500 text-white shadow-lg hover:shadow-green-500/20'
                                        }`}
                                    >
                                        {isPyodideLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 fill-current" />}
                                        {isPyodideLoading ? 'Loading Env...' : 'Run Code'}
                                    </button>
                                </div>
                             </div>

                             <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 flex-1">
                                {/* Editor */}
                                <div className="flex flex-col bg-[#1e1e1e] border border-[#333] rounded-xl overflow-hidden shadow-xl">
                                    <div className="px-4 py-2 bg-[#252526] border-b border-[#333] text-xs font-mono text-gray-400 flex justify-between">
                                        <span>main.py</span>
                                        <span>Python 3.11 (Pyodide)</span>
                                    </div>
                                    <textarea
                                        value={pythonCode}
                                        onChange={(e) => setPythonCode(e.target.value)}
                                        className="flex-1 w-full bg-[#1e1e1e] text-gray-200 font-mono text-sm p-4 outline-none resize-none selection:bg-blue-500/30"
                                        spellCheck="false"
                                        placeholder="Write your Python code here..."
                                    />
                                </div>

                                {/* Output */}
                                <div className="flex flex-col bg-[#0a0a0a] border border-[#333] rounded-xl overflow-hidden shadow-xl relative">
                                    <div className="px-4 py-2 bg-[#1a1a1a] border-b border-[#333] text-xs font-mono text-gray-400">
                                        Output Console
                                    </div>
                                    <pre className="flex-1 p-4 font-mono text-sm text-green-400 whitespace-pre-wrap overflow-auto custom-scrollbar">
                                        {pyodideOutput || (isPyodideLoading ? 'Loading Python environment...' : 'Ready to run.')}
                                    </pre>
                                    {/* Placeholder for future plot support */}
                                    <div id="plot-output" className="bg-white/5 border-t border-[#333] min-h-[0px] empty:hidden"></div>
                                </div>
                             </div>
                             
                             <div className="text-xs text-gray-500 text-center mt-2">
                                Powered by Pyodide (WebAssembly). Runs locally in your browser.
                             </div>
                          </div>
                       )}
                    </div>
                 </div>
                 
                 {/* RIGHT COLUMN - CHAT (1/3) */}
                 <div className="hidden xl:block xl:col-span-1 pl-4">
                    <div className="sticky top-6">
                       <ChatPanel 
                          isDark={isDark} 
                          messages={messages} 
                          loading={loading} 
                          onSend={handleSendMessage} 
                       />
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </div>

      {/* Completion Modal */}
      {showCompletionModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#1e1e1e] border border-[#333] rounded-2xl p-8 max-w-md w-full text-center relative shadow-2xl animate-scaleIn">
            <button 
              onClick={() => setShowCompletionModal(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            
            <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-green-500" />
            </div>
            
            <h2 className="text-2xl font-bold text-white mb-2">Course Completed!</h2>
            <p className="text-gray-400 mb-8">
              Congratulations! You have successfully completed the Data Science Beginner course.
            </p>
            
            <div className="flex flex-col gap-3">
              <button
                onClick={() => navigate('/student-portal')}
                className="w-full py-3 bg-[#00bceb] hover:bg-[#00a0c6] text-white rounded-xl font-medium transition-colors shadow-lg shadow-[#00bceb]/20"
              >
                Back to Dashboard
              </button>
              <button
                onClick={() => setShowCompletionModal(false)}
                className="w-full py-3 bg-[#2d2d2d] hover:bg-[#3e3e42] text-gray-300 hover:text-white rounded-xl font-medium transition-colors"
              >
                Stay Here
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Dock */}
      <FloatingDock
        isDark={isDark}
        onToggleTheme={toggleTheme}
        onPrevModule={handlePrevModule}
        disabledPrev={disabledPrev}
        onNextModule={handleNextModule}
        disabledNext={disabledNext}
        onHome={handleHome}
      />
    </div>
  );
};

export default CourseLearningDataScienceBeginner;
