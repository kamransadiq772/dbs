// import { SchemaFactory } from '@nestjs/mongoose/dist/factories';
// import { Prop, Schema } from '@nestjs/mongoose/dist/decorators';
// import { object, string } from 'joi';

// @Schema({
//     versionKey: false,
//     timestamps: true,
// })
// export class User {
//     @Prop({ type: String, required: true })
//     _id: string;
    
//     @Prop({ type: String, required: true })
//     firstName:string;

//     @Prop({ type: String, required: true })
//     lastName:string;

//     @Prop({ type: String, required: true })
//     email:string;

//     @Prop({ type: String, required: true })
//     phoneNumber:string;

//     @Prop({ type: String, required: true })
//     accountType:string;

//     @Prop({ type: String, required: true })
//     status:string;

//     @Prop({ type: String, required: true })
//     createdDate:any;
    

// }

// export const UserSchema = SchemaFactory.createForClass(User);

//--------------------------------------------------------------------

import { SchemaFactory } from '@nestjs/mongoose/dist/factories';
import { Prop, Schema } from '@nestjs/mongoose/dist/decorators';
import { object } from 'joi';
import {IAllUser,IBasic,IUser} from '../interfaces/user.interface'
@Schema({
  versionKey: false,
  timestamps: true,
})
export class User {
  @Prop({ type: String, required: true })
  _id: string;

  @Prop({ type: Object, required: true })
  AllUser: IAllUser

  @Prop({ type: Object, required: false })
  UserDetails: IUser

  @Prop({ type: Object, required: false })
  ApplicantBasic: IBasic

  @Prop({ type: String, required: true })
  defaultRole: string;
}

export const UserSchema = SchemaFactory.createForClass(User);