import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { IndividualRepository } from '../repositories/individual.repository';
import {
  CreateIndividualDto,
  DeleteIndividualDto,
  GetIndividualDto,
  UpdateIndividualDto,
  ListIndividualsDto,
  CheckIndividualDto,
} from '../dto/individual-user';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class IndividualService {
  constructor(private individualRepository: IndividualRepository) {}

  async listIndividualUsers(dto: ListIndividualsDto) {
    try {
      let users = await this.individualRepository.find();
      users = users.map((user) => {
        const { _id: userId, ...data } = user;
        return Object.assign({ userId }, Object(data));
      });
      return {
        data: users,
        message: '',
        errors: null,
      };
    } catch (err) {
      throw new RpcException(err);
    }
  }

  async getIndividualUser(dto: GetIndividualDto) {
    try {
      const { userId } = dto;
      const user = await this.individualRepository.findOne({ _id: userId });
      const { _id, ...data } = user;
      // return {
      //   data: Object.assign({ userId }, Object(data)),
      //   message: '',
      //   errors: null,
      // };

      return {
        foreName: data.foreName,
        surName: data.surName,
        DOB: data.DOB,
        email: data.email,
        userName: data.userName,
        gender: data?.gender,
        phone: data.phone,
        mobile: data.mobile,
        nationality: data?.nationality,
        addressFirstLine: data?.addressFirstLine,
        addressSecondLine: data?.addressSecondLine,
        country: data?.country,
        townCity: data?.townCity,
        postCode: data.postCode,
        userType: data?.userType,
        rightToWork: data?.rightToWork,
      };
    } catch (err) {
      throw new RpcException(err);
    }
  }

  async createIndividualUser(dto: CreateIndividualDto) {
    try {
      const { userId, ...user } = dto;

      await this.individualRepository.create({ _id: userId, ...user });
      return {
        data: null,
        message: 'User created successfully.',
        errors: null,
      };
    } catch (err) {
      throw new RpcException(err);
    }
  }

  async updateIndividualUser(dto: UpdateIndividualDto) {
    try {
      const { userId, ...user } = dto;
      const response = await this.individualRepository.findOneAndUpdate(
        { _id: userId },
        user,
      );
      return {
        message: 'User Updated Successfully',
        statusCode: 200,
        user: { ...response },
        errors: null,
      };
    } catch (err) {
      throw new RpcException(err);
    }
  }

  async deleteIndividualUser(dto: DeleteIndividualDto) {
    try {
      const { userId } = dto;
      await this.individualRepository.delete({ _id: userId });
      return {
        data: null,
        message: 'User deleted successfully.',
        errors: null,
      };
    } catch (err) {
      throw new RpcException(err);
    }
  }

  async checkIndividual(dto: CheckIndividualDto) {
    try {
      const { email } = dto;
      const response = await this.individualRepository.aggregate([
        {
          $match: {
            email: email,
          },
        },
      ]);
      console.log('response', response);
      if (response.length === 0) {
        throw new BadRequestException('Individual Not Found');
      }
      return {
        data: null,
        message: '',
        errors: null,
      };
    } catch (err) {
      throw new RpcException(err);
    }
  }

  // async postPersonalInfo(params: any) {
  //   try {
  //     const { userId, ...user } = params.dto;
  //     const reqUser = params.user;
  //     let dbUser = await this.userRepository.findOne({ _id: userId });
  //     dbUser = {...dbUser, ...user};

  //     if(reqUser.roles.includes("HOST")){
  //       const completion = await this.profileCompletion(dbUser.profileCompletion, 'personalInfo')
  //       dbUser.overalProfileCompletion = completion.overall;
  //       dbUser.profileCompletion = completion.profileCompletion;
  //       if(completion.hostConfirmed == true){
  //         dbUser.isHostConfirmed = true;
  //       }
  //     }
  //     Logger.log(dbUser);
  //     await this.userRepository.findOneAndUpdate({_id: dbUser._id}, dbUser);
  //     return {
  //       error: null,
  //       message: 'User personal info saved',
  //       data: null,
  //     };
  //   } catch (e) {
  //     return e.message;
  //   }
  // }

  // async postLicenseInfo(params: any) {
  //   try {
  //     const dto = params.dto;
  //     const reqUser = params.user;
  //     let dbUser = await this.userRepository.findOne({ _id: reqUser.userId });
  //     dbUser.license = dto;

  //     const completion = await this.profileCompletion(dbUser.profileCompletion, 'licenses')
  //     dbUser.overalProfileCompletion = completion.overall;
  //     dbUser.profileCompletion = completion.profileCompletion;
  //     if(completion.hostConfirmed == true){
  //       dbUser.isHostConfirmed = true;
  //     }
  //     await this.userRepository.findOneAndUpdate({_id: dbUser._id}, dbUser);
  //     return {
  //       error: null,
  //       message: 'Host license info saved',
  //       data: null,
  //     };
  //   } catch (e) {
  //     return e.message;
  //   }
  // }

  // private async profileCompletion(profile: any, type: string){
  //   let overall = 0;
  //   const profileCompletion = {
  //     personalInfo: {required: true, percentage: 25, completed: profile?.personalInfo?.completed || false},
  //     licenses: {required: true, percentage: 25, completed: profile?.licenses?.completed || false},
  //     trainings: {required: false, percentage: 25, completed: profile?.trainings?.completed || false},
  //     cuisines: {required: false, percentage: 25, completed: profile?.cuisines?.completed || false}
  //   };
  //   for (const key in profileCompletion) {
  //     if(key == type){
  //       profileCompletion[key].completed = true;
  //     }
  //     if(profileCompletion[key].completed == true){
  //       overall += profileCompletion[key].percentage;
  //     }

  //   }
  //   return {
  //     overall,
  //     profileCompletion,
  //     hostConfirmed: profileCompletion.personalInfo.completed == true && profileCompletion.licenses.completed == true ? true: false,
  //   }
  // }
}
