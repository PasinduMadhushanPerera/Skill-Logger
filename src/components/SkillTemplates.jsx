import { useState } from 'react'

const templates = {
  mern: {
    name: 'MERN Stack Developer',
    skills: [
      { name: 'MongoDB', level: 'Intermediate', category: 'Database' },
      { name: 'Express.js', level: 'Intermediate', category: 'Backend' },
      { name: 'React', level: 'Advanced', category: 'Frontend' },
      { name: 'Node.js', level: 'Intermediate', category: 'Backend' },
      { name: 'JavaScript', level: 'Advanced', category: 'Frontend' },
      { name: 'REST API', level: 'Intermediate', category: 'Backend' },
    ]
  },
  fullstack: {
    name: 'Full Stack Developer',
    skills: [
      { name: 'HTML5', level: 'Advanced', category: 'Frontend' },
      { name: 'CSS3', level: 'Advanced', category: 'Frontend' },
      { name: 'JavaScript', level: 'Advanced', category: 'Frontend' },
      { name: 'React', level: 'Advanced', category: 'Frontend' },
      { name: 'Node.js', level: 'Intermediate', category: 'Backend' },
      { name: 'SQL', level: 'Intermediate', category: 'Database' },
      { name: 'Git', level: 'Intermediate', category: 'DevOps' },
      { name: 'REST API', level: 'Intermediate', category: 'Backend' },
    ]
  },
  datascience: {
    name: 'Data Science',
    skills: [
      { name: 'Python', level: 'Advanced', category: 'Backend' },
      { name: 'Pandas', level: 'Intermediate', category: 'Backend' },
      { name: 'NumPy', level: 'Intermediate', category: 'Backend' },
      { name: 'Scikit-learn', level: 'Intermediate', category: 'Backend' },
      { name: 'Matplotlib', level: 'Beginner', category: 'Backend' },
      { name: 'SQL', level: 'Intermediate', category: 'Database' },
      { name: 'Jupyter', level: 'Intermediate', category: 'Backend' },
    ]
  },
  devops: {
    name: 'DevOps Engineer',
    skills: [
      { name: 'Docker', level: 'Intermediate', category: 'DevOps' },
      { name: 'Kubernetes', level: 'Beginner', category: 'DevOps' },
      { name: 'AWS', level: 'Intermediate', category: 'Cloud' },
      { name: 'CI/CD', level: 'Intermediate', category: 'DevOps' },
      { name: 'Linux', level: 'Intermediate', category: 'DevOps' },
      { name: 'Git', level: 'Advanced', category: 'DevOps' },
      { name: 'Terraform', level: 'Beginner', category: 'DevOps' },
    ]
  },
  mobile: {
    name: 'Mobile Developer',
    skills: [
      { name: 'React Native', level: 'Intermediate', category: 'Mobile' },
      { name: 'JavaScript', level: 'Advanced', category: 'Mobile' },
      { name: 'TypeScript', level: 'Intermediate', category: 'Mobile' },
      { name: 'iOS Development', level: 'Beginner', category: 'Mobile' },
      { name: 'Android Development', level: 'Beginner', category: 'Mobile' },
      { name: 'REST API', level: 'Intermediate', category: 'Backend' },
    ]
  }
}

function SkillTemplates({ onImport }) {
  const [selectedTemplate, setSelectedTemplate] = useState(null)

  const handleImport = (templateKey) => {
    const template = templates[templateKey]
    if (window.confirm(`Import ${template.skills.length} skills from "${template.name}" template?`)) {
      onImport(template.skills)
    }
  }

  return (
    <div className="templates-section">
      <h3>Quick Import Templates</h3>
      <p className="settings-note">Import pre-configured skill sets for common tech roles</p>
      <div className="templates-grid">
        {Object.entries(templates).map(([key, template]) => (
          <div key={key} className="template-card">
            <div className="template-header">
              <strong>{template.name}</strong>
              <span className="template-count">{template.skills.length} skills</span>
            </div>
            <button
              type="button"
              className="secondary-button"
              onClick={() => handleImport(key)}
            >
              Import
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default SkillTemplates
