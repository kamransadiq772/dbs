import { Controller, HttpStatus, Inject, Logger } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CommentApplicationRequestDto } from '../dto/application/commit-application.dto';
import { ResultApplicationDto } from '../dto/application/result-application.dto';
import { IApplication } from 'src/interfaces/application/application.interface';
import {
  ListApplicationsDto,
  GetApplicationDto,
  CreateApplicationDto,
  UpdateApplicationDto,
  DeleteApplicationDto,
  ListApplicationByStatusDto,
  CreateApplicationByIndividualDto,
  GetApplicationByAdminIDDto,
  GetApplicationByIndividualUserIDDto,
  GetApplicationByAdminIDwithStatusDto,
  GetApplicationByIndividualUserwithStatusIDDto,
  RejectApplicationDto,
  CertificatePostedOutDto,
} from '../dto/application';
import { ApplicationService } from '../services/application.service';
import {
  applicationAssignCounterSignatoryDto,
  ReAssignApplication,
} from '../dto/application/ReAssign-application.dto';

@Controller()
export class ApplicationController {
  constructor(private readonly applicationService: ApplicationService) {}

  @MessagePattern('list_applications_status')
  async listApplicationByStatus(
    @Payload() payload: ListApplicationByStatusDto,
  ) {
    return await this.applicationService.listApplicationByStatus(payload);
  }

  @MessagePattern('get_application_details')
  async getApplicationDetails(@Payload() payload: GetApplicationDto) {
    // Logger.debug(payload);
    return await this.applicationService.getApplicationDetails(payload);
  }

  @MessagePattern('list_applications')
  async listAllApplications(@Payload() payload) {
    const {
      createBy,
      offset,
      limit,
      stage,
      searchTerm,
      isPaid,
      status,
      from,
      to,
      sortBy,
      sort,
    } = payload;
    return await this.applicationService.listAllApplications(
      createBy,
      offset,
      limit,
      stage,
      searchTerm,
      isPaid,
      status,
      from,
      to,
      sortBy,
      sort,
    );
  }

  @MessagePattern('list_applications_of_applicant')
  async listAllApplicationsOfApplicant(@Payload() payload) {
    const {
      createBy,
      offset,
      limit,
      stage,
      searchTerm,
      isPaid,
      status,
      from,
      to,
      sortBy,
      sort,
    } = payload;
    return await this.applicationService.listAllApplicationsOfApplicant(
      createBy,
      offset,
      limit,
      stage,
      searchTerm,
      isPaid,
      status,
      from,
      to,
      sortBy,
      sort,
    );
  }


  @MessagePattern('list_applications_assigned_to_evedence_checker')
  async listAllApplicationsAssignedToEvedenceChecker(@Payload() payload) {
    const {
      createBy,
      offset,
      limit,
      stage,
      searchTerm,
      isPaid,
      status,
      from,
      to,
      sortBy,
      sort,
    } = payload;
    return await this.applicationService.listAllApplicationsAssignedToEvedenceChecker(
      createBy,
      offset,
      limit,
      stage,
      searchTerm,
      isPaid,
      status,
      from,
      to,
      sortBy,
      sort,
    );
  }

  @MessagePattern('create_application')
  async createApplication(@Payload() payload: CreateApplicationDto) {
    console.log(
      payload,
      '--------========service Controller============--------',
    );
    return await this.applicationService.createApplication(payload);
  }

  @MessagePattern('create_application_by_individual')
  async createAppByIndividual(
    @Payload() payload: CreateApplicationByIndividualDto,
  ) {
    return await this.applicationService.createAppByIndividual(payload);
  }

  @MessagePattern('update_application')
  async updateApplication(@Payload() payload: UpdateApplicationDto) {
    // Logger.debug(payload);
    return await this.applicationService.updateApplication(payload);
  }

  @MessagePattern('submit_by_evedence_checker')
  async submitByEvedenceChecker(@Payload() payload: UpdateApplicationDto) {
    // Logger.debug(payload);
    return await this.applicationService.submitByEvedenceChecker(payload);
  }

  @MessagePattern('reject_application')
  async rejectApplication(@Payload() payload: RejectApplicationDto) {
    Logger.debug(payload);
    return await this.applicationService.rejectApplication(payload);
  }

  @MessagePattern('delete_application')
  async delete(@Payload() payload: DeleteApplicationDto) {
    // Logger.debug(payload);
    return await this.applicationService.deleteApplication(payload);
  }

  @MessagePattern('get_applications_by_AdminID')
  async getApplicationsByAdminID(
    @Payload() payload: GetApplicationByAdminIDDto,
  ) {
    // Logger.debug(payload);
    return await this.applicationService.getApplicationsByAdminID(payload);
  }

  @MessagePattern('get_applications_of_sub_users')
  async getApplicationsOfSubUsers(@Payload() payload: any) {
    // Logger.debug(payload);
    return await this.applicationService.getApplicationsOfSubUsers(payload);
  }
  @MessagePattern('comment')
  async commits(@Payload() payload: CommentApplicationRequestDto) {
    Logger.debug(payload);
    return await this.applicationService.CommentApplication(payload);
  }

