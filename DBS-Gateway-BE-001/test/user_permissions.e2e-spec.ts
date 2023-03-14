import { INestApplication } from "@nestjs/common"
import { Test } from "@nestjs/testing";
import { GatewayModule } from "../src/gateway.module";
import request from 'supertest'
import { UnAssignApplicant, assignApplicant, deActivateUser, getApplicants, getSubUsers, getUserHistory, signin_company } from "./mocks/UserPermission";
import { NestApplication } from "@nestjs/core";
describe("userpermissions", () => {
    let app: INestApplication;
    let token: string | null;
    beforeAll(async () => {
        const moudule = await Test.createTestingModule({
            imports: [GatewayModule]
        }).compile()
        app = moudule.createNestApplication()
        await app.init()
        const loggedInCompany = await request(app.getHttpServer())
            .post('/auth/signin/company')
            .send(signin_company)
        token = loggedInCompany.body.data.authToken
        console.log(token)
    })

    it('should get sub user', async () => {
        const user = await request(app.getHttpServer()).get('/userpermissions/getSubUsers')
            .set('Authorization', `Bearer ${token}`)
            .query(getSubUsers)
            .expect(200)
    })

    it('should get Applicants of Company', async () => {
        const user = await request(app.getHttpServer()).get('/userpermissions/getApplicantsOfCompany')
            .set('Authorization', `Bearer ${token}`)
            .query(getApplicants)
            .expect(200)
    })

    it('should get Evdence Checkers and admin evedence checker of Company', async () => {
        const user = await request(app.getHttpServer()).get('/userpermissions/getEvedenceCheckersOfCompany')
            .set('Authorization', `Bearer ${token}`)
            .query(getApplicants)
            .expect(200)
    })

    it('should assign applicant to Evdence Checkers and admin evedence checker of Company', async () => {
        const user = await request(app.getHttpServer()).patch('/userpermissions/assignApplicant')
            .set('Authorization', `Bearer ${token}`)
            .send(assignApplicant)
            .expect(200)
    })


    it('should get history of user', async () => {
        const user = await request(app.getHttpServer()).get('/userpermissions/userHistory')
            .set('Authorization', `Bearer ${token}`)
            .query(getUserHistory)
            .expect(200)
    })

    it('should UnAssign Applicant', async () => {
        const user = await request(app.getHttpServer()).patch('/userpermissions/unassignApplicant')
            .set('Authorization', `Bearer ${token}`)
            .send(UnAssignApplicant)
            .expect(200)
    })

    it('should deActivate User', async () => {
        const user = await request(app.getHttpServer()).patch('/userpermissions/deativateUser')
            .set('Authorization', `Bearer ${token}`)
            .send(deActivateUser)
            .expect(200)
    })

    it('should get Sigle user', async () => {
        const user = await request(app.getHttpServer()).get('/userpermissions/getSingleUser/6030635f-326e-4030-92c6-06d7ab3eff8d')
            .set('Authorization', `Bearer ${token}`)
            .expect(200)
    })

})