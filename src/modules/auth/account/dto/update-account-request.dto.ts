import type {
    UserProfileGender,
    UserProfileMinioObject,
} from "../../../admin/system/user-profile/user-profile.model";

export interface UpdateAccountUserRequestDto {
    username?: string;
    email?: string;
}

export interface UpdateAccountUserProfileRequestDto {
    firstName?: string;
    lastName?: string;
    gender?: UserProfileGender;
    dob?: string | Date;
    phoneNumber?: string;
    address?: string;
    note?: string;
    profile?: UserProfileMinioObject;
}

export interface UpdateAccountRequestDto {
    user?: UpdateAccountUserRequestDto;
    userProfile?: UpdateAccountUserProfileRequestDto;
}
