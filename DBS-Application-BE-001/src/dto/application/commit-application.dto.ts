export class CommentApplicationRequestDto {
  userAdmin:string;
   roles:string;
    TokenUsersId:string;
    adminId: string;
    usersId: string;
    counterSignatoryId: string;
    applicationId: string;
    signatoryReconciliation: string;
    comment: string;
    createBy: string;
  }
  
  export class CommentApplicationResponseDto {
    adminId: string;
    signatoryReconciliatioon: string;
    comment: string;
    createAt: string;
    createBy: string;
  }
  