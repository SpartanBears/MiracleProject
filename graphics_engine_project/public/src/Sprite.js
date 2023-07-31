class Sprite{
    
    /**
     * Contoller for drawing and managing Sprites with images 
     * 
     * @param {HTMLImageElement[]|String[]} images                              - An array of HTML images to draw (or where are located)
     * @param {Object}                      [options]                           - Options for Sprite rendering
     *          
     * @param {number}                      [options.index = 0]                 - place of the array of images to draw
     * @param {boolean}                     [options.flipX = false]             - whether to flip the image horizontally
     * @param {boolean}                     [options.flipY = false]             - whether to flip the image verically
     * @param {number}                      [options.ticks = 30]                - number of ticks to draw next image
     * @param {number}                      [options.hue = 0]                   - the hue of the image
     * @param {number}                      [options.sat = 0]                   - the saturation of the image
     * @param {number}                      [options.lum = 0]                   - the luminosity of the image
     * @param {boolean}                     [options.pixel = true]              - draw without smoothing the image, useful for smaller images
     * @param {number}                      [options.centerX = 0]               - center in the X axis of the sprite respect of the Entity parent grid
     * @param {number}                      [options.centerY = 0]               - center in the Y axis of the sprite respect of the Entity parent grid
     * @param {number}                      [options.colSpan = 1]               - number of colums in the Entity parent grid used by the sprite
     * @param {number}                      [options.rowSpan = 1]               - number of rows in the Entity parent grid used by the sprite
     * @param {string}                      [options.composite = "source-over"] - operation for context globalCompositeOperation
     * @param {Object}                      [options.sheet = false]             - allow the use of sprite sheets instead of an array fo sprites
     * 
     * @param {number}                      [options.sheet.xBegin = 0]          - start in the X axis of the top-left corner of the sprite sheet
     * @param {number}                      [options.sheet.yBegin = 0]          - start in the Y axis of the top-left corner of the sprite sheet
     * @param {number}                      [options.sheet.height = 128]        - height of the sprite sheet in pixels
     * @param {number}                      [options.sheet.width = 128]         - width of the sprite sheet in pixels
     * @param {number}                      [options.sheet.xOff = 0]            - offset in the X axis of the top-left corner of each sprite in the sprite sheet
     * @param {number}                      [options.sheet.yOff = 0]            - offset in the Y axis of the top-left corner of each sprite in the sprite sheet
     * @param {number}                      [options.sheet.max = 0]             - max number of sprites to load (zero means all sprites posible)
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
            if(!!options.sheet) this.imageArrayOriginal = spriteSheet(images[0]);
            else                this.imageArrayOriginal = images;
        }else{
            thisSprite.imageLoader = new ImageLoader(images);
            
            thisSprite.onImagesLoaded(custom => {}).then(response=>{
                if(!!options.sheet) this.imageArrayOriginal = spriteSheet(response[0]);
                else                this.imageArrayOriginal = response;
            }).catch(err=>{
                console.error(err);
            })
        }

        let{
            index   = 0,
            flipX   = false,
            flipY   = false,
            ticks   = 30,
            colSpan = 1,
            rowSpan = 1,
            centerX = 0,
            centerY = 0,
            hue     = 0,
            sat     = 0,
            lum     = 0,
            pixel   = true,
            composite = "source-over",
            sheet   = false 
        } = options;

        this._index     = index;
        this._flipX     = flipX;
        this._flipY     = flipY;
        this._ticks     = ticks;
        this.colSpan    = colSpan;
        this.rowSpan    = rowSpan;
        this.centerX    = centerX;
        this.centerY    = centerY;
        this._hue       = hue;
        this._sat       = sat;
        this._lum       = lum;
        this._pixel     = pixel;
        this.sheet      = sheet;
        this.composite  = composite;

        this.currentTick = 0;

        //convert a image in a array of images
        function spriteSheet(currentImage){
            const newArray  = [];
            
            let{
                xBegin  = 0,
                yBegin  = 0,
                height  = 128,
                width   = 128,
                max     = 0,
                xOff    = 0,
                yOff    = 0
            } = options.sheet;

            const sheet     = currentImage;
            const sheetH    = sheet.naturalHeight;
            const sheetW    = sheet.naturalWidth;

            for (let y = yBegin; y < sheetH; y += height){
                for (let x = xBegin; x < sheetW; x += width){
                    const canvas    = document.createElement('canvas');
                    const context   = canvas.getContext("2d");
                    canvas.width    = width;
                    canvas.height   = height;

                    context.drawImage(
                        sheet,
                        x + xOff, 
                        y + yOff,       
                        width, 
                        height,
                        0,
                        0,
                        width, 
                        height,
                    );

                    newArray.push(canvas);
                }
            }
            
            return newArray;
        }
    }

    set imageArrayOriginal(array){
        this._imageArrayOriginal    = array;
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
        if (val != this._flipX){
            this._flipX = val;
            for(let i = 0; i < this._length; i++) this._imageArrayStatus[i] = false;
        }
    }

    get flipY(){
        return this._flipY;
    }
    set flipY(val){
        if (val != this._flipY){
            this._flipY = val;
            for(let i = 0; i < this._length; i++) this._imageArrayStatus[i] = false;
        }
    }

    set hue(val){
        this._hue = val;
        for(let i = 0; i < this._length; i++) this._imageArrayStatus[i] = false;
    }
    get hue(){
        return this._hue;
    }

    set sat(val){
        this._sat = val;
        for(let i = 0; i < this._length; i++) this._imageArrayStatus[i] = false;
    }
    get sat(){
        return this._sat;
    }
    set lum(val){
        this._lum = val;
        for(let i = 0; i < this._length; i++) this._imageArrayStatus[i] = false;
    }
    get lum(){
        return this._lum;
    }

    set index(val){
        this._index = val;
    }
    get isSpritesheet(){
        return !!this.spriteSheetOpt;
    }

    setCacheImage(square){

        const canvas    = document.createElement('canvas');
        const context   = canvas.getContext("2d");
        const img       = this._imageArrayOriginal[this._index];

        canvas.width    = square*this.rowSpan;
        canvas.height   = square*this.colSpan;

        if (this._pixel) context.imageSmoothingEnabled = false;
        
        let fx = 0;
        let fy = 0;

        if (this._flipX){
            context.scale(-1, 1);
            fx = 1;
        }

        if (this._flipY) {
            context.scale(1, -1);
            fy = 1;
        }

        context.drawImage(img, -canvas.height * fx, -canvas.height * fy, canvas.width, canvas.height);

        if (this._flipX) context.scale(-1, 1);
        if (this._flipY) context.scale(1, -1);
        
        const imgData   = context.getImageData(0, 0, canvas.width, canvas.height)
        const dLength   = imgData.data.length
        
        for (let i = 0; i < dLength; i += 4) {
            let rgba = {};
            rgba.r   = imgData.data[i]
            rgba.g   = imgData.data[i+1]
            rgba.b   = imgData.data[i+2]
            rgba.a   = imgData.data[i+3]

            if (rgba.a > 0){
                if (this._hue != 0){
                    rgba = this.changeHue(rgba, this._hue);
                }
                if (this._sat != 0){
                    rgba = this.changeSat(rgba, this._sat);
                }
                if (this._lum != 0){
                    rgba = this.changeLum(rgba, this._lum);
                }
                imgData.data[i]   = rgba.r;
                imgData.data[i+1] = rgba.g;
                imgData.data[i+2] = rgba.b;
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
        let cloned = new Sprite(this._imageArrayOriginal,
        {
            index:      this._index,
            flipX:      this._flipX,
            flipY:      this._flipY,
            ticks:      this._ticks,
            colSpan:    this.colSpan,
            rowSpan:    this.rowSpan,
            centerX:    this.centerX,
            centerY:    this.centerY,
            hue:        this._hue,
            sat:        this._sat,
            lum:        this._lum,
            pixel:      this._pixel,
        });
        return cloned;
    }

    changeHue(rgba, degree) {
        var hsla = this.rgbaToHsla(rgba);
        var rd = parseInt(degree)%360;
        hsla.h += rd;
        return this.hslaToRgba(hsla);
    }

    changeSat(rgba, sat) {
        var hsla = this.rgbaToHsla(rgba);
        hsla.s += parseInt(sat);
        return this.hslaToRgba(hsla);
    }

    changeLum(rgba, lum) {
        var hsla = this.rgbaToHsla(rgba);
        hsla.l += parseInt(lum);
        return this.hslaToRgba(hsla);
    }
    
    rgbaToHsla(rgba) {
        const r = rgba.r / 255;
        const g = rgba.g / 255;
        const b = rgba.b / 255;
        const a = rgba.a;

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

        return { h, s, l, a};
    }
      
    hslaToRgba(hsla) {
        const h = hsla.h / 360;
        const s = hsla.s / 100;
        const l = hsla.l / 100;
        const a = hsla.a;

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

        return { r, g, b, a };
    }
}