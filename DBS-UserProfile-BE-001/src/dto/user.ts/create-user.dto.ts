import { IAllUser, IBasic, IUser } from '../../interfaces/user.interface';

export class CreateUserDto {
  CreatedBy:string;
  createdByRole:any;
  userId: string;
  AllUser: IAllUser;
  UserDetails: IUser;
  ApplicantBasic: IBasic;
  defaultRole: string;
  AssignedBy:string;
  AssignedTo:string;
}
