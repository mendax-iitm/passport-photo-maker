import React from 'react'

const AiModelModal = ({ controlProps, uiProps }) => {
  const {
    setRemoveBg,
    setAllowAiModel
  } = controlProps

  const {
    translate,
    modals,
    setModals
  } = uiProps

  const closeModal = () => {
    setModals((prevModals) => ({ ...prevModals, aiModel: false }))
  }

  const handleConfirm = () => {
    setAllowAiModel(true)
    setRemoveBg((prevState) => ({ ...prevState, state: true, triggerProcess: true }))
    closeModal()
  }

  return modals.aiModel ? (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-surface-container-lowest rounded-2xl p-6 md:p-8 shadow-2xl max-w-md w-full animate-in zoom-in-95 duration-200">
        <div className="flex items-center gap-3 mb-4">
          <span className="material-symbols-outlined text-primary text-3xl">cloud_download</span>
          <h4 className="text-xl font-extrabold text-on-surface font-headline">{translate("aiConfirmTitle")}</h4>
        </div>
        <p className="text-sm text-on-surface-variant leading-relaxed mb-8">{translate("aiConfirmText")}</p>
        <div className="flex flex-col-reverse sm:flex-row justify-end gap-3">
          <button 
            onClick={closeModal}
            className="w-full sm:w-auto px-6 py-3 rounded-xl font-bold text-on-surface-variant hover:bg-surface-container-low transition-colors"
          >
            {translate("noButton")}
          </button>
          <button 
            onClick={handleConfirm}
            className="w-full sm:w-auto px-6 py-3 rounded-xl font-bold bg-primary text-white hover:opacity-90 transition-opacity shadow-md flex justify-center items-center gap-2"
          >
            {translate("yesButton")}
          </button>
        </div>
      </div>
    </div>
  ) : null
}

export default AiModelModal
