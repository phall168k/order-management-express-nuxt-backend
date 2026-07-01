export type PaymentMethodCurrency = "usd" | "khr";

export interface CreatePaymentMethodRequestDto {
    logo?: string;
    bankAccount?: string;
    merchantName?: string;
    merchantCity?: string;
    amount?: number;
    currency: PaymentMethodCurrency;
    storeLabel?: string;
    phoneNumber?: string;
    billNumber?: string;
    terminalLabel?: string;
    isActive?: boolean;
}
