const fetch = require(`node-fetch`);

require(`dotenv`).config();

const headers = {
  'Accept':'application/json',
  'x-api-key':process.env.KEY
};

async function hasUpdated(modPackId) {
    const res = await fetch(`https://api.curseforge.com/v1/mods/${modPackId}/files`, {
        method: `GET`,
        headers
    });
    const serverPackId = (await res.json()).data[0].serverPackFileId;
    
    const serverPack = await fetch(`https://api.curseforge.com/v1/mods/${modPackId}/files/`+serverPackId, {
        method: `GET`,
        headers
    });

    const lastUpdate = (await serverPack.json()).data.fileDate;

    return new Date(lastUpdate).getTime() >= new Date(date.setDate(date.getDate()-1)).getTime();
};

module.exports = {
    hasUpdated
};