import { INestApplication } from "@nestjs/common"
import { Test } from "@nestjs/testing";
import { GatewayModule } from "../src/gateway.module";
import request from 'supertest'
import { signin_company } from "./mocks/UserPermission";
import { NestApplication } from "@nestjs/core";
import { getApplicationsOfAdmin, getApplicationsOfAdminByStatus, getApplicationsOfSubusers, listAllApplications } from "./mocks/Applications";
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

    it('should list all applications', async () => {
        const application = await request(app.getHttpServer()).get('/application/listAll')
            .set('Authorization', `Bearer ${token}`)
            .query(listAllApplications)
            .expect(200)
    })

    it('should list single applications by _id', async () => {
        const application = await request(app.getHttpServer()).get('/application/getDetails/638f2a0903f29bdf2ce42648')
            .set('Authorization', `Bearer ${token}`)
            .expect(200)
    })

    it('should list all applications of Admin', async () => {
        const application = await request(app.getHttpServer()).get('/application/getApplicationsOfAdmin')
            .set('Authorization', `Bearer ${token}`)
            .query(getApplicationsOfAdmin)
            .expect(200)
    })

    it('should list all applications of Admin By Status', async () => {
        const application = await request(app.getHttpServer()).get('/application/getApplicationsOfAdminByStatus')
            .set('Authorization', `Bearer ${token}`)
            .query(getApplicationsOfAdminByStatus)
            .expect(200)
    })

    it('should list all applications subusers', async () => {
        const application = await request(app.getHttpServer()).get('/application/getApplicationsOfSubusers')
            .set('Authorization', `Bearer ${token}`)
            .query(getApplicationsOfSubusers)
            .expect(200)
    })


    it('should getApplicationsHistory', async () => {
        const application = await request(app.getHttpServer()).get('/application/getApplicationHistory/6398aea7d46dff77bab293d7')
            .set('Authorization', `Bearer ${token}`)
            .expect(200)
    })


})