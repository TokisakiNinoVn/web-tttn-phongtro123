//upload.api.js
import instance from '@/api/axiosConfig';

const uploadApi = async (formData) => instance.post('/api/private/upload/', 
    formData, {
    headers: {
        'Content-Type': 'multipart/form-data',
    },
});
const upload3dApi = async (formData) => instance.post('/api/private/upload/3d', 
    formData, {
    headers: {
        'Content-Type': 'multipart/form-data',
    },
});

export {
    uploadApi,
    upload3dApi
};
