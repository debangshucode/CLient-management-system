"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import StatCard from "@/components/StatCard";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import {
  Users,
  FolderOpen,
  FileText,
  DollarSign,
  Clock,
  TrendingUp,
} from "lucide-react";

interface Stats {
  clients: number;
  projects: number;
  activeProjects: number;
  quotes: number;
  totalValue: number;
}

interface RecentQuote {
  _id: string;
  quoteNumber: string;
  clientId: { name: string };
  projectId: { title: string };
  total: number;
  status: string;
  createdAt: string;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [recentQuotes, setRecentQuotes] = useState<RecentQuote[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await fetch("/api/dashboard/stats");
      const data = await response.json();
      setStats(data.stats);
      setRecentQuotes(data.recentQuotes);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "draft":
        return "bg-yellow-500";
      case "sent":
        return "bg-blue-500";
      case "accepted":
        return "bg-green-500";
      case "rejected":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-800 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-800 rounded-lg"></div>
            ))}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center lg:text-left"
        >
          <h1 className="text-3xl font-bold text-white mb-2">
            Dashboard Overview
          </h1>
          <p className="text-gray-400">
            Welcome back! Here's what's happening with your business.
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Clients"
            value={stats?.clients || 0}
            icon={Users}
            index={0}
          />
          <StatCard
            title="Total Projects"
            value={stats?.projects || 0}
            icon={FolderOpen}
            index={1}
          />
          <StatCard
            title="Active Projects"
            value={stats?.activeProjects || 0}
            icon={Clock}
            index={2}
          />
          <StatCard
            title="Total Quotes"
            value={stats?.quotes || 0}
            icon={FileText}
            index={3}
          />
        </div>

        {/* Revenue and Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Revenue Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.4 }}
          >
            <Card className="p-6 bg-gradient-to-br from-blue-600 to-blue-700 border-0">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium">
                    Total Revenue
                  </p>
                  <p className="text-3xl font-bold text-white mt-2">
                    ${(stats?.totalValue || 0).toLocaleString()}
                  </p>
                  <p className="text-blue-200 text-sm mt-2 flex items-center">
                    <TrendingUp className="h-4 w-4 mr-1" />
                    From accepted quotes
                  </p>
                </div>
                <div className="p-3 bg-white bg-opacity-20 rounded-lg">
                  <DollarSign className="h-8 w-8 text-white" />
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Recent Quotes */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.5 }}
          >
            <Card className="p-6 bg-gray-800 border-gray-700">
              <h3 className="text-lg font-semibold text-white mb-4">
                Recent Quotes
              </h3>
              <div className="space-y-3">
                {recentQuotes && recentQuotes.length > 0 ? (
                  recentQuotes.map((quote) => (
                    <div
                      key={quote._id}
                      className="flex items-center justify-between py-2"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white truncate">
                          {quote.quoteNumber} - {quote.clientId.name}
                        </p>
                        <p className="text-xs text-gray-400 truncate">
                          {quote.projectId.title}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium text-white">
                          ${quote.total.toLocaleString()}
                        </span>
                        <Badge
                          className={`${getStatusColor(
                            quote.status
                          )} text-white text-xs`}
                        >
                          {quote.status}
                        </Badge>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-400 text-sm">No quotes created yet</p>
                )}
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  );
}
