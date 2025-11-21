import { useState } from 'react'

function CertificateManager({ skill, onUpdateCertificates }) {
  const [showAdd, setShowAdd] = useState(false)
  const [newCert, setNewCert] = useState({
    name: '',
    issuer: '',
    issueDate: '',
    expiryDate: '',
    credentialUrl: ''
  })

  const handleAdd = () => {
    if (!newCert.name.trim() || !newCert.issuer.trim()) {
      alert('Please fill certificate name and issuer')
      return
    }

    const cert = {
      ...newCert,
      id: Date.now()
    }

    const updated = [...(skill.certificates || []), cert]
    onUpdateCertificates(skill.id, updated)
    setNewCert({ name: '', issuer: '', issueDate: '', expiryDate: '', credentialUrl: '' })
    setShowAdd(false)
  }

  const handleDelete = (certId) => {
    if (window.confirm('Delete this certificate?')) {
      const updated = skill.certificates.filter(c => c.id !== certId)
      onUpdateCertificates(skill.id, updated)
    }
  }

  const isExpiringSoon = (expiryDate) => {
    if (!expiryDate) return false
    const expiry = new Date(expiryDate)
    const now = new Date()
    const daysUntilExpiry = Math.floor((expiry - now) / (1000 * 60 * 60 * 24))
    return daysUntilExpiry <= 90 && daysUntilExpiry >= 0
  }

  const isExpired = (expiryDate) => {
    if (!expiryDate) return false
    return new Date(expiryDate) < new Date()
  }

  return (
    <div className="certificate-manager">
      <div className="certificate-header">
        <h4>🏆 Certificates</h4>
        <button
          type="button"
          className="icon-button"
          onClick={() => setShowAdd(!showAdd)}
        >
          {showAdd ? '✕' : '+'}
        </button>
      </div>

      {showAdd && (
        <div className="certificate-form">
          <input
            type="text"
            placeholder="Certificate name"
            value={newCert.name}
            onChange={(e) => setNewCert({ ...newCert, name: e.target.value })}
          />
          <input
            type="text"
            placeholder="Issuing organization"
            value={newCert.issuer}
            onChange={(e) => setNewCert({ ...newCert, issuer: e.target.value })}
          />
          <div className="date-row">
            <div className="date-field">
              <label>Issue Date</label>
              <input
                type="date"
                value={newCert.issueDate}
                onChange={(e) => setNewCert({ ...newCert, issueDate: e.target.value })}
              />
            </div>
            <div className="date-field">
              <label>Expiry Date</label>
              <input
                type="date"
                value={newCert.expiryDate}
                onChange={(e) => setNewCert({ ...newCert, expiryDate: e.target.value })}
              />
            </div>
          </div>
          <input
            type="url"
            placeholder="Credential URL (optional)"
            value={newCert.credentialUrl}
            onChange={(e) => setNewCert({ ...newCert, credentialUrl: e.target.value })}
          />
          <button type="button" className="primary-button" onClick={handleAdd}>
            Add Certificate
          </button>
        </div>
      )}

      <div className="certificates-list">
        {(skill.certificates || []).length === 0 ? (
          <p className="no-data">No certificates yet. Add your achievements!</p>
        ) : (
          (skill.certificates || []).slice().reverse().map(cert => (
            <div key={cert.id} className="certificate-item">
              <div className="cert-main">
                <div className="cert-icon">🏆</div>
                <div className="cert-info">
                  <h5 className="cert-name">{cert.name}</h5>
                  <p className="cert-issuer">{cert.issuer}</p>
                  {cert.issueDate && (
                    <p className="cert-date">Issued: {new Date(cert.issueDate).toLocaleDateString()}</p>
                  )}
                  {cert.expiryDate && (
                    <p className={`cert-expiry ${isExpired(cert.expiryDate) ? 'expired' : isExpiringSoon(cert.expiryDate) ? 'expiring-soon' : ''}`}>
                      {isExpired(cert.expiryDate) && '⚠️ Expired: '}
                      {isExpiringSoon(cert.expiryDate) && !isExpired(cert.expiryDate) && '⚠️ Expires: '}
                      {!isExpired(cert.expiryDate) && !isExpiringSoon(cert.expiryDate) && 'Expires: '}
                      {new Date(cert.expiryDate).toLocaleDateString()}
                    </p>
                  )}
                  {cert.credentialUrl && (
                    <a
                      href={cert.credentialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="cert-link"
                    >
                      View Credential →
                    </a>
                  )}
                </div>
                <button
                  type="button"
                  className="delete-icon-button"
                  onClick={() => handleDelete(cert.id)}
                >
                  🗑️
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default CertificateManager
