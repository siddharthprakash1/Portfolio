import aboutImg from "../assets/abtme.jpg";
import { ABOUT_TEXT } from "../constants";
import { motion } from "framer-motion";
import resumeFile from "../assets/SiddharthPrakash.pdf"; // Import your resume file

const About = () => {
  const handleResumeDownload = () => {
    const link = document.createElement("a");
    link.href = resumeFile;
    link.download = "Resume.pdf"; // Set the desired name for the downloaded file
    link.click();
  };

  return (
    <div className="border-b border-neutral-900 pb-4">
      <h2 className="my-20 text-center text-4xl">
        About <span className="text-neutral-500">Me</span>
      </h2>
      <div className="flex flex-wrap">
        <motion.div
          whileInView={{ opacity: 1, x: 0 }}
          initial={{ opacity: 0, x: -100 }}
          transition={{ duration: 0.6 }}
          className="w-full lg:w-1/2 lg:p-8"
        >
          <div className="flex items-center justify-center">
            <img
              src={aboutImg}
              alt="about"
              style={{ width: "350px", height: "440px ", borderRadius: "8px" }}
            />
          </div>
        </motion.div>
        <motion.div
          whileInView={{ opacity: 1, x: 0 }}
          initial={{ opacity: 0, x: 100 }}
          transition={{ duration: 0.6 }}
          className="w-full lg:w-1/2"
        >
          <div className="flex flex-col justify-center lg:justify-start">
            <p className="my-2 max-w-xl py-6">{ABOUT_TEXT}</p>
            {/* Add a section for resume */}
            <div className="flex items-center">
              <h3 className="mr-4 text-lg font-semibold text-purple-300">Resume:</h3>
              <button
                onClick={handleResumeDownload}
                className=" bg-neutral-900 hover:bg-purple-900 text-neutral-200 font-bold py-2 px-4 rounded"
              >
                Download
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default About;