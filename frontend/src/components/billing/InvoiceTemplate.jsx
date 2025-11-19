import React from 'react';
import { Download, Print, Mail } from 'lucide-react';
import Button from '../common/Button';

const InvoiceTemplate = ({ 
  invoice, 
  hospitalInfo = {}, 
  onDownload, 
  onPrint, 
  onEmail,
  showActions = true 
}) => {
  if (!invoice) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
        <p className="text-gray-500">No invoice data available</p>
      </div>
    );
  }

  const calculateSubtotal = () => {
    return invoice.items?.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0) || 0;
  };

  const calculateTax = () => {
    const subtotal = calculateSubtotal();
    return subtotal * (invoice.taxRate || 0) / 100;
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const tax = calculateTax();
    const discount = invoice.discount || 0;
    return subtotal + tax - discount;
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Actions Bar */}
      {showActions && (
        <div className="flex items-center justify-end space-x-3 p-4 border-b border-gray-200">
          <Button
            size="sm"
            variant="outline"
            leftIcon={<Download className="h-4 w-4" />}
            onClick={onDownload}
          >
            Download PDF
          </Button>
          <Button
            size="sm"
            variant="outline"
            leftIcon={<Print className="h-4 w-4" />}
            onClick={onPrint}
          >
            Print
          </Button>
          <Button
            size="sm"
            variant="outline"
            leftIcon={<Mail className="h-4 w-4" />}
            onClick={onEmail}
          >
            Email
          </Button>
        </div>
      )}

      {/* Invoice Content */}
      <div className="p-8" id="invoice-content">
        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">INVOICE</h1>
            <p className="text-gray-600 mt-1">#{invoice.invoiceNumber}</p>
          </div>
          
          {hospitalInfo.logo ? (
            <img 
              src={hospitalInfo.logo} 
              alt="Hospital Logo" 
              className="h-16 w-auto"
            />
          ) : (
            <div className="bg-blue-600 text-white p-4 rounded-lg">
              <span className="text-xl font-bold">HMS</span>
            </div>
          )}
        </div>

        {/* Hospital and Patient Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* From */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">
              From
            </h3>
            <div className="text-gray-900">
              <p className="font-semibold text-lg">
                {hospitalInfo.name || 'Hospital Management System'}
              </p>
              <p>{hospitalInfo.address || '123 Healthcare Ave'}</p>
              <p>{hospitalInfo.city || 'Medical City'}, {hospitalInfo.state || 'ST'} {hospitalInfo.zipCode || '12345'}</p>
              <p className="mt-2">
                Phone: {hospitalInfo.phone || '(555) 123-4567'}
              </p>
              <p>Email: {hospitalInfo.email || 'billing@hospital.com'}</p>
              {hospitalInfo.taxId && (
                <p>Tax ID: {hospitalInfo.taxId}</p>
              )}
            </div>
          </div>

          {/* To */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">
              Bill To
            </h3>
            <div className="text-gray-900">
              <p className="font-semibold text-lg">{invoice.patientName}</p>
              <p>Patient ID: {invoice.patientId}</p>
              {invoice.patientAddress && <p>{invoice.patientAddress}</p>}
              {invoice.patientCity && (
                <p>{invoice.patientCity}, {invoice.patientState} {invoice.patientZipCode}</p>
              )}
              {invoice.patientPhone && <p className="mt-2">Phone: {invoice.patientPhone}</p>}
              {invoice.patientEmail && <p>Email: {invoice.patientEmail}</p>}
              {invoice.insuranceInfo && (
                <div className="mt-2">
                  <p className="font-medium">Insurance:</p>
                  <p>{invoice.insuranceInfo.provider}</p>
                  <p>Policy: {invoice.insuranceInfo.policyNumber}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Invoice Details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
              Invoice Date
            </h4>
            <p className="text-gray-900 font-medium">
              {new Date(invoice.invoiceDate).toLocaleDateString()}
            </p>
          </div>
          
          <div>
            <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
              Due Date
            </h4>
            <p className="text-gray-900 font-medium">
              {new Date(invoice.dueDate).toLocaleDateString()}
            </p>
          </div>
          
          <div>
            <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
              Service Date
            </h4>
            <p className="text-gray-900 font-medium">
              {invoice.serviceDate ? new Date(invoice.serviceDate).toLocaleDateString() : 'N/A'}
            </p>
          </div>
        </div>

        {/* Items Table */}
        <div className="mb-8">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Description</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-700">Qty</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-700">Unit Price</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-700">Amount</th>
                </tr>
              </thead>
              <tbody>
                {invoice.items?.map((item, index) => (
                  <tr key={index} className="border-b border-gray-100">
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-medium text-gray-900">{item.description}</p>
                        {item.details && (
                          <p className="text-sm text-gray-600">{item.details}</p>
                        )}
                        {item.code && (
                          <p className="text-xs text-gray-500">Code: {item.code}</p>
                        )}
                      </div>
                    </td>
                    <td className="text-center py-3 px-4 text-gray-900">
                      {item.quantity}
                    </td>
                    <td className="text-right py-3 px-4 text-gray-900">
                      {formatCurrency(item.unitPrice)}
                    </td>
                    <td className="text-right py-3 px-4 font-medium text-gray-900">
                      {formatCurrency(item.quantity * item.unitPrice)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Totals */}
        <div className="flex justify-end mb-8">
          <div className="w-full max-w-sm">
            <div className="space-y-2">
              <div className="flex justify-between py-2">
                <span className="text-gray-600">Subtotal:</span>
                <span className="font-medium text-gray-900">
                  {formatCurrency(calculateSubtotal())}
                </span>
              </div>
              
              {invoice.discount > 0 && (
                <div className="flex justify-between py-2">
                  <span className="text-gray-600">Discount:</span>
                  <span className="font-medium text-green-600">
                    -{formatCurrency(invoice.discount)}
                  </span>
                </div>
              )}
              
              {invoice.taxRate > 0 && (
                <div className="flex justify-between py-2">
                  <span className="text-gray-600">Tax ({invoice.taxRate}%):</span>
                  <span className="font-medium text-gray-900">
                    {formatCurrency(calculateTax())}
                  </span>
                </div>
              )}
              
              <div className="border-t border-gray-200 pt-2">
                <div className="flex justify-between py-2">
                  <span className="text-lg font-semibold text-gray-900">Total:</span>
                  <span className="text-lg font-bold text-gray-900">
                    {formatCurrency(calculateTotal())}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Information */}
        {invoice.paymentInfo && (
          <div className="mb-8">
            <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">
              Payment Information
            </h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Amount Due:</p>
                  <p className="font-semibold text-lg text-red-600">
                    {formatCurrency(invoice.paymentInfo.amountDue || calculateTotal())}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Payment Status:</p>
                  <p className={`font-medium ${
                    invoice.paymentInfo.status === 'PAID' ? 'text-green-600' : 
                    invoice.paymentInfo.status === 'PARTIAL' ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    {invoice.paymentInfo.status}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Notes */}
        {invoice.notes && (
          <div className="mb-8">
            <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">
              Notes
            </h3>
            <p className="text-gray-600 whitespace-pre-wrap">{invoice.notes}</p>
          </div>
        )}

        {/* Terms and Conditions */}
        <div className="mb-8">
          <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">
            Terms & Conditions
          </h3>
          <div className="text-sm text-gray-600 space-y-2">
            <p>• Payment is due within 30 days of invoice date.</p>
            <p>• Late payments may be subject to a 1.5% monthly service charge.</p>
            <p>• For questions about this invoice, please contact our billing department.</p>
            {invoice.termsAndConditions && (
              <p>• {invoice.termsAndConditions}</p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 pt-8 text-center">
          <p className="text-sm text-gray-500">
            Thank you for choosing {hospitalInfo.name || 'our healthcare services'}!
          </p>
          <p className="text-xs text-gray-400 mt-2">
            This is a computer-generated invoice and does not require a signature.
          </p>
        </div>
      </div>
    </div>
  );
};

export default InvoiceTemplate;