  @MessagePattern('get_applications_by_individual_UserID')
  async getApplicationsByIndividualUserID(
    @Payload() payload: GetApplicationByIndividualUserIDDto,
  ) {
    Logger.debug(payload);
    return await this.applicationService.getApplicationsByIndividualUserID(
      payload,
    );
  }
  @MessagePattern('get_applications_by_AdminID_with_status')
  async getApplicationsByAdminIDwithStatus(
    @Payload() payload: GetApplicationByAdminIDwithStatusDto,
  ) {
    // Logger.debug(payload);
    // console.log(payload);

    return await this.applicationService.getApplicationsByAdminIDwithStatus(
      payload,
    );
  }
  @MessagePattern('get_applications_by_individual_UserID_with_status')
  async getApplicationsByIndividualUserIDwithStatus(
    @Payload() payload: GetApplicationByIndividualUserwithStatusIDDto,
  ) {
    // Logger.debug(payload);
    return await this.applicationService.getApplicationsByIndividualUserIDwithStatus(
      payload,
    );
  }

  @MessagePattern('get_application_history')
  async getApplicationHistory(@Payload() payload) {
    // console.log(payload)
    const { id,offset, limit, sortby, sort , searchTerm } = payload;
    return await this.applicationService.getApplicationHistory(id,offset,limit,sortby,sort,searchTerm);
  }

  @MessagePattern('result_application')
  async resultApplication(@Payload() payload: ResultApplicationDto) {
    Logger.debug(payload);
    return await this.applicationService.resultApplication(payload);
  }

  @MessagePattern('application_already_paid_for')
  async applicationAlreadyPaidFor(
    @Payload() Payload: GetApplicationByAdminIDDto,
  ) {
    Logger.debug(Payload);
    return await this.applicationService.applicationAlreadyPaidFor(Payload);
  }

  @MessagePattern('application_to_be_reviewed')
  async applicationToBeReviewed(
    @Payload() Payload: GetApplicationByAdminIDDto,
  ) {
    Logger.debug(Payload);
    return await this.applicationService.applicationToBeReviewed(Payload);
  }

  @MessagePattern('application_reassign')
  async applicationReAssign(@Payload() Payload: ReAssignApplication) {
    Logger.debug(Payload);
    return await this.applicationService.application_Reassign(Payload);
  }

  @MessagePattern('assign_application_by_applicantId')
  async applicationassignbyapplicantId(@Payload() Payload) {
    Logger.debug(Payload);
    return await this.applicationService.applicationAssignByApplicantsIds(Payload);
  }

  @MessagePattern('application_assign_countersignatory')
  async applicationAssignCounterSignatory(
    @Payload() Payload: applicationAssignCounterSignatoryDto,
  ) {
    Logger.debug(Payload);
    return await this.applicationService.applicationAssignCounterSignatory(
      Payload,
    );
  }
  @MessagePattern('list_total_count_application')
  async totalCountOfDBSApplication(@Payload() dto) {
    // console.log(payload);
    const { createBy, usersroles } = dto;
    console.log(dto);
    return await this.applicationService.totalCountOfDBSApplication(
      createBy,
      usersroles,
    );
  }

  @MessagePattern('get_application_assign_countersignatory_company')
  async getApplicationAssignCounterSignatoryCompany(@Payload() Payload) {
    Logger.debug(Payload);
    const { offset, limit,sortBy , sort, searchTerm, from, to, company, commented, userId } = Payload;
    return await this.applicationService.getApplicationsAssignedtoCounterSignatoryofCompany(
      offset, limit,sortBy , sort, searchTerm, from, to,company, commented, userId
    );
  }

  // @MessagePattern('get_application_assign_countersignatory_individual')
  // async getApplicationAssignCounterSignatoryIndividual(@Payload() Payload) {
  //   Logger.debug(Payload);
  //   const { counterSignatoryId } = Payload;
  //   return await this.applicationService.getApplicationsAssignedtoCounterSignatoryofIndividual(
  //     counterSignatoryId,
  //   );
  // }

  // @MessagePattern('get_application_assign_countersignatory_company_commented')
  // async getApplicationAssignCounterSignatoryCommented(@Payload() Payload) {
  //   Logger.debug(Payload);
  //   const { counterSignatoryId } = Payload;
  //   return await this.applicationService.getApplicationsAssignedtoCounterSignatoryofCompanyCommented(
  //     counterSignatoryId,
  //   );
  // }

  // @MessagePattern(
  //   'get_application_assign_countersignatory_individual_commented',
  // )
  // async getApplicationAssignCounterSignatoryIndividualCommented(
  //   @Payload() Payload,
  // ) {
  //   Logger.debug(Payload);
  //   const { counterSignatoryId } = Payload;
  //   return await this.applicationService.getApplicationsAssignedtoCounterSignatoryofIndividualCommented(
  //     counterSignatoryId,
  //   );
  // }

