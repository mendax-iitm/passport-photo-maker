import React from 'react'

// Template guide coordinates use 10 units per mm (e.g. a 35x45mm photo maps to
// a 350x450 coord space). We put that in the SVG viewBox so guides auto-scale
// to whatever pixel size the editor is rendered at.
const GuideDrawer = ({ template, guides, editorDimensions }) => {
  const source = template || guides
  if (!source) return null

  const guideList = Array.isArray(source) ? source : source.guide
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
        const cx = guideData.x + guideData.width / 2
        const cy = guideData.y + guideData.height / 2
        const badgeSize = 14
        const label = guide.index

        return (
          <g key={index}>
            <rect
              x={guideData.x}
              y={guideData.y}
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
                  rx="2"
                />
                <text
                  x={cx}
                  y={cy}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize="10"
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
