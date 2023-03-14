import {
    Body,
    Controller,
    Delete,
    Get,
    Inject,
    Param,
    Post,
    Put,
    Query,
    Logger,
    Header,
    Headers,
    Req,
    Patch
} from '@nestjs/common';
import { ClientRMQ } from '@nestjs/microservices';
import {
    ApiCreatedResponse,
    ApiInternalServerErrorResponse,
    ApiProperty,
    ApiTags,
} from '@nestjs/swagger';
import { SERVICE } from '../constants';
import { ApiDescription, Permission } from '../shared/decorators/custom';
import { CreateUserAccountDto, CreateUserAccountResponseDto, GetSingleUserAccountResponseDto } from '../dto/useraccount/create-user-account.dto';
import { UpdateUserAccountDto, UpdateUserAccountResponseDto } from '../dto/useraccount/update-user-account.dto';
import { GetUserPaginationRequestDto, SearchUserPaginationRequestDto } from '../dto/user';
import { firstValueFrom } from 'rxjs';
import { AuthN } from '../shared/decorators/authN.decorator';
import { getUserswithApplications,getSubUsersOfCompany,GetSingleUser } from '../dto/user/get-user.dto'
import { AssignApplicantDto,ParamOfActivateDto,UnAssignApplicant } from '../dto/user/asign-applicant.dto';
import {getUserHistoryDto} from '../dto/user/get-user-history.dto'

class INTERNAL_SERVER_ERROR {
    @ApiProperty({ example: 500 })
    status: number;
}
@ApiInternalServerErrorResponse({
    type: INTERNAL_SERVER_ERROR,
})
@ApiTags('User Permissions')
@Controller('userpermissions')
export class UserAccountController {
    private readonly logger = new Logger('Gateway user accounts Controller')
    constructor(
        @Inject(SERVICE.USER_ACCOUNT) private userAccountClient: ClientRMQ,
        @Inject(SERVICE.DBS_APPLICATION) private applicationClient: ClientRMQ,
        @Inject(SERVICE.USER_PROFILE) private userProfileClient: ClientRMQ
    ) { }

    @ApiDescription('List All Users')
    @ApiCreatedResponse({
        type: [GetSingleUserAccountResponseDto],
    })
    @Get('list')
    async list() {
        return this.userAccountClient.send('get_all_users_permissions', {});
    }

    @ApiDescription('List Users Pagination')
    @Post('listUserPagination')
    async listPagination(@Body() dto: GetUserPaginationRequestDto) {
        return this.userAccountClient.send("get_all_users_permissions_pagination", dto)
    }
    @ApiDescription('search Users Pagination')
    @Post('searchUserPagination')
    async searchPagination(@Body() dto: SearchUserPaginationRequestDto) {
        return this.userAccountClient.send("search_all_users_permissions_pagination", dto)
    }

    @AuthN()
    @ApiDescription('Get users sub users')
    @Get('getSubUsers')
    async getUsersWithApplications(@Req() req, @Query() dto: getUserswithApplications) {
        dto.AdminID = req.user.userId;
        const role = req.user.roles[0]
        return await this.userProfileClient.send("all_users_with_applications", {...dto,role})
    }

    @AuthN()
    @ApiDescription('Get applicants of company')
    @Get('getApplicantsOfCompany')
    async getApplicantsOfCompany(@Req() req, @Query() dto: getSubUsersOfCompany) {
        dto.reqUser = req.user.userId;
        dto.role = req.user.roles[0]
        dto.type = ['APPLICANT','Applicant','applicant']
        return await this.userProfileClient.send("get_sub_users_of_company_with_type", dto)
    }

    @AuthN()
    @ApiDescription('Get evedence checkers of company')
    @Get('getEvedenceCheckersOfCompany')
    async getEvedenceCheckersOfCompany(@Req() req, @Query() dto: getSubUsersOfCompany) {
        dto.reqUser = req.user.userId;
        dto.role = req.user.roles[0]
        dto.type = ['EVIDENCE CHECKER','COMPANY ADMIN EVIDENCE CHECKER','Evidence Checker','Company Admin Evedence Checker','evidenceChecker','evidenceCheckerCompanyAdmin', 'Evidence Checker']
        return await this.userProfileClient.send("get_sub_users_of_company_with_type", dto)
    }

