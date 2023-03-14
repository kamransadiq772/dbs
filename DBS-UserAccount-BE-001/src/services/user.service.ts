import { Inject, Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { RpcException } from "@nestjs/microservices";
import { CognitoIdentityServiceProvider } from "aws-sdk/clients/all";
import { CreateUserDto } from "../dto/user/create-userr.dto";
import { createHmac } from 'crypto';
import { UpdateUserDto } from "../dto/user/update-user.dto";
import {
    ConfirmSignUpRequest,
    InitiateAuthRequest,
    SignUpRequest,
    ResendConfirmationCodeRequest,
    AdminRespondToAuthChallengeRequest,
    AdminCreateUserRequest,
    ForgotPasswordRequest,
    ConfirmForgotPasswordRequest,
    AdminAddUserToGroupRequest,
    ListUsersRequest,
    AdminGetUserRequest,
    AdminDeleteUserRequest,
    AdminResetUserPasswordRequest,
    AdminSetUserPasswordRequest,
} from 'aws-sdk/clients/cognitoidentityserviceprovider';
import { UserRepository } from "../repositories/user.repository";
import { InjectModel } from "@nestjs/mongoose";
import { UserPermission } from "../schemas/userpermission.schema.t";
import { User } from '../schemas/user.schema'
import mongoose, { Model } from "mongoose";
// const nodemailer = require('nodemailer')

import aws from 'aws-sdk'

@Injectable()
export class UserService {
    protected readonly logger = new Logger(UserService.name)

    constructor(
        private config: ConfigService,
        private userRepository: UserRepository,
        @Inject('CognitoIDP') private cognitoIDP: CognitoIdentityServiceProvider,
        @InjectModel(UserPermission.name) private userPermissionModel: Model<UserPermission>,
        @InjectModel(User.name) private userModel: Model<User>
    ) { }

    // async addUser(dto: CreateUserDto) {
    //     try {
    //         const params : AdminCreateUserRequest = {
    //             UserPoolId: this.config.get('COGNITO_USERPOOL_ID'),
    //               TemporaryPassword: "TEMP_pw123",
    //               Username: dto.email,
    //             };

    //             console.log("create User Request!");

    //           const response = await this.cognitoIDP.adminCreateUser(params).promise();
    //         return response;
    //         // return await this.userRepository.create(dto)
    //     } catch (e) {
    //         throw new RpcException(e.message)
    //     }
    // }
    async findOneById(dto: { _id: string }) {
        try {
            const {
                _id
            } = dto;

            // const params : AdminGetUserRequest = {
            //     UserPoolId:this.config.get('COGNITO_USERPOOL_ID'),
            //     Username:_id
            // }

            // const response = await this.cognitoIDP.adminGetUser(params).promise()
            // return response;

            //with repsitory
            // return await this.userRepository.findOne({ _id });

            //with ref to users table
            const responst = await this.userPermissionModel.aggregate([
                {
                    $match: {
                        userId: _id
                    }
                },
                // {
                //     $limit:1
                // },
                {
                    $limit: 1
                },
                {
                    $lookup: {
                        from: 'users',
                        localField: 'userId',
                        foreignField: '_id',
                        as: "user_details"
                    }
                }])
            if (responst.length < 1) {
                throw new Error("No record found with the given ID")
            }

            // if(responst[0].user_details.length>0){
            //     delete i.user_details[0]["createdAt"]
            //     delete i.user_details[0]["updatedAt"]
            // }


            return {
                _id: responst[0]?._id,
                userId: responst[0]?.userId,
                defaultRole: responst[0]?.defaultRole,
                allowedPermissions: responst[0]?.allowedPermissions,
                username: responst[0]?.user_details[0]?.AllUser?.username,
                email: responst[0]?.user_details[0]?.AllUser?.email,
                Active: responst[0]?.user_details[0]?.ApplicantStandard?.Active,
                userType: responst[0]?.user_details[0]?.AllUser?.userType,
                userDefaultRole: responst[0]?.user_details[0]?.defaultRole,
            }
        } catch (e) {
            throw new RpcException(e.message)
        }
    }
    async getUsers() {
        try {
            //cognito
            // const params : ListUsersRequest = {
            //     UserPoolId:this.config.get('COGNITO_USERPOOL_ID')
            // }
            // console.log("List user Request");

            // const response = await this.cognitoIDP.listUsers(params).promise()
            // return response;

            //with repository
            // return await this.userRepository.find({},{/*_id:0*/})

            // with ref to users table
            const responst = await this.userPermissionModel.aggregate([
                {
                    $lookup: {
                        from: 'users',
                        localField: 'userId',
                        foreignField: '_id',
                        as: "user_details"
                    }
                    // },
                    // {
                    //     $project:{
                    //         _id:1,
                    //         userId:1,
                    //         defaultRole:1,
                    //         allowedPermissions:1,
                    //         user_details:1,
                    //         "user_details[0].UserDetails":1,
                    //         // "user_details[0].UserDetails.username":1,
                    //         // "user_details[0].UserDetails.username":1,
                    //         // "user_details[0].UserDetails.username":1,
                    //         // "user_details[0].UserDetails.username":1,
                    //         // "user_details[0].UserDetails.username":1,
                    //         // "user_details[0].UserDetails.username":1,
                    //         // "user_details[0].UserDetails.username":1,
                    //     }
                    // },
                    // {
                    //     $addFields : {
                    //         user : "allowedPermissions"
                    // }
                }
            ])


            if (responst.length < 1) {
                throw new Error("records are empty")
            }

            return responst.map(i => ({
                _id: i._id,
                userId: i.userId,
                defaultRole: i.defaultRole,
                allowedPermissions: i.allowedPermissions,
                username: i.user_details[0]?.AllUser?.username,
                email: i.user_details[0]?.AllUser?.email,
                Active: i.user_details[0]?.ApplicantStandard?.Active,
                userType: i.user_details[0]?.AllUser?.userType,
                userDefaultRole: i.user_details[0]?.defaultRole
            }))

            // return responst


        } catch (e) {
            throw new RpcException(e.message)
        }

    }
    async listUserPagination(offset: Number = 0, limit: Number = 20) {
        try {
            const responst = await this.userPermissionModel.aggregate([
                // {
                //     $skip: Number(offset)
                // }
                // ,
                // {
                //     $limit: Number(limit)
                // }
                // ,
                {
                    $lookup: {
                        from: 'users',
                        localField: 'userId',
                        foreignField: '_id',
                        as: "user_details"
                    }
                },
                {
                    '$facet': {
                        count: [{ $count: "total" }], //{ $addFields: { skip: skip, limit: limit } }
                        data: [{ $skip: Number(offset) }, { $limit: Number(limit) }]
                    }
                }
            ])

            const res1 = responst[0]?.data?.map(i => ({
                _id: i._id,
                userId: i.userId,
                defaultRole: i.defaultRole,
                allowedPermissions: i.allowedPermissions,
                username: i.user_details[0]?.AllUser?.username,
                email: i.user_details[0]?.AllUser?.email,
                Active: i.user_details[0]?.ApplicantStandard?.Active,
                userType: i.user_details[0]?.AllUser?.userType,
                userDefaultRole: i.user_details[0]?.defaultRole
            }))

            return {
                collections: res1,
                total: responst[0]?.count[0]?.total || 0,
                offset: offset,
                limit: limit
            }

        } catch (err) {
            throw new RpcException(err)
        }
    }
    async searchUserPagination(searchTerm: string, offset: Number = 0, limit: Number = 20) {
        try {
            const responst = await this.userPermissionModel.aggregate([
                {
                    $lookup: {
                        from: 'users',
                        localField: 'userId',
                        foreignField: '_id',
                        as: "user_details"
                    }
                },
                {
                    $match: {
                        $or: [
                            { userId: { $regex: searchTerm.toLowerCase(), $options: "i" } },
                            { "user_details.AllUser.username": { $regex: searchTerm.toLowerCase(), $options: "i" } },
                            { "user_details.AllUser.email": { $regex: searchTerm.toLowerCase(), $options: "i" } }
                        ]
                    }
                },
                // {
                //     $skip:Number(offset)
                // },
                // {
                //     $limit:Number(limit)
                // },
                {
                    '$facet': {
                        count: [{ $count: "total" }], //{ $addFields: { skip: skip, limit: limit } }
                        data: [{ $skip: Number(offset) }, { $limit: Number(limit) }]
                    }
                }

            ])
            const res1 = responst[0]?.data?.map(i => ({
                _id: i._id,
                userId: i.userId,
                defaultRole: i.defaultRole,
                allowedPermissions: i.allowedPermissions,
                username: i.user_details[0]?.AllUser?.username,
                email: i.user_details[0]?.AllUser?.email,
                Active: i.user_details[0]?.ApplicantStandard?.Active,
                userType: i.user_details[0]?.AllUser?.userType,
                userDefaultRole: i.user_details[0]?.defaultRole
            }))
            return {
                collections: res1,
                total: responst[0]?.count[0]?.total || 0,
                offset: offset,
                limit: limit
            }
        } catch (err) {
            throw new RpcException(err)
        }
    }
    async getUserswithApplications(AdminID, offset: Number = 0, limit: Number = 20) {
        try {
            // const responst = await this.userPermissionModel.aggregate([
            //     {
            //         $lookup: {
            //             from: 'applications',
            //             localField: '_id',
            //             foreignField: 'UserID',
            //             as: "applications",
            //             pipeline:[{
            //                 '$sort': {  'createdAt': -1 }
            //             }]
            //         }
            //     },
            //     {
            //         $lookup: {
            //             from: 'users',
            //             localField: 'userId',
            //             foreignField: '_id',
            //             as: "user_details"
            //         }
            //     },
            //     {
            //         $skip:Number(offset)
            //     },
            //     {
            //         $limit:Number(limit)
            //     },
            //     {
            //         $unwind: "$applications",
            //     },
            //     {
            //         $unwind: "$user_details",
            //     },
            //     {
            //         $project:{
            //             _id:1,
            //             userId:1,
            //             role:1,
            //             // "applications.ApplicationState.status":1,
            //             // "applications":"$applications.ApplicationState",
            //             "applications":"$applications.createdAt",
            //             "user_details":"$user_details.AllUser",
            //         }
            //     },
            // ])
            const responst = await this.userModel.aggregate([
                {
                    $match: { _id: 'cfc584d6-cd90-4d01-b932-0a389445c177' }
                },
                {
                    $lookup: {
                        from: 'applications',
                        localField: '_id',
                        foreignField: 'AdminID',
                        as: "applications",
                        pipeline: [{
                            '$sort': { 'createdAt': -1 }
                        }]
                    }
                },
                {
                    $skip: Number(offset)
                },
                {
                    $limit: Number(limit)
                },
                // {
                //     $unwind: "$applications",
                // },
                {
                    $project: {
                        _id: 1,
                        AllUser: 1,
                        "applications": "$applications.ApplicationState",
                    }
                },
            ])
            return responst
        } catch (err) {
            throw new RpcException(err)
        }
    }
    async deleteUser(dto: { _id: string }) {
        try {
            const {
                _id
            } = dto;

            // const params : AdminDeleteUserRequest = {
            //     UserPoolId:this.config.get('COGNITO_USERPOOL_ID'),
            //     Username:_id
            // }

            // const response = await this.cognitoIDP.adminDeleteUser(params).promise()
            // return response;

            return await this.userRepository.delete({ _id });
        } catch (e) {
            throw new RpcException(e.message)
        }

    }
    async updateUser(dto: UpdateUserDto) {
        try {
            const { _id, ...user } = dto;

            return this.userRepository.findOneAndUpdate({ _id }, user)
        } catch (e) {
            throw new RpcException(e.message)
        }
    }

    // async resendPassword({email}:{email:string}) {
    //     try {
    //       const params: AdminCreateUserRequest = {
    //         UserPoolId: this.config.get('COGNITO_USERPOOL_ID'),
    //         Username: email,
    //         MessageAction: 'RESEND',
    //         DesiredDeliveryMediums: ['EMAIL'],
    //       };

    //       await this.cognitoIDP.adminCreateUser(params).promise();
    //       return {
    //         data: null,
    //         message: 'Password resent successfully.',
    //         errors: null,
    //       };
    //     } catch (err) {
    //       throw new RpcException(err);
    //     }
    //   }

    // async resendPassword({email}:{email:string}) {
    //     try {
    //       const params: AdminResetUserPasswordRequest = {
    //         UserPoolId: this.config.get('COGNITO_USERPOOL_ID'),
    //         Username: email,
    //         // MessageAction: 'RESEND',
    //         // DesiredDeliveryMediums: ['EMAIL'],
    //         ClientMetadata:{
    //             "email":`${email}`
    //         }
    //       };

    //       await this.cognitoIDP.adminResetUserPassword(params).promise();
    //       return {
    //         data: null,
    //         message: 'Password resent successfully.',
    //         errors: null,
    //       };
    //     } catch (err) {
    //       throw new RpcException(err);
    //     }
    //   }

    // async resendPassword({ email }: { email: string }) {

    //     try {

    //         // const pass = "Kamran123456*"
    //         const pass = this.getSecretHash(email)
    //         console.log(pass);



    //         const params: AdminSetUserPasswordRequest = {
    //             Password: pass,
    //             Permanent: false,
    //             UserPoolId: this.config.get('COGNITO_USERPOOL_ID'),
    //             Username: email,
    //         };
    //         await this.cognitoIDP.adminSetUserPassword(params).promise();
    //         await this.sendMail(email, pass);
    //         console.log(pass);

    //         return {
    //             data: null,
    //             message: 'Password resent successfully.',
    //             errors: null,
    //         };
    //     } catch (err) {
    //         throw new RpcException(err);
    //     }
    // }



    // private getSecretHash(email) {
    //     const hasher = createHmac('sha256', Date.now().toString());
    //     hasher.update(`${email}`);
    //     return hasher.digest('base64');
    // }
    // async sendMail(to, pass) {
    //     try {
    //         var nodemailer = require('nodemailer');

    //         var transporter = nodemailer.createTransport({
    //             service: 'gmail',
    //             auth: {
    //                 user: 'kamransadiq772@gmail.com',
    //                 pass: 'byuetaaqihjcfvbj'
    //             }
    //         });

    //         var mailOptions = {
    //             from: 'kamransadiq772@gmail.com',
    //             to: to,
    //             subject: 'Temporary Password set by Administrator',
    //             // text: `Your temporary Password is    

    //             //   ${pass} 

    //             //   kindly reset password as soon as possible`,

    //             html: `<h1>Temporary Login DBS Password</h1><p>A Temporary Password is sent by Admin.</p><br /><br /><h3>${pass}</h3><br /><br /><p>Kindly reset password as soon as possible</p>`
    //         };

    //         transporter.sendMail(mailOptions, function (error, info) {
    //             if (error) {
    //                 throw new Error(error)
    //             }
    //         });
    //     } catch (error) {
    //         throw new Error(error)
    //     }
    // }
}

//    // const pass = (Math.random()+1).toString(36).substring(7)
//    const pass = "Kamran12345*"
//    //     const html = `<html>
//    // <body>
//    // Admin has reset your password and your new password is below.
//    // Its an temporary password, Please reset as soon as possible.
//    // <br />
//    // <br />
//    // <br />
//    // <br />
//    // <h1>${pass}</h1>
//    // <body>
//    // </html>`

//    const SESConfig = {
//        apiVersion: "2010-12-01",
//        accessKeyId: "AKIAWFFJPZVN5SFWTDVN",
//        accessSecretKey: "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",
//        region: "us-east-1"
//    }
//    aws.config.update(SESConfig);

//    // Create sendEmail params
//    var emailParams = {
//        Destination: { /* required */
//            CcAddresses: [
//                'EMAIL_ADDRESS',
//                /* more items */
//            ],
//            ToAddresses: [
//                email,
//                /* more items */
//            ]
//        },
//        Message: { /* required */
//            Body: { /* required */
//                Html: {
//                    Charset: "UTF-8",
//                    Data: "HTML_FORMAT_BODY"
//                },
//                Text: {
//                    Charset: "UTF-8",
//                    Data: "TEXT_FORMAT_BODY"
//                }
//            },
//            Subject: {
//                Charset: 'UTF-8',
//                Data: pass
//            }
//        },
//        Source: 'kamransadiq772@gmail.com', /* required */
//        ReplyToAddresses: [
//            'EMAIL_ADDRESS',
//            /* more items */
//        ],
//    };

//    const ses = new aws.SES({apiVersion: '2010-12-01'})
//    await ses.sendEmail(emailParams).promise()