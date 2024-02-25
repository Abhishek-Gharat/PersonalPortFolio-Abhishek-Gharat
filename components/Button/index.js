import React from "react";
import { useTheme } from "next-themes";
import { motion } from "framer-motion";
import data from "../../data/portfolio.json";

const Button = ({ children, type, onClick, classes }) => {
  const { theme } = useTheme();
  if (type === "primary") {
    return (
      <motion.button
        onClick={onClick}
        type="button"
        whileHover={{ scale: 1.1 }}
        transition={{ duration: 0.3 }}
        className={`text-sm tablet:text-base p-1 laptop:p-2 m-1 laptop:m-2 rounded-lg ${
          theme === "dark" ? "text-black" : "text-white"
        }  transition-all duration-300 ease-out first:ml-0 active:scale-100 link ${
          data.showCursor && "cursor-none"
        }  ${classes}`}
      >
        {children}
      </motion.button>
    );
  }
  return (
    <motion.button
      onClick={onClick}
      type="button"
      whileHover={{ 
        scale: 1.1,
        textShadow: "0 0 8px rgb(58, 208, 255), 0 0 16px rgb(58, 209, 255)", // Neon effect
        transition: { duration: 0.2 }
      }}
      className={`text-sm tablet:text-base p-1 laptop:p-2 m-1 laptop:m-2 rounded-lg flex items-center transition-all ease-out duration-300 ${
        theme === "dark"
          ? "text-white"
          : ""
      } active:scale-100  tablet:first:ml-0  ${
        data.showCursor && "cursor-none"
      } ${classes} link`}
    >
      {children}
    </motion.button>
  );
};

export default Button;
