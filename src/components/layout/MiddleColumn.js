import React, { useState } from 'react'
import AvatarEditor from 'react-avatar-editor'
import GuideDrawer from '../GuideDrawer'
import { MIN_ZOOM, MAX_ZOOM, ROTATION_THRESHOLD_DEG } from '../../constants'
import { ZOOM_FACTOR } from '../../constants'

const MiddleColumn = ({ 
  editorProps, 
  photoProps, 
  controlProps, 
  uiProps 
}) => {
  const { 
    editorRef,
    editorDimensions,
    photoGuides,
    updatePreview,
    setCroppedImage
  } = editorProps;

  const {
    photo,
    zoom,
    setZoom,
    rotation,
    setRotation,
    position,
    setPosition,
    initialDistance,
    setInitialDistance,
    initialAngle,
    setInitialAngle
  } = photoProps;

  const {
    options,
    color,
    setColor,
    removeBg,
    setRemoveBg,
    loadingModel,
    allowAiModel
  } = controlProps;

  const {
    translate,
    setModals
  } = uiProps;

  const [activeTab, setActiveTab] = useState('transform');

  const handleTouchStart = (e) => {
    if (e.touches.length === 2) {
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      const dx = touch2.clientX - touch1.clientX;
      const dy = touch2.clientY - touch1.clientY;
      setInitialDistance(Math.sqrt(dx * dx + dy * dy));
      setInitialAngle(Math.atan2(dy, dx) * 180 / Math.PI);
    }
  };

  const handleTouchMove = (e) => {
    if (e.touches.length === 2) {
      const touch1 = e.touches[0]
      const touch2 = e.touches[1]
      const dx = touch2.clientX - touch1.clientX
      const dy = touch2.clientY - touch1.clientY
      const currentDistance = Math.sqrt(dx * dx + dy * dy)
      const currentAngle = Math.atan2(dy, dx) * 180 / Math.PI
      
      if (initialDistance) {
        const scale = currentDistance / initialDistance
        setZoom(prevZoom => {
          const newZoom = prevZoom * scale
          return Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, newZoom))
        })
      }
      
      if (initialAngle !== null) {
        const angleDiff = currentAngle - initialAngle
        if (Math.abs(angleDiff) > ROTATION_THRESHOLD_DEG) {
          setRotation(prevRotation => prevRotation + angleDiff)
          setInitialAngle(currentAngle)
        }
      }
      
      setInitialDistance(currentDistance)
    }
  };

  const handleTouchEnd = () => {
    setInitialDistance(null);
    setInitialAngle(null);
  };

  const handleWheel = (e) => {
    e.preventDefault();
    const scale = e.deltaY > 0 ? 1 / ZOOM_FACTOR : ZOOM_FACTOR;
    setZoom(prevZoom => {
      const newZoom = prevZoom * scale;
      return Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, newZoom));
    });
  };

  const handlePositionChange = (position) => {
    setPosition(position);
  };

  const handleColorChange = (type, value) => {
    setColor(prev => ({
      ...prev,
      [type]: value
    }));
  };

  return (
    <section className="w-full md:w-[calc(50%-1rem)] lg:w-1/3 bg-surface-container-lowest rounded-xl p-8 shadow-[0_40px_60px_-15px_rgba(22,29,28,0.04)]">
      <div className="flex items-center gap-2 mb-6">
        <span className="material-symbols-outlined text-primary-container">edit_square</span>
        <h2 className="text-xl font-extrabold text-on-surface font-headline tracking-tight">{translate("controlTab1") || "Edit Photo"}</h2>
      </div>

      {photo && (
        <>
          <div 
            className="relative bg-surface-container-low rounded-lg overflow-hidden mb-8 flex items-center justify-center mx-auto" 
            style={{ 
              width: editorDimensions.width * editorDimensions.zoom, 
              height: editorDimensions.height * editorDimensions.zoom 
            }}
          >
            <div
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              onWheel={handleWheel}
              style={{
                touchAction: 'none',
                position: 'absolute',
                top: 0,
                left: 0,
                width: editorDimensions.width,
                height: editorDimensions.height,
                transform: `scale(${editorDimensions.zoom})`,
                transformOrigin: 'top left',
              }}
            >
              <AvatarEditor
                ref={editorRef}
                image={photo}
                width={editorDimensions.width}
                height={editorDimensions.height}
                border={0}
                scale={zoom}
                rotate={rotation}
                position={position}
                onPositionChange={handlePositionChange}
                onImageReady={() => updatePreview(editorRef, setCroppedImage)}
                onImageChange={() => updatePreview(editorRef, setCroppedImage)}
                disableBoundaryChecks={true}
                style={{ touchAction: 'none', display: 'block' }}
              />
              {options.guide && <GuideDrawer template={photoGuides} editorDimensions={editorDimensions} />}
            </div>
            
            <div className="absolute bottom-4 right-4 flex gap-2">
              <button 
                onClick={() => setRotation(r => r - 90)}
                className="w-10 h-10 bg-surface-container-lowest/90 backdrop-blur rounded-full flex items-center justify-center shadow-sm text-on-surface active:scale-90 transition-transform"
              >
                <span className="material-symbols-outlined text-[20px]">rotate_left</span>
              </button>
              <button 
                onClick={() => setRotation(r => r + 90)}
                className="w-10 h-10 bg-surface-container-lowest/90 backdrop-blur rounded-full flex items-center justify-center shadow-sm text-on-surface active:scale-90 transition-transform"
              >
                <span className="material-symbols-outlined text-[20px]">rotate_right</span>
              </button>
            </div>
          </div>

          <div className="flex border-b border-surface-container mb-6">
            <button
              className={`flex-1 py-2 text-sm font-bold text-center border-b-2 transition-colors ${activeTab === 'transform' ? 'border-primary text-primary' : 'border-transparent text-on-surface-variant hover:text-on-surface'}`}
              onClick={() => setActiveTab('transform')}
            >
              {translate("controlTab1")}
            </button>
            <button
              className={`flex-1 py-2 text-sm font-bold text-center border-b-2 transition-colors ${activeTab === 'color' ? 'border-primary text-primary' : 'border-transparent text-on-surface-variant hover:text-on-surface'}`}
              onClick={() => setActiveTab('color')}
            >
              {translate("controlTab2")}
            </button>
          </div>

          {activeTab === 'transform' ? (
            <div className="space-y-6">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-bold text-on-surface">{translate("zoomLabel")}</label>
                  <span className="text-xs font-bold text-primary">{zoom.toFixed(1)}x</span>
                </div>
                <input
                  type="range"
                  min={MIN_ZOOM}
                  max={MAX_ZOOM}
                  step={0.1}
                  value={zoom}
                  onChange={(e) => setZoom(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-surface-container-highest rounded-full appearance-none cursor-pointer accent-primary"
                />
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-bold text-on-surface">{translate("rotateLabel")}</label>
                  <span className="text-xs font-bold text-primary">{Math.round(rotation)}°</span>
                </div>
                <input
                  type="range"
                  min={-180}
                  max={180}
                  step={1}
                  value={rotation}
                  onChange={(e) => setRotation(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-surface-container-highest rounded-full appearance-none cursor-pointer accent-primary"
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-surface-container-low rounded-xl">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-primary">auto_fix_high</span>
                  <div>
                    <p className="text-sm font-bold text-on-surface">{translate("removeBgLabel")}</p>
                    <p className="text-[10px] text-on-surface-variant">AI-powered white background</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={removeBg.state && allowAiModel}
                    onChange={() => {
                      if (!allowAiModel) {
                        setModals(prev => ({ ...prev, aiModel: true }));
                      } else {
                        setRemoveBg(prev => ({ ...prev, state: !prev.state }));
                      }
                    }}
                  />
                  <div className="w-11 h-6 bg-surface-container-highest rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-container"></div>
                </label>
              </div>
              
              {loadingModel && <div className="text-sm font-medium text-primary animate-pulse">{translate("backgroundRemovalProcessing")}</div>}
              {!loadingModel && removeBg.error && (
                <div className="text-sm font-medium text-error">
                  {translate("backgroundRemovalError")}
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              {[
                { label: "brightness", val: color.brightness, min: -100, max: 100 },
                { label: "contrast", val: color.contrast, min: -100, max: 100 },
                { label: "saturation", val: color.saturation, min: -100, max: 100 },
                { label: "warmth", val: color.warmth, min: -100, max: 100 }
              ].map(c => (
                <div key={c.label} className="space-y-3">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-bold text-on-surface">{translate(c.label)}</label>
                    <span className="text-xs font-bold text-primary">{c.val}</span>
                  </div>
                  <input
                    type="range"
                    min={c.min}
                    max={c.max}
                    value={c.val}
                    onChange={(e) => handleColorChange(c.label, parseInt(e.target.value))}
                    className="w-full h-1.5 bg-surface-container-highest rounded-full appearance-none cursor-pointer accent-primary"
                  />
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </section>
  );
};

export default MiddleColumn;
