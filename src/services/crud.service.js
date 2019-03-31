import ApiService from './api.service'
import store from '@/store'
const CreateService = {
  fetchRecords: async (page, endpoint) => {
    const requestConfig = {
      method: 'get',
      url: `${endpoint}`,
      params: {
        page
      }
    }

    try {
      const response = await ApiService.customRequest(requestConfig)
      return response.data
    } catch (error) {
      throw error
    }
  },
  fetchSingle: async (endpoint, routeKey) => {
    const requestConfig = {
      method: 'get',
      url: `${endpoint}/${routeKey}`
    }
    try {
      const response = await ApiService.customRequest(requestConfig)
      return response.data.data
    } catch (error) {
      throw error
    }
  },
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
  },

  update: async (endpoint, formData) => {
    const requestConfig = {
      method: 'post',
      url: endpoint,
      data: formData,
      params: {
        '_method': 'PUT'
      },
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
  },

  destroy: async endpoint => {
    const requestConfig = {
      method: 'delete',
      url: endpoint
    }

    try {
      const response = await ApiService.customRequest(requestConfig)
      store.dispatch('status/setMessage', response.data.status)
    } catch (error) {
      throw error
    }
  }
}

export default CreateService
