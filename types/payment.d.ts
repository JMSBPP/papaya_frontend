interface PaymentMethodData {
  supportedMethods: string;
  data?: {
    version?: number;
    merchantIdentifier?: string;
    merchantCapabilities?: string[];
    supportedNetworks?: string[];
    countryCode?: string;
  };
}

interface PaymentCurrencyAmount {
  currency: string;
  value: string;
}

interface PaymentItem {
  label: string;
  amount: PaymentCurrencyAmount;
}

interface PaymentDetailsInit {
  total: PaymentItem;
  displayItems?: PaymentItem[];
}

interface PaymentRequest {
  new (
    methodData: PaymentMethodData[],
    details: PaymentDetailsInit
  ): PaymentRequest;
  canMakePayment(): Promise<boolean | null>;
  show(): Promise<PaymentResponse>;
}

interface PaymentResponse {
  requestId: string;
  methodName: string;
  details: any;
  complete(result?: 'success' | 'fail' | 'unknown'): Promise<void>;
}

interface Window {
  PaymentRequest?: {
    new (
      methodData: PaymentMethodData[],
      details: PaymentDetailsInit
    ): PaymentRequest;
  };
}

