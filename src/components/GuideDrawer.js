import React, { useState, useRef, useEffect } from 'react'

// Green "calibration" bars (hair-top E + chin F) drag together vertically so
// the user can fit them to their actual face proportions. Distance between
// them is preserved. Yellow/red guides stay fixed.
const GuideDrawer = ({ template, guides, editorDimensions }) => {
  const source = template || guides
  const svgRef = useRef(null)
  const dragRef = useRef(null)
  const [greenYOffset, setGreenYOffset] = useState(0)

  useEffect(() => {
    setGreenYOffset(0)
  }, [source])

  if (!source) return null
  const guideList = Array.isArray(source) ? source : source.guide
  if (!guideList || guideList.length === 0) return null

  const viewW = !Array.isArray(source) && source.width
    ? parseFloat(source.width) * 10
    : editorDimensions.width
  const viewH = !Array.isArray(source) && source.height
    ? parseFloat(source.height) * 10
    : editorDimensions.height

  const greens = guideList.filter(g => g.color === 'green')
  const minGreenY = greens.length
    ? Math.min(...greens.map(g => parseFloat(g.start_y)))
    : 0
  const maxGreenBottom = greens.length
    ? Math.max(...greens.map(g => parseFloat(g.start_y) + parseFloat(g.height)))
    : viewH
  const lowerBound = -minGreenY
  const upperBound = viewH - maxGreenBottom

  const screenToSvgY = (clientY) => {
    const rect = svgRef.current.getBoundingClientRect()
    return ((clientY - rect.top) / rect.height) * viewH
  }

  const handlePointerDown = (e) => {
    e.preventDefault()
    e.stopPropagation()
    dragRef.current = {
      startSvgY: screenToSvgY(e.clientY),
      startOffset: greenYOffset
    }
    e.target.setPointerCapture(e.pointerId)
  }

  const handlePointerMove = (e) => {
    if (!dragRef.current) return
    const delta = screenToSvgY(e.clientY) - dragRef.current.startSvgY
    const next = dragRef.current.startOffset + delta
    setGreenYOffset(Math.max(lowerBound, Math.min(upperBound, next)))
  }

  const handlePointerUp = () => {
    dragRef.current = null
  }

  return (
    <svg
      ref={svgRef}
      width={editorDimensions.width}
      height={editorDimensions.height}
      viewBox={`0 0 ${viewW} ${viewH}`}
      preserveAspectRatio="none"
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        pointerEvents: 'none'
      }}
    >
      {guideList.map((guide, index) => {
        const guideData = guide.type ? guide : {
          x: parseFloat(guide.start_x),
          y: parseFloat(guide.start_y),
          width: parseFloat(guide.width),
          height: parseFloat(guide.height)
        }
        const isDraggable = guide.color === 'green'
        const finalY = guideData.y + (isDraggable ? greenYOffset : 0)
        const cx = guideData.x + guideData.width / 2
        const cy = finalY + guideData.height / 2
        // Calculate dynamic sizes for consistent visual appearance across all templates
        const zoom = editorDimensions.zoom || 1
        const svgUnitsPerVisualPixel = (viewW / editorDimensions.width) / zoom
        const badgeSize = 24 * svgUnitsPerVisualPixel
        const fontSize = 14 * svgUnitsPerVisualPixel
        const borderRadius = 4 * svgUnitsPerVisualPixel
        
        const label = guide.index

        return (
          <g key={index}>
            <rect
              x={guideData.x}
              y={finalY}
              width={guideData.width}
              height={guideData.height}
              fill={guide.color || 'none'}
              stroke={guide.color || 'red'}
              strokeWidth="1"
              opacity={guide.opacity || '0.5'}
              style={{
                pointerEvents: isDraggable ? 'all' : 'none',
                cursor: isDraggable ? 'ns-resize' : 'default',
                touchAction: isDraggable ? 'none' : 'auto'
              }}
              onPointerDown={isDraggable ? handlePointerDown : undefined}
              onPointerMove={isDraggable ? handlePointerMove : undefined}
              onPointerUp={isDraggable ? handlePointerUp : undefined}
              onPointerCancel={isDraggable ? handlePointerUp : undefined}
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
                  style={{ pointerEvents: 'none' }}
                />
                <text
                  x={cx}
                  y={cy}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize={fontSize}
                  fontWeight="700"
                  fill={guide.color === 'yellow' || guide.color === 'green' ? '#000' : '#fff'}
                  style={{ pointerEvents: 'none' }}
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
