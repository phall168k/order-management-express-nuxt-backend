export interface CreateUserRequestDto {
    username: string;
    email: string;
    password: string;
    roles?: string[];
    isSuperUser?: boolean;
    isActive?: boolean;
}
