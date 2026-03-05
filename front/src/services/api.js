const API_URL = 'http://127.0.0.1:8000'

const getCookie = (name) => {
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'))
  return match ? decodeURIComponent(match[2]) : ''
}

const getHeaders = () => ({
  'Content-Type': 'application/json',
  Accept: 'application/json',
  'X-XSRF-TOKEN': getCookie('XSRF-TOKEN'),
})

const csrf = () =>
  fetch(`${API_URL}/sanctum/csrf-cookie`, { credentials: 'include' })

// AUTH
export const apiRegister = async (data) => {
  await csrf()
  const res = await fetch(`${API_URL}/api/register`, {
    method: 'POST',
    headers: getHeaders(),
    credentials: 'include',
    body: JSON.stringify(data),
  })
  return { ok: res.ok, status: res.status, data: await res.json() }
}

export const apiLogin = async (data) => {
  await csrf()
  const res = await fetch(`${API_URL}/api/login`, {
    method: 'POST',
    headers: getHeaders(),
    credentials: 'include',
    body: JSON.stringify(data),
  })
  return { ok: res.ok, status: res.status, data: await res.json() }
}

export const apiLogout = async () => {
  await csrf()
  const res = await fetch(`${API_URL}/api/logout`, {
    method: 'POST',
    headers: {
      ...getHeaders(),
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
    credentials: 'include',
  })
  return { ok: res.ok }
}

// ESPACES
export const apiGetEspaces = async (page = 1) => {
  const res = await fetch(`${API_URL}/api/espaces?page=${page}`, {
    headers: { Accept: 'application/json' },
  })
  return { ok: res.ok, data: await res.json() }
}



export { API_URL }