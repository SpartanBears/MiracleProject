class GridCanvas {
    /**
     * Main class for managing a canvas as a grid
     * 
     * @param {"string"}    id                      - id is the html DOM id of the canvas
     * @param {"object"}    options                 - default options
     * @param {"boolean"}   options.frameDuration   - number of milliseconds of animation;
     * @param {"string"}    options.backgroundColor - color of the background;
     * @param {"boolean"}   options.debug           - indicating  whether the canvas is debug enabled;
     *                                                                                                                      
     */
    constructor(id, options = {}) {
        this.canvas  = document.getElementById(id);
        this.context = this.canvas.getContext('2d');
        this.uid = "GridCanvas"+(new Date().getTime());
        
        this._grids = [];
        this._cameras = [];
        this._maxArea = 0;

        this._onDraw = false;
        this._play = false;

		this._background = null;

        let{
            frameDuration = 16,
            backgroundColor = "black",
            cameras = [new Camera()],
            mainCamera = '0',
            debug = false
        }= options;

        this.debug              = debug;
        this.backgroundColor    = backgroundColor;
        this.frameDuration      = frameDuration;
        this._cameras           = cameras;
        this._mainCamera        = mainCamera;
    }

    set grids(value) {
        this._grids = value;
    }
    get grids() {
        return this._grids;
    }
	set cameras(value){	
        this._cameras = value;	
    }
    get cameras() {
        return this._cameras;
    }
    set mainCamera(value) {
        this._mainCamera = value;
    }
    get mainCamera() {
        return this._mainCamera;
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
            //rellenamos el fondo negro
            this.context.fillStyle = this.backgroundColor;
            this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);

            if (this._onDraw )                  this._onDraw(this ,this.grids);
            
            // ordena los Grids antes de dibujarlos
            for (let oGrid of this._grids){
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
            }

            //primero renderiza la camara principal
            this.drawCamera(this._cameras[this._mainCamera]);

            //luego las demas camaras (esto asegura que los sprites salgan con la calidad de la principal)
            for (let idx in this._cameras){
                if(this._cameras[idx] !== this._cameras[this._mainCamera]) this.drawCamera(this._cameras[idx]);
            }

            await this.delay(this.frameDuration);
        }
    }

    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;

        for (let idx in this._cameras){

            let camera = this._cameras[idx];

            camera.canvas.width    = (this.canvas.width/100)*camera.widthPercent;
            camera.canvas.height   = (this.canvas.height/100)*camera.heightPercent;

            camera.maxArea = Math.sqrt(camera.canvas.width * camera.canvas.height) / Math.sqrt(camera.tiles);
            camera.context.translate(
                camera.canvas.width/2 - camera.maxArea/2, 
                camera.canvas.height/2 - camera.maxArea/2
            );
            camera.context.scale(
                camera.maxArea,
                camera.maxArea
            );

            camera.context.save();
        }
    }

    // TODO: trasladar esto a helpers
    delay(ms){
        return new Promise(res => setTimeout(res, ms))
    };

    drawCamera(camera){
        // limpiamos la camara
        camera.context.clearRect(-camera.canvas.width/2, -camera.canvas.height/2, camera.canvas.width, camera.canvas.height);

        // rellenamos la camara con los sprites de los grids
        for (let grid of this._grids){
            let indexMaxArea = this.cameras[this._mainCamera].maxArea;

            camera.context.restore(); //cuando dibujemos un layer nuevo, restaurar al posicion inicial
            camera.context.save();    //cuando restaura "ocupa" el save, asi que mejor guardarlo enseguida

            camera.context.translate(
                grid.position.x, -grid.position.y
            );

            // ciclo que dibuja cada grid
            for (let entity of grid.entities){
                let oSprite = entity.sprite;
                let h = entity.position.y;
                let w = entity.position.x;
                
                if (oSprite.isReady){ 
                    let cached = oSprite.image;    
                    if (!cached) cached = oSprite.setCacheImage(indexMaxArea);

                    camera.context.globalCompositeOperation = oSprite.composite;
                    camera.context.drawImage(
                        cached, 
                        w   -grid.center.x  -camera.position.x  -oSprite.centerX, 
                        -h  -grid.center.y  +camera.position.y  +oSprite.centerY, 
                        oSprite.colSpan * 1, 
                        oSprite.rowSpan * 1
                    );
                    camera.context.globalCompositeOperation = "source-over";
                }
            }

            //ciclo extra para debuggear
            if (this.debug){
                for (let entity of grid.entities){
    
                    if (entity.collision){
                        let oCollision = entity.collision;
    
                        if (oCollision.type == "rectangle"){
                            camera.context.fillStyle = "rgba(255, 0, 0, 0.5)";
                            camera.context.fillRect(
                                entity.position.x + oCollision.offset.x - grid.center.x -camera.position.x,
                                - entity.position.y - oCollision.offset.y - grid.center.y +camera.position.y,
                                oCollision.width,
                                oCollision.height);
                        }
    
                        if (oCollision.type == "circle"){
                            camera.context.beginPath();
                            camera.context.arc(
                                entity.position.x + oCollision.offset.x - grid.center.x + oCollision.width/2 -camera.position.x,
                                - entity.position.y - oCollision.offset.y - grid.center.y + oCollision.height/2 +camera.position.y, 
                                oCollision.radius, 
                                0, 2 * Math.PI, false);
                            camera.context.fillStyle = "rgba(255, 0, 0, 0.5)";
                            camera.context.fill();
                        }
                    }
                    
                }
            }
        }

        // dibujamos la camara en en caanvas principal
        this.context.drawImage(
            camera.canvas, 
            (this.canvas.width/100)*camera.hPosition, 
            (this.canvas.height/100)*camera.vPosition, 
            (this.canvas.width/100)*camera.widthPercent, 
            (this.canvas.height/100)*camera.heightPercent
        );
    }

}


