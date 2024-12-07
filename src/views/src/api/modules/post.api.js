//post.api.js
import instance from '@/api/axiosConfig';

const createPostApi = async (postData) => {
    return instance.post('/api/private/post/create', postData);
};

const updatePostApi = async (postData) => {
    return instance.put('/api/private/post/update', postData);
};

const deletePostApi = async (id) => {
    return instance.delete(`/api/private/post/delete/${id}`);
};

export {
    createPostApi,
    updatePostApi,
    deletePostApi
};
