import { useState } from 'react'

function SkillJournal({ skill, onUpdateJournal }) {
  const [showAdd, setShowAdd] = useState(false)
  const [entry, setEntry] = useState('')

  const handleAddEntry = () => {
    if (!entry.trim()) {
      alert('Write something in your journal entry')
      return
    }

    const newEntry = {
      id: Date.now(),
      date: new Date().toISOString(),
      text: entry.trim()
    }

    const updated = [...(skill.journal || []), newEntry]
    onUpdateJournal(skill.id, updated)
    setEntry('')
    setShowAdd(false)
  }

  const handleDelete = (entryId) => {
    if (window.confirm('Delete this journal entry?')) {
      const updated = skill.journal.filter(e => e.id !== entryId)
      onUpdateJournal(skill.id, updated)
    }
  }

  const formatDate = (isoDate) => {
    const date = new Date(isoDate)
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="skill-journal">
      <div className="journal-header">
        <h4>📝 Learning Journal</h4>
        <button
          type="button"
          className="icon-button"
          onClick={() => setShowAdd(!showAdd)}
        >
          {showAdd ? '✕' : '+'}
        </button>
      </div>

      {showAdd && (
        <div className="journal-form">
          <textarea
            placeholder="What did you learn today? Any challenges? Insights?"
            value={entry}
            onChange={(e) => setEntry(e.target.value)}
            rows={4}
          />
          <button type="button" className="primary-button" onClick={handleAddEntry}>
            Save Entry
          </button>
        </div>
      )}

      <div className="journal-entries">
        {(skill.journal || []).length === 0 ? (
          <p className="no-data">No journal entries yet. Start documenting your progress!</p>
        ) : (
          [...skill.journal].reverse().map(entry => (
            <div key={entry.id} className="journal-entry">
              <div className="entry-header">
                <span className="entry-date">{formatDate(entry.date)}</span>
                <button
                  type="button"
                  className="delete-icon-button"
                  onClick={() => handleDelete(entry.id)}
                >
                  🗑️
                </button>
              </div>
              <p className="entry-text">{entry.text}</p>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default SkillJournal
