import axios from 'axios'

const axiosApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true
})

const decideFinalProcess = (error, reject) => {
  let errorParsed = readError(error)

  reject(errorParsed)
}

const getHeaders = () => {
  const dataToReturn = { app: 'sta_web_admin' }
  return dataToReturn
}

const readError = error => {
  // console.log(error)
  if (error && error.response && error.response.status !== 401 && error.response.data) {
    let data = error.response.data
    return {
      status: error.response.status,
      name: data.name,
      message: data.message,
      errors: data.errors || [],
      details: data.details
    }
  } else {
    return error
  }
}

axiosApi.interceptors.request.use(
  function (config) {
    var hh = getHeaders()
    for (var k in hh) {
      if (hh[k] != null) {
        config.headers[k] = hh[k]
      }
    }

    // config.paramsSerializer = params => {
    //   // Qs is already included in the Axios package
    //   return qs.stringify(params, {
    //     arrayFormat: 'brackets',
    //     encode: false,
    //     skipNulls: true
    //   })
    // }

    return config
  },
  function (error) {
    return Promise.reject(error)
  }
)

function buildFormData(formData, data, parentKey) {
  if (data && typeof data === 'object' && !(data instanceof Date) && !(data instanceof File)) {
    Object.keys(data).forEach(key => {
      buildFormData(formData, data[key], parentKey ? `${parentKey}[${key}]` : key)
    })
  } else {
    const value = data == null ? '' : data

    formData.append(parentKey, value)
  }
}

const helperForMultipart = (keys, data, key, i, data2) => {
  keys.forEach(key2 => {
    if (data[key][i][key2] && data[key][i][key2] instanceof Date) {
      var strVal = moment(data[key][i][key2]).format('YYYY-MM-DD HH:mm:ss')
      data2.append([key + '[' + i + '][' + key2 + ']'], strVal)
    } else {
      if (Array.isArray(data[key])) {
        data2.append([key + '[' + i + '][' + key2 + ']'], JSON.stringify(data[key][i][key2]))
      } else {
        data2.append([key + '[' + i + '][' + key2 + ']'], data[key][i][key2])
      }
    }
  })

  return data2
}

const api = {
  api: axiosApi,
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  getHeaders: getHeaders,
  get: (path, params) => {
    return new Promise(async (resolve, reject) => {
      try {
        let resource = await axiosApi.get(path, { params: params ?? {} })

        resolve(resource?.data ?? {})
      } catch (error) {
        decideFinalProcess(error, reject)
      }
    })
  },
  post: (path, data, isMultipart, params) => {
    return new Promise(async (resolve, reject) => {
      let formData = data
      let config = {
        params: params ?? {}
      }

      if (data != null && isMultipart) {
        formData = new FormData()

        buildFormData(formData, data)

        // for (const key in data) {
        //   if (Array.isArray(data[key])) {
        //     for (let i = 0; i < data[key].length; i++) {
        //       if (data[key][i] instanceof File || data[key][i] instanceof Blob) {
        //         formData.append(key, data[key][i])
        //       }
        //     }
        //   } else {
        //     formData.append(key, data[key])
        //   }
        // }

        config.headers = getHeaders()
        config.headers['content-type'] = 'multipart/form-data'
      }

      try {
        let resource = await axiosApi.post(path, formData, config)
        resolve(resource?.data ?? {})
      } catch (error) {
        decideFinalProcess(error, reject)
      }
    })
  },
  put: (path, data) => {
    return new Promise(async (resolve, reject) => {
      try {
        let resource = await axiosApi.put(path, data)

        resolve(resource.data ?? {})
      } catch (error) {
        decideFinalProcess(error, reject)
      }
    })
  },
  delete: (path, params) => {
    return new Promise(async (resolve, reject) => {
      try {
        let resource = await axiosApi.delete(path, { data: params ?? undefined })

        resolve(resource?.data ?? {})
      } catch (error) {
        decideFinalProcess(error, reject)
      }
    })
  },
  addResponseInterceptor: (onResponse, onError) => {
    let onResponseCB = onResponse
      ? onResponse
      : response => {
          return response
        }
    let onErrorCB = onError
      ? onError
      : errror => {
          return Promise.reject(errror)
        }
    return axiosApi.interceptors.response.use(onResponseCB, onErrorCB)
  },
  removeResponseInterceptor: id => {
    axiosApi.interceptors.response.eject(id)
  }
}

export default api
