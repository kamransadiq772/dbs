import { ApiProperty } from '@nestjs/swagger';
import {
  IAdditionalDetails,
  IAddressDetails,
  IApplicationState,
  IIdentityCheck,
  IPersonalDetails,
  IPrimaryDocuments,
  IisNationalUK,
  IReviewInfo,
  // ICheckDBS,
  IGroupOneDocuments,
  IGroup2ADocuments,
  IGroup2BDocuments,
} from 'src/interfaces/application/applicationByCompanyAdmin.interface';
import { IEmploymentDetails } from 'src/interfaces/application/applicationByIndividual.interface';
import { ApiResponseDto } from '../common/ApiResponse.dto';

export class UpdateApplicationRequestDto {
  @ApiProperty({
    example: {
      title: 'MISS/MR',
      firstName: 'Muhammad Ali',
      IstMidName: 'IstMidName',
      secMidName: 'secMidName',
      thirdMidName: 'thirdMidName',
      presentSurname: 'PresentSurname',
      surNameAtBirth: 'surNameAtBirth',
      usedUntil: 'usedUntil',
      forenamesIs: 'no',
      otherSurnameIs: 'no',
      driverLicenceIs: 'no',
      validPassportIs: 'no',
      gender: 'male',
      dateOfBirth: '22/10/2002',
      isAgreedPrivacyPolicy: true,
      isAgreedProtectionPolicy: true,
      isAgreedTermsConditions: true,
    },
  })
  PersonalDetails: IPersonalDetails;

  @ApiProperty({
    example: {
      CurrentDetails: {
        country: 'Pakistan',
        postCode: "DSB999",
        addressLine1: 'address line 1 exmaple',
        addressLine2: 'ddress line 2 exmaple',
        cityOrTown: 'London',
        county: 'MRS',
        residentFrom: 'June 2022',
      },
      PreviousAddress: [
        {
          unusualAddress: 'Traveling in UK',
          country: 'Pakistan',
          postCode: "DSB999",
          addressLine1: 'address line 1 exmaple',
          addressLine2: 'ddress line 2 exmaple',
          cityOrTown: 'London',
          county: 'MRS',
          residentFrom: 'June 2022',
          residentUntil: 'December 2021',
        },
      ],
    },
  })
  AddressDetails: IAddressDetails;

  @ApiProperty({
    example: {
      birthCountry: 'UK',
      birthCounty: 'principal subdivision of the country for politics',
      birthTown: 'london',
      birthNationality: 'Scotland',
      ukInsuranceNum: 'DES343',
      telephoneNum: '+923015586305',
      mobileNumber: '+923015586305',
      isUkNational: 'no',
      isPaidOrVoluntaryWork: 'false',
      isGuideNeeded: 'no',
    },
  })
  AdditionalDetails: IAdditionalDetails;

  @ApiProperty({
    example: {
      passportNum: 'DR3335',
      birthOnPassport: '12/09/1998',
      passportNationality: 'United Kingdom',
      passportIssueDate: '22/10/2002',
      licenceNumber: 'SW224',
      dateOfBirthOnLicence: '12/09/1998',
      licenceType: 'C1',
      licenceValidFrom: '12/09/2018',
      licenceIssueCountry: 'United Kingdom',
    },
  })
  IdentityCheck: IIdentityCheck;

