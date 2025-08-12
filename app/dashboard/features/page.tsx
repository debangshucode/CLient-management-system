'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { InputField } from '@/components/ui/input-field';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit, Trash2, Package } from 'lucide-react';

interface Feature {
  _id: string;
  title: string;
  description: string;
  basePrice: number;
  category: string;
  isActive: boolean;
  createdAt: string;
}

export default function FeaturesPage() {
  const [features, setFeatures] = useState<Feature[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingFeature, setEditingFeature] = useState<Feature | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    basePrice: '',
    category: ''
  });

  useEffect(() => {
    fetchFeatures();
  }, []);

  const fetchFeatures = async () => {
    try {
      const response = await fetch('/api/features');
      const data = await response.json();
      setFeatures(data);
    } catch (error) {
      console.error('Error fetching features:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const url = editingFeature ? `/api/features/${editingFeature._id}` : '/api/features';
      const method = editingFeature ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          basePrice: parseFloat(formData.basePrice)
        }),
      });

      if (response.ok) {
        fetchFeatures();
        resetForm();
      }
    } catch (error) {
      console.error('Error saving feature:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this feature?')) return;
    
    try {
      const response = await fetch(`/api/features/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchFeatures();
      }
    } catch (error) {
      console.error('Error deleting feature:', error);
    }
  };

  const handleEdit = (feature: Feature) => {
    setEditingFeature(feature);
    setFormData({
      title: feature.title,
      description: feature.description,
      basePrice: feature.basePrice.toString(),
      category: feature.category
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      basePrice: '',
      category: ''
    });
    setEditingFeature(null);
    setShowForm(false);
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      'Development': 'bg-blue-500',
      'Design': 'bg-purple-500',
      'Marketing': 'bg-green-500',
      'SEO': 'bg-yellow-500',
      'E-commerce': 'bg-red-500',
      'Maintenance': 'bg-gray-500',
    };
    return colors[category as keyof typeof colors] || 'bg-gray-500';
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-800 rounded w-1/4"></div>
          <div className="grid gap-4 lg:grid-cols-2">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-800 rounded-lg"></div>
            ))}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const categories = [...new Set(features.map(f => f.category))];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white">Features & Services</h1>
            <p className="text-gray-400">Manage your reusable project features</p>
          </div>
          <Button
            onClick={() => setShowForm(true)}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Feature
          </Button>
        </div>

        {/* Feature Form */}
        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="p-6 bg-gray-800 border-gray-700">
                <h3 className="text-lg font-semibold text-white mb-4">
                  {editingFeature ? 'Edit Feature' : 'Add New Feature'}
                </h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InputField
                      label="Feature Title"
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      required
                    />
                    <InputField
                      label="Category"
                      id="category"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      placeholder="e.g., Development, Design, Marketing"
                      required
                    />
                    <InputField
                      label="Base Price ($)"
                      id="basePrice"
                      type="number"
                      value={formData.basePrice}
                      onChange={(e) => setFormData({ ...formData, basePrice: e.target.value })}
                      required
                    />
                  </div>
                  <InputField
                    label="Description"
                    id="description"
                    type="textarea"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    required
                  />
                  <div className="flex justify-end space-x-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={resetForm}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                      {editingFeature ? 'Update' : 'Create'} Feature
                    </Button>
                  </div>
                </form>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Features by Category */}
        {categories.map((category) => (
          <div key={category} className="space-y-4">
            <h2 className="text-xl font-semibold text-white flex items-center">
              <Badge className={`${getCategoryColor(category)} text-white mr-3`}>
                {category}
              </Badge>
              ({features.filter(f => f.category === category).length} features)
            </h2>
            
            <div className="grid gap-4 lg:grid-cols-2">
              {features
                .filter(feature => feature.category === category)
                .map((feature, index) => (
                  <motion.div
                    key={feature._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <Card className="p-6 bg-gray-800 border-gray-700 hover:bg-gray-750 transition-colors">
                      <div className="flex justify-between items-start gap-4">
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center space-x-2">
                            <h3 className="text-lg font-semibold text-white">{feature.title}</h3>
                            <Badge className="bg-green-600 text-white">
                              ${feature.basePrice.toLocaleString()}
                            </Badge>
                          </div>
                          <p className="text-gray-300 text-sm leading-relaxed">
                            {feature.description}
                          </p>
                          <p className="text-xs text-gray-400">
                            Created {new Date(feature.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(feature)}
                            className="border-gray-600 hover:bg-gray-700"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(feature._id)}
                            className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
            </div>
          </div>
        ))}

        {features.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-300 mb-2">No features yet</h3>
            <p className="text-gray-400 mb-4">Create reusable features to speed up your quote process</p>
            <Button
              onClick={() => setShowForm(true)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Feature
            </Button>
          </motion.div>
        )}
      </div>
    </DashboardLayout>
  );
}