export interface UpdateUserRequestDto {
    username?: string;
    email?: string;
    password?: string;
    roles?: string[];
    userProfile?: string;
    isSuperUser?: boolean;
    isActive?: boolean;
}
