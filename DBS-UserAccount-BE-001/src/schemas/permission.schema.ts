import { SchemaFactory } from '@nestjs/mongoose/dist/factories';
import { Prop, Schema } from '@nestjs/mongoose/dist/decorators';

@Schema({ versionKey: false })
export class Permission {
  @Prop({ type: String, required: true })
  module: string;

  @Prop({ type: String, required: true })
  permission: string;

  @Prop({ type: String, required: false })
  permissionId?: string;

  @Prop({ type: String, required: true })
  label: string;
}

export const PermissionSchema = SchemaFactory.createForClass(Permission);
