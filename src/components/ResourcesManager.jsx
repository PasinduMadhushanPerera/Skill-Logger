import { useState } from 'react'

function ResourcesManager({ skill, onUpdateResources }) {
  const [showAdd, setShowAdd] = useState(false)
  const [newResource, setNewResource] = useState({ title: '', url: '', type: 'article' })

  const handleAdd = () => {
    if (!newResource.title.trim() || !newResource.url.trim()) {
      alert('Please fill title and URL')
      return
    }

    const updated = [...(skill.resources || []), { ...newResource, id: Date.now() }]
    onUpdateResources(skill.id, updated)
    setNewResource({ title: '', url: '', type: 'article' })
    setShowAdd(false)
  }

  const handleDelete = (resourceId) => {
    if (window.confirm('Delete this resource?')) {
      const updated = skill.resources.filter(r => r.id !== resourceId)
      onUpdateResources(skill.id, updated)
    }
  }

  const getResourceIcon = (type) => {
    const icons = {
      article: '📄',
      video: '🎥',
      course: '🎓',
      book: '📚',
      documentation: '📖',
      project: '🔨'
    }
    return icons[type] || '🔗'
  }

  return (
    <div className="resources-manager">
      <div className="resources-header">
        <h4>📚 Learning Resources</h4>
        <button
          type="button"
          className="icon-button"
          onClick={() => setShowAdd(!showAdd)}
        >
          {showAdd ? '✕' : '+'}
        </button>
      </div>

      {showAdd && (
        <div className="resource-form">
          <input
            type="text"
            placeholder="Resource title"
            value={newResource.title}
            onChange={(e) => setNewResource({ ...newResource, title: e.target.value })}
          />
          <input
            type="url"
            placeholder="https://..."
            value={newResource.url}
            onChange={(e) => setNewResource({ ...newResource, url: e.target.value })}
          />
          <select
            value={newResource.type}
            onChange={(e) => setNewResource({ ...newResource, type: e.target.value })}
          >
            <option value="article">Article</option>
            <option value="video">Video</option>
            <option value="course">Course</option>
            <option value="book">Book</option>
            <option value="documentation">Documentation</option>
            <option value="project">Project</option>
          </select>
          <button type="button" className="primary-button" onClick={handleAdd}>
            Add Resource
          </button>
        </div>
      )}

      <div className="resources-list">
        {(skill.resources || []).length === 0 ? (
          <p className="no-data">No resources yet. Add learning materials!</p>
        ) : (
          (skill.resources || []).slice().reverse().map(resource => (
            <div key={resource.id} className="resource-item">
              <span className="resource-icon">{getResourceIcon(resource.type)}</span>
              <div className="resource-content">
                <a
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="resource-title"
                >
                  {resource.title}
                </a>
                <span className="resource-type">{resource.type}</span>
              </div>
              <button
                type="button"
                className="delete-icon-button"
                onClick={() => handleDelete(resource.id)}
              >
                🗑️
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default ResourcesManager
