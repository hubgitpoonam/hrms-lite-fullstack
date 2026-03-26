import { NavLink } from 'react-router-dom'

const DashboardIcon = () => (
  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round"
      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  </svg>
)

const EmployeesIcon = () => (
  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round"
      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
)

const AttendanceIcon = () => (
  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round"
      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
  </svg>
)

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <h2>HRMS <span>Lite</span></h2>
        <p>Admin Panel</p>
      </div>

      <nav className="sidebar-nav">
        <p className="nav-section-label">Main Menu</p>
        <NavLink to="/dashboard" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <DashboardIcon /> Dashboard
        </NavLink>
        <NavLink to="/employees" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <EmployeesIcon /> Employees
        </NavLink>
        <NavLink to="/attendance" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <AttendanceIcon /> Attendance
        </NavLink>
      </nav>

      <div className="sidebar-footer">
        <p>HRMS Lite &copy; {new Date().getFullYear()}</p>
      </div>
    </aside>
  )
}
