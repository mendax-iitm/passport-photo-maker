import React, { useState, useEffect, useCallback } from 'react'

const GuideDrawer = ({ template, guides, editorDimensions }) => {
  const source = template || guides
  const guideList = Array.isArray(source) ? source : source?.guide

  const [offsets, setOffsets] = useState({})
  const [dragState, setDragState] = useState(null)

  // Reset offsets when template changes
  useEffect(() => {
    setOffsets({})
  }, [template])

  const handleMouseDown = (e, guide) => {
    if (!guide.isVerticalMovable && !guide.isHorizontalMovable) return
    
    e.preventDefault()
    e.stopPropagation()
    setDragState({
      group: guide.group,
      startX: e.clientX,
      startY: e.clientY,
      initialOffset: offsets[guide.group] || { dx: 0, dy: 0 },
      isVerticalMovable: guide.isVerticalMovable,
      isHorizontalMovable: guide.isHorizontalMovable
    })
  }

  const handleMouseMove = useCallback((e) => {
    if (!dragState) return

    const deltaX = e.clientX - dragState.startX
    const deltaY = e.clientY - dragState.startY

    const viewW = !Array.isArray(source) && source.width
      ? parseFloat(source.width) * 10
      : editorDimensions.width
      
    const zoom = editorDimensions.zoom || 1
    const svgUnitsPerPixel = viewW / editorDimensions.width

    const adjustedDeltaX = (deltaX / zoom) * svgUnitsPerPixel
    const adjustedDeltaY = (deltaY / zoom) * svgUnitsPerPixel

    const newDx = dragState.initialOffset.dx + (dragState.isHorizontalMovable ? adjustedDeltaX : 0)
    const newDy = dragState.initialOffset.dy + (dragState.isVerticalMovable ? adjustedDeltaY : 0)

    setOffsets(prev => ({
      ...prev,
      [dragState.group]: { dx: newDx, dy: newDy }
    }))
  }, [dragState, source, editorDimensions])

  const handleMouseUp = useCallback(() => {
    setDragState(null)
  }, [])

  useEffect(() => {
    if (dragState) {
      window.addEventListener('mousemove', handleMouseMove)
      window.addEventListener('mouseup', handleMouseUp)
    } else {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [dragState, handleMouseMove, handleMouseUp])

  if (!guideList || guideList.length === 0) return null

  const viewW = !Array.isArray(source) && source.width
    ? parseFloat(source.width) * 10
    : editorDimensions.width
  const viewH = !Array.isArray(source) && source.height
    ? parseFloat(source.height) * 10
    : editorDimensions.height

  return (
    <svg
      width={editorDimensions.width}
      height={editorDimensions.height}
      viewBox={`0 0 ${viewW} ${viewH}`}
      preserveAspectRatio="none"
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        pointerEvents: 'none', // SVG shouldn't block canvas clicks
      }}
    >
      {guideList.map((guide, index) => {
        const guideData = guide.type ? guide : {
          x: parseFloat(guide.start_x),
          y: parseFloat(guide.start_y),
          width: parseFloat(guide.width),
          height: parseFloat(guide.height)
        }
        
        const offset = offsets[guide.group] || { dx: 0, dy: 0 }
        const currentX = guideData.x + offset.dx
        const currentY = guideData.y + offset.dy

        const cx = currentX + guideData.width / 2
        const cy = currentY + guideData.height / 2
        
        const zoom = editorDimensions.zoom || 1
        const svgUnitsPerVisualPixel = (viewW / editorDimensions.width) / zoom
        const badgeSize = 24 * svgUnitsPerVisualPixel
        const fontSize = 14 * svgUnitsPerVisualPixel
        const borderRadius = 4 * svgUnitsPerVisualPixel
        const label = guide.index

        const isMovable = guide.isVerticalMovable || guide.isHorizontalMovable
        let cursorStyle = 'default'
        if (guide.isVerticalMovable && guide.isHorizontalMovable) cursorStyle = 'move'
        else if (guide.isVerticalMovable) cursorStyle = 'ns-resize'
        else if (guide.isHorizontalMovable) cursorStyle = 'ew-resize'

        return (
          <g 
            key={index}
            onMouseDown={(e) => handleMouseDown(e, guide)}
            style={{ 
              pointerEvents: isMovable ? 'auto' : 'none',
              cursor: cursorStyle
            }}
          >
            <rect
              x={currentX}
              y={currentY}
              width={guideData.width}
              height={guideData.height}
              fill={guide.color || 'none'}
              stroke={guide.color || 'red'}
              strokeWidth="1"
              opacity={guide.opacity || '0.5'}
            />
            {label && (
              <>
                <rect
                  x={cx - badgeSize / 2}
                  y={cy - badgeSize / 2}
                  width={badgeSize}
                  height={badgeSize}
                  fill={guide.color || 'red'}
                  opacity="0.9"
                  rx={borderRadius}
                />
                <text
                  x={cx}
                  y={cy}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize={fontSize}
                  fontWeight="700"
                  fill={guide.color === 'yellow' || guide.color === 'green' ? '#000' : '#fff'}
                >
                  {label}
                </text>
              </>
            )}
          </g>
        )
      })}
    </svg>
  )
}

export default GuideDrawer
