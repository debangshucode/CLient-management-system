import Orb from './ui/orb';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
const Hero = () => {
  return (
    <div style={{ position: 'relative', width: '100%', height: '100vh', overflow: 'hidden' }}>
      <Orb
        hoverIntensity={0.5}
        rotateOnHover={true}
        hue={0}
        forceHoverState={false}
      />

      <div className="max-w-4xl absolute top-1/3 left-0 right-0  mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Manage Your
              <span className="text-blue-400"> Freelance Business</span>
            </h1>
            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              Streamline client relationships, track projects, and generate professional quotes 
              with our comprehensive freelancer management system.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/dashboard">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-3">
                  Start Managing Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="text-lg px-8 py-3 border-gray-600 text-gray-300 hover:bg-gray-800">
                View Demo
              </Button>
            </div>
          </motion.div>
        </div>
    </div>
  );
};

export default Hero;
