import { useState, useRef, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

// ── SVG Icons ───────────────────────────────────────────────────────
const Icons = {
  Search:     () => <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>,
  Globe:      () => <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>,
  MapPin:     () => <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>,
  Settings:   () => <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>,
  Star:       () => <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/></svg>,
  Clipboard:  () => <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/></svg>,
  FileText:   () => <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>,
  LogOut:     () => <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>,
  ChevronUp:  () => <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7"/></svg>,
}

// ── Country & City data ─────────────────────────────────────────────
const COUNTRIES = [
  'Albania','Andorra','Argentina','Australia','Austria','Belgium','Bosnia and Herzegovina',
  'Brazil','Bulgaria','Canada','Chile','China','Colombia','Croatia','Cyprus','Czech Republic',
  'Denmark','Egypt','Estonia','Finland','France','Germany','Greece','Hungary','Iceland',
  'India','Indonesia','Ireland','Israel','Italy','Japan','Latvia','Lithuania','Luxembourg',
  'Malaysia','Malta','Mexico','Moldova','Montenegro','Morocco','Netherlands','New Zealand',
  'Nigeria','North Macedonia','Norway','Peru','Philippines','Poland','Portugal','Romania',
  'Serbia','Singapore','Slovakia','Slovenia','South Africa','South Korea','Spain',
  'Sweden','Switzerland','Thailand','Tunisia','Turkey','Ukraine','United Arab Emirates',
  'United Kingdom','United States','Vietnam',
]
const CITIES_BY_COUNTRY = {
  'Romania': ['Bucharest','Cluj-Napoca','Timișoara','Iași','Brașov','Constanța','Sibiu','Oradea','Craiova'],
  'United Kingdom': ['London','Manchester','Birmingham','Edinburgh','Glasgow','Bristol','Leeds','Liverpool','Cambridge','Oxford'],
  'United States': ['New York','San Francisco','Los Angeles','Chicago','Austin','Seattle','Boston','Denver','Miami','Atlanta'],
  'Germany': ['Berlin','Munich','Hamburg','Frankfurt','Cologne','Stuttgart','Düsseldorf','Leipzig','Dresden'],
  'France': ['Paris','Lyon','Marseille','Toulouse','Bordeaux','Nice','Nantes','Strasbourg','Lille'],
  'Netherlands': ['Amsterdam','Rotterdam','The Hague','Utrecht','Eindhoven','Groningen'],
  'Spain': ['Madrid','Barcelona','Valencia','Seville','Bilbao','Malaga','Zaragoza'],
  'Italy': ['Rome','Milan','Naples','Turin','Florence','Bologna','Genoa','Venice'],
  'Poland': ['Warsaw','Kraków','Wrocław','Gdańsk','Poznań','Łódź','Katowice'],
  'Portugal': ['Lisbon','Porto','Braga','Coimbra','Faro'],
  'Ireland': ['Dublin','Cork','Galway','Limerick','Waterford'],
  'Sweden': ['Stockholm','Gothenburg','Malmö','Uppsala'],
  'Switzerland': ['Zurich','Geneva','Basel','Bern','Lausanne'],
  'Austria': ['Vienna','Graz','Linz','Salzburg','Innsbruck'],
  'Belgium': ['Brussels','Antwerp','Ghent','Leuven','Bruges'],
  'Canada': ['Toronto','Vancouver','Montreal','Ottawa','Calgary','Edmonton'],
  'Australia': ['Sydney','Melbourne','Brisbane','Perth','Adelaide'],
  'India': ['Bangalore','Mumbai','Delhi','Hyderabad','Pune','Chennai'],
  'Singapore': ['Singapore'],
  'Japan': ['Tokyo','Osaka','Yokohama','Kyoto','Nagoya'],
  'Czech Republic': ['Prague','Brno','Ostrava','Plzeň'],
  'Denmark': ['Copenhagen','Aarhus','Odense','Aalborg'],
  'Finland': ['Helsinki','Espoo','Tampere','Turku'],
  'Norway': ['Oslo','Bergen','Trondheim','Stavanger'],
  'Hungary': ['Budapest','Debrecen','Szeged','Pécs'],
  'Bulgaria': ['Sofia','Plovdiv','Varna','Burgas'],
  'Croatia': ['Zagreb','Split','Rijeka','Osijek'],
  'Serbia': ['Belgrade','Novi Sad','Niš'],
  'United Arab Emirates': ['Dubai','Abu Dhabi','Sharjah'],
  'South Korea': ['Seoul','Busan','Incheon','Daegu'],
  'Israel': ['Tel Aviv','Jerusalem','Haifa','Herzliya'],
  'Turkey': ['Istanbul','Ankara','Izmir','Antalya'],
  'South Africa': ['Johannesburg','Cape Town','Durban','Pretoria'],
  'Brazil': ['São Paulo','Rio de Janeiro','Belo Horizonte','Curitiba','Brasília'],
  'Mexico': ['Mexico City','Guadalajara','Monterrey','Puebla'],
  'Argentina': ['Buenos Aires','Córdoba','Rosario','Mendoza'],
  'Colombia': ['Bogotá','Medellín','Cali','Barranquilla'],
}

// ── Autocomplete hook ───────────────────────────────────────────────
function useAutocomplete(items) {
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState('')
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  const filtered = query
    ? items.filter(i => i.toLowerCase().includes(query.toLowerCase())).slice(0, 8)
    : items.slice(0, 8)
  useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [])
  return {
    query, setQuery, selected, open, setOpen, filtered, ref,
    select(v) { setSelected(v); setQuery(v); setOpen(false) },
    clear() { setSelected(''); setQuery(''); setOpen(false) },
  }
}

