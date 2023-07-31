// GridCanvas se encarga de dibujar y SFXPlayer de cargar los sonidos
const GC    = new GridCanvas('mainCanvas',{debug:false});
const SFX   = new SFXPlayer({floppa_miau: './sfx/floppa/miau.ogg', puaj: './sfx/floppa/guah.wav'});

//los objetos se manejan en layers
let background  = new GridLayer();
let objects     = new GridLayer();
let player      = new GridLayer();


let sd = new SoundManager('fx', 1, 0.1, {});
let bgMusic = new SoundManager('bg', 1, true, {inSecuence:true, autoPlay: true, loop: true});

//los layers los veran camaras
let mainCamera = new Camera();
let miniCamera = new Camera({widthPercent: 25, heightPercent: 25, hPosition: 75, tiles:700});

//agregamos nuestras camaras al renderer
GC.cameras = {main: mainCamera, mini: miniCamera}
GC.mainCamera = "main";

// en los layers se pueden colocar GameObject, que tienen propiedades del juego (colisiones vida, posicion, etc..)
let base = new Entity(['img/base.svg'], {});
let bloc = new Entity(['img/block.svg'], {collision:new Collision("rectangle")});
let fire = new Entity(['img/trasparent.png'], {grid:objects, position: new Position(0,-1)});
let swrd = new Entity(['img/3x3.png'], {grid:objects, position: new Position(2,3)});

//ejemplo de sprite credo en un entity
let energyBall = new Entity(
new Sprite('img/anim/projectiles/Energy ball/EnergyBall.png' , {ticks:5, sheet:true, composite:"hard-light"}),
    {grid:objects, position: new Position(2,1)}
);

fire.sprite.composite = "lighter";

//agregaremos una entidad de largo 2
let twerSprite  = new Sprite('img/isometric/eiffel.png',{rowSpan:2, centerY: -1});
let twer        = new Entity(twerSprite, {grid:objects, position: new Position(3,0),collision:new Collision("rectangle")});

// "flop" sera un gameObject mas complejo, con varios sprites (algunos animados)
let sptFront    = new Sprite('img/floppa/front.svg');
let sptFrontMv  = new Sprite(['img/floppa/front_1.svg', 'img/floppa/front_2.svg'],{ticks:15});
let sptLeft     = new Sprite('img/floppa/left.svg');
let sptLeftMv   = new Sprite(['img/floppa/left_1.svg','img/floppa/left_2.svg'],{ticks:15});
let sptBack     = new Sprite('img/floppa/back.svg');
let sptBackMv   = new Sprite(['img/floppa/back_1.svg','img/floppa/back_2.svg'],{ticks:15});

//pasamos nuestros sprites a un objeto para despues ponerlo en el constructor del GameObject "flop"
let flopSprites = {
    front:      sptFront,
    frontMove : sptFrontMv,
    left:       sptLeft,
    leftMove:   sptLeftMv,
    back:       sptBack,
    backMove:   sptBackMv,
}

//"flop" tendra todos los sprites anteriores, y ademas se le paso la opcion que inicie en el sprite "front"
let flop = new Entity(flopSprites, {collision:new Collision("rectangle"), index:"front"});

// un objeto Control para ejecutar la funcion "move()" y "stopMove()" mas abajo
let controles = new Control(move, stopMove);
 
//a los layers se les agregaran entities utilizando una matriz de objectos entity y la funcion "grid()" el cual los ordenara en forma de rejilla
//(es necesario clonar los objetos usando "clone()", ya que sino intentara poner el mismo objeto en todos los lugares)
let customGrid = [];
for (let x = 0; x < 18; x++){
    let col = [];
    for (let y = 0; y < 18; y++){
        if (y == 0 || y == 17 || x == 0 || x== 17) col.push(bloc.clone());
        else col.push(base.clone());
    }
    customGrid.push(col);
}
customGrid[2][2] = bloc.clone();
customGrid[2][3] = bloc.clone();
customGrid[7][8] = bloc.clone();