  @MessagePattern('get_all_applications_assigned_to_counter_signatory')
  async getAllAppAssignedToCounterSignatory(@Payload() Payload) {
    Logger.debug(Payload);
    const { offset, limit, counterSignatoryId } = Payload;
    console.log(Payload);
    return await this.applicationService.getAllAssignedApplicationsToCounterSignatory(
      offset,
      limit,
      counterSignatoryId,
    );
  }

  @MessagePattern('submit_application_by_counter_signatory')
  async submitApplicationByCounterSignatory(@Payload() Payload) {
    // Logger.debug(Payload);
    const { id } = Payload;
    console.log(Payload);
    return await this.applicationService.submitApplicationByCounterSignatory(
      id,
    );
  }

  @MessagePattern('application_certificate_posted_out')
  async applicationCertificatePostedOut(
    @Payload() Payload: CertificatePostedOutDto,
  ) {
    Logger.debug(Payload, "CONTROLLER");
    return await this.applicationService.applicationCertificatePostedOut(
      Payload,
    );
  }

  @MessagePattern('application_certificate_posted_out_erased_applications')
  async applicationCertificatePostedOutErasedApplications(
    @Payload() Payload: CertificatePostedOutDto,
  ) {
    Logger.debug(Payload);
    return await this.applicationService.applicationCertificatePostedOutErasedApplications(
      Payload,
    );
  }

  @MessagePattern('get_Reconcilation')
  async getReconcilation(@Payload() Payload) {
    Logger.debug(Payload);
    console.log(Payload)
    const { id,offset,limit,sortBy,sort,searchTerm } = Payload
    return await this.applicationService.getReconcilation(
      id,offset,limit,sortBy,sort, searchTerm
    );
  }

  @MessagePattern('get_company_assigned_applications')
  async getComapnyAssignedApplications(@Payload() Payload) {
    Logger.log(Payload);
    const { id, offset, limit, stage, sortBy, sort, searchTerm, Assigned } =
      Payload;
    return await this.applicationService.getComapnyAssignedApplications(
      id,
      offset,
      limit,
      stage,
      sortBy,
      sort,
      searchTerm,
      Assigned,
    );
  }

  @MessagePattern('get_assigned_to_me_applications')
  async getAssignedToMeApplications(@Payload() Payload) {
    Logger.debug(Payload);
    const { id, offset, limit, stage, sortBy, sort, searchTerm } = Payload;
    return await this.applicationService.getAssignedToMeApplications(
      id,
      offset,
      limit,
      stage,
      sortBy,
      sort,
      searchTerm,
    );
  }

  @MessagePattern('mark_as_read')
  async applicationMarkRead(@Payload() Payload) {
    Logger.debug(Payload);
    const { id } = Payload;
    return await this.applicationService.applicationMarkRead(id);
  }
  @MessagePattern('list_total_count_application_CS')
  async totalCountOfDBSApplicationCS(@Payload() Payload) {
    // console.log(payload);
    const { counterSignatoryId } = Payload;
    console.log(Payload);
    return await this.applicationService.totalCountOfDBSApplicationCS(
      counterSignatoryId,
    );
  }

  @MessagePattern('confirm_receipt')
  async confirmReceipt(
    @Payload() Payload: any,
  ) {
    console.log(Payload, "Payload CONTROLLER")
    return await this.applicationService.confirmReceipt(
      Payload
    );
  }

  

  @MessagePattern('certificate_eligible_for_reprint')
  async certificateEligibleForReprint(
    @Payload() Payload,
  ) {
    Logger.debug(Payload);
    const { userId, confirmReceipt, offset, limit, searchTerm, sortBy, sort,userRoles  } = Payload;
    return await this.applicationService.certificateEligibleForReprint(
      userId, confirmReceipt, offset, limit, searchTerm, sortBy, sort, userRoles
    );
  }

  @MessagePattern('get_applications_incomplete')
  async InCompleteDBSApplications(
    @Payload() Payload,
  ) {
    // Logger.debug(Payload);
    // console.log(Payload, " : By Kamran")
    const {offset,limit,sortBy,sort,searchTerm,from,to,userId,userRole} = Payload
    return await this.applicationService.InCompleteDBSApplications(offset,limit,sortBy,sort,searchTerm,from,to,userId,userRole);
  }

  @MessagePattern('get_applications_pending_for_evedence_checker')
  async applicationsPendingForEvedenceCheck(
    @Payload() Payload,
  ) {
    // Logger.debug(Payload);
    console.log(Payload, " : By Kamran")
    const {offset,limit,sortBy,sort,searchTerm,userId,userRole} = Payload
    return await this.applicationService.applicationsPendingForEvedenceCheck(offset,limit,sortBy,sort,searchTerm,userId,userRole);
  }

}
