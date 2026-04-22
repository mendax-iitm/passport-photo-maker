import React, { useState, useCallback, useEffect, useRef } from 'react'
import { removeBackground as imglyRemoveBackground } from "@imgly/background-removal"
import ReactGA from 'react-ga4'
import { useLanguage } from './hooks/useLanguage'  // Update path
import { NavBar, LeftColumn, MiddleColumn, RightColumn } from './components/layout'
import { SaveModal, Disclaimer, AiModelModal } from './components/modals'
import Color from './utils/Color'
import { TEMPLATES } from './templates'
import './App.css'

// Keep the proper imports from constants.js
import {
  INITIAL_ZOOM,
  INITIAL_ROTATION,
  MAX_EDITOR_WIDTH,
  MAX_EDITOR_HEIGHT,
  MM2INCH
} from './constants'

// Main App component
const App = () => {
  // First, declare all state variables
  const [template, setTemplate] = useState(TEMPLATES[0])
  const [photo, setPhoto] = useState(null)
  const [allowAiModel, setAllowAiModel] = useState(false)
  const [removeBg, setRemoveBg] = useState({ state: false, error: false, hd: false })
  const [loadingModel, setLoadingModel] = useState(false)
  const [originalPhoto, setOriginalPhoto] = useState(null)
  const [processedPhoto, setProcessedPhoto] = useState(null)
  const [adjustedPhoto, setAdjustedPhoto] = useState(null)
  const [zoom, setZoom] = useState(INITIAL_ZOOM)
  const [rotation, setRotation] = useState(INITIAL_ROTATION)
  const [options, setOptions] = useState({
    guide: true,
    instruction: true,
    example: false,
  })
  const [croppedImage, setCroppedImage] = useState(null)
  const [exportPhoto, setExportPhoto] = useState({
    width: parseInt(parseInt(template.width) / MM2INCH * parseInt(template.dpi)),
    height: parseInt(parseInt(template.height) / MM2INCH * parseInt(template.dpi)),
    size: parseInt(template.size),
    ratio: parseInt(template.width) / parseInt(template.height),
    width_mm: template.width,
    height_mm: template.height,
    dpi: template.dpi,
    width_valid: true,
    height_valid: true,
    size_valid: true,
  })
  const [modals, setModals] = useState({ save: false, disclaimer: !localStorage.getItem('policyAgreed'), aiModel: false })
  const [editorDimensions, setEditorDimensions] = useState({
    width: parseInt(template.width) / MM2INCH * parseInt(template.dpi),
    height: parseInt(template.height) / MM2INCH * parseInt(template.dpi),
    zoom: Math.min(MAX_EDITOR_WIDTH / (parseInt(template.width) / MM2INCH * parseInt(template.dpi)),
                  MAX_EDITOR_HEIGHT / (parseInt(template.height) / MM2INCH * parseInt(template.dpi))),
    dpi_ratio: template.dpi / (MM2INCH * 10)
  })
  const [initialDistance, setInitialDistance] = useState(null)
  const [initialAngle, setInitialAngle] = useState(null)
  const [color, setColor] = useState({
    brightness: 0,
    saturation: 0,
    warmth: 0,
    contrast: 0,
  })
  const [position, setPosition] = useState({ x: 0.5, y: 0.5 })
  
  // Then declare refs and hooks
  const editorRef = useRef(null)
  const { translate, translateObject, setLanguage, getLanguage } = useLanguage()
  
  // Init Google Analytics
  useEffect(() => {
    ReactGA.initialize('G-V3MNPTJ8CY')
    ReactGA.send({ hitType: "pageview", page: window.location.pathname })
  }, [])

  // Define handlePhotoLoad before it's used in photoProps
  const handlePhotoLoad = useCallback(async (photoData) => {
    setOriginalPhoto(photoData)
    setProcessedPhoto(null)
    setAdjustedPhoto(null)
    setPhoto(photoData)
    setRemoveBg({ state: false, error: false })
    setZoom(INITIAL_ZOOM)
    setRotation(INITIAL_ROTATION)
    setModals((prevModals) => ({ ...prevModals, disclaimer: true }))
    setColor({
      brightness: 0,
      saturation: 0,
      warmth: 0,
      contrast: 0,
    })
  }, [])

  // Then define photoProps
  const photoProps = {
    photo,
    setPhoto,
    zoom,
    setZoom,
    rotation,
    setRotation,
    position,
    setPosition,
    initialDistance,
    setInitialDistance,
    initialAngle,
    setInitialAngle,
    processedPhoto,
    croppedImage,
    onPhotoLoad: handlePhotoLoad
  }

  // Function to update the preview
  const updatePreview = (editorRef, setCroppedImage) => {
    if (editorRef.current) {
      const canvas = editorRef.current.getImageScaledToCanvas()
      canvas.style.touchAction = 'none'
      setCroppedImage(canvas.toDataURL())
    }
  }

  const processPhotoForBgRemoval = useCallback(async (photoData, useHD) => {
    setLoadingModel(true)
    try {
      const resultBlob = await imglyRemoveBackground(photoData, {
        debug: true,
        model: useHD ? 'isnet' : 'small',
        device: 'cpu',
        proxyToWorker: false
      })
      const url = URL.createObjectURL(resultBlob)
      setProcessedPhoto(url)
      setRemoveBg((prevState) => ({ ...prevState, error: false, errorMsg: '', reprocess: false, triggerProcess: false }))
    } catch (error) {
      console.error('Background removal error:', error)
      setRemoveBg((prevState) => ({ ...prevState, error: true, errorMsg: error.message || String(error), reprocess: false, triggerProcess: false }))
    } finally {
      setLoadingModel(false)
    }
  }, [])

  const handleOptionChange = (event) => {
    const { name, checked } = event.target
    setOptions((prevOptions) => ({
      ...prevOptions,
      [name]: checked,
    }))
  }

  // Move editorProps definition after all useState declarations
  const editorProps = {
    editorRef,
    editorDimensions,
    setEditorDimensions,
    photoGuides: template,
    updatePreview,
    setCroppedImage,
    exportPhoto
  }

  const controlProps = {
    options,
    onOptionChange: handleOptionChange,
    color,
    setColor,
    removeBg,
    setRemoveBg,
    loadingModel,
    allowAiModel,
    setAllowAiModel
  }

  const uiProps = {
    translate,
    translateObject,
    modals,
    setModals,
    getLanguage,
    setLanguage
  }

  const templateProps = {
    template,
    setTemplate,
    exportPhoto,
    setExportPhoto
  }

  useEffect(() => {
    const adjustImageAndSetPhoto = () => {
      const image = new Image()
      image.onload = () => {
        const canvas = document.createElement('canvas')
        canvas.width = image.width
        canvas.height = image.height
        const ctx = canvas.getContext('2d')
        ctx.drawImage(image, 0, 0)

        // Apply color adjustments here
        Color(canvas, color)

        const newImageUrl = canvas.toDataURL()
        setAdjustedPhoto(newImageUrl)
      }
      image.src = removeBg.state && processedPhoto ? processedPhoto : originalPhoto
    }
    adjustImageAndSetPhoto()
  }, [color, removeBg.state, processedPhoto, originalPhoto])

  // Update the photo state when removeBg changes
  useEffect(() => {
    if (adjustedPhoto) {
      setPhoto(adjustedPhoto)
      setTimeout(() => updatePreview(editorRef, setCroppedImage), 100) // Update preview immediately after setting photo
    }
    else if (removeBg.state && processedPhoto) {
      setPhoto(processedPhoto)
      setTimeout(() => updatePreview(editorRef, setCroppedImage), 100) // Update preview immediately after setting photo
    }
    else {
      setPhoto(originalPhoto)
      setTimeout(() => updatePreview(editorRef, setCroppedImage), 100) // Update preview immediately after setting photo
    }
  }, [originalPhoto, processedPhoto, adjustedPhoto, removeBg.state])

  useEffect(() => {
    if (removeBg.triggerProcess && originalPhoto && allowAiModel) {
      processPhotoForBgRemoval(originalPhoto, removeBg.hd)
    }
  }, [removeBg.triggerProcess, removeBg.hd, originalPhoto, processPhotoForBgRemoval, allowAiModel])

  return (
    <div className="app">
      <NavBar
        templateProps={templateProps}
        editorProps={editorProps}
        uiProps={uiProps}
      />
      
      <main className="max-w-[1400px] mx-auto px-4 py-8 flex flex-col md:flex-row md:flex-wrap lg:flex-nowrap gap-8 justify-center items-start">
        <LeftColumn
          photoProps={photoProps}
          optionsProps={{ options, onOptionChange: handleOptionChange }}
          editorProps={editorProps}
          uiProps={uiProps}
        />
        <MiddleColumn
          editorProps={editorProps}
          photoProps={photoProps}
          controlProps={controlProps}
          uiProps={uiProps}
        />
        <RightColumn
          editorProps={editorProps}
          photoProps={{
            ...photoProps,
            onPhotoLoad: handlePhotoLoad  // Ensure onPhotoLoad is included
          }}
          exportProps={{ exportPhoto, setExportPhoto }}
          uiProps={uiProps}
        />
      </main>

      <footer className="bg-[#eef5f3] dark:bg-slate-900 flex flex-col md:flex-row justify-between items-center px-8 py-12 mt-20 gap-8">
        <div className="flex flex-col items-center md:items-start gap-4">
          <h3 className="text-lg font-bold text-[#161d1c] dark:text-white font-headline">Crafted Visa</h3>
          <p className="font-body text-sm leading-relaxed text-[#564336] dark:text-slate-500 max-w-xs text-center md:text-left">© 2024 Crafted Visa. Your Next Adventure Awaits.</p>
        </div>
        <div className="flex flex-col items-center md:items-end gap-2 text-sm text-[#564336] dark:text-slate-500">
          <p>For feedback, email <a href="mailto:craftedavays@gmail.com" className="font-medium hover:text-[#f58220] underline decoration-[#f58220]/30 underline-offset-4 transition-opacity opacity-80 hover:opacity-100">craftedavays@gmail.com</a></p>
          <p>Privacy: All processing happens locally. We do not store your photos.</p>
        </div>
      </footer>

      <SaveModal
        editorProps={editorProps}
        photoProps={photoProps}
        uiProps={uiProps}
      />
      <AiModelModal
        controlProps={controlProps}
        uiProps={uiProps}
      />
      <Disclaimer uiProps={uiProps} />

    </div>
  )
}

export default App
