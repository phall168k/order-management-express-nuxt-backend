export interface CreateStockInItemRequestDto {
    stockInDate: string;
    product: string;
    quantity: number;
    note?: string;
}

export type CreateStockInRequestDto = CreateStockInItemRequestDto[] | {
    items: CreateStockInItemRequestDto[];
};
