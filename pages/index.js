import React from 'react';
import Head from 'next/head';
import Hero from '../components/Hero';
import Navigation from '../components/Navigation';
import Skills from '../components/Skills';
import Projects from '../components/Projects';
import Experience from '../components/Experience';
import Contact from '../components/Contact';
import Footer from '../components/Footer';
import data from '../data/portfolio.json';

export default function Home() {
  return (
    <>
      <Head>
        <title>{`${data.name} ${data.surname} | ${data.title}`}</title>
        <meta name="description" content={data.tagline} />
        <meta name="keywords" content="Frontend Developer, React, Next.js, TypeScript, Workflow Automation, React Flow, Mumbai" />
        <meta name="author" content={`${data.name} ${data.surname}`} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        
        {/* Open Graph */}
        <meta property="og:title" content={`${data.name} ${data.surname} | ${data.title}`} />
        <meta property="og:description" content={data.tagline} />
        <meta property="og:type" content="website" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${data.name} ${data.surname} | ${data.title}`} />
        <meta name="twitter:description" content={data.tagline} />
        
        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" />
        
        {/* Preconnect */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </Head>

      <div className="min-h-screen bg-white text-zinc-900 overflow-x-hidden w-full max-w-full dark:bg-dark-bg dark:text-zinc-100">
        <Navigation />
        
        <main>
          <Hero data={data} />
          <Experience experience={data.experience} education={data.education} />
          <Projects projects={data.projects} />
          <Skills skills={data.skills} />
          <Contact data={data} />
        </main>

        <Footer data={data} />
      </div>
    </>
  );
}
