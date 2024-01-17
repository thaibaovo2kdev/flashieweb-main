import axios from 'axios'

export function me(params) {
  return axios({
    url: `/api/games/me`,
    method: 'GET',
    params,
  }).then((res) => res.data)
}
export function readAll(params) {
  return axios({
    url: `/api/games`,
    method: 'GET',
    params,
  }).then((res) => res.data)
}
export function readById(id) {
  return axios({
    url: `/api/games/${id}`,
    method: 'GET',
  }).then((res) => res.data)
}

export function create(data) {
  return axios({
    url: `/api/games`,
    data,
    method: 'POST',
  }).then((res) => res.data)
}
export function update(id, data) {
  return axios({
    url: `/api/games/${id}`,
    data,
    method: 'PUT',
  }).then((res) => res.data)
}
export function del(id) {
  return axios({
    url: `/api/games/${id}`,
    method: 'DELETE',
  }).then((res) => res.data)
}

export function scenes(id) {
  return axios({
    url: `/api/games/${id}/scenes`,
    method: 'GET',
  }).then((res) => res.data)
}
export function cardsOfScene(id, sceneId) {
  return axios({
    url: `/api/games/${id}/scenes/${sceneId}`,
    method: 'GET',
  }).then((res) => res.data)
}
