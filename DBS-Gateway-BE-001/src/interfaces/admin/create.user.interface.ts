import { Document } from 'mongoose';
export interface IAllUser {
  userType: string;
  forename: string;
  surname: string;
  username: string;
  dateOfBirth: string;
  phone: string;
  mobile: string;
  email: string;
  postCode: string;
  Active: boolean;
  userAddressLine1: string;
  userAddressLine2: string;
  userTownOrCity: string;
}

export interface IUser {
  IAllUser: IAllUser;
  isUnderstoodDBSCodeOfPractice: boolean;
  isUnderstoodDBSIdChecking: boolean;
  isUnderstoodDBSIdcheckScenarios: boolean;
  isPersonHasFamiliarWithInfoOnDBS: boolean;
  electronicSignature: string;
}

export interface IBasic {
  DisclosureType: string;
  IAllUser: IAllUser;
  PositionApplyingFor: string;
  isfreeCOVID19DBScheck: boolean;
  ThisCompAdminWillCreateAppUser: boolean;
  IsfreeVolAsPerTheDefInPolice1997: boolean;
  IsISAAdultFirst: boolean;
}
