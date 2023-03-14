import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
  Put,
  Query,
  Logger,
  Patch,
  HttpStatus,
  HttpException,
  Req,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { ClientRMQ, RpcException } from '@nestjs/microservices';
import {
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiProperty,
  ApiTags,
} from '@nestjs/swagger';
// import {
//   GetApplicationOfSubUserIDDto,
import { firstValueFrom } from 'rxjs';
import { CommentApplicationRequestDto } from '../dto/commits/create-commit.dto';
// import { GetApplicationOfSubUserIDDto, GetApplicationPaginationByStatusDto, GetApplicationPaginationDto, GetApplicationsHistoryDto } from '../dto/application/list-application.dto'
// import { GetApplicationByAdminIDDto, GetApplicationByAdminIDwithStatusDto, GetApplicationByIndividualUserIDDto, GetApplicationByIndividualUserwithStatusIDDto } from '../dto/application/list-application.dto';
import {
  ApplicationCertificatePostedOutDto,
  ConfirmReceiptOfAnApplication,
  GetApplicationOfSubUserIDDto,
  GetApplicationPaginationByStatusDto,
  GetApplicationPaginationDto,
  GetApplicationsAssignedToCounterSignatory,
  GetApplicationsHistoryDto,
  GetCouterSignatoryAppsOfIndividualAndCompany,
  GetInCompleteApplicationsDto,
  GetCertificateEligibleForReprint,
  SubmitApplicationByCouterSignatory,
  ViewAssignedDBSApplications,
  ViewAssignedDBSApplicationsEvdenceChecker,
  getApplicationsPendingForEvedenceChecker,
  getReconcilationDto,
  ViewAssignedDBSApplicationsEvdenceCheckerSubUser,
} from '../dto/application/list-application.dto';
import {
  GetApplicationByAdminIDDto,
  GetApplicationByAdminIDwithStatusDto,
  GetApplicationByIndividualUserIDDto,
  GetApplicationByIndividualUserwithStatusIDDto,
} from '../dto/application/list-application.dto';
import { SERVICE } from '../constants';
import {
  CreateApplicationRequestDto,
  CreateApplicationResponseDto,
  CreateApplicationByIndividualRequestDto,
  CreateApplicationByIndividualResponseDto,
  DeleteApplicationResponseDto,
  DeleteApplicationRequestDto,
  UpdateApplicationRequestDto,
  UpdatedApplicationResponseDto,
  RejectedApplicationResponseDto,
  RejectApplicationRequestDto,
  ResultApplicationAlreadyPaidForResponseDto,
  ApplicationToBeReviewed,
  ApplicationCertificatePostedOut,
} from '../dto/application';
import { Permission } from '../shared/decorators/custom/roles.decorator';
import { AuthN } from '../shared/decorators/authN.decorator';
import { date, string } from 'joi';
import {
  ResultApplicationRequestDto,
  ResultApplicationResponseDto,
} from '../dto/application/result-application.dto';
import {
  applicationAssignCounterSignatoryDto,
  ReAssignApplication,
} from '../dto/application/ressign-Application.dto';
class INTERNAL_SERVER_ERROR {
  @ApiProperty({ example: 500 })
  status: number;
}
@ApiInternalServerErrorResponse({
  type: INTERNAL_SERVER_ERROR,
})
@ApiTags('Applications')
@Controller('application')
export class ApplicationController {
  private readonly logger = new Logger('Gateway Application Controller');
  applicationService: any;
  constructor(
    @Inject(SERVICE.DBS_APPLICATION) private applicationClient: ClientRMQ,
    @Inject(SERVICE.USER_PROFILE) private USER_PROFILES: ClientRMQ,
  ) { }

  @ApiOkResponse({
    type: CreateApplicationResponseDto,
    isArray: true,
  })
  @ApiOperation({ summary: 'List of application by status' })
  @Permission('application_pending')
  @Get('listByStatus')
  async listApplicationByStatus(
    @Query() dto: GetApplicationPaginationByStatusDto,
  ) {
    return await this.applicationClient.send('list_applications_status', dto);
  }

