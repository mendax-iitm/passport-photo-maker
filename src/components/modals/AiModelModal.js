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
    setRemoveBg((prevState) => ({ ...prevState, state: true }))
    closeModal()
  }

  return (
    <dialog open={modals.aiModel} className='modal'>
      <article>
        <h4>{translate("aiConfirmTitle")}</h4>
        <small>{translate("aiConfirmText")}</small>
        <footer>
          <button onClick={handleConfirm}>
            {translate("yesButton")}
          </button>
          <button onClick={closeModal}>
            {translate("noButton")}
          </button>
        </footer>
      </article>
    </dialog>
  )
}

export default AiModelModal
