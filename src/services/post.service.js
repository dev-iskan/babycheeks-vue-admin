import ApiService from './api.service'
import store from '@/store'
const CreateService = {
  store: async (endpoint, formData) => {
    const requestConfig = {
      method: 'post',
      url: endpoint,
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }
    try {
      const response = await ApiService.customRequest(requestConfig)
      store.dispatch('status/setMessage', response.data.status)
      return response.data.status
    } catch (error) {
      throw error
    }
  }
}

export default CreateService
