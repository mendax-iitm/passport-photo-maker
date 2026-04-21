import React from 'react'

const Disclaimer = ({
  uiProps
}) => {
  const {
    translate,
    modals,
    setModals
  } = uiProps;

  const handleAgree = () => {
    localStorage.setItem('policyAgreed', 'true');
    setModals((prevModals) => ({ ...prevModals, disclaimer: false }));
  };

  return modals.disclaimer ? (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-surface-container-lowest rounded-2xl p-6 md:p-8 shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200">
        <div className="flex items-center gap-3 mb-4">
          <span className="material-symbols-outlined text-primary text-3xl">policy</span>
          <h2 className="text-xl font-extrabold text-on-surface font-headline">{translate("disclaimerModalTitle")}</h2>
        </div>
        
        <div className="space-y-4 mb-8">
          <div>
            <h4 className="font-bold text-on-surface mb-1">{translate("disclaimerTitle")}</h4>
            <p className="text-sm text-on-surface-variant leading-relaxed">{translate("disclaimer")}</p>
          </div>
          <div>
            <h4 className="font-bold text-on-surface mb-1">{translate("datePrivacyTitle")}</h4>
            <p className="text-sm text-on-surface-variant leading-relaxed">{translate("disclaimer2")}</p>
            <p className="text-sm text-on-surface-variant leading-relaxed mt-2">{translate("disclaimer3")}</p>
          </div>
        </div>

        <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-4 border-t border-surface-container">
          <button 
            className="w-full sm:w-auto px-6 py-3 rounded-xl font-bold text-on-surface-variant hover:bg-surface-container-low transition-colors"
            onClick={() => { window.location.href = 'https://www.google.com' }}
          >
            {translate("disagreeButton") || "Disagree"}
          </button>
          <button 
            className="w-full sm:w-auto px-6 py-3 rounded-xl font-bold bg-primary text-white hover:opacity-90 transition-opacity shadow-md"
            onClick={handleAgree}
          >
            {translate("agreeButton") || "Agree"}
          </button>
        </div>
      </div>
    </div>
  ) : null;
}

export default Disclaimer