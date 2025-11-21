function DecayWarning({ skill }) {
  if (!skill.lastPracticed) return null

  const lastPracticedDate = new Date(skill.lastPracticed)
  const now = new Date()
  const daysSince = Math.floor((now - lastPracticedDate) / (1000 * 60 * 60 * 24))

  const getWarningLevel = (days) => {
    if (days >= 90) return { level: 'critical', message: '⚠️ Critical: No practice in 3+ months!', color: '#ff4444' }
    if (days >= 60) return { level: 'high', message: '⚠️ Warning: No practice in 2+ months', color: '#ff9800' }
    if (days >= 30) return { level: 'medium', message: '⚠️ Attention: No practice in 1+ month', color: '#ffc107' }
    return null
  }

  const warning = getWarningLevel(daysSince)
  if (!warning) return null

  return (
    <div className="decay-warning" style={{ borderLeftColor: warning.color }}>
      <span className="decay-message">{warning.message}</span>
      <span className="decay-days">{daysSince} days ago</span>
    </div>
  )
}

export default DecayWarning
