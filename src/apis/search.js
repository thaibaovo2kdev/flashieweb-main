import axios from 'axios'

export function search(q) {
  return axios({
    url: `/api/search?q=${q}`,
    method: 'GET',
  }).then((res) => res.data)
}
