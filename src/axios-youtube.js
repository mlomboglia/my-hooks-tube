import axios from 'axios';

const instance = axios.create({
    baseURL: 'https://www.googleapis.com/',
    params: {
        key: process.env.REACT_APP_API_KEY
    }
});

export default instance;

