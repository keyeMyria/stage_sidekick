import {stringify} from "query-string"

const Api = (endpoint, method = 'get', payload = null, params = {}) => {
  const fetchOptions = {
    method,
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  }
  if (payload) {
    payload.production_id = 1
    fetchOptions.body = JSON.stringify(payload)
  }

  if (Object.keys(params).length > 0) {
    endpoint += `?${stringify(params)}`
  }
  return fetch(`/api/${endpoint}`, fetchOptions)
    .then(response => {
      if (response.ok) {
        return response.json()
      }
    })
    .catch(error => {
      throw error;
    })
};

export default Api
