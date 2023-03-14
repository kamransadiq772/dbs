import { SchemaFactory } from '@nestjs/mongoose/dist/factories';
import { Prop, Schema } from '@nestjs/mongoose/dist/decorators';

@Schema({ versionKey: false })
export class Permission {
  @Prop({ type: String, required: true, index: true, unique: true })
  permissionId: string;

  @Prop({ type: String, required: false })
  description?: string;

  @Prop({ type: [String], default: [] })
  allowedRoles?: string[];
}

export const PermissionSchema = SchemaFactory.createForClass(Permission);
