import { useState, useEffect, useRef } from 'react'
import { getEmployees, createEmployee, updateEmployee, deleteEmployee } from '../api'
import EmployeeForm from '../components/employees/EmployeeForm'
import EmployeeTable from '../components/employees/EmployeeTable'
import Modal from '../components/Modal'
import LoadingSpinner from '../components/LoadingSpinner'

export default function Employees() {
  const [employees, setEmployees] = useState([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const [showForm, setShowForm] = useState(false)
  const [editTarget, setEditTarget] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [formData, setFormData] = useState(null)

  const fetchEmployees = async () => {
    try {
      const res = await getEmployees()
      setEmployees(res.data)
    } catch {
      setError('Failed to load employees. Please refresh.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchEmployees() }, [])

  const handleAdd = () => { setEditTarget(null); setShowForm(true); setError(''); setFormData(null) }
  const handleEdit = (emp) => { setEditTarget(emp); setShowForm(true); setError(''); setFormData(null) }
  const handleCloseForm = () => { setShowForm(false); setEditTarget(null); setError('') }

  const handleFormSubmit = async (data) => {
    setSubmitting(true)
    setError('')
    try {
      if (editTarget) {
        await updateEmployee(editTarget.id, data)
      } else {
        await createEmployee(data)
      }
      await fetchEmployees()
      handleCloseForm()
    } catch (err) {
      setError(err.userMessage || 'Failed to save employee.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return
    setSubmitting(true)
    try {
      await deleteEmployee(deleteTarget.id)
      await fetchEmployees()
      setDeleteTarget(null)
    } catch {
      setError('Failed to delete employee.')
      setDeleteTarget(null)
    } finally {
      setSubmitting(false)
    }
  }

  const formRef = useRef(null)

  const triggerSubmit = () => {
    if (formRef.current) {
      formRef.current.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }))
    }
  }

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Employees</h1>
          <p>{employees.length} employee{employees.length !== 1 ? 's' : ''} registered</p>
        </div>
        <button className="btn btn-primary" onClick={handleAdd}>
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Add Employee
        </button>
      </div>

      {error && !showForm && (
        <div className="alert alert-error">{error}</div>
      )}

      <div className="card">
        {loading ? (
          <LoadingSpinner message="Loading employees..." />
        ) : (
          <EmployeeTable
            employees={employees}
            onEdit={handleEdit}
            onDelete={setDeleteTarget}
          />
        )}
      </div>

      {/* Add / Edit Modal */}
      <Modal
        isOpen={showForm}
        onClose={handleCloseForm}
        title={editTarget ? 'Edit Employee' : 'Add New Employee'}
        footer={
          <>
            <button className="btn btn-secondary" onClick={handleCloseForm} disabled={submitting}>
              Cancel
            </button>
            <button className="btn btn-primary" onClick={triggerSubmit} disabled={submitting}>
              {submitting ? 'Saving...' : editTarget ? 'Save Changes' : 'Add Employee'}
            </button>
          </>
        }
      >
        {error && <div className="alert alert-error" style={{ marginBottom: 16 }}>{error}</div>}
        <EmployeeForm
          ref={formRef}
          onSubmit={handleFormSubmit}
          onCancel={handleCloseForm}
          initialData={editTarget}
          loading={submitting}
        />
      </Modal>

      {/* Delete Confirm Modal */}
      <Modal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Delete Employee"
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setDeleteTarget(null)} disabled={submitting}>
              Cancel
            </button>
            <button
              onClick={handleDeleteConfirm}
              disabled={submitting}
              className="btn btn-sm"
              style={{ background: 'var(--danger)', color: '#fff', padding: '9px 16px', fontSize: '13.5px' }}
            >
              {submitting ? 'Deleting...' : 'Delete'}
            </button>
          </>
        }
      >
        <div className="confirm-icon">
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round"
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </div>
        <div className="confirm-text">
          <h4>Delete {deleteTarget?.full_name}?</h4>
          <p>This will permanently delete this employee and all their attendance records. This action cannot be undone.</p>
        </div>
      </Modal>
    </div>
  )
}
