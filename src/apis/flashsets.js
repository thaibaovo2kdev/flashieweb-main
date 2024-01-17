import axios from 'axios'

export function getMyFlashsets({ page, perPage, q = '', type = '' }) {
  return axios({
    url: `/api/flashsets/me?page=${page}&perPage=${perPage}&q=${q}&type=${type}`,
    method: 'GET',
  }).then((res) => res.data)
}

export function getFlashsets({ page, perPage, params }) {
  return axios({
    url: `/api/flashsets?page=${page}&perPage=${perPage}`,
    method: 'GET',
    params,
  }).then((res) => res.data)
}

export function getFlashcards({ id, page, perPage }) {
  return axios({
    url: `/api/flashsets/${id}/cards?page=${page}&perPage=${perPage}`,
    method: 'GET',
  }).then((res) => res.data)
}

export function getFlashsetById(id) {
  return axios({
    url: `/api/flashsets/${id}`,
    method: 'GET',
  }).then((res) => res.data)
}

export function create(data) {
  return axios({
    url: `/api/flashsets`,
    data,
    method: 'POST',
  }).then((res) => res.data)
}
export function update(id, data) {
  return axios({
    url: `/api/flashsets/${id}`,
    data,
    method: 'PUT',
  }).then((res) => res.data)
}
export function del(id) {
  return axios({
    url: `/api/flashsets/${id}`,
    method: 'DELETE',
  }).then((res) => res.data)
}
export function learn(id, flashcards) {
  return axios({
    url: `/api/flashsets/${id}/learn`,
    data: { flashcards },
    method: 'POST',
  }).then((res) => res.data)
}
export function countdown(id, flashcards) {
  return axios({
    url: `/api/flashsets/${id}/countdown`,
    data: { flashcards },
    method: 'POST',
  }).then((res) => res.data)
}
export function histories(id, type, flashcards) {
  return axios({
    url: `/api/flashsets/${id}/histories`,
    data: { flashcards, type },
    method: 'POST',
  }).then((res) => res.data)
}
