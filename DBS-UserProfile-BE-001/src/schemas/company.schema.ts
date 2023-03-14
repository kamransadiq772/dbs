import { SchemaFactory } from '@nestjs/mongoose/dist/factories';
import { Prop, Schema } from '@nestjs/mongoose/dist/decorators';
import { object } from 'joi';
import { ICompanyDetails, ICompanyPreferences, ICompanyAdminUser, IYourDetails } from "../interfaces/company-user.interface";

@Schema({
  versionKey: false,
  timestamps: true,
})
export class Company {
  @Prop({ type: String, required: true })
  _id: string;

  @Prop({ type: Object, required: false })
  companyDetails?: ICompanyDetails;

  @Prop({ type: Object, required: true })
  yourDetails: IYourDetails;

  @Prop({ type: Object, required: true })
  companyAdminUser: ICompanyAdminUser;

  @Prop({ type: Object, required: true })
  companyPreferences: ICompanyPreferences;

  @Prop({ type: String, required: true })
  defaultRole?: string;
}

export const CompanySchema = SchemaFactory.createForClass(Company);
