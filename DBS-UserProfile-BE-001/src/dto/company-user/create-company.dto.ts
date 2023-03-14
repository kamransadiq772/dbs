
import { ICompanyDetails, IYourDetails, ICompanyAdminUser, ICompanyPreferences } from "../../interfaces/company-user.interface"

export interface CreateCompanyDto {
  userId: string;
  companyDetails: ICompanyDetails;
  yourDetails: IYourDetails;
  companyAdminUser: ICompanyAdminUser;
  companyPreferences: ICompanyPreferences
  defaultRole: string;
}




