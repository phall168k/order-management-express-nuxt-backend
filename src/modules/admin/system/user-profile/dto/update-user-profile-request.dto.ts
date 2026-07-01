import {
    UserProfileGender,
    UserProfileUserType,
} from "./create-user-profile-request.dto";

export interface UpdateUserProfileRequestDto {
    code?: string;
    userType?: UserProfileUserType;
    firstName?: string;
    lastName?: string;
    gender?: UserProfileGender;
    dob?: string | Date;
    phoneNumber?: string;
    address?: string;
    note?: string;
    profile?: string;
    createdByUser?: string;
}
