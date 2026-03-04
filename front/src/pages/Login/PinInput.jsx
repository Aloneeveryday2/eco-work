export default function PinInput({ pin, error, onChange, onKeyDown }) {
  return (
    <div>
      <label className="block text-[10px] uppercase tracking-widest text-gray-400 mb-3">
        Code PIN (6 chiffres)
      </label>
      <div className="flex gap-3">
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
            className={`w-12 h-14 bg-[#2a3f47] text-center text-xl font-bold rounded-sm outline-none focus:ring-2 focus:ring-[#7DE2EE] ${error ? 'ring-2 ring-red-400' : ''}`}
          />
        ))}
      </div>
      {error && <p className="text-red-400 text-xs mt-2">{error}</p>}
    </div>
  )
}