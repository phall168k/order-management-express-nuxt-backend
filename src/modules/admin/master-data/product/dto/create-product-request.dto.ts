export interface CreateProductRequestDto {
    code: string;
    nameEn: string;
    nameKh: string;
    unitPrice: number;
    description?: string;
    thumbnail: string;
    category: string;
}
