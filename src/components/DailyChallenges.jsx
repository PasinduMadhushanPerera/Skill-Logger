import { useState, useEffect } from 'react'

function DailyChallenges({ onChallengeComplete }) {
  const [challenges, setChallenges] = useState([])
  const [userPoints, setUserPoints] = useState(0)

  const challengeTemplates = [
    { id: 1, text: 'Add a new skill', points: 10, type: 'add-skill' },
    { id: 2, text: 'Level up any skill', points: 15, type: 'level-up' },
    { id: 3, text: 'Add a journal entry', points: 10, type: 'journal' },
    { id: 4, text: 'Add a learning resource', points: 10, type: 'resource' },
    { id: 5, text: 'Study for 30 minutes', points: 20, type: 'study-time' },
    { id: 6, text: 'Add a certificate', points: 25, type: 'certificate' },
    { id: 7, text: 'Update skill confidence rating', points: 5, type: 'confidence' },
    { id: 8, text: 'Maintain your streak', points: 15, type: 'streak' }
  ]

  useEffect(() => {
    // Load challenges and points from localStorage
    const savedChallenges = localStorage.getItem('dailyChallenges')
    const savedPoints = localStorage.getItem('userPoints')
    const lastReset = localStorage.getItem('challengesLastReset')
    const today = new Date().toDateString()

    if (lastReset !== today) {
      // Generate new daily challenges
      const shuffled = [...challengeTemplates].sort(() => Math.random() - 0.5)
      const dailyChallenges = shuffled.slice(0, 3).map(c => ({ ...c, completed: false }))
      setChallenges(dailyChallenges)
      localStorage.setItem('dailyChallenges', JSON.stringify(dailyChallenges))
      localStorage.setItem('challengesLastReset', today)
    } else if (savedChallenges) {
      setChallenges(JSON.parse(savedChallenges))
    }

    if (savedPoints) {
      setUserPoints(parseInt(savedPoints))
    }
  }, [])

  const completeChallenge = (challengeId) => {
    const updated = challenges.map(c => {
      if (c.id === challengeId && !c.completed) {
        const newPoints = userPoints + c.points
        setUserPoints(newPoints)
        localStorage.setItem('userPoints', newPoints.toString())
        onChallengeComplete && onChallengeComplete(c.points)
        return { ...c, completed: true }
      }
      return c
    })
    setChallenges(updated)
    localStorage.setItem('dailyChallenges', JSON.stringify(updated))
  }

  const completedCount = challenges.filter(c => c.completed).length
  const totalCount = challenges.length

  return (
    <div className="daily-challenges">
      <div className="challenges-header">
        <div>
          <h3>⚡ Daily Challenges</h3>
          <p className="challenges-progress">
            {completedCount}/{totalCount} completed
          </p>
        </div>
        <div className="points-badge">
          <span className="points-value">{userPoints}</span>
          <span className="points-label">XP</span>
        </div>
      </div>

      <div className="challenges-list">
        {challenges.map(challenge => (
          <div
            key={challenge.id}
            className={`challenge-item ${challenge.completed ? 'completed' : ''}`}
          >
            <div className="challenge-content">
              <div className="challenge-checkbox">
                {challenge.completed ? '✅' : '⬜'}
              </div>
              <div className="challenge-text">
                <p className={challenge.completed ? 'strikethrough' : ''}>
                  {challenge.text}
                </p>
                <span className="challenge-points">+{challenge.points} XP</span>
              </div>
            </div>
            {!challenge.completed && (
              <button
                type="button"
                className="complete-button"
                onClick={() => completeChallenge(challenge.id)}
              >
                Complete
              </button>
            )}
          </div>
        ))}
      </div>

      {completedCount === totalCount && totalCount > 0 && (
        <div className="all-complete-banner">
          🎉 All challenges completed! Come back tomorrow for more!
        </div>
      )}
    </div>
  )
}

export default DailyChallenges
