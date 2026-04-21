import React, { useState, useEffect, useCallback } from 'react'
import ReactGA from 'react-ga4'
import { generateSingle, handleSaveSingle, generate4x6, handleSave4x6 } from '../../utils/SaveImage'

const SaveModal = ({
  editorProps,
  photoProps,
  uiProps
}) => {
  const { exportPhoto } = editorProps;

  const {
    croppedImage
  } = photoProps;

  const {
    translate,
    modals,
    setModals
  } = uiProps;

  const [image4x6Src, setImage4x6Src] = useState(null);
  const [imageSingleSrc, setImageSingleSrc] = useState(null);
  const [isSaveLoading, setIsSaveLoading] = useState(false);
  const [, setLoadCounter] = useState(0);

  const initiateLoading = () => {
    setIsSaveLoading(true)
    setLoadCounter(2)
  }

  const decrementLoadCounter = () => {
    setLoadCounter(prevCount => {
      const newCount = prevCount - 1
      if (newCount === 0) {
        setIsSaveLoading(false)
      }
      return newCount
    })
  }

  const handleSave = useCallback(async () => {
    if (!croppedImage) {
      setIsSaveLoading(false)
      return
    }

    initiateLoading()

    try {
      const single = await generateSingle(croppedImage, exportPhoto)
      setImageSingleSrc(single)
      decrementLoadCounter()

      const fourBySix = await generate4x6(croppedImage, exportPhoto)
      setImage4x6Src(fourBySix)
      decrementLoadCounter()

      ReactGA.event({
        action: 'save_photo',
        category: 'Button Click',
        label: 'Save Photo',
      })
    } catch (error) {
      console.error('Error generating images:', error)
      setIsSaveLoading(false)
    }
  }, [croppedImage, exportPhoto])

  useEffect(() => {
    if (modals.save) {
      handleSave()
    }
  }, [modals.save, handleSave])

  return modals.save ? (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-surface-container-lowest rounded-2xl p-6 md:p-8 shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200">
        <div className="flex items-center gap-3 mb-6">
          <span className="material-symbols-outlined text-primary text-3xl">download</span>
          <h2 className="text-2xl font-extrabold text-on-surface font-headline">{translate("saveTitle")}</h2>
        </div>

        {isSaveLoading ? (
          <div className="flex flex-col items-center justify-center py-12 gap-4">
            <div className="w-10 h-10 border-4 border-surface-container-highest border-t-primary rounded-full animate-spin"></div>
            <p className="text-on-surface-variant font-bold animate-pulse">{translate("saveGenerating")}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="flex flex-col items-center bg-surface-container-low p-6 rounded-xl border-2 border-transparent hover:border-primary/20 transition-colors">
              <div className="aspect-[3/4] bg-surface-container-lowest rounded-lg p-2 shadow-sm mb-4 w-full max-w-[200px] flex items-center justify-center">
                <img src={imageSingleSrc} alt="Single" className="max-w-full max-h-full object-contain rounded" />
              </div>
              <p className="text-sm text-center text-on-surface-variant mb-6 h-10">{translate("saveSingleText")}</p>
              <button
                className="w-full py-3 px-4 rounded-xl font-bold bg-white border-2 border-primary text-primary hover:bg-primary/5 active:scale-95 transition-all flex items-center justify-center gap-2"
                onClick={() => handleSaveSingle(imageSingleSrc)}
              >
                <span className="material-symbols-outlined text-[20px]">description</span>
                {translate("saveSingle")}
              </button>
            </div>
            
            <div className="flex flex-col items-center bg-surface-container-low p-6 rounded-xl border-2 border-transparent hover:border-primary/20 transition-colors">
              <div className="aspect-[3/2] bg-surface-container-lowest rounded-lg p-2 shadow-sm mb-4 w-full flex items-center justify-center">
                <img src={image4x6Src} alt="4x6" className="max-w-full max-h-full object-contain rounded" />
              </div>
              <p className="text-sm text-center text-on-surface-variant mb-6 h-10">{translate("save4x6Text")}</p>
              <button
                className="w-full py-3 px-4 rounded-xl font-bold bg-gradient-to-r from-primary to-primary-container text-white shadow-md hover:shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2"
                onClick={() => handleSave4x6(image4x6Src)}
              >
                <span className="material-symbols-outlined text-[20px]">print</span>
                {translate("save4x6")}
              </button>
            </div>
          </div>
        )}

        <div className="flex justify-end pt-4 border-t border-surface-container">
          <button 
            className="px-6 py-2.5 rounded-xl font-bold text-on-surface-variant hover:bg-surface-container-low transition-colors"
            onClick={() => setModals((prevModals) => ({ ...prevModals, save: false }))}
          >
            {translate("noButton") || "Close"}
          </button>
        </div>
      </div>
    </div>
  ) : null
}

export default SaveModal
