import project1 from "../assets/projects/cifar.jpg";
import project2 from "../assets/projects/bert.jpg";
import project3 from "../assets/projects/gym.png";
import project4 from "../assets/projects/openai.jpg";
import project5 from "../assets/projects/gifmaker_me.gif";
import project6 from "../assets/projects/dcgan.gif";
import project7 from "../assets/projects/weather.png";
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
    title: "MLTrader: A Machine Learning Trading Bot",
    image: project5,
    description:
      "MLTrader: An automated trading bot that executes trades with SPY ETF based on sentiment analysis of financial news using FinBERT and Alpaca APIs.",
      technologies: ["FinBERT", "Alpaca Trade API", "Yahoo Finance API", "TensorFlow", "Pandas"],
  },
  {
    title: "Image Generation of Numbers Using MNIST Dataset and DCGAN",
    image: project6,
    description:
      "Deep Convolutional Generative Adversarial Networks (DCGAN) for generating handwritten digit images on the MNIST dataset, with Jupyter Notebooks for data loading, model building, training, and visualization.",
      technologies: ["Python", "TensorFlow", "NumPy", "Matplotlib"]
  },
  {
    title: "Gym Equipment Identifier & Exercise Recommender",
    image: project3,
    description:
      " A system that utilizes a CNN model to identify gym equipment with 92% accuracy and recommends personalized exercise routines based on the identified equipment.",
    technologies: ["TensorFlow", "Manim", "Numpy", "Pandas"],
  },
  {
    title: " Text-To-Image Generator",
    image: project4,
    description:
      "Web app generating images from text using OpenAI API. ",
    technologies: ["HTML", "OpenAI API", "JavaScript"],
  },
  {
    title: " Question And Answer Model",
    image: project2,
    description:
      "This uses the Hugging Face library ’deepset/bert-base-cased-squad2’ for a question answer model. ",
    technologies: ["JupyterNotebook", "Hugging Face", "Bert"],
  },
  {
    title: "Image Classification",
    image: project1,
    description:
      "Using ANN and CNN on the CIFAR-10 dataset achieved percision of 59% and 80%.",
    technologies: ["JupyterNotebook", "Hugging Face", "Bert"],
  },
  {
    title: "Weather App",
    image: project7,
    description:
      " A weather app that provides current weather conditions for a specified city using API data.It has Search functionality, error handling, weather details including temperature, humidity, wind speed, and weather icon.",
    technologies: ["OpenWeatherMap API", "HTML", "CSS"],
  },
];

export const CONTACT = {
  address: "PES EC Campus,Hosur Rd,Bangalore-560100 ",
  phoneNo: "+91 7702842402 ",
  email: "iamsid0011@gmail.com",
};
