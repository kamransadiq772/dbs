import { Controller, Logger, Req } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CreateProfilePic } from '../dto/profile-pic/create.profile.pic';
import { ProfilePicService } from '../services/profile.pic.service';

@Controller()
export class ProfilePicController {
  constructor(private readonly profilePicService: ProfilePicService) {}

  @MessagePattern('upload_profile_pic')
  async create(@Payload() payload: CreateProfilePic) {
    console.log('CONTROLLER__PROFILE_PIC', payload);
    return await this.profilePicService.create(payload);
  }

  @MessagePattern('update_profile_pic')
  async update(@Payload() payload: CreateProfilePic) {
    console.log('CONTROLLER__PROFILE_PIC', payload);
    return await this.profilePicService.update(payload);
  }

  @MessagePattern('get_profile_pic')
  async get(@Payload() userId: string) {
    console.log('CONTROLLER__PROFILE_PIC', userId);
    return await this.profilePicService.get(userId);
  }

  @MessagePattern('delete_profile_pic')
  async delete(@Payload() userId: string) {
    console.log('CONTROLLER__PROFILE_PIC', userId);
    return await this.profilePicService.delete(userId);
  }
}
