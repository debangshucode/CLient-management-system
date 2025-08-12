'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import DashboardLayout from '@/components/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { Plus, Eye, Edit, FileText, Calendar, User, DollarSign } from 'lucide-react';

interface Quote {
  _id: string;
  quoteNumber: string;
  clientId: {
    name: string;
    email: string;
    company?: string;
  };
  projectId: {
    title: string;
  };
  total: number;
  status: string;
  validUntil?: string;
  createdAt: string;
}

export default function QuotesPage() {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchQuotes();
  }, []);

  const fetchQuotes = async () => {
    try {
      const response = await fetch('/api/quotes');
      const data = await response.json();
      setQuotes(data);
    } catch (error) {
      console.error('Error fetching quotes:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-yellow-500';
      case 'sent': return 'bg-blue-500';
      case 'accepted': return 'bg-green-500';
      case 'rejected': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-800 rounded w-1/4"></div>
          <div className="grid gap-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-800 rounded-lg"></div>
            ))}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white">Quotes</h1>
            <p className="text-gray-400">Manage your project quotes</p>
          </div>
          <Link href="/dashboard/quotes/create">
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Create Quote
            </Button>
          </Link>
        </div>

        {/* Quote Stats */}
        {quotes.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {['draft', 'sent', 'accepted', 'rejected'].map((status, index) => {
              const count = quotes.filter(q => q.status === status).length;
              const total = quotes
                .filter(q => q.status === status)
                .reduce((sum, q) => sum + q.total, 0);

              return (
                <motion.div
                  key={status}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Card className="p-4 bg-gray-800 border-gray-700">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-400 capitalize">{status}</p>
                        <p className="text-2xl font-bold text-white">{count}</p>
                        <p className="text-xs text-gray-400">${total.toLocaleString()}</p>
                      </div>
                      <Badge className={`${getStatusColor(status)} text-white`}>
                        {count}
                      </Badge>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Quote List */}
        <div className="grid gap-4">
          {quotes.map((quote, index) => (
            <motion.div
              key={quote._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card className="p-6 bg-gray-800 border-gray-700 hover:bg-gray-750 transition-colors">
                <div className="flex flex-col lg:flex-row justify-between items-start gap-4">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center space-x-3">
                      <h3 className="text-xl font-semibold text-white">{quote.quoteNumber}</h3>
                      <Badge className={`${getStatusColor(quote.status)} text-white`}>
                        {quote.status}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-400">
                      <div className="flex items-center">
                        <User className="h-4 w-4 mr-2" />
                        <div>
                          <div className="text-white font-medium">{quote.clientId.name}</div>
                          {quote.clientId.company && (
                            <div className="text-xs">{quote.clientId.company}</div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center">
                        <FileText className="h-4 w-4 mr-2" />
                        <div className="text-white font-medium">{quote.projectId.title}</div>
                      </div>
                      
                      <div className="flex items-center">
                        <DollarSign className="h-4 w-4 mr-2" />
                        <div className="text-white font-medium">${quote.total.toLocaleString()}</div>
                      </div>
                      
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2" />
                        <div>
                          Created {new Date(quote.createdAt).toLocaleDateString()}
                          {quote.validUntil && (
                            <div className="text-xs">
                              Valid until {new Date(quote.validUntil).toLocaleDateString()}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Link href={`/dashboard/quotes/${quote._id}`}>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-gray-600 hover:bg-gray-700"
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                    </Link>
                    <Link href={`/dashboard/quotes/edit/${quote._id}`}>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-blue-600 text-blue-400 hover:bg-blue-600 hover:text-white"
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                    </Link>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {quotes.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-300 mb-2">No quotes yet</h3>
            <p className="text-gray-400 mb-4">Create your first quote to get started</p>
            <Link href="/dashboard/quotes/create">
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Quote
              </Button>
            </Link>
          </motion.div>
        )}
      </div>
    </DashboardLayout>
  );
}