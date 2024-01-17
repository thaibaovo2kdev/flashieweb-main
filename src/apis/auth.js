import axios from 'axios'

export function sendOTP(uid) {
  return axios({
    url: `/api/auth/otp-send`,
    data: { uid },
    method: 'POST',
  }).then((res) => res.data)
}
export function verifyOTP({ uid, code }) {
  return axios({
    url: `/api/auth/otp-verify`,
    data: { uid, code },
    method: 'POST',
  }).then((res) => res.data)
}
export function resetPassword(uid) {
  return axios({
    url: `/api/auth/reset-password`,
    data: { uid },
    method: 'POST',
  }).then((res) => res.data)
}
export function updatePassword(password, token) {
  return axios({
    url: `/api/auth/reset-password`,
    data: { password, token },
    method: 'PUT',
  }).then((res) => res.data)
}

export function changePassword(oldPassword, newPassword) {
  return axios({
    url: `/api/auth/change-password`,
    data: { oldPassword, newPassword },
    method: 'PUT',
  }).then((res) => res.data)
}
