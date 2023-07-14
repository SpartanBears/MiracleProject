class Sprite{
    /**
     * Contoller for drawing and managing Sprites with images 
     * 
     * @param {array[HTMLImageElement|String]} images 
     * @param {Object} options 
     * 
     * options are;
     *  index: (0)      place of the array of images to draw
     *  flipX: (false)  whether to flip the image horizontally
     *  ticks: (30)     number of ticks to draw next image 
     *  hue:   (0)      the hue of the image
     *  pixel: (true)   draw without smoothing the image
     * 
     */
    constructor(images = [], options = {}) {

        this._imageArrayOriginal = [];
        this._imageArrayCache = [];
        this._imageArrayStatus = [];

        this._length = 0;
        this._isReady = false;

        if (!Array.isArray(images)) images = [images];
        if (images.length == 0) throw new Error("No images provided");

        let thisSprite = this;

        if (images[0].constructor.name === "HTMLImageElement"){
            this.imageArrayOriginal = images;
        }else{
            thisSprite.imageLoader = new ImageLoader(images);
            
            thisSprite.onImagesLoaded(custom => {}).then(response=>{
                this.imageArrayOriginal = response;
            }).catch(err=>{
                console.error(err);
            })
        }

        let{
            index = 0,
            flipX = false,
            ticks = 30,
            hue = 0,
            pixel = true,
        }= options;

        this._index = index;
        this._flipX = flipX;
        this._ticks = ticks;
        this._hue   = hue;
        this._pixel = pixel;

        this.currentTick = 0;

    }

    set imageArrayOriginal(array){
        this._imageArrayOriginal    = array;
        // no dejar la imagen original como cached: no permite hacerle cambios con canvas
        //this._imageArrayCache       = array;
        this._length                = this._imageArrayOriginal.length;
        this._isReady               = true;
        for(let i = 0; i < this._length; i++) this._imageArrayStatus[i] = true;
    }

    get image() {
        
        if (this.currentTick < this._ticks){
            this.currentTick++;
        }else{
            this.currentTick = 0;
            this._index++;
            if (this._index >= this._length) this._index = 0;
        }

        if (this._imageArrayStatus[this._index]) return this._imageArrayCache[this._index];
        else return false;

        
    }

    get originalImage() {
        
        if (this.currentTick < this._ticks){
            this.currentTick++;
        }else{
            this.currentTick = 0;
            this._index++;
            if (this._index >= this._length) this._index = 0;
        }
        return this._imageArrayOriginal[this._index];
    }

    get flipX(){
        return this._flipX;
    }

    set flipX(val){
        this._flipX = val;
    }

    set hue(val){
        this._hue = val;
        for(let i = 0; i < this._length; i++) this._imageArrayStatus[i] = false;
    }
    get hue(){
        return this._hue;
    }

    set index(val){
        this._index = val;
    }

    setCacheImage(square){

        const canvas    = document.createElement('canvas');
        const context   = canvas.getContext("2d");
        const img       = this._imageArrayOriginal[this._index];

        canvas.width    = square;
        canvas.height   = square;

        if (this._pixel) context.imageSmoothingEnabled = false;

        context.drawImage(img, 0, 0, canvas.width, canvas.height);
        
        const imgData   = context.getImageData(0, 0, canvas.width, canvas.height)
        const dLength   = imgData.data.length
        
        for (let i = 0; i < dLength; i += 4) {
            let r   = imgData.data[i]
            let g   = imgData.data[i+1]
            let b   = imgData.data[i+2]
            let a   = imgData.data[i+3]

            if (a>0){
                let obj = this.changeHue(r,g,b, this._hue);

                imgData.data[i]   = obj.r;
                imgData.data[i+1] = obj.g;
                imgData.data[i+2] = obj.b;
            }
        }
        context.putImageData(imgData, 0, 0)

        this._imageArrayCache[this._index] = canvas;
        this._imageArrayStatus[this._index] = true;

        return canvas;
    }

    onImagesLoaded(onLoad){
		return this.imageLoader.onLoad(onLoad);
	}

    get isReady(){
        return this._isReady;	
    }

    clone(){
        let cloned = new Sprite(this._imageArrayOriginal);
        cloned.flipX = this._flipX;
        return cloned;
    }

    changeHue(r,g,b, degree) {
        var hsl = this.rgbToHsl({r,g,b});
        hsl.h += parseInt(degree);
        if (hsl.h > 360)    hsl.h -= 360;
        else if (hsl.h < 0) hsl.h += 360;
        return this.hslToRgb(hsl);
    }
    
    rgbToHsl(rgb) {
        const r = rgb.r / 255;
        const g = rgb.g / 255;
        const b = rgb.b / 255;

        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        let h, s, l = (max + min) / 2;

        if (max == min) {
            h = s = 0; // achromatic
        } else {
            const delta = max - min;
            s = (l > 0.5)? delta / (2 - max - min) : delta / (max + min);

            switch (max) {
                case r: h = (g - b) / delta + (g < b ? 6 : 0);  break;
                case g: h = (b - r) / delta + 2;                break;
                case b: h = (r - g) / delta + 4;                break;
            }

            h /= 6;
        }

        h *= 360;
        s *= 100;
        l *= 100;

        return { h, s, l };
    }
      
    hslToRgb(hsl) {
        const h = hsl.h / 360;
        const s = hsl.s / 100;
        const l = hsl.l / 100;

        let r, g, b;

        if (s == 0) {
            r = g = b = l; // achromatic
        } else {
            function hue2rgb(p, q, t) {
                if (t < 0) t += 1;
                if (t > 1) t -= 1;
                if (t < 1/6) return p + (q - p) * 6 * t;
                if (t < 1/2) return q;
                if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
                return p;
            }

            const q = (l < 0.5) ? l * (1 + s) : l + s - l * s;
            const p = 2 * l - q;

            r = hue2rgb(p, q, h + 1/3)
            g = hue2rgb(p, q, h)
            b = hue2rgb(p, q, h - 1/3)
        }

        r *= 255;
        g *= 255;
        b *= 255;

        return { r, g, b };
    }
}