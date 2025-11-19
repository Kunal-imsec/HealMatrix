import React from 'react';
import { Download, Print, Mail, CheckCircle } from 'lucide-react';
import Button from '../common/Button';

const PaymentReceipt = ({ 
  payment, 
  hospitalInfo = {}, 
  onDownload, 
  onPrint, 
  onEmail,
  showActions = true 
}) => {
  if (!payment) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
        <p className="text-gray-500">No payment data available</p>
      </div>
    );
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getPaymentMethodDisplay = (method) => {
    switch (method) {
      case 'CREDIT_CARD':
        return 'Credit Card';
      case 'DEBIT_CARD':
        return 'Debit Card';
      case 'CASH':
        return 'Cash';
      case 'CHECK':
        return 'Check';
      case 'BANK_TRANSFER':
        return 'Bank Transfer';
      case 'INSURANCE':
        return 'Insurance';
      default:
        return method;
    }
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

      {/* Receipt Content */}
      <div className="p-8" id="receipt-content">
        {/* Header */}
        <div className="text-center mb-8">
          {hospitalInfo.logo ? (
            <img 
              src={hospitalInfo.logo} 
              alt="Hospital Logo" 
              className="h-16 w-auto mx-auto mb-4"
            />
          ) : (
            <div className="bg-blue-600 text-white p-4 rounded-lg inline-block mb-4">
              <span className="text-xl font-bold">HMS</span>
            </div>
          )}
          
          <h1 className="text-2xl font-bold text-gray-900 mb-2">PAYMENT RECEIPT</h1>
          <p className="text-gray-600">Receipt #{payment.receiptNumber || payment.transactionId}</p>
        </div>

        {/* Success Badge */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center space-x-2 bg-green-100 text-green-800 px-4 py-2 rounded-full">
            <CheckCircle className="h-5 w-5" />
            <span className="font-medium">Payment Successful</span>
          </div>
        </div>

        {/* Hospital Information */}
        <div className="text-center mb-8 pb-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            {hospitalInfo.name || 'Hospital Management System'}
          </h2>
          <div className="text-gray-600 text-sm">
            <p>{hospitalInfo.address || '123 Healthcare Ave'}</p>
            <p>{hospitalInfo.city || 'Medical City'}, {hospitalInfo.state || 'ST'} {hospitalInfo.zipCode || '12345'}</p>
            <p className="mt-1">
              Phone: {hospitalInfo.phone || '(555) 123-4567'} | 
              Email: {hospitalInfo.email || 'billing@hospital.com'}
            </p>
            {hospitalInfo.taxId && (
              <p>Tax ID: {hospitalInfo.taxId}</p>
            )}
          </div>
        </div>

        {/* Payment Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Patient Information */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">
              Patient Information
            </h3>
            <div className="space-y-2 text-sm">
              <div>
                <span className="text-gray-600">Name:</span>
                <span className="ml-2 font-medium text-gray-900">{payment.patientName}</span>
              </div>
              <div>
                <span className="text-gray-600">Patient ID:</span>
                <span className="ml-2 font-medium text-gray-900">{payment.patientId}</span>
              </div>
              {payment.patientPhone && (
                <div>
                  <span className="text-gray-600">Phone:</span>
                  <span className="ml-2 font-medium text-gray-900">{payment.patientPhone}</span>
                </div>
              )}
              {payment.patientEmail && (
                <div>
                  <span className="text-gray-600">Email:</span>
                  <span className="ml-2 font-medium text-gray-900">{payment.patientEmail}</span>
                </div>
              )}
            </div>
          </div>

          {/* Payment Information */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">
              Payment Information
            </h3>
            <div className="space-y-2 text-sm">
              <div>
                <span className="text-gray-600">Transaction ID:</span>
                <span className="ml-2 font-medium text-gray-900 font-mono">
                  {payment.transactionId}
                </span>
              </div>
              <div>
                <span className="text-gray-600">Payment Date:</span>
                <span className="ml-2 font-medium text-gray-900">
                  {new Date(payment.paymentDate).toLocaleString()}
                </span>
              </div>
              <div>
                <span className="text-gray-600">Payment Method:</span>
                <span className="ml-2 font-medium text-gray-900">
                  {getPaymentMethodDisplay(payment.paymentMethod)}
                </span>
              </div>
              {payment.cardLastFour && (
                <div>
                  <span className="text-gray-600">Card:</span>
                  <span className="ml-2 font-medium text-gray-900">
                    **** **** **** {payment.cardLastFour}
                  </span>
                </div>
              )}
              {payment.authorizationCode && (
                <div>
                  <span className="text-gray-600">Authorization:</span>
                  <span className="ml-2 font-medium text-gray-900 font-mono">
                    {payment.authorizationCode}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bill Information */}
        {payment.billNumber && (
          <div className="mb-8">
            <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">
              Bill Information
            </h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Bill Number:</span>
                  <span className="ml-2 font-medium text-gray-900 font-mono">
                    {payment.billNumber}
                  </span>
                </div>
                {payment.serviceDate && (
                  <div>
                    <span className="text-gray-600">Service Date:</span>
                    <span className="ml-2 font-medium text-gray-900">
                      {new Date(payment.serviceDate).toLocaleDateString()}
                    </span>
                  </div>
                )}
                {payment.doctorName && (
                  <div>
                    <span className="text-gray-600">Doctor:</span>
                    <span className="ml-2 font-medium text-gray-900">
                      Dr. {payment.doctorName}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Amount Details */}
        <div className="mb-8">
          <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">
            Amount Details
          </h3>
          <div className="bg-gray-50 rounded-lg p-6">
            <div className="space-y-3">
              {payment.originalAmount && payment.originalAmount !== payment.amount && (
                <div className="flex justify-between py-2 text-sm">
                  <span className="text-gray-600">Original Amount:</span>
                  <span className="font-medium text-gray-900">
                    {formatCurrency(payment.originalAmount)}
                  </span>
                </div>
              )}
              
              {payment.discount && payment.discount > 0 && (
                <div className="flex justify-between py-2 text-sm">
                  <span className="text-gray-600">Discount Applied:</span>
                  <span className="font-medium text-green-600">
                    -{formatCurrency(payment.discount)}
                  </span>
                </div>
              )}
              
              {payment.tax && payment.tax > 0 && (
                <div className="flex justify-between py-2 text-sm">
                  <span className="text-gray-600">Tax:</span>
                  <span className="font-medium text-gray-900">
                    {formatCurrency(payment.tax)}
                  </span>
                </div>
              )}
              
              <div className="border-t border-gray-200 pt-3">
                <div className="flex justify-between py-2">
                  <span className="text-lg font-semibold text-gray-900">Amount Paid:</span>
                  <span className="text-lg font-bold text-green-600">
                    {formatCurrency(payment.amount)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Services/Items */}
        {payment.items && payment.items.length > 0 && (
          <div className="mb-8">
            <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">
              Services
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-2 px-2 font-medium text-gray-700">Description</th>
                    <th className="text-right py-2 px-2 font-medium text-gray-700">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {payment.items.map((item, index) => (
                    <tr key={index} className="border-b border-gray-100">
                      <td className="py-2 px-2 text-gray-900">{item.description}</td>
                      <td className="text-right py-2 px-2 text-gray-900">
                        {formatCurrency(item.amount)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Payment Notes */}
        {payment.notes && (
          <div className="mb-8">
            <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">
              Notes
            </h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-700">{payment.notes}</p>
            </div>
          </div>
        )}

        {/* Important Information */}
        <div className="mb-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-medium text-blue-900 mb-2">Important Information</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• This receipt serves as proof of payment for your medical services.</li>
            <li>• Please retain this receipt for your records and insurance claims.</li>
            <li>• For questions about this payment, please contact our billing department.</li>
            <li>• Refunds, if applicable, will be processed to the original payment method.</li>
          </ul>
        </div>

        {/* Footer */}
        <div className="text-center pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-600 mb-2">
            Thank you for choosing {hospitalInfo.name || 'our healthcare services'}!
          </p>
          <p className="text-xs text-gray-400">
            This is a computer-generated receipt and does not require a signature.
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Generated on {new Date().toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentReceipt;
