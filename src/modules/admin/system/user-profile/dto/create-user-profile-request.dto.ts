export type UserProfileUserType = "customer" | "staff";
export type UserProfileGender = "male" | "female" | "other";

export interface CreateUserProfileRequestDto {
    code: string;
    userType: UserProfileUserType;
    firstName: string;
    lastName: string;
    gender?: UserProfileGender;
    dob?: string | Date;
    phoneNumber?: string;
    address?: string;
    note?: string;
    profile?: string;
    createdByUser?: string;
}
