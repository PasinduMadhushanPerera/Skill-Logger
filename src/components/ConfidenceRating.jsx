function ConfidenceRating({ value, onChange, readonly = false }) {
  const stars = [1, 2, 3, 4, 5]

  const getLabel = (rating) => {
    const labels = {
      1: 'Novice',
      2: 'Beginner',
      3: 'Intermediate',
      4: 'Advanced',
      5: 'Expert'
    }
    return labels[rating] || 'Not rated'
  }

  return (
    <div className="confidence-rating">
      <label className="confidence-label">Confidence Level</label>
      <div className="stars-container">
        {stars.map(star => (
          <button
            key={star}
            type="button"
            className={`star ${star <= value ? 'filled' : ''} ${readonly ? 'readonly' : ''}`}
            onClick={() => !readonly && onChange && onChange(star)}
            disabled={readonly}
          >
            ⭐
          </button>
        ))}
      </div>
      <span className="confidence-text">{getLabel(value)}</span>
    </div>
  )
}

export default ConfidenceRating