  /*****
   * List All Applications
   *
   * for SYSTEM_ADMIN
   *****/
  @ApiOkResponse({
    type: CreateApplicationResponseDto,
    isArray: true,
  })
  @ApiOperation({ summary: 'List all of applications' })
  @Permission('application_list')
  @Get('listAll')
  async listAllApplication(@Req() req, @Query() dto: GetApplicationPaginationDto) {
    dto.createBy = req.user.userId
    console.log('Dadas');
    const role = req.user.roles[0]
    if (role == "EVIDENCE_CHECKER") {
      return await this.applicationClient.send('list_applications_assigned_to_evedence_checker', dto);
    }else if(role=="APPLICANT"){
      return await this.applicationClient.send('list_applications_of_applicant', dto);
    }else {
      return await this.applicationClient.send('list_applications', dto);
    }
  }

  /*****
 * List All Applications
 *
 * for SYSTEM_ADMIN
 *****/
  // @ApiOkResponse({
  //   type: CreateApplicationResponseDto,
  //   isArray: true,
  // })
  // @ApiOperation({ summary: 'List all of applications' })
  // @Permission('application_list')
  // @Get('listAllAssignedToEvedenceChecker')
  // async listAllApplicationAssignedToEvedenceChecker(@Req() req, @Query() dto: GetApplicationPaginationDto) {
  //   dto.createBy = req.user.userId
  //   console.log('Dadas');
  //   return await this.applicationClient.send('list_applications_assigned_to_evedence_checker', dto);
  // }

  /*****
   * Get Application Details
   *****/
  @ApiOkResponse({
    type: CreateApplicationResponseDto,
  })
  @ApiOperation({ summary: 'Get application details by application id' })
  @Permission('application_list')
  @Get('getDetails/:applicationId')
  async getApplicationDetails(@Param('applicationId') applicationId: string) {
    return await this.applicationClient.send('get_application_details', {
      applicationId,
    });
  }

  /**
   * Get Applications of Admin
   */
  @ApiOperation({ summary: 'Get applications created by Admin' })
  @Get('getApplicationsOfAdmin')
  @Permission('application_list')
  async getApplicationsByAdminID(
    @Req() req,
    @Query() dto: GetApplicationByAdminIDDto,
  ) {
    dto.adminId = req.user.userId;

    return await this.applicationClient.send(
      'get_applications_by_AdminID',
      dto,
    );
  }

  /**
   *
   * @param req
   * @param dto
   * @description Get Applications of Admin with status
   * @returns
   */
  @ApiOperation({ summary: 'Get applications created by Admin by Status' })
  @Get('getApplicationsOfAdminByStatus')
  @Permission('application_pending')
  async getApplicationsByAdminIDwithStatus(
    @Req() req,
    @Query() dto: GetApplicationByAdminIDwithStatusDto,
  ) {
    dto.AdminID = req.user.userId;
    return await this.applicationClient.send(
      'get_applications_by_AdminID_with_status',
      dto,
    );
  }

  /**
   *
   * @param req
   * @param dto
   * @description list Applications of Individual
   * @returns
   */
  @ApiOperation({ summary: 'list application of Individual' })
  @Get('listApplicationOfIndividual')
  @Permission('application_list')
  async getApplicationsByIndividualUserID(
    @Req() req,
    @Query() dto: GetApplicationByIndividualUserIDDto,
  ) {
    dto.UserID = req.user.userId;
    return await this.applicationClient.send(
      'get_applications_by_individual_UserID',
      dto,
    );
  }

  @ApiOperation({ summary: 'list application of Sub Users' })
  @Get('getApplicationsOfSubusers')
  @Permission('application_list')
  async getApplicationsOfSubUsers(
    @Req() req,
    @Query() dto: GetApplicationOfSubUserIDDto,
  ) {
    console.log(req.user.roles[0]);

    dto.AdminID = req.user.userId;
    return await this.applicationClient.send(
      'get_applications_of_sub_users',
      dto,
    );
  }

  /**
   *
   * @param req
   * @param dto
   * @description Get Applications of Individual with status
   * @returns
   */
  @ApiOperation({ summary: 'Get applications created by Individual by Id' })
  @Get('getApplicationsOfIndividualByStatus')
  @Permission('application_pending')
  async getApplicationsByIndividualUserIDwithStatus(
    @Req() req,
    @Query() dto: GetApplicationByIndividualUserwithStatusIDDto,
  ) {
    dto.UserID = req.user.userId;
    return await this.applicationClient.send(
      'get_applications_by_individual_UserID_with_status',
      dto,
    );
  }

