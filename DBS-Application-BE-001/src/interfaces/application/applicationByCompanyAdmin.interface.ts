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
export interface IReviewInfo {
  isFillBehalfOfRespresentative: boolean;
  isUserInfoIsTrue: boolean;
  isAvailableOptionForSubmit: boolean;
  isProvidedInfoDirectlyToEmployer: boolean;
  isReadPrivacyPolicy: boolean;
}
export interface ICheckDBS {
  isnationalRepublicOfIreland: boolean;
  isHolderPermittedToStayInUK: boolean;
  isBioMetricImmigrationDocIssued: boolean;
  isEIRPIssuedByHO: boolean;
  isHolderExemptFromImmigration: boolean;
  isImmigrationDocStatusIssued: boolean;
  isHolderAllowedToStayInUk: boolean;
  isSometricImmigrationDocIssued: boolean;
  isDocIssuedByHOByfamily: boolean;
  isFrontierWorkerPermitIssued: boolean;
  isPhotographIssuedByHO: boolean;
  isHolderHasMadeAnAppForLeave: boolean;
  isAppRegistrationCardIssuedByHO: boolean;
  isVerificationNoticeIssuedByHO: boolean;
}
export interface IGroupOneDocuments {
  isPassportValid: boolean;
  isBiometricResidencePermit: boolean;
  isCurrentDrivingLicense: boolean;
  idBirthCertificateIssued: boolean;
  idAdoptionCertificate: boolean;
}
export interface IGroup2ADocuments {
  isCurrentDrivingLicense: boolean;
  isBiometricCurrentDrivingLicense: boolean;
  isBirthCertificateIssued: boolean;
  isPertnershipCertificate: boolean;
  isImmigrationDocuments: boolean;
}
export interface IGroup2BDocuments {
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
export interface IEmploymentDetails {
  applicationType: string;
  isApplicationWorkWithAdults: boolean;
  isApplicationWorkWithChildren: boolean;
  isThisWorkYourHomeAddress: boolean;
  applingPositionFor: string;
  isApplicationFreeOfCharge: boolean;
  isCheckedAddressDetailsWithOriginal: boolean;
  electronicSignatureImage: string;
}

export interface IApplicationState {
  isPaid: boolean;
  status: string;
  stage: string;
  comment: string;
}


