class SFXPlayer {
	
	constructor(soundUrlList, callbackEnd, config={}){

		this._isPlaying = false;
		this._canPlayWhilePlaying = false
		
		this.sfxDic = soundUrlList;
		this.player = new Audio();

		this.callbackEnd = callbackEnd;
		this.volume = config.hasOwnProperty('volume')? config.volume:1;

		this.setEvents();
	}

	setEvents(){
		this.player.addEventListener('canplay', (e)=>{
			this.onCanPlay(e)
		});
		this.player.addEventListener('ended', (e)=>{
			this.onEnded(e)
		});
	}

	onCanPlay(e){
		
	}

	onEnded(e){
		this.finishPlaying();
	}

	changeSFX(name){
		this.player.src = this.sfxDic[name];
		this.player.load();
	}

	startPlaying(){
		this.playing = true;
		this.player.volume = this.volume
	}

	finishPlaying(callback){
		this.playing = false;
		if( !!this.callbackEnd )	this.callbackEnd(this);
	}

	set playing(isIt){
		this._isPlaying = isIt;
	}

	get playing(){
		return this._isPlaying;
	}

	get volume(){
		return this.player.volume;
	}

	set volume(newVolume){
		this.player.volume = newVolume;
	}

	get src(){
		return this.player.src;
	}

	play(name){

		if( !this._canPlayWhilePlaying && this.playing ){
			return;
		}

		if( name == null && this.player.src != '' ){
			
			this.player.load();
		}else if(this.player.src == '' && name == null){
			
			this.changeSFX(Object.keys(this.sfxDic)[0]);
		}else{

			this.changeSFX(name);
		}
		
		this.startPlaying();
		
		this.player.play();
	}

	stop(){
		this.player.pause();
		this.player.currentTime = 0;
	}
}