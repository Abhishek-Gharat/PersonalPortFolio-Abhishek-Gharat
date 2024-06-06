import React, { useRef } from "react";
import { useTheme } from "next-themes";
import { motion } from "framer-motion";
import Link from "next/link";
import Header from "../components/Header";
import ServiceCard from "../components/ServiceCard";
import Socials from "../components/Socials";
import WorkCard from "../components/WorkCard";
import { useIsomorphicLayoutEffect } from "../utils";
import { stagger } from "../animations";
import Footer from "../components/Footer";
import Head from "next/head";
import data from "../data/portfolio.json";

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
          theme === "dark" ? "bg-white text-black" : "bg-black text-white"
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
        transition: { duration: 0.5 }
      }}
      className={`text-sm tablet:text-base p-1 laptop:p-2 m-1 laptop:m-2 rounded-lg flex items-center transition-all ease-out duration-300 ${
        theme === "dark"
          ? "hover:bg-slate-0 text-white"
          : "hover:bg-slate-100"
      } active:scale-100  tablet:first:ml-0  ${
        data.showCursor && "cursor-none"
      } ${classes} link`}
    >
      {children}
    </motion.button>
  );
};

// Animation variants
const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

export default function Home() {
  // Ref
  const workRef = useRef();
  const aboutRef = useRef();
  const textOne = useRef();
  const textTwo = useRef();
  const textThree = useRef();
  const textFour = useRef();

  // Handling Scroll
  const handleWorkScroll = () => {
    window.scrollTo({
      top: workRef.current.offsetTop,
      left: 0,
      behavior: "smooth",
    });
  };

  const handleAboutScroll = () => {
    window.scrollTo({
      top: aboutRef.current.offsetTop,
      left: 0,
      behavior: "smooth",
    });
  };

  useIsomorphicLayoutEffect(() => {
    stagger(
      [textOne.current, textTwo.current, textThree.current, textFour.current],
      { y: 40, x: -10, transform: "scale(0.95) skew(10deg)" },
      { y: 0, x: 0, transform: "scale(1)" }
    );
  }, []);

  return (
    <div className={`relative ${data.showCursor && "cursor-none"}`}>
      <Head>
        <title>{data.name}</title>
      </Head>

      <div className="gradient-circle"></div>
      <div className="gradient-circle-bottom"></div>

      <div className="container mx-auto mb-10">
        <Header
          handleWorkScroll={handleWorkScroll}
          handleAboutScroll={handleAboutScroll}
        />
        <div className="laptop:mt-20 mt-10">
          <div className="mt-5 text-center">
          <motion.img 
  src="/images/abg.png" 
  className="mx-auto mb-5 object-cover" // Removed the w-41 h-42 classes
  style={{ 
    width: '150px', // Set the width here
    height: '150px', // Set the height here
    WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 5%, black 90%, transparent)',
    maskImage: 'linear-gradient(to bottom, transparent, black 5%, black 90%, transparent)'
  }}
  alt="abhishek"
  initial={{ rotate: 0, scale: 0 }}
  animate={{ rotate: 0, scale: 1 }}
  whileHover={{ scale: 1.1 }} // Add this line for a hover effect
/>


            <h1
              ref={textOne}
              className="text-lg tablet:text-3xl laptop:text-3xl laptopl:text-4xl p-1 tablet:p-2 text-bold w-4/5 mob:w-full laptop:w-4/5 mx-auto"
            >
              {/* {data.headerTaglineOne} */}
            </h1>
            <br />
            <h1
              ref={textTwo}
              className="text-lg tablet:text-3xl laptop:text-3xl laptopl:text-4xl p-1 tablet:p-2 text-bold w-full laptop:w-4/5 mx-auto"
            >
              {data.headerTaglineTwo}
              {data.headerTaglineFour}
            </h1>
            <br />
            <h1
              ref={textThree}
              className="text-lg tablet:text-3xl laptop:text-3xl laptopl:text-4xl p-1 tablet:p-2 text-bold w-full laptop:w-4/5 mx-auto"
            >
              {/* {data.headerTaglineThree} */}
            </h1>
            <br />
            <h1
              ref={textFour}
              className="text-lg tablet:text-3xl laptop:text-3xl laptopl:text-4xl p-1 tablet:p-2 text-bold w-full laptop:w-4/5 mx-auto"
            >
              {/* {data.headerTaglineFour} */}
            </h1>
          </div>

          <Socials className="mt-2 laptop:mt-5" />
        </div>
        <div className="mt-10 laptop:mt-30 p-2 laptop:p-0" ref={workRef}>
          <h1 className="text-2xl text-bold">Work.</h1>

          <div className="mt-5 laptop:mt-10 grid grid-cols-1 tablet:grid-cols-2 gap-4">
            {data.projects.map((project) => (
              <WorkCard
                key={project.id}
                img={project.imageSrc}
                name={project.title}
                description={project.description}
                onClick={() => window.open(project.url)}
              />
            ))}
          </div>
        </div>

        <div className="mt-10 laptop:mt-30 p-2 laptop:p-0">
          <h1 className="tablet:m-10 text-2xl text-bold">Libraries I know.</h1>
          <div className="mt-5 tablet:m-10 grid grid-cols-1 laptop:grid-cols-2 gap-6">
            {data.services.map((service, index) => (
              <ServiceCard
                key={index}
                name={service.title}
                description={service.description}
              />
            ))}
          </div>
        </div>
        {/* This button should not go into production */}
        {process.env.NODE_ENV === "development" && (
          <div className="fixed bottom-5 right-5">
            <Link href="/edit">
              <Button type="primary">Edit Data</Button>
            </Link>
          </div>
        )}
        <div className="mt-10 laptop:mt-40 p-2 laptop:p-0" ref={aboutRef}>
          <motion.h1
            className="tablet:m-10 text-2xl text-bold"
            variants={fadeIn}
            initial="hidden"
            animate="visible"
            transition={{ duration: 1 }}
          >
            About.
          </motion.h1>
          <motion.p
  className="tablet:m-10 mt-2 text-xl laptop:text-3xl w-full laptop:w-3/5"
  variants={{
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1, // Adjust the delay between each character
      },
    },
  }}
  initial="hidden"
  animate="visible"
>
  {data.aboutpara.split("").map((char, index) => (
    <motion.span key={index} variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}>
      {char}
    </motion.span>
  ))}
</motion.p>


        </div>
        <Footer />
      </div>
    </div>
  );
}
