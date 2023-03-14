import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class getUserHistoryDto{
    @ApiProperty({example:'6030635f-326e-4030-92c6-06d7ab3eff8d'})
    userId:string
    @ApiProperty({example:0})
    offset?:number
    @ApiProperty({example:5})
    limit?:number
    @ApiPropertyOptional({example:""})
    searchTerm?:string
}