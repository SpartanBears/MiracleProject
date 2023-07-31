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
		pgPool.end()
		return resp;
	}catch(err){
		console.error(err);
		throw err;
	}
}

class NPCRace{
	constructor(id, raceName, isActive=true, isDeleted=false){
		this.id = id;
		this.name = raceName;
		this.is_active = isActive;
		this.is_deleted = isDeleted;
	}

	getInsertRaceParams(){return [ this.name, this.is_active, this.is_deleted ];}
	getDeleteParams(){return [ this.id, false, true ]}
	getUpdateParams(){return [ this.name, this.is_active, this.id ]}
}

async function createRace(name, isActive, isDeleted){

	let newRace = new NPCRace(null, name, isActive, isDeleted);
	let query = queryDictionary.npc_race.create

	try{
		let params = newRace.getInsertRaceParams();
		console.log( {params} )
		let resp = await middleMula(query, params);
		console.log({resp})
	}catch(err){
		console.error(err);
	}
}
async function getRace(id){

	let query = queryDictionary.npc_race.get;

	try{
		
		let resp = await middleMula(query, [id]);
		let {rows} = resp;
		console.log({rows})
	}catch(err){
		console.error(err);
	}
}
async function updateRace(id, name, isActive=true){

	let newRace = new NPCRace(id, name, isActive);
	let query = queryDictionary.npc_race.update;

	try{
		let params = newRace.getUpdateParams();
		console.log( {params} )
		let resp = await middleMula(query, params);
		console.log({resp})
	}catch(err){
		console.error(err);
	}
}
async function deleteRace(id){

	let newRace = new NPCRace(id);
	let query = queryDictionary.npc_race.delete

	try{
		let params = newRace.getDeleteParams();
		console.log( {params} )
		let resp = await middleMula(query, params);
		console.log({resp})
	}catch(err){
		console.error(err);
	}
}

class NPCRaceClass{
	constructor(id, name, raceId ){
		this.id = id;
		this.name = name;
		this.raceId = raceId;
	}
	getInsertRaceClassParams(){return [this.name, this.raceId]}
	getUpdateParams(){return [this.id, this.name, this.raceId]}
}

exports = {
	createRace
	,getRace
	,updateRace
	,deleteRace
}

async function createRaceClass(name, raceId){
	let newRaceClass = new NPCRaceClass(null, name, raceId);
	let query = queryDictionary.npc_race_class.create

	try{
		let params = newRaceClass.getInsertRaceClassParams();
		console.log( {params} )
		let resp = await middleMula(query, params);
		console.log({resp})
	}catch(err){
		console.error(err);
	}
}
async function getRaceClass(id){
	let query = queryDictionary.npc_race_class.get;

	try{
		
		let resp = await middleMula(query, [id]);
		let {rows} = resp;
		console.log({rows})
		return rows;
	}catch(err){
		console.error(err);
	}
}
async function updateRaceClass(id, name, raceId){
	let newRace = new NPCRaceClass(id, name, raceId);
	let query = queryDictionary.npc_race.update;

	try{
		let params = newRace.getUpdateParams();
		console.log( {params} )
		let resp = await middleMula(query, params);
		console.log({resp})
	}catch(err){
		console.error(err);
	}
}
async function deleteRaceClass(id){
	throw 'NO IMPLEMENTADO'
}

// createRace('waska')
// getRace(1)

// createRaceClass( 'test', 1 )
// getRaceClass(1)