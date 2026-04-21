import React from 'react'
import ReactGA from 'react-ga4'
import LoadPhotoButton from '../LoadPhotoButton'
import { EXPORT_WIDTH_LIMIT, EXPORT_HEIGHT_LIMIT } from '../../constants'
import { EXPORT_SIZE_LIMIT } from '../../constants'

const RightColumn = ({ editorProps, photoProps, exportProps, uiProps }) => {
  const { onPhotoLoad } = photoProps
  const { photo, croppedImage } = photoProps

  const {
    exportPhoto,
    setExportPhoto
  } = exportProps

  const {
    translate,
    setModals
  } = uiProps

  const handleWidthChange = (e) => {
    const newWidth = e.target.value
    if (newWidth > 0 && newWidth <= EXPORT_WIDTH_LIMIT && !isNaN(newWidth)) {
      const newHeight = Math.round(newWidth / exportPhoto.ratio)
      setExportPhoto((prevState) => ({
        ...prevState, 
        height: newHeight, 
        width: newWidth, 
        width_valid: true
      }))
    } else {
      setExportPhoto((prevState) => ({
        ...prevState, 
        width: newWidth, 
        width_valid: false
      }))
    }
    ReactGA.event({
      action: 'change_width',
      category: 'Export Area',
      label: 'Change width',
    })
  }

  const handleHeightChange = (e) => {
    const newHeight = e.target.value
    if (newHeight > 0 && newHeight <= EXPORT_HEIGHT_LIMIT && !isNaN(newHeight)) {
      const newWidth = Math.round(newHeight * exportPhoto.ratio)
      setExportPhoto((prevState) => ({
        ...prevState, 
        height: newHeight, 
        width: newWidth, 
        height_valid: true
      }))
    } else {
      setExportPhoto((prevState) => ({
        ...prevState, 
        height: newHeight, 
        height_valid: false
      }))
    }
    ReactGA.event({
      action: 'change_height',
      category: 'Export Area',
      label: 'Change height',
    })
  }

  const handleSizeChange = (e) => {
    const newSize = Number(e.target.value)
    if (newSize > 0 && newSize <= EXPORT_SIZE_LIMIT && !isNaN(newSize)) {
      setExportPhoto((prevState) => ({
        ...prevState, 
        size: newSize, 
        size_valid: true
      }))
    } else {
      setExportPhoto((prevState) => ({
        ...prevState, 
        size: newSize, 
        size_valid: false
      }))
    }
    ReactGA.event({
      action: 'change_size',
      category: 'Export Area',
      label: 'Change size',
    })
  }

  const isExportValid = exportPhoto.width_valid && exportPhoto.height_valid && exportPhoto.size_valid

  return (
    photo && (
      <section className="w-full md:w-[calc(50%-1rem)] lg:w-1/3 bg-surface-container-lowest rounded-xl p-8 shadow-[0_40px_60px_-15px_rgba(22,29,28,0.04)]">
        <div className="flex items-center gap-2 mb-6">
          <span className="material-symbols-outlined text-primary-container">preview</span>
          <h2 className="text-xl font-extrabold text-on-surface font-headline tracking-tight">{translate("saveTitle") || "Final Result"}</h2>
        </div>

        {croppedImage && (
          <>
            <div className="aspect-[3/4] bg-[#f4fbf9] rounded-lg overflow-hidden border-2 border-primary-container/20 mb-8 max-w-[200px] mx-auto shadow-md">
              <img 
                src={croppedImage} 
                alt="Cropped preview" 
                className="w-full h-full object-cover" 
              />
            </div>

            <div className="space-y-4 mb-8">
              <div>
                <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1 block">{translate("widthLabel")} (px)</label>
                <input
                  type="number"
                  value={exportPhoto.width}
                  onChange={handleWidthChange}
                  className={`w-full bg-surface-container-low rounded-lg px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-primary-container/30 transition-shadow ${exportPhoto.width_valid ? 'border-none text-on-surface' : 'border-2 border-error text-error'}`}
                />
              </div>
              <div>
                <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1 block">{translate("heightLabel")} (px)</label>
                <input
                  type="number"
                  value={exportPhoto.height}
                  onChange={handleHeightChange}
                  className={`w-full bg-surface-container-low rounded-lg px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-primary-container/30 transition-shadow ${exportPhoto.height_valid ? 'border-none text-on-surface' : 'border-2 border-error text-error'}`}
                />
              </div>
              <div>
                <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1 block">{translate("sizeLabel")} (KB)</label>
                <input
                  type="number"
                  value={exportPhoto.size}
                  onChange={handleSizeChange}
                  className={`w-full bg-surface-container-low rounded-lg px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-primary-container/30 transition-shadow ${exportPhoto.size_valid ? 'border-none text-on-surface' : 'border-2 border-error text-error'}`}
                />
              </div>
            </div>

            <button
              type="button"
              disabled={!isExportValid}
              onClick={() => {
                if (!isExportValid) return
                setModals((prevModals) => ({ ...prevModals, save: true }))
                ReactGA.event({
                  action: 'generate_photo',
                  category: 'Button Click',
                  label: 'Generate photo',
                })
              }}
              className={`w-full py-4 px-6 rounded-xl font-bold flex items-center justify-center gap-2 transition-transform shadow-[0_8px_16px_-4px_rgba(245,130,32,0.3)] ${isExportValid ? 'bg-gradient-to-r from-primary to-primary-container text-white active:scale-95 hover:shadow-[0_12px_20px_-4px_rgba(245,130,32,0.4)]' : 'bg-surface-container-high text-on-surface-variant cursor-not-allowed'}`}
            >
              <span className="material-symbols-outlined">download</span>
              {translate("saveTitle")}
            </button>

            <div className="mt-6">
              <LoadPhotoButton onPhotoLoad={onPhotoLoad} title={translate("loadNewPhotoButton")} />
            </div>
          </>
        )}
      </section>
    )
  )
}

export default RightColumn
