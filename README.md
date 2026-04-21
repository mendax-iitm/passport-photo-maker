<div id="top"></div>
<br />
<div align="center">
  <a href="https://jiataihan.dev/passport-photo-maker/">
    <img src="public/logo512.png" alt="Logo" width="128" height="128">
  </a>

<h3 align="center">Passport & Visa Photo Maker</h3>

  <p align="center">
    No image-editing knowledge and no software download required. Just tap around in your phone browser or use your mouse in a desktop browser to remove backgrounds easily and quickly generate passport or visa photos that match different countries' requirements.
    <br />
    <a href="https://jiataihan.dev/passport-photo-maker/"><strong>{ Click here to get started }</strong></a>
    <br />
    <a href="https://www.youtube.com/watch?v=z6podleci5E"><strong>{ Click here to watch the video tutorial }</strong></a>
    <br />
  </p>

</div>


<!-- ABOUT THE PROJECT -->
## Features

* Web-based, responsive UI that works across platforms and devices, including mobile browsers
* Bilingual Chinese and English interface with real-time switching, with support for future language expansion
* Passport and visa photo templates for multiple countries, plus reference information defined in JSON for quick additions
* AI background removal, except on iOS devices such as iPhone and iPad
* Direct manipulation of the image area with mouse or touch, plus fine-tuning controls
* Pan, zoom, and rotate using mouse or multi-touch gestures, with additional button-based adjustments and real-time preview
* High-resolution output with configurable dimensions and output file size limits
* Can generate either a single image for digital upload or a printable 4"x6" photo layout

<p align="right">(<a href="#top">Back to top</a>)</p>

* Main interface with the Chinese passport/visa photo template
<div align="center">
    <img src="readme_assets/Preview.png" alt="Application preview" width="600"">
</div>

* AI background removal
<div align="center">
    <img src="readme_assets/Preview_AI_removal.png" alt="Application preview" width="600"">
</div>

* Generate a single image or a printable 4"x6" layout
<div align="center">
    <img src="readme_assets/Preview_print_layout.png" alt="Application preview" width="600"">
</div>

* U.S. passport and visa photo template with Chinese UI
<div align="center">
    <img src="readme_assets/Preview_US_Chinese.png" alt="Application preview" width="600"">
</div>

## Introduction

This tool is designed specifically for creating photos that meet passport and visa requirements in different countries. It focuses on usability, simplicity, and efficiency, allowing users to quickly produce standard-compliant photos based on the latest embassy and consulate guidelines. The interface provides multiple ways to adjust photos and is intuitive enough for non-technical users, making it a convenient way to create compliant photos from home.

<p align="right">(<a href="#top">Back to top</a>)</p>

### Built With

* React
* JavaScript
* Node.js
* `@imgly/background-removal` for AI background removal
* `@picocss/pico` as the UI framework
* `pica@9.0.1` for high-quality photo scaling
* `react-avatar-editor` as the image editor
* `react-draggable@4.4.6` for draggable guide lines

<p align="right">(<a href="#top">Back to top</a>)</p>

### Known Issues

* <del>The drag area could move beyond the canvas boundary while panning.</del> (fixed: 2024-01-25)
* <del>Image size was based on the actual canvas size displayed on the page. For example, if a Chinese passport photo used 330x480px, changing the output size only stretched it with interpolation and caused noticeable quality loss. Two possible fixes were considered: 1. increase the actual canvas size and scale it down proportionally for display while exporting the original canvas size; 2. reload the original image on export and calculate the output from the original image using the recorded pan/zoom coordinates. Since passport and visa photos usually require relatively small file sizes, option 1 was considered more reliable for now.</del> (fixed: 2024-01-26)
* <del>At startup, users had to drag several times before panning worked correctly because the position coordinates were not initialized properly on the first zoom.</del> (fixed: 2024-01-27)
* <del>After switching templates, the preview image no longer matched the canvas area until the user dragged it again.</del> (fixed: 2024-01-28)
* On iOS, saved images are stored in Files instead of the Camera Roll and there is no prompt, so iOS-specific save behavior may need extra handling.

<p align="right">(<a href="#top">Back to top</a>)</p>



### Planned Features
* Suggestions are welcome in the discussion area, and other developers are welcome to create a new branch and add features.

<p align="right">(<a href="#top">Back to top</a>)</p>

<div>
