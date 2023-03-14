import { ApiProperty } from "@nestjs/swagger";
import { ApiResponseDto } from "../common/ApiResponse.dto";

export class AssignApplicantDto {
   
    @ApiProperty({ example: 'b8151648-127f-4987-b19d-9e89578b9d4c' })
    AssignedTo: string;
    AssignedBy: string;
    @ApiProperty({ example: ['6030635f-326e-4030-92c6-06d7ab3eff8d','8306ca24-4425-4fdd-8984-7087b1daa6e2'] })
    ApplicantID: Array<string>;
}

export class UnAssignApplicant {
   
    @ApiProperty({ example: '6030635f-326e-4030-92c6-06d7ab3eff8d' })
    ApplicantID: string;
    reqUser:string;
}

export class ParamOfActivateDto {
    @ApiProperty({ example: true })
    active: boolean;
}