  /**
   *
   * @param req
   * @param dto
   * @description Create Application by Company Admin User
   * @returns
   */

  @ApiCreatedResponse({
    type: CreateApplicationResponseDto,
  })
  @ApiOperation({ summary: 'Create application by company admin' })
  // @Permission('application_create')
  // @Post('createByCompanyAdmin')
  // async create(@Req() req, @Body() dto: CreateApplicationRequestDto) {
  //   const adminId = req.user.userId;
  //   dto.AdminID = adminId;
  //   return await this.applicationClient.send('create_application', dto);
  // }

  // /**
  //  *
  //  * @param req
  //  * @param dto
  //  * @description Create Application by Individual User
  //  * @returns
  //  */
  // @AuthN()
  @Permission('application_create')
  @Post('createByCompanyAdmin')
  async create(
    @Req() { user: { userId, role } },
    @Body() dto: CreateApplicationRequestDto,
  ) {
    const { ApplicantId } = dto;
    //console.log('--------AppGATEWAY=====',userId,"+++++++++++++++", ApplicantId, '=======AppGATEWAY-------');
    // if(!dto.AdminID){
    //   throw new RpcException("Admin ID is required!!")
    // }
    // const adminId = req.user.userId
    // dto.AdminID = adminId
    Logger.log(dto);

    const create = await firstValueFrom(
      this.USER_PROFILES.send('get_single_user', { id: ApplicantId }),
    );
    console.log(create," create");
    if(!create){ return new NotFoundException('Applicant No Found') }
    
    /////////////////////////////////////|||||||||||||||||\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
    if (role === 'COMPANY_ADMIN') {
      if (userId === create.companyAdminId) {
        const create1 = await firstValueFrom(
          this.applicationClient.send('create_application', {
            CompanyAdminID: create.companyAdminId,
            ApplicantId: ApplicantId,
            CreateBy: userId,
            ...dto,
          }),
        );
        //   console.log("---------responseGateway=========",create.companyAdminId,"-------responseGateway=========")
        return create1;
      } else {
        throw new BadRequestException('Bad Request');
      }
    } else {
      const create2 = await firstValueFrom(
        this.USER_PROFILES.send('get_All_user', { id: userId }),
      );
      if (create.companyAdminId === create2.companyAdminId) {
        const create1 = await firstValueFrom(
          this.applicationClient.send('create_application', {
            CompanyAdminID: create.companyAdminId,
            ApplicantId: ApplicantId,
            CreateBy: userId,
            ...dto,
          }),
        );
        //   console.log("---------responseGateway=========",create.companyAdminId,"-------responseGateway=========")
        return create1;
      } else {
        throw new BadRequestException('Bad Request');
      }
    }
  }
  // responseGateway {
  //   _id: '639cab79b38b8d64ad59c5b4',
  //   companyAdminId: '9831b381-c071-4703-8547-443c56ef407b',
  //   CreatedBy: '1a791cec-7ad3-4711-8c5a-491ca955ee25',
  //   userId: '6030635f-326e-4030-92c6-06d7ab3eff8d',
  //   AllUser: {
  //     userType: 'APPLICANT',
  //     forename: 'kamran Ali',
  //     surname: 'kamran',
  //     username: 'afaq22',
  //     dateOfBirth: '12/09/1998',
  //     phone: '+923015586305',
  //     mobile: '+923015586305',
  //     email: 'kamran.sadiq+16@ceative.co.uk',
  //     postCode: '2s2d234',
  //     Active: false
  //   },
  //   UserDetails: {
  //     isUnderstoodDBSCodeOfPractice: true,
  //     isUnderstoodDBSIdChecking: true,
  //     isUnderstoodDBSIdcheckScenarios: true,
  //     isPersonHasFamiliarWithInfoOnDBS: true,
  //     electronicSignature: '54yhdfishg8745ythgie'
  //   },
  //   ApplicantBasic: {
  //     DisclosureType: 'Basic',
  //     PositionApplyingFor: 'string',
  //     isfreeCOVID19DBScheck: false,
  //     ThisCompAdminWillCreateAppUser: false,
  //     IsfreeVolAsPerTheDefInPolice1997: false
  //   },
  //   defaultRole: 'APPLICANT',
  //   createdAt: '2022-12-16T17:31:37.551Z',
  //   updatedAt: '2022-12-26T13:41:59.695Z',
  //   Assigned: false,
  //   AssignedBy: '',
  //   AssignedTo: ''

