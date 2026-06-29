export interface PaginationQueryDto {
    page?: string | number;
    limit?: string | number;
    search?: string;
}

export interface PaginationOptions {
    defaultPage?: number;
    defaultLimit?: number;
    maxLimit?: number;
}

export interface PaginationMeta {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export interface NormalizedPagination {
    page: number;
    limit: number;
    skip: number;
    search?: string;
}

export interface PaginatedResult<T> {
    data: T[];
    pagination: PaginationMeta;
}

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;
const DEFAULT_MAX_LIMIT = 100;

export class BasePaginationService {
    static normalize(
        query: PaginationQueryDto,
        options: PaginationOptions = {},
    ): NormalizedPagination {
        const defaultPage = options.defaultPage ?? DEFAULT_PAGE;
        const defaultLimit = options.defaultLimit ?? DEFAULT_LIMIT;
        const maxLimit = options.maxLimit ?? DEFAULT_MAX_LIMIT;

        const rawPage = Number(query.page);
        const rawLimit = Number(query.limit);

        const page = Number.isFinite(rawPage) && rawPage > 0
            ? Math.floor(rawPage)
            : defaultPage;
        const limit = Number.isFinite(rawLimit) && rawLimit > 0
            ? Math.min(Math.floor(rawLimit), maxLimit)
            : defaultLimit;
        const search = query.search?.trim() || undefined;

        return {
            page,
            limit,
            skip: (page - 1) * limit,
            search,
        };
    }

    static paginate<T>(
        data: T[],
        total: number,
        pagination: Pick<NormalizedPagination, "page" | "limit">,
    ): PaginatedResult<T> {
        return {
            data,
            pagination: {
                total,
                page: pagination.page,
                limit: pagination.limit,
                totalPages: Math.ceil(total / pagination.limit),
            },
        };
    }
}
