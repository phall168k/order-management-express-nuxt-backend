import { PaymentMethodCurrency } from "./create-payment-method-request.dto";

export interface UpdatePaymentMethodRequestDto {
    logo?: string;
    bankAccount?: string;
    merchantName?: string;
    merchantCity?: string;
    amount?: number;
    currency?: PaymentMethodCurrency;
    storeLabel?: string;
    phoneNumber?: string;
    billNumber?: string;
    terminalLabel?: string;
    isActive?: boolean;
}
