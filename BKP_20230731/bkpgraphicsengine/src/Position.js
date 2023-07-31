class Position{
	/**
	 * Control position in coordinates x and y in objects
	 * options{onChange} function(Position) execute every time x or y changes
	 * 
	 * @param {int} x
	 * @param {int} y
	 * @param {object} options
	 */
	constructor(x=0, y=0, options = {}){
		this.uid = 'Position'+(new Date().getTime());
		this._x = x;
		this._y = y;
		this._lastx = x;
		this._lasty = y;
		this._afterFunction = {};
		this._afterFunctionCount = 0 ;

        let {
            onChange = false
        } = options;

		this._onChange = onChange;
	}
	get x(){
		return this._x;
	}
	set x(val){
		this._lastx = this._x;
		this._x = val;	
		if(this._onChange) this._onChange(this);
		this.executeAfterFunction();
	}
	get y(){
		return this._y;
	}
	set y(val){
		this._lasty = this._y;
		this._y = val;
		if(this._onChange) this._onChange(this);
		this.executeAfterFunction();
	}
	get lastX(){
		return this._lastX;
	}
	get lastY(){
		return this._lastY;
	}
	/**
	 * Set the exact position of x and y
	 * Shorthand of set.x and set.y 
	 * 
	 * @param {int} x
	 * @param {int} y
	 */
	set(x,y){
		this._lastx = this._x;
		this._lasty = this._y;
		this._x = x;
		this._y = y;
		if(this._onChange) this._onChange(this);
		this.executeAfterFunction();
	}

	/**
	 * Add the position x and y to the current position
	 * 
	 * @param {int} x
	 * @param {int} y
	 */
	move(x,y){
		this._lastx = this._x;
		this._lasty = this._y;
		this._x+= x;
		this._y+= y;
		if(this._onChange) this._onChange(this);
		this.executeAfterFunction();
	}

	/**
	 * Copy all movements of another position
	 * 
	 * @param {Position} anotherPosition
	 */
	follow(anotherPosition){
		let thisPosition = this;
		let followFunction = function(oPos){
			thisPosition.move(oPos.x-oPos.lastX, oPos.y-oPos.lastY);
		};

		anotherPosition.addAfterFunction(this.uid, followFunction);
	}

	/**
	 * remove the follow() link between 2 Positions
	 * 
	 * @param {Position} anotherPosition
	 */
	unfollow(anotherPosition){
		anotherPosition.removeAfterFunction(this.uid);
	}

	/**
	 * set a function(x,y) tha execute every time x or y changes
	 * 
	 * @param {function} onchange
	 */
	set onChange(onchange){
		this._onChange = onchange;
	}

	/**
	 * allow to execute functions after x or y changes
	 * this functions execute after the 'onChange' function
	 * 
	 * @param {string} id
	 * @param {function} afterFunction
	 */
	addAfterFunction(id,afterFunction){
		this._afterFunction[id] = afterFunction;
		this._afterFunctionCount++;
	}

	/**
	 * remove a fuction added with addAfterFunction() using id
	 * 
	 * @param {string} id
	 */
	removeAfterFunction(id){
		if (this._afterFunctionCount > 0) {
			delete this._afterFunction[id];
			this._afterFunctionCount--;
		}
	}

	/**
	 * execute all afterFunctions stored
	 */
	executeAfterFunction(){
		if (this._afterFunctionCount > 0){
			let keys = Object.keys(this._afterFunction);

			for(let key of keys){
				this._afterFunction[key](this);
			}
		}
	}
    /**
	 * calcule the distance from this to another position "oPos"
     * 
     * @param {position} oPos
     * @return {number} distance
	 */
    distanceTo(oPos){
        return ((this.x - oPos.x) ** 2 + (this.y - oPos.y) ** 2) ** (1/2);
    }

    /**
	 * sum this position with another position, and return a new instance with both added
     * 
     * @param {position} another
     * @return {position} added
	 */
    add(another){
        return new Position(this.x + another.x, this.y + another.y);
    }

    /**
	 * substract this position with another position, and return a new instance with both substract
     * 
     * @param {position} another
     * @return {position} substracted
	 */
    sub(another){
        return new Position(this.x - another.x, this.y - another.y);
    }

    /**
	 * clone the Position
     * 
     * @return {position} cloned
	 */
    clone(){ 
        return new Position(this.x, this.y);
    }
}