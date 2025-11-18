import { useState, useEffect } from 'react'
import pkg from '../package.json'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts'


function App() {
  const [skillName, setSkillName] = useState('')
  const [level, setLevel] = useState('Beginner')
  const [category, setCategory] = useState('')
  const [notes, setNotes] = useState('')

  const [skills, setSkills] = useState(() => {
    try {
      const saved = localStorage.getItem('skills')
      return saved ? JSON.parse(saved) : []
    } catch (error) {
      console.error('Failed to load skills from localStorage', error)
      return []
    }
  })

  const [filterLevel, setFilterLevel] = useState('')
  const [searchText, setSearchText] = useState('')

  // edit states
  const [editingId, setEditingId] = useState(null)
  const [editName, setEditName] = useState('')
  const [editLevel, setEditLevel] = useState('Beginner')
  const [editCategory, setEditCategory] = useState('')
  const [editNotes, setEditNotes] = useState('')
  const [sortBy, setSortBy] = useState('newest') // newest | oldest | name-asc | name-desc | level


  // tabs: 'skills' | 'add' | 'stats' | 'settings'
  const [activeTab, setActiveTab] = useState('skills')

  // dark mode
  const [darkMode, setDarkMode] = useState(() => {
    try {
      const saved = localStorage.getItem('darkMode')
      return saved === 'true'
    } catch {
      return false
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem('skills', JSON.stringify(skills))
    } catch (error) {
      console.error('Failed to save skills to localStorage', error)
    }
  }, [skills])

  useEffect(() => {
    try {
      localStorage.setItem('darkMode', darkMode)
    } catch { }
    document.body.classList.toggle('dark-mode', darkMode)
  }, [darkMode])

  function handleAddSkill() {
    const trimmedName = skillName.trim()

    if (!trimmedName) {
      alert('Please enter a skill name')
      return
    }

    const now = new Date().toISOString()

    const newSkill = {
      id: Date.now(),
      name: trimmedName,
      level,
      category,
      notes: notes.trim(),
      createdAt: now,
      updatedAt: now,
    }

    setSkills((prev) => [newSkill, ...prev])

    setSkillName('')
    setLevel('Beginner')
    setCategory('')
    setNotes('')
    setActiveTab('skills')
  }

  function handleDeleteSkill(id) {
    const ok = confirm('Delete this skill?')
    if (!ok) return

    setSkills((prev) => prev.filter((skill) => skill.id !== id))

    if (editingId === id) {
      setEditingId(null)
    }
  }

  function getNextLevel(current) {
    if (current === 'Beginner') return 'Intermediate'
    if (current === 'Intermediate') return 'Advanced'
    return 'Advanced'
  }

  function handlePromoteLevel(id) {
    setSkills((prev) =>
      prev.map((skill) =>
        skill.id === id
          ? {
            ...skill,
            level: getNextLevel(skill.level),
            updatedAt: new Date().toISOString(),
          }
          : skill
      )
    )
  }

  // start editing
  function handleStartEdit(skill) {
    setEditingId(skill.id)
    setEditName(skill.name)
    setEditLevel(skill.level)
    setEditCategory(skill.category || '')
    setEditNotes(skill.notes || '')
  }

  function handleCancelEdit() {
    setEditingId(null)
    setEditName('')
    setEditLevel('Beginner')
    setEditCategory('')
    setEditNotes('')
  }

  function handleSaveEdit(id) {
    const trimmedName = editName.trim()
    if (!trimmedName) {
      alert('Skill name cannot be empty')
      return
    }

    const now = new Date().toISOString()

    setSkills((prev) =>
      prev.map((skill) =>
        skill.id === id
          ? {
            ...skill,
            name: trimmedName,
            level: editLevel,
            category: editCategory,
            notes: editNotes.trim(),
            updatedAt: now,
          }
          : skill
      )
    )

    handleCancelEdit()
  }

  const totalSkills = skills.length
  const beginnerCount = skills.filter((s) => s.level === 'Beginner').length
  const intermediateCount = skills.filter((s) => s.level === 'Intermediate').length
  const advancedCount = skills.filter((s) => s.level === 'Advanced').length
  // category counts
  const categoryCounts = skills.reduce((acc, skill) => {
    if (!skill.category) return acc
    acc[skill.category] = (acc[skill.category] || 0) + 1
    return acc
  }, {})

  // data for level pie chart
  const levelChartData = [
    { name: 'Beginner', value: beginnerCount },
    { name: 'Intermediate', value: intermediateCount },
    { name: 'Advanced', value: advancedCount },
  ].filter((item) => item.value > 0)

  const LEVEL_COLORS = ['#facc15', '#60a5fa', '#4ade80']

  const appVersion = pkg?.version || '0.1.0-beta'

  const filteredSkills = skills.filter((skill) => {
    const levelMatch = filterLevel ? skill.level === filterLevel : true
    const searchMatch = skill.name.toLowerCase().includes(searchText.toLowerCase())
    return levelMatch && searchMatch
  })
  const levelOrder = {
    Beginner: 1,
    Intermediate: 2,
    Advanced: 3,
  }

  const sortedSkills = [...filteredSkills].sort((a, b) => {
    if (sortBy === 'newest') {
      return b.createdAt.localeCompare(a.createdAt)
    }
    if (sortBy === 'oldest') {
      return a.createdAt.localeCompare(b.createdAt)
    }
    if (sortBy === 'name-asc') {
      return a.name.localeCompare(b.name)
    }
    if (sortBy === 'name-desc') {
      return b.name.localeCompare(a.name)
    }
    if (sortBy === 'level') {
      return levelOrder[a.level] - levelOrder[b.level]
    }
    return 0
  })


  return (
    <div className="app-container">
      <header className="app-header">
        <h1>My SE Skill Logger</h1>
        <p>Track your software engineering skills and progress.</p>
      </header>

      <main className="app-main">
        {activeTab === 'add' && (
          <section className="card">
            <h2>Add New Skill</h2>
            <form
              className="form"
              onSubmit={(e) => {
                e.preventDefault()
                handleAddSkill()
              }}
            >
              <div className="form-row">
                <label>Skill name</label>
                <input
                  type="text"
                  placeholder="React, Git, OOP..."
                  value={skillName}
                  onChange={(e) => setSkillName(e.target.value)}
                />
              </div>

              <div className="form-row">
                <label>Level</label>
                <select value={level} onChange={(e) => setLevel(e.target.value)}>
                  <option>Beginner</option>
                  <option>Intermediate</option>
                  <option>Advanced</option>
                </select>
              </div>

              <div className="form-row">
                <label>Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="">Select category</option>
                  <option>Frontend</option>
                  <option>Backend</option>
                  <option>Mobile</option>
                  <option>Database</option>
                  <option>DevOps</option>
                  <option>Cloud</option>
                  <option>Testing</option>
                  <option>Soft Skills</option>
                </select>
              </div>

              <div className="form-row">
                <label>Notes</label>
                <textarea
                  placeholder="What did you learn? Plans? Links?"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                ></textarea>
              </div>

              <button type="submit" className="primary-button">
                Add Skill
              </button>
            </form>
          </section>
        )}

        {activeTab === 'skills' && (
          <>
            <section className="card">
              <h2>Filter & Search</h2>
              <div className="filter-row">
                <select
                  value={filterLevel}
                  onChange={(e) => setFilterLevel(e.target.value)}
                >
                  <option value="">All levels</option>
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>

                <input
                  type="text"
                  placeholder="Search by skill name"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                />

                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="newest">Newest</option>
                  <option value="oldest">Oldest</option>
                  <option value="name-asc">Name A–Z</option>
                  <option value="name-desc">Name Z–A</option>
                  <option value="level">By level</option>
                </select>
              </div>

            </section>

            <section className="card">
              <h2>Your Skills</h2>

              {sortedSkills.length === 0 ? (
                <p>No skills yet. Add your first skill in the Add tab.</p>
              ) : (
                <div className="skill-list">
                  {sortedSkills.map((skill) => {
                    const isEditing = editingId === skill.id

                    return (
                      <article key={skill.id} className="skill-card">
                        {isEditing ? (
                          <>
                            <div className="form-row">
                              <label>Skill name</label>
                              <input
                                type="text"
                                value={editName}
                                onChange={(e) => setEditName(e.target.value)}
                              />
                            </div>

                            <div className="form-row">
                              <label>Level</label>
                              <select
                                value={editLevel}
                                onChange={(e) => setEditLevel(e.target.value)}
                              >
                                <option>Beginner</option>
                                <option>Intermediate</option>
                                <option>Advanced</option>
                              </select>
                            </div>

                            <div className="form-row">
                              <label>Category</label>
                              <select
                                value={editCategory}
                                onChange={(e) => setEditCategory(e.target.value)}
                              >
                                <option value="">Select category</option>
                                <option>Frontend</option>
                                <option>Backend</option>
                                <option>Mobile</option>
                                <option>Database</option>
                                <option>DevOps</option>
                                <option>Cloud</option>
                                <option>Testing</option>
                                <option>Soft Skills</option>
                              </select>
                            </div>

                            <div className="form-row">
                              <label>Notes</label>
                              <textarea
                                value={editNotes}
                                onChange={(e) => setEditNotes(e.target.value)}
                              ></textarea>
                            </div>

                            <div className="skill-edit-actions">
                              <button
                                type="button"
                                className="secondary-button"
                                onClick={() => handleSaveEdit(skill.id)}
                              >
                                Save
                              </button>
                              <button
                                type="button"
                                className="ghost-button"
                                onClick={handleCancelEdit}
                              >
                                Cancel
                              </button>
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="skill-card-header">
                              <div>
                                <h3>{skill.name}</h3>
                                {skill.category && (
                                  <span className={`category-badge category-${skill.category.toLowerCase().replace(/\s+/g, '-')}`}>
                                    {skill.category}
                                  </span>

                                )}
                              </div>
                              <span
                                className={`level-tag level-${skill.level.toLowerCase()}`}
                              >
                                {skill.level}
                              </span>
                            </div>

                            {skill.notes && (
                              <p className="skill-notes">{skill.notes}</p>
                            )}

                            <div className="skill-card-footer">
                              <button
                                type="button"
                                className="secondary-button"
                                onClick={() => handleStartEdit(skill)}
                              >
                                Edit
                              </button>
                              <button
                                type="button"
                                className="secondary-button"
                                onClick={() => handlePromoteLevel(skill.id)}
                              >
                                Promote
                              </button>
                              <button
                                type="button"
                                className="danger-button"
                                onClick={() => handleDeleteSkill(skill.id)}
                              >
                                Delete
                              </button>
                            </div>
                          </>
                        )}
                      </article>
                    )
                  })}
                </div>
              )}
            </section>
          </>
        )}

        {activeTab === 'stats' && (
          <section className="card">
            <h2>Stats</h2>

            {/* Stat cards */}
            <div className="stat-grid">
              <div className="stat-card">
                <span className="stat-label">Total skills</span>
                <span className="stat-value">{totalSkills}</span>
              </div>
              <div className="stat-card">
                <span className="stat-label">Beginner</span>
                <span className="stat-value">{beginnerCount}</span>
              </div>
              <div className="stat-card">
                <span className="stat-label">Intermediate</span>
                <span className="stat-value">{intermediateCount}</span>
              </div>
              <div className="stat-card">
                <span className="stat-label">Advanced</span>
                <span className="stat-value">{advancedCount}</span>
              </div>
            </div>

            {/* Level chart */}
            {totalSkills > 0 ? (
              <div className="chart-wrapper">
                <h3 className="chart-title">Skill levels</h3>
                <div className="chart-inner">
                  <ResponsiveContainer width="100%" height={220}>
                    <PieChart>
                      <Pie
                        data={levelChartData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={70}
                        label
                      >
                        {levelChartData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={LEVEL_COLORS[index % LEVEL_COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            ) : (
              <p className="settings-note">Add some skills to see charts here.</p>
            )}

            {/* Category summary */}
            {Object.keys(categoryCounts).length > 0 && (
              <div className="category-summary">
                <h3 className="chart-title">By category</h3>
                <ul>
                  {Object.entries(categoryCounts).map(([cat, count]) => (
                    <li key={cat}>
                      <span>{cat}</span>
                      <span className="category-count">{count}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </section>
        )}



        {activeTab === 'settings' && (
          <section className="card">
            <h2>Settings</h2>
            <div className="switch-row">
              <span>Dark mode</span>
              <button
                type="button"
                className="secondary-button"
                onClick={() => setDarkMode((prev) => !prev)}
              >
                {darkMode ? 'Turn off' : 'Turn on'}
              </button>
            </div>
            <p className="settings-note">
              Dark mode preference is saved on this device.
            </p>
          </section>
        )}
      </main>

      <div className="app-meta">
        <div className="developer-info">
          Developed by W.P.M.Perera • <span className="meta-version">v{appVersion} — BETA</span>
        </div>
      </div>

      <footer className="bottom-nav">
        <button
          type="button"
          className={`nav-button ${activeTab === 'skills' ? 'active' : ''}`}
          onClick={() => setActiveTab('skills')}
        >
          Skills
        </button>
        <button
          type="button"
          className={`nav-button ${activeTab === 'add' ? 'active' : ''}`}
          onClick={() => setActiveTab('add')}
        >
          Add
        </button>
        <button
          type="button"
          className={`nav-button ${activeTab === 'stats' ? 'active' : ''}`}
          onClick={() => setActiveTab('stats')}
        >
          Stats
        </button>
        <button
          type="button"
          className={`nav-button ${activeTab === 'settings' ? 'active' : ''}`}
          onClick={() => setActiveTab('settings')}
        >
          Settings
        </button>
      </footer>
    </div>
  )
}

export default App
