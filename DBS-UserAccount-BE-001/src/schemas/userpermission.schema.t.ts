
import { SchemaFactory } from '@nestjs/mongoose/dist/factories';
import { Prop, Schema } from '@nestjs/mongoose/dist/decorators';
import { object } from 'joi';
import { IAllowedPermissions } from "../interfaces/user-permission.interface"


@Schema({
    versionKey: false,
    timestamps: true,
})
export class UserPermission {
    @Prop({ type: String, required: true })
    userId: string;

    @Prop({ type: String, required: true })
    role: string;

    @Prop({ type: Array, required: true })
    allowedPermissions: IAllowedPermissions;
}

export const UserPermissionSchema = SchemaFactory.createForClass(UserPermission);