import { SiPython, SiTensorflow, SiPytorch, SiReact, SiNodedotjs, SiDocker, SiAmazonaws, SiGit, SiJavascript, SiPostgresql, SiMongodb, SiKubernetes } from "react-icons/si";

const technologies = [
  { name: "Python", icon: SiPython },
  { name: "JavaScript", icon: SiJavascript },
  { name: "React", icon: SiReact },
  { name: "Node.js", icon: SiNodedotjs },
  { name: "TensorFlow", icon: SiTensorflow },
  { name: "PyTorch", icon: SiPytorch },
  { name: "PostgreSQL", icon: SiPostgresql },
  { name: "MongoDB", icon: SiMongodb },
  { name: "Docker", icon: SiDocker },
  { name: "Kubernetes", icon: SiKubernetes },
  { name: "AWS", icon: SiAmazonaws },
  { name: "Git", icon: SiGit },
];

const skills = [
  { name: "AI/ML & LLM Systems", level: 95 },
  { name: "Full-Stack Development", level: 88 },
  { name: "Protocol Engineering", level: 85 },
  { name: "Cloud & DevOps", level: 82 },
];

const Technologies = () => {
  return (
    <section id="technologies" className="py-24">
      <div className="text-center mb-16">
        <div className="section-label justify-center">Skills & Tools</div>
        <h2 className="section-title">Technologies I <span className="text-[#10b981]">work with</span></h2>
      </div>

      <div className="grid lg:grid-cols-2 gap-12">
        <div>
          <h3 className="text-lg font-display font-semibold text-white mb-6">Tech Stack</h3>
          <div className="grid grid-cols-4 gap-3">
            {technologies.map((tech, index) => (
              <div key={index} className="flex flex-col items-center p-4 rounded-xl bg-[#181818] border border-gray-800 hover:border-[#10b981] transition-colors">
                <tech.icon className="text-2xl text-gray-400 mb-2" />
                <span className="text-xs text-gray-500">{tech.name}</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-display font-semibold text-white mb-6">Expertise</h3>
          <div className="space-y-6">
            {skills.map((skill, index) => (
              <div key={index}>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-400">{skill.name}</span>
                  <span className="text-gray-500 text-sm">{skill.level}%</span>
                </div>
                <div className="h-2 bg-[#181818] rounded-full overflow-hidden">
                  <div className="h-full bg-[#10b981] rounded-full" style={{ width: `${skill.level}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Technologies;
