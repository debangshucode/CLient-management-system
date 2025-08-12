"use client";
import { cn } from "@/lib/utils";
import React from "react";
import { BentoGrid, BentoGridItem } from "./ui/bentogrid";
import {
  Briefcase,
  ClipboardList,
  BarChart3,
  Users,
  MessageSquare,
} from "lucide-react";
import { motion } from "framer-motion";

export function BentoGridThirdDemo() {
  return (
    <div className="py-20 ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent mb-4">
            Client & Project Management
          </h1>
          <p className="text-lg text-neutral-400 max-w-2xl mx-auto">
            Tools, workflows, and strategies to manage clients and projects efficiently.
          </p>
        </div>
        <BentoGrid className="max-w-7xl mx-auto md:auto-rows-[20rem]">
          {items.map((item, i) => (
            <BentoGridItem
              key={i}
              title={item.title}
              description={item.description}
              header={item.header}
              className={cn("[&>p:text-lg]", item.className)}
              icon={item.icon}
            />
          ))}
        </BentoGrid>
      </div>
    </div>
  );
}

const ClientOnboardingPreview = () => {
  const variants = {
    initial: { opacity: 0.9 },
    animate: { opacity: 1, y: -8, transition: { duration: 0.3, yoyo: Infinity } },
  };

  return (
    <motion.div
      initial="initial"
      whileHover="animate"
      className="flex flex-1 w-full h-full min-h-[6rem] bg-gradient-to-br from-emerald-900 to-emerald-700 rounded-lg overflow-hidden relative"
    >
      <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg')] bg-cover bg-center opacity-20"></div>
      <motion.div
        variants={variants}
        className="flex flex-col justify-center items-center w-full h-full relative z-10"
      >
        <Users className="w-12 h-12 text-emerald-400 mb-4" />
        <h3 className="text-lg font-semibold text-emerald-300 mb-2">
          Client Onboarding
        </h3>
        <p className="text-sm text-emerald-200 text-center px-4">
          Smooth, personalized onboarding experiences.
        </p>
      </motion.div>
    </motion.div>
  );
};

