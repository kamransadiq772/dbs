import { Controller, Logger, Req } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import {
  CreateIndividualDto,
  DeleteIndividualDto,
  GetIndividualDto,
  UpdateIndividualDto,
  ListIndividualsDto,
  CheckIndividualDto,
} from '../dto/individual-user';
import { IndividualService } from '../services/individual.service';

@Controller()
export class IndividualController {
  constructor(private readonly individualService: IndividualService) {}

  @MessagePattern('list_individuals')
  async listUsers(payload: ListIndividualsDto) {
    return await this.individualService.listIndividualUsers(payload);
  }

  @MessagePattern('get_individual')
  async getUser(@Payload() payload: GetIndividualDto) {
    return await this.individualService.getIndividualUser(payload);
  }

  @MessagePattern('create_individual')
  async createUser(@Payload() payload: CreateIndividualDto) {
    return await this.individualService.createIndividualUser(payload);
  }

  @MessagePattern('update_individual')
  async updateUser(@Payload() payload: UpdateIndividualDto) {
    return await this.individualService.updateIndividualUser(payload);
  }

  @MessagePattern('delete_individual')
  async deleteUser(@Payload() payload: DeleteIndividualDto) {
    return await this.individualService.deleteIndividualUser(payload);
  }

  @MessagePattern('check_individual')
  async check(@Payload() payload: CheckIndividualDto) {
    console.log('CheckIndividualCONTROLLER', payload);
    return await this.individualService.checkIndividual(payload);
  }

  // @MessagePattern('save_personal_info')
  // async postPersonalInfo(@Payload() payload: any) {
  //   return await this.userService.postPersonalInfo(payload);
  // }

  // @MessagePattern('save_license_info')
  // async postLicenseInfo(@Payload() payload: any) {
  //   return await this.userService.postLicenseInfo(payload);
  // }
}
