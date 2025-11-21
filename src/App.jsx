import { useState, useEffect } from 'react'
import pkg from '../package.json'
import SimplePieChart from './components/SimplePieChart'
import SkillHeatmap from './components/SkillHeatmap'
import SkillTemplates from './components/SkillTemplates'
import SkillGapAnalyzer from './components/SkillGapAnalyzer'
import ResourcesManager from './components/ResourcesManager'
import SkillJournal from './components/SkillJournal'
import CertificateManager from './components/CertificateManager'
import DailyChallenges from './components/DailyChallenges'
import PracticeTimer from './components/PracticeTimer'
import ConfidenceRating from './components/ConfidenceRating'
import DecayWarning from './components/DecayWarning'


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

  // Custom categories state
  const [customCategories, setCustomCategories] = useState(() => {
    try {
      const saved = localStorage.getItem('customCategories')
      return saved ? JSON.parse(saved) : []
    } catch (error) {
      console.error('Failed to load custom categories from localStorage', error)
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


  // tabs: 'skills' | 'add' | 'stats' | 'settings' | 'tools'
  const [activeTab, setActiveTab] = useState('skills')

  // Expanded skill view
  const [expandedSkillId, setExpandedSkillId] = useState(null)

  // dark mode
  const [darkMode, setDarkMode] = useState(() => {
    try {
      const saved = localStorage.getItem('darkMode')
      return saved === 'true'
    } catch {
      return false
    }
  })

  // learning streak
  const [streak, setStreak] = useState(() => {
    try {
      const saved = localStorage.getItem('learningStreak')
      return saved ? JSON.parse(saved) : { count: 0, lastUpdate: null }
    } catch {
      return { count: 0, lastUpdate: null }
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

  useEffect(() => {
    try {
      localStorage.setItem('learningStreak', JSON.stringify(streak))
    } catch { }
  }, [streak])

  // Update streak when skills change
  useEffect(() => {
    const today = new Date().toDateString()
    const lastUpdate = streak.lastUpdate
    
    if (lastUpdate !== today && skills.length > 0) {
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      const wasYesterday = lastUpdate === yesterday.toDateString()
      
      setStreak({
        count: wasYesterday ? streak.count + 1 : 1,
        lastUpdate: today
      })
    }
  }, [skills.length])

  useEffect(() => {
    try {
      localStorage.setItem('customCategories', JSON.stringify(customCategories))
    } catch (error) {
      console.error('Failed to save custom categories to localStorage', error)
    }
  }, [customCategories])

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
      lastUsed: now,
      resources: [],
      journal: [],
      confidence: 3,
      practiceTime: 0,
      certificates: [],
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

  // New component handlers
  function handleUpdateResources(skillId, updatedResources) {
    setSkills(prev => prev.map(skill =>
      skill.id === skillId ? { ...skill, resources: updatedResources, lastPracticed: new Date().toISOString() } : skill
    ))
  }

  function handleUpdateJournal(skillId, updatedJournal) {
    setSkills(prev => prev.map(skill =>
      skill.id === skillId ? { ...skill, journal: updatedJournal, lastPracticed: new Date().toISOString() } : skill
    ))
  }

  function handleUpdateCertificates(skillId, updatedCertificates) {
    setSkills(prev => prev.map(skill =>
      skill.id === skillId ? { ...skill, certificates: updatedCertificates, lastPracticed: new Date().toISOString() } : skill
    ))
  }

  function handleUpdateConfidence(skillId, newConfidence) {
    setSkills(prev => prev.map(skill =>
      skill.id === skillId ? { ...skill, confidence: newConfidence, lastPracticed: new Date().toISOString() } : skill
    ))
  }

  function handleUpdatePracticeTime(skillId, minutesAdded) {
    setSkills(prev => prev.map(skill =>
      skill.id === skillId ? { 
        ...skill, 
        practiceTime: (skill.practiceTime || 0) + minutesAdded,
        lastPracticed: new Date().toISOString()
      } : skill
    ))
  }

  function handleImportSkills(importedSkills) {
    const now = new Date().toISOString()
    const newSkills = importedSkills.map(s => ({
      id: Date.now() + Math.random(),
      name: s.name,
      level: s.level || 'Beginner',
      category: s.category || '',
      notes: s.notes || '',
      createdAt: now,
      updatedAt: now,
      lastUsed: now,
      resources: [],
      journal: [],
      confidence: 3,
      practiceTime: 0,
      certificates: [],
      lastPracticed: now
    }))
    setSkills(prev => [...newSkills, ...prev])
  }

  function handleAddMissingSkills(missingSkills) {
    const now = new Date().toISOString()
    const newSkills = missingSkills.map(s => ({
      id: Date.now() + Math.random(),
      name: s.name,
      level: 'Beginner',
      category: s.category || '',
      notes: s.notes || '',
      createdAt: now,
      updatedAt: now,
      lastUsed: now,
      resources: [],
      journal: [],
      confidence: 3,
      practiceTime: 0,
      certificates: [],
      lastPracticed: now
    }))
    setSkills(prev => [...newSkills, ...prev])
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

  // Default categories
  const defaultCategories = [
    'Frontend',
    'Backend',
    'Mobile',
    'Database',
    'DevOps',
    'Cloud',
    'Testing',
    'Soft Skills'
  ]

  // Combined categories (default + custom)
  const allCategories = [...defaultCategories, ...customCategories]

  function handleCategoryChange(value, isEdit = false) {
    if (value === '__ADD_NEW__') {
      const newCategory = prompt('Enter new category name:')
      if (newCategory && newCategory.trim()) {
        const trimmed = newCategory.trim()
        if (!allCategories.includes(trimmed)) {
          setCustomCategories(prev => [...prev, trimmed])
          if (isEdit) {
            setEditCategory(trimmed)
          } else {
            setCategory(trimmed)
          }
        } else {
          if (isEdit) {
            setEditCategory(trimmed)
          } else {
            setCategory(trimmed)
          }
        }
      }
    } else {
      if (isEdit) {
        setEditCategory(value)
      } else {
        setCategory(value)
      }
    }
  }

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
                  onChange={(e) => handleCategoryChange(e.target.value, false)}
                >
                  <option value="">Select category</option>
                  {allCategories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                  <option value="__ADD_NEW__">+ Add New Category...</option>
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
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h2 style={{ margin: 0 }}>Filter & Search</h2>
                {streak.count > 0 && (
                  <div className="streak-badge" style={{ margin: 0 }}>
                    <span className="streak-fire">🔥</span>
                    <span className="streak-count">{streak.count}</span>
                  </div>
                )}
              </div>
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
                                onChange={(e) => handleCategoryChange(e.target.value, true)}
                              >
                                <option value="">Select category</option>
                                {allCategories.map((cat) => (
                                  <option key={cat} value={cat}>{cat}</option>
                                ))}
                                <option value="__ADD_NEW__">+ Add New Category...</option>
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

                            <DecayWarning skill={skill} />

                            <div style={{ margin: '10px 0' }}>
                              <ConfidenceRating 
                                value={skill.confidence || 3} 
                                onChange={(newConfidence) => handleUpdateConfidence(skill.id, newConfidence)}
                              />
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
                                className="secondary-button"
                                onClick={() => setExpandedSkillId(expandedSkillId === skill.id ? null : skill.id)}
                              >
                                {expandedSkillId === skill.id ? 'Hide Details' : 'Show Details'}
                              </button>
                              <button
                                type="button"
                                className="danger-button"
                                onClick={() => handleDeleteSkill(skill.id)}
                              >
                                Delete
                              </button>
                            </div>

                            {expandedSkillId === skill.id && (
                              <div className="skill-expanded">
                                <ResourcesManager
                                  skill={skill}
                                  onUpdateResources={handleUpdateResources}
                                />
                                
                                <SkillJournal
                                  skill={skill}
                                  onUpdateJournal={handleUpdateJournal}
                                />
                                
                                <CertificateManager
                                  skill={skill}
                                  onUpdateCertificates={handleUpdateCertificates}
                                />
                                
                                <PracticeTimer
                                  skill={skill}
                                  onUpdateTime={handleUpdatePracticeTime}
                                />
                              </div>
                            )}
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
          <>
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

              {/* Timeline View */}
              {skills.length > 0 && (
                <div className="timeline-section">
                  <h3 className="chart-title">Recent Activity</h3>
                  <div className="timeline-list">
                    {[...skills].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 5).map((skill) => {
                      const daysAgo = Math.floor((Date.now() - new Date(skill.createdAt).getTime()) / (1000 * 60 * 60 * 24))
                      return (
                        <div key={skill.id} className="timeline-item">
                          <div className="timeline-dot"></div>
                          <div className="timeline-content">
                            <strong>{skill.name}</strong>
                            <span className={`level-tag level-${skill.level.toLowerCase()}`}>{skill.level}</span>
                            <span className="timeline-date">
                              {daysAgo === 0 ? 'Today' : daysAgo === 1 ? 'Yesterday' : `${daysAgo} days ago`}
                            </span>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Level chart */}
              {totalSkills > 0 ? (
                <div className="chart-wrapper">
                  <h3 className="chart-title">Skill levels</h3>
                  <div className="chart-inner">
                    <SimplePieChart 
                      data={levelChartData}
                      colors={LEVEL_COLORS}
                    />
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

            {/* Activity Heatmap */}
            {skills.length > 0 && (
              <section className="card">
                <SkillHeatmap skills={skills} />
              </section>
            )}
          </>
        )}



        {activeTab === 'settings' && (
          <>
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

              <div className="settings-section">
                <h3>Export & Resume</h3>
                <div className="button-group">
                  <button
                    type="button"
                    className="primary-button"
                    onClick={() => {
                      // Group skills by category
                      const grouped = skills.reduce((acc, skill) => {
                        const cat = skill.category || 'Other'
                        if (!acc[cat]) acc[cat] = []
                        acc[cat].push(skill)
                        return acc
                      }, {})

                      // Create HTML for PDF
                      let html = `
                        <html>
                        <head>
                          <style>
                            body { font-family: Arial, sans-serif; padding: 40px; max-width: 800px; margin: 0 auto; }
                            h1 { color: #2563eb; border-bottom: 3px solid #2563eb; padding-bottom: 10px; }
                            h2 { color: #1e40af; margin-top: 30px; margin-bottom: 15px; }
                            .skill { margin: 8px 0; padding: 8px 12px; background: #f3f4f6; border-radius: 6px; display: inline-block; margin-right: 10px; }
                            .level { font-weight: bold; color: #059669; }
                            .beginner { color: #d97706; }
                            .intermediate { color: #2563eb; }
                            .advanced { color: #059669; }
                            .stats { background: #eff6ff; padding: 20px; border-radius: 8px; margin: 20px 0; }
                            .stat-item { display: inline-block; margin-right: 30px; }
                          </style>
                        </head>
                        <body>
                          <h1>Skills Resume</h1>
                          <div class="stats">
                            <div class="stat-item"><strong>Total Skills:</strong> ${totalSkills}</div>
                            <div class="stat-item"><strong>Beginner:</strong> ${beginnerCount}</div>
                            <div class="stat-item"><strong>Intermediate:</strong> ${intermediateCount}</div>
                            <div class="stat-item"><strong>Advanced:</strong> ${advancedCount}</div>
                          </div>
                      `

                      Object.entries(grouped).forEach(([category, categorySkills]) => {
                        html += `<h2>${category}</h2>`
                        categorySkills.forEach(skill => {
                          html += `<div class="skill"><span>${skill.name}</span> - <span class="level ${skill.level.toLowerCase()}">${skill.level}</span></div>`
                        })
                      })

                      html += `
                          <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 14px;">
                            Generated by Skill Logger • ${new Date().toLocaleDateString()}
                          </div>
                        </body>
                        </html>
                      `

                      // Open print dialog
                      const printWindow = window.open('', '_blank')
                      printWindow.document.write(html)
                      printWindow.document.close()
                      printWindow.focus()
                      setTimeout(() => printWindow.print(), 250)
                    }}
                  >
                    📄 Export as PDF Resume
                  </button>
                </div>
                <p className="settings-note">
                  Generate a printable resume with all your skills organized by category.
                </p>
              </div>

              <div className="settings-section">
                <h3>Achievements</h3>
                <div className="achievements-grid">
                  {totalSkills >= 10 && (
                    <div className="badge-item">
                      <span className="badge-icon">🎯</span>
                      <span className="badge-name">Committed Learner</span>
                      <span className="badge-desc">10+ skills tracked</span>
                    </div>
                  )}
                  {advancedCount >= 5 && (
                    <div className="badge-item">
                      <span className="badge-icon">⭐</span>
                      <span className="badge-name">Expert Level</span>
                      <span className="badge-desc">5+ advanced skills</span>
                    </div>
                  )}
                  {Object.keys(categoryCounts).length >= 5 && (
                    <div className="badge-item">
                      <span className="badge-icon">🌈</span>
                      <span className="badge-name">Polyglot</span>
                      <span className="badge-desc">5+ categories</span>
                    </div>
                  )}
                  {categoryCounts['Frontend'] >= 3 && categoryCounts['Backend'] >= 3 && (
                    <div className="badge-item">
                      <span className="badge-icon">🚀</span>
                      <span className="badge-name">Full Stack</span>
                      <span className="badge-desc">Frontend + Backend skills</span>
                    </div>
                  )}
                  {streak.count >= 7 && (
                    <div className="badge-item">
                      <span className="badge-icon">🔥</span>
                      <span className="badge-name">On Fire</span>
                      <span className="badge-desc">7+ day streak</span>
                    </div>
                  )}
                  {streak.count >= 30 && (
                    <div className="badge-item">
                      <span className="badge-icon">💎</span>
                      <span className="badge-name">Diamond</span>
                      <span className="badge-desc">30+ day streak</span>
                    </div>
                  )}
                  {totalSkills === 0 && (
                    <p className="settings-note">Complete achievements by adding skills and building streaks!</p>
                  )}
                </div>
              </div>
            </section>

            {/* Skill Templates */}
            <section className="card">
              <SkillTemplates onImport={handleImportSkills} />
            </section>
          </>
        )}

        {activeTab === 'tools' && (
          <>
            <section className="card">
              <DailyChallenges onChallengeComplete={(points) => {
                console.log(`Earned ${points} XP!`)
              }} />
            </section>

            <section className="card">
              <SkillGapAnalyzer
                skills={skills}
                onAddMissingSkills={handleAddMissingSkills}
              />
            </section>
          </>
        )}
      </main>

      {/* developer info will be shown in footer for consistent bottom placement */}

      <footer className="bottom-nav">
        <button
          type="button"
          className={`nav-button ${activeTab === 'skills' ? 'active' : ''}`}
          onClick={() => setActiveTab('skills')}
        >
          <span className="nav-icon">📋</span>
          <span className="nav-label">Skills</span>
        </button>
        <button
          type="button"
          className={`nav-button ${activeTab === 'add' ? 'active' : ''}`}
          onClick={() => setActiveTab('add')}
        >
          <span className="nav-icon">➕</span>
          <span className="nav-label">Add</span>
        </button>
        <button
          type="button"
          className={`nav-button ${activeTab === 'stats' ? 'active' : ''}`}
          onClick={() => setActiveTab('stats')}
        >
          <span className="nav-icon">📊</span>
          <span className="nav-label">Stats</span>
        </button>
        <button
          type="button"
          className={`nav-button ${activeTab === 'tools' ? 'active' : ''}`}
          onClick={() => setActiveTab('tools')}
        >
          <span className="nav-icon">🛠️</span>
          <span className="nav-label">Tools</span>
        </button>
        <button
          type="button"
          className={`nav-button ${activeTab === 'settings' ? 'active' : ''}`}
          onClick={() => setActiveTab('settings')}
        >
          <span className="nav-icon">⚙️</span>
          <span className="nav-label">Settings</span>
        </button>
        <span className="nav-footnote">Developed by W.P.M.Perera • v0.1.0-beta — BETA</span>
      </footer>
    </div>
  )
}

export default App