  /*****
   * Create Application by Individual User
   ****/
  @ApiCreatedResponse({
    type: CreateApplicationByIndividualResponseDto,
  })
  @ApiOperation({ summary: 'Create application by indivitual user' })
  @Post('createByIndividual')
  @Permission('application_create')
  async createAppByIndividual(
    @Req() req,
    @Body() dto: CreateApplicationByIndividualRequestDto,
  ) {
    dto.CreateBy = req.user.userId;
    dto.ApplicantId = req.user.userId;
    return await this.applicationClient.send(
      'create_application_by_individual',
      dto,
    );
  }

  /**
   *
   * @param req
   * @param dto
   * @description Update Application
   * @returns
   */
  @ApiOkResponse({
    type: UpdatedApplicationResponseDto,
  })
  @Put('update/:applicationId')
  @ApiOperation({ summary: 'Update application by application id' })
  @Permission('application_create')
  async updateApplication(
    @Body() data: UpdateApplicationRequestDto,
    @Param('applicationId') applicationId: string,
    @Query("onSubmit") onSubmit: boolean,
    @Req() req,
  ) {
    return await this.applicationClient.send('update_application', {
      applicationId,
      onSubmit,
      createdBy: req.user.userId,
      myRole: req.user.roles[0],
      ...data,
    });
  }

  /**
   *
   * @param req
   * @param dto
   * @description Submit By Evedence Checker
   * @returns
   */
  @ApiOkResponse({
    type: UpdatedApplicationResponseDto,
  }) 
  @Put('submitByEvedenceChecker/:applicationId')
  @ApiOperation({
    summary: 'Update application by application id by Evedence Checker',
  })
  @Permission('application_create')
  async submitByEvedenceChecker(
    @Body() data: UpdateApplicationRequestDto,
    @Param('applicationId') applicationId: string,
    @Req() req,
  ) {
    return await this.applicationClient.send('submit_by_evedence_checker', {
      applicationId,
      createdBy: req.user.userId,
      ...data,
    });
  }

  /**
   *
   * @param req
   * @param dto
   * @description Reject Application
   * @returns
   */
  @ApiOkResponse({
    type: RejectedApplicationResponseDto,
  })
  @Put('reject/:applicationId')
  @ApiOperation({ summary: 'Reject application by application id' })
  @Permission('application_rejected')
  async rejectApplication(
    @Req() req,
    @Body() data: RejectApplicationRequestDto,
    @Param('applicationId') applicationId: string,
  ) {
    data.ApplicationState.rejectedBy = req.user.userId;
    data.ApplicationState.postedOn = new Date();
    return await this.applicationClient.send('reject_application', {
      applicationId,
      ...data,
    });
  }

  /**
   *
   * @param req
   * @param dto
   * @descriptionDelete Delete Application
   * @returns
   */
  @ApiOkResponse({
    type: DeleteApplicationResponseDto,
  })
  @ApiOperation({ summary: 'Delete application by application id' })
  @Delete('delete/:id')
  async deleteApplication(@Param('id') id: string) {
    return await this.applicationClient.send('delete_application', { id });
  }

  /**
   *
   * @param req
   * @param dto
   * @description View DBS Application Result
   * @returns
   */
  @ApiOkResponse({
    type: ResultApplicationResponseDto,
  })
  @Get('result/:applicationId')
  @ApiOperation({ summary: 'View Result of an application by application id' })
  @Permission('application_result')
  async resultApplication(
    // @Req() req,
    // @Body() data: ResultApplicationRequestDto,
    @Param('applicationId') applicationId: string,
  ) {
    const applicationResult = await this.applicationClient.send(
      'result_application',
      {
        applicationId,
      },
    );
    return applicationResult;
  }

  /**
   *
   * @param req
   * @param dto
   * @description DBS Application Already Paid for
   * @returns applications which have been paid => ApplicationState.isPaid === true
   */
  @ApiOkResponse({
    type: ResultApplicationAlreadyPaidForResponseDto,
  })
  @Get('applicationAlreadyPaidFor')
  @ApiOperation({ summary: 'View DBS Application Already Paid for' })
  @AuthN()
  async applicationAlreadyPaidFor(
    @Req() { user: { userId } },
    @Query() dto: GetApplicationByAdminIDDto,
  ) {
    dto.adminId = userId;
    console.log(dto);
    const applicationAlreadyPaidFor = await this.applicationClient.send(
      'application_already_paid_for',
      {
        ...dto,
      },
    );
    return applicationAlreadyPaidFor;
  }

