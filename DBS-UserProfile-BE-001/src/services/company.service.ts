import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { CompanyRepository } from '../repositories/company.repository';
import { UserRepository } from 'src/repositories/user.repository';
import {
  CreateCompanyDto,
  UpdateCompanyDto,
  DeleteCompanyDto,
  GetCompanyDto,
  ListCompanysDto,
  CheckCompanyDto,
} from '../dto/company-user';
import { RpcException } from '@nestjs/microservices';
import { UserService } from './user.service';
import { catchError } from 'rxjs/internal/operators/catchError';
import { firstValueFrom } from 'rxjs/internal/firstValueFrom';
import { HttpService } from '@nestjs/axios';

// @InjectModel('Cities') private readonly cityModel: Model<ICitySchema>,
@Injectable()
export class CompanyService {
  constructor(
    private companyRepository: CompanyRepository,
    private userService: UserService,
    private httpService: HttpService,
  ) {}

  // constructor(private companyRepository: CompanyRepository,
  //    private httpService: HttpService) {}

  async listCompanyUsers(dto: ListCompanysDto) {
    try {
      let users = await this.companyRepository.find();
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

  async getCompanyUser(dto: GetCompanyDto) {
    try {
      const { userId } = dto;
      const user = await this.companyRepository.findOne({ _id: userId });
      const { _id, ...data } = user;
      // return {
      //   data: Object.assign({ userId }, Object(data)),
      //   message: '',
      //   errors: null,
      // };

     

      if (data.yourDetails.adminUser === true) {
        return {
          companyName: data.companyDetails.companyName,
          shortName: data.companyDetails.shortName,
          companyNumber: data.companyDetails.companyNumber,
          organizationType: data.companyDetails.organizationType,
          country: data.companyDetails.country,
          email: data.companyAdminUser.email,
          phone: data.companyDetails.phone,
          mobile: data.companyDetails.mobile,
          foreName: data.companyAdminUser.foreName,
          surName: data.companyAdminUser.surName,
          gender: data.yourDetails.gender,
          postCode: data.yourDetails.postCode,
          adminUser: data.yourDetails.adminUser,
          foreNameAdmin: data.companyAdminUser.foreName,
          surNameAdmin: data.companyAdminUser.surName,
          emailAdmin: data.companyAdminUser.email,
          mobileAdmin: data.companyAdminUser.mobile,
          postCodeAddress: data.companyDetails.postCode,
          addressLine1: data.companyDetails.addressLine1,
          addressLine2: data.companyDetails.addressLine2,
          townOrCity: data.companyDetails.townOrCity,
          profilePic: data.companyDetails.profilePic,
          defaultRole: data.defaultRole,
        };
      }
      return {
        companyName: data.companyDetails.companyName,
        shortName: data.companyDetails.shortName,
        companyNumber: data.companyDetails.companyNumber,
        organizationType: data.companyDetails.organizationType,
        country: data.companyDetails.country,
        email: data.companyDetails.email,
        phone: data.companyDetails.phone,
        mobile: data.companyDetails.mobile,
        foreName: data.yourDetails.foreName,
        surName: data.yourDetails.surName,
        gender: data.yourDetails.gender,
        postCode: data.yourDetails.postCode,
        adminUser: data.yourDetails.adminUser,
        foreNameAdmin: data.companyAdminUser.foreName,
        surNameAdmin: data.companyAdminUser.surName,
        emailAdmin: data.companyAdminUser.email,
        mobileAdmin: data.companyAdminUser.mobile,
        postCodeAddress: data.companyDetails.postCode,
        addressLine1: data.companyDetails.addressLine1,
        addressLine2: data.companyDetails.addressLine2,
        townOrCity: data.companyDetails.townOrCity,
        profilePic: data.companyDetails.profilePic,
        defaultRole: data.defaultRole,
      };
    } catch (err) {
      throw new RpcException(err);
    }
  }

  async createCompanyUser(dto: CreateCompanyDto) {
    try {
      // const {
      //   userId,
      //   companyDetails,
      //   yourDetails,
      //   companyAdminUser,
      //   companyPreferences,
      //   defaultRole,
      // } = dto;

      // await this.companyRepository.create({
      //   _id: userId,
      //   companyDetails,
      //   yourDetails,
      //   companyAdminUser,
      //   companyPreferences,
      //   defaultRole,
      // });
      const {
        userId,
        companyDetails,
        yourDetails,
        companyAdminUser,
        companyPreferences,
        defaultRole,
      } = dto;
      await this.companyRepository.create({
        _id: userId,
        companyDetails,
        yourDetails,
        companyAdminUser,
        companyPreferences,
        defaultRole,
      });
      return {
        data: null,
        message: 'User created successfully.',
        errors: null,
      };
    } catch (err) {
      throw new RpcException(err);
    }
  }

  async updateCompanyUser(dto: UpdateCompanyDto) {
    try {
      const { userId, ...user } = dto;
      await this.companyRepository.findOneAndUpdate({ _id: userId }, user);
      return {
        message: 'User updated successfully.',
        statusCode: 200,
        companyDetails: {
          companyName: user.companyDetails.companyName,
          shortName: user.companyDetails.shortName,
          companyNumber: user.companyDetails.companyNumber,
          organizationType: user.companyDetails.organizationType,
          postCodeAddress: user.companyDetails.postCode,
          addressLine1: user.companyDetails.addressLine1,
          addressLine2: user.companyDetails.addressLine2,
          townOrCity: user.companyDetails.townOrCity,
          country: user.companyDetails.country,
          email: user.companyDetails.email,
          phone: user.companyDetails.phone,
          mobile: user.companyDetails.mobile,
        },
        yourDetails: {
          foreName: user.yourDetails.foreName,
          surName: user.yourDetails.surName,
          gender: user.yourDetails.gender,
          postCode: user.yourDetails.postCode,
          adminUser: user.yourDetails.adminUser,
        },
        companyAdminUser: {
          foreNameAdmin: user.companyAdminUser.foreName,
          surNameAdmin: user.companyAdminUser.surName,
          emailAdmin: user.companyAdminUser.email,
          mobileAdmin: user.companyAdminUser.mobile,
        },

        errors: null,
      };
    } catch (err) {
      throw new RpcException(err);
    }
  }

  async deleteCompanyUser(dto: DeleteCompanyDto) {
    try {
      const { userId } = dto;
      await this.companyRepository.delete({ _id: userId });
      return {
        data: null,
        message: 'User deleted successfully.',
        errors: null,
      };
    } catch (err) {
      throw new RpcException(err);
    }
  }

  async checkCompany(dto: CheckCompanyDto) {
    try {
      const { email, shortCompanyName } = dto;
      // const response = await this.companyRepository.aggregate([
      //   {
      //     $match: {
      //       'companyDetails.shortName': shortCompanyName,
      //     },
      //   },
      //   {
      //     $match: {
      //       'companyDetails.email': email,
      //     },
      //   },
      // ]);

      const response = await this.companyRepository.find({
        'companyDetails.shortName': shortCompanyName,
        'companyDetails.email': email,
      });

      console.log('response', response);

      if (response.length === 0) {
        const res = await this.companyRepository.find({
          'companyDetails.shortName': shortCompanyName,
          'companyAdminUser.email': email,
        });

        console.log('res', res);

        if (res.length === 0) {
          throw new BadRequestException('Company Not Found');
        }
      }
      return {
        data: null,
        message: 'Valid Company',
        errors: null,
      };
    } catch (err) {
      throw new RpcException(err);
    }
  }

  async checkCompanyAndUser(dto: CheckCompanyDto) {
    try {
      const { email, shortCompanyName } = dto;
      const response = await this.companyRepository.aggregate([
        {
          $match: {
            'companyDetails.shortName': shortCompanyName,
            'companyDetails.email': email,
          },
        },
      ]);
      console.log('response', response);

      if (response.length === 0) {
        const res = await this.userService.checkCompanyShortName(dto);

        console.log(res, 'res');

        if (res[0].message === 'User_Not_Found') {
          throw new BadRequestException('Company Not Found');
        }

        return {
          data: null,
          message: 'Valid User',
          errors: null,
        };
      }
      return {
        data: null,
        message: 'Valid User',
        errors: null,
      };
    } catch (err) {
      throw new RpcException((err.message = 'Internal Server Error'));
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

  async searhLocations(search: any) {
    try {
      console.log(search, 'aaaaaaaaaaa');
      const { data } = await firstValueFrom(
        this.httpService
          .post(
            `https://api.getaddress.io/autocomplete/${encodeURIComponent(
              search.Search,
            )}`,
            {
              all: true,
              template: '{formatted_address}{postcode,, }{postcode}',
              top: 15,
              fuzzy: true,
            },
            {
              params: {
                'api-key':
                  'dtoken_hEDzcyiWMr3VH8UHWQbemMXEyzLv80GYt7qADuGF9UFXBknndyBFhY1eyhADhPZyOAqSnmU_97SgLy7xxoQq5sXVCErf1TOCWwnjS3ZhPpMcF0iuViq-_kl3lOcvSyuqlJIRrGVIg-3_aqiqgPipYk745oaySDWP',
              },
              headers: {
                origin: 'https://getaddress.io',
                // referer: 'https://getaddress.io/',
                // 'sec-fetch-dest': 'empty',
                // 'sec-fetch-mode': 'cors',
                // 'sec-fetch-site': 'same-site',
                'user-agent':
                  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36',
              },
            },
          )
          .pipe(
            catchError((error: any) => {
              throw 'Searching server issue: Kindly contact the Admin.';
            }),
          ),
      );
      return {
        data: [
          ...data.suggestions?.map((e) => ({
            loctaionId: e.id,
            locationAddress: e.address.startsWith('Unit ')
              ? e.address.replace('Unit ', '')
              : e.address,
          })),
        ],
        message: 'Got Locations successfully.',
        errors: null,
      };
    } catch (err) {
      throw new RpcException(err);
    }
  }
}
