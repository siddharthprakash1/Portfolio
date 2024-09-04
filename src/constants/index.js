import project1 from "../assets/projects/Llama-3.1.jpg";
import project2 from "../assets/projects/compressed.gif";
import project3 from "../assets/projects/gym.png";
import project4 from "../assets/projects/depth_capture.gif";
import project5 from "../assets/projects/gifmaker_me.gif";
import project6 from "../assets/projects/dcgan.gif";
import project7 from "../assets/projects/meta-ollama-llama3.png";
import project8 from "../assets/projects/gif2.gif";
import project9 from "../assets/projects/Llama-3.jpg";

export const HERO_CONTENT = `A driven and versatile computer science engineering student with a diverse skill set spanning Gen AI ,Machine Learning, Data Analytics, full-stack web development and cloud technologies. Adept in Python, Langchain, Crewai, Tensorflow, Pytorch, React, Node.js, and AWS, with hands-on experience in developing innovative projects such as LLM powered (Twitter)X bots and voice assistants using llama3.1-70b model. Committed to delivering impactful solutions through a combination of technical expertise, problem-solving abilities, and a passion for continuous learning. Seeking challenging opportunities to apply my skills and contribute to cutting-edge technological advancements.`;

export const ABOUT_TEXT = `Motivated computer science engineering student adept in machine learning, data analytics, and full-stack web development. Proficient in Python, OpenCV, React, Node.js, and AWS, with a proven track record of developing impactful projects like facial recognition systems and sports analytics using Monte Carlo simulations. A natural problem-solver with strong analytical and technical skills. Beyond academics, I pursue photography professionally, capturing the world through my lens, and enjoy an active lifestyle playing badminton and hitting the gym regularly.`;

export const EXPERIENCES = [

  {
    year: "Jun-July 2023",
    role: "Ai Intern",
    company: "LogoJech Technologies",
    description: `During my internship at LogoJech Technologies, I implemented advanced AI-driven facial recognition systems, integrating them with AWS for efficient data management.`,
    technologies: ["Python", "OpenCV", "dlib", "AWS DynamoDB", "Android"],
  },
  {
    year: "Apr-May 2023",
    role: "Marketing Intern",
    company: "Sahai",
    description: ` I achieved significant social media growth by optimizing hashtags on Instagram and developing a LinkedIn strategy that increased website traffic by 20%.`,
    technologies: ["Instagram", "LinkedIn", "SEO", "Analytics"],
  },
  {
    year: "June-Aug 2023",
    role: " Project Research Associate",
    company: "Sports Technology And Analytics Research Centre (STARC)",
    description: ` I collaborated with my team to develop advanced machine learning models for football match prediction and strategy optimization using extensive data analysis and Monte Carlo simulations`,
    technologies: ["Python", "Numpy", "Pandas", "Canva"],
  },
  {
    year: "June - August 2024",
    role: "Freelance Web Developer",
    company: "Trekzo Resources Private Limited",
    description: `Developing and optimizing the landing page for Trekzo Resources. Implementing SEO strategies and managing Google Ads campaigns to enhance the page's visibility and ranking on Google search results.`,
    technologies: ["Bootstrap", "CSS", "HTML"],
  }
  
];

export const PROJECTS = [
  {
    title: "CodeGen Pro: Intelligent Code Generation Agent",
    image: project7,
    description:
      "This is a project designed to create a multi-functional AI agent capable of reading and understanding API documentation and generating code based on user prompts. This project utilizes various components including the Llama Index, Ollama models, Pydantic for output parsing, and more.",
    technologies: ["Llama Index", " Ollama", "Pydantic", "Vector Embeddings", "Prompt Enginering", "Mistral", "Codellama", "Local llm"],
  },

  {
    title: "VoiceVision AI: Interactive Voice Assistant with Webcam",
    image: project9, // Replace with the correct image reference
    description:
      "This project implements an AI voice assistant that integrates speech recognition, text-to-speech, and webcam feed. Powered by the Llama 3 language model via Ollama, it provides AI-powered responses and manages conversation history with LangChain.",
    technologies: ["Python", "OpenCV", "pyttsx3", "SpeechRecognition", "LangChain", "Ollama", "python-dotenv"],
  },

  {
    title: "DepthVision Pro: Real-Time 3D Mapping",
    image: project4,
    description:
      "Experience advanced depth mapping with AiDepthVision, utilizing the MiDaS model to generate real-time depth maps from a webcam feed.",
    technologies: ["PyTorch", "OpenCV", "Matplotlib", "Numpy", "Imageio"],
  },
  {
    title: "AlgoNavigator: Pathfinding Algorithm Visualizer",
    image: project2,
    description:
      "Visualize complex pathfinding algorithms with PathFinderVisualization. Supports Dijkstra's and A* Algorithms to find the shortest path on a grid, built with React.",
    technologies: ["React", "Css", "Dsa", "Html", "JavaScript"],
  },
  {
    title: "NumGen DCGAN: Handwritten Digit Synthesis",
    image: project6,
    description:
      "Generate realistic handwritten digits using Deep Convolutional Generative Adversarial Networks (DCGAN) on the MNIST dataset. Includes data loading, model building, training, and visualization in Jupyter Notebooks.",
    technologies: ["Python", "TensorFlow", "NumPy", "Matplotlib"],
  },
  {
    title: "MLTrader Pro: Intelligent Financial Trading Bot",
    image: project5,
    description:
      "MLTrader automates trades with the SPY ETF using sentiment analysis of financial news via FinBERT and Alpaca APIs for informed decision-making.",
    technologies: ["FinBERT", "Alpaca Trade API", "Yahoo Finance API", "TensorFlow", "Pandas"],
  },
  {
    title: "GymGenie: Intelligent Equipment Identifier & Exercise Recommender",
    image: project3,
    description:
      "Identify gym equipment with 92% accuracy using a CNN model and receive personalized exercise recommendations based on the identified equipment.",
    technologies: ["TensorFlow", "Manim", "Numpy", "Pandas"],
  },
  {
    title: "ShadowSpeak: Real-Time Anonymous Chat Platform",
    image: project8,
    description:
      "Engage in instant messaging with ShadowSpeak, a real-time chat application built with Socket.IO. Chat anonymously or with your name visible.",
    technologies: ["JavaScript", "SocketIO", "Moment.js", "DOM api"],
  },
  {
    title: "LLaMA3-70B Powered AI Content Curator for X in GenAI, LangChain, and CrewAI",
    image: project1,
    description:
      " This advanced system leverages the powerful LLaMA3-70B model through the Groq API to discover, analyze, and share cutting-edge content in Generative AI, LangChain, and CrewAI. Stay updated with the latest developments by following our curator bot @AiBuzzDaily on X (formerly Twitter).",
    technologies: ["Groq", "Serper", "CrewAI","LLaMa3-70B"],
  },
  
];

export const CONTACT = {
  address: "PES EC Campus,Hosur Rd,Bangalore-560100 ",
  phoneNo: "+91 7702842402 ",
  email: "iamsid0011@gmail.com",
};
