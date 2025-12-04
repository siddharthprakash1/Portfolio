import project1 from "../assets/projects/Llama-3.1.jpg";
import project2 from "../assets/projects/compressed.gif";
import project3 from "../assets/projects/gym.png";
import project4 from "../assets/projects/depth_capture.gif";
import project5 from "../assets/projects/gifmaker_me.gif";
import project6 from "../assets/projects/dcgan.gif";
import project7 from "../assets/projects/meta-ollama-llama3.png";
import project8 from "../assets/projects/gif2.gif";
import project9 from "../assets/projects/Llama-3.jpg";

export const HERO_CONTENT = `Software Engineer specializing in AI-as-a-Service, building scalable agentic workflows and intelligent systems. Previously at Keysight Technologies where I filed an IP and automated 471+ protocol attributes. Passionate about LLMs, RAG pipelines, and production-grade AI solutions.`;

export const ABOUT_TEXT = `Software Engineer at Couchbase working on AI-as-a-Service systems. I build scalable agentic workflows, internal tools, and automation pipelines. My experience spans from R&D at Keysight Technologies (where I filed an IP) to building AI-powered analysis systems and intelligent recommendation engines. I graduated from PES University with a B.Tech in Computer Science and have worked extensively with LangChain, CrewAI, and various LLM frameworks. Beyond engineering, I'm a professional photographer and have led sponsorship teams procuring 10+ lakhs for college events.`;

export const EXPERIENCES = [
  {
    year: "Oct 2024 - Present",
    role: "Software Engineer",
    company: "Couchbase (AI-as-a-Service Team)",
    description: `Working on AI-as-a-Service systems enabling scalable agentic workflows. Building internal tools and automation pipelines to improve developer productivity. Collaborating with cross-functional AI and platform teams to ship production-grade features.`,
    technologies: ["AI/ML", "LangChain", "Python", "Agentic Systems", "Cloud", "NoSQL"],
    current: true,
  },
  {
    year: "Aug 2024 - Oct 2024",
    role: "Software Engineer",
    company: "Keysight Technologies",
    description: `Converted from R&D Intern to Full-Time Engineer based on performance. Continued development on AI-driven analysis systems and protocol automation tools. Collaborated with CSG Wireline NT and Services team on L2 & L3 protocol workflows.`,
    technologies: ["Python", "AI Systems", "Protocol Analysis", "Automation", "Networking"],
  },
  {
    year: "Feb 2024 - Jun 2024",
    role: "R&D Intern",
    company: "Keysight Technologies",
    description: `Built innovative AI-powered analysis systems and intelligent recommendation engines; filed an IP (intellectual property). Automated 471+ attributes across multiple networking protocols. Built a custom Wireshark dissector for L2 & L3 protocols.`,
    technologies: ["Python", "Wireshark", "AI/ML", "Networking Protocols", "IP Filing"],
  },
  {
    year: "Jun - Aug 2023",
    role: "Project Research Associate",
    company: "Sports Technology and Analytics Research Centre",
    description: `Combined Monte Carlo simulations and ML models to predict football match outcomes. Analyzed data from 25,000+ matches and 10,000 players. Built a user interface for interactive data exploration.`,
    technologies: ["Python", "Machine Learning", "Monte Carlo", "Data Analysis", "UI Development"],
  },
  {
    year: "Jun - Jul 2023",
    role: "AI Intern",
    company: "LogoJech Technologies",
    description: `Revamped a facial recognition system using OpenCV and dlib, reducing memory usage by 20%. Integrated model with AWS DynamoDB and implemented face-liveliness detection for Android, improving security by 40%.`,
    technologies: ["Python", "OpenCV", "dlib", "AWS DynamoDB", "Android", "Agile"],
  },
];

