var EngineTools = require("./engine_tools.js");
var CharRace = require("./char_race.js");
var CharSkill = require("./char_skill.js");
var CharClass = require("./char_class.js");
var CharBase = require("./char_base.js");

module.exports = {

	attack:attack,

}

/*
	Combat is always 1 on 1, even when the Adventurer is in a party.

	- Damage
		ATK vs DEF and MATK vs MDEF
			ATK is the ammount of HP deducted from the enemy if the attack succedes
			DEF is the percentage of ATK mitigated
			i.e: 100 ATK vs 36.5 DEF = Defender gets damaged for 64 points

	- Evasion
		HIT vs EVA
		HIT and EVA are bot integers that interact as inverses.
		i.e: 100 HIT vs 100 EVA = 0 (50% chance of landing an attack)
		Using the example above, we will define that 0 represents 50% of landing an attack.
		Every 10/100 (not sure yet) points 5% will be added to that probability.
		i.e: 110 HIT vs 100 EVA = 10 (55% of landing an attack).
		The same logic applies for EVA > HIT.
		Every 13 points of LUK the total amount of HIT/EVA will be increased by 0.01.
		Same example: 110 HIT (50 LUK) vs 100 EVA (11 LUK)
		110 * (1 + ((50/13)*0.01)) HIT vs 100 * (1 + ((11/13)*0.01))
		110 * 1.03 vs 100 * 1
		113 vs 100 = 13/10*0.05 = 0.5 + 0.065 = 0.565 chance of hit

	- ASPD
		Every encounter will have a timer in milliseconds.
		Every Character will perform an action every X milliseconds depending on their ASPD.
		An ASPD of 1.2 allows the character to do an action every 800 milliseconds.
		An ASPD of 0.5 forces the character to just do an action every 1500 milliseconds.
		Attacks are instantaneous. Skills may, or may not, have a delay (SEE CSPD).

	- CSPD
		Skills/Spells may have a delay, CSPD reduces that delay by a percentage.
		If the Skill/Spell has a 2 second delay, and the character has 0.5 CSPD,
		the delay of using/casting that Skill/Spell will be 1 second.

	- Critical Strike/Success
		Depending on characters LUK, every action can have a "critical success".
		The formula to calculate how LUK effects an event is:

			Item drops
				Base Prob. * (1+(LUK*0.02))

			Attack (50% extra damage), Works with damaging skills
				Critical attacks have a base prob. of 0.01 at 1 LUK
				Every 13 points of LUK you get 0.1 extra
				0.01 + (Math.floor(LUK/13)*0.1)

			Defense (75% damage reduction), Works with healing skills
				Critical defense have a base prob. of 0.01 at 1 LUK
				Every 17 points of LUK you get 0.125 extra
				0.01 + (Math.floor(LUK/17)*0.1)


*/

function attack(attacker, defender){


}



