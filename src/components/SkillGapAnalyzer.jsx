import { useState } from 'react'

function SkillGapAnalyzer({ skills, onAddMissingSkills }) {
  const [jobDescription, setJobDescription] = useState('')
  const [analysis, setAnalysis] = useState(null)

  const commonSkills = [
    'JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'C#', 'Go', 'Rust', 'PHP', 'Ruby',
    'React', 'Vue', 'Angular', 'Next.js', 'Svelte',
    'Node.js', 'Express', 'Django', 'Flask', 'Spring Boot',
    'MongoDB', 'PostgreSQL', 'MySQL', 'Redis', 'DynamoDB',
    'AWS', 'Azure', 'GCP', 'Firebase', 'Heroku',
    'Docker', 'Kubernetes', 'CI/CD', 'Jenkins', 'GitHub Actions',
    'Git', 'Agile', 'Scrum', 'REST API', 'GraphQL', 'Microservices',
    'HTML', 'CSS', 'Sass', 'Tailwind', 'Bootstrap',
    'SQL', 'NoSQL', 'Linux', 'Bash', 'PowerShell',
    'Jest', 'Mocha', 'Pytest', 'JUnit', 'Testing',
    'Webpack', 'Vite', 'Babel', 'npm', 'yarn'
  ]

  const analyzeJobDescription = () => {
    if (!jobDescription.trim()) {
      alert('Please paste a job description')
      return
    }

    const text = jobDescription.toLowerCase()
    const userSkills = skills.map(s => s.name.toLowerCase())
    
    const foundSkills = []
    const missingSkills = []

    commonSkills.forEach(skill => {
      const skillLower = skill.toLowerCase()
      if (text.includes(skillLower)) {
        if (userSkills.includes(skillLower)) {
          foundSkills.push(skill)
        } else {
          missingSkills.push(skill)
        }
      }
    })

    setAnalysis({
      found: foundSkills,
      missing: missingSkills,
      matchPercent: foundSkills.length > 0 
        ? Math.round((foundSkills.length / (foundSkills.length + missingSkills.length)) * 100)
        : 0
    })
  }

  const handleAddMissing = () => {
    if (analysis && analysis.missing.length > 0) {
      if (window.confirm(`Add ${analysis.missing.length} missing skills to your profile?`)) {
        const newSkills = analysis.missing.map(name => ({
          name,
          level: 'Beginner',
          category: '',
          notes: 'Added from job gap analysis'
        }))
        onAddMissingSkills(newSkills)
        alert(`Added ${newSkills.length} skills!`)
      }
    }
  }

  return (
    <div className="gap-analyzer">
      <h3>Skill Gap Analyzer</h3>
      <p className="settings-note">Paste a job description to see what skills you're missing</p>
      
      <textarea
        className="gap-textarea"
        placeholder="Paste job description here..."
        value={jobDescription}
        onChange={(e) => setJobDescription(e.target.value)}
        rows={8}
      />
      
      <button
        type="button"
        className="primary-button"
        onClick={analyzeJobDescription}
      >
        Analyze Gap
      </button>

      {analysis && (
        <div className="gap-results">
          <div className="gap-match">
            <h4>Match Score</h4>
            <div className="match-circle">
              <span className="match-percent">{analysis.matchPercent}%</span>
            </div>
          </div>

          {analysis.found.length > 0 && (
            <div className="gap-section">
              <h4>✅ Skills You Have ({analysis.found.length})</h4>
              <div className="skill-chips">
                {analysis.found.map((skill, idx) => (
                  <span key={idx} className="chip chip-success">{skill}</span>
                ))}
              </div>
            </div>
          )}

          {analysis.missing.length > 0 && (
            <div className="gap-section">
              <h4>❌ Skills You Need ({analysis.missing.length})</h4>
              <div className="skill-chips">
                {analysis.missing.map((skill, idx) => (
                  <span key={idx} className="chip chip-missing">{skill}</span>
                ))}
              </div>
              <button
                type="button"
                className="secondary-button"
                onClick={handleAddMissing}
              >
                Add Missing Skills
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default SkillGapAnalyzer
