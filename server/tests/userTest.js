const chai = require('chai');
require('dotenv').config({ path: __dirname + '/.env.test' });
const { describe } = require('mocha');
const expect = chai.expect;
const { userIds, addDummyObjects } = require('./seeding/seed');
const supertest = require('supertest');
const app = require('../app');
const dropAllCollections = require('./helpers/testHelper');
const mongoose = require('mongoose');

const server = supertest.agent(app);
let token = '';


before(async () => {
    await addDummyObjects();
});

beforeEach(async () => {
    const response = await server.post('/user/login')
        .send({
            "username": "testUser1",
            "password": "123456"
        });
    token = await response.body.token;
});

describe('POST /register - success', () => {
    it('should successfully register a user', async () => {
        const response = await server.post('/user/register')
            .send({
                "username": "anotherUser",
                "email": "a@c.com",
                "password": "123456"
            });

        expect(response.status).to.eql(200);
    });
});

describe('POST /register - fail', () => {
    it('should fail registering user due to username conflict', async () => {
        const response = await server.post('/user/register')
            .send({
                "username": "testUser1",
                "email": "a@c.com",
                "password": "123456"
            });

        expect(response.status).to.eql(400);
    });
});

describe('POST /login - success', () => {
    it('should login user and return token', async () => {
        const response = await server.post('/user/login')
            .send({
                "username": "testUser1",
                "password": "123456"
            });

        expect(response.status).to.eql(200);
        expect(response.body.auth).to.eql(true);
    });
});

describe('POST /login - fail', () => {
    it('should fail on login due to wrong password', async () => {
        const response = await server.post('/user/login')
            .send({
                "username": "testUser1",
                "password": "invalid password"
            });

        expect(response.status).to.eql(403);
    });
});

describe('GET /profile - success', () => {
    it('should authorize and return the user', async () => {
        const response = await server.get('/user/profile')
            .set('Authorization', `JWT ${token}`);

        expect(response.status).to.eql(200);
    });
});

describe('GET /profile/:id - success', () => {
    it('should authorize and return the information of the other user', async () => {
        const userId = userIds[0].toString();
        // console.log(token);
        const response = await server.get(`/user/profile/${userId}`)
            .set('Authorization', `JWT ${token}`);

        expect(response.status).to.eql(200);
    });
});

describe('PATCH /newPassword - success', () => {
    it('should authorize and change the user password', async () => {
        const response = await server.patch('/user/newPassword')
            .set('Authorization', `JWT ${token}`)
            .send({
                "password": "new-password"
            });

        expect(response.status).to.eql(200);
    })
})

after(async () => {
    await dropAllCollections();
    mongoose.connection.close();
});