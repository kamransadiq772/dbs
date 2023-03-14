import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ReAssignApplication {

    // @ApiProperty({example:"Pending"})
    // TokenId:string
    @ApiProperty({example:['id','id']})
    ApplicationId:Array<string>
    @ApiProperty({example:"ID"})
    AssignTo:string
    // @ApiProperty({example:"Id"})
    // AssignBy:string
    // TokenId:string
    // ApplicationId:string
    // AssignTo:string
    // AssignBy?:string 
  }
  export class applicationAssignCounterSignatoryDto {
    @ApiProperty({example:"ID"})
    ApplicationId:string
    @ApiProperty({example:"01b626ae-ba53-433e-8746-dd8422020618"})
    CounterSignatoryId:string
  }