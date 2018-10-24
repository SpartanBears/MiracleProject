var characters = [];
var nameRooster = [
	"Evangelicus",
	"Totope",
	"Matracas",
	"Transmundane"
];

while(nameRooster.length > 0){

	characters.push(createNewCharacter(nameRooster.pop()));
}

console.log(characters);


