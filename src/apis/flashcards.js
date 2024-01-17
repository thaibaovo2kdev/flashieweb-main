import axios from 'axios'

export function getFlashcard({ page, perPage }) {
  return axios({
    url: `/api/flashset/?page=${page}&perPage=${perPage}`,
    method: 'GET',
  }).then((res) => res.data)
}
export function getFlashcardById(id) {
  return axios({
    url: `/api/flashcards/${id}`,
    method: 'GET',
  }).then((res) => res.data)
}

export function create(data) {
  return axios({
    url: `/api/flashcards`,
    data,
    method: 'POST',
  }).then((res) => res.data)
}
export function importCards(data) {
  return axios({
    url: `/api/flashcards/import`,
    data,
    method: 'POST',
  }).then((res) => res.data)
}
export function update(id, data) {
  return axios({
    url: `/api/flashcards/${id}`,
    data,
    method: 'PUT',
  }).then((res) => res.data)
}
export function del(id) {
  return axios({
    url: `/api/flashcards/${id}`,
    method: 'DELETE',
  }).then((res) => res.data)
}