function AutocompleteInput({ icon, placeholder, items, value, onChange, onClear }) {
  const ac = useAutocomplete(items)
  useEffect(() => { if (!value && ac.selected) ac.clear() }, [value]) // eslint-disable-line
  const handleChange = (e) => {
    ac.setQuery(e.target.value); ac.setOpen(true)
    if (ac.selected) { ac.clear(); onClear?.() }
  }
  const handleSelect = (item) => { ac.select(item); onChange(item) }
  return (
    <div ref={ac.ref} style={{ position: 'relative' }}>
      <span style={{
        position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)',
        color: 'var(--text-muted)', pointerEvents: 'none',
        display: 'flex', alignItems: 'center', justifyContent: 'center'
      }}>{icon}</span>
      <input type="text" placeholder={placeholder} value={ac.query}
        onChange={handleChange} onFocus={() => ac.setOpen(true)}
        style={{
          width: '100%', padding: '10px 32px 10px 36px',
          fontSize: '0.85rem', fontFamily: 'var(--font-body)',
          background: 'var(--surface)', border: '1.5px solid var(--border)',
          borderRadius: 'var(--r-md)', color: 'var(--text-head)',
          outline: 'none', transition: 'border-color 0.15s ease',
        }}
      />
      {ac.selected && (
        <button onClick={() => { ac.clear(); onClear?.() }} style={{
          position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)',
          background: 'none', border: 'none', cursor: 'pointer',
          color: 'var(--text-muted)', fontSize: '0.85rem', padding: 4, lineHeight: 1,
        }} aria-label="Clear">✕</button>
      )}
      {ac.open && ac.filtered.length > 0 && (
        <div className="autocomplete-dropdown">
          {ac.filtered.map(item => (
            <div key={item} className="autocomplete-option" onMouseDown={() => handleSelect(item)}>
              {item}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ── Sidebar Action Button ───────────────────────────────────────────
function ActionButton({ icon, label, count, active, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex', alignItems: 'center', gap: 'var(--sp-3)',
        width: '100%', padding: '10px 16px',
        fontSize: '0.85rem', fontWeight: active ? 600 : 500,
        fontFamily: 'var(--font-body)',
        color: active ? 'var(--primary)' : 'var(--text-body)',
        background: active ? 'var(--blue-50)' : 'none',
        border: 'none', borderRadius: 'var(--r-md)',
        cursor: 'pointer', transition: 'all 0.15s ease',
        textAlign: 'left', position: 'relative',
      }}
      onMouseEnter={e => {
        if (!active) { e.currentTarget.style.background = 'var(--gray-100)' }
      }}
      onMouseLeave={e => {
        if (!active) { e.currentTarget.style.background = 'none' }
      }}
    >
      {/* Active indicator */}
      {active && (
        <div style={{
          position: 'absolute', left: 0, top: 6, bottom: 6, width: 4,
          borderRadius: '0 var(--r-full) var(--r-full) 0',
          background: 'var(--primary)',
        }} />
      )}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        width: 22, color: active ? 'var(--primary)' : 'var(--text-muted)'
      }}>
        {icon}
      </div>
      <span style={{ flex: 1 }}>{label}</span>
      {count > 0 && (
        <span style={{
          background: 'var(--primary)', color: '#fff',
          borderRadius: 'var(--r-full)', fontSize: '0.65rem',
          fontWeight: 700, minWidth: 20, height: 20,
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          padding: '0 6px', lineHeight: 1,
        }}>{count}</span>
      )}
    </button>
  )
}

// ── Main Sidebar ────────────────────────────────────────────────────
export default function Sidebar({
  onSearch, onEditCv, onLogin, isLoggedIn, user, onLogout,
  filterCount = 0, onOpenFilters, showFavorites, onToggleFavorites,
  favoritesCount = 0,
}) {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const [query, setQuery]     = useState('')
  const [country, setCountry] = useState('')
  const [city, setCity]       = useState('')

  const [showUserMenu, setShowUserMenu] = useState(false)
  const userMenuRef = useRef(null)

  useEffect(() => {
    const h = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setShowUserMenu(false)
      }
    }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [])

  const cities = CITIES_BY_COUNTRY[country] || []

  const handleSearch = (e) => {
    e?.preventDefault()
    const loc = city && country ? `${city}, ${country}` : country || ''
    if (pathname !== '/') navigate('/')
    onSearch(query, loc)
  }

  return (
    <aside style={{
      width: 'var(--sidebar-w)', flexShrink: 0,
      background: 'var(--sidebar-bg)', borderRight: '1px solid var(--border)',
      height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden',
    }}>
      {/* Logo */}
      <div style={{ padding: 'var(--sp-6) var(--sp-5)', flexShrink: 0 }}>
        <div
          onClick={() => navigate('/')}
          style={{
            fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.4rem',
            color: 'var(--gray-900)', userSelect: 'none', cursor: 'pointer',
          }}
        >
          Ap<span style={{ color: 'var(--accent)' }}>li</span>o
        </div>
      </div>

      {/* Search form */}
      <div style={{ padding: '0 var(--sp-5) var(--sp-4)', flexShrink: 0 }}>
        <form onSubmit={handleSearch}>
          <div style={{ position: 'relative', marginBottom: 'var(--sp-2)' }}>
            <span style={{
              position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)',
              color: 'var(--text-muted)', pointerEvents: 'none',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <Icons.Search />
            </span>
            <input type="text" placeholder="Job title, company..."
              value={query} onChange={e => setQuery(e.target.value)}
              style={{
                width: '100%', padding: '10px 12px 10px 36px',
                fontSize: '0.85rem', fontFamily: 'var(--font-body)',
                background: 'var(--surface)', border: '1.5px solid var(--border)',
                borderRadius: 'var(--r-md)', color: 'var(--text-head)',
                outline: 'none', transition: 'border-color 0.15s ease',
              }}
            />
          </div>
          <div style={{ marginBottom: 'var(--sp-2)' }}>
            <AutocompleteInput icon={<Icons.Globe />} placeholder="Country..." items={COUNTRIES}
              value={country} onChange={v => { setCountry(v); setCity('') }}
              onClear={() => { setCountry(''); setCity('') }}
            />
          </div>
          {country && cities.length > 0 && (
            <div style={{ marginBottom: 'var(--sp-2)' }} className="fade-in">
              <AutocompleteInput icon={<Icons.MapPin />} placeholder="City (optional)..." items={cities}
                value={city} onChange={setCity} onClear={() => setCity('')}
              />
            </div>
          )}
          <button type="submit" className="btn btn-md btn-primary" style={{
            width: '100%', justifyContent: 'center', marginTop: 'var(--sp-3)',
            borderRadius: 'var(--r-md)',
          }}>
            Search Jobs
          </button>
        </form>
      </div>

      {/* Divider */}
      <div style={{ height: 1, background: 'var(--border)', margin: '0 var(--sp-5)' }} />

      {/* Action Buttons */}
      <div style={{
        padding: 'var(--sp-4) var(--sp-3)',
        display: 'flex', flexDirection: 'column', gap: 2,
        flexShrink: 0,
      }}>
        <ActionButton
          icon={<Icons.Settings />}
          label="Filters"
          count={filterCount}
          active={false}
          onClick={() => {
            if (pathname !== '/') navigate('/')
            onOpenFilters()
          }}
        />
        <ActionButton
          icon={<Icons.Star />}
          label="Favorites"
          count={favoritesCount}
          active={pathname === '/' && showFavorites}
          onClick={() => {
            if (pathname !== '/') {
              navigate('/')
              onToggleFavorites(true)
            } else {
              onToggleFavorites()
            }
          }}
        />
        <ActionButton
          icon={<Icons.Clipboard />}
          label="Applied"
          count={0}
          active={pathname === '/applied'}
          onClick={() => navigate('/applied')}
        />
        {/* We removed "My CV" from here based on user feedback */}
      </div>

      {/* Spacer */}
      <div style={{ flex: 1 }} />

      {/* User section */}
      <div style={{
        padding: 'var(--sp-3) var(--sp-5) var(--sp-5)',
        borderTop: '1px solid var(--border)', flexShrink: 0,
        position: 'relative',
      }} ref={userMenuRef}>
        
        {/* Dropdown Menu */}
        {showUserMenu && isLoggedIn && (
          <div className="fade-in cascade" style={{
            position: 'absolute', bottom: '100%', left: 'var(--sp-4)', right: 'var(--sp-4)',
            marginBottom: 'var(--sp-2)', background: 'var(--surface)',
            border: '1px solid var(--border)', borderRadius: 'var(--r-md)',
            boxShadow: 'var(--shadow-lg)', padding: 'var(--sp-2)',
            display: 'flex', flexDirection: 'column', gap: 2,
            zIndex: 10,
          }}>
            <button className="user-menu-item" onClick={() => { setShowUserMenu(false); /* placeholder for settings */ }}>
              <Icons.Settings /> Settings
            </button>
            <button className="user-menu-item" onClick={() => { setShowUserMenu(false); onEditCv() }}>
              <Icons.FileText /> My CV
            </button>
            <div style={{ height: 1, background: 'var(--border)', margin: '4px 0' }} />
            <button className="user-menu-item text-red" onClick={() => { setShowUserMenu(false); onLogout() }}>
              <Icons.LogOut /> Log out
            </button>
          </div>
        )}

        {isLoggedIn ? (
          <div 
            onClick={() => setShowUserMenu(!showUserMenu)}
            style={{ 
              display: 'flex', alignItems: 'center', gap: 10, 
              cursor: 'pointer', padding: '6px', margin: '-6px', 
              borderRadius: 'var(--r-md)', transition: 'background 0.15s' 
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'var(--gray-100)'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >
            <div style={{
              width: 32, height: 32, borderRadius: 'var(--r-full)',
              background: 'linear-gradient(135deg, var(--blue-500), var(--blue-700))',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#fff', fontWeight: 700, fontSize: '0.7rem',
              fontFamily: 'var(--font-display)', flexShrink: 0,
            }}>
              {(user?.name || user?.email || '?')[0].toUpperCase()}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{
                fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-head)',
                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
              }}>
                {user?.name || user?.email?.split('@')[0]}
              </div>
            </div>
            <div style={{ color: 'var(--text-muted)', display: 'flex' }}>
              <Icons.ChevronUp />
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn btn-sm btn-outline-gray"
              style={{ flex: 1, justifyContent: 'center', fontSize: '0.82rem' }} onClick={onLogin}
            >Log in</button>
            <button className="btn btn-sm btn-primary"
              style={{ flex: 1, justifyContent: 'center', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '6px' }} onClick={onEditCv}
            ><Icons.FileText /> My CV</button>
          </div>
        )}
      </div>
    </aside>
  )
}
