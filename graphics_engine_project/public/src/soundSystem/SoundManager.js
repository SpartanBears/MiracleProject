
class SoundManager{
	/**
	 * 
	 * @param {string} tag - identificador del sound manager
	 * @param {number} maxSounds - cantidad maxima de sonidos simultaneos que permite el sound manager
	 * @param {float} managerVolume - volumen del manager
	 * @param {object} config
	 * @param {boolean} autoPlay - TODO
	 * @param {boolean} inSecuence - TODO
	 * @param {boolean} loop - flag que evita que sonidos ya reproducidos se eliminen, sino que los devuelve a queue
	 */
	constructor(tag, maxSounds, managerVolume=1, config){

		this.tag = tag;

		this._maxSounds = maxSounds;

		let {
			autoPlay= true
			,inSecuence= false
			,loop = false
		} = config;

		this._autoPlay = autoPlay;
		this._inSecuence = inSecuence;
		this._loop = loop;

		this.queue = [];
		this.currentPlaying = [];
		this.managerVolume = managerVolume;
		this._managerVolumeDirty = false;
		this._changingTrack = false
	}

	get currentManagerVolume(){
		return this.managerVolume;
	}
	/**
	 * 
	 * @param {string[]|string} urls - url de archivos de sonido
	 */
	addtoQueue(urls){
		if( Array.isArray(urls) ){

			this.queue = [...this.queue, urls];
		}else{

			this.queue.push(urls)
		}
	}

	/**
	 * 
	 * @param {string} url - url del archivo de sonido a reproducir
	 * @param {boolean} addtoQueue - flag que indica si se debe o no ingresar al queue en caso de que se exceda la cantidad de sonido permitidos
	 * @param {float} volume - NACIO MUERTO
	 * @returns 
	 */
	addToPlay(url, addtoQueue=false, volume){

		if( this.currentPlaying.length >= this._maxSounds && addtoQueue ){

			this.addtoQueue(url)
			return;
		}else if( this.currentPlaying.length >= this._maxSounds ){
			return;
		}

		let that = this;
		
		let callback = function(_player){
			let index = that.currentPlaying.indexOf(_player);
			
			if( that._loop ){
				
				that.addtoQueue(_player.src)
			}
			that.currentPlaying.splice(index, 1);
			that.onFinishPlay();
		}

		let audioVolume = volume || this.managerVolume
		let player = new SFXPlayer({url:url}, callback, {volume:audioVolume});

		this.currentPlaying.push( player );
		player.play()
		this._changingTrack = false;
	}

	/**
	 * metodo llamado al finalizar la reproduccion de un sonido
	 */
	onFinishPlay(){
		
		if( this._autoPlay && this.queue.length ){
			let nextAudio = this.queue.shift();
			this.addToPlay(nextAudio, true,  this.managerVolume)
		}
	}
	/**
	 * 
	 * @param {float} vol - valor a setear el volumen del manager y de todos los reproductores actualmente reproduciendo  
	 */
	setVolume(vol){
		this._managerVolumeDirty = true
		this.managerVolume = vol;
		this.currentPlaying.forEach(p=>{
			p.volume = vol;
		})
	}

	/**
	 * 
	 * @param {float} amount - sube el volumen 
	 */
	volUp(amount){
		this._managerVolumeDirty = true
		this.currentPlaying.forEach(p=>{
			let finalVol = this.managerVolume + amount
			if( (finalVol) >= 1.0 )	finalVol = 1;

			p.volume = finalVol;
			this.managerVolume = finalVol;
		})
	}
	/**
	 * 
	 * @param {float} amount - baja el volumen 
	 */
	volDown(amount){
		this._managerVolumeDirty = true
		this.currentPlaying.forEach(p=>{
			let finalVol = this.managerVolume - amount
			if( (finalVol) <= 0.0 )	finalVol = 0;

			p.volume = finalVol;
			this.managerVolume = finalVol;
		})
	}
	/**
	 * detiene todos los reproductores y envia las urls de los sonidos a queue
	 */
	stopAll(){
		let srcs = [];
		this.currentPlaying.forEach(p=>{
			p.stop();
			srcs.push(p.src)
		})

		this.queue = [...srcs, ...this.queue];
		this.currentPlaying = [];
	}
	/**
	 * @return {boolean} indica si el manager tiene sonido actualmente reproduciendoce
	 */
	get managerStopped(){
		return this.currentPlaying.length <= 0;
	}

	/**
	 * intenta reproducir las siguientes sonidos almacenados en el queue
	 */
	resumeAll(){
		for( let i=this.currentPlaying.length; i<this._maxSounds; i++ ){
			let url = this.queue.shift()
			this.addToPlay(url);
		}
	}
	/**
	 * reproduce el siguiente elemento en el array de queue
	 */
	playNext(){

		if( this._changingTrack )	return;

		this._changingTrack = true;

		// remove player from current playing
		let fstPlayer = this.currentPlaying.shift();
		if( fstPlayer == null && this.queue.length ){
			
			this.addToPlay( this.queue.shift() )
			this._changingTrack = false;
			return;
		}else if( fstPlayer == null && this.queue.length==0 ){
			console.error( 'no se encontro audio' )
			this._changingTrack = false;
			return;
		}

		// stop playing first in currentPlaying
		let url = fstPlayer.player.src;
		fstPlayer.stop();

		// send url to queue
		this.addtoQueue(url);

		this.onFinishPlay();
		this._changingTrack = false;
	}
}