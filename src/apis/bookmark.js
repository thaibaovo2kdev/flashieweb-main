import axios from 'axios'

export function get() {
  return axios({
    url: `/api/bookmark`,
    method: 'GET',
  }).then((res) => res.data)
}

export function create(parentId, parentType) {
  return axios({
    url: `/api/bookmark`,
    data: { parentId, parentType },
    method: 'POST',
  }).then((res) => res.data)
}

export function del(parentId, parentType) {
  return axios({
    url: `/api/bookmark`,
    method: 'DELETE',
    data: { parentId, parentType },
  }).then((res) => res.data)
}
