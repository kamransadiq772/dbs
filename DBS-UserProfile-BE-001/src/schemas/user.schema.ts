import { SchemaFactory } from '@nestjs/mongoose/dist/factories';
import { Prop, Schema } from '@nestjs/mongoose/dist/decorators';
import { object, string } from 'joi';
import { IAllUser, IBasic,  IUser } from 'src/interfaces/user.interface';

@Schema({
  versionKey: false,
  timestamps: true,
})
export class User {
  @Prop({ type: String })
  companyAdminId: string;

  // @Prop({ type: String, required: true })
  // cretaedBy: string;
  @Prop({ type: String })
  CreatedBy: string;

  @Prop({ type: String, required: true })
  userId: string;

  @Prop({ type: Object, required: true })
  AllUser: IAllUser

  @Prop({ type: Object, required: false })
  UserDetails: IUser

  @Prop({ type: Object, required: false })
  ApplicantBasic: IBasic

  @Prop({ type: String, required: true })
  defaultRole: string;

  @Prop({type:String, required:false})
  AssignedBy?:string;

  @Prop({type:String, required:false})
  AssignedTo?:string;

  @Prop({type:Boolean, required:false, default:false})
  Assigned?:boolean;

}

export const UserSchema = SchemaFactory.createForClass(User);
