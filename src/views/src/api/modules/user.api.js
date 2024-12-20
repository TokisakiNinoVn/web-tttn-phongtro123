//user.api.js
import instance from '@/api/axiosConfig';

const updateUserApi = (id, data) => {
    return instance.put(`/api/private/user/${id}`, data);
};


const deleteUserApi = async (id) => { 
    return instance.delete(`/api/private/user/${id}`);
}

const savePostApi = async (body) => { 
    return instance.post(`/api/private/user/save`, body);
}

const getPostSaveUserApi = async (id) => { 
    return instance.get(`/api/private/user/saved/${id}`);
}

const getAllPostOfUserApi = async (id) => { 
    return instance.get(`/api/private/user/post/${id}`);
}

const unSavePostApi = async (body) => { 
    return instance.post(`/api/private/user/unsave/`, body);
}

export {
    updateUserApi,
    deleteUserApi,
    savePostApi,
    getPostSaveUserApi,
    getAllPostOfUserApi,
    unSavePostApi
};