  /**
   *
   * @param req
   * @param dto
   * @description DBS Application to be Reviewed
   * @returns
   */
  // @ApiOkResponse({
  //   type: ApplicationToBeReviewed,
  // })
  // @Get('applicationToBeReviewed')
  // @ApiOperation({ summary: 'View DBS Application to be Reviewed' })
  // @AuthN()
  // async applicationToBeReviewed(
  //   @Req() { user: { userId } },
  //   @Query() dto: GetApplicationByAdminIDDto,
  // ) {
  //   dto.adminId = userId;
  //   console.log(dto);
  //   const applicationToBeReviewed = await this.applicationClient.send(
  //     'application_to_be_reviewed',
  //     {
  //       ...dto,
  //     },
  //   );
  //   return applicationToBeReviewed;
  // }

  /**
   *
   * @param req
   * @param dto
   * @description Complete DBS Check - Certificate Posted out'
   * @returns applications with submit status => ApplicationState.status === Submit
   */
  @ApiOkResponse({
    type: ApplicationCertificatePostedOut,
  })
  @Get('applicationCertificatePostedOut')
  @ApiOperation({ summary: 'Complete DBS Check - Certificate Posted out' })
  @AuthN()
  async applicationCertificatePostedOut(
    @Req() { user: { userId, roles } },
    @Query() dto: ApplicationCertificatePostedOutDto,
  ) {
    dto.adminId = userId;
    console.log(dto);
    const userRoles = roles[0]
    const applicationCertificatePostedOut = await this.applicationClient.send(
      'application_certificate_posted_out',
      {
        ...dto,
        userRoles
      },
    );
    return applicationCertificatePostedOut;
  }

  /**
   *
   * @param req
   * @param dto
   * @description Complete DBS Check - Certificate Posted out - Erased Applications
   * @returns applications with submit status => ApplicationState.status === Submit
   */
  @ApiOkResponse({
    type: ApplicationCertificatePostedOut,
  })
  @Get('applicationCertificatePostedOutErasedApplications')
  @ApiOperation({
    summary:
      'Complete DBS Check - Certificate Posted out - Erased Applications',
  })
  @AuthN()
  async applicationCertificatePostedOutErasedApplications(
    @Req() { user: { userId, roles } },
    @Query() dto: ApplicationCertificatePostedOutDto,
  ) {
    dto.adminId = userId;
    console.log(dto);
    const userRoles = roles[0]
    const applicationCertificatePostedOutErasedApplications =
      await this.applicationClient.send(
        'application_certificate_posted_out_erased_applications',
        {
          ...dto,
          userRoles
        },
      );
    return applicationCertificatePostedOutErasedApplications;
  }

  /////////////////////////////////////////////////////////////////////////////////////////////////
  @ApiOperation({ summary: 'comment by Users' })
  @AuthN()
  @Post('comment')
  async commitApplication(
    @Body() dto: CommentApplicationRequestDto,
    @Req() { user: { userId, roles } },
  ) {
    const { commentUser } = dto;
    const {
      usersId,
      signatoryReconciliation,
      counterSignatoryId,
      comment,
      createBy,
      applicationId,
      adminId,
    } = commentUser;
    // const create2 = await firstValueFrom(
    //   this.USER_PROFILES.send('get_All_user', { id: userId }),
    // );
    // console.log("---------responseGateway=========",create2.comapanyAdminId,"-------responseGateway=========")
    try {
      const comment1 = firstValueFrom(
        this.applicationClient.send('comment', {
          roles: roles,
          TokenUsersId: userId,
          applicationId,
          counterSignatoryId,
          createBy,
          comment,
          signatoryReconciliation,
          adminId,
          ...dto,
        }),
      );
      return comment1;
    } catch (err) {
      console.log(err);
    }
  }

  @ApiOperation({ summary: 'ReAssign application by application id to ' })
  @AuthN()
  @Post('/reAssign')
  async ReAssignApplication(
    @Body() dto: ReAssignApplication,
    @Req() { user: { userId } },
  ) {
    return this.applicationClient.send('application_reassign', {
      AssignBy: userId,
      ...dto,
    });
  }
  @ApiOperation({ summary: 'ReAssign application by application id to ' })
  @Post('/AssignCountersignatory')
  async applicationAssignCounterSignatory(
    @Body() dto: applicationAssignCounterSignatoryDto,
  ) {
    return this.applicationClient.send(
      'application_assign_countersignatory',
      dto,
    );
  }

