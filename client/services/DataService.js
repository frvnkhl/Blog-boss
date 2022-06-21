import server from "../axios";

const registerUser = async (userData) => {
    return await server.post('/user/register', userData, { withCredentials: true });
};

const loginUser = async (userData) => {
    return await server.post('/user/login', userData, { withCredentials: true }).then(res => {
        try {
            localStorage.setItem('JWT', res.data.token);
        } catch (err) {
            console.error(err);
        };

        return res.data;
    });
};

const getAllArticles = async (accessToken) => {
    return await server.get('/article/', {
        withCredentials: true, headers: { Authorization: `JWT ${accessToken}` }
    });
};

const addNewArticle = async (article, accessToken) => {
    return await server.post('/article/', article, {
        withCredentials: true, headers: { Authorization: `JWT ${accessToken}` }
    });
};

const DataService = { registerUser, loginUser, getAllArticles, addNewArticle };

export default DataService;