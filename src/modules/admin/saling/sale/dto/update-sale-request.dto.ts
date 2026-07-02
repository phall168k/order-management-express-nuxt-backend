import {
    CreateSaleItemRequestDto,
    SaleStatus,
} from "./create-sale-request.dto";

export interface UpdateSaleRequestDto {
    code?: string;
    customer?: string;
    salingDate?: string;
    status?: SaleStatus;
    paymentMethod?: string;
    address?: string;
    note?: string;
    items?: CreateSaleItemRequestDto[];
}
