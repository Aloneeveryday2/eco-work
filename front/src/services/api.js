const API_URL = 'http://127.0.0.1:8000'

const getHeaders = () => ({
  'Content-Type': 'application/json',
  'Accept': 'application/json',
  'Authorization': `Bearer ${localStorage.getItem('token')}`,
})

const getAuthHeaders = () => ({
  'Accept': 'application/json',
  'Authorization': `Bearer ${localStorage.getItem('token')}`,
})

const publicHeaders = () => ({
  'Content-Type': 'application/json',
  'Accept': 'application/json',
})

export const apiRegister = async (data) => {
  const res = await fetch(`${API_URL}/api/register`, {
    method: 'POST',
    headers: publicHeaders(),
    body: JSON.stringify(data),
  })
  return { ok: res.ok, status: res.status, data: await res.json() }
}

export const apiLogin = async (data) => {
  const res = await fetch(`${API_URL}/api/login`, {
    method: 'POST',
    headers: publicHeaders(),
    body: JSON.stringify(data),
  })
  return { ok: res.ok, status: res.status, data: await res.json() }
}

export const apiLogout = async () => {
  const res = await fetch(`${API_URL}/api/logout`, {
    method: 'POST',
    headers: getHeaders(),
  })
  return { ok: res.ok }
}

export const apiGetEspaces = async () => {
  const res = await fetch(`${API_URL}/api/espaces`, {
    headers: { 'Accept': 'application/json' },
  })
  return { ok: res.ok, data: await res.json() }
}

export const apiGetEspace = async (id) => {
  const res = await fetch(`${API_URL}/api/espaces/${id}`, {
    headers: { 'Accept': 'application/json' },
  })
  return { ok: res.ok, data: await res.json() }
}

export const apiCreateEspace = async (formData) => {
  const res = await fetch(`${API_URL}/api/espaces`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: formData,
  })
  return { ok: res.ok, data: await res.json() }
}

export const apiUpdateEspace = async (id, formData) => {
  formData.append('_method', 'PUT');
  const res = await fetch(`${API_URL}/api/espaces/${id}`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: formData,
  })
  return { ok: res.ok, data: await res.json() }
}

export const apiDeleteEspace = async (id) => {
  const res = await fetch(`${API_URL}/api/espaces/${id}`, {
    method: 'DELETE',
    headers: getHeaders(),
  })
  return { ok: res.ok }
}

export const apiGetMyReservations = async () => {
  const res = await fetch(`${API_URL}/api/my-reservations`, {
    headers: getHeaders(),
  })
  return { ok: res.ok, data: await res.json() }
}

export const apiGetReservations = async () => {
  const res = await fetch(`${API_URL}/api/reservations`, {
    headers: getHeaders(),
  })
  return { ok: res.ok, data: await res.json() }
}

export const apiCreateReservation = async (data) => {
  const res = await fetch(`${API_URL}/api/reservations`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(data),
  })
  return { ok: res.ok, status: res.status, data: await res.json() }
}

export const apiDeleteReservation = async (id) => {
  const res = await fetch(`${API_URL}/api/reservations/${id}`, {
    method: 'DELETE',
    headers: getHeaders(),
  })
  return { ok: res.ok }
}

export const apiGetUsers = async () => {
  const res = await fetch(`${API_URL}/api/admin/users`, {
    headers: getHeaders(),
  })
  return { ok: res.ok, data: await res.json() }
}

export const apiUpdateUser = async (id, data) => {
  const res = await fetch(`${API_URL}/api/admin/users/${id}`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify(data),
  })
  return { ok: res.ok, data: await res.json() }
}

export const apiDeleteUser = async (id) => {
  const res = await fetch(`${API_URL}/api/admin/users/${id}`, {
    method: 'DELETE',
    headers: getHeaders(),
  })
  return { ok: res.ok }
}

export const apiCreateAdmin = async (data) => {
  const res = await fetch(`${API_URL}/api/admin/users`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(data),
  })
  return { ok: res.ok, status: res.status, data: await res.json() }
}

export const apiGetEquipements = async () => {
  const res = await fetch(`${API_URL}/api/equipements`, {
    headers: { 'Accept': 'application/json' },
  })
  return { ok: res.ok, data: await res.json() }
}

export const apiCreateEquipement = async (data) => {
  const res = await fetch(`${API_URL}/api/equipements`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(data),
  })
  return { ok: res.ok, data: await res.json() }
}

export const apiUpdateEquipement = async (id, data) => {
  const res = await fetch(`${API_URL}/api/equipements/${id}`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify(data),
  })
  return { ok: res.ok, data: await res.json() }
}

export const apiDeleteEquipement = async (id) => {
  const res = await fetch(`${API_URL}/api/equipements/${id}`, {
    method: 'DELETE',
    headers: getHeaders(),
  })
  return { ok: res.ok }
}


export { API_URL }