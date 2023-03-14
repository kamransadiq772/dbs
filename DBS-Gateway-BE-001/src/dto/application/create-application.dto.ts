import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IAdditionalDetails,
  IAddressDetails,
  IIdentityCheck,
  IPersonalDetails,
  IApplicationState,
  IPrimaryDocuments,
  IReviewInfo,
} from 'src/interfaces/application/applicationByCompanyAdmin.interface';
import {
  IEmploymentDetails,
  IisNationalUK,
} from 'src/interfaces/application/applicationByIndividual.interface';
import { ApiResponseDto } from '../common/ApiResponse.dto';
/**
 * Create Application by Company Admin ......start
 */
export class CreateApplicationRequestDto {
  @ApiProperty({
    example: '6030635f-326e-4030-92c6-06d7ab3eff8d',
  })
  ApplicantId: string;

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
        postCode: 'S3bf545',
        addressLine1: 'address line 1 exmaple',
        addressLine2: 'ddress line 2 exmaple',
        cityOrTown: 'London',
        county: 'MRS',
        residentFrom: 'June 2022',
      },
      PreviousAddress: [
        {
          unusualAddress: 'Travellin in the UK',
          country: 'Pakistan',
          postCode: 'S3bf545',
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
      isPaidOrVoluntaryWork: 'yes',
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
      organizationName: 'Orcalo',
      applicationType: 'Enhanced',
      isApplicationWorkWithAdults: 'no',
      isApplicationWorkWithChildren: 'no',
      isThisWorkYourHomeAddress: 'no',
      applingPositionFor: 'Carer',
      isApplicationFreeOfCharge: 'no',
      isCheckedAddressDetailsWithOriginal: 'no',
      isCrossCheckedApplicentIdentity: 'yes',
      comment: 'All are Good',
      isIdentityIndividualBeenVerified: 'yes',
      electronicSignatureImage:
        'bGFkaWVzIGFuZCBnZW50bGVtZW4gd2UgYXJlIGZsb2F0aW5nIGluIHNwYWNl',
    },
  })
  EmploymentDetails: IEmploymentDetails;
  // @ApiProperty({
  //   example: {
  //     isPaid: false,
  //     status: 'Pending',
  //     stage: 'Rejected by Evidence Checker',
  //   },
  // })
  // ApplicationState: IApplicationState;

  ApplicationState: IApplicationState 
}

export class CreateApplicationResponseDto extends ApiResponseDto {
  @ApiProperty({
    example: {
      CompanyAdminID: "9831b381-c071-4703-8547-443c56ef407b",
      ApplicantId: "6030635f-326e-4030-92c6-06d7ab3eff8d",
      CreateBy: "c575482d-1663-4c35-9bcf-735bf9ba3975",
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
          postCode: 'S3bf545',
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
            postCode: 'S3bf545',
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
        OrganizationName: 'Orcalo',
        applicationType: 'Enhanced',
        isApplicationWorkWithAdults: 'no',
        isApplicationWorkWithChildren: 'no',
        isThisWorkYourHomeAddress: 'no',
        applingPositionFor: 'Carer',
        isApplicationFreeOfCharge: 'no',
        isCheckedAddressDetailsWithOriginal: 'no',
        IsCrossCheckedApplicentIdentity: 'yes',

        comment: 'All are Good',
        IsIdentityIndividualBeenVerified: 'yes',
        electronicSignatureImage:
          'bGFkaWVzIGFuZCBnZW50bGVtZW4gd2UgYXJlIGZsb2F0aW5nIGluIHNwYWNl',
      },
      ApplicationState: {
        isPaid: false,
        status: 'Pending',
        stage: 'Rejected by Evidence Checker',
      },
    },
  })
  data: {
    CompanyAdminID: string,
    ApplicantId: string,
    CreateBy: string,
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
      comment: string;
      isIdentityIndividualBeenVerified: string;
      electronicSignatureImage: string;
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

/**
 *   Create Application by Company Admin .......end
 */

/**
 * Create Application by Individual User ......start
 */
export class CreateApplicationByIndividualRequestDto {
  CreateBy: any;
  ApplicantId: any;

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
        postCode: 'S3bf545',
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
          postCode: 'S3bf545',
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
      isUkNational: 'yes',
      isPaidOrVoluntaryWork: 'no',
      isGuideNeeded: 'yes',
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
      organizationName: 'Orcalo',
      applicationType: 'Enhanced',
      isApplicationWorkWithAdults: 'no',
      isApplicationWorkWithChildren: 'no',
      isThisWorkYourHomeAddress: 'no',
      applingPositionFor: 'Carer',
      isApplicationFreeOfCharge: 'no',
      isCheckedAddressDetailsWithOriginal: 'no',
      isCrossCheckedApplicentIdentity: 'yes',
      isIdentityIndividualBeenVerified: 'yes',

      electronicSignatureImage:
        'bGFkaWVzIGFuZCBnZW50bGVtZW4gd2UgYXJlIGZsb2F0aW5nIGluIHNwYWNl',
    },
  })
  EmploymentDetails: IEmploymentDetails;
  @ApiProperty({
    example: {
      isPaid: false,
      status: 'Pending',
      stage: 'Rejected by Evidence Checker',
    },
  })
  ApplicationState: IApplicationState;
}

export class CreateApplicationByIndividualResponseDto extends ApiResponseDto {
  @ApiProperty({
    example: {
      UserID: '6377698d5d3714729b29f0af',
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
          postCode: 'S3bf545',
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
            postCode: 'S3bf545',
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
        OrganizationName: 'Orcalo',
        applicationType: 'Enhanced',
        isApplicationWorkWithAdults: 'no',
        isApplicationWorkWithChildren: 'no',
        isThisWorkYourHomeAddress: 'no',
        applingPositionFor: 'Carer',
        isApplicationFreeOfCharge: 'no',
        isCheckedAddressDetailsWithOriginal: 'no',
        IsCrossCheckedApplicentIdentity: 'yes',
        IsIdentityIndividualBeenVerified: 'yes',

        electronicSignatureImage:
          'bGFkaWVzIGFuZCBnZW50bGVtZW4gd2UgYXJlIGZsb2F0aW5nIGluIHNwYWNl',
      },
      ApplicationState: {
        isPaid: false,
        status: 'Pending',
        stage: 'Rejected by Evidence Checker',
      },
    },
  })
  data: {
    UserID: any;
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
          isTravelingInUk: boolean;
          travelingOther: boolean;
          noFixedAbode: boolean;
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
      comment: string;
      isIdentityIndividualBeenVerified: string;
      electronicSignatureImage: string;
    };
    // ReviewInfo: {
    //   isFillBehalfOfRespresentative: string;
    //   isUserInfoIsTrue: string;
    //   isAvailableOptionForSubmit: string;
    //   isProvidedInfoDirectlyToEmployer: string;
    //   isReadPrivacyPolicy: string;
    // };
    ApplicationState: {
      isPaid: boolean;
      status: string;
      stage: string;
    };
  };
  @ApiProperty({ example: null, nullable: true })
  errors: { [key: string]: any };
}

/**
 *   Create Application by Individual User ........end
 */
