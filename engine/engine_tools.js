module.exports = {

	getRandomNumber: getRandomNumber,
};

/*	
	getRandomNumber

	Parameters
		[number] lower limit, 
		[number] upper limit,
		[bool] isLimit
	
	if lower & upper are INT
		return will always be integer
	else
		return will be double
	
	Includes limits on result

*/
function getRandomNumber(lower, upper){

	return Math.floor((Math.random()*upper)+lower);
}