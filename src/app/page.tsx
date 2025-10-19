'use client';

import { useState } from 'react';
import ApplePayButton from '@/components/ApplePayButton';

export default function Home() {
  const [paymentStatus, setPaymentStatus] = useState<string>('');

  const handlePaymentSuccess = (response: PaymentResponse) => {
    console.log('Payment successful:', response);
    setPaymentStatus('✅ Payment completed successfully!');
  };

  const handlePaymentError = (error: Error) => {
    console.error('Payment error:', error);
    setPaymentStatus(`❌ Error: ${error.message}`);
  };

  return (
    <div className="font-sans min-h-screen flex items-center justify-center p-8 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <main className="max-w-2xl w-full">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 md:p-12">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">
              Apple Pay Demo
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mb-2">
              Test Apple Pay payment
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              This button will only appear if your device supports Apple Pay
            </p>
          </div>

          <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6 mb-8">
            <div className="flex justify-between items-center mb-4">
              <span className="text-gray-700 dark:text-gray-300">Sample product</span>
              <span className="font-semibold text-gray-900 dark:text-white">$29.99</span>
            </div>
            <div className="flex justify-between items-center text-sm text-gray-600 dark:text-gray-400 mb-2">
              <span>Subtotal</span>
              <span>$29.99</span>
            </div>
            <div className="flex justify-between items-center text-sm text-gray-600 dark:text-gray-400 mb-4 pb-4 border-b border-gray-300 dark:border-gray-600">
              <span>Tax</span>
              <span>$0.00</span>
            </div>
            <div className="flex justify-between items-center font-bold text-lg text-gray-900 dark:text-white">
              <span>Total</span>
              <span>$29.99</span>
            </div>
          </div>

          <div className="flex justify-center mb-6">
            <ApplePayButton
              amount="29.99"
              currencyCode="USD"
              countryCode="US"
              merchantName="PayPayer"
              onSuccess={handlePaymentSuccess}
              onError={handlePaymentError}
            />
          </div>

          {paymentStatus && (
            <div
              className={`text-center p-4 rounded-lg ${
                paymentStatus.includes('✅')
                  ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                  : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
              }`}
            >
              {paymentStatus}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
