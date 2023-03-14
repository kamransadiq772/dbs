import { SchemaFactory } from '@nestjs/mongoose';
import { Prop, Schema } from '@nestjs/mongoose/dist/decorators';

@Schema({versionKey:false,timestamps:true})
export class AppHist{

  @Prop({type:Object})
  Application:object

  @Prop({type:String})
  createdBy: string
}

export const AppHistSchema = SchemaFactory.createForClass(AppHist)