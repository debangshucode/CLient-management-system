'use client';

import { Document, Page, Text, View, StyleSheet, PDFDownloadLink } from '@react-pdf/renderer';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

interface QuoteData {
  quoteNumber: string;
  clientId: {
    name: string;
    email: string;
    company?: string;
    address?: string;
    phone?: string;
  };
  projectId: {
    title: string;
    description?: string;
  };
  features: Array<{
    title: string;
    description: string;
    customPrice: number;
    quantity: number;
  }>;
  subtotal: number;
  tax: number;
  total: number;
  validUntil?: string;
  notes?: string;
  createdAt: string;
}

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    padding: 40,
    fontSize: 12,
    lineHeight: 1.5,
  },
  header: {
    marginBottom: 30,
    borderBottom: '2 solid #e2e8f0',
    paddingBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a202c',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    color: '#4a5568',
    marginBottom: 5,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2d3748',
    marginBottom: 10,
    borderBottom: '1 solid #e2e8f0',
    paddingBottom: 5,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  featureItem: {
    marginBottom: 15,
    padding: 12,
    backgroundColor: '#f7fafc',
    borderRadius: 4,
  },
  featureTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2d3748',
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 11,
    color: '#4a5568',
    marginBottom: 6,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalSection: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#edf2f7',
    borderRadius: 4,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  finalTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    paddingTop: 10,
    borderTop: '2 solid #4a5568',
    fontSize: 16,
    fontWeight: 'bold',
  },
  notes: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#f7fafc',
    borderRadius: 4,
  },
  notesTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  notesText: {
    fontSize: 11,
    color: '#4a5568',
    lineHeight: 1.4,
  },
});

const QuotePDFDocument = ({ quote }: { quote: QuoteData }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Quote {quote.quoteNumber}</Text>
        <Text style={styles.subtitle}>Date: {new Date(quote.createdAt).toLocaleDateString()}</Text>
        {quote.validUntil && (
          <Text style={styles.subtitle}>Valid Until: {new Date(quote.validUntil).toLocaleDateString()}</Text>
        )}
      </View>

      {/* Client Information */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Client Information</Text>
        <Text style={{ marginBottom: 4, fontSize: 14, fontWeight: 'bold' }}>{quote.clientId.name}</Text>
        {quote.clientId.company && <Text style={{ marginBottom: 4 }}>{quote.clientId.company}</Text>}
        <Text style={{ marginBottom: 4 }}>{quote.clientId.email}</Text>
        {quote.clientId.phone && <Text style={{ marginBottom: 4 }}>{quote.clientId.phone}</Text>}
        {quote.clientId.address && <Text>{quote.clientId.address}</Text>}
      </View>

      {/* Project Information */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Project</Text>
        <Text style={{ fontSize: 14, fontWeight: 'bold', marginBottom: 4 }}>{quote.projectId.title}</Text>
        {quote.projectId.description && <Text style={{ color: '#4a5568' }}>{quote.projectId.description}</Text>}
      </View>

      {/* Features */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Services & Features</Text>
        {quote.features.map((feature, index) => (
          <View key={index} style={styles.featureItem}>
            <Text style={styles.featureTitle}>{feature.title}</Text>
            <Text style={styles.featureDescription}>{feature.description}</Text>
            <View style={styles.priceRow}>
              <Text>Quantity: {feature.quantity}</Text>
              <Text style={{ fontWeight: 'bold' }}>
                ${(feature.customPrice * feature.quantity).toLocaleString()}
              </Text>
            </View>
          </View>
        ))}
      </View>

      {/* Total */}
      <View style={styles.totalSection}>
        <View style={styles.totalRow}>
          <Text>Subtotal:</Text>
          <Text>${quote.subtotal.toLocaleString()}</Text>
        </View>
        {quote.tax > 0 && (
          <View style={styles.totalRow}>
            <Text>Tax:</Text>
            <Text>${(quote.subtotal * (quote.tax / 100)).toLocaleString()}</Text>
          </View>
        )}
        <View style={styles.finalTotal}>
          <Text>Total:</Text>
          <Text>${quote.total.toLocaleString()}</Text>
        </View>
      </View>

      {/* Notes */}
      {quote.notes && (
        <View style={styles.notes}>
          <Text style={styles.notesTitle}>Additional Notes</Text>
          <Text style={styles.notesText}>{quote.notes}</Text>
        </View>
      )}
    </Page>
  </Document>
);

interface QuotePDFProps {
  quote: QuoteData;
  className?: string;
}

export default function QuotePDF({ quote, className }: QuotePDFProps) {
  return (
    <PDFDownloadLink
      document={<QuotePDFDocument quote={quote} />}
      fileName={`quote-${quote.quoteNumber}.pdf`}
    >
      {({ blob, url, loading, error }) => (
        <Button
          className={className}
          disabled={loading}
          variant="outline"
        >
          <Download className="h-4 w-4 mr-2" />
          {loading ? 'Generating PDF...' : 'Download PDF'}
        </Button>
      )}
    </PDFDownloadLink>
  );
}