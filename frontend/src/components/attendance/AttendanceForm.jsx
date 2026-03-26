import { useState, useEffect, forwardRef } from 'react'

const initialState = { employee: '', date: '', status: '' }

const AttendanceForm = forwardRef(function AttendanceForm({ onSubmit, employees, initialData }, ref) {
  const [form, setForm] = useState(initialState)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (initialData) {
      setForm({
        employee: initialData.employee || '',
        date: initialData.date || '',
        status: initialData.status || '',
      })
    } else {
      setForm({ ...initialState, date: new Date().toISOString().split('T')[0] })
    }
    setErrors({})
  }, [initialData])

  const validate = () => {
    const errs = {}
    if (!form.employee) errs.employee = 'Please select an employee.'
    if (!form.date) errs.date = 'Date is required.'
    if (!form.status) errs.status = 'Please select a status.'
    return errs
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    onSubmit({ ...form, employee: Number(form.employee) })
  }

  return (
    <form ref={ref} onSubmit={handleSubmit} noValidate>
      <div className="form-group">
        <label className="form-label">Employee <span>*</span></label>
        <select
          name="employee"
          value={form.employee}
          onChange={handleChange}
          className={`form-select ${errors.employee ? 'error' : ''}`}
        >
          <option value="">Select employee</option>
          {employees.map((emp) => (
            <option key={emp.id} value={emp.id}>
              {emp.full_name} ({emp.employee_id})
            </option>
          ))}
        </select>
        {errors.employee && <p className="form-error">{errors.employee}</p>}
      </div>

      <div className="form-group">
        <label className="form-label">Date <span>*</span></label>
        <input
          type="date"
          name="date"
          value={form.date}
          onChange={handleChange}
          className={`form-input ${errors.date ? 'error' : ''}`}
          max={new Date().toISOString().split('T')[0]}
        />
        {errors.date && <p className="form-error">{errors.date}</p>}
      </div>

      <div className="form-group" style={{ marginBottom: 0 }}>
        <label className="form-label">Status <span>*</span></label>
        <select
          name="status"
          value={form.status}
          onChange={handleChange}
          className={`form-select ${errors.status ? 'error' : ''}`}
        >
          <option value="">Select status</option>
          <option value="present">Present</option>
          <option value="absent">Absent</option>
        </select>
        {errors.status && <p className="form-error">{errors.status}</p>}
      </div>
    </form>
  )
})

export default AttendanceForm
