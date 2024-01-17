import axios from 'axios'

export function getUsers(params) {
  return axios({
    url: `/api/users`,
    method: 'GET',
    params,
  }).then((res) => res.data)
}

export function importUsers(data) {
  return axios({
    url: `/api/users/import`,
    data,
    method: 'POST',
  }).then((res) => res.data)
}

export function get(id) {
  return axios({
    url: `/api/users/${id}`,
    method: 'GET',
  }).then((res) => res.data)
}

export function del(id) {
  return axios({
    url: `/api/users/${id}`,
    method: 'GET',
  }).then((res) => res.data)
}

export function update(id, data) {
  return axios({
    url: `/api/users/${id}`,
    data,
    method: 'PUT',
  }).then((res) => res.data)
}

export function addFriend(id) {
  return axios({
    url: `/api/users/${id}/friends`,
    method: 'POST',
  }).then((res) => res.data)
}

export function unFriend(id) {
  return axios({
    url: `/api/users/${id}/friends`,
    method: 'DELETE',
  }).then((res) => res.data)
}
export function acceptFriend(id) {
  return axios({
    url: `/api/users/${id}/friends`,
    method: 'PUT',
  }).then((res) => res.data)
}
export function getFriends(id = 'me', params) {
  return axios({
    url: `/api/users/${id}/friends`,
    params,
    method: 'GET',
  }).then((res) => res.data)
}
