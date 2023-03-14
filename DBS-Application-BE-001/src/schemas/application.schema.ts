import * as mongoose from 'mongoose';
import { ProgressStatus } from '../interfaces/application/progress-status.enum';
import { IApplication } from '../interfaces/application/application.interface';
import { SchemaFactory } from '@nestjs/mongoose/dist/factories';
import { Prop, Schema } from '@nestjs/mongoose/dist/decorators';
import { SchemaTypes, Types } from 'mongoose';
import {
  IApplicationState,
  IPersonalDetails,
} from 'src/interfaces/application/applicationByCompanyAdmin.interface';
// import { ProgressStatus } from 'src/interfaces/application/progress-status.enum';
import { IsString, ValidateNested } from 'class-validator';

@Schema({ versionKey: false, timestamps: true })
export class Application {
  @Prop({ type: String, ref: 'users', required: false })
  CompanyAdminID: string;
  @IsString()
  @Prop({ type: String, ref: 'users', required: true })
  ApplicantId: string;
  @Prop({ type: String, ref: 'users', required: false })
  AssignTo: string;
  @IsString()
  @Prop({ type: String, ref: 'users', required: false })
  AssignBy: string;
  @Prop({ type: Boolean, required: false })
  Assigned: boolean;
  @Prop({ type: String, ref: 'users', required: false })
  CreateBy: string;
  @Prop({ type: Boolean, required: false })
  MarkedAsRead: boolean;
  @Prop({ type: Boolean, required: false })
  ConfirmReceipt: boolean;
  @Prop({ type: Object, required : false })
  CounterSignatoryState:{
    CounterSignatoryId: string;
    CS_status: {
      type: String;
      enum: {
        values: [
          "New","InProgress","Completed"
        ];
        message: 'Invalid status type.';
      };
    };
    commented:boolean;
  };

  @IsString()
  @Prop({ type: Object, required: false })
  PersonalDetails: IPersonalDetails;

