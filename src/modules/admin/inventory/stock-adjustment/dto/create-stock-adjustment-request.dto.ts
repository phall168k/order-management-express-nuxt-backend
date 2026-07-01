export interface CreateStockAdjustmentItemRequestDto {
    stockAdjustmentDate: string;
    product: string;
    quantity: number;
    note?: string;
}

export type CreateStockAdjustmentRequestDto = CreateStockAdjustmentItemRequestDto[] | {
    items: CreateStockAdjustmentItemRequestDto[];
};
