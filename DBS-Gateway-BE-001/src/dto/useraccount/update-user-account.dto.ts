import { ApiProperty } from "@nestjs/swagger";

export class UpdateUserAccountDto {
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
}

export class UpdateUserAccountResponseDto {
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
}
