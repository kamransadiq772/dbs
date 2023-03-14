import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ICommentApplication } from '../../interfaces/application/commit.interface';

export class CommentApplicationRequestDto {

  @ApiProperty({
    example: {
      applicationId: '68437579487349759',
      signatoryReconciliation: 'by COUNTER_SIGNATORY',
      comment: 'add new',
      createBy: 'afaq22',
 

      
    },
  })
  commentUser: ICommentApplication;

  }