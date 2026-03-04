import { useState } from 'react'
import { ArrowLeft } from 'lucide-react'
import { useNavigate, Link } from 'react-router-dom'
import StepInfo from './StepInfo'
import StepPin from './StepPin'
import SuccessScreen from './SuccessScreen'

const STEP1_FIELDS = ['nom', 'prenom', 'email', 'telephone', 'adresse_postale']

const getCookie = (name) => {
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'))
  return match ? decodeURIComponent(match[2]) : ''
}

export default function Inscription() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const [success, setSuccess] = useState(false)
  const [formData, setFormData] = useState({
    nom: '', prenom: '', email: '', telephone: '', adresse_postale: '',
    pin: ['', '', '', '', '', ''],
  })

  const handleChange = (e) => {
    setFormData(f => ({ ...f, [e.target.name]: e.target.value }))
    if (errors[e.target.name]) setErrors(err => ({ ...err, [e.target.name]: null }))
  }

  const handlePinChange = (index, value) => {
    if (value !== '' && !/^\d+$/.test(value)) return
    const newPin = [...formData.pin]
    newPin[index] = value.slice(-1)
    setFormData(f => ({ ...f, pin: newPin }))
    if (errors.pin) setErrors(err => ({ ...err, pin: null }))
    if (value !== '' && index < 5) document.getElementById(`pin-${index + 1}`)?.focus()
  }

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && formData.pin[index] === '' && index > 0)
      document.getElementById(`pin-${index - 1}`)?.focus()
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setErrors({})
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/sanctum/csrf-cookie`, { credentials: 'include' })
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          'X-XSRF-TOKEN': getCookie('XSRF-TOKEN'),
        },
        credentials: 'include',
        body: JSON.stringify({ ...formData, pin: formData.pin.join('') }),
      })
      const data = await res.json()
      if (!res.ok) {
        if (res.status === 422 && data.errors) {
          const flat = Object.fromEntries(Object.entries(data.errors).map(([k, v]) => [k, v[0]]))
          setErrors(flat)
          if (STEP1_FIELDS.some(f => flat[f])) setStep(1)
        } else {
          setErrors({ general: data.message || 'Une erreur est survenue.' })
        }
        return
      }
      if (data.token) localStorage.setItem('token', data.token)
      setSuccess(true)
      setTimeout(() => navigate('/'), 2000)
    } catch {
      setErrors({ general: 'Impossible de contacter le serveur. Veuillez réessayer.' })
    } finally {
      setLoading(false)
    }
  }

  if (success) return <SuccessScreen />

  return (
    <div className="flex min-h-screen bg-[#121212] font-sans text-white w-full">

      {/* Panneau gauche */}
      <div className="hidden lg:flex flex-col justify-center w-1/2 p-20 bg-gradient-to-br from-[#0a1f24] to-[#051014] relative">
        <div className="absolute top-12 left-12 text-sm font-semibold tracking-widest opacity-80">EcoWork</div>
        <div className="max-w-md">
          <div className="w-16 h-1 bg-[#7DE2EE] mb-8" />
          <h1 className="text-4xl font-light leading-tight">
            {step === 1 ? 'Travaillez mieux.' : 'Sécurisez votre'} <br />
            <span className="font-semibold text-[#7DE2EE]">
              {step === 1 ? 'Impactez moins.' : 'espace personnel.'}
            </span>
          </h1>
        </div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-cyan-900/10 blur-[120px] rounded-full" />
      </div>

      {/* Panneau droit */}
      <div className="w-full lg:w-1/2 bg-[#1a2e35] flex flex-col justify-center items-center px-8 py-12 relative">
        {step === 2 && (
          <button onClick={() => setStep(1)} className="absolute top-12 left-8 text-gray-400 hover:text-[#7DE2EE] flex items-center gap-2 text-xs uppercase tracking-widest">
            <ArrowLeft size={14} /> Retour
          </button>
        )}

        <div className="w-full max-w-md">
          <p className="text-[#7DE2EE] text-xs uppercase tracking-widest mb-2 font-medium">
            Inscription · Étape {step}/2
          </p>
          <h2 className="text-4xl font-light mb-8">
            Créez votre <span className="text-[#7DE2EE] font-semibold italic">espace.</span>
          </h2>

          <div className="flex gap-2 mb-10">
            <div className={`h-[2px] w-1/2 transition-colors ${step >= 1 ? 'bg-[#7DE2EE]' : 'bg-gray-600'}`} />
            <div className={`h-[2px] w-1/2 transition-colors ${step === 2 ? 'bg-[#7DE2EE]' : 'bg-gray-600'}`} />
          </div>

          {errors.general && (
            <div className="mb-4 p-3 bg-red-900/40 border border-red-500/40 rounded text-red-300 text-sm">
              {errors.general}
            </div>
          )}

          <form
            onSubmit={step === 1 ? (e) => { e.preventDefault(); setStep(2) } : handleSubmit}
            className="space-y-6"
          >
            {step === 1
              ? <StepInfo formData={formData} errors={errors} onChange={handleChange} />
              : <StepPin pin={formData.pin} errors={errors} loading={loading} onChange={handlePinChange} onKeyDown={handleKeyDown} />
            }
          </form>

          <p className="text-center mt-6 text-xs text-gray-400">
            Déjà un compte ?{' '}
            <Link to="/login" className="text-[#7DE2EE] hover:underline">Se connecter</Link>
          </p>
        </div>
      </div>
    </div>
  )
}