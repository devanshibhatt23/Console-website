import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Landing.css";

import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Hero from '@/components/sections/Hero';
import TechMarquee from '@/components/sections/TechMarquee';
import POTD from '@/components/sections/POTD';
import UpcomingEvents from '@/components/sections/UpcomingEvents';
import About from '@/components/sections/About';
import PreviousEvents from '@/components/sections/PreviousEvents';
import Community from '@/components/sections/Community';

const GALLERY_ROW1 = [
  "/images/IMG_0051.jpg",
  "/images/IMG_0207.jpg",
  "/images/IMG_1594.JPG",
  "/images/IMG_2003.jpg",
  "/images/IMG_20260117_134333116_HDR.jpg",
  "/images/IMG_2055.jpg",
  "/images/IMG_4105.jpg",
  "/images/IMG_4412.jpg",
  "/images/WhatsApp Image 2026-04-14 at 13.34.04.jpeg"
];

const GALLERY_ROW2 = [
  "/images/IMG_0079.jpg",
  "/images/IMG_1590.jpg",
  "/images/IMG_1599.jpg",
  "/images/IMG_2011.jpg",
  "/images/IMG_20260117_151044965_HDR.jpg",
  "/images/IMG_2065.jpg",
  "/images/IMG_4394.jpg",
  "/images/WhatsApp Image 2026-04-14 at 13.36.52.jpeg",
  "/images/WhatsApp Image 2026-04-14 at 15.39.56.jpeg"
];

const TEAM_MEMBERS = [
  "Bhavya", "Parth Gandhi", "Rishi Kataria", "Raghunandan Jhawar",
  "Shivam Pareek", "Sujal Maurya", "Shivam Jat", "Yuvraj", "Neel Shah",
  "Shubham Singh", "Amit Kumar", "Mahek Patel", "Rashi Jangid",
  "Mridul Trivedi", "Prashant Chaudhary", "Krrish Sharma", "Ritesh Singh",
  "Abhinav Singh", "Siddhi Agarwal", "Aagam Jain", "Aditya Dhiman",
  "Akshat Agrawal", "Chiranjeev Goyal", "Devanshi Bhatt", "Dishank Viradiya",
  "Het Shah", "Meet Van", "Pallvi", "Param Chauhan", "Prarthana",
  "Ridhima Garg", "Saarvik Singh", "Sahil Kumar", "Siddharth Kumar", "Shlok Patel"
];

function getInitials(name) {
  return name.split(" ").map(n => n[0]).join("").toUpperCase();
}

export default function Landing() {
  const { user } = useAuth();

  useEffect(() => {
    document.body.classList.add('is-landing');
    return () => {
      document.body.classList.remove('is-landing');
    };
  }, []);

  const teamHalf = Math.ceil(TEAM_MEMBERS.length / 2);
  const teamRow1 = TEAM_MEMBERS.slice(0, teamHalf);
  const teamRow2 = TEAM_MEMBERS.slice(teamHalf);

  return (
    <div className="bg-black min-h-screen text-foreground overflow-hidden selection:bg-primary/30 selection:text-white">
      <Navbar />

      <main>
        {/* Hero */}
        <Hero />
        <TechMarquee />

        {/* Home page additions - visible only on login */}
        {user && (
          <>
            <POTD />
            <UpcomingEvents />
          </>
        )}

        {/* Club section */}
        <About />
        
        {/* Gallery Section from Original Repo */}
        <section id="gallery" className="landing-section gallery-section py-20 bg-black">
          <div className="gallery-header text-center mb-10">
            <h2 className="section-title text-4xl font-bold mb-4">Life at <span className="gradient-text">CONSOLE</span></h2>
            <p className="section-subtitle text-gray-400">Moments from our coding sessions, hackathons, and meetups</p>
          </div>
          <div className="infinite-scroller-container relative overflow-hidden">
            <div className="scroll-row left-to-right">
              <div className="scroll-track">
                {GALLERY_ROW1.concat(GALLERY_ROW1).map((src, i) => (
                  <div className="gallery-item-wrapper" key={`g1-${i}`}>
                    <img src={src} alt="Console Moment" className="gallery-img object-cover" />
                  </div>
                ))}
              </div>
            </div>
            <div className="scroll-row right-to-left mt-6">
              <div className="scroll-track">
                {GALLERY_ROW2.concat(GALLERY_ROW2).map((src, i) => (
                  <div className="gallery-item-wrapper" key={`g2-${i}`}>
                    <img src={src} alt="Console Moment" className="gallery-img object-cover" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Team Section from Original Repo */}
        <section id="team" className="landing-section team-section py-20 bg-black">
          <div className="team-header text-center mb-10">
            <h2 className="section-title text-4xl font-bold mb-4">Meet Our Team</h2>
            <p className="section-subtitle text-gray-400">The minds driving the community forward</p>
          </div>
          <div className="infinite-scroller-container relative overflow-hidden">
            <div className="scroll-row left-to-right">
              <div className="scroll-track">
                {teamRow1.concat(teamRow1).map((name, i) => (
                  <div className="team-member-card glassmorphic" key={`t1-${i}`}>
                    <div className="avatar-placeholder">{getInitials(name)}</div>
                    <h4 className="member-name text-white">{name}</h4>
                    <span className="member-role text-gray-400">Core Member</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="scroll-row right-to-left mt-6">
              <div className="scroll-track">
                {teamRow2.concat(teamRow2).map((name, i) => (
                  <div className="team-member-card glassmorphic" key={`t2-${i}`}>
                    <div className="avatar-placeholder">{getInitials(name)}</div>
                    <h4 className="member-name text-white">{name}</h4>
                    <span className="member-role text-gray-400">Core Member</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <PreviousEvents />

        {/* Resources & Guides */}
        <section id="learn-grow" className="landing-section py-20 bg-black">
          <div className="container mx-auto px-6 max-w-5xl text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Learn & <span className="text-gradient-fire">Grow</span></h2>
            <p className="text-muted-foreground font-mono mb-12">Everything you need to level up your skills and career.</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Link to="/resources" className="glassmorphic p-8 rounded-2xl hover:scale-105 transition-transform flex flex-col items-center">
                <div className="text-5xl mb-4">📚</div>
                <h3 className="text-xl font-bold mb-2 text-white">Resources</h3>
                <p className="text-gray-400 text-sm">Curated guides and competitive programming materials.</p>
              </Link>
              <Link to="/tech-guide" className="glassmorphic p-8 rounded-2xl hover:scale-105 transition-transform flex flex-col items-center">
                <div className="text-5xl mb-4">🗺️</div>
                <h3 className="text-xl font-bold mb-2 text-white">Tech Guide</h3>
                <p className="text-gray-400 text-sm">Step-by-step roadmaps for your software engineering journey.</p>
              </Link>
              <Link to="/placement-playbook" className="glassmorphic p-8 rounded-2xl hover:scale-105 transition-transform flex flex-col items-center">
                <div className="text-5xl mb-4">🎯</div>
                <h3 className="text-xl font-bold mb-2 text-white">Placement Playbook</h3>
                <p className="text-gray-400 text-sm">From building your first profile to cracking your first offer.</p>
              </Link>
            </div>
          </div>
        </section>

        {/* Community CTA */}
        <Community />
      </main>

      <Footer />
    </div>
  );
}
