import { Document } from 'mongoose';
export interface ICommitApplication extends Document {
        adminId:string;
        usersId:string;
        counterSignatoryId: string;
        signatoryReconciliation: string;
        commit: string;
        createBy: string;

}