   @ApiProperty({
    example: {
      isPassportValid: false,
      isBiometricResidencePermit: false,
      isCurrentDrivingLicense1: false,
      idBirthCertificateIssued: false,
      idAdoptionCertificate: false,
      isCurrentDrivingLicense: true,
      isBiometricCurrentDrivingLicense: true,
      isBirthCertificateIssued: true,
      isPertnershipCertificate: true,
      isImmigrationDocuments: true,
      IsMortgageStatment: false,
      isIssuedBankBuildingSocity: false,
      isIssuedBankBuildingSocityForOutSideUK: false,
      isIssuedBankAccountOpeningConfirmation: false,
      isCreditCardStatment: false,
      isP45OrP60Statement: false,
      isCouncitTaxStatement: false,
      isLetterOfSponsorship: false,
      isUtiliyBill: false,
      isBenifitStatementForChild: false,
      isLocalDocGiven: false,
      isEEANationalIDCard: false,
      isCardCarringPassLogo: false,
      letterFromHeadTeacher: false,
      immigrationDocumentOrWorkPermit: false,
      merriageCivilPertnershipCertificate: false,
      immigrationDocOrWorkPermitFor16YrOlds: false,
    },
  })
  isNationalUK: IisNationalUK;

  @ApiProperty({
    example: {
        IsPassportCardIsNationalOfIreland: false,
        IsDocIssuedByHomeOffice: false,
        IsBiometricImmigrationDocResiPermit: false,
        IsEIRPOrBRCServiceIssuedByHO: false,
        IsPassportHolderIdExemptImmigrationControl: false,
        IsImmigrationStatusDocIssuedByHO: false,
        IsPasswordEndorsedHolderIsStayInUk: false,
        IsSometricImmigrationDocIssuedByHO: false,
        IsCurrentDocIssuedByHOToEEA: false,
        IsFrontierWorkerPermitIssuedUnder: false,
        IsImmigrationStatusDocPhotographIssued: false,
        IsDocIssuedByHOPermittedToTakeTheEmployment: false,
        IsAnAppRegistrationCardIssedByHO: false,
        IsAPossitiveVerficationNoticeIssued: false,
    },
  })
  PrimaryDocuments: IPrimaryDocuments;
    @ApiProperty({
    example: {
      isFillBehalfOfRespresentative: 'no',
      isUserInfoIsTrue: 'yes',
      isAvailableOptionForSubmit: 'no',
      isProvidedInfoDirectlyToEmployer: 'no',
      isReadPrivacyPolicy: 'yes',
    },
  })
  ReviewInfo: IReviewInfo;
    @ApiProperty({
    example: {
      organizationName: "Orcalo",
      applicationType: "Enhanced",
      isApplicationWorkWithAdults: 'no',
      isApplicationWorkWithChildren: 'no',
      isThisWorkYourHomeAddress: 'no',
      applingPositionFor: 'Carer',
      isApplicationFreeOfCharge: 'no',
      isCheckedAddressDetailsWithOriginal: 'no',
      isCrossCheckedApplicentIdentity: 'yes',
      comment:"All are Good",
      isIdentityIndividualBeenVerified: 'yes',
      electronicSignatureImage:
        'bGFkaWVzIGFuZCBnZW50bGVtZW4gd2UgYXJlIGZsb2F0aW5nIGluIHNwYWNl',
    },
  })
  EmploymentDetails: IEmploymentDetails;

  ApplicationState: IApplicationState;
}

