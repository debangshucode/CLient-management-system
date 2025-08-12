"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/DashboardLayout";
import { InputField } from "@/components/ui/input-field";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { motion } from "framer-motion";
import { ArrowLeft, Plus, Minus, Calculator } from "lucide-react";
import Link from "next/link";

interface Client {
  _id: string;
  name: string;
  email: string;
  company?: string;
}

interface Project {
  _id: string;
  title: string;
  clientId: string | { _id: string };
}

interface Feature {
  _id: string;
  title: string;
  description: string;
  basePrice: number;
  category: string;
}

interface SelectedFeature {
  featureId: string;
  title: string;
  description: string;
  basePrice: number;
  customPrice: number;
  quantity: number;
}

export default function CreateQuotePage() {
  const router = useRouter();
  const [clients, setClients] = useState<Client[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [features, setFeatures] = useState<Feature[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [selectedFeatures, setSelectedFeatures] = useState<SelectedFeature[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    clientId: "",
    projectId: "",
    validUntil: "",
    notes: "",
    tax: 0,
  });

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (formData.clientId) {
      const clientProjects = projects.filter((p) => {
        const projectClientId =
          typeof p.clientId === "string" ? p.clientId : p.clientId?._id;
        return projectClientId === formData.clientId;
      });
      setFilteredProjects(clientProjects);
      setFormData((prev) => ({ ...prev, projectId: "" }));
    } else {
      setFilteredProjects([]);
    }
  }, [formData.clientId, projects]);

  const fetchData = async () => {
    try {
      const [clientsRes, projectsRes, featuresRes] = await Promise.all([
        fetch("/api/clients"),
        fetch("/api/projects"),
        fetch("/api/features"),
      ]);

      const [clientsData, projectsData, featuresData] = await Promise.all([
        clientsRes.json(),
        projectsRes.json(),
        featuresRes.json(),
      ]);

      setClients(clientsData);
      setProjects(projectsData);
      setFeatures(featuresData);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFeatureToggle = (feature: Feature, checked: boolean) => {
    if (checked) {
      setSelectedFeatures((prev) => [
        ...prev,
        {
          featureId: feature._id,
          title: feature.title,
          description: feature.description,
          basePrice: feature.basePrice,
          customPrice: feature.basePrice,
          quantity: 1,
        },
      ]);
    } else {
      setSelectedFeatures((prev) =>
        prev.filter((f) => f.featureId !== feature._id)
      );
    }
  };

  const updateSelectedFeature = (
    featureId: string,
    updates: Partial<SelectedFeature>
  ) => {
    setSelectedFeatures((prev) =>
      prev.map((f) => (f.featureId === featureId ? { ...f, ...updates } : f))
    );
  };

  const calculateTotal = () => {
    const subtotal = selectedFeatures.reduce(
      (sum, f) => sum + f.customPrice * f.quantity,
      0
    );
    const taxAmount = subtotal * (formData.tax / 100);
    return {
      subtotal,
      taxAmount,
      total: subtotal + taxAmount,
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedFeatures.length === 0) {
      alert("Please select at least one feature");
      return;
    }

    setSubmitting(true);

    try {
      const { subtotal, total } = calculateTotal();

      const response = await fetch("/api/quotes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientId: formData.clientId,
          projectId: formData.projectId,
          features: selectedFeatures,
          subtotal,
          tax: formData.tax,
          total,
          validUntil: formData.validUntil || undefined,
          notes: formData.notes || undefined,
        }),
      });

      if (response.ok) {
        const quote = await response.json();
        router.push(`/dashboard/quotes/${quote._id}`);
      }
    } catch (error) {
      console.error("Error creating quote:", error);
    } finally {
      setSubmitting(false);
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

  const { subtotal, taxAmount, total } = calculateTotal();
  const categories = Array.from(new Set(features.map((f) => f.category)));

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center space-x-4">
          <Link href="/dashboard/quotes">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Quotes
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-white">Create Quote</h1>
            <p className="text-gray-400">
              Build a professional quote for your client
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <Card className="p-6 bg-gray-800 border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-4">
              Quote Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-200">
                  Client <span className="text-red-400">*</span>
                </label>
                <Select
                  value={formData.clientId}
                  onValueChange={(value) =>
                    setFormData({ ...formData, clientId: value })
                  }
                >
                  <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                    <SelectValue placeholder="Select a client" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    {clients.map((client) => (
                      <SelectItem
                        key={client._id}
                        value={client._id}
                        className="text-white"
                      >
                        {client.name} {client.company && `(${client.company})`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-200">
                  Project <span className="text-red-400">*</span>
                </label>
                <Select
                  value={formData.projectId}
                  onValueChange={(value) =>
                    setFormData({ ...formData, projectId: value })
                  }
                  disabled={!formData.clientId}
                >
                  <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                    <SelectValue
                      placeholder={
                        formData.clientId
                          ? "Select a project"
                          : "Select client first"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    {filteredProjects.map((project) => (
                      <SelectItem
                        key={project._id}
                        value={project._id}
                        className="text-white"
                      >
                        {project.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <InputField
                label="Valid Until"
                id="validUntil"
                type="date"
                value={formData.validUntil}
                onChange={(e) =>
                  setFormData({ ...formData, validUntil: e.target.value })
                }
              />

              <InputField
                label="Tax (%)"
                id="tax"
                type="number"
                value={formData.tax}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    tax: parseFloat(e.target.value) || 0,
                  })
                }
              />
            </div>

            <InputField
              label="Notes"
              id="notes"
              type="textarea"
              placeholder="Additional notes for the client..."
              value={formData.notes}
              onChange={(e) =>
                setFormData({ ...formData, notes: e.target.value })
              }
              className="mt-4"
            />
          </Card>

          {/* Feature Selection */}
          <Card className="p-6 bg-gray-800 border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-4">
              Select Features
            </h3>

            {categories.map((category) => (
              <div key={category} className="mb-6">
                <h4 className="text-md font-medium text-gray-200 mb-3 flex items-center">
                  <Badge className="bg-blue-600 text-white mr-3">
                    {category}
                  </Badge>
                </h4>

                <div className="grid gap-3">
                  {features
                    .filter((feature) => feature.category === category)
                    .map((feature) => {
                      const isSelected = selectedFeatures.some(
                        (f) => f.featureId === feature._id
                      );
                      const selectedFeature = selectedFeatures.find(
                        (f) => f.featureId === feature._id
                      );

                      return (
                        <motion.div
                          key={feature._id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className={`p-4 border rounded-lg transition-colors ${
                            isSelected
                              ? "border-blue-500 bg-blue-900/20"
                              : "border-gray-600 bg-gray-900/50"
                          }`}
                        >
                          <div className="flex items-start space-x-4">
                            <Checkbox
                              checked={isSelected}
                              onCheckedChange={(checked) =>
                                handleFeatureToggle(feature, checked as boolean)
                              }
                              className="mt-1"
                            />

                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-2">
                                <h5 className="font-medium text-white">
                                  {feature.title}
                                </h5>
                                <Badge className="bg-green-600 text-white">
                                  ${feature.basePrice.toLocaleString()}
                                </Badge>
                              </div>
                              <p className="text-sm text-gray-400 mb-3">
                                {feature.description}
                              </p>

                              {isSelected && selectedFeature && (
                                <div className="grid grid-cols-2 gap-3">
                                  <div>
                                    <label className="text-xs text-gray-300 block mb-1">
                                      Custom Price
                                    </label>
                                    <input
                                      type="number"
                                      value={selectedFeature.customPrice}
                                      onChange={(e) =>
                                        updateSelectedFeature(feature._id, {
                                          customPrice:
                                            parseFloat(e.target.value) || 0,
                                        })
                                      }
                                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white text-sm"
                                    />
                                  </div>
                                  <div>
                                    <label className="text-xs text-gray-300 block mb-1">
                                      Quantity
                                    </label>
                                    <div className="flex items-center space-x-2">
                                      <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() =>
                                          updateSelectedFeature(feature._id, {
                                            quantity: Math.max(
                                              1,
                                              selectedFeature.quantity - 1
                                            ),
                                          })
                                        }
                                        className="h-8 w-8 p-0"
                                      >
                                        <Minus className="h-3 w-3" />
                                      </Button>
                                      <span className="text-white font-medium w-8 text-center">
                                        {selectedFeature.quantity}
                                      </span>
                                      <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() =>
                                          updateSelectedFeature(feature._id, {
                                            quantity:
                                              selectedFeature.quantity + 1,
                                          })
                                        }
                                        className="h-8 w-8 p-0"
                                      >
                                        <Plus className="h-3 w-3" />
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                </div>
              </div>
            ))}
          </Card>

          {/* Quote Summary */}
          {selectedFeatures.length > 0 && (
            <Card className="p-6 bg-gray-800 border-gray-700">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <Calculator className="h-5 w-5 mr-2" />
                Quote Summary
              </h3>

              <div className="space-y-3">
                {selectedFeatures.map((feature) => (
                  <div
                    key={feature.featureId}
                    className="flex justify-between items-center py-2 border-b border-gray-700"
                  >
                    <div>
                      <span className="text-white font-medium">
                        {feature.title}
                      </span>
                      {feature.quantity > 1 && (
                        <span className="text-gray-400 ml-2">
                          × {feature.quantity}
                        </span>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="text-white font-medium">
                        $
                        {(
                          feature.customPrice * feature.quantity
                        ).toLocaleString()}
                      </div>
                      {feature.customPrice !== feature.basePrice && (
                        <div className="text-xs text-gray-400">
                          (${feature.customPrice.toLocaleString()} each)
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                <div className="pt-3 space-y-2">
                  <div className="flex justify-between text-gray-300">
                    <span>Subtotal:</span>
                    <span>${subtotal.toLocaleString()}</span>
                  </div>

                  {formData.tax > 0 && (
                    <div className="flex justify-between text-gray-300">
                      <span>Tax ({formData.tax}%):</span>
                      <span>${taxAmount.toLocaleString()}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-xl font-bold text-white border-t border-gray-600 pt-2">
                    <span>Total:</span>
                    <span>${total.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </Card>
          )}

          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <Link href="/dashboard/quotes">
              <Button variant="outline" type="button">
                Cancel
              </Button>
            </Link>
            <Button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700"
              disabled={
                submitting ||
                !formData.clientId ||
                !formData.projectId ||
                selectedFeatures.length === 0
              }
            >
              {submitting ? "Creating..." : "Create Quote"}
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
