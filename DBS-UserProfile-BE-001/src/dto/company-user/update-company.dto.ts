
import { ICompanyDetails, IYourDetails, ICompanyAdminUser, ICompanyPreferences } from "../../interfaces/company-user.interface"

export class UpdateCompanyDto {
  userId: string;
  companyDetails?: ICompanyDetails;
  yourDetails?: IYourDetails;
  companyAdminUser?: ICompanyAdminUser;
  companyPreferences?: ICompanyPreferences
  defaultRole?: string;
}




