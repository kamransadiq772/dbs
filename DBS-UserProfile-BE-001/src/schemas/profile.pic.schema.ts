import { SchemaFactory } from '@nestjs/mongoose/dist/factories';
import { Prop, Schema } from '@nestjs/mongoose/dist/decorators';

@Schema({
  versionKey: false,
  timestamps: true,
})
export class ProfilePic {

  @Prop({ type: String, required: true })
  userId: string;

  @Prop({ type: String, required: true })
  profilePic: string;
}

export const ProfilePicSchema = SchemaFactory.createForClass(ProfilePic);
