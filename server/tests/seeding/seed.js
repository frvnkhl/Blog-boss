const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const { Article } = require('../../models/articleModel');
const { User } = require('../../models/userModel');
const { Comment } = require('../../models/commentModel');
const { Follower } = require('../../models/followerModel');
const { Following } = require('../../models/followingModel');

const userIds = [];
const articleIds = [];

const users = [
    {
        username: "testUser1",
        email: "b@c.com",
        password: "$2b$12$.xKN.GTBen6jvIIi4MkLfOeFczuWAWERtkOE1obkyUl.ZXft.4urm",
        favouriteArticles: [],
        following: 1,
        followers: 0,
    }, {
        username: "testUser2",
        email: "a@b.com",
        password: "$2b$12$.xKN.GTBen6jvIIi4MkLfOeFczuWAWERtkOE1obkyUl.ZXft.4urm",
        favouriteArticles: [],
        following: 0,
        followers: 1,
    }
];

const getArticles = (userId) => {
    return [
        {
            author: userId,
            title: "New Article",
            content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Et tortor at risus viverra adipiscing. Pharetra massa massa ultricies mi quis hendrerit dolor magna. Volutpat odio facilisis mauris sit amet. Volutpat commodo sed egestas egestas fringilla. Sed velit dignissim sodales ut. Interdum varius sit amet mattis. Nibh cras pulvinar mattis nunc sed blandit. Pharetra massa massa ultricies mi. Viverra vitae congue eu consequat ac felis. Orci sagittis eu volutpat odio facilisis mauris sit amet. Lobortis feugiat vivamus at augue eget. Eget lorem dolor sed viverra ipsum nunc aliquet bibendum. Nisi est sit amet facilisis magna etiam tempor orci eu. Lectus mauris ultrices eros in cursus turpis massa. Adipiscing commodo elit at imperdiet dui accumsan. Massa eget egestas purus viverra accumsan in nisl nisi. Etiam erat velit scelerisque in dictum non consectetur a erat.",
            category: [
                "lifestyle"
            ],
            tags: [
                "lifehack",
                "boost",
                "life quality"
            ],
            likes: 1,
            comments: [],
        },
        {
            author: userId,
            title: "Another Article",
            content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Et tortor at risus viverra adipiscing. Pharetra massa massa ultricies mi quis hendrerit dolor magna. Volutpat odio facilisis mauris sit amet. Volutpat commodo sed egestas egestas fringilla. Sed velit dignissim sodales ut. Interdum varius sit amet mattis. Nibh cras pulvinar mattis nunc sed blandit. Pharetra massa massa ultricies mi. Viverra vitae congue eu consequat ac felis. Orci sagittis eu volutpat odio facilisis mauris sit amet. Lobortis feugiat vivamus at augue eget. Eget lorem dolor sed viverra ipsum nunc aliquet bibendum. Nisi est sit amet facilisis magna etiam tempor orci eu. Lectus mauris ultrices eros in cursus turpis massa. Adipiscing commodo elit at imperdiet dui accumsan. Massa eget egestas purus viverra accumsan in nisl nisi. Etiam erat velit scelerisque in dictum non consectetur a erat.",
            category: [
                "technology"
            ],
            tags: [
                "AI",
                "Machine Learning",
                "Web Development"
            ],
            likes: 1,
            comments: [],
        }
    ]
};

const createArticles = (article, cb) => {
    if (article.author) {
        article.author = User(article.author);
        article.author.save(err => {
            cb(err, err ? null : Article(article));
        })
    } else {
        cb(null, Article(article));
    }
}

const addDummyObjects = async () => {
    users.forEach(async (u) => {
        const user = new User(u);
        await user.save();
        userIds.push(user._id);
    });

    const commentOne = {
        author: userIds[0],
        comment: "Another great take!",
        likes: [userIds[1]],
    };

    const commentTwo = {
        author: userIds[0],
        comment: "Interesting take!",
        likes: [userIds[1]],
    };

    const comments = [commentOne, commentTwo];
    let counter = 0;
    const articles = getArticles(userIds[1]);
    articles.forEach(async (a) => {
        createArticles(a, async (err, article) => {
            await article.save();
            articleIds.push(article._id);
        });
        counter++;
    });

    await User.findOneAndUpdate({ username: "testUser1" },
        { favouriteArticles: articleIds });

    const follower = new Follower({
        userId: userIds[1],
        follower: [
            userIds[0]
        ]
    });

    await follower.save();

    const following = new Following({
        userId: userIds[0],
        follower: [
            userIds[1]
        ]
    });

    await following.save();

};

module.exports = {
    userIds,
    articleIds,
    addDummyObjects
}