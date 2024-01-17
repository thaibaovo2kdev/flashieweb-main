import axios from 'axios'

export function myCourses(params) {
  return axios({
    url: `/api/courses/me`,
    method: 'GET',
    params,
  }).then((res) => res.data)
}
export function getCourses({ page, perPage, params }) {
  return axios({
    url: `/api/courses?page=${page}&perPage=${perPage}`,
    method: 'GET',
    params,
  }).then((res) => res.data)
}
export function getCourseById(id) {
  return axios({
    url: `/api/courses/${id}`,
    method: 'GET',
  }).then((res) => res.data)
}
export function create(data) {
  return axios({
    url: `/api/courses`,
    data,
    method: 'POST',
  }).then((res) => res.data)
}
export function update(id, data) {
  return axios({
    url: `/api/courses/${id}`,
    data,
    method: 'PUT',
  }).then((res) => res.data)
}
export function del(id) {
  return axios({
    url: `/api/courses/${id}`,
    method: 'DELETE',
  }).then((res) => res.data)
}
export function getInvites() {
  return axios({
    url: `/api/courses/invites`,
    method: 'GET',
  }).then((res) => res.data)
}
export function getStudents(id, { page, perPage }) {
  return axios({
    url: `/api/courses/${id}/students?page=${page}&perPage=${perPage}`,
    method: 'GET',
  }).then((res) => res.data)
}
export function addStudent(id, studentId, status = 'pending') {
  return axios({
    url: `/api/courses/${id}/students`,
    method: 'POST',
    data: { studentId, status },
  }).then((res) => res.data)
}
export function updateStudent(id, studentId, status = 'pending') {
  return axios({
    url: `/api/courses/${id}/students/${studentId}`,
    method: 'PUT',
    data: { status },
  }).then((res) => res.data)
}
export function delStudent(id, studentId) {
  return axios({
    url: `/api/courses/${id}/students/${studentId}`,
    method: 'DELETE',
  }).then((res) => res.data)
}

export function getFlashsets(id, { page, perPage }) {
  return axios({
    url: `/api/courses/${id}/flashsets?page=${page}&perPage=${perPage}`,
    method: 'GET',
  }).then((res) => res.data)
}
export function addFlashsets(id, flashsetIds) {
  return axios({
    url: `/api/courses/${id}/flashsets`,
    method: 'POST',
    data: { flashsetIds },
  }).then((res) => res.data)
}
export function updateCourseFlashsets(id, flashsetId, data) {
  return axios({
    url: `/api/courses/${id}/flashsets/${flashsetId}`,
    method: 'POST',
    data,
  }).then((res) => res.data)
}
export function delCourseFlashsets(id, flashsetId) {
  return axios({
    url: `/api/courses/${id}/flashsets/${flashsetId}`,
    method: 'DELETE',
  }).then((res) => res.data)
}
export function createQuiz(id, flashsetId, types) {
  return axios({
    url: `/api/courses/${id}/flashsets/${flashsetId}/quiz`,
    method: 'POST',
    data: { types },
  }).then((res) => res.data)
}
export function getQuiz(id, flashsetId, params) {
  return axios({
    url: `/api/courses/${id}/flashsets/${flashsetId}/quiz`,
    method: 'GET',
    params,
  }).then((res) => res.data)
}
export function createToken(id) {
  return axios({
    url: `/api/courses/${id}/token`,
    method: 'POST',
  }).then((res) => res.data)
}

export function joinToken(token) {
  return axios({
    url: `/api/courses/token`,
    method: 'POST',
    data: { token },
  }).then((res) => res.data)
}

export function importStudents(id, students) {
  return axios({
    url: `/api/courses/${id}/import_students`,
    method: 'POST',
    data: { students },
  }).then((res) => res.data)
}
