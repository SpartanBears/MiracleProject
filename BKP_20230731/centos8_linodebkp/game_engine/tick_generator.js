const fs = require('fs');

const project_paths = JSON.parse(fs.readFileSync('/opt/miracle_project/paths.json'));

const tools = require(project_paths.tools_js);

const conf_engine_params = JSON.parse(fs.readFileSync(project_paths.conf_engine_parameters));

//test();

async function test(){

    let startTS = new Date().getTime();

    await generateTick();

    let endTS = new Date().getTime();

    console.log(endTS - startTS);

    return true;
}

async function generateTick(){

    await tools.sleep(conf_engine_params.tick_generator_ms_perTick);

    return true;
}

exports.generateTick = generateTick;
