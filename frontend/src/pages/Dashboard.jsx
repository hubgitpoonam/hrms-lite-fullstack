import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getEmployees, getAttendance } from '../api'
import LoadingSpinner from '../components/LoadingSpinner'

function StatCard({ icon, label, value, colorClass }) {
  return (
    <div className="stat-card">
      <div className={`stat-icon ${colorClass}`}>{icon}</div>
      <div className="stat-info">
        <h3>{value}</h3>
        <p>{label}</p>
      </div>
    </div>
  )
}

export default function Dashboard() {
  const [employees, setEmployees] = useState([])
  const [todayRecords, setTodayRecords] = useState([])
  const [recentAttendance, setRecentAttendance] = useState([])
  const [loading, setLoading] = useState(true)

  const today = new Date().toISOString().split('T')[0]

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [empRes, todayRes, recentRes] = await Promise.all([
          getEmployees(),
          getAttendance({ date: today }),
          getAttendance(),
        ])
        setEmployees(empRes.data)
        setTodayRecords(todayRes.data)
        setRecentAttendance(recentRes.data.slice(0, 8))
      } catch {
        // fail silently on dashboard
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [today])

  if (loading) return <LoadingSpinner message="Loading dashboard..." />

  const presentToday = todayRecords.filter((r) => r.status === 'present').length
  const absentToday = todayRecords.filter((r) => r.status === 'absent').length

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Dashboard</h1>
          <p>Welcome back! Here&apos;s what&apos;s happening today.</p>
        </div>
        <span style={{ color: 'var(--text-secondary)', fontSize: 13 }}>
          {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </span>
      </div>

      <div className="stats-grid">
        <StatCard
          colorClass="blue"
          value={employees.length}
          label="Total Employees"
          icon={
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          }
        />
        <StatCard
          colorClass="green"
          value={presentToday}
          label="Present Today"
          icon={
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
        <StatCard
          colorClass="red"
          value={absentToday}
          label="Absent Today"
          icon={
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
        <StatCard
          colorClass="yellow"
          value={todayRecords.length}
          label="Marked Today"
          icon={
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          }
        />
      </div>

      <div className="card">
        <div className="section-header">
          <h3>Recent Attendance</h3>
          <Link to="/attendance" className="btn btn-secondary btn-sm">View All</Link>
        </div>
        {recentAttendance.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>
            No attendance records yet.
          </div>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>Department</th>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentAttendance.map((rec) => (
                  <tr key={rec.id}>
                    <td>
                      <span style={{ fontWeight: 500 }}>
                        {rec.employee_detail?.full_name || '—'}
                      </span>
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
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