//si los objetos tienen un layer asignado, ellos puede colocarse ellos mismos (como el layer "objects")
background.grid(customGrid);
player.grid([[flop]]);

// ahora agregaremos los layers al gridCanvas
GC.addGrid(background);
GC.addGrid(player);
GC.addGrid(objects);

// la camara principal seguira al floppa
mainCamera.position.follow(flop.position);

GC.start(ctx =>{
    controles.capture();
});

//las funciones que controlan el teclado
function move(button){
    
    let xAcc = 0, yAcc = 0;

    if(button['d']){
        moveFlop(1,0);
        flop.index = "leftMove";
        flop.sprite.flipX = true;
    }
    if(button['a']) {
        moveFlop(-1,-0);
        flop.index = "leftMove";
        flop.sprite.flipX = false; 
    }
    if(button['w']){
        moveFlop(0,1);
        flop.index = "backMove";
    }
    if(button['s'] ) {
        moveFlop(0,-1);
        flop.index = "frontMove";
    }

    function moveFlop(vx,vy){
        let vel = 1/8;
        let x = flop.position.x;
        let y = flop.position.y;

        flop.position.move(vel * vx, vel * vy);
        if (flop.isColliding(background) || flop.isColliding(objects)) flop.position.set(x,y);
    }

    if(button['f'])         {SFX.play('floppa_miau')}
    if(button['mousedown']) {
        // for( let a = 0; a<20; a++ ){

            sd.addToPlay('./sfx/floppa/miau.ogg', true, 0.3)
        // }

        // bgMusic.addToPlay('./sfx/Ludum Dare 32 - Track 3.wav', true, 0.01)
    }
    if(button['q'])         {Object.values(flop.sprites).forEach(sprite => {sprite.hue--;});}
    if(button['e'])         {Object.values(flop.sprites).forEach(sprite => {sprite.hue++;});}
    if(button['z'])         {Object.values(flop.sprites).forEach(sprite => {sprite.sat--;});}
    if(button['c'])         {Object.values(flop.sprites).forEach(sprite => {sprite.sat++;});}
    if(button['ArrowUp'])   {Object.values(flop.sprites).forEach(sprite => {sprite.lum--;});}
    if(button['ArrowDown']) {Object.values(flop.sprites).forEach(sprite => {sprite.lum++;});}
    if(button['+']) bgMusic.volUp(.01);
    if(button['-']) bgMusic.volDown(.01);
    // if(button['/']) sd.volDown(.01);
    if(button['*']){
        bgMusic.playNext();
        delete button['*']
    }
    if( button['o'] ){
        bgMusic.stopAll()
    }
    if( button['p'] ){
        bgMusic.resumeAll();
    }
}
function stopMove(dp, controls){
    if (flop.index == "frontMove"){
        flop.index = "front";
    }
    if (flop.index == "leftMove"){
        let currentFlipX = flop.sprite.flipX;
        flop.index = "left";
        flop.sprite.flipX = currentFlipX;
    }
    if (flop.index == "backMove"){
        flop.index = "back";
    }
        
}

bgMusic.addtoQueue('./sfx/ost/bg/Ludum Dare 32 - Track 1.wav')
bgMusic.addtoQueue('./sfx/ost/bg/Ludum Dare 32 - Track 2.wav')
bgMusic.addtoQueue('./sfx/ost/bg/Ludum Dare 32 - Track 3.wav')
bgMusic.addtoQueue('./sfx/ost/bg/Ludum Dare 32 - Track 4.wav')


let slider = document.querySelector('#volumeSlider');
slider.value = bgMusic.currentManagerVolume*100
slider.addEventListener('input', function(e){
    e.preventDefault()
    let value = e.srcElement.value;
    value = parseFloat(value)
    value = (value/100)
    bgMusic.setVolume( value )
})