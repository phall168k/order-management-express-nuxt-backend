export interface CreateBannerRequestDto {
    product: string;
    title: string;
    description?: string;
    thumbnail: string;
    isActive?: boolean;
}
