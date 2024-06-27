import IconCloud from "@/components/magicui/icon-cloud";

const slugs = [
  "typescript",
  "javascript",
  "C",
  "java",
  "react",
  "tensorflow",
  "C++",
  "html5",
  "css3",
  "Python",
  "Pytorch",
  "Pandas",
  "sql",
  "adobe",
  "adobelightroom",
  "amazonaws",
  "cplusplus",
  "csharp",
  "nginx",
  "vercel",
  "c",
  "meta",
  "bootstrap",
  "github",
  "pytorch",
  "docker",
  "git",
  "jira",
  "github",
  "gitlab",
  "visualstudiocode",
  "androidstudio",
  "python",
  "figma",
  "7zip",
];

export function IconCloudDemo() {
  return (
    <div className="flex h-full w-full items-center justify-center overflow-hidden bg-background p-4 md:px-20 md:pb-20 md:pt-8">
      <IconCloud iconSlugs={slugs} />
    </div>
  );
}

const Technologies = () => {
  return (
    <div className="pb-24">
      <h2 className="my-20 text-center text-2xl md:text-4xl">Technologies</h2>
      <div className="w-full">
        <IconCloudDemo />
      </div>
    </div>
  );
};

export default Technologies;
