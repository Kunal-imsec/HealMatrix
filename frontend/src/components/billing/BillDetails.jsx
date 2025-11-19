import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { billingService } from '../../services/billingService';
import Card from '../common/Card';
import Button from '../common/Button';
import LoadingSpinner from '../common/LoadingSpinner';
import PaymentForm from './PaymentForm';
import {
  CreditCard,
  User,
  Calendar,
  FileText,
  Download,
  Edit,
  AlertTriangle,
  CheckCircle,
  Clock,
  DollarSign,
  Mail,
  Phone,
  MapPin,
  Receipt,
  Printer
} from 'lucide-react';

const BillDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [bill, setBill] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPaymentForm, setShowPaymentForm] = useState(false);

  useEffect(() => {
    fetchBillDetails();
  }, [id]);

  const fetchBillDetails = async () => {
    try {
      setLoading(true);
      const response = await billingService.getBillById(id);
      setBill(response);
    } catch (err) {
      setError('Failed to fetch bill details');
      console.error('Error fetching bill:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'PAID': return 'bg-green-100 text-green-800 border-green-200';
      case 'PENDING': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'OVERDUE': return 'bg-red-100 text-red-800 border-red-200';
      case 'CANCELLED': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'PARTIAL': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'PAID': return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'PENDING': return <Clock className="h-5 w-5 text-yellow-600" />;
      case 'OVERDUE': return <AlertTriangle className="h-5 w-5 text-red-600" />;
      case 'CANCELLED': return <AlertTriangle className="h-5 w-5 text-gray-600" />;
      default: return <FileText className="h-5 w-5 text-blue-600" />;
    }
  };

  const handlePayment = async (paymentData) => {
    try {
      await billingService.processPayment(bill.id, paymentData);
      setShowPaymentForm(false);
      fetchBillDetails(); // Refresh bill details
    } catch (err) {
      console.error('Error processing payment:', err);
      throw err;
    }
  };

  const handlePrintBill = () => {
    window.print();
  };

  const handleDownloadPDF = async () => {
    try {
      const pdfData = await billingService.downloadBillPDF(bill.id);
      // Handle PDF download logic
      console.log('Download PDF:', pdfData);
    } catch (err) {
      console.error('Error downloading PDF:', err);
    }
  };

  const calculateDueAmount = () => {
    return parseFloat(bill.totalAmount) - parseFloat(bill.paidAmount || 0);
  };

  const canEdit = ['ADMIN', 'RECEPTIONIST'].includes(user.role);
  const canPay = user.role === 'PATIENT' && ['PENDING', 'PARTIAL'].includes(bill?.status);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error || !bill) {
    return (
      <div className="text-center py-12">
        <AlertTriangle className="mx-auto h-12 w-12 text-red-500" />
        <h3 className="mt-2 text-lg font-medium text-gray-900">Error Loading Bill</h3>
        <p className="mt-1 text-gray-500">{error || 'Bill not found'}</p>
        <Button
          className="mt-4"
          onClick={() => navigate('/billing')}
        >
          Back to Bills
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 print:space-y-4">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border p-6 print:shadow-none print:border-none">
        <div className="flex items-start justify-between print:flex-col print:space-y-4">
          <div className="flex items-start space-x-4">
            <div className="p-3 bg-blue-100 rounded-lg print:hidden">
              <Receipt className="h-8 w-8 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 print:text-xl">
                Bill #{bill.billNumber}
              </h1>
              <div className="flex items-center space-x-2 mt-2">
                {getStatusIcon(bill.status)}
                <span className={`px-3 py-1 text-sm font-medium rounded-full border ${getStatusColor(bill.status)}`}>
                  {bill.status}
                </span>
              </div>
              <p className="text-gray-600 text-sm mt-2">
                Issued on {new Date(bill.billDate).toLocaleDateString()}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3 print:hidden">
            <Button
              variant="outline"
              leftIcon={<Printer className="h-4 w-4" />}
              onClick={handlePrintBill}
            >
              Print
            </Button>
            
            <Button
              variant="outline"
              leftIcon={<Download className="h-4 w-4" />}
              onClick={handleDownloadPDF}
            >
              Download PDF
            </Button>

            {canEdit && (
              <Button
                variant="outline"
                leftIcon={<Edit className="h-4 w-4" />}
                onClick={() => navigate(`/billing/${bill.id}/edit`)}
              >
                Edit Bill
              </Button>
            )}

            {canPay && (
              <Button
                variant="primary"
                leftIcon={<CreditCard className="h-4 w-4" />}
                onClick={() => setShowPaymentForm(true)}
              >
                Pay Bill
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Bill Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Patient Information */}
          <Card title="Patient Information">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <User className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Patient Name</p>
                    <p className="text-sm text-gray-600">{bill.patientName}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <FileText className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Patient ID</p>
                    <p className="text-sm text-gray-600">{bill.patientId}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Email</p>
                    <p className="text-sm text-gray-600">{bill.patientEmail || 'Not provided'}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Phone</p>
                    <p className="text-sm text-gray-600">{bill.patientPhone || 'Not provided'}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <MapPin className="h-4 w-4 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Address</p>
                    <p className="text-sm text-gray-600">{bill.patientAddress || 'Not provided'}</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Service Details */}
          <Card title="Service Details">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-gray-200">
                  <tr>
                    <th className="text-left py-3 text-sm font-medium text-gray-900">Service</th>
                    <th className="text-right py-3 text-sm font-medium text-gray-900">Quantity</th>
                    <th className="text-right py-3 text-sm font-medium text-gray-900">Unit Price</th>
                    <th className="text-right py-3 text-sm font-medium text-gray-900">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {bill.billItems?.map((item, index) => (
                    <tr key={index}>
                      <td className="py-3">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{item.serviceName}</p>
                          {item.description && (
                            <p className="text-xs text-gray-500">{item.description}</p>
                          )}
                        </div>
                      </td>
                      <td className="py-3 text-right text-sm text-gray-600">{item.quantity}</td>
                      <td className="py-3 text-right text-sm text-gray-600">
                        ${parseFloat(item.unitPrice).toFixed(2)}
                      </td>
                      <td className="py-3 text-right text-sm font-medium text-gray-900">
                        ${(parseFloat(item.unitPrice) * parseInt(item.quantity)).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Bill Summary */}
            <div className="border-t border-gray-200 mt-4 pt-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="text-gray-900">${parseFloat(bill.subtotal || bill.totalAmount).toFixed(2)}</span>
                </div>
                
                {bill.taxAmount && parseFloat(bill.taxAmount) > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Tax ({bill.taxRate || 0}%)</span>
                    <span className="text-gray-900">${parseFloat(bill.taxAmount).toFixed(2)}</span>
                  </div>
                )}
                
                {bill.discountAmount && parseFloat(bill.discountAmount) > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Discount</span>
                    <span className="text-green-600">-${parseFloat(bill.discountAmount).toFixed(2)}</span>
                  </div>
                )}
                
                <div className="flex justify-between text-lg font-bold border-t pt-2">
                  <span className="text-gray-900">Total Amount</span>
                  <span className="text-gray-900">${parseFloat(bill.totalAmount).toFixed(2)}</span>
                </div>
              </div>
            </div>
          </Card>

          {/* Payment History */}
          {bill.payments && bill.payments.length > 0 && (
            <Card title="Payment History">
              <div className="space-y-3">
                {bill.payments.map((payment, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <div>
                        <p className="text-sm font-medium text-green-900">
                          Payment #{payment.transactionId}
                        </p>
                        <p className="text-xs text-green-700">
                          {new Date(payment.paymentDate).toLocaleDateString()} • {payment.paymentMethod}
                        </p>
                      </div>
                    </div>
                    <span className="text-sm font-bold text-green-900">
                      ${parseFloat(payment.amount).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>

        {/* Summary and Actions */}
        <div className="space-y-6">
          {/* Amount Summary */}
          <Card title="Amount Summary">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <DollarSign className="h-5 w-5 text-blue-600" />
                  <span className="text-sm font-medium text-blue-900">Total Amount</span>
                </div>
                <span className="text-lg font-bold text-blue-600">
                  ${parseFloat(bill.totalAmount).toFixed(2)}
                </span>
              </div>

              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span className="text-sm font-medium text-green-900">Paid Amount</span>
                </div>
                <span className="text-lg font-bold text-green-600">
                  ${parseFloat(bill.paidAmount || 0).toFixed(2)}
                </span>
              </div>

              <div className={`flex items-center justify-between p-3 rounded-lg ${
                calculateDueAmount() > 0 ? 'bg-red-50' : 'bg-gray-50'
              }`}>
                <div className="flex items-center space-x-2">
                  <AlertTriangle className={`h-5 w-5 ${
                    calculateDueAmount() > 0 ? 'text-red-600' : 'text-gray-600'
                  }`} />
                  <span className={`text-sm font-medium ${
                    calculateDueAmount() > 0 ? 'text-red-900' : 'text-gray-900'
                  }`}>
                    Due Amount
                  </span>
                </div>
                <span className={`text-lg font-bold ${
                  calculateDueAmount() > 0 ? 'text-red-600' : 'text-gray-600'
                }`}>
                  ${calculateDueAmount().toFixed(2)}
                </span>
              </div>
            </div>
          </Card>

          {/* Bill Information */}
          <Card title="Bill Information">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Bill Date</span>
                <span className="text-sm text-gray-900">
                  {new Date(bill.billDate).toLocaleDateString()}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Due Date</span>
                <span className={`text-sm ${
                  new Date(bill.dueDate) < new Date() ? 'text-red-600 font-medium' : 'text-gray-900'
                }`}>
                  {new Date(bill.dueDate).toLocaleDateString()}
                </span>
              </div>
              
              {bill.doctorName && (
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Doctor</span>
                  <span className="text-sm text-gray-900">Dr. {bill.doctorName}</span>
                </div>
              )}
              
              {bill.department && (
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Department</span>
                  <span className="text-sm text-gray-900">{bill.department}</span>
                </div>
              )}
            </div>
          </Card>

          {/* Notes */}
          {bill.notes && (
            <Card title="Notes">
              <p className="text-sm text-gray-600 leading-relaxed">{bill.notes}</p>
            </Card>
          )}
        </div>
      </div>

      {/* Payment Form Modal */}
      {showPaymentForm && (
        <PaymentForm
          bill={bill}
          isOpen={showPaymentForm}
          onClose={() => setShowPaymentForm(false)}
          onPayment={handlePayment}
        />
      )}
    </div>
  );
};

export default BillDetails;
