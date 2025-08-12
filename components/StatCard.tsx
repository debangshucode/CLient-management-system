'use client';

import { motion } from 'framer-motion';
import { DivideIcon as LucideIcon } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  change?: {
    value: number;
    trend: 'up' | 'down';
  };
  index?: number;
}

export default function StatCard({ title, value, icon: Icon, change, index = 0 }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
    >
      <Card className="p-6 bg-gray-800 border-gray-700 hover:bg-gray-750 transition-colors">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-400">{title}</p>
            <p className="text-2xl font-bold text-white mt-2">{value}</p>
            {change && (
              <p className={`text-sm mt-2 ${
                change.trend === 'up' ? 'text-green-400' : 'text-red-400'
              }`}>
                {change.trend === 'up' ? '↑' : '↓'} {Math.abs(change.value)}%
              </p>
            )}
          </div>
          <div className="p-3 bg-blue-600 rounded-lg">
            <Icon className="h-6 w-6 text-white" />
          </div>
        </div>
      </Card>
    </motion.div>
  );
}