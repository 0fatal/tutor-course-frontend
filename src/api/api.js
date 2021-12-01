import axios from './axios'

export const ApiGet = async (path, config) => {
  return axios.get(path, config)
}

export const ApiPost = async (path, data, config) => {
  return axios.post(path, data, config)
}

export const ApiPatch = async (path, data, config) => {
  return axios.patch(path, data, config)
}
export const ApiDelete = async (path) => {
  return axios.delete(path)
}
