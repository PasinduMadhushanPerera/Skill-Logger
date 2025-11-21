import { useState, useEffect } from 'react'

function PracticeTimer({ skill, onUpdateTime }) {
  const modes = {
    focus: 25 * 60,
    shortBreak: 5 * 60,
    longBreak: 15 * 60
  }

  const formatTime = (totalSeconds) => {
    // Ensure we have a valid number
    const secs = Number(totalSeconds) || 0
    const minutes = Math.floor(secs / 60)
    const remainingSeconds = Math.floor(secs % 60)
    
    // Force string conversion and padding
    const minuteStr = String(minutes).padStart(2, '0')
    const secondStr = String(remainingSeconds).padStart(2, '0')
    
    return `${minuteStr}:${secondStr}`
  }

  const [isRunning, setIsRunning] = useState(false)
  const [mode, setMode] = useState('focus')
  const [seconds, setSeconds] = useState(modes.focus)
  const [sessionCount, setSessionCount] = useState(0)

  useEffect(() => {
    let interval = null
    if (isRunning && seconds > 0) {
      interval = setInterval(() => {
        setSeconds(prevSeconds => {
          if (prevSeconds <= 1) {
            setIsRunning(false)
            handleSessionComplete()
            return 0
          }
          return prevSeconds - 1
        })
      }, 1000)
    }
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isRunning, seconds])

  const handleSessionComplete = () => {
    setIsRunning(false)
    
    if (mode === 'focus') {
      // Add practice time to skill
      const minutesAdded = modes.focus / 60
      onUpdateTime(skill.id, minutesAdded)
      
      const newCount = sessionCount + 1
      setSessionCount(newCount)
      
      // Suggest break
      if (newCount % 4 === 0) {
        alert('🎉 Great work! Time for a long break!')
        setMode('longBreak')
        setSeconds(modes.longBreak)
      } else {
        alert('✅ Focus session complete! Take a short break.')
        setMode('shortBreak')
        setSeconds(modes.shortBreak)
      }
    } else {
      alert('Break over! Ready for another focus session?')
      setMode('focus')
      setSeconds(modes.focus)
    }
  }

  const handleStart = () => {
    if (seconds === 0 || seconds === modes[mode]) {
      setSeconds(modes[mode])
    }
    setIsRunning(true)
  }

  const handlePause = () => {
    setIsRunning(false)
  }

  const handleReset = () => {
    setIsRunning(false)
    setSeconds(modes[mode])
  }

  const handleModeChange = (newMode) => {
    setIsRunning(false)
    setMode(newMode)
    setSeconds(modes[newMode])
    // Force re-render to ensure display updates
    console.log('Mode changed to:', newMode, 'Time:', modes[newMode], 'Formatted:', formatTime(modes[newMode]))
  }

  const totalMinutes = skill?.practiceTime || 0
  const hours = Math.floor(totalMinutes / 60)
  const minutes = Math.floor(totalMinutes % 60)

  return (
    <div className="practice-timer">
      <div className="timer-header">
        <h4>⏱️ Practice Timer</h4>
        <p className="total-time">
          Total: {hours}h {minutes}m
        </p>
      </div>

      <div className="timer-modes">
        <button
          className={`mode-button ${mode === 'focus' ? 'active' : ''}`}
          onClick={() => handleModeChange('focus')}
        >
          Focus
        </button>
        <button
          className={`mode-button ${mode === 'shortBreak' ? 'active' : ''}`}
          onClick={() => handleModeChange('shortBreak')}
        >
          Short Break
        </button>
        <button
          className={`mode-button ${mode === 'longBreak' ? 'active' : ''}`}
          onClick={() => handleModeChange('longBreak')}
        >
          Long Break
        </button>
      </div>

      <div className={`timer-display ${mode}`}>
        <div className="timer-circle">
          <svg className="timer-progress" viewBox="0 0 100 100">
            <circle
              className="timer-progress-bg"
              cx="50"
              cy="50"
              r="45"
            />
            <circle
              className="timer-progress-fill"
              cx="50"
              cy="50"
              r="45"
              style={{
                strokeDasharray: `${(seconds / modes[mode]) * 283} 283`,
                transform: 'rotate(-90deg)',
                transformOrigin: '50% 50%'
              }}
            />
          </svg>
          <div className="timer-text">
            <span className="timer-time">{formatTime(seconds)}</span>
            <span className="timer-label">{mode.replace(/([A-Z])/g, ' $1').trim()}</span>
          </div>
        </div>
      </div>

      <div className="timer-controls">
        {!isRunning ? (
          <button className="timer-button start" onClick={handleStart}>
            {seconds === 0 || seconds === modes[mode] ? 'Start' : 'Resume'}
          </button>
        ) : (
          <button className="timer-button pause" onClick={handlePause}>
            Pause
          </button>
        )}
        <button className="timer-button reset" onClick={handleReset}>
          Reset
        </button>
      </div>

      {sessionCount > 0 && (
        <div className="session-count">
          🍅 {sessionCount} Pomodoro{sessionCount !== 1 ? 's' : ''} today
        </div>
      )}
    </div>
  )
}

export default PracticeTimer
