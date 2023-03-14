import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException
} from '@nestjs/common';
import { UserRepository } from '../repositories/user.repository';
import { UserPermissionRepository } from '../repositories/user-permission.repository';
import { RoleRepository } from '../repositories/role.repository';
import {
  checkCompanyShortName,
  CreateUserDto,
  GetUserDto,
  UpdateUserDto,
} from '../dto/user.ts';
import { RpcException } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../schemas/user.schema';
import { UserHistory } from '../schemas/userhistory.schema';
import { Company, CompanySchema } from '../schemas/company.schema';
import { Model } from 'mongoose';
import { CheckCompanyDto } from '../dto/company-user';
@Injectable()
export class UserService {
  constructor(
    private userRepository: UserRepository,
    private userPermissionRepository: UserPermissionRepository,
    private roleRepository: RoleRepository,
    //   @InjectModel(User.name) private userModel: Model<User>
    // ) { }
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(UserHistory.name) private userhistoryModel: Model<UserHistory>,
    @InjectModel(Company.name) private comapany: Model<Company>,
  ) { }

  // async listUsers(dto: ListCompanysDto) {
  //   try {
  //     let users = await this.companyRepository.find();
  //     users = users.map((user) => {
  //       const { _id: userId, ...data } = user;
  //       return Object.assign({ userId }, Object(data));
  //     });
  //     return {
  //       data: users,
  //       message: '',
  //       errors: null,
  //     };
  //   } catch (err) {
  //     throw new RpcException(err);
  //   }
  // }

  // async getUser(dto: GetCompanyDto) {
  //   try {
  //     const { userId } = dto;
  //     const user = await this.companyRepository.findOne({ _id: userId });
  //     const { _id, ...data } = user;
  //     return {
  //       data: Object.assign({ userId }, Object(data)),
  //       message: '',
  //       errors: null,
  //     };
  //   } catch (err) {
  //     throw new RpcException(err);
  //   }
  // }

  async createUser(dto: CreateUserDto) {
    try {
      //       const { companyAdminId, usersId, AllUser, UserDetails, ApplicantBasic, defaultRole } = dto
      //       console.log(dto, "newwwww");

      //       const a = await this.userRepository.create({ companyAdminId, usersId, AllUser, UserDetails, ApplicantBasic, defaultRole });
      //       console.log("DB__SERVICS----", defaultRole, "----DB__SERVICS");
      //       // const { userId, role } = dto
      //       const getRole = await this.roleRepository.find({ role: defaultRole })
      //       //  console.log("servicePERMISSION----",getRole,"-----ServicePERMISSION");
      //       const [aRole]: any = getRole
      //       //  console.log("GETROLE----",[aRole],"-----GETROLE");
      //       const allowedPermission: any = aRole.defaultPermissions
      //       //  console.log("allowedPermissionallowedPermission------",allowedPermission,"-----allowedPermissionallowedPermission");
      //       const c = await this.userPermissionRepository.create({ companyAdminId, usersId, role: defaultRole, allowedPermissions: allowedPermission });
      // =======
      // const {
      //   companyAdminId,
      //   userId,
      //   AllUser,
      //   UserDetails,
      //   ApplicantBasic,
      //   defaultRole,
      // } = dto;
      console.log(dto, 'newwwww');
      const {
        CreatedBy,
        createdByRole,
        userId,
        AllUser,
        UserDetails,
        ApplicantBasic,
        defaultRole,
        AssignedBy,
        AssignedTo,
      } = dto;
      // console.log(dto, "newwwww");
      console.log(createdByRole, ' userRoles', CreatedBy);

      var cadminid;
      var act;

      if (createdByRole[0] != 'COMPANY_ADMIN') {
        const requser = await this.userModel.findOne({ userId: CreatedBy });
        console.log('requser----', requser, ' ------requser');
        cadminid = requser.companyAdminId;
        act = false;
        console.log(act, ' not admin acitve');
      } else {
        cadminid = CreatedBy;
        act = true;
        console.log(act, ' admin acitve');
      }

      AllUser.Active = act;
      console.log(AllUser.Active);

      // const companyAdminId = createdByRole === "COMPANY_ADMIN" ? CreatedBy : requser.companyAdminId;

      const a = await this.userRepository.create({
        companyAdminId: cadminid,
        CreatedBy,
        userId,
        AllUser,
        UserDetails,
        ApplicantBasic,
        defaultRole,
      });
      // console.log("DB__SERVICS----", defaultRole, "----DB__SERVICS");
      // const { userId, role } = dto
      const getRole = await this.roleRepository.find({ role: defaultRole });
      //  console.log("servicePERMISSION----",getRole,"-----ServicePERMISSION");
      // const [aRole]: any = getRole;
      // //  console.log("GETROLE----",[aRole],"-----GETROLE");
      // const allowedPermission: any = aRole.defaultPermissions;
      // //  console.log("allowedPermissionallowedPermission------",allowedPermission,"-----allowedPermissionallowedPermission");
      // const c = await this.userPermissionRepository.create({
      //   companyAdminId,
      //   userId,
      //   role: defaultRole,
      //   allowedPermissions: allowedPermission,
      // });

      const [aRole]: any = getRole;
      console.log('GETROLE----', [aRole], '-----GETROLE');
      const allowedPermission: any = aRole.defaultPermissions;
      console.log(
        'allowedPermissionallowedPermission------',
        allowedPermission,
        '-----allowedPermissionallowedPermission',
      );
      const c = await this.userPermissionRepository.create({
        companyAdminId: cadminid,
        CreatedBy,
        userId,
        role: defaultRole,
        allowedPermissions: allowedPermission,
      });
      //   console.log("--------USERPERMISSION------",c,"");
      let action = `Created By ${createdByRole[0]}`;
      const userhistory = await this.userhistoryModel.create({
        user: a,
        CreatedBy: CreatedBy,
        action: action,
      });
      return {
        data: null,
        message: 'User created successfully.',
        errors: null,
      };
    } catch (error) {
      console.log(error);
      throw new RpcException({
        statusCode: error?.statusCode ? error.statusCode : error?.status ? error.status : 400,
        message: error?.message ? error?.message : "Bad Request",
        stack: error ? error : null
      })
    }
  }

