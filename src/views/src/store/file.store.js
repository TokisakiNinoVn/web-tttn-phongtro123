import { defineStore } from 'pinia';
import { uploadApi, upload3dApi } from '@/api/modules/upload.api';

export const useFileStore = defineStore('file', {
  state: () => ({
    files: [], // Lưu trữ danh sách file
    file: null, // Lưu trữ thông tin của một file cụ thể
    error: null, // Lưu trữ thông tin lỗi
    loading: false // Trạng thái tải dữ liệu
  }),
  actions: {
    // Hàm upload file
    async uploadFileAction(formData) {
      this.loading = true;
      try {
        const response = await uploadApi(formData);
        this.files.push(response.data);
        return response.data || {};
      } catch (err) {
        // Xử lý lỗi nếu có
        this.error = err.response?.data?.message || 'Failed to upload file';
      } finally {
        this.loading = false;
      }
    },
    async uploadFile3dAction(formData) {
      this.loading = true;
      try {
        const response = await upload3dApi(formData);
        this.files.push(response.data);
        return response.data || {};
      } catch (err) {
        // Xử lý lỗi nếu có
        this.error = err.response?.data?.message || 'Failed to upload file';
      } finally {
        this.loading = false;
      }
    },
  },
});
