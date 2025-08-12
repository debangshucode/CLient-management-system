'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import AboutSection from '@/components/About';
import Hero from '@/components/Hero';
import AuthButton from '@/components/ui/AuthButton';
import {FeaturesSectionDemo} from '@/components/features';
import { ArrowRight } from 'lucide-react';
import { BentoGridThirdDemo } from '@/components/bento-grid';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-black">
      {/* Navigation */}
     
      <AuthButton />
      <Hero />
      {/* About Section */}
      <AboutSection />
      {/* Features Section */}
      <FeaturesSectionDemo />

    <BentoGridThirdDemo/>
      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <h2 className="text-4xl font-bold text-white mb-6">Ready to Get Organized?</h2>
            <p className="text-xl text-gray-300 mb-8">
              Join thousands of freelancers who have streamlined their business with FreelancerCMS
            </p>
            <Link href="/dashboard">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-3">
                Start Your Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
      {/* Footer */}
      <footer className="border-t border-gray-800 bg-gray-900/50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center">
                <span className="text-white font-bold text-xs">DG</span>
              </div>
              <span className="text-white font-medium">DreamGuys</span>
            </div>
            <div className="text-gray-400 text-sm">
              © 2025 DreamGuys. Built with Next.js and MongoDB.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}