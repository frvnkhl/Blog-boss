const chai = require('chai');
require('dotenv').config({ path: __dirname + '/.env.test' });
const { describe } = require('mocha');
const expect = chai.expect;
const { userIds, articleIds, addDummyObjects } = require('./seeding/seed');
const supertest = require('supertest');
const app = require('../app');
const dropAllCollections = require('./helpers/testHelper');
const mongoose = require('mongoose');
const { Article } = require('../models/articleModel');
const { User } = require('../models/userModel');
const { response } = require('../app');

const server = supertest.agent(app);
let token = '';

describe('Article endpoint tests', () => {

});
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

describe('POST / - success', () => {
    it('should successfully create a new article', async () => {
        const response = await server.post('/article/')
            .set('Authorization', `JWT ${token}`)
            .send({
                "title": "test Article",
                "content": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Et tortor at risus viverra adipiscing. Pharetra massa massa ultricies mi quis hendrerit dolor magna. Volutpat odio facilisis mauris sit amet. Volutpat commodo sed egestas egestas fringilla. Sed velit dignissim sodales ut. Interdum varius sit amet mattis. Nibh cras pulvinar mattis nunc sed blandit. Pharetra massa massa ultricies mi. Viverra vitae congue eu consequat ac felis. Orci sagittis eu volutpat odio facilisis mauris sit amet. Lobortis feugiat vivamus at augue eget. Eget lorem dolor sed viverra ipsum nunc aliquet bibendum. Nisi est sit amet facilisis magna etiam tempor orci eu. Lectus mauris ultrices eros in cursus turpis massa. Adipiscing commodo elit at imperdiet dui accumsan. Massa eget egestas purus viverra accumsan in nisl nisi. Etiam erat velit scelerisque in dictum non consectetur a erat.",
                "category": "lifestyle",
                "tags": ["lifehack", "boost", "life quality"]
            });
        expect(response.status).to.eql(200);
    });
});

describe('GET / - success', () => {
    it('should successfully return all articles', async () => {
        const response = await server.get('/article/')
            .set('Authorization', `JWT ${token}`);

        expect(response.status).to.eql(200);
        // console.log(response.body.articles);
        expect(response.body.articles.length).to.eql((await Article.find({})).length);
    });
});

describe('GET /:id - success', () => {
    it('should successfully return a specific article by id', async () => {
        const articleId = articleIds[0];
        const response = await server.get(`/article/${articleId}`)
            .set('Authorization', `JWT ${token}`);

        const expectedArticle = await Article.findById(mongoose.Types.ObjectId(articleId));
        // console.log(expectedArticle);
        expect(response.status).to.eql(200);
        expect(response.body.article.title).to.eql(expectedArticle.title);
    });
});

describe('PATCH /:id - success', () => {
    it('should successfully edit the selected article', async () => {
        const articleToChange = await Article.findOne({ title: "test Article" });
        const articleId = articleToChange._id;
        const newTitle = 'New Article title';
        const response = await server.patch(`/article/${articleId}`)
            .set('Authorization', `JWT ${token}`)
            .send({
                "title": newTitle
            });

        const editedArticle = await Article.findById(mongoose.Types.ObjectId(articleId));
        expect(response.status).to.eql(200);
        expect(editedArticle.title).to.eql(newTitle);
    });
});

describe('PATCH /:id - fail', () => {
    it('should fail on edit because the user is not an author', async () => {
        const articleId = articleIds[0];
        const newTitle = 'New Article title';
        const response = await server.patch(`/article/${articleId}`)
            .set('Authorization', `JWT ${token}`)
            .send({
                "title": newTitle
            });

        expect(response.status).to.eql(400);
    });
});

describe('DELETE /:id - success', () => {
    it('should successfully delete selected article', async () => {
        const articleToChange = await Article.findOne({ title: "New Article title" });
        const articleId = articleToChange._id;
        const response = await server.delete(`/article/${articleId}`)
            .set('Authorization', `JWT ${token}`);

        expect(response.status).to.eql(200);
    });
});

describe('DELETE /:id - fail', () => {
    it('should fail on delete because user is not an author', async () => {
        const articleId = articleIds[0];
        const response = await server.delete(`/article/${articleId}`)
            .set('Authorization', `JWT ${token}`);

        expect(response.status).to.eql(400);
    });
});

describe('POST /:id/newComment - success', () => {
    it('should successfully add new comment', async () => {
        const articleId = articleIds[0];
        const response = await server.post(`/article/${articleId}/newComment`)
            .set('Authorization', `JWT ${token}`)
            .send({
                "comment": "Such a great insight, love this article!"
            });

        console.log(response.body);
        expect(response.status).to.eql(200);
    });
});

describe('DELETE /:id/:commentId - success', () => {
    it('should successfully delete comment', async () => {
        const articleId = articleIds[0];
        const article = await Article.findById(mongoose.Types.ObjectId(articleId));
        const commentId = article.comments[0]._id.toString();

        const response = await server.delete(`/article/${articleId}/${commentId}`)
            .set('Authorization', `JWT ${token}`);

        expect(response.status).to.eql(200);
    });
});

describe('GET /:id/likes - success', () => {
    it('should successfully get all the likes of the article', async () => {
        const articleId = articleIds[0];
        const response = await server.get(`/article/${articleId}/likes`)
            .set('Authorization', `JWT ${token}`);

        expect(response.status).to.eql(200);
        expect(response.body.likes.length).to.eql(1);
    });
});

describe('GET /:id/like - success', () => {
    it('should like or unlike an article', async () => {
        const articleId = articleIds[0];
        const response = await server.get(`/article/${articleId}/like`)
            .set('Authorization', `JWT ${token}`);

        expect(response.status).to.eql(200);
    });
});

after(async () => {
    await dropAllCollections();
    mongoose.connection.close();
});