export const PROJECTS = [
  {
    title: "LLaMA3.1-70B AI Content Curator for X",
    image: project1,
    description:
      "Advanced AI content curation system using LLaMA3-70B via Groq API. Bot discovers, analyzes, and shares the latest in GenAI, LangChain, and CrewAI on X. Features 3 specialized agents powered by CrewAI doing 5 tweets at a time.",
    technologies: ["LLaMA3-70B", "Groq API", "CrewAI", "LangChain", "Multi-Agent"],
    link: "https://github.com/siddharthprakash1"
  },
  {
    title: "Neural Nexus: LLM Tournament Framework",
    image: project7,
    description:
      "Strategic battle system pitting different LLMs against each other in Othello/Reversi. Achieved 95% uptime across 1,000+ test games with 8 model configurations. Reduced failed API calls by 40% with exponential backoff error handling.",
    technologies: ["Groq", "Google AI", "Claude", "Game Engine", "API Integration"],
    link: "https://github.com/siddharthprakash1"
  },
  {
    title: "Gemini-Inbox: Intelligent Gmail Assistant",
    image: project9,
    description:
      "AI-powered Gmail assistant using LangChain and Google's Gemini Pro for automated email management. Features robust error handling, rate limiting, Gmail API integration, and web search via Google Serper API.",
    technologies: ["LangChain", "Gemini Pro", "Gmail API", "Serper API", "Python"],
    link: "https://github.com/siddharthprakash1"
  },
  {
    title: "Crypto Insights Dashboard",
    image: project4,
    description:
      "Cryptocurrency analysis platform integrating 3 major APIs with Flask backend. Achieves 5-minute refresh rates, tracks 100+ cryptocurrencies. AI-powered sentiment analysis processes 1000+ daily news articles with 85% classification accuracy.",
    technologies: ["Flask", "Gemini Pro", "CryptoCompare API", "Sentiment Analysis", "Real-time"],
    link: "https://github.com/siddharthprakash1"
  },
  {
    title: "MLTrader: AI Trading Bot",
    image: project5,
    description:
      "Automated trading bot using FinBERT for sentiment analysis. Executes trades on Alpaca and backtests strategies with Yahoo Finance. Improved trading accuracy by 40% through ML-driven decisions.",
    technologies: ["FinBERT", "Alpaca API", "Yahoo Finance", "Sentiment Analysis", "Trading"],
    link: "https://github.com/siddharthprakash1"
  },
  {
    title: "AlgoNavigator: Pathfinding Visualizer",
    image: project2,
    description:
      "Interactive visualization tool for pathfinding algorithms. Supports Dijkstra's and A* with real-time animation, custom obstacles, and performance metrics comparison.",
    technologies: ["React", "Algorithms", "Data Structures", "Visualization", "JavaScript"],
    link: "https://github.com/siddharthprakash1"
  },
  {
    title: "NumGen DCGAN: Digit Synthesis",
    image: project6,
    description:
      "Deep Convolutional GAN trained on MNIST for generating realistic handwritten digits. Complete pipeline from data preprocessing to model training and evaluation.",
    technologies: ["TensorFlow", "DCGAN", "Deep Learning", "Computer Vision", "Python"],
    link: "https://github.com/siddharthprakash1"
  },
  {
    title: "GymGenie: Equipment Identifier",
    image: project3,
    description:
      "CNN-based gym equipment recognition system achieving 92% accuracy. Provides personalized exercise recommendations based on identified equipment.",
    technologies: ["TensorFlow", "CNN", "Transfer Learning", "Mobile ML", "Computer Vision"],
    link: "https://github.com/siddharthprakash1"
  },
  {
    title: "ShadowSpeak: Real-Time Chat",
    image: project8,
    description:
      "Anonymous real-time chat platform built with WebSockets. Features instant messaging, presence indicators, and optional anonymity.",
    technologies: ["Node.js", "Socket.IO", "WebSockets", "Real-time", "JavaScript"],
    link: "https://github.com/siddharthprakash1"
  },
];

export const EDUCATION = {
  degree: "B.Tech in Computer Science",
  university: "PES University",
  period: "Oct 2021 - Apr 2025",
  coursework: ["Machine Intelligence", "Operating Systems", "Computer Networks", "Cloud Computing", "DBMS", "Software Engineering", "DSA"]
};

export const CERTIFICATES = [
  "TensorFlow 2.0: Deep Learning and AI",
  "LangChain - Develop LLM Powered Applications",
  "Supervised Machine Learning: Regression and Classification",
  "AWS Educate: Serverless, Networking, Compute",
  "Linux Kernel Development (LFD103)",
  "Hacktoberfest 2022 Level 4"
];

export const CONTACT = {
  address: "Bangalore, India",
  phoneNo: "+91 7702842402",
  email: "iamsid0011@gmail.com",
};

export const SOCIAL_LINKS = {
  github: "https://github.com/siddharthprakash1",
  linkedin: "https://www.linkedin.com/in/siddharth-prakash-771596241/",
  twitter: "https://x.com/_siddharth11_",
  instagram: "https://www.instagram.com/snapsidphotography/",
  portfolio: "https://siddharthprakash.vercel.app/"
};
