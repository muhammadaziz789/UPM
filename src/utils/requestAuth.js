
import axios from "axios";
import { store } from "../redux/store";
import { showAlert } from "../redux/thunks/alert.thunk";

export const baseURL = process.env.REACT_APP_AUTH_API_URL

const requestAuth = axios.create({
  baseURL,
  timeout: 100000,
})

const errorHandler = (error, hooks) => {
  if (error?.response) {
    if(error.response?.data?.data) {
      store.dispatch(showAlert(error.response.data.data?.replace('rpc error: code = InvalidArgument desc = ', '')))
    }

    if (error?.response?.status === 403) {

    }
    else if ( error?.response?.status === 401) {
      // store.dispatch(logout())
    }
  }

  else store.dispatch(showAlert('___ERROR___'))

  return Promise.reject(error.response)
}

requestAuth.interceptors.request.use(
  config => {
    const token = store.getState().auth.token
    if(token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },

  error => errorHandler(error)
)

requestAuth.interceptors.response.use(response => response.data.data , errorHandler)

export default requestAuth