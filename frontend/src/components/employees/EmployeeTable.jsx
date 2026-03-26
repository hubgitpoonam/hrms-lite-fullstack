import EmptyState from '../EmptyState'

function getInitials(name = '') {
  return name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase()
}

export default function EmployeeTable({ employees, onEdit, onDelete }) {
  if (!employees.length) {
    return (
      <EmptyState
        title="No employees found"
        description="Add your first employee to get started."
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
            <th>Email</th>
            <th>Department</th>
            <th>Joined</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((emp) => (
            <tr key={emp.id}>
              <td>
                <div className="employee-cell">
                  <div className="avatar">{getInitials(emp.full_name)}</div>
                  <span style={{ fontWeight: 500 }}>{emp.full_name}</span>
                </div>
              </td>
              <td style={{ color: 'var(--text-secondary)', fontFamily: 'monospace' }}>
                {emp.employee_id}
              </td>
              <td style={{ color: 'var(--text-secondary)' }}>{emp.email}</td>
              <td><span className="dept-tag">{emp.department}</span></td>
              <td style={{ color: 'var(--text-secondary)' }}>
                {new Date(emp.created_at).toLocaleDateString('en-US', {
                  year: 'numeric', month: 'short', day: 'numeric',
                })}
              </td>
              <td>
                <div className="td-actions">
                  <button className="btn btn-secondary btn-sm" onClick={() => onEdit(emp)}>
                    Edit
                  </button>
                  <button className="btn btn-danger btn-sm" onClick={() => onDelete(emp)}>
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
