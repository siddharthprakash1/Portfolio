import React, { useState } from 'react';
import logo from "../assets/c.jpg"
import { FaLinkedin } from "react-icons/fa";
import { FaGithub } from "react-icons/fa";
import { FaSquareXTwitter } from "react-icons/fa6";
import { FaInstagram } from "react-icons/fa";
import { motion } from "framer-motion"; // Import motion

const Navbar = () => {
    const [touchedIcon, setTouchedIcon] = useState(null);

    const handleTouchStart = (iconName) => {
        setTouchedIcon(iconName);
    };

    const handleTouchEnd = () => {
        setTouchedIcon(null);
    };
    return (
        <nav className="mb-5 flex items-center justify-between py-6">
            <div className="flex flex-shrink-0 items-center">
                <img className="mx-2 w-10" src={logo} alt="logo"
                    style={{
                        width: "50px", // Adjust the width as desired
                        height: "auto", // This will maintain the aspect ratio
                        borderRadius: "5px", // Adjust the value to control the roundness
                    }} />
            </div>
            
            <div className="m-8 flex items-center justify-center gap-4 text-2xl">
                <a href="https://www.instagram.com/snapsidphotography/"
                    target="_blank"
                    rel="noopener noreferrer"
                    onTouchStart={() => handleTouchStart('instagram')}
                    onTouchEnd={handleTouchEnd}>
                    <motion.div
                        whileHover={{ scale: 1.5 }}
                        whileTap={{ scale: 0.9 }}
                    >
                        <FaInstagram />
                    </motion.div>
                </a>
                <a href="https://github.com/siddharthprakash1" target="_blank" rel="noopener noreferrer" onTouchStart={() => handleTouchStart('github')}  onTouchEnd={handleTouchEnd}> 
                    <motion.div
                        whileHover={{ scale: 1.5 }}
                        whileTap={{ scale: 0.9 }}
                    >
                        <FaGithub />
                    </motion.div>
                </a>
                <a href="https://www.linkedin.com/in/siddharth-prakash-771596241/" target="_blank" rel="noopener noreferrer"  onTouchStart={() => handleTouchStart('linkedin')} onTouchEnd={handleTouchEnd}>
                    <motion.div
                        whileHover={{ scale: 1.5 }}
                        whileTap={{ scale: 0.9 }}
                    >
                        <FaLinkedin />
                    </motion.div>
                </a>
                <a href="https://x.com/_siddharth11_" target="_blank" rel="noopener noreferrer" onTouchStart={() => handleTouchStart('twitter')} onTouchEnd={handleTouchEnd}>
                    <motion.div
                        whileHover={{ scale: 1.5 }}
                        whileTap={{ scale: 0.9 }}
                    >
                        <FaSquareXTwitter />
                    </motion.div>
                </a>
            </div>
        </nav>
    )
};

export default Navbar;