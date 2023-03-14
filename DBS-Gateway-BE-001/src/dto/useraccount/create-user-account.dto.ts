import { ApiProperty } from "@nestjs/swagger";

export class CreateUserAccountDto{
    @ApiProperty({example:'kamran'})
    firstName:string;
    @ApiProperty({example:'sadiq'})
    lastName:string;
    @ApiProperty({example:'kamran...@gmail.com'})
    email:string;
    @ApiProperty({example:'+92.....'})
    phoneNumber:string;
    @ApiProperty({example:'company admin'})
    accountType:string;
    @ApiProperty({example:'assistance'})
    status:string;
    @ApiProperty({example:'22-11-2022'})
    createdDate:any;
}

export class CreateUserAccountResponseDto{
    @ApiProperty({example:'63766ac69218e9b1e4db7b57'})
    _id:string;
    @ApiProperty({example:'kamran'})
    firstName:string;
    @ApiProperty({example:'sadiq'})
    lastName:string;
    @ApiProperty({example:'kamran...@gmail.com'})
    email:string;
    @ApiProperty({example:'+92.....'})
    phoneNumber:string;
    @ApiProperty({example:'company admin'})
    accountType:string;
    @ApiProperty({example:'assistance'})
    status:string;
    @ApiProperty({example:'22-11-2022'})
    createdDate:any;
    @ApiProperty({example:'2022-11-17T17:09:26.122Z'})
    createdAt:any;
    @ApiProperty({example:'2022-11-17T17:09:26.122Z'})
    updatedAt:any;
}

export class GetSingleUserAccountResponseDto{
    @ApiProperty({ example: '87dl689kj23+xcsha098234asdf87' })
    _id: string;
    @ApiProperty({ example: 'kamran' })
    userId: string;
    @ApiProperty({ example: 'sadiq' })
    defaultRole: string;
    @ApiProperty({
        example: `[
        {
                    "id": "636ceaef530acc6aaf5aa24c",
                    "label": "application_list"
                  },
                  {
                    "id": "635127769df31c64672e450c",
                    "label": "application_create"
                  }
    ]`})
    allowedPermissions: Array<object>;
    @ApiProperty({ example: 'sadiq' })
    username: string;
    @ApiProperty({ example: 'example@email.com' })
    email: string;
    @ApiProperty({ example: true })
    IsActive: boolean;
    @ApiProperty({ example: 'Evidence Checker' })
    userType: string;
    @ApiProperty({ example: 'COUNTER_SIGNATORY' })
    userDefaultRole: string;

}