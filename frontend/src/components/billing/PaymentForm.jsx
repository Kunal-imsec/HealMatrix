import React, { useState } from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import Input from '../common/Input';
import {
  CreditCard,
  DollarSign,
  Calendar,
  Lock,
  AlertCircle,
  CheckCircle
} from 'lucide-react';

const PaymentForm = ({ bill, isOpen, onClose, onPayment }) => {
  const [paymentData, setPaymentData] = useState({
    amount: (parseFloat(bill.totalAmount) - parseFloat(bill.paidAmount || 0)).toFixed(2),
    paymentMethod: 'CREDIT_CARD',
    cardNumber: '',
    cardHolderName: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: '',
    paymentNote: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [step, setStep] = useState(1); // 1: Amount, 2: Payment Details, 3: Confirmation

  const dueAmount = parseFloat(bill.totalAmount) - parseFloat(bill.paidAmount || 0);
  const isPartialPayment = parseFloat(paymentData.amount) < dueAmount;

  const handleInputChange = (field, value) => {
    setPaymentData(prev => ({ ...prev, [field]: value }));
    if (error) setError(null);
  };

  const validateStep1 = () => {
    const amount = parseFloat(paymentData.amount);
    if (!amount || amount <= 0) {
      setError('Please enter a valid payment amount');
      return false;
    }
    if (amount > dueAmount) {
      setError('Payment amount cannot exceed the due amount');
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    if (paymentData.paymentMethod === 'CREDIT_CARD') {
      if (!paymentData.cardNumber || paymentData.cardNumber.length < 16) {
        setError('Please enter a valid card number');
        return false;
      }
      if (!paymentData.cardHolderName) {
        setError('Please enter the card holder name');
        return false;
      }
      if (!paymentData.expiryMonth || !paymentData.expiryYear) {
        setError('Please enter the card expiry date');
        return false;
      }
      if (!paymentData.cvv || paymentData.cvv.length < 3) {
        setError('Please enter a valid CVV');
        return false;
      }
    }
    return true;
  };

  const handleNext = () => {
    setError(null);
    if (step === 1 && validateStep1()) {
      setStep(2);
    } else if (step === 2 && validateStep2()) {
      setStep(3);
    }
  };

  const handleBack = () => {
    setStep(prev => prev - 1);
    setError(null);
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);

    try {
      await onPayment({
        ...paymentData,
        billId: bill.id,
        amount: parseFloat(paymentData.amount)
      });
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatCardNumber = (value) => {
    // Remove all non-digits
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    // Add space every 4 digits
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    return parts.length ? parts.join(' ') : v;
  };

  const handleCardNumberChange = (e) => {
    const formatted = formatCardNumber(e.target.value);
    if (formatted.length <= 19) { // Max length with spaces
      handleInputChange('cardNumber', formatted);
    }
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <DollarSign className="mx-auto h-12 w-12 text-green-600 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900">Payment Amount</h3>
        <p className="text-gray-600">Enter the amount you want to pay</p>
      </div>

      <div className="bg-gray-50 rounded-lg p-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Total Bill:</span>
            <span className="font-medium">${parseFloat(bill.totalAmount).toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Paid:</span>
            <span className="text-green-600">${parseFloat(bill.paidAmount || 0).toFixed(2)}</span>
          </div>
          <div className="flex justify-between col-span-2 border-t pt-2">
            <span className="text-gray-900 font-medium">Due Amount:</span>
            <span className="font-bold text-red-600">${dueAmount.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <div>
        <Input
          label="Payment Amount ($)"
          type="number"
          min="0.01"
          max={dueAmount}
          step="0.01"
          value={paymentData.amount}
          onChange={(e) => handleInputChange('amount', e.target.value)}
          placeholder="0.00"
          required
        />
        
        {isPartialPayment && (
          <div className="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center space-x-2">
              <AlertCircle className="h-4 w-4 text-yellow-600" />
              <span className="text-sm text-yellow-800">
                This is a partial payment. Remaining balance: ${(dueAmount - parseFloat(paymentData.amount)).toFixed(2)}
              </span>
            </div>
          </div>
        )}
      </div>

      <div className="flex space-x-2">
        <Button
          variant="outline"
          onClick={() => handleInputChange('amount', (dueAmount * 0.5).toFixed(2))}
          size="sm"
          fullWidth
        >
          Pay 50%
        </Button>
        <Button
          variant="outline"
          onClick={() => handleInputChange('amount', dueAmount.toFixed(2))}
          size="sm"
          fullWidth
        >
          Pay Full
        </Button>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <CreditCard className="mx-auto h-12 w-12 text-blue-600 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900">Payment Details</h3>
        <p className="text-gray-600">Enter your payment information</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Payment Method</label>
        <div className="grid grid-cols-1 gap-3">
          <label className="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
            <input
              type="radio"
              name="paymentMethod"
              value="CREDIT_CARD"
              checked={paymentData.paymentMethod === 'CREDIT_CARD'}
              onChange={(e) => handleInputChange('paymentMethod', e.target.value)}
              className="mr-3"
            />
            <CreditCard className="h-5 w-5 text-blue-600 mr-2" />
            <span>Credit/Debit Card</span>
          </label>
          
          <label className="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
            <input
              type="radio"
              name="paymentMethod"
              value="CASH"
              checked={paymentData.paymentMethod === 'CASH'}
              onChange={(e) => handleInputChange('paymentMethod', e.target.value)}
              className="mr-3"
            />
            <DollarSign className="h-5 w-5 text-green-600 mr-2" />
            <span>Cash Payment</span>
          </label>
        </div>
      </div>

      {paymentData.paymentMethod === 'CREDIT_CARD' && (
        <div className="space-y-4">
          <Input
            label="Card Number"
            value={paymentData.cardNumber}
            onChange={handleCardNumberChange}
            placeholder="1234 5678 9012 3456"
            leftIcon={<CreditCard className="h-4 w-4 text-gray-400" />}
            required
          />

          <Input
            label="Card Holder Name"
            value={paymentData.cardHolderName}
            onChange={(e) => handleInputChange('cardHolderName', e.target.value.toUpperCase())}
            placeholder="JOHN DOE"
            required
          />

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Expiry Month</label>
              <select
                value={paymentData.expiryMonth}
                onChange={(e) => handleInputChange('expiryMonth', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">MM</option>
                {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
                  <option key={month} value={month.toString().padStart(2, '0')}>
                    {month.toString().padStart(2, '0')}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Expiry Year</label>
              <select
                value={paymentData.expiryYear}
                onChange={(e) => handleInputChange('expiryYear', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">YYYY</option>
                {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() + i).map(year => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>

            <Input
              label="CVV"
              type="password"
              maxLength="4"
              value={paymentData.cvv}
              onChange={(e) => handleInputChange('cvv', e.target.value.replace(/\D/g, ''))}
              placeholder="123"
              leftIcon={<Lock className="h-4 w-4 text-gray-400" />}
              required
            />
          </div>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Payment Note (Optional)</label>
        <textarea
          value={paymentData.paymentNote}
          onChange={(e) => handleInputChange('paymentNote', e.target.value)}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Add any notes about this payment"
        />
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <CheckCircle className="mx-auto h-12 w-12 text-green-600 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900">Confirm Payment</h3>
        <p className="text-gray-600">Please review your payment details</p>
      </div>

      <div className="bg-gray-50 rounded-lg p-6 space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Bill Number:</span>
          <span className="font-medium text-gray-900">{bill.billNumber}</span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-gray-600">Patient:</span>
          <span className="font-medium text-gray-900">{bill.patientName}</span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-gray-600">Payment Amount:</span>
          <span className="text-xl font-bold text-green-600">${parseFloat(paymentData.amount).toFixed(2)}</span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-gray-600">Payment Method:</span>
          <span className="font-medium text-gray-900">
            {paymentData.paymentMethod === 'CREDIT_CARD' ? 'Credit/Debit Card' : 'Cash'}
          </span>
        </div>

        {paymentData.paymentMethod === 'CREDIT_CARD' && (
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Card:</span>
            <span className="font-medium text-gray-900">
              **** **** **** {paymentData.cardNumber.slice(-4)}
            </span>
          </div>
        )}

        {isPartialPayment && (
          <div className="border-t pt-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Remaining Balance:</span>
              <span className="font-medium text-red-600">
                ${(dueAmount - parseFloat(paymentData.amount)).toFixed(2)}
              </span>
            </div>
          </div>
        )}
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
          <div className="text-sm text-blue-800">
            <p className="font-medium mb-1">Payment Confirmation</p>
            <p>
              By clicking "Process Payment", you confirm that all the details are correct 
              and authorize the payment of ${parseFloat(paymentData.amount).toFixed(2)}.
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Payment - Bill #${bill.billNumber}`}
      size="lg"
      closeOnOverlayClick={false}
    >
      <div className="space-y-6">
        {/* Step indicator */}
        <div className="flex items-center justify-center space-x-4 mb-6">
          {[1, 2, 3].map((stepNumber) => (
            <div key={stepNumber} className="flex items-center">
              <div className={`
                w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                ${step >= stepNumber 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 text-gray-600'
                }
              `}>
                {stepNumber}
              </div>
              {stepNumber < 3 && (
                <div className={`w-12 h-0.5 ${
                  step > stepNumber ? 'bg-blue-600' : 'bg-gray-200'
                }`} />
              )}
            </div>
          ))}
        </div>

        {/* Step content */}
        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
        {step === 3 && renderStep3()}

        {/* Error message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            <div className="flex items-center space-x-2">
              <AlertCircle className="h-4 w-4" />
              <span>{error}</span>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-between pt-4">
          <div>
            {step > 1 && (
              <Button
                variant="outline"
                onClick={handleBack}
                disabled={loading}
              >
                Back
              </Button>
            )}
          </div>

          <div className="flex space-x-3">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </Button>

            {step < 3 ? (
              <Button
                variant="primary"
                onClick={handleNext}
                disabled={loading}
              >
                Next
              </Button>
            ) : (
              <Button
                variant="primary"
                onClick={handleSubmit}
                loading={loading}
                leftIcon={<CreditCard className="h-4 w-4" />}
              >
                Process Payment
              </Button>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default PaymentForm;
