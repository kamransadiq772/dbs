import { Document } from 'mongoose';
export interface ICommentApplication extends Document {
        adminId:string;
        usersId:string;
        applicationId:string;
        counterSignatoryId: string;
        signatoryReconciliation: string;
        comment: string;
        createBy: string;

}