  @ApiOperation({ summary: 'Get application History by application id' })
  @Get('getApplicationHistory')
  async getApplicationHistory(@Query() dto: GetApplicationsHistoryDto) {
    // console.log(params);
    return await this.applicationClient.send('get_application_history', dto);
  }

  @ApiOperation({
    summary:
      'get applications of countersignatory assigned companies employees',
  })
  @AuthN()
  @Get('/companyAppOfCounterSignatory')
  async getCompanyAppOfCounterSignatory(@Req() { user: { userId } }, @Query() dto : GetCouterSignatoryAppsOfIndividualAndCompany) {
    dto.userId = userId
    return this.applicationClient.send(
      'get_application_assign_countersignatory_company',
      dto,
    );
  }

  // @ApiOperation({
  //   summary: 'get applications of countersignatory assigned Individual',
  // })
  // @AuthN()
  // @Get('/individualAppOfCounterSignatory')
  // async getIndividualAppOfCounterSignatory(@Req() { user: { userId } }, @Query() dto : GetCouterSignatoryAppsOfIndividualAndCompany) {
  //   dto.userId = userId
  //   return this.applicationClient.send(
  //     'get_application_assign_countersignatory_individual',
  //     dto,
  //   );
  // }

  // @ApiOperation({
  //   summary:
  //     'get applications of countersignatory assigned companies employees Commented',
  // })
  // @AuthN()
  // @Get('/companyAppOfCounterSignatoryCommented')
  // async getCompanyAppOfCounterSignatoryCommented(@Req() { user: { userId } }, @Query() dto : GetCouterSignatoryAppsOfIndividualAndCompany) {
  //   dto.userId = userId
  //   return this.applicationClient.send(
  //     'get_application_assign_countersignatory_company_commented',
  //     dto,
  //   );
  // }

  // @ApiOperation({
  //   summary:
  //     'get applications of countersignatory assigned Individual Commented',
  // })
  // @AuthN()
  // @Get('/individualAppOfCounterSignatoryCommented')
  // async getIndividualAppOfCounterSignatoryCommented(
  //   @Req() { user: { userId } }, @Query() dto : GetCouterSignatoryAppsOfIndividualAndCompany
  // ) {
  //   dto.userId = userId
  //   return this.applicationClient.send(
  //     'get_application_assign_countersignatory_individual_commented',
  //     dto,
  //   );
  // }

  @ApiOperation({
    summary: 'get all applications of countersignatory assigned',
  })
  @AuthN()
  @Get('/getAllApplicationsAssignedToCounterSignatory')
  async getAllApplicationsAssignedToCounterSignatory(
    @Req() { user: { userId } },
    @Query() dto: GetApplicationsAssignedToCounterSignatory,
  ) {
    dto.counterSignatoryId = userId;
    return this.applicationClient.send(
      'get_all_applications_assigned_to_counter_signatory',
      dto,
    );
  }

  @ApiOperation({
    summary: 'get all applications of countersignatory assigned',
  })
  @AuthN()
  @Put('/submitApplicationsByCounterSignatory/:id')
  async submitApplicatinByCounterSignatory(
    @Param() dto: SubmitApplicationByCouterSignatory,
  ) {
    console.log(dto);
    return this.applicationClient.send(
      'submit_application_by_counter_signatory',
      dto,
    );
  }

  /**
   *
   * @param req
   * @param dto
   * @description Total count of Applications through status
   * @returns
   */
  @ApiOperation({ summary: 'Total count of DBS Applications through status' })
  @AuthN()
  @Permission('application_list')
  @Get('totalCount')
  async totalCountOfDBSApplication(@Req() req) {
    // dto.AdminID = userID;
    // console.log(dto);
    const createBy = req.user.userId;
    const usersroles = req.user.roles[0];
    return await this.applicationClient.send('list_total_count_application', {
      createBy,
      usersroles,
    });
  }

