import { SchemaFactory } from '@nestjs/mongoose/dist/factories';
import { Prop, Schema } from '@nestjs/mongoose/dist/decorators';
import { object } from 'joi';

@Schema({
  versionKey: false,
  timestamps: true,
})
export class Individual {
  @Prop({ type: String, required: true })
  _id: string;

  @Prop({ type: String, required: false})
  profilePic?: string;

  @Prop({ type: String, required: false })
  positionApplyingFor?: string;

  @Prop({ type: String, required: false })
  disclosureType?: string;

  @Prop({ type: Boolean, required: false })
  isVolunteer?: boolean;

  @Prop({ type: Boolean, required: false })
  willPay?: boolean;

  @Prop({ type: String, required: true })
  foreName: string;

  @Prop({ type: String, required: true })
  surName: string;

  @Prop({ type: String, required: true })
  DOB: string;

  @Prop({ type: String, required: true })
  postCode: string;

  @Prop({ type: String, required: true })
  userName: string;

  @Prop({ type: String, required: true })
  email: string;

  @Prop({ type: String, required: true })
  phone: string;

  @Prop({ type: String, required: true })
  mobile: string;

  @Prop({ type: Boolean, required: false })
  dataPolicy?: boolean;

  @Prop({ type: Boolean, required: false })
  termsPolicy?: boolean;

  @Prop({ type: Boolean, required: false })
  privacyPolicy?: boolean;

  @Prop({ type: String, required: false })
  defaultRole?: string;

  @Prop({ type: String, required: false })
  gender?: string;

  @Prop({ type: String, required: false })
  nationality?: string;

  @Prop({ type: String, required: false })
  addressFirstLine?: string;

  @Prop({ type: String, required: false })
  addressSecondLine?: string;

  @Prop({ type: String, required: false })
  country?: string;

  @Prop({ type: String, required: false })
  townCity?: string;

  @Prop({ type: String, required: false })
  userType?: string;

  @Prop({ type: String, required: false })
  rightToWork?: string;
}

export const IndividualSchema = SchemaFactory.createForClass(Individual);
