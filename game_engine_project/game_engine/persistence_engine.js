const { Pool } = require('pg');
const fs = require('fs');

const project_paths = JSON.parse(fs.readFileSync('/opt/miracle_project/paths.json'));
const queryDictionary = JSON.parse(fs.readFileSync(project_paths.queries_folder+'query_dictionary.json'));
let pgCreds = require(project_paths.queries_folder+'db_creds.json');

async function middleMula( query, params ){
	let pgPool = false;

	try{

		pgPool = new Pool(pgCreds);
		let resp = await pgPool.query(query, params);
		return resp;
	}catch(err){
		console.error(err);
		throw err;
	}
}

/*
	asunc function hacerAlgo(params, pgPool){}
*/
class NPC {
	constructor(id, name, npcType, npcRace, npcRaceClass
		, baseLvl, baseLvlExpCurrent, baseLevelExpTotal
		, str, agi, vit, int, dex, luk, isActive, isDeleted
	){
		this.id											= id;
		this.name										= name;
		this.npc_type_id						= npcType;
		this.npc_race_id						= npcRace;
		this.npc_race_class_id			= npcRaceClass;
		this.base_level							= baseLvl;
		this.base_level_exp_current	= baseLvlExpCurrent;
		this.base_level_exp_total		= baseLevelExpTotal;
		this.stat_str								= str;
		this.stat_agi								= agi;
		this.stat_vit								= vit;
		this.stat_int								= int;
		this.stat_dex								= dex;
		this.stat_luk								= luk;
		this.is_active							= isActive;
		this.is_deleted							= isDeleted;
	}

	get NPCInsertParams(){
		let that = this;
		return [that.name,
			that.npc_type_id,
			that.npc_race_id,
			that.npc_race_class_id,
			that.base_level,
			that.base_level_exp_current,
			that.base_level_exp_total,
			that.stat_str,
			that.stat_agi,
			that.stat_vit,
			that.stat_int,
			that.stat_dex,
			that.stat_luk,
			true, false, 
			getNPCHash()
		]
	}
}

//TODO
function getNPCHash(){
	return "";
}

async function createNPC(name, type, race, raceClass, baseLvl, currentExp, totalExp, str, agi, vit, int, dex, luk){

	let newNPC = new NPC(null, name, type, race, raceClass, baseLvl, currentExp, totalExp, str, agi, vit, int, dex, luk)

	let query = queryDictionary.npc.create

	try{
		let params = newNPC.NPCInsertParams;
		console.log( {params} )
		let resp = await middleMula(query, params);
		console.log({resp})
	}catch(err){
		console.error(err);
	}
}
async function updateNPM(){}
async function deleteNPC(npcId){

}

async function getNPC(name){

	let query = queryDictionary.npc.get

	try{
		let {rows} = await middleMula(query)
		console.log({rows})
	}catch(err){
		console.error(err);
	}

	// console.log( 'hola mundo', query )
}


exports = {
	npc:{
		getNPC
		,createNPC
		,updateNPM
		,deleteNPC
	}
}

getNPC()
// createNPC('testingo', 1, 1, 1, 1, 1, 100, 12, 23, 499, 22, 1, 0)
