import axios from "axios";

const server = axios.create({
    baseURL: process.env.SERVER_URI,
});

export default server;