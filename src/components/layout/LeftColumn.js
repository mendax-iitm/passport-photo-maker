import React from 'react'
import LoadPhotoButton from '../LoadPhotoButton'

const LeftColumn = ({
  photoProps,
  optionsProps,
  editorProps,
  uiProps
}) => {
  const {
    photo,
    croppedImage,
    onPhotoLoad
  } = photoProps

  const {
    options,
    onOptionChange
  } = optionsProps

  const {
    photoGuides
  } = editorProps

  const {
    translate,
    translateObject
  } = uiProps

  return (
    <section className="w-full md:w-[calc(50%-1rem)] lg:w-1/3 bg-surface-container-lowest rounded-xl p-8 shadow-[0_40px_60px_-15px_rgba(22,29,28,0.04)]">
      <div className="flex items-center gap-2 mb-6">
        <span className="material-symbols-outlined text-primary-container">fact_check</span>
        <h2 className="text-xl font-extrabold text-on-surface font-headline tracking-tight">{translate("guideTitle") || "Guidelines"}</h2>
      </div>

      {!photo && (
        <>
          <ul className="space-y-4 mb-8">
            <li className="flex items-start gap-3">
              <span className="material-symbols-outlined text-primary text-lg mt-0.5">check_circle</span>
              <p className="text-sm font-medium text-on-surface-variant">Face camera directly with full head visible</p>
            </li>
            <li className="flex items-start gap-3">
              <span className="material-symbols-outlined text-primary text-lg mt-0.5">check_circle</span>
              <p className="text-sm font-medium text-on-surface-variant">Maintain a neutral facial expression</p>
            </li>
            <li className="flex items-start gap-3">
              <span className="material-symbols-outlined text-primary text-lg mt-0.5">check_circle</span>
              <p className="text-sm font-medium text-on-surface-variant">Ensure eyes are open and clearly visible</p>
            </li>
            <li className="flex items-start gap-3">
              <span className="material-symbols-outlined text-primary text-lg mt-0.5">check_circle</span>
              <p className="text-sm font-medium text-on-surface-variant">Use even lighting to avoid shadows on face</p>
            </li>
          </ul>
          <LoadPhotoButton onPhotoLoad={onPhotoLoad} title={translate("selectPhotoButton")} />
        </>
      )}

      {photo && !croppedImage && (
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 text-sm font-bold text-on-surface cursor-pointer">
              <input
                type="checkbox"
                name="guide"
                checked={options.guide}
                onChange={onOptionChange}
                className="rounded border-outline-variant text-primary focus:ring-primary"
              />
              {translate("guideLabel")}
            </label>
            <label className="flex items-center gap-2 text-sm font-bold text-on-surface cursor-pointer">
              <input
                type="checkbox"
                name="instruction"
                checked={options.instruction}
                onChange={onOptionChange}
                className="rounded border-outline-variant text-primary focus:ring-primary"
              />
              {translate("instructionLabel")}
            </label>
          </div>
          
          <div className="p-4 bg-surface-container-low rounded-lg text-sm text-on-surface-variant font-medium">
            <p>{translateObject(photoGuides.instruction)}</p>
          </div>
          
          <div className="flex gap-4 p-4 bg-surface-container-low rounded-lg">
            <div className="flex-1">
              <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1">{translate("defaultWidth")}</p>
              <p className="text-lg font-extrabold text-primary">{photoGuides.width}mm</p>
            </div>
            <div className="flex-1">
              <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1">{translate("defaultHeight")}</p>
              <p className="text-lg font-extrabold text-primary">{photoGuides.height}mm</p>
            </div>
          </div>
        </div>
      )}

      {photoGuides && photoGuides.guide && options.guide && (
        <div className="mt-8 space-y-4">
          <h3 className="text-sm font-bold text-on-surface uppercase tracking-wider">Legend</h3>
          <ul className="space-y-3">
            {photoGuides.guide.map((g, i) => (
              <li key={i} className="flex items-start gap-3">
                <span
                  className="w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold shrink-0 mt-0.5"
                  style={{
                    backgroundColor: g.color,
                    color: g.color === 'yellow' || g.color === 'green' ? '#000' : '#fff'
                  }}
                >
                  {g.index}
                </span>
                <span className="text-sm font-medium text-on-surface-variant">
                  {translateObject(g.instruction)}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  )
}

export default LeftColumn