  @Prop({ type: Object, required: false })
  AddressDetails: {
    CurrentDetails: {
      country: string;
      postCode: string;
      addressLine1: string;
      addressLine2: string;
      thirdMidName: string;
      cityOrTown: string;
      county: string;
      residentFrom: string;
      PreviousAddress: [
        {
          unusualAddress: string;
          country: string;
          postCode: string;
          addressLine1: string;
          addressLine2: string;
          cityOrTown: string;
          county: boolean;
          residentFrom: string;
          residentUntil: string;
        },
      ];
    };
  };
  @Prop({ type: Object, required: false })
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
  @Prop({ type: Object, required: false })
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
  @Prop({ type: Object, required: false })
  isNationalUK?: {
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
  @Prop({ type: Object, required: false })
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
  @Prop({ type: Object, required: false })
  ReviewInfo: {
    isFillBehalfOfRespresentative: string;
    isUserInfoIsTrue: string;
    isAvailableOptionForSubmit: string;
    isProvidedInfoDirectlyToEmployer: string;
    isReadPrivacyPolicy: string;
  };
  @Prop({ type: Object, required: false })
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
  @Prop({ type: Object, required: false })
  @IsString()
  @ValidateNested({ each: true })
  ApplicationState: {
    isPaid: boolean;
    status: {
      type: String;
      enum: {
        values: [
          ProgressStatus.VIEW_ASSIGNED,
          ProgressStatus.IN_PENDING,
          ProgressStatus.REJECTED,
          ProgressStatus.COMPLETED,
          ProgressStatus.IN_ISSUES,
          ProgressStatus.IN_PROGRESS,
          ProgressStatus.IN_COMPLETE,
          ProgressStatus.RETURNED_TO_EC,
          ProgressStatus.SENT_TO_HOME_OFFICE
        ];
        message: 'Invalid status type.';
      };
    };

    comment: string;
    rejectedBy: string;
    postedOn: Date;
  };
}

export const ApplicationSchema = SchemaFactory.createForClass(Application);

//     IdentityCheck: {
//       passportNum: {
//         type: String,
//       },
//       birthOnPassport: {
//         type: String,
//       },
//       passportNationality: {
//         type: String,
//       },
//       passportIssueDate: {
//         type: String,
//       },
//       licenceNumber: {
//         type: String,
//       },
//       dateOfBirthOnLicence: {
//         type: String,
//       },
//       licenceType: {
//         type: String,
//       },
//       licenceValidFrom: {
//         type: String,
//       },
//       licenceIssueCountry: {
//         type: String,
//       },
//     },
//     isNationalUK: {
//       isPassportValid: {
//         type: Boolean,
//       },
//       isBiometricResidencePermit: {
//         type: Boolean,
//       },
//       isCurrentDrivingLicense1: {
//         type: Boolean,
//       },
//       idBirthCertificateIssued: {
//         type: Boolean,
//       },
//       idAdoptionCertificate: {
//         type: Boolean,
//       },
//       isCurrentDrivingLicense: {
//         type: Boolean,
//       },
//       isBiometricCurrentDrivingLicense: {
//         type: Boolean,
//       },
//       isBirthCertificateIssued: {
//         type: Boolean,
//       },
//       isPertnershipCertificate: {
//         type: Boolean,
//       },
//       isImmigrationDocuments: {
//         type: Boolean,
//       },
//       IsMortgageStatment: {
//         type: Boolean,
//       },
//       isIssuedBankBuildingSocity: {
//         type: Boolean,
//       },
//       isIssuedBankBuildingSocityForOutSideUK: {
//         type: Boolean,
//       },
//       isIssuedBankAccountOpeningConfirmation: {
//         type: Boolean,
//       },
//       isCreditCardStatment: {
//         type: Boolean,
//       },
//       isP45OrP60Statement: {
//         type: Boolean,
//       },
//       isCouncitTaxStatement: {
//         type: Boolean,
//       },
//       isLetterOfSponsorship: {
//         type: Boolean,
//       },
//       isUtiliyBill: {
//         type: Boolean,
//       },
//       isBenifitStatementForChild: {
//         type: Boolean,
//       },
//       isLocalDocGiven: {
//         type: Boolean,
//       },
//       isEEANationalIDCard: {
//         type: Boolean,
//       },
//       isCardCarringPassLogo: {
//         type: Boolean,
//       },
//       letterFromHeadTeacher: {
//         type: Boolean,
//       },
//       immigrationDocumentOrWorkPermit: {
//         type: Boolean,
//       },
//       merriageCivilPertnershipCertificate: {
//         type: Boolean,
//       },
//       immigrationDocOrWorkPermitFor16YrOlds: {
//         type: Boolean,
//       },
//     },
//     PrimaryDocuments: {
//       IsPassportCardIsNationalOfIreland: {
//         type: Boolean,
//       },
//       IsDocIssuedByHomeOffice: {
//         type: Boolean,
//       },
//       IsBiometricImmigrationDocResiPermit: {
//         type: Boolean,
//       },
//       IsEIRPOrBRCServiceIssuedByHO: {
//         type: Boolean,
//       },
//       IsPassportHolderIdExemptImmigrationControl: {
//         type: Boolean,
//       },
//       IsImmigrationStatusDocIssuedByHO: {
//         type: Boolean,
//       },
//       IsPasswordEndorsedHolderIsStayInUk: {
//         type: Boolean,
//       },
//       IsSometricImmigrationDocIssuedByHO: {
//         type: Boolean,
//       },
//       IsCurrentDocIssuedByHOToEEA: {
//         type: Boolean,
//       },
//       IsFrontierWorkerPermitIssuedUnder: {
//         type: Boolean,
//       },
//       IsImmigrationStatusDocPhotographIssued: {
//         type: Boolean,
//       },
//       IsDocIssuedByHOPermittedToTakeTheEmployment: {
//         type: Boolean,
//       },
//       IsAnAppRegistrationCardIssedByHO: {
//         type: Boolean,
//       },
//       IsAPossitiveVerficationNoticeIssued: {
//         type: Boolean,
//       },
//     },
//     ReviewInfo: {
//       isFillBehalfOfRespresentative: {
//         type: String,
//       },
//       isUserInfoIsTrue: {
//         type: String,
//       },
//       isAvailableOptionForSubmit: {
//         type: String,
//       },
//       isProvidedInfoDirectlyToEmployer: {
//         type: String,
//       },
//       isReadPrivacyPolicy: {
//         type: String,
//       },
//     },
//     EmploymentDetails: {
//       organizationName: {
//         type: String,
//       },
//       applicationType: {
//         type: String,
//       },
//       isApplicationWorkWithAdults: {
//         type: String,
//       },
//       isApplicationWorkWithChildren: {
//         type: String,
//       },
//       isThisWorkYourHomeAddress: {
//         type: String,
//       },
//       applingPositionFor: {
//         type: String,
//       },
//       isApplicationFreeOfCharge: {
//         type: String,
//       },
//       isCheckedAddressDetailsWithOriginal: {
//         type: String,
//       },
//       isCrossCheckedApplicentIdentity: {
//         type: String,
//       },
//       comment: {
//         type: String,
//       },
//       isIdentityIndividualBeenVerified: {
//         type: String,
//       },
//       electronicSignatureImage: {
//         type: String,
//       },
//     },
//     ApplicationState: {
//       isPaid: {
//         type: Boolean,
//       },
//       status: {
//         type: String,
//         enum: {
//           values: [
//             ProgressStatus.VIEW_ASSIGNED,
//             ProgressStatus.IN_PENDING,
//             ProgressStatus.REJECTED,
//             ProgressStatus.COMPLETED,
//             ProgressStatus.IN_ISSUES,
//           ],
//           message: 'Invalid status type.',
//         },
//       },
//       stage: {
//         type: String,
//       },
//       comment: {
//         type: String,
//       },
//       rejectedBy: {
//         type: String,
//       },
//       postedOn: {
//         type: Date,
//         default: Date.now,
//       },
//     },
//   },
//   { timestamps: true },
// );
// export const AppHistSchema = new mongoose.Schema<AppHist>(
//   {
// Application: {
//   AdminID: {
//     type: String,
//     ref: 'users'
//   },
//   UserID: {
//     type: String,
//     required: true,
//     ref: 'users',
//   },
//   PersonalDetails: {
//     title: {
//       type: String,
//     },
//     firstName: {
//       type: String,
//     },
//     IstMidName: {
//       type: String,
//     },
//     secMidName: {
//       type: String,
//     },
//     thirdMidName: {
//       type: String,
//     },
//     presentSurname: {
//       type: String,
//     },
//     surNameAtBirth: {
//       type: String,
//     },
//     usedUntil: {
//       type: String,
//     },
//     forenamesIs: {
//       type: String,
//     },
//     otherSurnameIs: {
//       type: String,
//     },
//     driverLicenceIs: {
//       type: String,
//     },
//     validPassportIs: {
//       type: String,
//     },
//     gender: {
//       type: String,
//     },
//     dateOfBirth: {
//       type: String,
//     },
//     isAgreedPrivacyPolicy: {
//       type: Boolean,
//     },
//     isAgreedProtectionPolicy: {
//       type: Boolean,
//     },
//     isAgreedTermsConditions: {
//       type: Boolean,
//     },
//   },
//   AddressDetails: {
//     CurrentDetails: {
//       country: {
//         type: String,
//       },
//       postCode: {
//         type: String,
//       },
//       addressLine1: {
//         type: String,
//       },
//       addressLine2: {
//         type: String,
//       },
//       cityOrTown: {
//         type: String,
//       },
//       county: {
//         type: String,
//       },
//       residentFrom: {
//         type: String,
//       },
//     },
//     PreviousAddress: [
//       {
//         unusualAddress: {
//           type: String
//         },
//         country: {
//           type: String,
//         },
//         postCode: {
//           type: String,
//         },
//         addressLine1: {
//           type: String,
//         },
//         addressLine2: {
//           type: String,
//         },
//         cityOrTown: {
//           type: String,
//         },
//         county: {
//           type: String,
//         },
//         residentFrom: {
//           type: String,
//         },
//         residentUntil: {
//           type: String,
//         },
//       },
//     ],
//   },

//   AdditionalDetails: {
//     birthCountry: {
//       type: String,
//     },
//     birthCounty: {
//       type: String,
//     },
//     birthTown: {
//       type: String,
//     },
//     birthNationality: {
//       type: String,
//     },
//     ukInsuranceNum: {
//       type: String,
//     },
//     telephoneNum: {
//       type: String,
//     },
//     mobileNumber: {
//       type: String,
//     },
//     isUkNational: {
//       type: String,
//     },
//     isPaidOrVoluntaryWork: {
//       type: String,
//     },
//     isGuideNeeded: {
//       type: String,
//     },
//   },

//   IdentityCheck: {
//     passportNum: {
//       type: String,
//     },
//     birthOnPassport: {
//       type: String,
//     },
//     passportNationality: {
//       type: String,
//     },
//     passportIssueDate: {
//       type: String,
//     },
//     licenceNumber: {
//       type: String,
//     },
//     dateOfBirthOnLicence: {
//       type: String,
//     },
//     licenceType: {
//       type: String,
//     },
//     licenceValidFrom: {
//       type: String,
//     },
//     licenceIssueCountry: {
//       type: String,
//     },
//   },
//   EmploymentDetails: {
//     applicationType: {
//       type: String,
//     },
//     isApplicationWorkWithAdults: {
//       type: Boolean,
//     },
//     isApplicationWorkWithChildren: {
//       type: Boolean,
//     },
//     isThisWorkYourHomeAddress: {
//       type: Boolean,
//     },
//     applingPositionFor: {
//       type: String,
//     },
//     isApplicationFreeOfCharge: {
//       type: Boolean,
//     },
//     isCheckedAddressDetailsWithOriginal: {
//       type: Boolean,
//     },
//     electronicSignatureImage: {
//       type: String,
//     },
//   },
//   ReviewInfo: {
//     isFillBehalfOfRespresentative: {
//       type: String,
//     },
//     isUserInfoIsTrue: {
//       type: String,
//     },
//     isAvailableOptionForSubmit: {
//       type: String,
//     },
//     isProvidedInfoDirectlyToEmployer: {
//       type: String,
//     },
//     isReadPrivacyPolicy: {
//       type: String,
//     },
//   },
//   CheckDBS: {
//     isnationalRepublicOfIreland: {
//       type: Boolean,
//     },
//     isHolderPermittedToStayInUK: {
//       type: Boolean,
//     },
//     isBioMetricImmigrationDocIssued: {
//       type: Boolean,
//     },
//     isEIRPIssuedByHO: {
//       type: Boolean,
//     },
//     isHolderExemptFromImmigration: {
//       type: Boolean,
//     },
//     isImmigrationDocStatusIssued: {
//       type: Boolean,
//     },
//     isHolderAllowedToStayInUk: {
//       type: Boolean,
//     },
//     isSometricImmigrationDocIssued: {
//       type: Boolean,
//     },
//     isDocIssuedByHOByfamily: {
//       type: Boolean,
//     },
//     isFrontierWorkerPermitIssued: {
//       type: Boolean,
//     },
//     isPhotographIssuedByHO: {
//       type: Boolean,
//     },
//     isHolderHasMadeAnAppForLeave: {
//       type: Boolean,
//     },
//     isAppRegistrationCardIssuedByHO: {
//       type: Boolean,
//     },
//     isVerificationNoticeIssuedByHO: {
//       type: Boolean,
//     },
//   },
//   GroupOneDocuments: {
//     isPassportValid: {
//       type: Boolean,
//     },
//     isBiometricResidencePermit: {
//       type: Boolean,
//     },
//     isCurrentDrivingLicense: {
//       type: Boolean,
//     },
//     idBirthCertificateIssued: {
//       type: Boolean,
//     },
//     idAdoptionCertificate: {
//       type: Boolean,
//     },
//   },
//   Group2ADocuments: {
//     isCurrentDrivingLicense: {
//       type: Boolean,
//     },
//     isBiometricCurrentDrivingLicense: {
//       type: Boolean,
//     },
//     isBirthCertificateIssued: {
//       type: Boolean,
//     },
//     isPertnershipCertificate: {
//       type: Boolean,
//     },
//     isImmigrationDocuments: {
//       type: Boolean,
//     },
//   },
//   Group2BDocuments: {
//     IsMortgageStatment: {
//       type: Boolean,
//     },
//     isIssuedBankBuildingSocity: {
//       type: Boolean,
//     },
//     isIssuedBankBuildingSocityForOutSideUK: {
//       type: Boolean,
//     },
//     isIssuedBankAccountOpeningConfirmation: {
//       type: Boolean,
//     },
//     isCreditCardStatment: {
//       type: Boolean,
//     },
//     isP45OrP60Statement: {
//       type: Boolean,
//     },
//     isCouncitTaxStatement: {
//       type: Boolean,
//     },
//     isLetterOfSponsorship: {
//       type: Boolean,
//     },
//     isUtiliyBill: {
//       type: Boolean,
//     },
//     isBenifitStatementForChild: {
//       type: Boolean,
//     },
//     isLocalDocGiven: {
//       type: Boolean,
//     },
//     isEEANationalIDCard: {
//       type: Boolean,
//     },
//     isCardCarringPassLogo: {
//       type: Boolean,
//     },
//     letterFromHeadTeacher: {
//       type: Boolean,
//     },
//     immigrationDocumentOrWorkPermit: {
//       type: Boolean,
//     },
//     merriageCivilPertnershipCertificate: {
//       type: Boolean,
//     },
//     immigrationDocOrWorkPermitFor16YrOlds: {
//       type: Boolean,
//     },
//   },
//   ApplicationState: {
//     isPaid: {
//       type: Boolean,
//     },
//     status: {
//       type: String,
//       enum: {
//         values: [
//           ProgressStatus.VIEW_ASSIGNED,
//           ProgressStatus.IN_PENDING,
//           ProgressStatus.REJECTED,
//           ProgressStatus.COMPLETED,
//           ProgressStatus.IN_ISSUES,
//         ],
//         message: 'Invalid status type.',
//       },
//     },
//     stage: {
//       type: String,
//     },
//     comment: {
//       type: String,
//     },
//   },
// },
