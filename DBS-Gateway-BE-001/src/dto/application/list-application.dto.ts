import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IAdditionalDetails,
  IAddressDetails,
  IIdentityCheck,
  IisNationalUK,
  IPersonalDetails,
} from 'src/interfaces/application/applicationByCompanyAdmin.interface';
import { ApiResponseDto } from '../common/ApiResponse.dto';

export class ListApplicationRequestDto {
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
      gender: false,
      dateOfBirth: '22/10/2002',
      isAgreedPrivacyPolicy: true,
      isAgreedProtectionPolicy: true,
      isAgreedTermsConditions: true,
    },
  })
  PersonalDetails: IPersonalDetails;

  @ApiProperty({
    example: {
      country: 'Pakistan',
      postCode: 857435,
      addressLine1: 'address line 1 exmaple',
      addressLine2: 'ddress line 2 exmaple',
      cityOrTown: 'London',
      residentFrom: 'June 2022',
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
      isUkNational: true,
      isPaidOrVoluntaryWork: false,
      idGuideNeeded: true,
    },
  })
  AdditionalDetails: IAdditionalDetails;

  @ApiProperty({
    example: {
      // passportNum: 'DR3335',
      // birthOnPassport: '12/09/1998',
      // passportNationality: 'United Kingdom',
      // passportIssueDate: '22/10/2002',
      // licenceNumber: 'SW224',
      // dateOfBirthOnLicence: '12/09/1998',
      // licenceType: 'C1',
      // licenceValidFrom: '12/09/2018',
      // licenceIssueCountry: 'United Kingdom',  
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
}

export class ListApplicationResponseDto extends ApiResponseDto {
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
        gender: false,
        dateOfBirth: '22/10/2002',
        isAgreedPrivacyPolicy: true,
        isAgreedProtectionPolicy: true,
        isAgreedTermsConditions: true,
      },
      AddressDetails: {
        country: 'Pakistan',
        postCode: 857435,
        addressLine1: 'address line 1 exmaple',
        addressLine2: 'ddress line 2 exmaple',
        cityOrTown: 'London',
        residentFrom: 'June 2022',
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
        idGuideNeeded: 'no',
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
    },
  })
  data: {
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
      gender: boolean;
      dateOfBirth: string;
      isAgreedPrivacyPolicy: boolean;
      isAgreedProtectionPolicy: boolean;
      isAgreedTermsConditions: boolean;
    };
    AddressDetails: {
      CurrentDetails: {
        country: string;
        postCode: number;
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
          postCode: number;
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
  };
  @ApiProperty({ example: null, nullable: true })
  errors: { [key: string]: any };
}

export class GetApplicationByAdminIDDto {
  adminId: string;
  @ApiProperty({ example: 0 })
  offset: number;
  @ApiProperty({ example: 5 })
  limit: number;
}


export class GetApplicationByAdminIDwithStatusDto {
  AdminID: string;
  @ApiProperty({ example: "Pending" })
  status: string;
  @ApiProperty({ example: 0 })
  offset: number;
  @ApiProperty({ example: 5 })
  limit: number;
}

export class GetApplicationByIndividualUserIDDto {

  UserID: string;
  @ApiProperty({ example: 0 })
  offset: number;
  @ApiProperty({ example: 5 })
  limit: number;
}

export class GetApplicationOfSubUserIDDto {

  AdminID: string;
  @ApiProperty({ example: 'c28d00d5-8784-45dd-99ea-cb2e9134eb9c' })
  UserID: string;
  @ApiProperty({ example: 0 })
  offset: number;
  @ApiProperty({ example: 5 })
  limit: number;
  @ApiPropertyOptional({ example: "" })
  searchTerm: string;
}

export class GetApplicationByIndividualUserwithStatusIDDto {

  UserID: string;
  @ApiProperty({ example: "Pending" })
  status: string;
  @ApiProperty({ example: 0 })
  offset: number;
  @ApiProperty({ example: 5 })
  limit: number;
}
export class GetApplicationPaginationDto {
  createBy: string
  @ApiProperty({ example: 0 })
  offset?: number
  @ApiProperty({ example: 5 })
  limit?: number
  @ApiPropertyOptional({ example: "Rejected by Evidence Checker" })
  stage?: string
  @ApiPropertyOptional({ example: "" })
  searchTerm?: string
  @ApiPropertyOptional({ example: true })
  isPaid?: boolean
  @ApiPropertyOptional({ example: "Pending" })
  status?: string
  @ApiPropertyOptional({ example: "100000", description: "Give time in seconds" })
  from?: number
  @ApiPropertyOptional({ example: "2670864726", description: "Give time in seconds" })
  to?: number
  @ApiPropertyOptional({ example: "createdAt" })
  sortBy?: string
  @ApiPropertyOptional({ example: -1 })
  sort?: number
}
export class GetApplicationPaginationByStatusDto {
  @ApiProperty({ example: "Pending" })
  status: string
  @ApiProperty({ example: 0 })
  offset: number
  @ApiProperty({ example: 5 })
  limit: number
}

export class GetApplicationsHistoryDto {
  @ApiProperty({ example: "6398aea7d46dff77bab293d7" })
  id: string;
  @ApiProperty({ example: 0 })
  offset: number;
  @ApiProperty({ example: 5 })
  limit : number;
  @ApiPropertyOptional({ example: "createdAt" })
  sortby : string; 
  @ApiPropertyOptional({ example: -1 })
  sort : number;
  @ApiPropertyOptional({ example: "" })
  searchTerm :string;
}

export class GetApplicationsAssignedToCounterSignatory {
  counterSignatoryId: string;
  @ApiPropertyOptional({ example: 0 })
  offset: number;
  @ApiPropertyOptional({ example: 10 })
  limit: number;
}

