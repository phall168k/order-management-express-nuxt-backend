export interface CreateProductRequestDto {
    code: string;
    nameEn: string;
    nameKh: string;
    unitPrice: number;
    discount?: number;
    description?: string;
    thumbnail: string;
    category: string;
}
