import axios from 'axios';

const API_URL = 'http://localhost:3001/api';

export const fetchData = async (endpoint) => {
    const response = await axios.get(`${API_URL}/${endpoint}`);
    return response.data.data;
};

export const addData = async (endpoint, data) => {
    const response = await axios.post(`${API_URL}/${endpoint}`, data);
    return response.data;
};

export const deleteData = async (endpoint, id) => {
    const response = await axios.delete(`${API_URL}/${endpoint}/${id}`);
    return response.data;
};