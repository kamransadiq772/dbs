export class ListApplicationsDto {
  adminId: string;
  PersonalDetails: {
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
  };
  AddressDetails: {
    CurrentDetails: {
      country: string;
      postCode: string;
      addressLine1: string;
      addressLine2: string;
      county: string;
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
        county: string;
        residentFrom: string;
        residentUntil: string;
      },
    ];
  };
  AdditionalDetails: {
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
  };
  IdentityCheck: {
    passportNum: string;
    BirthOnPassport: string;
    passportNationality: string;
    passportIssueDate: string;
    licenceNumber: string;
    dateOfBirthOnLicence: string;
    licenceType: string;
    licenceValidFrom: string;
  };
   isNationalUK: {
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
  };
  PrimaryDocuments: {
    isPassportCardIsNationalOfIreland: boolean;
 isDocIssuedByHomeOffice: boolean;
    isBiometricImmigrationDocResiPermit: boolean;
    isEIRPOrBRCServiceIssuedByHO: boolean;
    isPassportHolderIdExemptImmigrationControl: boolean;
    isImmigrationStatusDocIssuedByHO: boolean;
    isPasswordEndorsedHolderIsStayInUk: boolean;
    isSometricImmigrationDocIssuedByHO: boolean;
    isCurrentDocIssuedByHOToEEA: boolean;
    isFrontierWorkerPermitIssuedUnder: boolean;
    isImmigrationStatusDocPhotographIssued: boolean;
    isDocIssuedByHOPermittedToTakeTheEmployment: boolean;
    isAnAppRegistrationCardIssedByHO: boolean;
    isAPossitiveVerficationNoticeIssued: boolean;
  };
  EmploymentDetails: {
    organizationName: string;
    applicationType: string;
    isApplicationWorkWithAdults: string;
    isApplicationWorkWithChildren: string;
    isThisWorkYourHomeAddress: string;
    applingPositionFor: string;
    isApplicationFreeOfCharge: string;
    isCheckedAddressDetailsWithOriginal: string;
    isCrossCheckedApplicentIdentity: string;
    isUserInfoIsTrue: string;
    isAvailableOptionForSubmit: string;
    isProvidedInfoDirectlyToEmployer: string;
    isReadPrivacyPolicy: string;
    comment:string;
    isIdentityIndividualBeenVerified: string;
    electronicSignatureImage: string;
  };
  ApplicationState: {
    isPaid: boolean;
    status: string;
    stage: string;
    comment: string;
  };
}
