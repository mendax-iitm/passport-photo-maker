import React from 'react'
import ReactGA from 'react-ga4'

const LoadPhotoButton = ({ onPhotoLoad, title }) => {
  const MAX_FILE_SIZE = 20000000
  const handlePhotoUpload = (event) => {
    const file = event.target.files[0]

    if (file) {
      if (file.size > MAX_FILE_SIZE) {
        alert(`File size should be less than ${MAX_FILE_SIZE / 1000000}MB`)
        return
      }

      const reader = new FileReader()
      reader.onloadend = () => {
        onPhotoLoad(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleClickBrowse = () => {
    document.getElementById('selectedFile').click()
    ReactGA.event({
      action: 'browsing_file',
      category: 'Button Click',
      label: 'Load Photo',
    })
  }

  return (
    <>
      <input
        type="file"
        id="selectedFile"
        style={{ display: 'none' }}
        onChange={handlePhotoUpload}
        accept="image/png, image/jpeg, image/jpg"
      />
      <button
        className="w-full bg-gradient-to-r from-primary to-primary-container text-white py-4 px-6 rounded-xl font-bold flex items-center justify-center gap-2 active:scale-95 transition-transform mt-4"
        onClick={handleClickBrowse}
      >
        <span className="material-symbols-outlined">add_a_photo</span>
        {title}
      </button>
    </>
  )
}

export default LoadPhotoButton
