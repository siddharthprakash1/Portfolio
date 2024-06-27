/*import { RiReactjsLine } from "react-icons/ri";
import { SiPython } from "react-icons/si";
import { SiCplusplus } from "react-icons/si";
import { SiTensorflow } from "react-icons/si";
import { DiMysql } from "react-icons/di";
import { SiNumpy } from "react-icons/si";
import { FaNodeJs } from "react-icons/fa6";
import {motion} from "framer-motion"
const iconVariants=(duration)=>({
    initial:{y:-10},
    animate:{
        y:[10,-10],
        transition:{
            duration:duration,
            ease:"linear",
            repeat:Infinity,
            repeatType:"reverse",
        },
    },
})
const Technologies = () => {
    return( 
        <div className="border-b border-neutral-800 pb-24">
            <motion.h2 
            whileInView={{opacity:1, y:0}}
            initial={{opacity:0,y:-100}}
            transition={{duration:1.5}}
            className="my-20 text-center text-4xl">Technologies</motion.h2>
            <motion.div 
            whileInView={{opacity:1, x:0}}
            initial={{opacity:0,x:-100}}
            transition={{duration:1.5}}
            className="flex flex-wrap items-center justify-center gap-4">
                <motion.div variants={iconVariants(2.7)} initial="initial" animate="animate" className="rounded-2xl border-4 border-neutral-800 p-4" >
                    <RiReactjsLine className="text-7xl text-cyan-400"/>
                </motion.div>
                <motion.div variants={iconVariants(3.2)} initial="initial" animate="animate" className="rounded-2xl border-4 border-neutral-800 p-4" >
                    <SiPython className="text-7xl text-blue-800"/>
                </motion.div>
                <motion.div variants={iconVariants(2.2)} initial="initial" animate="animate" className="rounded-2xl border-4 border-neutral-800 p-4" >
                    <SiCplusplus className="text-7xl text-grey-100"/>
                </motion.div>
                <motion.div variants={iconVariants(1.2)} initial="initial" animate="animate" className="rounded-2xl border-4 border-neutral-800 p-4" >
                    <SiTensorflow  className="text-7xl text-orange-500"/>
                </motion.div>
                <motion.div variants={iconVariants(1.7)} initial="initial" animate="animate" className="rounded-2xl border-4 border-neutral-800 p-4" >
                    <DiMysql className="text-7xl  text-blue-600"/>
                </motion.div>
                <motion.div variants={iconVariants(4)} initial="initial" animate="animate" className="rounded-2xl border-4 border-neutral-800 p-4" >
                    <SiNumpy className="text-7xl text-yellow-200"/>
                </motion.div>
                <motion.div variants={iconVariants(1)} initial="initial" animate="animate" className="rounded-2xl border-4 border-neutral-800 p-4" >
                    <FaNodeJs className="text-7xl text-green-600"/>
                </motion.div>
            </motion.div>
        </div>

    );  
}

export default Technologies
*/
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
    <div className="flex h-full w-full items-center justify-center overflow-hidden bg-background px-20 pb-20 pt-8">
      <IconCloud iconSlugs={slugs} />
    </div>
  );
}

const Technologies = () => {
  return (
    <div className="pb-24">
      <h2 className="my-20 text-center text-4xl">Technologies</h2>
      <div className="w-full">
        <IconCloudDemo />
      </div>
    </div>
  );
};

export default Technologies;
