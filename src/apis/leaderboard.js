import axios from 'axios'

export function getLeaderboard() {
  return axios({
    url: `/api/leaderboard`,
    method: 'GET',
  }).then((res) => res.data)
}

export function getMyScores(params) {
  return axios({
    url: `/api/leaderboard/me`,
    method: 'GET',
    params,
  }).then((res) => res.data)
}