export class SubmitApplicationByCouterSignatory {
  @ApiProperty({ example: "63b4548608f51934b676884b" })
  id: string;
}

export class getReconcilationDto {
  @ApiPropertyOptional({ example: 0 })
  offset?: number
  @ApiPropertyOptional({ example: 5 })
  limit?: number
  @ApiPropertyOptional({ example: "createdAt" })
  sortBy?: string
  @ApiPropertyOptional({ example: 1 })
  sort?: number
  @ApiPropertyOptional({ example: "" })
  searchTerm?: string
}
export class ConfirmReceiptOfAnApplication {
  @ApiProperty({ example: "63bd72202ee1a77b16a0b012" })
  applicationId: string;
  @ApiProperty({ example: false })
  ConfirmReceipt: boolean;
}

export class ViewAssignedDBSApplications {
  id: string
  @ApiPropertyOptional({ example: 0 })
  offset?: number
  @ApiPropertyOptional({ example: 5 })
  limit?: number
  @ApiPropertyOptional({ example: "Rejected by Evidence Checker" })
  stage?: string
  @ApiPropertyOptional({ example: "createdAt" })
  sortBy?: string
  @ApiPropertyOptional({ example: 1 })
  sort?: number
  @ApiPropertyOptional({ example: "" })
  searchTerm?: string
  @ApiPropertyOptional({ example: true })
  Assigned?: boolean
}

export class ViewAssignedDBSApplicationsEvdenceChecker {
  id: string
  @ApiPropertyOptional({ example: 0 })
  offset?: number
  @ApiPropertyOptional({ example: 5 })
  limit?: number
  @ApiPropertyOptional({ example: "Rejected by Evidence Checker" })
  stage?: string
  @ApiPropertyOptional({ example: "createdAt" })
  sortBy?: string
  @ApiPropertyOptional({ example: 1 })
  sort?: number
  @ApiPropertyOptional({ example: "" })
  searchTerm?: string
}

export class ViewAssignedDBSApplicationsEvdenceCheckerSubUser {
  @ApiProperty({example:""})
  id: string
  @ApiPropertyOptional({ example: 0 })
  offset?: number
  @ApiPropertyOptional({ example: 5 })
  limit?: number
  @ApiPropertyOptional({ example: "Rejected by Evidence Checker" })
  stage?: string
  @ApiPropertyOptional({ example: "createdAt" })
  sortBy?: string
  @ApiPropertyOptional({ example: 1 })
  sort?: number
  @ApiPropertyOptional({ example: "" })
  searchTerm?: string
}

export class getApplicationsPendingForEvedenceChecker {
  @ApiPropertyOptional({ example: 0 })
  offset?: number
  @ApiPropertyOptional({ example: 5 })
  limit?: number
  @ApiPropertyOptional({ example: "createdAt" })
  sortBy?: string
  @ApiPropertyOptional({ example: 1 })
  sort?: number
  @ApiPropertyOptional({ example: "" })
  searchTerm?: string;
  userId: string;
  userRole: string;
}

export class GetInCompleteApplicationsDto {
  @ApiProperty({ example: 0 })
  offset?: number
  @ApiProperty({ example: 5 })
  limit?: number
  @ApiPropertyOptional({ example: "createdAt" })
  sortBy?: string
  @ApiPropertyOptional({ example: 1 })
  sort?: number;
  @ApiPropertyOptional({ example: "" })
  searchTerm?: string
  @ApiPropertyOptional({ example: "100000", description: "Give time in seconds" })
  from?: number
  @ApiPropertyOptional({ example: "2670864726", description: "Give time in seconds" })
  to?: number;
  userId;
  userRole;
}
export class ApplicationCertificatePostedOutDto {
  adminId: string;
  @ApiProperty({ example: 0 })
  offset: number;
  @ApiProperty({ example: 5 })
  limit: number;
  @ApiPropertyOptional({ example: "" })
  searchTerm?: string
  @ApiPropertyOptional({ example: "100000", description: "Give time in seconds" })
  from?: number
  @ApiPropertyOptional({ example: "2670864726", description: "Give time in seconds" })
  to?: number;
  userId: string;
  userRole: string;
  @ApiPropertyOptional({ example: "createdAt" })
  sortBy?: string
  @ApiPropertyOptional({ example: -1 })
  sort?: number
}
export class GetCouterSignatoryAppsOfIndividualAndCompany {
  @ApiProperty({ example: 0 })
  offset?: number
  @ApiProperty({ example: 5 })
  limit?: number
  @ApiPropertyOptional({ example: "createdAt" })
  sortBy?: string
  @ApiPropertyOptional({ example: 1 })
  sort?: number
  @ApiPropertyOptional({ example: "" })
  searchTerm?: string
  @ApiPropertyOptional({ example: "100000", description: "Give time in seconds" })
  from?: number
  @ApiPropertyOptional({ example: "2670864726", description: "Give time in seconds" })
  to?: number;
  @ApiPropertyOptional({ example: true, description: "give true if want company applications else false" })
  company?: boolean;
  @ApiPropertyOptional({ example: true, description: "give true if want commented applications else false" })
  commented?: boolean;
  userId
}

export class GetCertificateEligibleForReprint {

  confirmReceipt: boolean;
  userId:string;
  @ApiProperty({ example: 0 })
  offset: number;
  @ApiProperty({ example: 5 })
  limit: number;
  @ApiPropertyOptional({ example: "" })
  searchTerm?: string
  @ApiPropertyOptional({ example: "createdAt" })
  sortBy?: string
  @ApiPropertyOptional({ example: 1 })
  sort?: number

}