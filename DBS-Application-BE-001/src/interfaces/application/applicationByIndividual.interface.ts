export interface IPersonalDetails {
  title: string;
  firstName: string;
  IstMidName: string;
  secMidName: string;
  thirdMidName: string;
  presentSurname: string;
  surNameAtBirth: string;
  usedUntil: string;
  forenamesIs: string;
  otherSurnameIs: string;
  driverLicenceIs: string;
  validPassportIs: string;
  gender: string;
  dateOfBirth: string;
  isAgreedPrivacyPolicy: boolean;
  isAgreedProtectionPolicy: boolean;
  isAgreedTermsConditions: boolean;
}

export interface IAddressDetails {
  CurrentDetails: {
    country: string;
    postCode: string;
    addressLine1: string;
    addressLine2: string;
    cityOrTown: string;
    residentFrom: string;
  };
  PreviousAddress: [
    {
      unusualAddress: string;
      country: string;
      postCode: string;
      addressLine1: string;
      addressLine2: string;
      cityOrTown: string;
      residentFrom: string;
      residentUntil: string;
    },
  ];
}
export interface IAdditionalDetails {
  birthCountry: string;
  birthCounty: string;
  birthTown: string;
  birthNationality: string;
  ukInsuranceNum: string;
  telephoneNum: string;
  mobileNumber: string;
  isUkNational: string;
  isPaidOrVoluntaryWork: string;
  isGuideNeeded: string;
}
export interface IIdentityCheck {
  passportNum: string;
  birthOnPassport: string;
  passportNationality: string;
  passportIssueDate: string;
  licenceNumber: string;
  dateOfBirthOnLicence: string;
  licenceType: string;
  licenceValidFrom: string;
  licenceIssueCountry: string;
}
export interface IisNationalUK {
  isPassportValid: boolean;
  isBiometricResidencePermit: boolean;
  isCurrentDrivingLicense1: boolean;
  idBirthCertificateIssued: boolean;
  idAdoptionCertificate: boolean;
  isCurrentDrivingLicense: boolean;
  isBiometricCurrentDrivingLicense: boolean;
  isBirthCertificateIssued: boolean;
  isPertnershipCertificate: boolean;
  isImmigrationDocuments: boolean;
  IsMortgageStatment: boolean;
  isIssuedBankBuildingSocity: boolean;
  isIssuedBankBuildingSocityForOutSideUK: boolean;
  isIssuedBankAccountOpeningConfirmation: boolean;
  isCreditCardStatment: boolean;
  isP45OrP60Statement: boolean;
  isCouncitTaxStatement: boolean;
  isLetterOfSponsorship: boolean;
  isUtiliyBill: boolean;
  isBenifitStatementForChild: boolean;
  isLocalDocGiven: boolean;
  isEEANationalIDCard: boolean;
  isCardCarringPassLogo: boolean;
  letterFromHeadTeacher: boolean;
  immigrationDocumentOrWorkPermit: boolean;
  merriageCivilPertnershipCertificate: boolean;
  immigrationDocOrWorkPermitFor16YrOlds: boolean;
}
export interface IPrimaryDocuments {
  isPassportCardIsNationalOfIreland: boolean;
  IsDocIssuedByHomeOffice: boolean;
  isBiometricImmigrationDocResiPermit: boolean;
  isEIRPOrBRCServiceIssuedByHO: boolean;
  isPassportHolderIdExemptImmigrationControl: boolean;
  isImmigrationStatusDocIssuedByHO: boolean;
  isPasswordEndorsedHolderIsStayInUk: boolean;
  isSometricImmigrationDocIssuedByHO: boolean;
  isCurrentDocIssuedByHOToEEA: boolean;
  isFrontierWorkerPermitIssuedUnder: boolean;
  isImmigrationStatusDocPhotographIssued: boolean;
  IsDocIssuedByHOPermittedToTakeTheEmployment: boolean;
  isAnAppRegistrationCardIssedByHO: boolean;
  IsAPossitiveVerficationNoticeIssued: boolean;
}
export interface IReviewInfo {
  isFillBehalfOfRespresentative: boolean;
  isUserInfoIsTrue: boolean;
  isAvailableOptionForSubmit: boolean;
  isProvidedInfoDirectlyToEmployer: boolean;
  isReadPrivacyPolicy: boolean;
}
export interface IEmploymentDetails {
  organizationName: string;
  applicationType: string;
  isApplicationWorkWithAdults: string;
  isApplicationWorkWithChildren: string;
  isThisWorkYourHomeAddress: string;
  applingPositionFor: string;
  isApplicationFreeOfCharge: string;
  isCheckedAddressDetailsWithOriginal: string;
  isCrossCheckedApplicentIdentity: string;
  comment:string;
  isIdentityIndividualBeenVerified: string;
  electronicSignatureImage: string;
}
export interface IApplicationState {
  isPaid: boolean;
  status: string;
  stage: string;
  comment: string;
}
