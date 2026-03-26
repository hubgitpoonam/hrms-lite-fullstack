import { useState, useEffect, useRef } from 'react'
import { getEmployees, getAttendance, createAttendance, updateAttendance, deleteAttendance } from '../api'
import AttendanceForm from '../components/attendance/AttendanceForm'
import AttendanceTable from '../components/attendance/AttendanceTable'
import Modal from '../components/Modal'
import LoadingSpinner from '../components/LoadingSpinner'

export default function Attendance() {
  const [records, setRecords] = useState([])
  const [employees, setEmployees] = useState([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const [showForm, setShowForm] = useState(false)
  const [editTarget, setEditTarget] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)

  const [filterEmployee, setFilterEmployee] = useState('')
  const [filterDate, setFilterDate] = useState('')

  const formRef = useRef(null)

  const fetchAttendance = async () => {
    const params = {}
    if (filterEmployee) params.employee = filterEmployee
    if (filterDate) params.date = filterDate
    try {
      const res = await getAttendance(params)
      setRecords(res.data)
    } catch {
      setError('Failed to load attendance records.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getEmployees().then((res) => setEmployees(res.data)).catch(() => {})
  }, [])

  useEffect(() => {
    setLoading(true)
    fetchAttendance()
  }, [filterEmployee, filterDate])

  const handleMark = () => { setEditTarget(null); setShowForm(true); setError('') }
  const handleEdit = (rec) => { setEditTarget(rec); setShowForm(true); setError('') }
  const handleCloseForm = () => { setShowForm(false); setEditTarget(null); setError('') }

  const triggerSubmit = () => {
    if (formRef.current) {
      formRef.current.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }))
    }
  }

  const handleFormSubmit = async (data) => {
    setSubmitting(true)
    setError('')
    try {
      if (editTarget) {
        await updateAttendance(editTarget.id, data)
      } else {
        await createAttendance(data)
      }
      await fetchAttendance()
      handleCloseForm()
    } catch (err) {
      setError(err.userMessage || 'Failed to save attendance.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return
    setSubmitting(true)
    try {
      await deleteAttendance(deleteTarget.id)
      await fetchAttendance()
      setDeleteTarget(null)
    } catch {
      setError('Failed to delete record.')
      setDeleteTarget(null)
    } finally {
      setSubmitting(false)
    }
  }

  const clearFilters = () => { setFilterEmployee(''); setFilterDate('') }

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Attendance</h1>
          <p>{records.length} record{records.length !== 1 ? 's' : ''} found</p>
        </div>
        <button className="btn btn-primary" onClick={handleMark}>
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Mark Attendance
        </button>
      </div>

      {error && !showForm && (
        <div className="alert alert-error">{error}</div>
      )}

      <div className="filters-bar">
        <select
          className="filter-select"
          value={filterEmployee}
          onChange={(e) => setFilterEmployee(e.target.value)}
        >
          <option value="">All Employees</option>
          {employees.map((emp) => (
            <option key={emp.id} value={emp.id}>
              {emp.full_name} ({emp.employee_id})
            </option>
          ))}
        </select>

        <input
          type="date"
          className="filter-input"
          value={filterDate}
          onChange={(e) => setFilterDate(e.target.value)}
          max={new Date().toISOString().split('T')[0]}
        />

        {(filterEmployee || filterDate) && (
          <button className="btn btn-secondary btn-sm" onClick={clearFilters}>
            Clear Filters
          </button>
        )}
      </div>

      <div className="card">
        {loading ? (
          <LoadingSpinner message="Loading attendance..." />
        ) : (
          <AttendanceTable
            records={records}
            onEdit={handleEdit}
            onDelete={setDeleteTarget}
          />
        )}
      </div>

      {/* Mark / Edit Modal */}
      <Modal
        isOpen={showForm}
        onClose={handleCloseForm}
        title={editTarget ? 'Edit Attendance' : 'Mark Attendance'}
        footer={
          <>
            <button className="btn btn-secondary" onClick={handleCloseForm} disabled={submitting}>
              Cancel
            </button>
            <button className="btn btn-primary" onClick={triggerSubmit} disabled={submitting}>
              {submitting ? 'Saving...' : editTarget ? 'Save Changes' : 'Mark Attendance'}
            </button>
          </>
        }
      >
        {error && <div className="alert alert-error" style={{ marginBottom: 16 }}>{error}</div>}
        <AttendanceForm
          ref={formRef}
          onSubmit={handleFormSubmit}
          employees={employees}
          initialData={editTarget}
        />
      </Modal>

      {/* Delete Confirm Modal */}
      <Modal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Delete Record"
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
          <h4>Delete this record?</h4>
          <p>
            Attendance for <strong>{deleteTarget?.employee_detail?.full_name}</strong> on{' '}
            <strong>{deleteTarget?.date}</strong> will be permanently removed.
          </p>
        </div>
      </Modal>
    </div>
  )
}
