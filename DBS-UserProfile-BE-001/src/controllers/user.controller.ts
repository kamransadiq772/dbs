import { Controller, Logger, Req } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import {
  CreateUserDto,
  DeleteCompanyDto,
  ListCompanysDto,
  checkCompanyShortName,
  UpdateUserDto,
  GetUserDto,
} from '../dto/user.ts';
import { CheckCompanyDto } from '../dto/company-user/check-company.dto';
import { UserService } from '../services/user.service';

@Controller()
export class UserController {
  constructor(private readonly UserService: UserService) {}

  // @MessagePattern('list_user')
  // async listUsers(payload: ListCompanysDto) {
  //   return await this.UserService.listUsers(payload);
  // }

  // @MessagePattern('get_user')
  // async getUser(@Payload() payload: GetCompanyDto) {
  //   return await this.UserService.getUser(payload);
  // }

  @MessagePattern('create_user_db')
  async createUser(@Payload() payload: CreateUserDto) {
    console.log('DB__CONTROLLER', 'CONTROLLER__BD', payload);

    return await this.UserService.createUser(payload);
  }

  @MessagePattern('all_users_with_applications')
  async getUsersWithApplications(@Payload() payload) {
    console.log(
      "/userpermissions/getSubUsers?offset=0&limit=10&searchTerm=aa&sortby=username&sort=-1' ",
    );

    const { AdminID, offset, limit, sortby, sort, searchTerm,role } = payload;
    return await this.UserService.getUserWithApplications(
      AdminID,
      offset,
      limit,
      sortby,
      sort,
      searchTerm,
      role
    );
  }
  @MessagePattern('get_sub_users_of_company_with_type')
  async getSubUsersOfCompanyWithType(@Payload() payload) {
    console.log(payload);

    const {
      reqUser,
      offset,
      limit,
      sortby,
      sort,
      searchTerm,
      type,
      role,
      assigned,
      active,
      from,
      to,
    } = payload;
    return await this.UserService.getSubUsers(
      reqUser,
      offset,
      limit,
      sortby,
      sort,
      searchTerm,
      type,
      role,
      assigned,
      active,
      from,
      to,
    );
  }

  @MessagePattern('assign_applicant')
  async assignApplicant(@Payload() payload) {
    console.log(payload);
    const { AssignedTo, AssignedBy, ApplicantID } = payload;
    return await this.UserService.assignApplicant(
      AssignedTo,
      AssignedBy,
      ApplicantID,
    );
  }

  @MessagePattern('get_user_history')
  async getUserHistory(@Payload() payload) {
    const { userId, offset, limit, searchTerm } = payload;
    return await this.UserService.getUserHistory(
      userId,
      offset,
      limit,
      searchTerm,
    );
  }

  @MessagePattern('unassign_applicant')
  async unAssignApplicant(@Payload() payload) {
    const { ApplicantID, reqUser } = payload;
    return await this.UserService.unAssignApplicant(ApplicantID, reqUser);
  }

  @MessagePattern('deactivate_user')
  async deactivateUser(@Payload() payload) {
    const { ApplicantID, reqUser } = payload;
    return await this.UserService.deactivateUser(ApplicantID, reqUser);
  }

  @MessagePattern('activate_user')
  async activateUser(@Payload() payload) {
    // console.log(payload);
    const { ApplicantID, active, reqUser } = payload;
    return await this.UserService.activateUser(ApplicantID, active, reqUser);
  }

  @MessagePattern('get_single_user')
  async getUserById(@Payload() payload) {
    // console.log(payload);

    const { id } = payload;
    return await this.UserService.getUserByID(id);
  }

  // @MessagePattern('get_users_by_companyId_or_CreatedBy')
  // async getUserByCompanyIdOrCreatedBy(@Payload() payload){
  //   // console.log(payload);

  //   const {id} = payload
  //   return await this.UserService.getUserByCompanyAdminOrCreatedBy(id);
  // }
  @MessagePattern('get_All_user')
  async getAllUserById(@Payload() payload) {
    console.log('---==========', payload, '--===========');

    const { id } = payload;
    return await this.UserService.getAllUserByID(id);
  }
  // @MessagePattern('update_user')
  // async updateUser(@Payload() payload: UpdateCompanyDto) {
  //   return await this.UserService.updateUser(payload);
  // }

  // @MessagePattern('delete_user')
  // async deleteUser(@Payload() payload: DeleteCompanyDto) {
  //   return await this.UserService.deleteUser(payload);
  // }

  // @MessagePattern('save_personal_info')
  // async postPersonalInfo(@Payload() payload: any) {
  //   return await this.userService.postPersonalInfo(payload);
  // }

  // @MessagePattern('save_license_info')
  // async postLicenseInfo(@Payload() payload: any) {
  //   return await this.userService.postLicenseInfo(payload);
  // }

  @MessagePattern('get_user_profile')
  async getUser(@Payload() payload: GetUserDto) {
    return await this.UserService.getUserProfile(payload);
  }
  @MessagePattern('update_user')
  async updateUser(@Payload() payload: UpdateUserDto) {
    return await this.UserService.updateUser(payload);
  }

  @MessagePattern('check_company_short_name')
  async checkCompanyShortName(@Payload() payload: CheckCompanyDto) {
    console.log('DB__CONTROLLER', 'CONTROLLER__BD', payload);

    return await this.UserService.checkCompanyShortName(payload);
  }

  get_company;

  @MessagePattern('get_company_short_name')
  async getCompanyShortName(@Payload() payload) {
    console.log('DB__CONTROLLER', 'CONTROLLER__BD', payload);

    return await this.UserService.getCompanyShortName(payload);
  }
}
