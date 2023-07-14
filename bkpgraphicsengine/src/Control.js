
class Control {
	/**
	 * 
	 * @param {function} callbackDown 
	 * @param {function} callbackUp 
	 * @param {ControlBtns} controlBtns 
	 * @param {object} mouseController 
	 */
	constructor( callbackDown, callbackUp = null, returnObject ){

		this.callbackDown       = callbackDown;
		this.callbackUp         = callbackUp;
		this.returnObject       = returnObject;
		this.activeControls     = {};
        this.useClick           =	true
		
		this.setEvents();
		this.setMouseEvents();
	}

	setMouseEvents(){
		// for( let evt in controls ){

		// 	window.addEventListener(evt, controls[evt]);
		// }
	}

	capture(customCallback){
		if(!!this.callbackDown){
			this.callbackDown(this.activeControls, this.returnObject);
		}
		if(!!customCallback){
			customCallback();
		}
	}

	setEvents(){
        let thisControl = this;
		function downEventFunction(event){
			thisControl.preDown();
			let key = event.key;
			thisControl.activeControls[key] = true;
            //if(!!thisControl.callbackDown){thisControl.callbackDown(thisControl.activeControls, thisControl.returnObject);} crea lag mientras pesiona
			thisControl.postDown();
		}

		function upEventFunction(event){
			thisControl.preUp();
			let key = event.key;
			delete thisControl.activeControls[key];
			if(!!thisControl.callbackUp) thisControl.callbackUp();
			thisControl.postUp()
		}

		window.addEventListener('keydown', downEventFunction);
		window.addEventListener('keyup', upEventFunction);

		if(this.useClick){
			window.addEventListener('mousedown', ()=>{
				let key = 'mousedown';
				this.activeControls[key] = true;
			});

			window.addEventListener('mouseup', ()=>{
				let key = 'mousedown';
				delete this.activeControls[key];
			})
		}
	}

	preDown(){
		
	}

	postDown(){
		
	}

	preUp(){

	}

	postUp(){

	}

}