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

const getArticle = async (id, accessToken) => {
    return await server.get(`/article/${id}`, {
        withCredentials: true, headers: { Authorization: `JWT ${accessToken}` }
    });
};

const getUser = async (id, accessToken) => {
    return await server.get(`/user/profile/${id}`, {
        withCredentials: true, headers: { Authorization: `JWT ${accessToken}` }
    });
};

const likeArticle = async (id, accessToken) => {
    return await server.get(`/article/${id}/like`, {
        withCredentials: true, headers: { Authorization: `JWT ${accessToken}` }
    });
};

const getCurrentUser = async (accessToken) => {
    return await server.get('/user/profile', {
        withCredentials: true, headers: { Authorization: `JWT ${accessToken}` }
    });
};

const addNewComment = async (id, comment, accessToken) => {
    return await server.post(`/article/${id}/newComment`, comment, {
        withCredentials: true, headers: { Authorization: `JWT ${accessToken}` }
    });
};

const likeComment = async (id, commentId, accessToken) => {
    return await server.get(`/article/${id}/${commentId}/like`, {
        withCredentials: true, headers: { Authorization: `JWT ${accessToken}` }
    });
};

const deleteComment = async (id, commentId, accessToken) => {
    return await server.delete(`/article/${id}/${commentId}`, {
        withCredentials: true, headers: { Authorization: `JWT ${accessToken}` }
    });
};

const deleteArticle = async (id, accessToken) => {
    return await server.delete(`/article/${id}`, {
        withCredentials: true, headers: { Authorization: `JWT ${accessToken}` }
    });
};

const changePassword = async (password, accessToken) => {
    return await server.patch('/user/newPassword', password, {
        withCredentials: true, headers: { Authorization: `JWT ${accessToken}` }
    });
};

const DataService = {
    registerUser,
    loginUser,
    getAllArticles,
    addNewArticle,
    getArticle,
    getUser,
    likeArticle,
    getCurrentUser,
    addNewComment,
    likeComment,
    deleteComment,
    deleteArticle,
    changePassword,
};

export default DataService;