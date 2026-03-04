import { ArrowRight } from 'lucide-react'

const Field = ({ label, error, ...props }) => (
  <div>
    <label className="block text-[10px] uppercase tracking-widest text-gray-400 mb-2">{label}</label>
    <input
      className={`w-full bg-[#2a3f47] rounded-sm p-3 outline-none focus:ring-1 focus:ring-[#7DE2EE] ${error ? 'ring-1 ring-red-400' : ''}`}
      {...props}
    />
    {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
  </div>
)

export default function StepInfo({ formData, errors, onChange }) {
  return (
    <>
      <div className="flex gap-4">
        <Field label="Nom" required name="nom" value={formData.nom} onChange={onChange} error={errors.nom} />
        <Field label="Prénom" required name="prenom" value={formData.prenom} onChange={onChange} error={errors.prenom} />
      </div>
      <Field label="Email" required type="email" name="email" value={formData.email} onChange={onChange} error={errors.email} />
      <Field label="Téléphone" required type="tel" name="telephone" value={formData.telephone} onChange={onChange} error={errors.telephone} />
      <Field label="Adresse postale" required name="adresse_postale" value={formData.adresse_postale} onChange={onChange} error={errors.adresse_postale} />

      <button type="submit" className="w-full bg-[#7DE2EE] hover:bg-[#68cbd6] text-[#1a2e35] font-bold py-4 rounded-md transition-all flex items-center justify-center gap-2 mt-4">
        Continuer <ArrowRight size={18} />
      </button>
    </>
  )
}