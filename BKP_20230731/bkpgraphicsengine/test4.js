let canvas      = document.getElementById("mainCanvas")
let context     = canvas.getContext('2d')
//let imgSrc      = document.querySelector('input[type="file"]')
let grayButton  = document.querySelector('input[value="Grayscale"]')
let redButton   = document.querySelector('input[value="Red"]')
let resetButton = document.querySelector('input[value="Reset"]')
let slider      = document.querySelector('#myRange')

let ORIGINAL_IMAGE_DATA

const img = new Image();
img.src = "img/floppa.png";
img.addEventListener('load', () => {
    drawImage(img)
})

//imgSrc.addEventListener('change', detectImageInput)

window.onload = function() {
    slider.addEventListener('input', function () {
        console.log(slider.value)

        const imgData = context.getImageData(0, 0, canvas.width, canvas.height)
        var startTime = performance.now()
        for (let i = 0; i < imgData.data.length; i += 4) {
            
            let r   = ORIGINAL_IMAGE_DATA[i]
            let g   = ORIGINAL_IMAGE_DATA[i+1]
            let b   = ORIGINAL_IMAGE_DATA[i+2]

            //let obj = changeHue(r,g,b, slider.value);
            let obj = fastHue({r,g,b},slider.value);

            imgData.data[i]   = obj.r;
            imgData.data[i+1] = obj.g;
            imgData.data[i+2] = obj.b;
        }
        var endTime = performance.now()
        console.log(`Call to doSomething took ${endTime - startTime} milliseconds`)

        context.putImageData(imgData, 0, 0)


    }, false);
};

const detectImageInput = e => {
    let file = e.target.files[0]
    let fr = new FileReader()
    if (!file.type.includes("image")) return
    fr.addEventListener('load', loadImage)
    fr.readAsDataURL(file)
}

const loadImage = e => {
    const img = new Image()
    img.src = e.target.result
    img.addEventListener('load', () => {
        drawImage(img)
    })
}

const drawImage = img => {
    canvas.height = img.height
    canvas.width = img.width
    context.drawImage(img, 0, 0, img.width, img.height)
    cacheImageData()
}

const cacheImageData = () => {
    const original = context.getImageData(0, 0, canvas.width, canvas.height).data
    ORIGINAL_IMAGE_DATA = new Uint8ClampedArray(original.length)
    
    for (let i = 0; i < original.length; i += 1) {
        ORIGINAL_IMAGE_DATA[i] = original[i]
    }

    /*resetButton.addEventListener('click', () => {
        const imgData = context.getImageData(0, 0, canvas.width, canvas.height)
        for (let i = 0; i < imgData.data.length; i += 1) {
            imgData.data[i] = ORIGINAL_IMAGE_DATA[i]
        }
        context.putImageData(imgData, 0, 0)
    })*/
}


function changeHue(r,g,b, degree) {
    var hsl = rgbToHsl({r,g,b});
    hsl.h += parseInt(degree);
    if (hsl.h > 360)    hsl.h -= 360;
    else if (hsl.h < 0) hsl.h += 360;
    return hslToRgb(hsl);
    //return fastHue({r,g,b},hsl.h);
}

function rgbToHsl(rgb) {
    const r = rgb.r / 255
    const g = rgb.g / 255
    const b = rgb.b / 255
  
    const max = Math.max(r, g, b), min = Math.min(r, g, b)
    let h, s, l = (max + min) / 2
  
    if (max == min) {
      h = s = 0 // achromatic
    } else {
      const d = max - min
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
  
      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0)
          break
        case g:
          h = (b - r) / d + 2
          break
        case b:
          h = (r - g) / d + 4
          break
      }
  
      h /= 6
    }
  
    h *= 360
    s *= 100
    l *= 100
  
    return { h, s, l }
  }
  
function hslToRgb(hsl) {
    const h = hsl.h / 360
    const s = hsl.s / 100
    const l = hsl.l / 100
  
    let r, g, b
  
    if (s == 0) {
      r = g = b = l // achromatic
    } else {
      function hue2rgb(p, q, t) {
        if (t < 0) t += 1
        if (t > 1) t -= 1
        if (t < 1/6) return p + (q - p) * 6 * t
        if (t < 1/2) return q
        if (t < 2/3) return p + (q - p) * (2/3 - t) * 6
        return p
      }
  
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s
      const p = 2 * l - q
  
      r = hue2rgb(p, q, h + 1/3)
      g = hue2rgb(p, q, h)
      b = hue2rgb(p, q, h - 1/3)
    }
  
    r *= 255
    g *= 255
    b *= 255
  
    return { r, g, b}
}

function fastHue(rgb, hue){

    hue = parseInt(hue);

    let r = rgb.r 
    let g = rgb.g 
    let b = rgb.b 

    let max = Math.max(r, g, b)
    let min = Math.min(r, g, b)

    if (max != min) { // achromatic
        while (hue > 0){
            
            if (hue >= 120){
                [r, g, b] = [b, r, g];
                hue-=120;
            }

            if (hue < 120){
                let delta =  max - min;
                let fullness = delta * (hue/60);

                switch (max) {
                    case r:
                        if (g + fullness <= max) g += fullness;
                        else{
                            fullness -=(max - g);
                            g = max;
                            if (r - fullness >= min) r-= fullness;
                            else{
                                fullness -= delta;
                                r = min;
                                b+= fullness;
                            }
                        }
                        break
                    case g:
                        if (b + fullness <= max) b += fullness;
                        else{
                            fullness -=(max - b);
                            b = max;
                            if (g - fullness >= min) g-= fullness;
                            else{
                                fullness -= delta;
                                g = min;
                                r+= fullness;
                            }
                        }
                        break
                    case b:
                        if (r + fullness <= max) r += fullness;
                        else{
                            fullness -=(max - r);
                            r = max;
                            if (b - fullness >= min) b-= fullness;
                            else{
                                fullness -= delta;
                                b = min;
                                g+= fullness;
                            }
                        }
                        break
                }
                hue = 0;
            }
        }
    }

    /*r*= 255;
    g*= 255;
    b*= 255;*/

    return { r, g, b}
}