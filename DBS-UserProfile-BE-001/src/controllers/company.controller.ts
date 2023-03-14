import { Controller, Logger, Req } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import {
  CreateCompanyDto,
  UpdateCompanyDto,
  GetCompanyDto,
  DeleteCompanyDto,
  ListCompanysDto,
  CheckCompanyDto,
} from '../dto/company-user';
import { CompanyService } from '../services/company.service';

@Controller()
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @MessagePattern('list_companys')
  async listUsers(payload: ListCompanysDto) {
    return await this.companyService.listCompanyUsers(payload);
  }

  @MessagePattern('get_company')
  async getUser(@Payload() payload: GetCompanyDto) {
    return await this.companyService.getCompanyUser(payload);
  }

  @MessagePattern('create_company')
  async createUser(@Payload() payload: CreateCompanyDto) {
    return await this.companyService.createCompanyUser(payload);
  }

  @MessagePattern('update_company')
  async updateUser(@Payload() payload: UpdateCompanyDto) {
    return await this.companyService.updateCompanyUser(payload);
  }

  @MessagePattern('delete_company')
  async deleteUser(@Payload() payload: DeleteCompanyDto) {
    return await this.companyService.deleteCompanyUser(payload);
  }

  @MessagePattern('check_company')
  async check(@Payload() payload: CheckCompanyDto) {
    console.log('CheckCompanyCONTROLLER', payload);
    return await this.companyService.checkCompany(payload);
  }

  @MessagePattern('check_company_forgot_passowrd')
  async checkCompanyForgotPassword(@Payload() payload: CheckCompanyDto) {
    console.log('check_company_forgot_passowrd_Controller', payload);
    return await this.companyService.checkCompanyAndUser(payload);
  }
  @MessagePattern('searchPost')
  async searchPostCode(@Payload() payload ) {
    return await this.companyService.searhLocations(payload);
  }

 
}
