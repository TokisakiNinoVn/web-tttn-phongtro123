import instance from '@/api/axiosConfig';

const getAllTypesApi = async () => instance.get('/api/public/type/');

export { getAllTypesApi };