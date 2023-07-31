class GridCanvas {
    /**
     * Main class for managing a canvas as a grid
     * id is the html id of the canvas
     * 
     * the options are:
     *  frameDuration   = {int} number of milliseconds of animation;
     *  backgroundColor = {String} color of the background;
     *  gridSquared     = {int} number of total squares shown in the canvas, the number is squared so 2 = 4 squares, 9 = 81 squares, etc..
     *  debug           = {boolean{ indicating  whether the canvas is debug enabled;
     * 
     * @param {"String"} id
     * @param {"Object"} options 
     */
    constructor(id, options = {}) {
        this.canvas  = document.getElementById(id);
        this.context = this.canvas.getContext('2d');
        this.uid = "GridCanvas"+(new Date().getTime());
        
        this._grids = [];
        this._maxArea = 0;

        this._onDraw = false;
        this._play = false;

		this._background = null;
		this._focus = null;

        let{
            frameDuration = 16,
            backgroundColor = "black",
            gridSquared = 9,
            debug = false
        }= options;

        this.debug = debug;
        this._gridSquared = gridSquared;
        this.backgroundColor = backgroundColor;
        this.frameDuration = frameDuration;

    }

    set grids(value) {
        this._grids = value;
    }
    get grids() {
        return this._grids;
    }
	set focus(newVal){	
        this._focus = newVal;	
    }

    addGrid(grid){
        this._grids.push(grid);
    }

    onClick(customFunction){
        this.canvas.addEventListener("click",customFunction);
    }

    async start(drawFunction){
        this._onDraw = drawFunction;
        this._play = true;
        
        window.addEventListener('resize', this.resizeCanvas.bind(this), false);
        this.resizeCanvas();

        while (this._play){
            this.context.fillStyle = this.backgroundColor;
            this.context.fillRect(-this.canvas.width/2, -this.canvas.height/2, this.canvas.width, this.canvas.height);

            if (this._onDraw ) this._onDraw(this ,this.grids);
            for (let grid of this._grids) this.drawGrid(grid);

            this._resized = false;
            await this.delay(this.frameDuration);
        }
    }

    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this._maxArea = Math.sqrt(window.innerWidth * window.innerHeight) / this._gridSquared; //lado de los cubos de la grid

        this.context.translate(
            this.canvas.width/2 - this._maxArea/2, 
            this.canvas.height/2 - this._maxArea/2
        );

        this.context.scale(
            this._maxArea , 
            this._maxArea
        );

        this.context.save();
        
        let ccontext = this.canvas.getContext('2d');
        let sideSquare = this._maxArea/this._gridSquared;
        ccontext.scale(this._maxArea , this._maxArea);
    }

    drawGrid(oGrid){

        this.context.restore(); //cuando dibujemos un layer nuevo, restaurar al posicion inicial
        this.context.save();    //cuando restaura "ocupa" el save, asi que mejor guardarlo enseguida

        this.context.translate(
            oGrid.position.x, -oGrid.position.y
        );

        oGrid.entities.sort((a,b)=>{
            if (a.position.y > b.position.y) return -1;
            else{
                if (a.position.y < b.position.y) return 1;
                else{
                    if (a.position.x < b.position.x) return -1;
                    else if (a.position.x > b.position.x) return 1;
                    else return 0 ;
                }
            }
        });

        for (let entity of oGrid.entities){

            let oSprite = entity.sprite;
            let h = entity.position.y;
            let w = entity.position.x;
            
            if (oSprite.isReady){
                
                let cached = oSprite.image;
                
                if (!cached){
                    cached = oSprite.setCacheImage(this._maxArea);
                }
                    
                if (oSprite.flipX){
                    this.context.scale(-1, 1);
                    
                    this.context.drawImage(
                        cached, 
                        -w-oGrid.center.x - 1, 
                        -h-oGrid.center.y
                        ,1,1
                    );

                    this.context.scale(-1, 1);
                    
                }
                else{
                    this.context.drawImage(
                        cached, 
                        w-oGrid.center.x, 
                        -h-oGrid.center.y, 
                        1, 1
                    );               
                }
                
            }
        }

        if (this.debug){
            for (let entity of oGrid.entities){

                if (entity.collision){
                    let oCollision = entity.collision;

                    if (oCollision.type == "rectangle"){
                        this.context.fillStyle = "rgba(255, 0, 0, 0.5)";
                        this.context.fillRect(
                            entity.position.x + oCollision.offset.x - oGrid.center.x,
                            - entity.position.y - oCollision.offset.y - oGrid.center.y,
                            oCollision.width,
                            oCollision.height);
                    }

                    if (oCollision.type == "circle"){
                        this.context.beginPath();
                        this.context.arc(
                            entity.position.x + oCollision.offset.x - oGrid.center.x + oCollision.width/2,
                            - entity.position.y - oCollision.offset.y - oGrid.center.y + oCollision.height/2, 
                            oCollision.radius, 
                            0, 2 * Math.PI, false);
                        this.context.fillStyle = "rgba(255, 0, 0, 0.5)";
                        this.context.fill();
                    }

                }
                
            }
        }
    }

    // TODO: trasladar esto a helpers
    delay(ms){
        return new Promise(res => setTimeout(res, ms))
    };

    /**
     * sistema para mover camara multi layers
     * TODO : mover a clase camera
     * @param {*} x 
     * @param {*} y 
     */
    moveAllLayers( x, y ){
        
        let focus           = this._focus;
        let layersToMove    = this.grids.filter(grid=>grid!=focus);
        let collidedLayer   = null;
        let lLength         = layersToMove.length;


        //primero chequea que no haya ningun colisionando (para no guardar safes incorrectos)
        for( let i=0; i<lLength; i++){

            let layer = layersToMove[i];
            layer.position.move(x, y);
            if (focus.constructor.name === "Entity" && layer == focus.grid) focus.position.move(-x,-y);

            if (focus){

                if (focus.constructor.name === "GridLayer"){
                    let collided = focus.isColliding(layer) ;

                    if (collided || !!collidedLayer){
                        layer.position = layer.safePosition;

                        for( let c=i; c>=0; c-- ){
                            let prelayer = layersToMove[c];
                            prelayer.position = prelayer.safePosition.clone();;
                        }

                        collidedLayer = layer;
                        i = lLength;
                    }
                }

                if (focus.constructor.name === "Entity"){
                    let collided = focus.isColliding(layer,[focus.collision]) ;

                    if (collided || !!collidedLayer){

                        layer.position = layer.safePosition.clone();
                        focus.position = focus.safePosition.clone();

                        for( let c=i; c>=0; c-- ){
                            let prelayer = layersToMove[c];
                            prelayer.position = prelayer.safePosition.clone();
                        }

                        collidedLayer = layer;
                        i = lLength;
                    }
                }
            }
        }
        
        // si no encotro ninguna, guarda los safes
        if(!collidedLayer){

            if (focus.constructor.name === "Entity"){
                focus.safePosition = focus.position.clone();
            }

            for( let i=0; i<lLength; i++){
                let layer = layersToMove[i];
                layer.safePosition = layer.position.clone();
            }
        }
    }
}


