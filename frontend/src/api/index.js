import axios from 'axios'

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: { 'Content-Type': 'application/json' },
})

API.interceptors.response.use(
  (response) => response,
  (error) => {
    const data = error.response?.data
    let message = 'Something went wrong. Please try again.'
    if (data) {
      if (typeof data === 'string') {
        message = data
      } else if (data.detail) {
        message = data.detail
      } else {
        const firstKey = Object.keys(data)[0]
        const firstVal = data[firstKey]
        message = Array.isArray(firstVal) ? firstVal[0] : firstVal
      }
    }
    return Promise.reject({ ...error, userMessage: message })
  }
)

// ── Employees ──
export const getEmployees = () => API.get('/employees/')
export const getEmployee = (id) => API.get(`/employees/${id}/`)
export const createEmployee = (data) => API.post('/employees/', data)
export const updateEmployee = (id, data) => API.patch(`/employees/${id}/`, data)
export const deleteEmployee = (id) => API.delete(`/employees/${id}/`)

// ── Attendance ──
export const getAttendance = (params = {}) => API.get('/attendance/', { params })
export const createAttendance = (data) => API.post('/attendance/', data)
export const updateAttendance = (id, data) => API.put(`/attendance/${id}/`, data)
export const deleteAttendance = (id) => API.delete(`/attendance/${id}/`)
export const getAttendanceSummary = (employeeId) =>
  API.get(`/attendance/summary/${employeeId}/`)

export default API
