import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Patch,
  Post,
  Put,
  Query,
  Req,
} from '@nestjs/common';
import { ClientRMQ, RpcException } from '@nestjs/microservices';
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { Role } from '../interfaces/role';
import { SERVICE } from '../constants';
import {
  CreateCompanyRequestDto,
  CreateCompanyResponseDto,
  UpdateCompanyRequestDto,
  UpdateCompanyResponseDto,
} from '../dto/user';
import { Permission } from '../shared/decorators/custom';
import {
  AssignRoleResponseDto,
  AssignRoleRequestDto,
} from '../dto/user/assign-role-company.dto';
import { AuthN } from '../shared/decorators/authN.decorator';
import { CityService } from '../services/cites.services';

@ApiTags('Company')
@Controller('company')
export class CompanyController {
  constructor(
    @Inject(SERVICE.USER_PROFILE) private userClient: ClientRMQ,
    @Inject(SERVICE.USER_ACCOUNT) private adminAuthClient: ClientRMQ,
    private cityService: CityService,
  ) {}
  //@Inject(SERVICE.USER_ACCOUNT) private adminAuthClient: ClientRMQ) { }

  @Get('list')
  async list() {
    return this.userClient.send('list_companys', {});
  }

  // @Permission("profile_view")
  // @Get('get/:userId')
  // async get(@Param('userId') userId: string) {
  //   return this.userClient.send('get_company', { userId });
  // }

  @Permission('profile_view')
  @Get('get')
  @AuthN()
  async get(@Req() req) {
    const userId = req.user.userId;
    const role = req.user.roles[0];

    // For COMPANY_ADMIN
    if (role === 'COMPANY_ADMIN') {
      return this.userClient.send('get_company', { userId: userId });
    }

    // For all other user
    return this.userClient.send('get_user_profile', { userId: userId });
  }

  @ApiCreatedResponse({
    type: CreateCompanyResponseDto,
  })
  @Post('create')
  async create(@Body() dto: CreateCompanyRequestDto) {
    return this.userClient.send('create_company', dto);
  }

  // @Permission("profile_edit")
  // @ApiCreatedResponse({
  //   type: UpdateCompanyResponseDto,
  // })
  // @Put('update')
  // async update(@Body() dto: UpdateCompanyRequestDto) {
  //   return this.userClient.send('update_company', dto);
  // }

  @Permission('profile_edit')
  @ApiCreatedResponse({
    type: UpdateCompanyResponseDto,
  })
  @Patch('update')
  @AuthN()
  async update(@Req() req, @Body() dto: UpdateCompanyRequestDto) {
    const userId = req.user.userId;
    dto.userId = userId;
    const role = req.user.roles[0];

    // For COMPANY_ADMIN
    if (role === 'COMPANY_ADMIN') {
      return this.userClient.send('update_company', dto);
    }

    // For all other user
    return this.userClient.send('update_user', dto);
  }

  @Delete('delete/:userId')
  async delete(@Param('userId') userId: string) {
    return this.userClient.send('delete_company', { userId });
  }

  @Post('assign-role')
  @ApiCreatedResponse({
    type: AssignRoleResponseDto,
  })
  async assignRole(@Body() dto: AssignRoleRequestDto) {
    return this.adminAuthClient.send('admin_assign_role', dto);
  }

  @Get('SearchPostCode')
  async PostCodeSearch (@Query('Search') Search: string) {
    console.log(Search,"sasdashdiuasgdusai")
    return this.userClient.send('searchPost',{Search});
  }
  @Get('SearchCites')

  async CitesSearch (@Query('Search') Search: string) {
    console.log(Search)
    return await this.cityService.get_cities(Search)
  }
}

