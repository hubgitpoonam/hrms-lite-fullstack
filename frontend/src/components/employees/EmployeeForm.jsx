import { useState, useEffect, forwardRef } from 'react'

const DEPARTMENTS = [
  'Engineering', 'Human Resources', 'Finance', 'Marketing',
  'Sales', 'Operations', 'Design', 'Product', 'Legal', 'Support',
]

const initialState = { employee_id: '', full_name: '', email: '', department: '' }

const EmployeeForm = forwardRef(function EmployeeForm({ onSubmit, initialData }, ref) {
  const [form, setForm] = useState(initialState)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (initialData) {
      setForm({
        employee_id: initialData.employee_id || '',
        full_name: initialData.full_name || '',
        email: initialData.email || '',
        department: initialData.department || '',
      })
    } else {
      setForm(initialState)
    }
    setErrors({})
  }, [initialData])

  const validate = () => {
    const errs = {}
    if (!form.employee_id.trim()) errs.employee_id = 'Employee ID is required.'
    if (!form.full_name.trim()) errs.full_name = 'Full name is required.'
    if (!form.email.trim()) {
      errs.email = 'Email is required.'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errs.email = 'Enter a valid email address.'
    }
    if (!form.department) errs.department = 'Department is required.'
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
    onSubmit(form)
  }

  return (
    <form ref={ref} onSubmit={handleSubmit} noValidate>
      <div className="form-group">
        <label className="form-label">Employee ID <span>*</span></label>
        <input
          name="employee_id"
          value={form.employee_id}
          onChange={handleChange}
          className={`form-input ${errors.employee_id ? 'error' : ''}`}
          placeholder="e.g. EMP001"
          disabled={!!initialData}
        />
        {errors.employee_id && <p className="form-error">{errors.employee_id}</p>}
      </div>

      <div className="form-group">
        <label className="form-label">Full Name <span>*</span></label>
        <input
          name="full_name"
          value={form.full_name}
          onChange={handleChange}
          className={`form-input ${errors.full_name ? 'error' : ''}`}
          placeholder="e.g. John Smith"
        />
        {errors.full_name && <p className="form-error">{errors.full_name}</p>}
      </div>

      <div className="form-group">
        <label className="form-label">Email Address <span>*</span></label>
        <input
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          className={`form-input ${errors.email ? 'error' : ''}`}
          placeholder="e.g. john@company.com"
        />
        {errors.email && <p className="form-error">{errors.email}</p>}
      </div>

      <div className="form-group" style={{ marginBottom: 0 }}>
        <label className="form-label">Department <span>*</span></label>
        <select
          name="department"
          value={form.department}
          onChange={handleChange}
          className={`form-select ${errors.department ? 'error' : ''}`}
        >
          <option value="">Select department</option>
          {DEPARTMENTS.map((d) => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>
        {errors.department && <p className="form-error">{errors.department}</p>}
      </div>
    </form>
  )
})

export default EmployeeForm