  @ApiOperation({
    summary: 'get all commits of applicaitons by id',
  })
  @AuthN()
  @Get('/getReconcilation/:id')
  async getReconcilation(
    @Param() dto: SubmitApplicationByCouterSignatory,
    @Query() bodyDto : getReconcilationDto
  ) {
    console.log(dto);
    return this.applicationClient.send(
      'get_Reconcilation',
      {id:dto.id,...bodyDto},
    );
  }

  @ApiOperation({
    summary: 'get application of company which has been assigned',
  })
  @AuthN()
  @Get('/getCompanyAssignedApplications')
  async getComapnyAssignedApplications(
    @Req() { user: { userId } },
    @Query() dto: ViewAssignedDBSApplications,
  ) {
    dto.id = userId;

    return this.applicationClient.send(
      'get_company_assigned_applications',
      dto,
    );
  }

  @ApiOperation({
    summary: 'get application assigned to Evidence Checker',
  })
  @AuthN()
  @Get('/getAssignedToMeApplications')
  async getAssignedToMeApplications(
    @Req() { user: { userId } },
    @Query() dto: ViewAssignedDBSApplicationsEvdenceChecker,
  ) {
    dto.id = userId;

    return this.applicationClient.send('get_assigned_to_me_applications', dto);
  }

  @ApiOperation({
    summary: 'get application assigned to Evidence Checker',
  })
  @AuthN()
  @Get('/getAssignedToEvedenceCheckerApplications')
  async getAssignedToEvdenceCheckerApplications(
    @Query() dto: ViewAssignedDBSApplicationsEvdenceCheckerSubUser,
  ) {
    return this.applicationClient.send('get_assigned_to_me_applications', dto);
  }

  @ApiOperation({
    summary: 'get all commits of applicaitons by id',
  })
  @AuthN()
  @Patch('/markApplicationAsRead/:id')
  async applicationMarkRead(@Param() dto: SubmitApplicationByCouterSignatory) {
    console.log(dto);
    return this.applicationClient.send('mark_as_read', dto);
  }


  @ApiOperation({
    summary: 'get all applications pending for evedence checker',
  })
  @AuthN()
  @Get('/applicationsPendingForEvedenceChecker')
  async getApplicationsPendingForEvedenceChecker(
    @Req() req,
    @Query() dto: getApplicationsPendingForEvedenceChecker,
  ) {
    dto.userId = req.user.userId
    dto.userRole = req.user.roles[0]
    console.log(dto, " DTO is here");
    return this.applicationClient.send(
      'get_applications_pending_for_evedence_checker',
      dto,
    );
  }


  @ApiOperation({
    summary: 'get InComplete applications',
  })
  @AuthN()
  @Get('/getInCompleteApplications')
  async getInCompleteApplications(
    @Req() req,
    @Query() dto: GetInCompleteApplicationsDto,
  ) {
    dto.userId = req.user.userId
    dto.userRole = req.user.roles[0]
    console.log(dto);
    return this.applicationClient.send(
      'get_applications_incomplete',
      dto,
    );
  }

  /**
   *
   * @param req
   * @param dto
   * @description Total count of Applications for counter Signatory
   * @returns
   */
  @ApiOperation({
    summary: 'Total count of DBS Applications  for counter Signatory',
  })
  @AuthN()
  @Permission('application_list')
  @Get('totalCountCSApp')
  async totalCountOfDBSApplicationCS(@Req() { user: { userId } }) {
    // const AdminID = req.user.userId;
    // dto.AdminID = userID;
    // console.log(dto);
    return await this.applicationClient.send(
      'list_total_count_application_CS',
      { counterSignatoryId: userId },
    );
  }
  @ApiOperation({
    summary: 'Confirm Receipt of an Application',
  })
  @AuthN()
  @Patch('/confirmReceipt')
  async confirmReceipt(@Query() dto: ConfirmReceiptOfAnApplication) {
    Logger.log(dto)
    return this.applicationClient.send('confirm_receipt', dto);
  }

  @ApiOperation({
    summary: 'List DBS Certificate Eligible For Reprint',
  })
  @AuthN()
  @Get('/certificateEligibleForReprint')
  async certificateEligibleForReprint(@Req() { user: { userId, roles } }, @Query() dto:GetCertificateEligibleForReprint) {
    dto.confirmReceipt = false
    dto.userId = userId
    var userRoles = roles[0]
    return this.applicationClient.send('certificate_eligible_for_reprint', {...dto , userRoles});
  }
}
