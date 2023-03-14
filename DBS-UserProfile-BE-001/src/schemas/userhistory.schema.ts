import { SchemaFactory } from '@nestjs/mongoose/dist/factories';
import { Prop, Schema } from '@nestjs/mongoose/dist/decorators';
import { object, string } from 'joi';
import { IAllUser, IBasic,  IUser } from 'src/interfaces/user.interface';

@Schema({
  versionKey: false,
  timestamps: true,
})
export class UserHistory {

    @Prop({type:String})
    CreatedBy:string

    @Prop({type:Object})
    user:any

    @Prop({type:String})
    action:string

}

export const UserhistorySchema = SchemaFactory.createForClass(UserHistory);
