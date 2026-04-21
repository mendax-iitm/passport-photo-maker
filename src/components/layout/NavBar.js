import React from 'react'
import ReactGA from 'react-ga4'
import { MM2INCH, MAX_EDITOR_WIDTH, MAX_EDITOR_HEIGHT } from '../../constants'
import { TEMPLATES } from '../../templates'

const NavBar = ({
  templateProps,
  editorProps,
  uiProps
}) => {
  const {
    template,
    setTemplate,
    setExportPhoto
  } = templateProps

  const {
    editorRef,
    setEditorDimensions,
    setCroppedImage,
    updatePreview
  } = editorProps

  const {
    getLanguage,
    setLanguage
  } = uiProps

  const handleTemplateChange = (event) => {
    const selectedTemplate = TEMPLATES.find(t => t.title[getLanguage()] === event.target.value)
    if (!selectedTemplate) return;
    
    setTemplate(selectedTemplate)
    
    // Calculate dimensions once to ensure consistency
    const width = parseInt(parseInt(selectedTemplate.width) / MM2INCH * parseInt(selectedTemplate.dpi))
    const height = parseInt(parseInt(selectedTemplate.height) / MM2INCH * parseInt(selectedTemplate.dpi))
    const zoom = Math.min(MAX_EDITOR_WIDTH / width, MAX_EDITOR_HEIGHT / height)
    
    setExportPhoto({
      width,
      height,
      size: parseInt(selectedTemplate.size),
      ratio: parseInt(selectedTemplate.width) / parseInt(selectedTemplate.height),
      width_mm: selectedTemplate.width,
      height_mm: selectedTemplate.height,
      dpi: selectedTemplate.dpi,
      width_valid: true,
      height_valid: true,
      size_valid: true,
    })

    setEditorDimensions({
      width,
      height,
      zoom,
      dpi_ratio: selectedTemplate.dpi / (MM2INCH * 10)
    })

    // Ensure the preview updates with new dimensions
    setTimeout(() => updatePreview(editorRef, setCroppedImage), 100)

    ReactGA.event({
      action: 'change_template',
      category: 'Dropdown',
      label: 'Change template',
    })
  }

  const handleLanguageChange = (event) => {
    setLanguage(event.target.value)
    ReactGA.event({
      action: 'change_language',
      category: 'Dropdown',
      label: 'Change language',
    })
  }

  return (
    <nav className="bg-[#f4fbf9]/70 backdrop-blur-[24px] w-full top-0 sticky z-50 shadow-[0_40px_60px_-15px_rgba(22,29,28,0.04)]">
      <div className="flex flex-col md:flex-row justify-between items-center w-full px-6 py-4 max-w-[1400px] mx-auto gap-4 md:gap-0">
        <div className="flex items-center gap-3">
          <img src={process.env.PUBLIC_URL + '/images/logo.svg'} alt="Crafted Visa Logo" className="h-12 w-auto text-primary drop-shadow-sm" />
          <h1 className="text-2xl font-extrabold text-[#161d1c] font-headline tracking-[-0.02em]">Crafted Visa</h1>
        </div>
        <div className="flex items-center gap-2 md:gap-4">
          <select
            className="form-select bg-surface-container-low border-none rounded-lg py-2 pl-3 pr-8 text-sm font-bold text-on-surface focus:ring-2 focus:ring-primary-container/20"
            value={template.title[getLanguage()]}
            onChange={handleTemplateChange}
          >
            {TEMPLATES.map((template, index) => (
              <option key={index} value={template.title[getLanguage()]}>
                {template.title[getLanguage()]}
              </option>
            ))}
          </select>
          <select
            className="form-select bg-surface-container-low border-none rounded-lg py-2 pl-3 pr-8 text-sm font-bold text-on-surface focus:ring-2 focus:ring-primary-container/20"
            value={getLanguage()}
            onChange={handleLanguageChange}
          >
            <option value="en">English</option>
            <option value="hi">हिन्दी</option>
          </select>
        </div>
      </div>
    </nav>
  )
}

export default NavBar
