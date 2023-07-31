class SFXPlayer {
	
	constructor(soundUrlList){

		this._isPlaying = false;
		this._canPlayWhilePlaying = false
		
		this.sfxDic = soundUrlList;
		this.player = new Audio();

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
	}

	finishPlaying(){
		this.playing = false;
	}

	set playing(isIt){
		this._isPlaying = isIt;
	}

	get playing(){
		return this._isPlaying;
	}

	play(name){

		if( !this._canPlayWhilePlaying && this.playing ){
			return;
		}

		if( name == null ){
			this.player.load();
		}else{
			this.changeSFX(name);
		}
		
		this.startPlaying();
		this.player.play();
	}
}