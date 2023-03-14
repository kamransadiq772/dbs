import { SchemaFactory } from '@nestjs/mongoose/dist/factories';
import { Prop, Schema } from '@nestjs/mongoose/dist/decorators';
import { object, string } from 'joi';

@Schema({
    versionKey: false,
    timestamps: true,
})
export class Role {
    @Prop({ type: String, required: true })
    _id: string;

    @Prop({ type: String, required: true })
    role: string;

    @Prop({ type: Number, required: true })
    precedence: number;

    @Prop({ type: [], required: true, default: [] })
    // defaultPermissions: string[];
    defaultPermissions: [];

}

export const RoleSchema = SchemaFactory.createForClass(Role);
