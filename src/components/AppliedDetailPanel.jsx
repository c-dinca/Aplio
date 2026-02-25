import { useState } from 'react'

// --- Simple Icons ---
const Icons = {
  FileText: () => <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>,
  Calendar: () => <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>,
  Message:  () => <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/></svg>,
  Target:   () => <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M14.017 21L16.4 14.4l3.1 3.1-6.4 6.4v-2.9zM3 10a7 7 0 1014 0 7 7 0 00-14 0z"/><path strokeLinecap="round" strokeLinejoin="round" d="M15 10a5 5 0 11-10 0 5 5 0 0110 0z"/><path strokeLinecap="round" strokeLinejoin="round" d="M13 10a3 3 0 11-6 0 3 3 0 016 0z"/><path strokeLinecap="round" strokeLinejoin="round" d="M11 10a1 1 0 11-2 0 1 1 0 012 0z"/></svg>,
}

export default function AppliedDetailPanel({ app, onUpdateApp }) {
  const [activeTab, setActiveTab] = useState('notes')

  // Chatbot mock state
  const [chatLog, setChatLog] = useState([
    { role: 'ai', text: `Hi! I'm your AI Interview Coach. Let's practice for your upcoming interview at ${app.company}. Are you ready for a behavioral question?` }
  ])
  const [chatInput, setChatInput] = useState('')

  const handleSendChat = (e) => {
    e.preventDefault()
    if (!chatInput.trim()) return
    const current = chatInput
    setChatLog(prev => [...prev, { role: 'user', text: current }])
    setChatInput('')

    // Mock AI response
    setTimeout(() => {
      setChatLog(prev => [...prev, { role: 'ai', text: "That's a solid start. Can you elaborate by providing a specific STAR (Situation, Task, Action, Result) example?" }])
    }, 1000)
  }

  const handleNotesChange = (e) => {
    onUpdateApp({ notes: e.target.value })
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      
      {/* Header */}
      <div style={{
        padding: 'var(--sp-5) var(--sp-6) var(--sp-4)',
        background: 'linear-gradient(to bottom, var(--blue-50), var(--surface))',
        borderBottom: '1px solid var(--border)', flexShrink: 0
      }}>
        <div style={{ display: 'flex', gap: 'var(--sp-4)' }}>
          <div style={{
            width: 56, height: 56, borderRadius: 'var(--r-md)', flexShrink: 0,
            background: 'linear-gradient(135deg, var(--gray-700), var(--gray-900))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontWeight: 700, fontSize: '1.25rem',
            fontFamily: 'var(--font-display)',
            boxShadow: 'var(--shadow-sm)'
          }}>
            {app.company.substring(0, 2).toUpperCase()}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <h1 style={{
              fontSize: '1.25rem', fontFamily: 'var(--font-display)', fontWeight: 800,
              color: 'var(--text-head)', margin: '0 0 4px', lineHeight: 1.2
            }}>
              {app.title}
            </h1>
            <p style={{
              fontSize: '0.9rem', color: 'var(--text-muted)', margin: 0,
              display: 'flex', alignItems: 'center', gap: 'var(--sp-2)'
            }}>
              <span style={{ fontWeight: 600, color: 'var(--text-body)' }}>{app.company}</span>
              <span>•</span>
              Applied {new Date(app.date).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Segmented Tabs */}
        <div style={{
          display: 'flex', background: 'var(--gray-100)', borderRadius: 'var(--r-full)',
          padding: 4, marginTop: 'var(--sp-5)'
        }}>
          {[
            { id: 'notes', label: 'Notes & Schedule', icon: <Icons.Calendar /> },
            { id: 'interview', label: 'AI Interview', icon: <Icons.Message /> },
            { id: 'requirements', label: 'Requirements', icon: <Icons.Target /> },
            { id: 'details', label: 'Job Details', icon: <Icons.FileText /> },
          ].map(t => {
            const active = activeTab === t.id
            return (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                style={{
                  flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                  padding: '6px 12px', fontSize: '0.8rem', fontWeight: active ? 600 : 500,
                  fontFamily: 'var(--font-body)', borderRadius: 'var(--r-full)',
                  background: active ? 'var(--surface)' : 'transparent',
                  color: active ? 'var(--text-head)' : 'var(--text-muted)',
                  border: 'none', cursor: 'pointer', transition: 'all 0.15s ease',
                  boxShadow: active ? '0 1px 3px rgba(0,0,0,0.08)' : 'none'
                }}
              >
                {t.icon}
                {t.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Main Scrollable Content */}
      <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: 'var(--sp-6)' }}>
        <div className="fade-in">

          {/* 1. NOTES & SCHEDULE */}
          {activeTab === 'notes' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-6)' }}>
              <div>
                <h3 style={{ fontSize: '0.9rem', fontWeight: 600, margin: '0 0 var(--sp-3)' }}>Application Notes</h3>
                <textarea
                  value={app.notes}
                  onChange={handleNotesChange}
                  placeholder="Keep track of key details, recruiter names, or deadlines here..."
                  style={{
                    width: '100%', minHeight: 120, padding: '12px',
                    fontSize: '0.85rem', fontFamily: 'var(--font-body)',
                    lineHeight: 1.6, border: '1px solid var(--border)',
                    borderRadius: 'var(--r-md)', outline: 'none',
                    resize: 'vertical'
                  }}
                />
              </div>

              {/* Mock Calendar UI */}
              <div>
                <h3 style={{ fontSize: '0.9rem', fontWeight: 600, margin: '0 0 var(--sp-3)' }}>Upcoming Events</h3>
                <div style={{
                  border: '1px solid var(--border)', borderRadius: 'var(--r-md)',
                  background: 'var(--bg)', overflow: 'hidden'
                }}>
                  <div style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '10px 16px', background: 'var(--gray-50)', borderBottom: '1px solid var(--border)',
                    fontSize: '0.85rem', fontWeight: 600
                  }}>
                    <span>April 2026</span>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button style={{ background: 'none', border: 'none', cursor: 'pointer' }}>◀</button>
                      <button style={{ background: 'none', border: 'none', cursor: 'pointer' }}>▶</button>
                    </div>
                  </div>
                  <div style={{ padding: 'var(--sp-4)', display: 'flex', flexDirection: 'column', gap: 'var(--sp-3)' }}>
                    <div style={{ display: 'flex', gap: 'var(--sp-3)', alignItems: 'center' }}>
                      <div style={{ width: 40, textAlign: 'center' }}>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Tue</div>
                        <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-head)' }}>14</div>
                      </div>
                      <div style={{ flex: 1, background: '#FFF7ED', borderLeft: '3px solid #F97316', padding: '10px 14px', borderRadius: '4px' }}>
                        <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#C2410C' }}>Technical Interview with {app.company}</div>
                        <div style={{ fontSize: '0.75rem', color: '#EA580C', marginTop: 2 }}>2:00 PM - Google Meet</div>
                      </div>
                    </div>
                    {/* Add Event Button */}
                    <button className="btn btn-sm btn-outline-gray" style={{ alignSelf: 'flex-start', marginTop: 8 }}>
                      + Schedule Event
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 2. AI INTERVIEW PREP */}
          {activeTab === 'interview' && (
            <div style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 400 }}>
              <div style={{
                flex: 1, border: '1px solid var(--border)', borderRadius: 'var(--r-md)',
                display: 'flex', flexDirection: 'column', overflow: 'hidden', background: 'var(--bg)'
              }}>
                <div style={{
                  padding: '12px 16px', background: 'var(--surface)', borderBottom: '1px solid var(--border)',
                  fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8
                }}>
                  <div style={{ width: 8, height: 8, borderRadius: 4, background: 'var(--green-500)' }} />
                  AI Coach Online
                </div>
                
                <div style={{ flex: 1, padding: 'var(--sp-4)', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 'var(--sp-3)' }}>
                  {chatLog.map((c, i) => (
                    <div key={i} style={{
                      alignSelf: c.role === 'ai' ? 'flex-start' : 'flex-end',
                      maxWidth: '85%',
                    }}>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: 4, marginLeft: 4 }}>
                        {c.role === 'ai' ? 'Aplio AI' : 'You'}
                      </div>
                      <div style={{
                        background: c.role === 'ai' ? 'var(--surface)' : 'var(--blue-600)',
                        color: c.role === 'ai' ? 'var(--text-body)' : '#fff',
                        border: c.role === 'ai' ? '1px solid var(--border)' : 'none',
                        padding: '10px 14px', borderRadius: 'var(--r-md)', fontSize: '0.85rem',
                        lineHeight: 1.5,
                        borderTopLeftRadius: c.role === 'ai' ? 4 : 'var(--r-md)',
                        borderTopRightRadius: c.role === 'user' ? 4 : 'var(--r-md)',
                      }}>
                        {c.text}
                      </div>
                    </div>
                  ))}
                </div>

                <form onSubmit={handleSendChat} style={{ borderTop: '1px solid var(--border)', display: 'flex', padding: 8, background: 'var(--surface)' }}>
                  <input
                    value={chatInput} onChange={e => setChatInput(e.target.value)}
                    placeholder="Type your answer entirely..."
                    style={{ flex: 1, border: 'none', outline: 'none', background: 'transparent', padding: '8px 12px', fontSize: '0.85rem' }}
                  />
                  <button type="submit" className="btn btn-sm btn-primary">Send</button>
                </form>
              </div>
            </div>
          )}

          {/* 3. REQUIREMENTS */}
          {activeTab === 'requirements' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-5)' }}>
              <div style={{ padding: 'var(--sp-4)', background: 'var(--blue-50)', borderRadius: 'var(--r-md)', display: 'flex', gap: 12 }}>
                <div style={{ fontSize: 24 }}>💡</div>
                <div>
                  <h4 style={{ margin: '0 0 4px', fontSize: '0.9rem', color: 'var(--blue-800)' }}>Prep Strategy</h4>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--blue-700)', lineHeight: 1.5 }}>
                    Focus on demonstrating impact for the core requirements. Prepare 1-2 STAR stories for each skill area below.
                  </p>
                </div>
              </div>

              {app.requirements && app.requirements.length > 0 ? (
                <div style={{ display: 'grid', gap: 'var(--sp-3)' }}>
                  {app.requirements.map(req => (
                    <div key={req} style={{ border: '1px solid var(--border)', borderRadius: 'var(--r-md)', padding: 'var(--sp-4)' }}>
                      <h4 style={{ margin: '0 0 8px', fontSize: '0.9rem', color: 'var(--text-head)' }}>{req}</h4>
                      <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-body)', lineHeight: 1.5 }}>
                        <strong>AI Tip:</strong> Review common {req} architecture patterns. Be ready to discuss trade-offs between different approaches you've used in past projects.
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>No specific requirements extracted.</p>
              )}
            </div>
          )}

          {/* 4. JOB DETAILS */}
          {activeTab === 'details' && (
             <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-5)' }}>
               <div>
                  <h3 style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-head)', margin: '0 0 8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Description</h3>
                  <p style={{ fontSize: '0.88rem', color: 'var(--text-body)', lineHeight: 1.8, margin: 0 }}>
                    {app.jobDescription}
                  </p>
               </div>
             </div>
          )}

        </div>
      </div>

    </div>
  )
}
