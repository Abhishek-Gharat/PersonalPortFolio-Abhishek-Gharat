import React from "react";
import { motion } from "framer-motion";

const WorkCard = ({ img, name, description, onClick, theme }) => {
  const glowColor = theme === "dark" ? "rgba(255, 255, 255, 0.8)" : "rgba(0, 0, 0, 0.8)";

  return (
    <motion.div
      className="overflow-hidden rounded-lg p-2 laptop:p-4 first:ml-0 link"
      onClick={onClick}
      whileHover={{ scale: 1.05, rotateY: 10, rotateX: 10, boxShadow: `0 0 10px 0 ${glowColor}` }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        className="relative rounded-lg overflow-hidden transition-all ease-out duration-300 h-48 mob:h-64"
        style={{ height: "400px" }} // Adjusted the height here for mobile
      >
        <motion.img
          alt={name}
          className="h-full w-full object-cover object-center hover:scale-110 transition-all ease-out duration-300"
          src={img}
          style={{ objectFit: "cover" }} // Ensures the image covers the container
        />
      </motion.div>
      <motion.h1 className="mt-3 text-2xl font-medium">
        {name ? name : "Project Name"}
      </motion.h1>
      <motion.h2 className="text-lg opacity-50">
        {description ? description : "Description"}
      </motion.h2>
    </motion.div>
  );
};

export default WorkCard;
