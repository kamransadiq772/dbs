import { SchemaFactory } from '@nestjs/mongoose/dist/factories';
import { Prop, Schema } from '@nestjs/mongoose/dist/decorators';

@Schema({ versionKey: false,timestamps: true })
export class Commit {
  @Prop({ type: String, required: false ,ref:'applications'  })
  adminId?: string;

  @Prop({ type: String, required: false,ref:'applications' })
  usersId?: string;

  @Prop({ type: String, required: false,ref:'applications'   })
  counterSignatoryId?: string;

  @Prop({ type: String, required: true,ref:'applications'   })
  applicationId: string;

  @Prop({ type: String, required: false,  })
  signatoryReconciliation: string;

  @Prop({ type: String, required: false,  })
  comment: string;
  
  @Prop({ type: String, required: false,   })
  createBy: string;

}

export const CommitSchema = SchemaFactory.createForClass(Commit);
