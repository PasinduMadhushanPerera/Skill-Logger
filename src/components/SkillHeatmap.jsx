import { useMemo } from 'react'

function SkillHeatmap({ skills }) {
  const heatmapData = useMemo(() => {
    const today = new Date()
    const startDate = new Date(today)
    startDate.setDate(today.getDate() - 364) // Last 365 days

    const activityMap = {}
    
    // Initialize all days with 0
    for (let d = new Date(startDate); d <= today; d.setDate(d.getDate() + 1)) {
      const dateStr = new Date(d).toDateString()
      activityMap[dateStr] = 0
    }

    // Count activities per day
    skills.forEach(skill => {
      const created = new Date(skill.createdAt).toDateString()
      if (activityMap.hasOwnProperty(created)) {
        activityMap[created]++
      }
      const updated = new Date(skill.updatedAt).toDateString()
      if (updated !== created && activityMap.hasOwnProperty(updated)) {
        activityMap[updated]++
      }
    })

    // Convert to array for rendering
    const weeks = []
    let currentWeek = []
    
    for (let d = new Date(startDate); d <= today; d.setDate(d.getDate() + 1)) {
      const dateStr = new Date(d).toDateString()
      const count = activityMap[dateStr] || 0
      
      currentWeek.push({
        date: new Date(d),
        count,
        level: count === 0 ? 0 : count === 1 ? 1 : count === 2 ? 2 : count === 3 ? 3 : 4
      })
      
      if (currentWeek.length === 7) {
        weeks.push(currentWeek)
        currentWeek = []
      }
    }
    
    if (currentWeek.length > 0) {
      weeks.push(currentWeek)
    }

    return weeks
  }, [skills])

  const getLevelClass = (level) => {
    return `heatmap-cell level-${level}`
  }

  return (
    <div>
      <h3 className="chart-title">Learning Activity</h3>
      <div className="heatmap-container">
        <div className="heatmap-grid">
          {heatmapData.map((week, weekIndex) => (
            <div key={weekIndex} className="heatmap-week">
              {week.map((day, dayIndex) => (
                <div
                  key={dayIndex}
                  className={getLevelClass(day.level)}
                  title={`${day.date.toLocaleDateString()}: ${day.count} activities`}
                  data-count={day.count}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className="heatmap-legend">
        <span className="legend-label">Less</span>
        <div className="heatmap-cell level-0"></div>
        <div className="heatmap-cell level-1"></div>
        <div className="heatmap-cell level-2"></div>
        <div className="heatmap-cell level-3"></div>
        <div className="heatmap-cell level-4"></div>
        <span className="legend-label">More</span>
      </div>
    </div>
  )
}

export default SkillHeatmap
