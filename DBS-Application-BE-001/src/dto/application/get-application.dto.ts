export class GetApplicationDto {
  _id: string;
  adminId: string;
}

export class ListApplicationByStatusDto {
  status: string;
}

export class GetApplicationByAdminIDDto {
  AdminID: string;
  offset: number;
  limit: number;
}
export class GetApplicationByAdminIDwithStatusDto {
  AdminID: string;
  status: string;
  offset: number;
  limit: number;
}

export class GetApplicationByIndividualUserIDDto {
  UserID: string;
  offset: number;
  limit: number;
}
export class GetApplicationByIndividualUserwithStatusIDDto {
  UserID: string;
  status: string;
  offset: number;
  limit: number;
}

export class CertificatePostedOutDto {
  AdminID: string;
  offset: number;
  limit: number;
  searchTerm?: string;
  from?: number;
  to?: number;
  userRoles?: string;
  sortBy?: string;
  sort?: number
}