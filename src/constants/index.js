import project1 from "../assets/projects/cifar.jpg";
import project2 from "../assets/projects/compressed.gif";
import project3 from "../assets/projects/gym.png";
import project4 from "../assets/projects/depth_capture.gif";
import project5 from "../assets/projects/gifmaker_me.gif";
import project6 from "../assets/projects/dcgan.gif";
import project7 from "../assets/projects/meta-ollama-llama3.png";
import project8 from "../assets/projects/gif2.gif";

export const HERO_CONTENT = `A driven and versatile computer science engineering student with a diverse skill set spanning machine learning, data analytics, full-stack web development, and cloud technologies. Adept in Python, React, Node.js, and AWS, with hands-on experience in developing innovative projects such as facial recognition systems and sports analytics using Monte Carlo simulations. Committed to delivering impactful solutions through a combination of technical expertise, problem-solving abilities, and a passion for continuous learning. Seeking challenging opportunities to apply my skills and contribute to cutting-edge technological advancements.`;

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
];

export const PROJECTS = [
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
    title: "CIFAR-Classify: Advanced Image Recognition",
    image: project1,
    description:
      "Achieve high precision in image classification with CIFAR-Classify using ANN and CNN models on the CIFAR-10 dataset, reaching up to 80% accuracy.",
    technologies: ["JupyterNotebook", "Hugging Face", "Bert"],
  },
  {
    title: "CodeGen Pro: Intelligent Code Generation Agent",
    image: project7,
    description:
      "This is a project designed to create a multi-functional AI agent capable of reading and understanding API documentation and generating code based on user prompts. This project utilizes various components including the Llama Index, Ollama models, Pydantic for output parsing, and more.",
    technologies: ["Llama Index", " Ollama", "Pydantic", "Vector Embeddings", "Prompt Enginering", "Mistral", "Codellama", "Local llm"],
  },
];

export const CONTACT = {
  address: "PES EC Campus,Hosur Rd,Bangalore-560100 ",
  phoneNo: "+91 7702842402 ",
  email: "iamsid0011@gmail.com",
};
