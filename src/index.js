const { getURL } = require('./modules/getUrl');
const { updateModpack } = require('./modules/updateModpack');
const { hasUpdated } = require('./modules/checkForUpdate');

const modpacks = []

(async ()=>{
    for(const {folder, id} of modpacks) {
        const url = await getURL(id);
        if(await hasUpdated(id)) await updateModpack(url, folder);
    }
})();
