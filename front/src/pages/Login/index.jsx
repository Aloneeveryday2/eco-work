import { useState } from 'react'
import { Loader2 } from 'lucide-react'
import { useNavigate, Link } from 'react-router-dom'
import PinInput from './PinInput'

const getCookie = (name) => {
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'))
  return match ? decodeURIComponent(match[2]) : ''
}

export default function Login() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const [email, setEmail] = useState('')
  const [pin, setPin] = useState(Array(6).fill(''))

  const handlePinChange = (index, value) => {
    if (value !== '' && !/^\d+$/.test(value)) return
    const newPin = [...pin]
    newPin[index] = value.slice(-1)
    setPin(newPin)
    if (errors.pin) setErrors(e => ({ ...e, pin: null }))
    if (value !== '' && index < 5) document.getElementById(`pin-${index + 1}`)?.focus()
  }

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && pin[index] === '' && index > 0)
      document.getElementById(`pin-${index - 1}`)?.focus()
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setErrors({})
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/sanctum/csrf-cookie`, { credentials: 'include' })
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          'X-XSRF-TOKEN': getCookie('XSRF-TOKEN'),
        },
        credentials: 'include',
        body: JSON.stringify({ email, pin: pin.join('') }),
      })
      const data = await res.json()

      if (!res.ok) {
        if (res.status === 422 && data.errors) {
          const flat = Object.fromEntries(Object.entries(data.errors).map(([k, v]) => [k, v[0]]))
          setErrors(flat)
        } else {
          setErrors({ general: data.message || 'Identifiants invalides.' })
        }
        return
      }

      if (data.token) localStorage.setItem('token', data.token)
      if (data.user) localStorage.setItem('user', JSON.stringify(data.user))
      navigate('/')
    } catch {
      setErrors({ general: 'Impossible de contacter le serveur. Veuillez réessayer.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen bg-[#121212] font-sans text-white w-full">

      {/* Panneau gauche */}
      <div className="hidden lg:flex flex-col justify-center w-1/2 p-20 bg-gradient-to-br from-[#0a1f24] to-[#051014] relative">
        <div className="absolute top-12 left-12 text-sm font-semibold tracking-widest opacity-80">EcoWork</div>
        <div className="max-w-md">
          <div className="w-16 h-1 bg-[#7DE2EE] mb-8" />
          <h1 className="text-4xl font-light leading-tight">
            Un espace.<br />
            <span className="font-semibold text-[#7DE2EE]">Une respiration.</span>
          </h1>
        </div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-cyan-900/10 blur-[120px] rounded-full" />
      </div>

      {/* Panneau droit */}
      <div className="w-full lg:w-1/2 bg-[#1a2e35] flex flex-col justify-center items-center px-8 py-12">
        <div className="w-full max-w-md">

          <p className="text-[#7DE2EE] text-xs uppercase tracking-widest mb-2 font-medium">Connexion</p>
          <h2 className="text-4xl font-light mb-10 leading-tight">
            Bon retour<br />parmi nous.
          </h2>

          {errors.general && (
            <div className="mb-6 p-3 bg-red-900/40 border border-red-500/40 rounded text-red-300 text-sm">
              {errors.general}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div>
              <label className="block text-[10px] uppercase tracking-widest text-gray-400 mb-2">Email</label>
              <input
                required
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); if (errors.email) setErrors(err => ({ ...err, email: null })) }}
                className={`w-full bg-[#2a3f47] rounded-sm p-3 outline-none focus:ring-1 focus:ring-[#7DE2EE] ${errors.email ? 'ring-1 ring-red-400' : ''}`}
              />
              {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
            </div>

            {/* PIN */}
            <PinInput pin={pin} error={errors.pin} onChange={handlePinChange} onKeyDown={handleKeyDown} />

            <button
              type="submit"
              disabled={loading || pin.some(d => d === '')}
              className="w-full bg-[#7DE2EE] hover:bg-[#68cbd6] disabled:opacity-50 disabled:cursor-not-allowed text-[#1a2e35] font-bold py-4 rounded-md transition-all flex items-center justify-center gap-2 mt-4"
            >
              {loading ? <Loader2 className="animate-spin" size={18} /> : 'Se connecter'}
            </button>
          </form>

          <p className="text-center mt-6 text-xs text-gray-400">
            Pas encore de compte ?{' '}
            <Link to="/inscription" className="text-[#7DE2EE] hover:underline">S'inscrire</Link>
          </p>
        </div>
      </div>
    </div>
  )
}