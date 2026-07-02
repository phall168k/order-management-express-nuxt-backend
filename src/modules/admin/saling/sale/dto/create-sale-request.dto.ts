export type SaleStatus = "pending" | "packing" | "shipping" | "delivered" | "completed";

export interface CreateSaleItemRequestDto {
    product: string;
    quantity: number;
    unitPrice: number;
    discount: number;
    note?: string;
}

export interface CreateSaleRequestDto {
    code: string;
    customer: string;
    salingDate: string;
    status: SaleStatus;
    paymentMethod: string;
    address: string;
    note?: string;
    items: CreateSaleItemRequestDto[];
}
