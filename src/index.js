const { getURL } = require('./modules/getUrl');
const { updateModpack } = require('./modules/updateModpack');
const { hasUpdated } = require('./modules/checkForUpdate');
const modpacks = require('../modpacks.json')

async function run() {
    for(const {folder, id, sId} of modpacks) {
        const url = await getURL(id);
        if(await hasUpdated(id)) await updateModpack(url, folder, sId);
    }
};

run();
