export interface ICompanyDetails {
  companyName?: string;
  shortName: string;
  companyNumber: number;
  organizationType: string;
  postCode?: string;
  addressLine1?: string;
  addressLine2?: string;
  townOrCity?: string;
  country: string;
  email?: string;
  phone: string;
  mobile: string;
  serviceRequired?: string;
  profilePic: string;
}

export interface IYourDetails {
  foreName: string;
  surName: string;
  gender: string;
  postCode: string;
  adminUser?: boolean;
}

export interface ICompanyAdminUser {
  foreName: string;
  surName: string;
  email: string;
  mobile?: number;
}

export interface ICompanyPreferences {
  privacyPolicy?: boolean;
  dataPolicy?: boolean;
  termsPolicy?: boolean;
}
