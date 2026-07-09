import {
    UserProfileGender,
    UserProfileUserType,
} from "./create-user-profile-request.dto";
import type { UserProfileMinioObject } from "../user-profile.model";

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
    profile?: UserProfileMinioObject;
    createdByUser?: string;
}
