import React, { useState } from 'react';
import { ArrowRight, ArrowLeft, Check, Loader2 } from 'lucide-react';

const Inscription = () => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    adresse_postale: '',
    pin: ['', '', '', '', '', ''] 
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePinChange = (index, value) => {
    if (value !== "" && !/^\d+$/.test(value)) return;
    const newPin = [...formData.pin];
    newPin[index] = value.slice(-1);
    setFormData({ ...formData, pin: newPin });

    if (value !== "" && index < 5) {
      const nextInput = document.getElementById(`pin-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && formData.pin[index] === "" && index > 0) {
      const prevInput = document.getElementById(`pin-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    console.log("Données prêtes pour Laravel:", {
      ...formData,
      pin: formData.pin.join('')
    });

    setTimeout(() => setLoading(false), 1500);
  };

  return (
    <div className="flex min-h-screen bg-[#121212] font-sans text-white w-full">
      

      <div className="hidden lg:flex flex-col justify-center w-1/2 p-20 bg-gradient-to-br from-[#0a1f24] to-[#051014] relative">
        <div className="absolute top-12 left-12 text-sm font-semibold tracking-widest opacity-80">
          EcoWork
        </div>
        
        <div className="max-w-md">
          <div className="w-16 h-1 bg-[#7DE2EE] mb-8"></div>
          <h1 className="text-4xl font-light leading-tight">
            {step === 1 ? "Travaillez mieux." : "Sécurisez votre"} <br />
            <span className="font-semibold text-[#7DE2EE]">
                {step === 1 ? "Impactez moins." : "espace personnel."}
            </span>
          </h1>
        </div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-cyan-900/10 blur-[120px] rounded-full"></div>
      </div>


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
            <div className={`h-[2px] w-1/2 ${step >= 1 ? 'bg-[#7DE2EE]' : 'bg-gray-600'}`}></div>
            <div className={`h-[2px] w-1/2 ${step === 2 ? 'bg-[#7DE2EE]' : 'bg-gray-600'}`}></div>
          </div>

          <form onSubmit={step === 1 ? (e) => { e.preventDefault(); setStep(2); } : handleSubmit} className="space-y-6">
            {step === 1 ? (
              <>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="block text-[10px] uppercase tracking-widest text-gray-400 mb-2">Nom</label>
                    <input required name="nom" value={formData.nom} onChange={handleChange} className="w-full bg-[#2a3f47] border-none rounded-sm p-3 focus:ring-1 focus:ring-[#7DE2EE] outline-none" />
                  </div>
                  <div className="flex-1">
                    <label className="block text-[10px] uppercase tracking-widest text-gray-400 mb-2">Prénom</label>
                    <input required name="prenom" value={formData.prenom} onChange={handleChange} className="w-full bg-[#2a3f47] border-none rounded-sm p-3 focus:ring-1 focus:ring-[#7DE2EE] outline-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-gray-400 mb-2">Email</label>
                  <input required name="email" type="email" value={formData.email} onChange={handleChange} className="w-full bg-[#2a3f47] border-none rounded-sm p-3 focus:ring-1 focus:ring-[#7DE2EE] outline-none" />
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-gray-400 mb-2">Téléphone</label>
                  <input required name="telephone" type="tel" value={formData.telephone} onChange={handleChange} className="w-full bg-[#2a3f47] border-none rounded-sm p-3 focus:ring-1 focus:ring-[#7DE2EE] outline-none" />
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-gray-400 mb-2">Adresse postale</label>
                  <input required name="adresse_postale" value={formData.adresse_postale} onChange={handleChange} className="w-full bg-[#2a3f47] border-none rounded-sm p-3 focus:ring-1 focus:ring-[#7DE2EE] outline-none" />
                </div>

                <button type="submit" className="w-full bg-[#7DE2EE] hover:bg-[#68cbd6] text-[#1a2e35] font-bold py-4 rounded-md transition-all flex items-center justify-center gap-2 mt-4">
                  Continuer <ArrowRight size={18} />
                </button>
              </>
            ) : (
              <>
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-gray-400 mb-4">Définissez votre Code PIN (6 chiffres)</label>
                  <div className="flex justify-between gap-2">
                    {formData.pin.map((digit, i) => (
                      <input
                        key={i}
                        id={`pin-${i}`}
                        type="text"
                        inputMode="numeric"
                        maxLength="1"
                        value={digit}
                        onKeyDown={(e) => handleKeyDown(i, e)}
                        onChange={(e) => handlePinChange(i, e.target.value)}
                        className="w-12 h-14 bg-[#2a3f47] text-center text-xl font-bold rounded-sm border-none outline-none focus:ring-2 focus:ring-[#7DE2EE]"
                      />
                    ))}
                  </div>
                </div>

                <button type="submit" disabled={loading} className="w-full bg-[#7DE2EE] hover:bg-[#68cbd6] text-[#1a2e35] font-bold py-4 rounded-md transition-all flex items-center justify-center gap-2 mt-8">
                  {loading ? <Loader2 className="animate-spin" /> : "Créer mon compte"} <Check size={18} />
                </button>
              </>
            )}
          </form>

          <p className="text-center mt-6 text-xs text-gray-400">
            Déjà un compte ? <span className="text-[#7DE2EE] cursor-pointer hover:underline">Se connecter</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Inscription;