  // async getUserWithApplications(dto) {
  //   const { AdminID, offset, limit } = dto

  //   try {
  //     // console.log(dto);

  //     const res = await this.userModel.aggregate([
  //       {
  //         $match: { companyAdminId: AdminID }
  async getUserWithApplications(
    AdminID,
    offset = 0,
    limit = 10,
    sortby = 'createdAt',
    sort: string = '-1',
    searchTerm: string = '',
    role:string
  ) {
    // const { AdminID, offset, limit, sortby , sort ,searchTerm } = dto
    // console.log(typeof(searchTerm),typeof(sortby),typeof(sort));
    // console.log(searchTerm.length,sortby.length,sort.length);

    // console.log(searchTerm,sort,sortby);

    try {
      console.log(AdminID, offset, limit, sortby, sort, searchTerm,role)

      let userId;

      if (role != 'COMPANY_ADMIN') {
        const user = await this.userModel.findOne({ userId: AdminID });
        userId = user.companyAdminId;
      } else {
        userId = AdminID;
      }
      console.log(userId);
      

      const sterm = `.*${searchTerm}.*`;
      sort = sort.length === 0 ? '-1' : sort;
      sortby = sortby.length === 0 ? 'createdAt' : sortby;

      const res = await this.userModel.aggregate([
        {
          $search: {
            index: 'userSearch',
            regex: {
              query: sterm,
              path: { wildcard: '*' },
              allowAnalyzedField: true,
            },
          },
        },
        {
          $match: {
            companyAdminId: userId,
            'AllUser.userType': {
              $in: ['applicant', 'APPLICANT', 'Applicant'],
            },
          },
        },
        {
          $lookup: {
            from: 'applications',
            localField: 'userId',
            foreignField: 'ApplicantId',
            as: 'application',
            pipeline: [
              {
                $sort: {
                  createdAt: -1,
                },
              },
              {
                $skip: 0,
              },
              {
                $limit: 1,
              },
            ],
          },
        },
        {
          $unwind: {
            path: '$application',
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $project: {
            _id: '$_id',
            userId: '$userId',
            userType: '$AllUser.userType',
            forename: '$AllUser.forename',
            surname: '$AllUser.surname',
            username: '$AllUser.username',
            dateOfBirth: '$AllUser.dateOfBirth',
            phone: '$AllUser.phone',
            mobile: '$AllUser.mobile',
            email: '$AllUser.email',
            postCode: '$AllUser.postCode',
            recentAppStatus: {
              $cond: {
                if: {
                  $and: [
                    {
                      $eq: [
                        {
                          $type: '$application',
                        },
                        'object',
                      ],
                    },
                  ],
                },
                then: '$application.ApplicationState.status',
                else: 'Not Started',
              },
            },
            applicationType: {
              $cond: {
                if: {
                  $and: [
                    {
                      $eq: [
                        {
                          $type: '$application',
                        },
                        'object',
                      ],
                    },
                  ],
                },
                then: '$application.EmploymentDetails.applicationType',
                else: 'Not Started',
              },
            },
            userWillPay: 'Yes',
            price: '500$',
          },
        },
        {
          $sort: <any>{
            [sortby]: Number(sort),
          },
        },
        {
          $facet: {
            total: [
              {
                $count: 'total',
              },
            ],
            data: [
              // {
              //   $addFields: {
              //     _id: '$_id',
              //   },
              // },
            ],
          },
        },
        {
          $unwind: '$total',
        },
        {
          $project: {
            data: {
              $slice: [
                '$data',
                Number(offset),
                {
                  $ifNull: [Number(limit), '$total.count'],
                },
              ],
            },
            meta: {
              total: '$total.total',
              page: {
                $literal: Number(offset) / Number(limit) + 1,
              },
              pages: {
                $ceil: {
                  $divide: ['$total.total', Number(limit)],
                },
              },
            },
          },
        },
      ]);

      // if (!res[0]?.data) {
      //   throw new NotFoundException();
      // }

      const dat = {
        data: res[0]?.data ? res[0]?.data : [],
        meta: res[0]?.meta ? res[0]?.meta : {},
      };
      return dat;
    } catch (error) {
      console.log(error);
      throw new RpcException({
        statusCode: error?.statusCode ? error.statusCode : error?.status ? error.status : 400,
        message: error?.message ? error?.message : "Bad Request",
        stack: error ? error : null
      })
    }
  }

  async getSubUsers(
    reqUser,
    offset = 0,
    limit = 10,
    sortby = 'createdAt',
    sort: string = '-1',
    searchTerm: string = '',
    type: Array<string>,
    role: string,
    assigned = undefined,
    active = undefined,
    from = 100000,
    to = 2670864726,
  ) {
    try {
      const f = new Date(from * 1000);
      const t = new Date(to * 1000);
      let userId;
      // console.log(active);
      if (role != 'COMPANY_ADMIN') {
        const user = await this.userModel.findOne({ userId: reqUser });
        userId = user.companyAdminId;
      } else {
        userId = reqUser;
      }

      active =
        active === undefined
          ? { $in: [true, false, null, undefined, ''] }
          : active == 'true'
            ? { $in: [true] }
            : { $in: [false] };
      assigned =
        assigned === undefined
          ? { $in: [true, false, null, undefined, ''] }
          : assigned == 'true'
            ? { $in: [true] }
            : { $in: [false, null, undefined, ''] };

      // searchTerm = searchTerm === '' ? '' : searchTerm.toLowerCase()
      const sterm = `.*${searchTerm}.*`;
      sort = sort.length === 0 ? '-1' : sort;
      sortby = sortby.length === 0 ? 'createdAt' : sortby;

      const nType = { $in: [...type] };

      console.log(
        reqUser,
        userId,
        offset,
        limit,
        sortby,
        sort,
        searchTerm,
        nType,
        role,
        active,
      );
      // console.log(active, "active");

      console.log("I am Here!!");
      

      const response = await this.userModel.aggregate([
        {
          $search: {
            index: 'userSearch',
            regex: {
              query: sterm,
              path: { wildcard: '*' },
              allowAnalyzedField: true,
            },
          },
        },
        {
          $match: {
            companyAdminId: userId,
            createdAt: { $gte: f, $lt: t },
            'AllUser.userType': nType,
            'AllUser.Active': active,
            Assigned: assigned,
          },
        },
        {
          $lookup: {
            from: 'userpermissions',
            localField: 'CreatedBy',
            foreignField: 'userId',
            as: 'user',
            pipeline: [
              {
                $project: {
                  _id: 0,
                  role: 1,
                },
              },
            ],
          },
        },
        {
          $lookup: {
            from: 'users',
            localField: 'CreateBy',
            foreignField: 'userId',
            as: 'CreatedByUser',
            pipeline: [
              { $limit: 1 },
              {
                $project: {
                  _id: 0,
                  forename: '$AllUser.forename',
                  surname: '$AllUser.surname',
                  username: '$AllUser.username',
                },
              },
            ],
          },
        },
        {
          $lookup: {
            from: 'companies',
            localField: 'CreateBy',
            foreignField: '_id',
            as: 'CreatedByCompany',
            pipeline: [
              { $limit: 1 },
              {
                $project: {
                  _id: 0,
                  forename: '$yourDetails.foreName',
                  surname: '$yourDetails.surName',
                },
              },
            ],
          },
        },
        {
          $addFields: {
            createdByData: {
              $setUnion: ['$CreatedByUser', '$CreatedByCompany'],
            },
          },
        },
        {
          $unwind: {
            path: '$createdByData',
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $project: {
            // _id: "$_id",
            _id: 0,
            userId: '$userId',
            companyAdminId: '$companyAdminId',
            userType: '$AllUser.userType',
            forename: '$AllUser.forename',
            surname: '$AllUser.surname',
            username: '$AllUser.username',
            dateOfBirth: '$AllUser.dateOfBirth',
            phone: '$AllUser.phone',
            mobile: '$AllUser.mobile',
            email: '$AllUser.email',
            postCode: '$AllUser.postCode',
            Active: '$AllUser.Active',
            Assigned: 1,
            AssignedBy: 1,
            AssignedTo: 1,
            CreatedBy: 1,
            createdAt: 1,
            userRole: { $arrayElemAt: ['$user.role', 0] },
            defaultRole: 1,
            createdByData: 1
          },
        },
        {
          $sort: <any>{
            [sortby]: Number(sort),
          },
        },
        {
          $unwind: {
            path: '$company',
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $unwind: {
            path: '$user',
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $facet: {
            total: [
              {
                $count: 'total',
              },
            ],
            data: [],
          },
        },
        {
          $unwind: '$total',
        },
        {
          $project: {
            data: {
              $slice: [
                '$data',
                Number(offset),
                {
                  $ifNull: [Number(limit), '$total.count'],
                },
              ],
            },
            meta: {
              total: '$total.total',
              page: {
                $literal: Number(offset) / Number(limit) + 1,
              },
              pages: {
                $ceil: {
                  $divide: ['$total.total', Number(limit)],
                },
              },
            },
          },
        },
      ]);

      // if (!response[0]?.data) {
      //   throw new NotFoundException();
      // }

      console.log(response, 'response');

      return {
        data: response[0]?.data ? response[0]?.data : [],
        meta: response[0]?.meta ? response[0]?.meta : {},
      };
    } catch (error) {
      console.log(error);
      throw new RpcException({
        statusCode: error?.statusCode ? error.statusCode : error?.status ? error.status : 400,
        message: error?.message ? error?.message : "Bad Request",
        stack: error ? error : null
      })
    }
  }

  async assignApplicant(AssignedTo, AssignedBy, ApplicantID) {
    try {
      const check = await this.userModel.findOne({ userId: AssignedTo });

      console.log(check, 'check');

      if (check.AllUser.Active === false) {
        throw new BadRequestException('Evidence Checker is not Active');
      }

      const user = await this.userModel.updateMany(
        { userId: { $in: [...ApplicantID] } },
        {
          $set: {
            AssignedBy: AssignedBy,
            AssignedTo: AssignedTo,
            Assigned: true,
          },
        },
        { new: true, lean: true },
      );

      // let action = 'Assigned to Evedence Checker';
      // const userhistory = await this.userhistoryModel.create({
      //   user: user,
      //   CreatedBy: AssignedBy,
      //   action: action,
      // });
      return user;
    } catch (error) {
      throw new RpcException({
        statusCode: error?.statusCode ? error.statusCode : error?.status ? error.status : 400,
        message: error?.message ? error?.message : "Bad Request",
        stack: error ? error : null
      })
    }
  }

  async unAssignApplicant(ApplicantID, reqUser) {
    try {
      const user = await this.userModel.findOneAndUpdate(
        { userId: ApplicantID },
        {
          $set: { AssignedBy: '', AssignedTo: '', Assigned: false },
        },
        { new: true },
      );
      let action = 'Applicant UnAssigned';
      const userhistory = await this.userhistoryModel.create({
        user: user,
        CreatedBy: reqUser,
        action: action,
      });
      return user;
    } catch (error) {
      throw new RpcException({
        statusCode: error?.statusCode ? error.statusCode : error?.status ? error.status : 400,
        message: error?.message ? error?.message : "Bad Request",
        stack: error ? error : null
      })
    }
  }

  async deactivateUser(ApplicantID, reqUser) {
    try {
      const user = await this.userModel.findOneAndUpdate(
        { userId: ApplicantID },
        {
          $set: { 'AllUser.Active': false },
        },
        { new: true },
      );
      let action = 'User is Deactivated';
      const userhistory = await this.userhistoryModel.create({
        user: user,
        CreatedBy: reqUser,
        action: action,
      });
      return user;
    } catch (error) {
      throw new RpcException({
        statusCode: error?.statusCode ? error.statusCode : error?.status ? error.status : 400,
        message: error?.message ? error?.message : "Bad Request",
        stack: error ? error : null
      })
    }
  }

  async activateUser(ApplicantID, active, reqUser) {
    console.log(ApplicantID, active, reqUser, ' activate user sevice');

    active = active == 'true' ? true : false;

    try {
      const user = await this.userModel.findOneAndUpdate(
        { userId: ApplicantID },
        {
          $set: { 'AllUser.Active': active },
        },
        { new: true },
      );
      let action = 'User is activted';
      const userhistory = await this.userhistoryModel.create({
        user: user,
        CreatedBy: reqUser,
        action: action,
      });
      return user;
    } catch (error) {
      console.log(error);
      throw new RpcException({
        statusCode: error?.statusCode ? error.statusCode : error?.status ? error.status : 400,
        message: error?.message ? error?.message : "Bad Request",
        stack: error ? error : null
      })
    }
  }

  async getUserHistory(
    userId: string,
    offset: number = 0,
    limit: number = 5,
    searchTerm: string = '',
  ) {
    try {
      searchTerm = searchTerm === '' ? '' : searchTerm.toLowerCase();
      console.log(userId, offset, limit, searchTerm);

      const response = await this.userhistoryModel.aggregate([
        {
          $match: {
            'user.userId': userId,
            $or: [
              {
                'user.AllUser.forename': { $regex: searchTerm, $options: 'i' },
              },
              {
                'user.AllUser.surname': { $regex: searchTerm, $options: 'i' },
              },
              {
                'user.AllUser.username': { $regex: searchTerm, $options: 'i' },
              },
              {
                'user.AllUser.phone': { $regex: searchTerm, $options: 'i' },
              },
              {
                'user.AllUser.mobile': { $regex: searchTerm, $options: 'i' },
              },
              {
                'user.AllUser.email': { $regex: searchTerm, $options: 'i' },
              },
              {
                'user.AllUser.postCode': { $regex: searchTerm, $options: 'i' },
              },
              {
                'user.ApplicantBasic.DisclosureType': {
                  $regex: searchTerm,
                  $options: 'i',
                },
              },
            ],
          },
        },
        {
          $lookup: {
            from: 'users',
            localField: 'user.userId',
            foreignField: 'userId',
            as: 'CreatedByUser',
            pipeline: [
              { $limit: 1 },
              {
                $project: {
                  _id: 0,
                  forename: '$AllUser.forename',
                  surname: '$AllUser.surname',
                  username: '$AllUser.username',
                },
              },
            ],
          },
        },
        {
          $lookup: {
            from: 'companies',
            localField: 'user.userId',
            foreignField: '_id',
            as: 'CreatedByCompany',
            pipeline: [
              { $limit: 1 },
              {
                $project: {
                  _id: 0,
                  forename: '$yourDetails.foreName',
                  surname: '$yourDetails.surName',
                },
              },
            ],
          },
        },
        {
          $addFields: {
            createdByData: {
              $setUnion: ['$CreatedByUser', '$CreatedByCompany'],
            },
          },
        },
        {
          $unwind: {
            path: '$createdByData',
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: 'users',
            localField: 'user.AssignedTo',
            foreignField: 'userId',
            as: 'AssignedEvedenceChecker',
            pipeline: [
              {
                $limit: 1,
              },
              {
                $project: {
                  _id: 0,
                  userType: '$AllUser.userType',
                  forename: '$AllUser.forename',
                  surname: '$AllUser.surname',
                  username: '$AllUser.username',
                },
              },
            ],
          },
        },
        {
          $unwind: {
            path: '$AssignedEvedenceChecker',
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: 'companies',
            localField: 'user.companyAdminId',
            foreignField: '_id',
            as: 'userCompany',
            pipeline: [
              { $limit: 1 },
              {
                $project: {
                  _id: 0,
                  companyName:'$companyDetails.companyName',
                  shortName:'$companyDetails.shortName',
                  forename: '$yourDetails.foreName',
                  surname: '$yourDetails.surName',
                },
              },
            ],
          },
        },
        {
          $unwind:{
            path : "$userCompany",
            preserveNullAndEmptyArrays:true
          }
        },
        {
          $facet: {
            total: [
              {
                $count: 'total',
              },
            ],
            data: [],
          },
        },
        {
          $unwind: '$total',
        },
        {
          $project: {
            data: {
              $slice: [
                '$data',
                Number(offset),
                {
                  $ifNull: [Number(limit), '$total.count'],
                },
              ],
            },
            meta: {
              total: '$total.total',
              page: {
                $literal: Number(offset) / Number(limit) + 1,
              },
              pages: {
                $ceil: {
                  $divide: ['$total.total', Number(limit)],
                },
              },
            },
          },
        },
      ]);

      // if (!response[0]?.data) {
      //   throw new NotFoundException();
      // }

      return {
        data: response[0]?.data ? response[0]?.data : [],
        meta: response[0]?.meta ? response[0]?.meta : {},
      };
    } catch (error) {
      throw new RpcException({
        statusCode: error?.statusCode ? error.statusCode : error?.status ? error.status : 400,
        message: error?.message ? error?.message : "Bad Request",
        stack: error ? error : null
      })
    }
  }

  async getUserByID(id: string) {
    try {
      // console.log(id);

      const user = await this.userModel.findOne({ userId: id });
      return user;
    } catch (error) {
      throw new RpcException({
        statusCode: error?.statusCode ? error.statusCode : error?.status ? error.status : 400,
        message: error?.message ? error?.message : "Bad Request",
        stack: error ? error : null
      })
    }
  }
  async getAllUserByID(id: string) {
    try {
      // console.log(id);
      const user = await this.userModel.findOne({ CreatedBy: id });
      return user;
    } catch (error) {
      throw new RpcException({
        statusCode: error?.statusCode ? error.statusCode : error?.status ? error.status : 400,
        message: error?.message ? error?.message : "Bad Request",
        stack: error ? error : null
      })
    }
  }

  async checkCompanyShortName(dto: CheckCompanyDto) {
    try {
      const { email, shortCompanyName } = dto;
      console.log(email, shortCompanyName, 'service');

      const data = await this.userRepository.aggregate([
        {
          $match: {
            'AllUser.email': email,
          },
        },
        {
          $lookup: {
            from: 'companies',
            localField: 'companyAdminId',
            foreignField: '_id',
            as: 'data',
          },
        },
        {
          $unwind: {
            path: '$data',
          },
        },
        {
          $project: {
            shortCompanyName: '$data.companyDetails.shortName',
          },
        },
      ]);

      console.log(data, 'data');

      if (data[0].shortCompanyName === shortCompanyName) {
        return data;
      }
      return {
        data: null,
        message: 'User_Not_Found',
        errors: null,
      };
    } catch (error) {
      throw new RpcException({
        statusCode: error?.statusCode ? error.statusCode : error?.status ? error.status : 400,
        message: error?.message ? error?.message : "Bad Request",
        stack: error ? error : null
      })
    }
  }

  async getCompanyShortName(Payload: any) {
    try {
      const { userId } = Payload;

      const data = await this.userRepository.aggregate([
        {
          $match: {
            userId: userId,
          },
        },
        {
          $lookup: {
            from: 'companies',
            localField: 'companyAdminId',
            foreignField: '_id',
            as: 'data',
          },
        },
        {
          $unwind: {
            path: '$data',
          },
        },
        {
          $project: {
            shortCompanyName: '$data.companyDetails.shortName',
          },
        },
      ]);

      console.log(data[0], 'data');

      return {
        data: data[0],
        message: '',
        errors: null,
      };
    } catch (error) {
      throw new RpcException({
        statusCode: error?.statusCode ? error.statusCode : error?.status ? error.status : 400,
        message: error?.message ? error?.message : "Bad Request",
        stack: error ? error : null
      })
    }
  }

  async getUserProfile(dto: GetUserDto) {
    try {
      const { userId } = dto;
      let user = await this.userModel.findOne({ userId: userId });

      const companyData = await this.userModel.aggregate([
        {
          $match: {
            userId: user.userId,
          },
        },
        {
          $lookup: {
            from: 'companies',
            localField: 'companyAdminId',
            foreignField: '_id',
            as: 'data',
          },
        },
        {
          $unwind: {
            path: '$data',
          },
        },
        {
          $project: {
            data: '$data',
          },
        },
      ]);

      console.log(companyData[0]);

      return {
        companyName: companyData[0].data.companyDetails.companyName,
        shortName: companyData[0].data.companyDetails.shortName,
        companyNumber: companyData[0].data.companyDetails.companyNumber,
        organizationType: companyData[0].data.companyDetails.organizationType,
        country: companyData[0].data.companyDetails.country,
        email: companyData[0].data.companyDetails.email,
        phone: companyData[0].data.companyDetails.phone,
        mobile: companyData[0].data.companyDetails.mobile,
        foreName: user.AllUser.forename,
        surname: user.AllUser.surname,
        postCodeUser: user.AllUser.postCode,
        forename: companyData[0].data.yourDetails.foreName,
        surName: companyData[0].data.yourDetails.surName,
        emailAdmin: companyData[0].data.companyAdminUser.email,
        mobileAdmin: companyData[0].data.companyAdminUser.mobile,
        postCodeAddress: companyData[0].data.companyDetails.postCode,
        addressLine1: companyData[0].data.companyDetails.addressLine1,
        addressLine2: companyData[0].data.companyDetails.addressLine2,
        townOrCity: companyData[0].data.companyDetails.townOrCity,
        userAddressLine1: user.AllUser.userAddressLine1,
        userAddressLine2: user.AllUser.userAddressLine2,
        userTownOrCity: user.AllUser.userTownOrCity,
      };
    } catch (error) {
      throw new RpcException({
        statusCode: error?.statusCode ? error.statusCode : error?.status ? error.status : 400,
        message: error?.message ? error?.message : "Bad Request",
        stack: error ? error : null
      })
    }
  }

  async updateUser(dto: UpdateUserDto) {
    try {
      const { userId, ...user } = dto;
      await this.userModel.findOneAndUpdate({ userId: userId }, user);
      return {
        data: null,
        message: 'User updated successfully.',
        errors: null,
      };
    } catch (error) {
      throw new RpcException({
        statusCode: error?.statusCode ? error.statusCode : error?.status ? error.status : 400,
        message: error?.message ? error?.message : "Bad Request",
        stack: error ? error : null
      })
    }
  }

  // async updateUser(dto: UpdateCompanyDto) {
  //   try {
  //     const { userId, ...user } = dto;
  //     await this.companyRepository.findOneAndUpdate({ _id: userId }, user);
  //     return {
  //       data: null,
  //       message: 'User updated successfully.',
  //       errors: null,
  //     };
  //   } catch (err) {
  //     throw new RpcException(err);
  //   }
  // }

  // async deleteUser(dto: DeleteCompanyDto) {
  //   try {
  //     const { userId } = dto;
  //     await this.companyRepository.delete({ _id: userId });
  //     return {
  //       data: null,
  //       message: 'User deleted successfully.',
  //       errors: null,
  //     };
  //   } catch (err) {
  //     throw new RpcException(err);
  //   }
  // }

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
