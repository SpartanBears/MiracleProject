var characters = [];
var nameRooster = [
	"Evangelicus",
	
];

while(nameRooster.length > 0){

	characters.push(createNewCharacter(nameRooster.pop(), getRandomNumber(10,57)));
}

console.log(characters);


