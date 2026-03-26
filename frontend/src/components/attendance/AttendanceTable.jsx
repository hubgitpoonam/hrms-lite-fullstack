import EmptyState from '../EmptyState'

function getInitials(name = '') {
  return name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase()
}

export default function AttendanceTable({ records, onEdit, onDelete }) {
  if (!records.length) {
    return (
      <EmptyState
        title="No attendance records found"
        description="Mark attendance for an employee to see records here."
      />
    )
  }

  return (
    <div className="table-wrapper">
      <table>
        <thead>
          <tr>
            <th>Employee</th>
            <th>Employee ID</th>
            <th>Department</th>
            <th>Date</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {records.map((rec) => (
            <tr key={rec.id}>
              <td>
                <div className="employee-cell">
                  <div className="avatar">
                    {getInitials(rec.employee_detail?.full_name || '')}
                  </div>
                  <span style={{ fontWeight: 500 }}>
                    {rec.employee_detail?.full_name || '—'}
                  </span>
                </div>
              </td>
              <td style={{ color: 'var(--text-secondary)', fontFamily: 'monospace' }}>
                {rec.employee_detail?.employee_id || '—'}
              </td>
              <td>
                {rec.employee_detail?.department
                  ? <span className="dept-tag">{rec.employee_detail.department}</span>
                  : '—'}
              </td>
              <td style={{ color: 'var(--text-secondary)' }}>
                {new Date(rec.date).toLocaleDateString('en-US', {
                  year: 'numeric', month: 'short', day: 'numeric',
                })}
              </td>
              <td>
                <span className={`badge badge-${rec.status}`}>{rec.status}</span>
              </td>
              <td>
                <div className="td-actions">
                  <button className="btn btn-secondary btn-sm" onClick={() => onEdit(rec)}>
                    Edit
                  </button>
                  <button className="btn btn-danger btn-sm" onClick={() => onDelete(rec)}>
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
