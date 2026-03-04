import { Check, Loader2 } from 'lucide-react'

export default function StepPin({ pin, errors, loading, onChange, onKeyDown }) {
  return (
    <>
      <div>
        <label className="block text-[10px] uppercase tracking-widest text-gray-400 mb-4">
          Définissez votre Code PIN (6 chiffres)
        </label>
        <div className="flex justify-between gap-2">
          {pin.map((digit, i) => (
            <input
              key={i}
              id={`pin-${i}`}
              type="text"
              inputMode="numeric"
              maxLength="1"
              value={digit}
              onChange={(e) => onChange(i, e.target.value)}
              onKeyDown={(e) => onKeyDown(i, e)}
              className={`w-12 h-14 bg-[#2a3f47] text-center text-xl font-bold rounded-sm outline-none focus:ring-2 focus:ring-[#7DE2EE] ${errors.pin ? 'ring-2 ring-red-400' : ''}`}
            />
          ))}
        </div>
        {errors.pin && <p className="text-red-400 text-xs mt-2">{errors.pin}</p>}
      </div>

      <button
        type="submit"
        disabled={loading || pin.some((d) => d === '')}
        className="w-full bg-[#7DE2EE] hover:bg-[#68cbd6] disabled:opacity-50 disabled:cursor-not-allowed text-[#1a2e35] font-bold py-4 rounded-md transition-all flex items-center justify-center gap-2 mt-8"
      >
        {loading
          ? <Loader2 className="animate-spin" size={18} />
          : <><span>Créer mon compte</span><Check size={18} /></>
        }
      </button>
    </>
  )
}