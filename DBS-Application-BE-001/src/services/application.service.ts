import {
  BadRequestException,
  ConflictException,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
  NotAcceptableException,
  NotFoundException,
  NotImplementedException,
  PreconditionFailedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Payload, RpcException } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/mongoose';
// import mongoose, { isObjectIdOrHexString, Model,Types } from 'mongoose';
// import { AppHist, IApplication } from '../interfaces/application/application.interface';
import mongoose, { Model, Types } from 'mongoose';
import { ApplicationRepository } from '../repositories/application.repository';

import {
  CreateApplicationDto,
  DeleteApplicationDto,
  GetApplicationDto,
  UpdateApplicationDto,
  ListApplicationsDto,
  RejectApplicationDto,
} from '../dto/application';
import { CommitRepository } from '../repositories/commit-application.repository';
import { CommentApplicationRequestDto } from '../dto/application/commit-application.dto';

import { ResultApplicationDto } from '../dto/application/result-application.dto';
import { Application } from '../schemas/application.schema';
import { AppHist } from '../schemas/applicationHist.schema';
import {
  applicationAssignCounterSignatoryDto,
  ReAssignApplication,
} from '../dto/application/ReAssign-application.dto';
import { normalize, resolve } from 'path';
const ObjectId = mongoose.Types.ObjectId;
@Injectable()
export class ApplicationService {
  protected readonly logger = new Logger('APPLICATION_MICROSERVICE');
  constructor(
    private config: ConfigService,
    //   private readonly applicationModel: ApplicationRepository,
    private readonly commitRepository: CommitRepository,
    private readonly applicationModel: ApplicationRepository,
    @InjectModel(Application.name) private applicationmodel: Model<Application>,
    @InjectModel('apphist') private apphistModel: Model<AppHist>,
  ) {}

  stages = [
    'Created New Application',
    'Rejected by Evidence Checker',
    'Application sent to Evedence Checker',
    'Application Is in Progress',
    'Application sent to Conter Signatory',
    'Application rejected',
    'Application sent to evedence checker by counter signatory',
    'Application re sent to counter signatory',
    'Application sent to home office',
    'Rejected by Evidence Checker bbbbb',
    'Checked By Evidence Checker',
    'Checked By Counter Signatory',
    'Awaiting Check By Evidence Checker',
    'Awaiting Check By Counter signatory',
    undefined,
    '',
    null,
  ];

  statuses = [
    'Assigned',
    'Pending',
    'SendToEC',
    'SendToCS',
    'ReSendToCS',
    'Rejected',
    'Completed',
    'InIssues',
    'InProgress',
    'InComplete',
    'ReturnedToUser',
    'ReturnedToEC',
    // 'SentToHomeOffice',
    '',
    undefined,
    null,
  ];

