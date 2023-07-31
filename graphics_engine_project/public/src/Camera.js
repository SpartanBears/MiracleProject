class Camera{
    /**
     * Main class for managing cameras
     * 
     * @param {"Object"} options 
     */

    constructor(options={}){
        let {
            position = new Position(),
            tiles = 100,
            active = true,
            widthPercent = 100,
            heightPercent = 100,
            hPosition = 0,
            vPosition = 0,
        } = options;

        this._position      = position;
        this._tiles         = tiles;
        this._active        = active;
        this._widthPercent  = widthPercent;
        this._heightPercent = heightPercent;
        this._hPosition     = hPosition;
        this._vPosition     = vPosition;

        this.canvas         = document.createElement("canvas");
        this.context        = this.canvas.getContext("2d");
	}

    get position() {
        return this._position;
    }
    set position(value) {
        this._position = value;
    }

    get tiles() {
        return this._tiles;
    }
    set tiles(value) {
        this._tiles = value;
    }

    get active() {
        return this._active;
    }
    set active(value) {
        this._active = value;
    }

    get widthPercent() {
        return this._widthPercent
    }
    set widthPercent(value){
        this._widthPercent = value;
    }

    get heightPercent(){
        return this._heightPercent;
    }
    set heightPercent(value) {
        this._heightPercent = value;
    }

    get hPosition() {
        return this._hPosition;
    }
    set hPosition(value) {
        this._hPosition = value;
    }

    get vPosition() {
        return this._vPosition;
    }
    set vPosition(value) {
        this._vPosition = value;
    }


}