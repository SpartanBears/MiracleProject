// GridCanvas se encarga de dibujar y SFXPlayer de cargar los sonidos
const GC    = new GridCanvas('mainCanvas',{backgroundColor:"Lavender",gridSquared:18, debug:false});
const SFX   = new SFXPlayer({floppa_miau: './sfx/floppa/miau.ogg', puaj: './sfx/floppa/guah.wav'});

//los objetos se manejan en layers
let test  = new GridLayer();
let cerco = new GridLayer();

// en los layers se pueden colocar GameObject, que tienen propiedades del juego (colisiones vida, posicion, etc..)
let X = new Entity(['img/isometric/green.svg'], {});
let _ = new Entity(['img/isometric/brown.svg'], {});
let O = new Entity(['img/isometric/dither.svg'], {collision:new Collision("circle",{radius:0.1}),});

// "flop" sera un gameObject mas complejo, con varios sprites (algunos animados)
let sptFront    = new Sprite('img/floppa/front.svg');
let sptFrontMv  = new Sprite(['img/floppa/front_1.svg', 'img/floppa/front_2.svg'],{ticks:15});
let sptLeft     = new Sprite('img/floppa/left.svg');
let sptLeftMv   = new Sprite(['img/floppa/left_1.svg','img/floppa/left_2.svg'],{ticks:15});
let sptBack     = new Sprite('img/floppa/back.svg');
let sptBackMv   = new Sprite(['img/floppa/back_1.svg','img/floppa/back_2.svg'],{ticks:15});

//pasamos nuestros sprites a un objeto para despues ponerlo en el constructor de "flop" (GameObject)
let flopSprites = {
    front:      sptFront,
    frontMove : sptFrontMv,
    left:       sptLeft,
    leftMove:   sptLeftMv,
    back:       sptBack,
    backMove:   sptBackMv,
}

//los layers necesitan una matriz para colocar objetos
let customGrid = [
    [_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_],
    [_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_],
    [_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_],
    [_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_],
    [_,_,_,X,X,_,X,_,X,_,X,_,X,_,X,X,_,_,_,X,_,_,X,_,_,_,_,X,_,_,_],
    [_,_,X,_,_,_,X,_,X,_,X,_,X,_,X,_,X,_,X,_,X,_,X,_,_,_,X,_,X,_,_],
    [_,_,X,_,_,_,X,X,X,_,X,_,X,_,X,X,_,_,X,X,X,_,X,_,_,_,X,_,X,_,_],
    [_,_,X,_,_,_,X,_,X,_,X,_,X,_,X,_,_,_,X,_,X,_,X,_,_,_,X,_,X,_,_],
    [_,_,_,X,X,_,X,_,X,_,X,X,X,_,X,_,_,_,X,_,X,_,X,X,X,_,_,X,_,_,_],
    [_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_],
    [_,_,_,X,_,_,_,X,_,_,X,_,_,X,X,_,_,_,X,X,_,X,X,X,_,X,_,_,_,_,_],
    [_,_,_,X,X,_,X,X,_,X,_,X,_,X,_,X,_,X,_,_,_,X,_,_,_,X,_,_,_,_,_],
    [_,_,_,X,_,X,_,X,_,X,X,X,_,X,X,_,_,X,_,_,_,X,X,X,_,X,_,_,_,_,_],
    [_,_,_,X,_,_,_,X,_,X,_,X,_,X,X,_,_,X,_,_,_,X,_,_,_,X,_,_,_,_,_],
    [_,_,_,X,_,_,_,X,_,X,_,X,_,X,_,X,_,_,X,X,_,X,X,X,_,X,X,X,_,_,_],
    [_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_],
    [_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_],
    [_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_],
    [_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_],
]

let cercogrid = []

for (let i = 0; i < 19; i++) {
    if (i == 0 || i == 18) {
        let temp = [];
        for (let j = 0; j < 31; j++) {
            temp.push(O);
        }
        cercogrid.push(temp);
    }else{
        let temp = [];
        temp[0] = O;
        temp[30] = O;
        cercogrid.push(temp);
    }
}

test.isometric(customGrid,true);
cerco.isometric(cercogrid,true);

cerco.position.move(0,0.5);

// un objeto Control para ejecutar la funcion "move" mas abajo
let controles = new Control(move, stopMove, null);

//"flop" tendra todos los sprites anteriores, y ademas se le paso la opcion que inicie en "front"
let flop = new Entity(flopSprites, {collision:new Collision("circle"), index:"front", grid:cerco});

//si los objetos tienen un layer asignado, ellos puede colocarse ellos mismos (como el layer "objects")
GC.addGrid(test);
GC.addGrid(cerco);

GC.focus = flop;

GC.start(ctx =>{
    controles.capture();
});

//controla el teclado
function move(dp){
    let velX = 1/4;
    let velY = 1/8;

    //no diagonal
    if(dp["w"] && !dp["a"] && !dp["d"]){
        GC.moveAllLayers(0,-velY);
    }
    if(dp["a"] && !dp["w"] && !dp["s"]){
        GC.moveAllLayers(velX,0);
    }
    if(dp["s"] && !dp["a"] && !dp["d"]){
        GC.moveAllLayers(0,velY);
    }
    if(dp["d"] && !dp["w"] && !dp["s"]){
        GC.moveAllLayers(-velX,0);
    }

    //diagonal
    if(dp["w"] && dp["d"]){
        GC.moveAllLayers(-velX,-velY);
    }
    if(dp["w"] && dp["a"]){
        GC.moveAllLayers(velX,-velY);
    }
    if(dp["s"] && dp["d"]){
        GC.moveAllLayers(-velX,velY);
    }
    if(dp["s"] && dp["a"]){
        GC.moveAllLayers(velX,velY);
    }

    //sprites
    if(dp["d"]){
        flop.index = "leftMove";
        flop.sprite.flipX = true;
    }
    if(dp["a"]) {
        flop.index = "leftMove";
        flop.sprite.flipX= false;
    }
    if(dp["w"]){
        flop.index = "backMove";
    }
    if(dp["s"] ) {
        flop.index = "frontMove";
    }

    if(dp["g"]) {SFX.play('puaj')}
    //if(dp[controls.click]){SFX.play('puaj')}
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