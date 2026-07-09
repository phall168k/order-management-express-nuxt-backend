import type { ProductThumbnail } from "../product.model";

export interface CreateProductRequestDto {
    code: string;
    nameEn: string;
    nameKh: string;
    unitPrice: number;
    discount?: number;
    description?: string;
    thumbnail?: ProductThumbnail;
    category: string;
}
