class GridLayer {
    constructor() {

		this.uid = 'GridLayer'+(new Date().getTime());
        this.entities = [];
        this.entitiesLength = 0;

        this._center = new Position();
        this._position = new Position();
    }

    get center(){
        return this._center;
    }

    set position(pos){
        this._position = pos;
    }
    
    get position(){
        return this._position;
    }

    grid(array, clone = false){
        
        let heigth = array.length;
        let width = 0;
            
        for (let row of array) if (row) width = (row.length > width) ? row.length: width;

        let cx = ((heigth % 2) > 0)? (heigth - 1) / 2 : heigth/2;
        let cy = ((width % 2)  > 0)? (width -  1) / 2 : width/2;

        for (let row = 0; row < heigth; row++){
            for (let col = 0; col < width; col++){
                if (array[row] && array[row][col]){
                    let cloned = array[row][col];
                    if (clone) cloned = cloned.clone();
                    cloned.position.set(col-cy,cx-row);
                    this.addEntity(cloned);
                }
            }
        }
    }

    isometric(array, clone = false){
        
        let heigth = array.length;
        let width = 0;

        let isoX = 0.5;
        let isoY = 0.25;
        let error = 0.003;

        isoX = isoX - error;
        isoY = isoY - error;
            
        for (let row of array) if (row) width = (row.length > width) ? row.length: width;

        let cx = ((heigth % 2) > 0)? (heigth - 1) / 2 : heigth/2;
        let cy = ((width % 2)  > 0)? (width -  1) / 2 : width/2;

        for (let row = 0; row < heigth; row++){
            for (let col = 0; col < width; col++){
                if (array[row] && array[row][col]){
                    
                    let x = col-cy;
                    let y = cx-row;

                    let cloned = array[row][col];
                    if (clone) cloned = cloned.clone();
                    cloned.position.set((x * isoX ) + (y * isoX ) , (y * isoY ) - (x * isoY ));

                    this.addEntity(cloned);
                }
            }
        }
    }

	addEntity(newItem){	
        this.entities.push(newItem);
        newItem.grid = this;
        this.entitiesLength++;
    }

    isColliding(otherGrid, ignore = []){
        let collided = false;
        let thisGrid = this;

        for (let thisCell of thisGrid.entities){
            if (thisCell.collision){
                for (let otherCell of otherGrid.entities){
                    if (otherCell.collision && !ignore.includes(otherCell)){
                        collided = thisCell.collision.collide(otherCell.collision);
                        if (collided) break;     
                    }
                }
            }
            if (collided) break;  
        }
        
        return collided;
    }

}