export class UpdatedApplicationResponseDto extends ApiResponseDto {
  @ApiProperty({
    example: {
      PersonalDetails: {
        title: 'MISS/MR',
        firstName: 'Muhammad Ali',
        IstMidName: 'IstMidName',
        secMidName: 'secMidName',
        thirdMidName: 'thirdMidName',
        presentSurname: 'PresentSurname',
        surNameAtBirth: 'surNameAtBirth',
        usedUntil: 'usedUntil',
        forenamesIs: 'no',
        otherSurnameIs: 'no',
        driverLicenceIs: 'no',
        validPassportIs: 'no',
        gender: 'male',
        dateOfBirth: '22/10/2002',
        isAgreedPrivacyPolicy: true,
        isAgreedProtectionPolicy: true,
        isAgreedTermsConditions: true,
      },
      AddressDetails: {
        CurrentDetails: {
          country: 'Pakistan',
          postCode: "D788sgdfs",
          addressLine1: 'address line 1 exmaple',
          addressLine2: 'ddress line 2 exmaple',
          cityOrTown: 'London',
          county: 'MRS',
          residentFrom: 'June 2022',
        },
        PreviousAddress: [
          {
            unusualAddress: 'Travelling in the UK',
            country: 'Pakistan',
            postCode: "SDfdkhfu74",
            addressLine1: 'address line 1 exmaple',
            addressLine2: 'ddress line 2 exmaple',
            cityOrTown: 'London',
            county: 'MRS',
            residentFrom: 'June 2022',
            residentUntil: 'December 2021',
          },
        ],
      },
      AdditionalDetails: {
        birthCountry: 'UK',
        birthCounty: 'principal subdivision of the country for politics',
        birthTown: 'london',
        birthNationality: 'Scotland',
        ukInsuranceNum: 'DES343',
        telephoneNum: '+923015586305',
        mobileNumber: '+923015586305',
        isUkNational: 'no',
        isPaidOrVoluntaryWork: 'yes',
        isGuideNeeded: 'no',
      },
      IdentityCheck: {
        passportNum: 'DR3335',
        birthOnPassport: '12/09/1998',
        passportNationality: 'United Kingdom',
        passportIssueDate: '22/10/2002',
        licenceNumber: 'SW224',
        dateOfBirthOnLicence: '12/09/1998',
        licenceType: 'C1',
        licenceValidFrom: '12/09/2018',
        licenceIssueCountry: 'United Kingdom',
      },
    isNationalUK: {
        isPassportValid: false,
        isBiometricResidencePermit: false,
        isCurrentDrivingLicense1: false,
        idBirthCertificateIssued: false,
        idAdoptionCertificate: false,
        isCurrentDrivingLicense: false,
        isBiometricCurrentDrivingLicense: false,
        isBirthCertificateIssued: false,
        isPertnershipCertificate: false,
        isImmigrationDocuments: false,
        IsMortgageStatment: false,
        isIssuedBankBuildingSocity: false,
        isIssuedBankBuildingSocityForOutSideUK: false,
        isIssuedBankAccountOpeningConfirmation: false,
        isCreditCardStatment: false,
        isP45OrP60Statement: false,
        isCouncitTaxStatement: false,
        isLetterOfSponsorship: false,
        isUtiliyBill: false,
        isBenifitStatementForChild: false,
        isLocalDocGiven: false,
        isEEANationalIDCard: false,
        isCardCarringPassLogo: false,
        letterFromHeadTeacher: false,
        immigrationDocumentOrWorkPermit: false,
        merriageCivilPertnershipCertificate: false,
        immigrationDocOrWorkPermitFor16YrOlds: false,
      },
       PrimaryDocuments: {
        IsPassportCardIsNationalOfIreland: false,
        IsDocIssuedByHomeOffice: false,
        IsBiometricImmigrationDocResiPermit: false,
        IsEIRPOrBRCServiceIssuedByHO: false,
        IsPassportHolderIdExemptImmigrationControl: false,
        IsImmigrationStatusDocIssuedByHO: false,
        IsPasswordEndorsedHolderIsStayInUk: false,
        IsSometricImmigrationDocIssuedByHO: false,
        IsCurrentDocIssuedByHOToEEA: false,
        IsFrontierWorkerPermitIssuedUnder: false,
        IsImmigrationStatusDocPhotographIssued: false,
        IsDocIssuedByHOPermittedToTakeTheEmployment: false,
        IsAnAppRegistrationCardIssedByHO: false,
        IsAPossitiveVerficationNoticeIssued: false,
      },
      ReviewInfo: {
        isFillBehalfOfRespresentative: 'no',
        isUserInfoIsTrue: 'yes',
        isAvailableOptionForSubmit: 'no',
        isProvidedInfoDirectlyToEmployer: 'no',
        isReadPrivacyPolicy: 'yes',
      },
       EmploymentDetails: {
        OrganizationName: "Orcalo",
        applicationType: "Enhanced",
        isApplicationWorkWithAdults: 'no',
        isApplicationWorkWithChildren: 'no',
        isThisWorkYourHomeAddress: 'no',
        applingPositionFor: 'Carer',
        isApplicationFreeOfCharge: 'no',
        isCheckedAddressDetailsWithOriginal: 'no',
        IsCrossCheckedApplicentIdentity: 'yes',
        comment:"All are Good",
        IsIdentityIndividualBeenVerified: 'yes',
        electronicSignatureImage:
          'bGFkaWVzIGFuZCBnZW50bGVtZW4gd2UgYXJlIGZsb2F0aW5nIGluIHNwYWNl',
      },
      GroupOneDocuments: {
        isPassportValid: false,
        isBiometricResidencePermit: false,
        isCurrentDrivingLicense: false,
        idBirthCertificateIssued: false,
        idAdoptionCertificate: false,
      },
      Group2ADocuments: {
        isCurrentDrivingLicense: false,
        isBiometricCurrentDrivingLicense: false,
        isBirthCertificateIssued: false,
        isPertnershipCertificate: false,
        isImmigrationDocuments: false,
      },
      Group2BDocuments: {
        IsMortgageStatment: false,
        isIssuedBankBuildingSocity: false,
        isIssuedBankBuildingSocityForOutSideUK: false,
        isIssuedBankAccountOpeningConfirmation: false,
        isCreditCardStatment: false,
        isP45OrP60Statement: false,
        isCouncitTaxStatement: false,
        isLetterOfSponsorship: false,
        isUtiliyBill: false,
        isBenifitStatementForChild: false,
        isLocalDocGiven: false,
        isEEANationalIDCard: false,
        isCardCarringPassLogo: false,
        letterFromHeadTeacher: false,
        immigrationDocumentOrWorkPermit: false,
        merriageCivilPertnershipCertificate: false,
        immigrationDocOrWorkPermitFor16YrOlds: false,
      },
      ApplicationState: {
        isPaid: false,
        status: 'Pending',
        stage: 'Rejected by Evidence Checker',
      },
    },
  })
  data: {
    id: string;
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
        cityOrTown: string;
        county: string;
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
    PrimaryDocuments:{
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
    ReviewInfo: {
      isFillBehalfOfRespresentative: string;
      isUserInfoIsTrue: string;
      isAvailableOptionForSubmit: string;
      isProvidedInfoDirectlyToEmployer: string;
      isReadPrivacyPolicy: string;
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
      comment:string;
      isIdentityIndividualBeenVerified: string;
      electronicSignatureImage: string;
    };
    GroupOneDocuments: {
      isPassportValid: boolean;
      isBiometricResidencePermit: boolean;
      isCurrentDrivingLicense: boolean;
      idBirthCertificateIssued: boolean;
      idAdoptionCertificate: boolean;
    };
    Group2ADocuments: {
      isCurrentDrivingLicense: boolean;
      isBiometricCurrentDrivingLicense: boolean;
      isBirthCertificateIssued: boolean;
      isPertnershipCertificate: boolean;
      isImmigrationDocuments: boolean;
    };
    Group2BDocuments: {
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
    ApplicationState: {
      isPaid: boolean;
      status: string;
      stage: string;
    };
  };
  @ApiProperty({ example: null, nullable: true })
  errors: { [key: string]: any };
}

//for reject application res and req

export class RejectApplicationRequestDto {
  @ApiProperty({
    example: {
      comment: 'Rejected by Evidence Checker please check personalDetails',
    },
  })
  ApplicationState: IApplicationState;
}

export class RejectedApplicationResponseDto extends ApiResponseDto {
  @ApiProperty({
    example: {
      ApplicationState: {
        comment: 'Rejected by Evidence Checker please check personalDetails',
      },
    },
  })
  data: {
    applicationId: string;
    ApplicationState: {
      comment: string;
    };
  };

  @ApiProperty({ example: null, nullable: true })
  errors: { [key: string]: any };
}
