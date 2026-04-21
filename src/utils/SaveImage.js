const PRINT_WIDTH = 1800
const PRINT_HEIGHT = 1200
const QUALITY_MIN = 0.4
const QUALITY_MAX = 0.95
const QUALITY_EPSILON = 0.02

const loadImage = (imageSrc) => new Promise((resolve, reject) => {
  const img = new Image()
  img.onload = () => resolve(img)
  img.onerror = () => reject(new Error('Failed to load image for export'))
  img.src = imageSrc
})

const canvasToBlob = (canvas, quality) => new Promise((resolve, reject) => {
  canvas.toBlob((blob) => {
    if (!blob) {
      reject(new Error('Failed to encode generated image'))
      return
    }
    resolve(blob)
  }, 'image/jpeg', quality)
})

const blobToDataUrl = (blob) => new Promise((resolve, reject) => {
  const reader = new FileReader()
  reader.onloadend = () => resolve(reader.result)
  reader.onerror = () => reject(new Error('Failed to read generated image'))
  reader.readAsDataURL(blob)
})

const encodeWithinTargetSize = async (canvas, targetSizeKb) => {
  const targetBytes = Number(targetSizeKb) * 1024
  let low = QUALITY_MIN
  let high = QUALITY_MAX
  let bestBlob = await canvasToBlob(canvas, QUALITY_MAX)

  if (bestBlob.size <= targetBytes) {
    return blobToDataUrl(bestBlob)
  }

  while (high - low > QUALITY_EPSILON) {
    const quality = (low + high) / 2
    const blob = await canvasToBlob(canvas, quality)

    if (blob.size <= targetBytes) {
      bestBlob = blob
      low = quality
    } else {
      high = quality
    }
  }

  if (bestBlob.size > targetBytes) {
    bestBlob = await canvasToBlob(canvas, QUALITY_MIN)
  }

  return blobToDataUrl(bestBlob)
}

const createCanvas = (width, height) => {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')

  if (!ctx) {
    throw new Error('Canvas context is not available')
  }

  canvas.width = width
  canvas.height = height
  ctx.fillStyle = 'white'
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  return { canvas, ctx }
}

export const generateSingle = async (croppedImage, exportPhoto) => {
  const img = await loadImage(croppedImage)
  const { canvas, ctx } = createCanvas(Number(exportPhoto.width), Number(exportPhoto.height))

  ctx.drawImage(img, 0, 0, Number(exportPhoto.width), Number(exportPhoto.height))

  return encodeWithinTargetSize(canvas, exportPhoto.size)
}

export const generate4x6 = async (croppedImage, exportPhoto) => {
  const img = await loadImage(croppedImage)
  const { canvas, ctx } = createCanvas(PRINT_WIDTH, PRINT_HEIGHT)
  const photoWidth = Number(exportPhoto.width)
  const photoHeight = Number(exportPhoto.height)
  const margin = 20
  const rows = Math.floor(PRINT_HEIGHT / (photoHeight + margin))
  const cols = Math.floor(PRINT_WIDTH / (photoWidth + margin))

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      const x = j * (photoWidth + margin) + margin
      const y = i * (photoHeight + margin) + margin
      ctx.drawImage(img, x, y, photoWidth, photoHeight)
    }
  }

  return encodeWithinTargetSize(canvas, exportPhoto.size)
}

export const handleSaveSingle = (imageSrc) => {
  const link = document.createElement('a')
  link.download = 'passport_photo_single.jpg'
  link.href = imageSrc
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

export const handleSave4x6 = (imageSrc) => {
  const link = document.createElement('a')
  link.download = 'passport_photo_4x6.jpg'
  link.href = imageSrc
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