const ProjectProgressShowcase = () => {
  const variants = {
    initial: { width: 0 },
    animate: { width: "100%", transition: { duration: 0.8 } },
    hover: { width: ["0%", "100%"], transition: { duration: 2, repeat: Infinity } },
  };

  const progressBars = [
    { label: "Planning", progress: 90 },
    { label: "Execution", progress: 80 },
    { label: "Testing", progress: 70 },
    { label: "Delivery", progress: 95 },
  ];

  return (
    <motion.div
      initial="initial"
      animate="animate"
      whileHover="hover"
      className="flex flex-1 w-full h-full min-h-[6rem] bg-gradient-to-br from-indigo-900 to-indigo-700 rounded-lg p-4"
    >
      <div className="flex flex-col space-y-3 w-full">
        {progressBars.map((bar, i) => (
          <div key={i}>
            <div className="flex justify-between text-xs text-indigo-300">
              <span>{bar.label}</span>
              <span>{bar.progress}%</span>
            </div>
            <div className="w-full bg-indigo-950 rounded-full h-2">
              <motion.div
                variants={variants}
                style={{ width: `${bar.progress}%` }}
                className="bg-gradient-to-r from-cyan-400 to-blue-500 h-2 rounded-full"
              />
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

const AnalyticsOverview = () => {
  const variants = {
    initial: { backgroundPosition: "0 50%" },
    animate: { backgroundPosition: ["0, 50%", "100% 50%", "0 50%"] },
  };

  return (
    <motion.div
      initial="initial"
      animate="animate"
      variants={variants}
      transition={{ duration: 8, repeat: Infinity, repeatType: "reverse" }}
      className="flex flex-1 w-full h-full min-h-[6rem] rounded-lg flex-col relative overflow-hidden"
      style={{
        background:
          "linear-gradient(-45deg, #1e3a8a, #1e40af, #0e7490, #14b8a6)",
        backgroundSize: "400% 400%",
      }}
    >
      <div className="absolute h-full inset-0 bg-black/30"></div>
      <div className="relative z-10 flex items-center flex-wrap item-center justify-center h-full text-center text-white">
        <BarChart3 className="w-10 h-10 mx-auto mb-3" />
        <div className="w-full">
          <h3 className="text-lg text-center font-bold mb-2">Analytics Dashboard</h3>
          <p className="text-sm opacity-90">Data-driven project decisions</p>
        </div>
      </div>
    </motion.div>
  );
};

const TeamFeedback = () => {
  return (
    <motion.div
      initial="initial"
      animate="animate"
      whileHover="hover"
      className="flex flex-1 w-full h-full min-h-[6rem] bg-gradient-to-br from-neutral-800 to-neutral-700 rounded-lg flex-row space-x-2 p-2"
    >
      {[
        { quote: "Great collaboration!", color: "emerald", tag: "⭐⭐⭐⭐⭐" },
        { quote: "Clear communication", color: "blue", tag: "Verified" },
        { quote: "Projects delivered on time", color: "purple", tag: "Reliable" },
      ].map((item, i) => (
        <div
          key={i}
          className={`h-full w-1/3 rounded-2xl bg-neutral-900 p-4 border border-${item.color}-500 flex flex-col items-center justify-center`}
        >
          <p className="text-xs text-center font-semibold text-neutral-200 mt-2">
            "{item.quote}"
          </p>
          <p
            className={`border border-${item.color}-500 bg-${item.color}-900/30 text-${item.color}-400 text-xs rounded-full px-2 py-0.5 mt-2`}
          >
            {item.tag}
          </p>
        </div>
      ))}
    </motion.div>
  );
};

const ClientCommunication = () => {
  return (
    <motion.div
      initial="initial"
      whileHover="animate"
      className="flex flex-1 w-full h-full min-h-[6rem] bg-gradient-to-br from-slate-900 to-gray-800 rounded-lg flex-col space-y-3 p-3"
    >
      <div className="flex flex-row rounded-2xl border border-gray-600 p-3 items-start space-x-3 bg-neutral-900">
        <MessageSquare className="w-5 h-5 text-cyan-400" />
        <div className="flex-1">
          <p className="text-xs text-neutral-300 leading-relaxed">
            "Hi! Can we schedule a meeting to review project milestones?"
          </p>
          <span className="text-xs text-cyan-400 font-medium">Client</span>
        </div>
      </div>
      <div className="flex flex-row rounded-2xl border border-gray-600 p-3 items-start space-x-3 ml-auto bg-neutral-900">
        <div className="flex-1 text-right">
          <p className="text-xs text-neutral-300 leading-relaxed">
            "Absolutely, I’ll prepare the agenda."
          </p>
          <span className="text-xs text-green-400 font-medium">PM</span>
        </div>
      </div>
    </motion.div>
  );
};

const items = [
  {
    title: "Client Onboarding",
    description: (
      <span className="text-sm text-neutral-400">
        Streamline the start of every client relationship.
      </span>
    ),
    header: <ClientOnboardingPreview />,
    className: "md:col-span-1",
    icon: <Users className="h-4 w-4 text-emerald-400" />,
  },
  {
    title: "Project Tracking",
    description: (
      <span className="text-sm text-neutral-400">
        Keep projects on track with clear milestones.
      </span>
    ),
    header: <ProjectProgressShowcase />,
    className: "md:col-span-1",
    icon: <ClipboardList className="h-4 w-4 text-blue-400" />,
  },
  {
    title: "Analytics & Reporting",
    description: (
      <span className="text-sm text-neutral-400">
        Make informed decisions using live project data.
      </span>
    ),
    header: <AnalyticsOverview />,
    className: "md:col-span-1",
    icon: <BarChart3 className="h-4 w-4 text-cyan-400" />,
  },
  {
    title: "Team Feedback",
    description: (
      <span className="text-sm text-neutral-400">
        Gather and share valuable feedback from your team.
      </span>
    ),
    header: <TeamFeedback />,
    className: "md:col-span-2",
    icon: <Briefcase className="h-4 w-4 text-emerald-400" />,
  },
  {
    title: "Client Communication",
    description: (
      <span className="text-sm text-neutral-400">
        Stay connected with clients in real time.
      </span>
    ),
    header: <ClientCommunication />,
    className: "md:col-span-1",
    icon: <MessageSquare className="h-4 w-4 text-cyan-400" />,
  },
];
