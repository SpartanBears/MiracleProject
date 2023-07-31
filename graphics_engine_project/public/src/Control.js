/**
 * eso solo se hizo para diferenciar los tipos de clicks
 */
const mouseEnum = {
	1: 'LEFT_MOUSE',
	2: 'MIDDLE_MOUSE',
	3: 'RIGHT_MOUSE',
}

let canvasElement = document.querySelector('#mainCanvas');

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

		// 	canvasElement.addEventListener(evt, controls[evt]);
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

	resetActiveControls(event){
		this.activeControls = {};
		if( !!this.callbackUp )	this.callbackUp();
	}

	setActiveControlReseters(){
		let that = this;
		let resetControls = (e)=>{
			return that.resetActiveControls(e)
		};
		canvasElement.addEventListener('visibilitychange', resetControls, false)
		canvasElement.addEventListener('contextmenu', resetControls, false);
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
			canvasElement.addEventListener('mousedown', (e)=>{

				switch(mouseEnum[e.which]){
					case 'LEFT_MOUSE':
						let key = 'mousedown';
						this.activeControls[key] = true;
					break;
				}
			});

			canvasElement.addEventListener('mouseup', (e)=>{
				switch(mouseEnum[e.which]){
					case 'LEFT_MOUSE':
						let key = 'mousedown';
						delete this.activeControls[key];
					break;
				}
			})
		}

		this.setActiveControlReseters();
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