//post.api.js
import instance from '@/api/axiosConfig';


//Private
const createPostApi = async (postData) => {
    return instance.post('/api/private/post/create', postData);
};

const updatePostApi = async (postData) => {
    return instance.put('/api/private/post/update', postData);
};

const deletePostApi = async (id) => {
    return instance.delete(`/api/private/post/delete/${id}`);
};

const getPostApi = async (id) => { 
    return instance.get(`/api/public/post/${id}`);
};

// public
const searchPostApi = async (body) => {
    return instance.post(`/api/public/post/search/`, body);
};
const filterPostApi = async (body) => {
    return instance.post(`/api/public/post/filter`, body);
};

const getNewPostApi = async () => { 
    return instance.get(`/api/public/post/a/new`);
}

const getSametypePostApi = async (body) => { 
    return instance.post(`/api/public/post/b/same-type`, body);
}

export {
    createPostApi,
    updatePostApi,
    deletePostApi,
    getPostApi,
    searchPostApi,
    filterPostApi,
    getNewPostApi,
    getSametypePostApi
};
