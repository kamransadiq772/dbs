import { HttpException, Injectable, Logger } from '@nestjs/common';
import { ProfilePicRepository } from '../repositories/profile.pic.repository';

import { RpcException } from '@nestjs/microservices';
import { CreateProfilePic } from '../dto/profile-pic/create.profile.pic';

@Injectable()
export class ProfilePicService {
  constructor(private profilePicRepository: ProfilePicRepository) {}

  async create(dto: CreateProfilePic) {
    try {
      const { ...user } = dto;

      const response = await this.profilePicRepository.create({ ...user });
      return {
        data: response,
        message: 'Profile Pic Saved Successfully.',
        errors: null,
      };
    } catch (err) {
      throw new RpcException(err);
    }
  }

  async update(dto: CreateProfilePic) {
    try {
      const { userId, profilePic } = dto;

      const response = await this.profilePicRepository.findOneAndUpdate(
        { userId: userId },
        { profilePic: profilePic },
      );
      return {
        data: response,
        message: 'Profile Pic Updated Successfully.',
        errors: null,
      };
    } catch (err) {
      throw new RpcException(err);
    }
  }

  async get(userId: string) {
    try {
      return await this.profilePicRepository.findOne({
        userId: userId,
      });
    } catch (err) {
      throw new RpcException({
        statusCode : err?.statusCode ? err.statusCode : err?.status ? err.status : 400, 
        message: err?.message ? err?.message : "Bad Request",
      });
    }
  }

  async delete(userId: string) {
    try {
      const response = await this.profilePicRepository.delete({
        userId: userId,
      });
      return {
        data: response,
        message: 'Profile Pic Deleted Successfully.',
        errors: null,
      };
    } catch (err) {
      throw new RpcException(err);
    }
  }

  //   async getIndividualUser(dto: GetIndividualDto) {
  //     try {
  //       const { userId } = dto;
  //       const user = await this.individualRepository.findOne({ _id: userId });
  //       const { _id, ...data } = user;
  //       // return {
  //       //   data: Object.assign({ userId }, Object(data)),
  //       //   message: '',
  //       //   errors: null,
  //       // };

  //       return {
  //         foreName: data.foreName,
  //         surName: data.surName,
  //         DOB: data.DOB,
  //         email: data.email,
  //         userName: data.userName,
  //         gender: data?.gender,
  //         phone: data.phone,
  //         mobile: data.mobile,
  //         nationality: data?.nationality,
  //         addressFirstLine: data?.addressFirstLine,
  //         addressSecondLine: data?.addressSecondLine,
  //         country: data?.country,
  //         townCity: data?.townCity,
  //         postCode: data.postCode,
  //         userType: data?.userType,
  //         rightToWork: data?.rightToWork,
  //         profilePic: data?.profilePic,
  //       };
  //     } catch (err) {
  //       throw new RpcException(err);
  //     }
  //   }

  //   async createIndividualUser(dto: CreateIndividualDto) {
  //     try {
  //       const { userId, ...user } = dto;

  //       await this.individualRepository.create({ _id: userId, ...user });
  //       return {
  //         data: null,
  //         message: 'User created successfully.',
  //         errors: null,
  //       };
  //     } catch (err) {
  //       throw new RpcException(err);
  //     }
  //   }

  //   async updateIndividualUser(dto: UpdateIndividualDto) {
  //     try {
  //       const { userId, ...user } = dto;
  //       await this.individualRepository.findOneAndUpdate({ _id: userId }, user);
  //       return {
  //         data: null,
  //         message: 'User updated successfully.',
  //         errors: null,
  //       };
  //     } catch (err) {
  //       throw new RpcException(err);
  //     }
  //   }

  //   async deleteIndividualUser(dto: DeleteIndividualDto) {
  //     try {
  //       const { userId } = dto;
  //       await this.individualRepository.delete({ _id: userId });
  //       return {
  //         data: null,
  //         message: 'User deleted successfully.',
  //         errors: null,
  //       };
  //     } catch (err) {
  //       throw new RpcException(err);
  //     }
  //   }
}