  //for List All application generic
  async listAllApplications(
    createBy,
    offset = 0,
    limit = 10,
    stage = '',
    searchTerm = '',
    isPaid = undefined,
    status = '',
    from = 10,
    to = 26708647266,
    sortBy = 'createdAt',
    sort = -1,
    // myAssign
  ) {
    try {
      const f = new Date(from * 1000);
      const t = new Date(to * 1000);

      const statusIn =
        status === ''
          ? {
              $in: this.statuses,
            }
          : { $in: [status] };

      const isp =
        isPaid === undefined
          ? { $in: [true, false, null, undefined, ''] }
          : isPaid == 'true'
          ? { $in: [true] }
          : { $in: [false] };
      const stg =
        stage === ''
          ? {
              $in: this.stages,
            }
          : stage; //{ "$in": [...stage] };

      searchTerm = searchTerm === '' ? '' : searchTerm.toLowerCase();
      const sterm = `.*${searchTerm}.*`;

      console.log(
        f,
        t,
        isp,
        stg,
        createBy,
        ' details from request to search',
        statusIn,
        ' SearchTerm : ',
        sterm,
        sortBy,
        sort,
      );

      const response = await this.applicationmodel.aggregate([
        {
          $search: {
            index: 'applicationSearch',
            regex: {
              query: sterm,
              path: { wildcard: '*' },
              allowAnalyzedField: true,
            },
          },
        },
        {
          $match: {
            CreateBy: createBy,
            createdAt: { $gte: f, $lt: t },
            'ApplicationState.isPaid': isp,
            'ApplicationState.stage': stg,
            'ApplicationState.status': statusIn,
          },
        },
        {
          $lookup: {
            from: 'users',
            localField: 'ApplicantId',
            foreignField: 'userId',
            as: 'user',
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
          $unwind: {
            path: '$user',
            preserveNullAndEmptyArrays: true,
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
        { $sort: <any>{ [sortBy]: Number(sort) } },
        {
          $facet: {
            total: [{ $count: 'total' }],
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
                  $ifNull: [Number(limit), '$total.total'],
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
      // if (!response[0]?.data || !response[0]?.meta) {
      //   throw {
      //     statusCode: HttpStatus.NO_CONTENT
      //   }
      // }
      return {
        data: response[0]?.data ? response[0]?.data : [],
        meta: response[0]?.meta ? response[0]?.meta : {},
      };

      // return response;
    } catch (error) {
      console.log(error, ' Error');
      throw new RpcException({
        statusCode: error?.statusCode
          ? error.statusCode
          : error?.status
          ? error.status
          : error?.error?.statusCode
          ? error?.error?.statusCode
          : 400,
        message: error?.message ? error?.message : 'Bad Request',
        stack: error ? error : null,
      });
    }
  }

  async listAllApplicationsOfApplicant(
    createBy,
    offset = 0,
    limit = 10,
    stage = '',
    searchTerm = '',
    isPaid = undefined,
    status = '',
    from = 10,
    to = 26708647266,
    sortBy = 'createdAt',
    sort = -1,
    // myAssign
  ) {
    try {
      const f = new Date(from * 1000);
      const t = new Date(to * 1000);

      const statusIn =
        status === ''
          ? {
              $in: this.statuses,
            }
          : { $in: [status] };

      const isp =
        isPaid === undefined
          ? { $in: [true, false, null, undefined, ''] }
          : isPaid == 'true'
          ? { $in: [true] }
          : { $in: [false] };
      const stg =
        stage === ''
          ? {
              $in: this.stages,
            }
          : stage; //{ "$in": [...stage] };

      searchTerm = searchTerm === '' ? '' : searchTerm.toLowerCase();
      const sterm = `.*${searchTerm}.*`;

      console.log(
        f,
        t,
        isp,
        stg,
        createBy,
        ' details from request to search',
        statusIn,
        ' SearchTerm : ',
        sterm,
        sortBy,
        sort,
      );

      const response = await this.applicationmodel.aggregate([
        {
          $search: {
            index: 'applicationSearch',
            regex: {
              query: sterm,
              path: { wildcard: '*' },
              allowAnalyzedField: true,
            },
          },
        },
        {
          $match: {
            ApplicantId: createBy,
            createdAt: { $gte: f, $lt: t },
            'ApplicationState.isPaid': isp,
            'ApplicationState.stage': stg,
            'ApplicationState.status': statusIn,
          },
        },
        {
          $lookup: {
            from: 'users',
            localField: 'ApplicantId',
            foreignField: 'userId',
            as: 'user',
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
          $unwind: {
            path: '$user',
            preserveNullAndEmptyArrays: true,
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
        { $sort: <any>{ [sortBy]: Number(sort) } },
        {
          $facet: {
            total: [{ $count: 'total' }],
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
                  $ifNull: [Number(limit), '$total.total'],
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
      // if (!response[0]?.data || !response[0]?.meta) {
      //   throw {
      //     statusCode: HttpStatus.NO_CONTENT
      //   }
      // }
      return {
        data: response[0]?.data ? response[0]?.data : [],
        meta: response[0]?.meta ? response[0]?.meta : {},
      };

      // return response;
    } catch (error) {
      console.log(error, ' Error');
      throw new RpcException({
        statusCode: error?.statusCode
          ? error.statusCode
          : error?.status
          ? error.status
          : error?.error?.statusCode
          ? error?.error?.statusCode
          : 400,
        message: error?.message ? error?.message : 'Bad Request',
        stack: error ? error : null,
      });
    }
  }

  //for Listing All applications assign to Evedence Checker generic
  async listAllApplicationsAssignedToEvedenceChecker(
    createBy,
    offset = 0,
    limit = 10,
    stage = '',
    searchTerm = '',
    isPaid = undefined,
    status = '',
    from = 10,
    to = 26708647266,
    sortBy = 'createdAt',
    sort = -1,
    // myAssign
  ) {
    try {
      const f = new Date(from * 1000);
      const t = new Date(to * 1000);

      const statusIn =
        status === ''
          ? {
              $in: this.statuses,
            }
          : { $in: [status] };

      const isp =
        isPaid === undefined
          ? { $in: [true, false, null, undefined, ''] }
          : isPaid == 'true'
          ? { $in: [true] }
          : { $in: [false] };
      const stg =
        stage === ''
          ? {
              $in: this.stages,
            }
          : stage; //{ "$in": [...stage] };

      searchTerm = searchTerm === '' ? '' : searchTerm.toLowerCase();
      const sterm = `.*${searchTerm}.*`;

      console.log(
        f,
        t,
        isp,
        stg,
        createBy,
        ' details from request to search',
        statusIn,
        ' SearchTerm : ',
        sterm,
        sortBy,
        sort,
      );

      const response = await this.applicationmodel.aggregate([
        {
          $search: {
            index: 'applicationSearch',
            regex: {
              query: sterm,
              path: { wildcard: '*' },
              allowAnalyzedField: true,
            },
          },
        },
        {
          $match: {
            AssignTo: createBy,
            createdAt: { $gte: f, $lt: t },
            'ApplicationState.isPaid': isp,
            'ApplicationState.stage': stg,
            'ApplicationState.status': statusIn,
            // $or: [
            //   {
            //     _id: {
            //       $regex: searchTerm,
            //       $options: 'i',
            //     },
            //   },
            //   {
            //     ApplicantId: {
            //       $regex: searchTerm,
            //       $options: 'i',
            //     },
            //   },
            //   {
            //     'PersonalDetails.firstName': {
            //       $regex: searchTerm,
            //       $options: 'i',
            //     },
            //   },
            //   {
            //     'PersonalDetails.IstMidName': {
            //       $regex: searchTerm,
            //       $options: 'i',
            //     },
            //   },
            // ],
          },
        },
        {
          $lookup: {
            from: 'users',
            localField: 'ApplicantId',
            foreignField: 'userId',
            as: 'user',
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
          $unwind: {
            path: '$user',
            preserveNullAndEmptyArrays: true,
          },
        },
        { $sort: <any>{ [sortBy]: Number(sort) } },
        {
          $facet: {
            total: [{ $count: 'total' }],
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
                  $ifNull: [Number(limit), '$total.total'],
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

      // if (!response[0]?.data || !response[0]?.meta) {
      //   throw new RpcException({statusCode:HttpStatus.NO_CONTENT})
      // }

      return {
        data: response[0]?.data ? response[0]?.data : [],
        meta: response[0]?.meta ? response[0]?.meta : {},
      };

      // return response;
    } catch (error) {
      console.log(error);
      throw new RpcException({
        statusCode: error?.statusCode
          ? error.statusCode
          : error?.status
          ? error.status
          : error?.error?.statusCode
          ? error?.error?.statusCode
          : 400,
        message: error?.message ? error?.message : 'Bad Request',
        stack: error ? error : null,
      });
    }
  }

  //for get application list by application status
  async listApplicationByStatus({ status, offset, limit }: any): Promise<any> {
    try {
      let query = {
        'ApplicationState.status': status,
      };
      const response = await this.applicationModel.fastPaginate(
        query,
        offset,
        limit,
      );
      return response;
    } catch (error) {
      throw new RpcException({
        statusCode: error?.statusCode
          ? error.statusCode
          : error?.status
          ? error.status
          : 400,
        message: error?.message ? error?.message : 'Bad Request',
        stack: error ? error : null,
      });
    }
  }

  //for get application details
  async getApplicationDetails({ applicationId }: any): Promise<any> {
    try {
      console.log('service running!');

      const response = await this.applicationmodel.aggregate([
        {
          $match: { _id: new Types.ObjectId(applicationId) },
        },
      ]);

      // const response = await this.applicationModel.findOne({
      //   _id: applicationId,
      // });
      // console.log(response , " response");
      // if (!response[0]) {
      //   throw new RpcException({statusCode:HttpStatus.NO_CONTENT})
      // }
      return {
        message: 'Success',
        data: { ...response[0] },
        statusCode: 200,
        error: null,
      };
    } catch (error) {
      // throw new HttpException(error.response, error.status);
      // throw new RpcException('Not Found');
      throw new RpcException({
        statusCode: error?.statusCode
          ? error.statusCode
          : error?.status
          ? error.status
          : 400,
        message: error?.message ? error?.message : 'Bad Request',
        stack: error ? error : null,
      });
    }
  }

  //for get application by AdminID
  async getApplicationsByAdminID(payload: any) {
    try {
      // console.log(payload);

      const { adminId, offset, limit, sortby, sort } = payload;
      const filterQuery = {
        CreateBy: adminId,
      };
      // console.log(adminId);

      return await this.applicationModel.fastPaginate(
        filterQuery,
        offset,
        limit,
      );
    } catch (error) {
      throw new RpcException({
        statusCode: error?.statusCode
          ? error.statusCode
          : error?.status
          ? error.status
          : 400,
        message: error?.message ? error?.message : 'Bad Request',
        stack: error ? error : null,
      });
    }
  }

  //Get Applications of Sub Users
  async getApplicationsOfSubUsers({
    AdminID,
    UserID,
    offset = 0,
    limit = 10,
    sortby = 'createdAt',
    sort = -1,
    searchTerm = '',
  }: any) {
    try {
      console.log(UserID, offset, limit, sortby, sort, searchTerm);
      const filterQuery = {
        ApplicantId: UserID,
      };
      searchTerm = searchTerm === '' ? '' : searchTerm.toLowerCase();
      const sterm = `.*${searchTerm}.*`;
      const response = await this.applicationmodel.aggregate([
        {
          $search: {
            index: 'applicationSearch',
            regex: {
              query: sterm,
              path: { wildcard: '*' },
              allowAnalyzedField: true,
            },
          },
        },
        {
          $match: {
            ApplicantId: UserID,
          },
        },
        {
          $lookup: {
            from: 'users',
            localField: 'ApplicantId',
            foreignField: 'userId',
            as: 'user',
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
          $unwind: {
            path: '$user',
            preserveNullAndEmptyArrays: true,
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
        { $sort: <any>{ [sortby]: Number(sort) } },
        {
          $facet: {
            total: [{ $count: 'total' }],
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
                  $ifNull: [Number(limit), '$total.total'],
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

      // if (!response[0]?.data || !response[0]?.meta) {
      //   throw new RpcException({statusCode:HttpStatus.NO_CONTENT})
      // }

      return {
        data: response[0]?.data ? response[0]?.data : [],
        meta: response[0]?.meta ? response[0]?.meta : {},
      };
    } catch (error) {
      // throw new RpcException(err.message);
      throw new RpcException({
        statusCode: error?.statusCode
          ? error.statusCode
          : error?.status
          ? error.status
          : 400,
        message: error?.message ? error?.message : 'Bad Request',
        stack: error ? error : null,
      });
    }
  }

  //for get applications by UserID
  async getApplicationsByIndividualUserID({
    UserID,
    offset,
    limit,
    sortby,
    sort,
  }: any) {
    try {
      // console.log(UserID);

      const filterQuery = {
        CreateBy: UserID,
      };
      return await this.applicationModel.fastPaginate(
        filterQuery,
        offset,
        limit,
        sortby,
        sort,
      );
    } catch (error) {
      throw new RpcException({
        statusCode: error?.statusCode
          ? error.statusCode
          : error?.status
          ? error.status
          : 400,
        message: error?.message ? error?.message : 'Bad Request',
        stack: error ? error : null,
      });
    }
  }

  //for get application by AdminID and Status
  async getApplicationsByAdminIDwithStatus({
    AdminID,
    status,
    offset,
    limit,
    sortby,
    sort,
  }: any) {
    try {
      console.log(AdminID, status);

      const filterQuery = {
        CreateBy: AdminID,
        'ApplicationState.status': status,
      };
      return await this.applicationModel.fastPaginate(
        filterQuery,
        offset,
        limit,
      );
    } catch (error) {
      throw new RpcException({
        statusCode: error?.statusCode
          ? error.statusCode
          : error?.status
          ? error.status
          : 400,
        message: error?.message ? error?.message : 'Bad Request',
        stack: error ? error : null,
      });
    }
  }
  //for get application by UserID and Status
  async getApplicationsByIndividualUserIDwithStatus({
    UserID,
    status,
    offset,
    limit,
    sortby,
    sort,
  }: any) {
    try {
      // console.log(new mongoose.Types.ObjectId(UserID));
      const filterQuery = {
        UserID: UserID,
        'ApplicationState.status': status,
      };
      return await this.applicationModel.fastPaginate(
        filterQuery,
        offset,
        limit,
      );
    } catch (error) {
      throw new RpcException({
        statusCode: error?.statusCode
          ? error.statusCode
          : error?.status
          ? error.status
          : 400,
        message: error?.message ? error?.message : 'Bad Request',
        stack: error ? error : null,
      });
    }
  }

  //Get Applications of Company SubUsers
  // async getUserWithApplications(AdminID, offset = 0, limit = 10, sortby = "createdAt", sort: string = "-1", searchTerm: string = "") {
  //   // const { AdminID, offset, limit, sortby , sort ,searchTerm } = dto
  //   // console.log(typeof(searchTerm),typeof(sortby),typeof(sort));
  //   // console.log(searchTerm.length,sortby.length,sort.length);
  //   searchTerm  = searchTerm.length === 0? "":searchTerm
  //   sort = sort.length===0?"-1":sort
  //   sortby = sortby.length === 0 ? "createdAt" : sortby
  //   // console.log(searchTerm,sort,sortby);

  //   try {
  //     // console.log(AdminID, offset, limit, sortby, sort, searchTerm)

  //     const res = await this.userModel.aggregate([
  //       {
  //         $match: {
  //           companyAdminId: AdminID,
  //           $or: [
  //             {
  //               userId: {
  //                 $regex: searchTerm.toLowerCase(),
  //                 $options: "i",
  //               },
  //             },
  //             {
  //               "AllUser.username": {
  //                 $regex: searchTerm.toLowerCase(),
  //                 $options: "i",
  //               },
  //             },
  //             {
  //               "AllUser.email": {
  //                 $regex: searchTerm.toLowerCase(),
  //                 $options: "i",
  //               },
  //             },
  //             {
  //               "AllUser.userType": {
  //                 $regex: searchTerm.toLowerCase(),
  //                 $options: "i",
  //               },
  //             },
  //             {
  //               "AllUser.forename": {
  //                 $regex: searchTerm.toLowerCase(),
  //                 $options: "i",
  //               },
  //             },
  //             {
  //               "AllUser.surname": {
  //                 $regex: searchTerm.toLowerCase(),
  //                 $options: "i",
  //               },
  //             },
  //             {
  //               "AllUser.mobile": {
  //                 $regex: searchTerm.toLowerCase(),
  //                 $options: "i",
  //               },
  //             },
  //             {
  //               "AllUser.phone": {
  //                 $regex: searchTerm.toLowerCase(),
  //                 $options: "i",
  //               },
  //             },
  //             {
  //               "AllUser.postCode": {
  //                 $regex: searchTerm.toLowerCase(),
  //                 $options: "i",
  //               },
  //             },
  //           ],
  //         },
  //       },
  //       {
  //         $lookup: {
  //           from: "applications",
  //           localField: "userId",
  //           foreignField: "UserID",
  //           as: "application",
  //           pipeline: [
  //             {
  //               $sort: {
  //                 createdAt: -1,
  //               },
  //             },
  //             {
  //               $skip: 0,
  //             },
  //             {
  //               $limit: 1,
  //             },
  //           ],
  //         },
  //       },
  //       {
  //         $unwind: {
  //           path: "$application",
  //           preserveNullAndEmptyArrays: true,
  //         },
  //       },
  //       {
  //         $project: {
  //           _id: "$_id",
  //           userId: "$userId",
  //           userType: "$AllUser.userType",
  //           forename: "$AllUser.forename",
  //           surname: "$AllUser.surname",
  //           username: "$AllUser.username",
  //           dateOfBirth: "$AllUser.dateOfBirth",
  //           phone: "$AllUser.phone",
  //           mobile: "$AllUser.mobile",
  //           email: "$AllUser.email",
  //           postCode: "$AllUser.postCode",
  //           recentAppStatus: {
  //             $cond: {
  //               if: {
  //                 $and: [
  //                   {
  //                     $eq: [
  //                       {
  //                         $type: "$application",
  //                       },
  //                       "object",
  //                     ],
  //                   },
  //                 ],
  //               },
  //               then: "$application.ApplicationState.status",
  //               else: "Not Started",
  //             },
  //           },
  //           applicationType: {
  //             $cond: {
  //               if: {
  //                 $and: [
  //                   {
  //                     $eq: [
  //                       {
  //                         $type: "$application",
  //                       },
  //                       "object",
  //                     ],
  //                   },
  //                 ],
  //               },
  //               then: "$application.EmploymentDetails.applicationType",
  //               else: "Not Started",
  //             },
  //           },
  //           userWillPay: "Yes",
  //           price: "500$",
  //         },
  //       },
  //       {
  //         $sort: <any>({
  //           [sortby]: Number(sort),
  //         }),
  //       },
  //       {
  //         $facet: {
  //           total: [
  //             {
  //               $count: 'total',
  //             },
  //           ],
  //           data: [
  //             // {
  //             //   $addFields: {
  //             //     _id: '$_id',
  //             //   },
  //             // },
  //           ],
  //         },
  //       },
  //       {
  //         $unwind: '$total',
  //       },
  //       {
  //         $project: {
  //           data: {
  //             $slice: [
  //               "$data",
  //               Number(offset),
  //               {
  //                 $ifNull: [Number(limit), "$total.count"],
  //               },
  //             ],
  //           },
  //           meta: {
  //             total: "$total.total",
  //             page: {
  //               $literal: Number(offset) / Number(limit) + 1,
  //             },
  //             pages: {
  //               $ceil: {
  //                 $divide: ["$total.total", Number(limit)],
  //               },
  //             },
  //           },
  //         },
  //       },
  //     ])
  //     return res[0]
  //   } catch (err) {
  //     throw new RpcException(err)
  //   }
  // }

  //Create application by company admin
  async createApplication(dto: any) {
    try {
      const dat = {
        ...dto,
        ApplicationState: {
          isPaid: false,
          stage: 'Created New Application',
          innerStage: 'New Application Created.',
          status: 'Pending',
        },
      };

      // console.log(dat);

      const newApplication = await this.applicationModel.create(dat);
      const hist = new this.apphistModel({
        Application: newApplication,
        createdBy: newApplication.CreateBy,
      });

      // console.log(hist);

      await hist.save();

      return {
        message: 'Application created successfully',
        data: { ...newApplication },
        statusCode: 201,
        error: null,
      };
    } catch (error) {
      console.log(error);
      // throw new RpcException(error);
      throw new RpcException({
        statusCode: error?.statusCode
          ? error.statusCode
          : error?.status
          ? error.status
          : 400,
        message: error?.message ? error?.message : 'Bad Request',
        stack: error ? error : null,
      });
    }
  }

  //Create application by indivitual User
  async createAppByIndividual(application: any): Promise<any> {
    try {
      const dat = {
        ...application,
        ApplicationState: {
          isPaid: false,
          status: 'Pending',
        },
      };
      const newApplication = await this.applicationModel.create(dat);

      const hist = new this.apphistModel({
        Application: newApplication,
        createdBy: newApplication.CreateBy,
      });

      console.log(hist);

      await hist.save();

      return {
        message: 'Application created successfully',
        data: { ...newApplication },
        statusCode: 201,
        error: null,
      };
    } catch (error) {
      throw new RpcException({
        statusCode: error?.statusCode
          ? error.statusCode
          : error?.status
          ? error.status
          : 400,
        message: error?.message ? error?.message : 'Bad Request',
        stack: error ? error : null,
      });
    }
  }
  //Update application by id
  async updateApplication(data: UpdateApplicationDto) {
    try {
      const onSubmit = data.onSubmit;
      const myRole = data.myRole;
      const applicationId = data.applicationId;
      const createdBy = data.createdBy;
      delete data.applicationId;
      delete data.onSubmit;
      delete data.myRole;

      var newData;
      console.log(myRole);

      if (onSubmit == 'true' || onSubmit == true) {
        if (myRole == 'INDIVIDUAL_USER') {
          console.log(myRole, onSubmit);

          newData = {
            ...data,
            ApplicationState: {
              isPaid: false,
              status: 'SendToCS',
              stage: 'Awaiting Check By Counter signatory',
              innerStage:
                'Applicaion reviewed By Individual User and Sent to couter signatory',
            },
            CounterSignatoryState: {
              CS_status: 'New',
              CounterSignatoryId: '01b626ae-ba53-433e-8746-dd8422020618',
            },
          };
        } else {
          const applicant = await this.applicationmodel.aggregate([
            {
              $match: { _id: new mongoose.Types.ObjectId(applicationId) },
            },
            {
              $lookup: {
                from: 'users',
                localField: 'ApplicantId',
                foreignField: 'userId',
                as: 'Applicant',
              },
            },
            {
              $unwind: {
                path: '$Applicant',
                preserveNullAndEmptyArrays: true,
              },
            },
            {
              $project: {
                _id: 0,
                Applicant: 1,
              },
            },
          ]);
          console.log(applicant[0]?.Applicant, ' Applicant');
          if (
            applicant[0]?.Applicant?.Assigned == false ||
            applicant[0]?.Applicant?.AssignedTo == '' ||
            applicant[0]?.Applicant?.AssignedTo == null ||
            applicant[0]?.Applicant?.AssignedTo == undefined
          ) {
            console.log('No Evedence Checker Assign');
            // throw new BadRequestException('No Evedence Checker Assign');
            return {
              message: 'No Evidence Checker Assigned',
              statusCode: 444,
              assigned: false,
            };
          } else {
            console.log('Assigned True code run');
            newData = {
              ...data,
              ApplicationState: {
                isPaid: false,
                stage: 'Awaiting Check By Evidence Checker',
                innerStage:
                  'Applicaion Submitted by User and sent to Evedence Checker',
                status: 'SendToEC',
              },
              AssignBy: applicant[0]?.Applicant?.AssignedBy,
              AssignTo: applicant[0]?.Applicant?.AssignedTo,
              Assigned: true,
            };
          }
        }
      } else {
        if (myRole == 'EVIDENCE_CHECKER') {
          newData = {
            ...data,
            ApplicationState: {
              isPaid: false,
              stage: 'Checked By Evidence Checker',
              innerStage: 'Application Checked By Evedence Checker',
              status: 'SendToEC',
            },
          };
        } else {
          newData = {
            ...data,
            ApplicationState: {
              isPaid: false,
              stage: 'Application Is in Progress',
              innerStage: 'User Working on Application and app is in progress',
              status: 'InProgress',
            },
          };
        }
      }

      const updateAppRes = await this.applicationModel.findOneAndUpdate(
        { _id: applicationId },
        newData,
      );
      const hist = new this.apphistModel({
        Application: updateAppRes,
        createdBy: createdBy,
      });
      await hist.save();
      return {
        statusCode: 200,
        data: { ...updateAppRes },
        message: 'Application updated successfully',
        error: null,
      };
    } catch (error) {
      throw new RpcException({
        statusCode: error?.statusCode
          ? error.statusCode
          : error?.status
          ? error.status
          : 400,
        message: error?.message ? error?.message : 'Bad Request',
        stack: error ? error : null,
      });
    }
  }

  async submitByEvedenceChecker(data: UpdateApplicationDto) {
    try {
      const applicationId = data.applicationId;
      const createdBy = data.createdBy;
      delete data.applicationId;

      var newData = {
        ...data,
        ApplicationState: {
          isPaid: false,
          status: 'SendToCS',
          stage: 'Awaiting Check By Counter signatory',
          innerStage: 'Applicaion reviewed and sent to couter signatory',
        },
        CounterSignatoryState: {
          CS_status: 'New',
          CounterSignatoryId: '01b626ae-ba53-433e-8746-dd8422020618',
        },
      };

      const updateAppRes = await this.applicationModel.findOneAndUpdate(
        { _id: applicationId },
        newData,
      );

      const hist = new this.apphistModel({
        Application: updateAppRes,
        createdBy: createdBy,
      });
      await hist.save();
      return {
        statusCode: 200,
        data: { ...updateAppRes },
        message: 'Application updated successfully',
        error: null,
      };
    } catch (error) {
      throw new RpcException({
        statusCode: error?.statusCode
          ? error.statusCode
          : error?.status
          ? error.status
          : 400,
        message: error?.message ? error?.message : 'Bad Request',
        stack: error ? error : null,
      });
    }
  }

  //for application reject
  async rejectApplication(data: RejectApplicationDto) {
    try {
      const applicationId = data.applicationId;
      delete data.applicationId;
      const rejectAppRes = await this.applicationModel.findOneAndUpdate(
        { _id: applicationId },
        {
          $set: {
            'ApplicationState.status': 'Rejected',
            'ApplicationState.stage': 'Application rejected',
            'ApplicationState.innerStage': 'Applicaion rejected by user.',
            'ApplicationState.comment': data.ApplicationState.comment,
            'ApplicationState.rejectedBy': data.ApplicationState.rejectedBy,
            'ApplicationState.postedOn': data.ApplicationState.postedOn,
          },
        },
      );
      const ApplicationState = rejectAppRes.ApplicationState;
      return {
        message: 'Application rejected successfully',
        statusCode: 200,
        data: { ApplicationState },
        error: null,
      };
    } catch (error) {
      throw new RpcException({
        statusCode: error?.statusCode
          ? error.statusCode
          : error?.status
          ? error.status
          : 400,
        message: error?.message ? error?.message : 'Bad Request',
        stack: error ? error : null,
      });
    }
  }

  //Delete application by id
  async deleteApplication({ id }: any): Promise<any> {
    try {
      // this.logger.debug(id);
      const response = await this.applicationModel.delete({ _id: id });
      return {
        message: 'Application deleted successfully',
        statusCode: 200,
        data: { ...response },
        error: null,
      };
    } catch (error) {
      throw new RpcException({
        statusCode: error?.statusCode
          ? error.statusCode
          : error?.status
          ? error.status
          : 400,
        message: error?.message ? error?.message : 'Bad Request',
        stack: error ? error : null,
      });
    }
  }

  async resultApplication(data: ResultApplicationDto) {
    try {
      const applicationId = data.applicationId;

      const res = await this.applicationModel.aggregate([
        {
          $match: {
            _id: new ObjectId(applicationId),
          },
        },
        {
          $lookup: {
            from: 'users',
            localField: 'ApplicationState.rejectedBy',
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
            localField: 'ApplicationState.rejectedBy',
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
            rejectedByData: {
              $setUnion: ['$CreatedByUser', '$CreatedByCompany'],
            },
          },
        },
        {
          $unwind: {
            path: '$rejectedByData',
            preserveNullAndEmptyArrays: true,
          },
        },
      ]);

      // const resultAppRes = await this.applicationModel.findOne({
      //   _id: applicationId,
      // });

      // let ApplicationState = resultAppRes.ApplicationState;

      // ApplicationState.rejectedBy =
      //   res.length > 0 ? res[0].name : ApplicationState.rejectedBy;

      return {
        message: '',
        statusCode: 200,
        data: res[0] ? res[0] : {},
        error: null,
      };
    } catch (error) {
      throw new RpcException({
        statusCode: error?.statusCode
          ? error.statusCode
          : error?.status
          ? error.status
          : 400,
        message: error?.message ? error?.message : 'Bad Request',
        stack: error ? error : null,
      });
    }
  }

  // async applicationPaidFor(payload: any) {
  //   try {
  //     const { AdminID, offset, limit } = payload;

  //     const filterQuery = { AdminID: AdminID };

  //     const response = await this.applicationModel.fastPaginate(
  //       filterQuery,
  //       offset,
  //       limit,
  //     );

  //     const data = [];

  //     const responseCollection = response.collections;

  //     for (const response of responseCollection) {
  //       const obj = {
  //         U_ID: response.UserID,
  //         User: `${response.PersonalDetails.title} ${response.PersonalDetails.firstName} ${response.PersonalDetails.presentSurname}`,
  //         A_ID: response._id,
  //         NameInApplication: `${response.PersonalDetails.title} ${response.PersonalDetails.firstName} ${response.PersonalDetails.presentSurname}`,
  //         TotalVatable: 0.0,
  //         TotalNonVatable: 0.0,
  //         TotalVat: 0.0,
  //         TotalPaid: 0.0,
  //         CreatedAt: response.createdAt,
  //       };

  //       data.push(obj);
  //     }

  //     return {
  //       data: data,
  //       message: 'Success',
  //       errors: null,
  //       statusCode: 200,
  //       total: response.total,
  //       offset: response.offset,
  //       limit: response.limit,
  //     };
  //   } catch (error) {
  //     throw new RpcException(error);
  //   }
  // }

  async applicationAlreadyPaidFor(payload: any) {
    try {
      console.log(payload, 'payload');

      const { adminId, offset, limit } = payload;
      console.log(payload);

      const data = await this.applicationModel.aggregate([
        {
          $match: {
            CreateBy: adminId,
            'ApplicationState.isPaid': true,
          },
        },
        { $sort: <any>{ ['createdAt']: Number(-1) } },
        {
          $facet: {
            data: [{ $skip: Number(offset) }, { $limit: Number(limit) }],
          },
        },
        {
          $unwind: {
            path: '$data',
          },
        },
        {
          $project: {
            U_ID: '$data.UserID',
            User: '$data.PersonalDetails.firstName',
            A_ID: '$data._id',
            NameInApplication: '$data.PersonalDetails.firstName',
            TotalVatable: '0',
            TotalNonVatable: '0',
            TotalVat: '0',
            TotalPaid: '0',
            CreatedAt: '$data.createdAt',
          },
        },
      ]);

      console.log(data, 'data');

      return {
        data: data,
        message: 'Success',
        errors: null,
        statusCode: 200,
        offset: offset,
        limit: limit,
      };
    } catch (error) {
      throw new RpcException({
        statusCode: error?.statusCode
          ? error.statusCode
          : error?.status
          ? error.status
          : 400,
        message: error?.message ? error?.message : 'Bad Request',
        stack: error ? error : null,
      });
    }
  }

  async applicationToBeReviewed(payload: any) {
    try {
      console.log(payload, 'payload');

      const { adminId, offset, limit } = payload;
      console.log(payload);

      const data = await this.applicationModel.aggregate([
        {
          $match: {
            AdminID: adminId,
          },
        },
        { $sort: <any>{ ['createdAt']: Number(-1) } },
        {
          $facet: {
            data: [{ $skip: Number(offset) }, { $limit: Number(limit) }],
          },
        },
        {
          $unwind: {
            path: '$data',
          },
        },
        {
          $project: {
            U_ID: '$data.UserID',
            User: '$data.PersonalDetails.firstName',
            Evidence_Checker: 'Evidence_Checker',
            Company: '$data.EmploymentDetails.organizationName',
            DBS_Type: '$data.EmploymentDetails.applicationType',
            Profession: '$data.EmploymentDetails.applingPositionFor',
            CreatedAt: '$data.createdAt',
            Status: '$data.ApplicationState.status',
          },
        },
      ]);

      return {
        data: data,
        message: 'Success',
        errors: null,
        statusCode: 200,
        offset: offset,
        limit: limit,
      };
    } catch (error) {
      throw new RpcException({
        statusCode: error?.statusCode
          ? error.statusCode
          : error?.status
          ? error.status
          : 400,
        message: error?.message ? error?.message : 'Bad Request',
        stack: error ? error : null,
      });
    }
  }

  async applicationCertificatePostedOut(payload: any) {
    try {
      console.log(payload, 'SERVICE');

      let {
        adminId,
        offset,
        limit,
        userRoles,
        sortBy = -1,
        sort = 'createdAt',
      } = payload;

      // 24 hr back
      let oneDayBefore = new Date();
      oneDayBefore.setDate(oneDayBefore.getDate() - 1);

      // 48 hr back
      let twoDaysBefore = new Date();
      twoDaysBefore.setDate(twoDaysBefore.getDate() - 2);

      Logger.log('oneDayBefore', oneDayBefore);
      Logger.log('twoDaysBefore', twoDaysBefore);

      Logger.log(adminId, 'adminId');

      const qq =
        userRoles == 'EVIDENCE_CHECKER'
          ? {
              AssignTo: adminId,
              'ApplicationState.status': 'SentToHomeOffice',
              updatedAt: { $lte: oneDayBefore, $gte: twoDaysBefore },
            }
          : userRoles == 'APPLICANT'
          ? {
              ApplicantId: adminId,
              'ApplicationState.status': 'SentToHomeOffice',
              updatedAt: { $lte: oneDayBefore, $gte: twoDaysBefore },
            }
          : {
              CreateBy: adminId,
              'ApplicationState.status': 'SentToHomeOffice',
              updatedAt: { $lte: oneDayBefore, $gte: twoDaysBefore },
            };

      const data1 = await this.applicationModel.updateMany(
        {
          ...qq,
        },
        {
          $set: {
            'ApplicationState.status': 'Completed',
          },
        },
      );

      Logger.log(new Date('2023-01-15T12:15:54.858+00:00'));
      Logger.log(data1, 'data1');

      let { searchTerm = '', from = 10, to = 26708647266 } = payload;

      searchTerm = searchTerm === '' ? '' : searchTerm.toLowerCase();
      const sterm = `.*${searchTerm}.*`;

      const f = new Date(from * 1000);
      const t = new Date(to * 1000);

      const query =
        userRoles === 'EVIDENCE_CHECKER'
          ? {
              AssignTo: adminId,
              'ApplicationState.status': 'Completed',
              updatedAt: { $gte: f, $lt: t },
            }
          : userRoles == 'APPLICANT'
          ? {
              ApplicantId: adminId,
              'ApplicationState.status': 'Completed',
              updatedAt: { $gte: f, $lt: t },
            }
          : {
              CreateBy: adminId,
              'ApplicationState.status': 'Completed',
              updatedAt: { $gte: f, $lt: t },
            };

      const data = await this.applicationModel.aggregate([
        {
          $search: {
            index: 'applicationSearch',
            regex: {
              query: sterm,
              path: { wildcard: '*' },
              allowAnalyzedField: true,
            },
          },
        },
        {
          $match: query,
        },
        { $sort: <any>{ [sortBy]: Number(sort) } },
        {
          $facet: {
            total: [{ $count: 'total' }],
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
                  $ifNull: [Number(limit), '$total.total'],
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

      Logger.log(data, 'data');
      // if (!data[0]?.data) {
      //   throw new RpcException({statusCode:HttpStatus.NO_CONTENT})
      // }

      return {
        data: data[0]?.data ? data[0]?.data : [],
        message: 'Success',
        errors: null,
        statusCode: 200,
        offset: offset,
        limit: limit,
        total: data[0]?.meta?.total ? data[0]?.meta?.total : 0,
      };
    } catch (error) {
      throw new RpcException({
        statusCode: error?.statusCode
          ? error.statusCode
          : error?.status
          ? error.status
          : 400,
        message: error?.message ? error?.message : 'Bad Request',
        stack: error ? error : null,
      });
    }
  }

  async applicationCertificatePostedOutErasedApplications(payload: any) {
    try {
      console.log(payload, 'payload');

      const {
        adminId,
        offset,
        limit,
        userRoles,
        sortBy = -1,
        sort = 'createdAt',
      } = payload;

      let twoDaysBefore = new Date();
      twoDaysBefore.setDate(twoDaysBefore.getDate() - 2);

      Logger.log(twoDaysBefore);

      let { searchTerm = '', from = 10, to = 26708647266 } = payload;

      searchTerm = searchTerm === '' ? '' : searchTerm.toLowerCase();
      const sterm = `.*${searchTerm}.*`;

      const f = new Date(from * 1000);
      const t = new Date(to * 1000);

      const query =
        userRoles === 'EVIDENCE_CHECKER'
          ? {
              AssignTo: adminId,
              'ApplicationState.status': 'Completed',
              updatedAt: { $lte: twoDaysBefore },
              createdAt: { $gte: f, $lt: t },
            }
          : userRoles === 'APPLICANT'
          ? {
              ApplicantId: adminId,
              'ApplicationState.status': 'Completed',
              updatedAt: { $lte: twoDaysBefore },
              createdAt: { $gte: f, $lt: t },
            }
          : {
              CreateBy: adminId,
              'ApplicationState.status': 'Completed',
              updatedAt: { $lte: twoDaysBefore },
              createdAt: { $gte: f, $lt: t },
            };
      console.log(userRoles, query);

      const data = await this.applicationModel.aggregate([
        {
          $search: {
            index: 'applicationSearch',
            regex: {
              query: sterm,
              path: { wildcard: '*' },
              allowAnalyzedField: true,
            },
          },
        },
        {
          $match: query,
        },
        { $sort: <any>{ [sortBy]: Number(sort) } },
        {
          $facet: {
            total: [{ $count: 'total' }],
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
                  $ifNull: [Number(limit), '$total.total'],
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

      // if (!data[0]?.data) {
      //   throw new RpcException({statusCode:HttpStatus.NO_CONTENT})
      // }

      Logger.log(data, 'data');

      return {
        data: data[0]?.data ? data[0]?.data : [],
        message: 'Success',
        errors: null,
        statusCode: 200,
        offset: offset,
        limit: limit,
        total: data[0]?.meta?.total ? data[0]?.meta?.total : 0,
      };
    } catch (error) {
      throw new RpcException({
        statusCode: error?.statusCode
          ? error.statusCode
          : error?.status
          ? error.status
          : 400,
        message: error?.message ? error?.message : 'Bad Request',
        stack: error ? error : null,
      });
    }
  }

  async CommentApplication(dto: CommentApplicationRequestDto) {
    try {
      const {
        TokenUsersId,
        roles,
        applicationId,
        signatoryReconciliation,
        comment,
        createBy,
        userAdmin,
      } = dto;
      let query = [
        {
          $match: {
            _id: new Types.ObjectId(applicationId),
          },
        },
        {
          $lookup: {
            from: 'users',
            localField: 'AssignTo',
            foreignField: 'userId',
            as: 'AssignToUser',
          },
        },
        {
          $unwind: {
            path: '$AssignToUser',
          },
        },
        {
          $project: {
            CompanyAdminID: '$CompanyAdminID',
            CreateBy: '$CreateBy',
            CounterSignatoryId: '$CounterSignatoryState.CounterSignatoryId',
            AssignTo: '$AssignTo',
            AssignToUser: '$AssignToUser',
          },
        },
      ];

      // {
      //   "_id": "638f720a44b38508eb08ba26",
      //   "AdminID": "408a84aa-49cc-4ee8-b143-272e07fffd55",
      //   "UserID": "e8d79eb1-aa15-44c3-b26e-310538fc01d1"
      // }
      let [applictionRes] = await this.applicationModel.aggregate(query);
      console.log(
        applictionRes,
        'adausgfugdcuisdgvusicn ',
        applictionRes?.AssignToUser?.AllUser?.Active,
      );
      let CompanyAdminID, AssignTo, CounterSignatoryId, CreatedBy;
      if (applictionRes.AssignTo) {
        CompanyAdminID = applictionRes.CompanyAdminID ?? '';
        AssignTo = applictionRes.AssignTo;
        CounterSignatoryId = applictionRes.CounterSignatoryId;
      } else {
        CompanyAdminID = applictionRes.CompanyAdminID ?? '';
        CreatedBy = applictionRes.CreateBy;
        CounterSignatoryId = applictionRes.CounterSignatoryId;
      }
      if (roles == 'COUNTER_SIGNATORY') {
        console.log(CreatedBy, '--------------------', AssignTo);

        // if(!applictionRes?.AssignToUser?.AllUser?.Active || applictionRes?.AssignToUser?.AllUser?.Active != true ){

        //   throw new PreconditionFailedException("Evdence Checker Deactivated!")

        // }

        const response = await this.commitRepository.create({
          adminId: CompanyAdminID,
          applicationId,
          usersId: AssignTo ? AssignTo : CreatedBy,
          signatoryReconciliation,
          counterSignatoryId: TokenUsersId,
          comment,
          createBy,
        });

        const updatedApp = await this.applicationmodel.findByIdAndUpdate(
          applicationId,
          {
            'CounterSignatoryState.CS_status': 'InProgress',
            'CounterSignatoryState.commented': true,
            'ApplicationState.status': 'ReturnedToUser',
            'ApplicationState.stage': 'Checked By Counter Signatory',
            'ApplicationState.innerStage':
              'Application have issues and sent back to evedence checker to correct the data.',
          },
        );

        return response;
      } else {
        console.log(
          '----------Application Comment===================',
          CounterSignatoryId,
          '-------------------Appliction Comment====================',
        );

        // if(applictionRes.CompanyAdminID === userAdmin ){
        const response = await this.commitRepository.create({
          adminId: CompanyAdminID,
          applicationId,
          usersId: TokenUsersId,
          signatoryReconciliation,
          counterSignatoryId: CounterSignatoryId,
          comment,
          createBy,
        });

        const updatedApp = await this.applicationmodel.findByIdAndUpdate(
          applicationId,
          {
            'CounterSignatoryState.CS_status': 'InProgress',
            'CounterSignatoryState.commented': true,
            'ApplicationState.status': 'ReSendToCS',
            'ApplicationState.stage':
              'Application re sent to counter signatory',
            'ApplicationState.innerStage':
              'Application have issues resolved and sent back to counter signatory to re check.',
          },
        );

        return response;
        // }else{
        // return {
        //   statusCode: 400,
        //   message:"BadRequest"
        // }
        // }
      }
    } catch (error) {
      console.log(error);
      throw new RpcException({
        statusCode: error?.statusCode
          ? error.statusCode
          : error?.status
          ? error.status
          : 400,
        message: error?.message ? error?.message : 'Bad Request',
        stack: error ? error : null,
      });
    }
  }

  async application_Reassign(dto: ReAssignApplication) {
    try {
      const { ApplicationId, AssignBy, AssignTo } = dto;
      const Application = await this.applicationModel.updateMany(
        { _id: { $in: [...ApplicationId] } },
        {
          $set: { AssignBy: AssignBy, AssignTo: AssignTo, Assigned: true },
        },
      );
      console.log('', Application, '');
      return Application;
    } catch (error) {
      throw new RpcException({
        statusCode: error?.statusCode
          ? error.statusCode
          : error?.status
          ? error.status
          : 400,
        message: error?.message ? error?.message : 'Bad Request',
        stack: error ? error : null,
      });
    }
  }

  async applicationAssignByApplicantsIds(dto) {
    try {
      console.log(dto);
      const { ApplicantID, AssignedBy, AssignedTo } = dto;
      const Application = await this.applicationModel.updateMany(
        {
          ApplicantId: { $in: [...ApplicantID] },
          'ApplicationState.status': { $nin: ['Pending', 'InProgress'] },
        },
        {
          $set: { AssignBy: AssignedBy, AssignTo: AssignedTo, Assigned: true },
        },
      );
      console.log('', Application, '');
      return Application;
    } catch (error) {
      throw new RpcException({
        statusCode: error?.statusCode
          ? error.statusCode
          : error?.status
          ? error.status
          : 400,
        message: error?.message ? error?.message : 'Bad Request',
        stack: error ? error : null,
      });
    }
  }

  async applicationAssignCounterSignatory(
    dto: applicationAssignCounterSignatoryDto,
  ) {
    try {
      const { ApplicationId, CounterSignatoryId } = dto;
      const Application = await this.applicationModel.findOneAndUpdate(
        { _id: ApplicationId },
        {
          $set: {
            'CounterSignatoryState.CounterSignatoryId': CounterSignatoryId,
            'CounterSignatoryState.CS_status': 'New',
          },
        },
      );
      console.log('', Application, '');
      return Application;
    } catch (error) {
      throw new RpcException({
        statusCode: error?.statusCode
          ? error.statusCode
          : error?.status
          ? error.status
          : 400,
        message: error?.message ? error?.message : 'Bad Request',
        stack: error ? error : null,
      });
    }
  }

  async getApplicationHistory(
    id,
    offset = 0,
    limit = 10,
    sortby = 'createdAt',
    sort = -1,
    searchTerm = '',
  ) {
    try {
      console.log(id, offset, limit, searchTerm, sort, sortby);

      searchTerm = searchTerm === '' ? '' : searchTerm.toLowerCase();
      const sterm = `.*${searchTerm}.*`;

      const response = await this.apphistModel.aggregate([
        {
          $search: {
            index: 'appHistoryIndex',
            regex: {
              query: sterm,
              path: { wildcard: '*' },
              allowAnalyzedField: true,
            },
          },
        },
        {
          $match: {
            'Application._id': new mongoose.Types.ObjectId(id),
          },
        },
        {
          $lookup: {
            from: 'users',
            localField: 'createdBy',
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
            localField: 'createdBy',
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
        { $sort: <any>{ [sortby]: Number(sort) } },
        {
          $facet: {
            total: [{ $count: 'total' }],
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
                  $ifNull: [Number(limit), '$total.total'],
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
      //   throw new RpcException({statusCode:HttpStatus.NO_CONTENT})
      // }
      return {
        data: response[0]?.data ? response[0]?.data : [],
        meta: response[0]?.meta ? response[0]?.meta : {},
      };
    } catch (error) {
      console.log(error);
      throw new RpcException({
        statusCode: error?.statusCode
          ? error.statusCode
          : error?.status
          ? error.status
          : 400,
        message: error?.message ? error?.message : 'Bad Request',
        stack: error ? error : null,
      });
    }
  }
  // //List of total count of DBS Applications by status
  async totalCountOfDBSApplication(createBy, usersroles) {
    try {
      // 48 hr back
      let sevenDaysBefore = new Date();
      sevenDaysBefore.setDate(sevenDaysBefore.getDate() - 7);
      const query =
        usersroles == 'EVIDENCE_CHECKER'
          ? {
              AssignTo: createBy,
            }
          : usersroles == 'APPLICANT'
          ? {
              ApplicantId: createBy,
            }
          : {
              CreateBy: createBy,
            };
      const [totalCountOfDBSApp] = await this.applicationModel.aggregate([
        {
          $match: query,
        },
        {
          $facet: {
            CompanyAssignedDBSApps: [
              {
                $match: {
                  Assigned: true,
                },
              },
              {
                $count: 'total',
              },
            ],
            ECAssignedDBSApps: [
              {
                $count: 'total',
              },
            ],
            AssignedApps: [
              {
                $match: {
                  'ApplicationState.status': 'Assigned',
                },
              },
              {
                $count: 'total',
              },
            ],
            PendingApps: [
              {
                $match: {
                  'ApplicationState.status': 'Pending',
                },
              },
              {
                $count: 'total',
              },
            ],
            SendToECApps: [
              {
                $match: {
                  'ApplicationState.status': 'SendToEC',
                  updatedAt: { $lte: sevenDaysBefore },
                },
              },
              {
                $count: 'total',
              },
            ],
            SendToCSApps: [
              {
                $match: {
                  'ApplicationState.status': 'SendToCS',
                },
              },
              {
                $count: 'total',
              },
            ],
            ReSendToCSApps: [
              {
                $match: {
                  'ApplicationState.status': 'ReSendToCS',
                },
              },
              {
                $count: 'total',
              },
            ],
            RejectedApps: [
              {
                $match: {
                  'ApplicationState.status': 'Rejected',
                },
              },
              {
                $count: 'total',
              },
            ],
            CompletedApps: [
              {
                $match: {
                  'ApplicationState.status': 'Completed',
                },
              },
              {
                $count: 'total',
              },
            ],
            InIssuesApps: [
              {
                $match: {
                  'ApplicationState.status': 'ReturnedToUser',
                },
              },
              {
                $count: 'total',
              },
            ],
            InProgressApps: [
              {
                $match: {
                  'ApplicationState.status': 'InProgress',
                },
              },
              {
                $count: 'total',
              },
            ],
            InCompleteApps: [
              {
                $match: {
                  'ApplicationState.status': { $in: ['InProgress', 'Pending'] },
                  updatedAt: { $lte: sevenDaysBefore },
                },
              },
              {
                $count: 'total',
              },
            ],
            IndividualInCompleteApps: [
              {
                $match: {
                  'ApplicationState.status': { $in: ['InProgress', 'Pending'] },
                },
              },
              {
                $count: 'total',
              },
            ],

            SentToHomeOfficeApps: [
              {
                $match: {
                  'ApplicationState.status': 'SentToHomeOffice',
                },
              },
              {
                $count: 'total',
              },
            ],
            IsPaidTrueApps: [
              {
                $match: {
                  'ApplicationState.isPaid': true,
                },
              },
              {
                $count: 'total',
              },
            ],
            IsPaidFalseApps: [
              {
                $match: {
                  'ApplicationState.isPaid': false,
                },
              },
              {
                $count: 'total',
              },
            ],
            DBSEligibleForReprintApps: [
              {
                $match: {
                  ConfirmReceipt: false,
                },
              },
              {
                $count: 'total',
              },
            ],
          },
        },

        {
          $unwind: {
            path: '$CompanyAssignedDBSApps',
            preserveNullAndEmptyArrays: true,
          },
        },

        {
          $unwind: {
            path: '$ECAssignedDBSApps',
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $unwind: {
            path: '$AssignedApps',
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $unwind: {
            path: '$PendingApps',
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $unwind: {
            path: '$ReSendToCSApps',
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $unwind: {
            path: '$SendToECApps',
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $unwind: {
            path: '$SendToCSApps',
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $unwind: {
            path: '$RejectedApps',
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $unwind: {
            path: '$CompletedApps',
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $unwind: {
            path: '$InIssuesApps',
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $unwind: {
            path: '$InProgressApps',
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $unwind: {
            path: '$InCompleteApps',
            preserveNullAndEmptyArrays: true,
          },
        },

        {
          $unwind: {
            path: '$IndividualInCompleteApps',
            preserveNullAndEmptyArrays: true,
          },
        },

        {
          $unwind: {
            path: '$SentToHomeOfficeApps',
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $unwind: {
            path: '$IsPaidTrueApps',
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $unwind: {
            path: '$IsPaidFalseApps',
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $unwind: {
            path: '$DBSEligibleForReprintApps',
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $project: {
            CompanyAssignedDBSApps: '$CompanyAssignedDBSApps.total',
            ECAssignedDBSApps: '$ECAssignedDBSApps.total',
            AssignedApps: '$AssignedApps.total',
            PendingApps: '$PendingApps.total',
            SendToECApps: '$SendToECApps.total',
            SendToCSApps: '$SendToCSApps.total',
            ReSendToCSApps: '$ReSendToCSApps.total',
            RejectedApps: '$RejectedApps.total',
            CompletedApps: '$CompletedApps.total',
            InIssuesApps: '$InIssuesApps.total',
            InProgressApps: '$InProgressApps.total',
            InCompleteApps: '$InCompleteApps.total',
            IndividualInCompleteApps: '$IndividualInCompleteApps.total',

            SentToHomeOfficeApps: '$SentToHomeOfficeApps.total',
            IsPaidTrueApps: '$IsPaidTrueApps.total',
            IsPaidFalseApps: '$IsPaidFalseApps.total',
            DBSEligibleForReprintApps: '$DBSEligibleForReprintApps.total',
          },
        },
      ]);

      return {
        message: 'Success',
        statusCode: 200,
        data: { totalCountOfDBSApp },
        error: null,
      };
    } catch (error) {
      throw new RpcException({
        statusCode: error?.statusCode
          ? error.statusCode
          : error?.status
          ? error.status
          : 400,
        message: error?.message ? error?.message : 'Bad Request',
        stack: error ? error : null,
      });
    }
  }

  async getApplicationsAssignedtoCounterSignatoryofCompany(
    offset = 0,
    limit = 10,
    sortBy = 'createdAt',
    sort = -1,
    searchTerm = '',
    from = 0,
    to = 26708647266,
    company,
    commented,
    userId,
  ) {
    try {
      console.log(
        offset,
        limit,
        sortBy,
        sort,
        searchTerm,
        from,
        to,
        company,
        commented,
        userId,
      );

      var query;
      searchTerm = searchTerm === '' ? '' : searchTerm.toLowerCase();
      const sterm = `.*${searchTerm}.*`;

      const f = new Date(from * 1000);
      const t = new Date(to * 1000);

      if (
        !['true', 'false', true, false].includes(company) ||
        !['true', 'false', true, false].includes(commented)
      ) {
        throw new BadRequestException('Bad Data Provided');
      }

      if (commented == 'false') {
        if (company == 'true') {
          query = {
            'CounterSignatoryState.CounterSignatoryId': userId,
            CompanyAdminID: { $exists: true, $nin: ['', null] },
            createdAt: { $gte: f, $lt: t },
            $or: [
              { 'CounterSignatoryState.commented': { $exists: false } },
              {
                'CounterSignatoryState.commented': {
                  $exists: true,
                  $in: [false, '', null],
                },
              },
            ],
          };
        } else {
          query = {
            'CounterSignatoryState.CounterSignatoryId': userId,
            createdAt: { $gte: f, $lt: t },
            CompanyAdminID: { $exists: false },
            $or: [
              { 'CounterSignatoryState.commented': { $exists: false } },
              {
                'CounterSignatoryState.commented': {
                  $exists: true,
                  $in: [false, '', null],
                },
              },
            ],
          };
        }
      } else {
        if (company == 'true') {
          query = {
            'CounterSignatoryState.CounterSignatoryId': userId,
            createdAt: { $gte: f, $lt: t },
            CompanyAdminID: { $exists: true, $nin: ['', null] },
            'CounterSignatoryState.commented': { $exists: true, $in: [true] },
          };
        } else {
          query = {
            'CounterSignatoryState.CounterSignatoryId': userId,
            createdAt: { $gte: f, $lt: t },
            CompanyAdminID: { $exists: false },
            'CounterSignatoryState.commented': { $exists: true, $in: [true] },
          };
        }
      }

      console.log(query);

      const response = await this.applicationmodel.aggregate([
        {
          $search: {
            index: 'applicationSearch',
            regex: {
              query: sterm,
              path: { wildcard: '*' },
              allowAnalyzedField: true,
            },
          },
        },
        {
          $match: query,
        },
        {
          $lookup: {
            from: 'users',
            localField: 'ApplicantId',
            foreignField: 'userId',
            as: 'user',
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
            from: 'users',
            localField: 'AssignTo',
            foreignField: 'userId',
            as: 'evedenceChecker',
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
          $unwind: {
            path: '$evedenceChecker',
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
          $lookup: {
            from: 'companies',
            localField: 'CompanyAdminID',
            foreignField: '_id',
            as: 'companyOfApplicant',
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
          $unwind: {
            path: '$companyOfApplicant',
            preserveNullAndEmptyArrays: true,
          },
        },
        { $sort: <any>{ [sortBy]: Number(sort) } },
        {
          $facet: {
            total: [{ $count: 'total' }],
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
                  $ifNull: [Number(limit), '$total.total'],
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
      //   throw new RpcException({statusCode:HttpStatus.NO_CONTENT})
      // }

      return {
        data: response[0]?.data ? response[0]?.data : [],
        meta: response[0]?.meta ? response[0]?.meta : {},
      };
    } catch (error) {
      console.log(error);
      throw new RpcException({
        statusCode: error?.statusCode
          ? error.statusCode
          : error?.status
          ? error.status
          : 400,
        message: error?.message ? error?.message : 'Bad Request',
        stack: error ? error : null,
      });
    }
  }

  // async getApplicationsAssignedtoCounterSignatoryofIndividual(
  //   counterSignatoryId,
  // ) {
  //   const applications = await this.applicationmodel.aggregate([
  //     {
  //       $match: {
  //         'CounterSignatoryState.CounterSignatoryId': counterSignatoryId,
  //         CompanyAdminID: { $exists: false },
  //         $or: [
  //           { 'CounterSignatoryState.commented': { $exists: false } },
  //           {
  //             'CounterSignatoryState.commented': {
  //               $exists: true,
  //               $in: [false, '', null],
  //             },
  //           },
  //         ],
  //       },
  //     },
  //   ]);

  //   return applications;
  // }

  // async getApplicationsAssignedtoCounterSignatoryofCompanyCommented(
  //   counterSignatoryId,
  // ) {
  //   const applications = await this.applicationmodel.aggregate([
  //     {
  //       $match: {
  //         'CounterSignatoryState.CounterSignatoryId': counterSignatoryId,
  //         CompanyAdminID: { $exists: true, $nin: ['', null] },
  //         'CounterSignatoryState.commented': { $exists: true, $in: [true] },
  //       },
  //     },
  //   ]);

  //   return applications;
  // }

  // async getApplicationsAssignedtoCounterSignatoryofIndividualCommented(
  //   counterSignatoryId,
  // ) {
  //   const applications = await this.applicationmodel.aggregate([
  //     {
  //       $match: {
  //         'CounterSignatoryState.CounterSignatoryId': counterSignatoryId,
  //         CompanyAdminID: { $exists: false },
  //         'CounterSignatoryState.commented': { $exists: true, $in: [true] },
  //       },
  //     },
  //   ]);

  //   return applications;
  // }

  async getAllAssignedApplicationsToCounterSignatory(
    offset = 0,
    limit = 10,
    counterSignatoryId,
  ) {
    try {
      console.log(offset, limit, counterSignatoryId);
      const response = await this.applicationmodel.aggregate([
        {
          $match: {
            'CounterSignatoryState.CounterSignatoryId': counterSignatoryId,
          },
        },
        {
          $lookup: {
            from: 'users',
            localField: 'ApplicantId',
            foreignField: 'userId',
            as: 'user',
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
          $unwind: {
            path: '$user',
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: 'users',
            let: { someField: { $ifNull: ['$AssignTo', null] } },
            pipeline: [
              {
                $match: {
                  $expr: { $and: [{ $eq: ['$userId', '$$someField'] }] },
                },
              },
              {
                $project: {
                  _id: 0,
                  forename: '$AllUser.forename',
                  surname: '$AllUser.surname',
                  username: '$AllUser.username',
                },
              },
            ],
            as: 'evedenceChecker',
          },
        },
        {
          $unwind: {
            path: '$evedenceChecker',
            preserveNullAndEmptyArrays: true,
          },
        },
        { $sort: { updatedAt: -1 } },
        {
          $facet: {
            total: [{ $count: 'total' }],
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
                  $ifNull: [Number(limit), '$total.total'],
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
      //   throw new RpcException({statusCode:HttpStatus.NO_CONTENT})
      // }

      return {
        data: response[0]?.data ? response[0]?.data : [],
        meta: response[0]?.meta ? response[0]?.meta : {},
      };
    } catch (error) {
      console.log(error);
      throw new RpcException({
        statusCode: error?.statusCode
          ? error.statusCode
          : error?.status
          ? error.status
          : 400,
        message: error?.message ? error?.message : 'Bad Request',
        stack: error ? error : null,
      });
    }
  }

  async submitApplicationByCounterSignatory(id) {
    console.log(id);
    try {
      const app = await this.applicationmodel.findByIdAndUpdate(
        id,
        {
          'ApplicationState.status': 'SentToHomeOffice',
          'CounterSignatoryState.CS_status': 'Completed',
          'ApplicationState.stage': 'Application sent to home office',
          'ApplicationState.innerStage':
            'Application completed and sent to home office',
        },
        { new: true },
      );

      return app;
    } catch (error) {
      console.log(error);

      return {
        statusCode: error?.status ? error?.status : 400,
        message: error?.message ? error?.message : 'Bad Request',
        stack: error ? error : null,
      };
    }
  }

  async getReconcilation(
    applicationId,
    offset = 0,
    limit = 10,
    sortBy = 'createdAt',
    sort = -1,
    searchTerm = '',
  ) {
    try {
      searchTerm = searchTerm == '' ? '' : searchTerm.toLowerCase();
      return await this.commitRepository.fastPaginate(
        {
          applicationId: applicationId,
          $or: [
            {
              signatoryReconciliation: {
                $regex: searchTerm.toLowerCase(),
                $options: 'i',
              },
            },
            {
              comment: {
                $regex: searchTerm.toLowerCase(),
                $options: 'i',
              },
            },
            {
              createBy: {
                $regex: searchTerm.toLowerCase(),
                $options: 'i',
              },
            },
          ],
        },
        offset,
        limit,
        sortBy,
        sort,
      );
    } catch (error) {
      console.log(error);
      throw new RpcException({
        statusCode: error?.statusCode
          ? error.statusCode
          : error?.status
          ? error.status
          : 400,
        message: error?.message ? error?.message : 'Bad Request',
        stack: error ? error : null,
      });
    }
  }

  async getComapnyAssignedApplications(
    id,
    offset = 0,
    limit = 10,
    stage = '',
    sortBy = 'createdAt',
    sort = -1,
    searchTerm = '',
    Assigned = undefined,
  ) {
    try {
      const stg =
        stage === ''
          ? {
              $in: this.stages,
            }
          : stage; //{ "$in": [...stage] };

      const assigned =
        Assigned === undefined
          ? { $in: [true, false, null, undefined, ''] }
          : Assigned == 'true'
          ? { $in: [true] }
          : { $in: [false, null, undefined, ''] };

      // searchTerm = searchTerm === '' ? '' : searchTerm.toLowerCase()
      const sterm = `.*${searchTerm}.*`;

      console.log(
        stg,
        id,
        ' details from request to search',
        ' SearchTerm : ',
        sterm,
        sortBy,
        sort,
        offset,
        limit,
      );

      const response = await this.applicationmodel.aggregate([
        {
          $search: {
            index: 'applicationSearch',
            regex: {
              query: sterm,
              path: { wildcard: '*' },
              allowAnalyzedField: true,
            },
          },
        },
        {
          $match: {
            CreateBy: id,
            'ApplicationState.stage': stg,
            Assigned: assigned,
          },
        },
        {
          $lookup: {
            from: 'users',
            localField: 'ApplicantId',
            foreignField: 'userId',
            as: 'user',
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
          $unwind: {
            path: '$user',
            preserveNullAndEmptyArrays: true,
          },
        },
        { $sort: <any>{ [sortBy]: Number(sort) } },
        {
          $facet: {
            total: [{ $count: 'total' }],
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
                  $ifNull: [Number(limit), '$total.total'],
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
      //   throw new RpcException({statusCode:HttpStatus.NO_CONTENT})
      // }
      return {
        data: response[0]?.data ? response[0]?.data : [],
        meta: response[0]?.meta ? response[0]?.meta : {},
      };
    } catch (error) {
      console.log(error);
      throw new RpcException({
        statusCode: error?.statusCode
          ? error.statusCode
          : error?.status
          ? error.status
          : 400,
        message: error?.message ? error?.message : 'Bad Request',
        stack: error ? error : null,
      });
    }
  }

  async getAssignedToMeApplications(
    id,
    offset = 0,
    limit = 10,
    stage = '',
    sortBy = 'createdAt',
    sort = -1,
    searchTerm = '',
  ) {
    try {
      console.log(id, stage, ' ddd');

      const stg =
        stage === ''
          ? {
              $in: this.stages,
            }
          : stage; //{ "$in": [...stage] };

      // searchTerm = searchTerm === '' ? '' : searchTerm.toLowerCase()
      const sterm = `.*${searchTerm}.*`;

      console.log(
        stg,
        id,
        ' details from request to search',
        ' SearchTerm : ',
        sterm,
        sortBy,
        sort,
        offset,
        limit,
      );

      const response = await this.applicationmodel.aggregate([
        {
          $search: {
            index: 'applicationSearch',
            regex: {
              query: sterm,
              path: { wildcard: '*' },
              allowAnalyzedField: true,
            },
          },
        },
        {
          $match: {
            AssignTo: id,
            'ApplicationState.stage': stg,
          },
        },
        {
          $lookup: {
            from: 'users',
            localField: 'ApplicantId',
            foreignField: 'userId',
            as: 'user',
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
          $unwind: {
            path: '$user',
            preserveNullAndEmptyArrays: true,
          },
        },
        { $sort: <any>{ [sortBy]: Number(sort) } },
        {
          $facet: {
            total: [{ $count: 'total' }],
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
                  $ifNull: [Number(limit), '$total.total'],
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
      //   throw new RpcException({statusCode:HttpStatus.NO_CONTENT})
      // }
      return {
        data: response[0]?.data ? response[0]?.data : [],
        meta: response[0]?.meta ? response[0]?.meta : {},
      };
    } catch (error) {
      console.log(error);
      throw new RpcException({
        statusCode: error?.statusCode
          ? error.statusCode
          : error?.status
          ? error.status
          : 400,
        message: error?.message ? error?.message : 'Bad Request',
        stack: error ? error : null,
      });
    }
    // return await this.applicationModel.fastPaginate({ AssignTo: id })
  }

  async applicationMarkRead(id) {
    try {
      const Application = await this.applicationModel.findOneAndUpdate(
        { _id: id },
        {
          $set: { MarkedAsRead: true },
        },
      );
      console.log('', Application, '');
      return Application;
    } catch (error) {
      throw new RpcException({
        statusCode: error?.statusCode
          ? error.statusCode
          : error?.status
          ? error.status
          : 400,
        message: error?.message ? error?.message : 'Bad Request',
        stack: error ? error : null,
      });
    }
  }

  async confirmReceipt({ applicationId, ConfirmReceipt }) {
    try {
      console.log(applicationId, 'applicationId');
      console.log(ConfirmReceipt, 'ConfirmReceipt');

      const Application = await this.applicationModel.findOneAndUpdate(
        { _id: applicationId },
        {
          $set: { ConfirmReceipt: ConfirmReceipt },
        },
      );

      console.log('', Application, '');

      return Application;
    } catch (error) {
      throw new RpcException({
        statusCode: error?.statusCode
          ? error.statusCode
          : error?.status
          ? error.status
          : 400,
        message: error?.message ? error?.message : 'Bad Request',
        stack: error ? error : null,
      });
    }
  }

  async certificateEligibleForReprint(
    userId,
    confirmReceipt = false,
    offset = 0,
    limit = 10,
    searchTerm = '',
    sortBy = 'createdAt',
    sort = -1,
    userRoles,
  ) {
    try {
      searchTerm = searchTerm === '' ? '' : searchTerm.toLowerCase();
      const sterm = `.*${searchTerm}.*`;

      const query =
        userRoles == 'EVIDENCE_CHECKER'
          ? {
              AssignTo: userId,
              ConfirmReceipt: confirmReceipt,
              'ApplicationState.status': 'Completed',
            }
          : userRoles == 'APPLICANT'
          ? {
              ApplicantId: userId,
              ConfirmReceipt: confirmReceipt,
              'ApplicationState.status': 'Completed',
            }
          : {
              CreateBy: userId,
              ConfirmReceipt: confirmReceipt,
              'ApplicationState.status': 'Completed',
            };

      const response = await this.applicationmodel.aggregate([
        {
          $search: {
            index: 'applicationSearch',
            regex: {
              query: sterm,
              path: { wildcard: '*' },
              allowAnalyzedField: true,
            },
          },
        },
        {
          $match: query,
        },
        {
          $lookup: {
            from: 'users',
            localField: 'ApplicantId',
            foreignField: 'userId',
            as: 'user',
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
          $unwind: {
            path: '$user',
            preserveNullAndEmptyArrays: true,
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
        { $sort: <any>{ [sortBy]: Number(sort) } },
        {
          $facet: {
            total: [{ $count: 'total' }],
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
                  $ifNull: [Number(limit), '$total.total'],
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
      //   throw new RpcException({statusCode:HttpStatus.NO_CONTENT})
      // }

      return {
        data: response[0]?.data ? response[0]?.data : [],
        meta: response[0]?.meta ? response[0]?.meta : {},
      };
    } catch (error) {
      console.log(error);
      throw new RpcException({
        statusCode: error?.statusCode
          ? error.statusCode
          : error?.status
          ? error.status
          : 400,
        message: error?.message ? error?.message : 'Bad Request',
        stack: error ? error : null,
      });
    }
  }

  // async assignedApplications(offset, limit,sortby, sort, ){
  //   try {
  //     const f = new Date(from * 1000);
  //     const t = new Date(to * 1000);

  //     const statusIn = status === ""
  //       ? { $in: ["Assigned", "Pending", "Rejected", "Completed", "InIssues", "InProgress", "InComplete", "ReturnedToUser", "SentToHomeOffice", "", undefined, null] }
  //       : { $in: [status] }

  //     const isp =
  //       isPaid === undefined
  //         ? { $in: [true, false, null, undefined, ""] }
  //         : isPaid == 'true'
  //           ? { $in: [true] }
  //           : { $in: [false] };
  //     const stg =
  //       stage === ''
  //         ? {
  //           $in: [
  //             'Rejected by Evidence Checker',
  //             'Rejected by Evidence Checker bbbbb', null, "", undefined
  //           ],
  //         }
  //         : stage; //{ "$in": [...stage] };

  //     searchTerm = searchTerm === '' ? '' : searchTerm.toLowerCase()
  //     const sterm = `.*${searchTerm}.*`

  //     console.log(f, t, isp, stg, createBy, " details from request to search", statusIn, " SearchTerm : ", sterm, sortBy, sort);

  //     const response = await this.applicationmodel.aggregate(
  //       [
  //         {
  //           $search: {
  //             index: 'applicationSearch',
  //             regex: {
  //               query: sterm,
  //               path: { wildcard: "*" },
  //               allowAnalyzedField: true
  //             }
  //           }
  //         },
  //         {
  //           $match: {
  //             CreateBy: createBy,
  //             createdAt: { $gte: f, $lt: t },
  //             'ApplicationState.isPaid': isp,
  //             'ApplicationState.stage': stg,
  //             'ApplicationState.status': statusIn,
  //             // $or: [
  //             //   {
  //             //     _id: {
  //             //       $regex: searchTerm,
  //             //       $options: 'i',
  //             //     },
  //             //   },
  //             //   {
  //             //     ApplicantId: {
  //             //       $regex: searchTerm,
  //             //       $options: 'i',
  //             //     },
  //             //   },
  //             //   {
  //             //     'PersonalDetails.firstName': {
  //             //       $regex: searchTerm,
  //             //       $options: 'i',
  //             //     },
  //             //   },
  //             //   {
  //             //     'PersonalDetails.IstMidName': {
  //             //       $regex: searchTerm,
  //             //       $options: 'i',
  //             //     },
  //             //   },
  //             // ],
  //           },
  //         },
  //         {
  //           $lookup: {
  //             from: 'users',
  //             localField: 'ApplicantId',
  //             foreignField: 'userId',
  //             as: 'user',
  //             pipeline: [
  //               { $limit: 1 },
  //               {
  //                 $project: {
  //                   _id: 0,
  //                   forename: '$AllUser.forename',
  //                   surname: '$AllUser.surname',
  //                   username: '$AllUser.username',
  //                 },
  //               },
  //             ],
  //           },
  //         },
  //         {
  //           $unwind: {
  //             path: '$user',
  //             preserveNullAndEmptyArrays: true,
  //           },
  //         },
  //         { $sort: <any>({ [sortBy]: Number(sort) }) },
  //         {
  //           $facet: {
  //             total: [{ $count: 'total' }],
  //             data: [{ $skip: Number(offset) }, { $limit: Number(limit) }],
  //           },
  //         },
  //         {
  //           $unwind: '$total',
  //         },
  //         {
  //           $project: {
  //             data: {
  //               $slice: [
  //                 '$data',
  //                 Number(offset),
  //                 {
  //                   $ifNull: [Number(limit), '$total.total'],
  //                 },
  //               ],
  //             },
  //             meta: {
  //               total: '$total.total',
  //               page: {
  //                 $literal: Number(offset) / Number(limit) + 1,
  //               },
  //               pages: {
  //                 $ceil: {
  //                   $divide: ['$total.total', Number(limit)],
  //                 },
  //               },
  //             },
  //           },
  //         },
  //       ]
  //     );
  //     return response;
  //   } catch (error) {
  //     console.log(error);

  //     throw new RpcException(error);
  //   }
  // }

  // //List of total count of DBS Applications for counter Signatory
  async totalCountOfDBSApplicationCS(counterSignatoryId) {
    try {
      const [CSAppCount] = await this.applicationModel.aggregate([
        {
          $match: {
            'CounterSignatoryState.CounterSignatoryId': counterSignatoryId,
          },
        },
        {
          $facet: {
            CSCommentedTrue: [
              {
                $match: {
                  'CounterSignatoryState.commented': true,
                },
              },
              {
                $count: 'total',
              },
            ],
            CSCommentedFalse: [
              {
                $match: {
                  'CounterSignatoryState.commented': false,
                },
              },
              {
                $count: 'total',
              },
            ],
            CS_status_New: [
              {
                $match: {
                  'CounterSignatoryState.CS_status': 'New',
                },
              },
              {
                $count: 'total',
              },
            ],
            CS_status_InProgress: [
              {
                $match: {
                  'CounterSignatoryState.CS_status': 'InProgress',
                },
              },
              {
                $count: 'total',
              },
            ],
            CS_TotalAssigned: [
              {
                $count: 'total',
              },
            ],
          },
        },
        {
          $unwind: {
            path: '$CSCommentedTrue',
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $unwind: {
            path: '$CSCommentedFalse',
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $unwind: {
            path: '$CS_status_New',
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $unwind: {
            path: '$CS_status_InProgress',
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $unwind: {
            path: '$CS_TotalAssigned',
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $project: {
            CSCommentedFalse: '$CSCommentedFalse.total',
            CSCommentedTrue: '$CSCommentedTrue.total',
            CS_status_New: '$CS_status_New.total',
            CS_status_InProgress: '$CS_status_InProgress.total',
            CS_TotalAssigned: '$CS_TotalAssigned.total',
          },
        },
      ]);
      console.log(CSAppCount);
      return {
        message: 'Success',
        statusCode: 200,
        data: { CSAppCount },
        error: null,
      };
    } catch (error) {
      throw new RpcException({
        statusCode: error?.statusCode
          ? error.statusCode
          : error?.status
          ? error.status
          : 400,
        message: error?.message ? error?.message : 'Bad Request',
        stack: error ? error : null,
      });
    }
  }

  async InCompleteDBSApplications(
    offset = 0,
    limit = 10,
    sortBy = 'createdAt',
    sort = -1,
    searchTerm = '',
    from = 0,
    to = 26708647266,
    userId,
    userRoles,
  ) {
    try {
      console.log(
        offset,
        limit,
        sortBy,
        sort,
        searchTerm,
        from,
        to,
        userId,
        userRoles,
      );

      searchTerm = searchTerm === '' ? '' : searchTerm.toLowerCase();
      const sterm = `.*${searchTerm}.*`;

      // 48 hr back
      let sevenDaysBefore = new Date();
      sevenDaysBefore.setDate(sevenDaysBefore.getDate() - 7);

      const f = new Date(from * 1000);
      const t = new Date(to * 1000);
      console.log(userRoles);

      const query =
        userRoles === 'EVIDENCE_CHECKER'
          ? {
              AssignTo: userId,
              'ApplicationState.status': { $in: ['Pending', 'InProgress'] },
              updatedAt: { $lte: sevenDaysBefore },
              createdAt: { $gte: f, $lt: t },
            }
          : userRoles === 'APPLICANT'
          ? {
              ApplicantId: userId,
              'ApplicationState.status': { $in: ['Pending', 'InProgress'] },
              updatedAt: { $lte: sevenDaysBefore },
              createdAt: { $gte: f, $lt: t },
            }
          : userRoles == 'INDIVIDUAL_USER'
          ? {
              CreateBy: userId,
              'ApplicationState.status': { $in: ['Pending', 'InProgress'] },
              // updatedAt: { $lte: sevenDaysBefore },
              createdAt: { $gte: f, $lt: t },
            }
          : {
              CreateBy: userId,
              'ApplicationState.status': { $in: ['Pending', 'InProgress'] },
              updatedAt: { $lte: sevenDaysBefore },
              createdAt: { $gte: f, $lt: t },
            };

      console.log(query);

      const response = await this.applicationmodel.aggregate([
        {
          $search: {
            index: 'applicationSearch',
            regex: {
              query: sterm,
              path: { wildcard: '*' },
              allowAnalyzedField: true,
            },
          },
        },
        {
          $match: query,
        },
        {
          $lookup: {
            from: 'users',
            localField: 'ApplicantId',
            foreignField: 'userId',
            as: 'user',
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
          $unwind: {
            path: '$user',
            preserveNullAndEmptyArrays: true,
          },
        },
        { $sort: <any>{ [sortBy]: Number(sort) } },
        {
          $facet: {
            total: [{ $count: 'total' }],
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
                  $ifNull: [Number(limit), '$total.total'],
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
      //   throw new RpcException({statusCode:HttpStatus.NO_CONTENT})
      // }

      return {
        data: response[0]?.data ? response[0]?.data : [],
        meta: response[0]?.meta ? response[0]?.meta : {},
      };
    } catch (error) {
      console.log(error);
      throw new RpcException({
        statusCode: error?.statusCode
          ? error.statusCode
          : error?.status
          ? error.status
          : 400,
        message: error?.message ? error?.message : 'Bad Request',
        stack: error ? error : null,
      });
    }
  }

  async applicationsPendingForEvedenceCheck(
    offset = 0,
    limit = 10,
    sortBy = 'createdAt',
    sort = -1,
    searchTerm = '',
    userId,
    userRoles,
  ) {
    try {
      console.log(offset, limit, sortBy, sort, searchTerm, userId, userRoles);

      searchTerm = searchTerm === '' ? '' : searchTerm.toLowerCase();
      const sterm = `.*${searchTerm}.*`;

      // 48 hr back
      let sevenDaysBefore = new Date();
      sevenDaysBefore.setDate(sevenDaysBefore.getDate() - 7);

      const query =
        userRoles === 'EVIDENCE_CHECKER'
          ? {
              AssignTo: userId,
              'ApplicationState.status': 'SendToEC',
              updatedAt: { $lte: sevenDaysBefore },
            }
          : {
              CreateBy: userId,
              'ApplicationState.status': 'SendToEC',
              updatedAt: { $lte: sevenDaysBefore },
            };

      console.log(searchTerm, sterm, ' searchTerm');

      console.log(query);

      const response = await this.applicationmodel.aggregate([
        {
          $search: {
            index: 'applicationSearch',
            regex: {
              query: sterm,
              path: { wildcard: '*' },
              allowAnalyzedField: true,
            },
          },
        },
        {
          $match: query,
        },
        {
          $lookup: {
            from: 'users',
            localField: 'ApplicantId',
            foreignField: 'userId',
            as: 'user',
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
          $unwind: {
            path: '$user',
            preserveNullAndEmptyArrays: true,
          },
        },
        { $sort: <any>{ [sortBy]: Number(sort) } },
        {
          $facet: {
            total: [{ $count: 'total' }],
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
                  $ifNull: [Number(limit), '$total.total'],
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
      //   throw new RpcException({statusCode:HttpStatus.NO_CONTENT})
      // }

      return {
        data: response[0]?.data ? response[0]?.data : [],
        meta: response[0]?.meta ? response[0]?.meta : {},
      };
    } catch (error) {
      console.log(error);
      throw new RpcException({
        statusCode: error?.statusCode
          ? error.statusCode
          : error?.status
          ? error.status
          : 400,
        message: error?.message ? error?.message : 'Bad Request',
        stack: error ? error : null,
      });
    }
  }
}
