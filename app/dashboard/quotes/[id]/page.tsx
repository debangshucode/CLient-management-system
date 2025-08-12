'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import DashboardLayout from '@/components/DashboardLayout';
import QuotePDF from '@/components/QuotePDF';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { motion } from 'framer-motion';
import { ArrowLeft, Edit, Quote, Mail, Phone, Building, Calendar, FileText } from 'lucide-react';

interface QuoteData {
  _id: string;
  quoteNumber: string;
  clientId: {
    _id: string;
    name: string;
    email: string;
    company?: string;
    address?: string;
    phone?: string;
  };
  projectId: {
    _id: string;
    title: string;
    description?: string;
  };
  features: Array<{
    featureId: string;
    title: string;
    description: string;
    basePrice: number;
    customPrice?: number;
    quantity: number;
  }>;
  subtotal: number;
  tax: number;
  total: number;
  status: string;
  validUntil?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export default function QuoteDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [quote, setQuote] = useState<QuoteData | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (params.id) {
      fetchQuote();
    }
  }, [params.id]);

  const fetchQuote = async () => {
    try {
      const response = await fetch(`/api/quotes/${params.id}`);
      if (response.ok) {
        const data = await response.json();
        setQuote(data);
      } else {
        router.push('/dashboard/quotes');
      }
    } catch (error) {
      console.error('Error fetching quote:', error);
      router.push('/dashboard/quotes');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (newStatus: string) => {
    if (!quote) return;
    
    setUpdating(true);
    try {
      const response = await fetch(`/api/quotes/${quote._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        const updatedQuote = await response.json();
        setQuote(updatedQuote);
      }
    } catch (error) {
      console.error('Error updating quote status:', error);
    } finally {
      setUpdating(false);
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
          <div className="h-64 bg-gray-800 rounded-lg"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (!quote) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-white mb-4">Quote not found</h2>
          <Link href="/dashboard/quotes">
            <Button>Back to Quotes</Button>
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div className="flex items-center space-x-4">
            <Link href="/dashboard/quotes">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Quotes
              </Button>
            </Link>
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <h1 className="text-3xl font-bold text-white">Quote {quote.quoteNumber}</h1>
                <Badge className={`${getStatusColor(quote.status)} text-white`}>
                  {quote.status}
                </Badge>
              </div>
              <p className="text-gray-400">
                Created {new Date(quote.createdAt).toLocaleDateString()}
                {quote.validUntil && ` • Valid until ${new Date(quote.validUntil).toLocaleDateString()}`}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-400">Status:</span>
              <Select value={quote.status} onValueChange={updateStatus} disabled={updating}>
                <SelectTrigger className="w-32 bg-gray-800 border-gray-700 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  <SelectItem value="draft" className="text-white">Draft</SelectItem>
                  <SelectItem value="sent" className="text-white">Sent</SelectItem>
                  <SelectItem value="accepted" className="text-white">Accepted</SelectItem>
                  <SelectItem value="rejected" className="text-white">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <QuotePDF
              quote={{
                ...quote,
                features: quote.features.map((feature) => ({
                  title: feature.title,
                  description: feature.description,
                  customPrice: feature.customPrice ?? feature.basePrice,
                  quantity: feature.quantity,
                })),
              }}
              className="border-green-600 text-green-400 hover:bg-green-600 hover:text-white"
            />
            
            <Link href={`/dashboard/quotes/edit/${quote._id}`}>
              <Button variant="outline" className="border-blue-600 text-blue-400 hover:bg-blue-600 hover:text-white">
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Client Information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="p-6 bg-gray-800 border-gray-700">
                <h3 className="text-lg font-semibold text-white mb-4">Client Information</h3>
                <div className="space-y-3">
                  <div className="flex items-center text-gray-300">
                    <div className="w-6 h-6 flex items-center justify-center mr-3">
                      <span className="text-lg">👤</span>
                    </div>
                    <div>
                      <div className="font-medium text-white">{quote.clientId.name}</div>
                      {quote.clientId.company && (
                        <div className="text-sm text-gray-400">{quote.clientId.company}</div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center text-gray-300">
                    <Mail className="w-5 h-5 mr-3" />
                    <a href={`mailto:${quote.clientId.email}`} className="hover:text-blue-400">
                      {quote.clientId.email}
                    </a>
                  </div>
                  
                  {quote.clientId.phone && (
                    <div className="flex items-center text-gray-300">
                      <Phone className="w-5 h-5 mr-3" />
                      <a href={`tel:${quote.clientId.phone}`} className="hover:text-blue-400">
                        {quote.clientId.phone}
                      </a>
                    </div>
                  )}
                  
                  {quote.clientId.address && (
                    <div className="flex items-start text-gray-300">
                      <Building className="w-5 h-5 mr-3 mt-0.5" />
                      <div>{quote.clientId.address}</div>
                    </div>
                  )}
                </div>
              </Card>
            </motion.div>

            {/* Project Information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <Card className="p-6 bg-gray-800 border-gray-700">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                  <FileText className="h-5 w-5 mr-2" />
                  Project Details
                </h3>
                <div>
                  <h4 className="font-medium text-white text-lg mb-2">{quote.projectId.title}</h4>
                  {quote.projectId.description && (
                    <p className="text-gray-300">{quote.projectId.description}</p>
                  )}
                </div>
              </Card>
            </motion.div>

            {/* Features */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <Card className="p-6 bg-gray-800 border-gray-700">
                <h3 className="text-lg font-semibold text-white mb-4">Services & Features</h3>
                <div className="space-y-4">
                  {quote.features.map((feature, index) => (
                    <div key={index} className="p-4 bg-gray-900 rounded-lg">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <h4 className="font-medium text-white">{feature.title}</h4>
                          <p className="text-sm text-gray-400 mt-1">{feature.description}</p>
                        </div>
                        <div className="text-right ml-4">
                          <div className="font-medium text-white">
                            ${((feature.customPrice || feature.basePrice) * feature.quantity).toLocaleString()}
                          </div>
                          <div className="text-xs text-gray-400">
                            ${(feature.customPrice || feature.basePrice).toLocaleString()} × {feature.quantity}
                          </div>
                        </div>
                      </div>
                      {feature.customPrice && feature.customPrice !== feature.basePrice && (
                        <div className="text-xs text-yellow-400">
                          Custom price (original: ${feature.basePrice.toLocaleString()})
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>

            {/* Notes */}
            {quote.notes && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.3 }}
              >
                <Card className="p-6 bg-gray-800 border-gray-700">
                  <h3 className="text-lg font-semibold text-white mb-4">Additional Notes</h3>
                  <p className="text-gray-300 whitespace-pre-line">{quote.notes}</p>
                </Card>
              </motion.div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quote Summary */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.4 }}
            >
              <Card className="p-6 bg-gradient-to-br from-blue-600 to-blue-700 border-0">
                <h3 className="text-lg font-semibold text-white mb-4">Quote Summary</h3>
                <div className="space-y-3">
                  <div className="flex justify-between text-blue-100">
                    <span>Subtotal:</span>
                    <span>${quote.subtotal.toLocaleString()}</span>
                  </div>
                  
                  {quote.tax > 0 && (
                    <div className="flex justify-between text-blue-100">
                      <span>Tax ({quote.tax}%):</span>
                      <span>${(quote.subtotal * (quote.tax / 100)).toLocaleString()}</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between text-xl font-bold text-white border-t border-blue-500 pt-3">
                    <span>Total:</span>
                    <span>${quote.total.toLocaleString()}</span>
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.5 }}
            >
              <Card className="p-6 bg-gray-800 border-gray-700">
                <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <Button
                    className="w-full justify-start"
                    variant="outline"
                    onClick={() => window.open(`mailto:${quote.clientId.email}?subject=Quote ${quote.quoteNumber}&body=Please find your quote attached.`)}
                  >
                    <Mail className="h-4 w-4 mr-2" />
                    Email Client
                  </Button>
                  
                  <QuotePDF 
                    quote={{
                      ...quote,
                      features: quote.features.map((feature) => ({
                        title: feature.title,
                        description: feature.description,
                        customPrice: feature.customPrice ?? feature.basePrice,
                        quantity: feature.quantity,
                      })),
                    }} 
                    className="w-full justify-start border-gray-600 hover:bg-gray-700" 
                  />
                  
                  <Link href={`/dashboard/quotes/edit/${quote._id}`} className="block">
                    <Button variant="outline" className="w-full justify-start border-gray-600 hover:bg-gray-700">
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Quote
                    </Button>
                  </Link>
                </div>
              </Card>
            </motion.div>

            {/* Timeline */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.6 }}
            >
              <Card className="p-6 bg-gray-800 border-gray-700">
                <h3 className="text-lg font-semibold text-white mb-4">Timeline</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center space-x-3">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <div>
                      <div className="text-white">Quote Created</div>
                      <div className="text-gray-400">{new Date(quote.createdAt).toLocaleDateString()}</div>
                    </div>
                  </div>
                  
                  {quote.updatedAt !== quote.createdAt && (
                    <div className="flex items-center space-x-3">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <div>
                        <div className="text-white">Last Updated</div>
                        <div className="text-gray-400">{new Date(quote.updatedAt).toLocaleDateString()}</div>
                      </div>
                    </div>
                  )}
                  
                  {quote.validUntil && (
                    <div className="flex items-center space-x-3">
                      <Calendar className="h-4 w-4 text-yellow-400" />
                      <div>
                        <div className="text-white">Valid Until</div>
                        <div className="text-yellow-400">{new Date(quote.validUntil).toLocaleDateString()}</div>
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}