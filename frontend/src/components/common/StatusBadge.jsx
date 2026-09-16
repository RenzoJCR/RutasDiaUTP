function StatusBadge({ status, children }) {
  const statusClass = {
    success: 'status-badge status-badge-success',
    warning: 'status-badge status-badge-warning',
    danger: 'status-badge status-badge-danger',
    info: 'status-badge status-badge-info',
    neutral: 'status-badge status-badge-neutral',
  }

  return (
    <span className={statusClass[status] ?? statusClass.neutral}>
      {children}
    </span>
  )
}

export default StatusBadge