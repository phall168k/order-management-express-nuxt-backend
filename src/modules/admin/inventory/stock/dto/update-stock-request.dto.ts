export interface UpdateStockRequestDto {
    product?: string;
    minStock?: number;
    stockIn?: number;
    stockOut?: number;
    stockAdjustment?: number;
    isStock?: boolean;
    note?: string;
}
