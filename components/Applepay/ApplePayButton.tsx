'use client';

import { useEffect, useState } from 'react';

interface ApplePayButtonProps {
  amount: string;
  currencyCode?: string;
  countryCode?: string;
  merchantName?: string;
  onSuccess?: (paymentResponse: PaymentResponse) => void;
  onError?: (error: Error) => void;
}

export default function ApplePayButton({
  amount,
  currencyCode = 'USD',
  countryCode = 'US',
  merchantName = 'Your Store',
  onSuccess,
  onError,
}: ApplePayButtonProps) {
  const [isApplePayAvailable, setIsApplePayAvailable] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const checkApplePayAvailability = async () => {
      if (!window.PaymentRequest) {
        console.log('Payment Request API not available');
        return;
      }
      console.log("before try");
      try {
        const supportedInstruments: PaymentMethodData[] = [
          {
            supportedMethods: 'https://apple.com/apple-pay',
            data: {
              version: 3,
              merchantIdentifier: 'merchant.com.paypayer',
              merchantCapabilities: ['supports3DS'],
              supportedNetworks: ['visa', 'masterCard', 'amex', 'discover'],
              countryCode: countryCode,
            },
          },
        ];

        const details: PaymentDetailsInit = {
          total: {
            label: merchantName,
            amount: { currency: currencyCode, value: amount },
          },
        };
        console.log("before new PaymentRequest");

        const request = new PaymentRequest(supportedInstruments, details);
        console.log("after new PaymentRequest");
        const canMakePayment = await request.canMakePayment();
        console.log("after canMakePayment");
        setIsApplePayAvailable(!!canMakePayment);
        console.log("after setIsApplePayAvailable");
        console.log('Apple Pay available:', canMakePayment);
      } catch (error) {
        console.error('Error checking Apple Pay availability:', error);
        setIsApplePayAvailable(false);
      }
    };

    checkApplePayAvailability();
  }, [amount, currencyCode, countryCode, merchantName]);

  const handleApplePayClick = async () => {
    if (!window.PaymentRequest) {
      const error = new Error('Payment Request API not available');
      onError?.(error);
      return;
    }

    setIsProcessing(true);

    try {
      const supportedInstruments: PaymentMethodData[] = [
        {
          supportedMethods: 'https://apple.com/apple-pay',
          data: {
            version: 3,
            merchantIdentifier: 'merchant.com.paypayer',
            merchantCapabilities: ['supports3DS'],
            supportedNetworks: ['visa', 'masterCard', 'amex', 'discover'],
            countryCode: countryCode,
          },
        },
      ];

      const details: PaymentDetailsInit = {
        total: {
          label: merchantName,
          amount: { currency: currencyCode, value: amount },
        },
        displayItems: [
          {
            label: 'Product/Service',
            amount: { currency: currencyCode, value: amount },
          },
        ],
      };
    
      console.log("before new PaymentRequest");
      const request = new PaymentRequest(supportedInstruments, details);
      console.log("after new PaymentRequest");
      const paymentResponse = await request.show();
      console.log("after request.show");

      console.log('Payment response:', paymentResponse);

      await new Promise((resolve) => setTimeout(resolve, 1000));

      await paymentResponse.complete('success');

      onSuccess?.(paymentResponse);
    } catch (error) {
      console.error('Payment error:', error);
      onError?.(error as Error);
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isApplePayAvailable) {
    return null;
  }

  return (
    <div className="w-full max-w-md">
      <button
        onClick={handleApplePayClick}
        disabled={isProcessing}
        className="w-full bg-black hover:bg-gray-800 disabled:bg-gray-400 text-white font-semibold py-4 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
        style={{
          WebkitAppearance: 'none',
        }}
      >
        {isProcessing ? (
          <span>Processing...</span>
        ) : (
          <>
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M4.5 9.5c0-1.5 1-2.5 2.5-2.5 1 0 1.5.5 2 1 .5.5 1 1 2 1s1.5-.5 2-1c.5-.5 1-1 2-1 1.5 0 2.5 1 2.5 2.5 0 2-1.5 3.5-3.5 5.5-1 1-1.5 1.5-2 1.5s-1-.5-2-1.5c-2-2-3.5-3.5-3.5-5.5z" />
            </svg>
            <span>Apple Pay Payment</span>
          </>
        )}
      </button>

      <p className="text-xs text-gray-500 mt-2 text-center">
        Apple Pay available on this device
      </p>
    </div>
  );
}

