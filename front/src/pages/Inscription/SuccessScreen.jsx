import { Check } from 'lucide-react'

export default function SuccessScreen() {
  return (
    <div className="flex min-h-screen bg-[#121212] font-sans text-white items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 bg-[#7DE2EE] rounded-full flex items-center justify-center mx-auto mb-6">
          <Check size={32} className="text-[#1a2e35]" />
        </div>
        <h2 className="text-3xl font-light mb-2">Compte créé !</h2>
        <p className="text-gray-400">Redirection en cours…</p>
      </div>
    </div>
  )
}