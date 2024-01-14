import axios, { AxiosHeaders, AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios'

const axiosInstance: AxiosInstance = axios.create({
  baseURL: `${process.env.REACT_APP_BE_BASE_API_DEMO}`,
  responseType: 'json'
})

// add content type default header
axiosInstance.interceptors.request.use((request: InternalAxiosRequestConfig<any>) => {
  if (!request.headers) {
    request.headers = {} as AxiosHeaders
  }
  if (!request.headers['Content-Type']) {
    request.headers['Content-Type'] = 'application/json'
  }
  return request
})

// get data from api default
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    return response.data
  },
  // handle error
  (error: { response: any }) => {
    const { response } = error
    // reject promise
    // for development
    console.log(error)
    return Promise.reject(response)
  }
)

const get = async (path: string, queryParams: string = ''): Promise<any> => {
  return axiosInstance.get(`${path}${queryParams ? '?' + queryParams : ''}`)
}

export { get }
