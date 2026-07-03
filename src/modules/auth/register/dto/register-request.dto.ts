import { UserProfileGender } from "../../../admin/system/user-profile/user-profile.model";

export interface RegisterRequestDto {
    username: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    gender?: UserProfileGender;
    dob?: string | Date;
    phoneNumber?: string;
    address?: string;
    profile?: string;
}
