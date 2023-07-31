
class Collision{
    /**
     * Controls the collisions of entities,
     * Currently there are only 2 types: "rectangle" and "circle".
     * 
     * @param {string} type 
     * @param {object} options 
     */
    constructor(type = "rectangle", options = {}) {

		this.uid = 'Collision'+(new Date().getTime());
        
        let {
            offset = new Position(),
            width = 1,
            height = 1,
            radius = 0.5,
            entity = null
        } = options;

        this.type = type;
		this.offset = offset;
        this.width = width;
        this.height = height;
        this.radius = radius;
        this.entity = entity;
    }

    /**
     * Checks if this collision is colliding with another collision or an array of collisions
     * 
     * @param {Array[Collision]|Collision} target 
     * @returns boolean
     */
    collide(target) {
        let result = false;

        if (target.constructor.name === "Collision"){
            return this.colideCollision(target);
        }

        if (target.constructor.name === "Array"){
            let max = target.length;
            for(let i = 0; i < max; i++){
                if (this.colideCollision(target[i])){
                    result = true;
                    i = max;
                }
            }
        }

        return result;
    }

    /**
     * Checks if this collision is colliding with another collision
     * 
     * @param {Collision} target 
     * @returns boolean
     */
    colideCollision(target){

        let result = false;

        if      (!this.entity)         throw new Error("This collision doesn't have a parent entity");
        else if (!this.entity.grid)    throw new Error("This collision doesn't have a parent grid");
        else if (!target.entity)        throw new Error("Target collision doesn't have a parent entity");
        else if (!target.entity.grid)   throw new Error("Target collision doesn't have a parent grid");
        else{
            let a = this.entity.position.sub(this.entity.grid.center).add(this.entity.grid.position).add(this.offset);
            let b = target.entity.position.sub(target.entity.grid.center).add(target.entity.grid.position).add(target.offset);

            if (this.type == "rectangle"){
                if (target.type == "rectangle"){
                    if (a.x > (b.x-this.width) && a.x < (b.x+this.width)){
                        if (a.y > (b.y-this.height) && a.y < (b.y + this.height)){
                            result = true; 
                        }
                    }
                }
            }

            if (this.type == "circle"){
                if (target.type == "circle"){
                    let acenter = new Position(this.width/2, this.height/2);
                    let bcenter = new Position(target.width/2, target.height/2);
                    a = a.add(acenter);
                    b = b.add(bcenter);

                    let distance = a.distanceTo(b);

                    if (distance < (this.radius + target.radius)){
                        result = true;
                    }
                }
            }
        }

        return result;

    }

    /**
     * Clone this object
     * 
     * @returns Collision
     */
    clone(){
        return new Collision(this.type, {
            offset:new Position(this.offset.x, this.offset.y),
            width: this.width,
            height: this.height,
            radius: this.radius,
            entity: this.entity
        })
    }
}