    @AuthN()
    @ApiDescription('Get evedence checkers of company')
    @Get('getOnlyEvedenceCheckersOfCompany')
    async getOnlyEvedenceCheckersOfCompany(@Req() req, @Query() dto: getSubUsersOfCompany) {
        dto.reqUser = req.user.userId;
        dto.role = req.user.roles[0]
        dto.type = ['EVIDENCE CHECKER','Evidence Checker','evidenceChecker', 'Evidence Checker']
        return await this.userProfileClient.send("get_sub_users_of_company_with_type", dto)
    }

    @ApiDescription('Get User By Id')
    @ApiCreatedResponse({
        type: GetSingleUserAccountResponseDto,
    })
    @Get('get')
    @AuthN()
    async get(@Req() req) {
        this.logger.debug(req.user);

        return await firstValueFrom(
            this.userAccountClient.send('find_user_permissions_by_Id', { _id: req.user.userId })
        );
    }

    @ApiDescription('Create User Account')
    @ApiCreatedResponse({
        type: CreateUserAccountResponseDto,
    })
    // @Post('create')

    // async create(@Body() dto: CreateUserAccountDto) {
    //     return this.userAccountClient.send('add_user', dto);
    // }

    @ApiDescription('Update User Account')
    @ApiCreatedResponse({
        type: UpdateUserAccountResponseDto,
    })
    @Put('update')
    async update(@Body() dto: UpdateUserAccountDto) {
        return this.userAccountClient.send('update_user_permissions', dto);
    }

    @ApiDescription('Delete User Account')
    @Delete('delete/:id')
    async delete(@Param('id') _id: string) {
        return this.userAccountClient.send('delete_user_permissions', { _id });
    }

    @ApiDescription('Resend User Account')
    @Post('resendPassword')
    async resendPassword(@Body() body: { email: string }) {
        return this.userAccountClient.send('resend_user_password', body);
    }


    @ApiDescription('Assign Applicant')
    @AuthN()
    @Patch('assignApplicant')
    async assignApplicant(@Req() req,@Body() body:AssignApplicantDto) {
        console.log(body);        
        body.AssignedBy = req.user.userId
        const asusers = await firstValueFrom(this.userProfileClient.send('assign_applicant', body))
        const asignApp = await firstValueFrom(this.applicationClient.send('assign_application_by_applicantId',body))
        return asusers;
    }

    @ApiDescription('Get User History')
    @AuthN()
    @Get('userHistory')
    async getUserHistory(@Query() query:getUserHistoryDto){
        return this.userProfileClient.send('get_user_history',query)
    }

    @ApiDescription('UnAssign Applicant')
    @AuthN()
    @Patch('unassignApplicant')
    async unassignApplicant(@Req() req,@Body() dto:UnAssignApplicant){
        dto.reqUser = req.user.userId
        return this.userProfileClient.send('unassign_applicant',dto)
    }

    // @ApiDescription('Deactivate User')
    // @AuthN()
    // @Patch('deactivateUser')
    // async deativateUser(@Req() req,@Body() dto:UnAssignApplicant){
    //     dto.reqUser = req.user.userId
    //     return this.userProfileClient.send('deactivate_user',dto)
    // }

    @ApiDescription('Activate User')
    @AuthN()
    @Patch('activateUser/:active')
    async ativateUser(@Req() req,@Param() param:ParamOfActivateDto ,@Body() dto:UnAssignApplicant){
        dto.reqUser = req.user.userId
        const active = param.active
        return this.userProfileClient.send('activate_user',{...dto, active})
    }

    @ApiDescription('get single User')
    @AuthN()
    @Get('getSingleUser/:id')
    async getUserByID(@Param() dto:GetSingleUser){

        const {id} = dto
        // console.log(id);
        

        return this.userProfileClient.send('get_single_user',{id})
    }

    @ApiDescription('get Users with company admin id or created by id')
    @AuthN()
    @Get('getUserswithCompanyOrCreatedByID/:id')
    async getUsersByCompanyORCreatedBy(@Param() dto:GetSingleUser){

        const {id} = dto
        console.log(id);
        

        return this.userProfileClient.send('get_users_by_companyId_or_CreatedBy',{id})
    }

}
