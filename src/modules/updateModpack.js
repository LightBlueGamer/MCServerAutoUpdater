const { exec } = require('child_process');
const { readFileSync } = require('fs');
const JSZip = require("jszip");
const zip = new JSZip();

async function updateModpack(url, serverFolder, serverId) {
    exec(`cd "${serverFolder}" && curl "https://pan.litecraft.org/api/client/servers/${serverId}/power" \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer ${process.env.APIK}' \
  -d '{
  "signal": "stop"
}' `, (err, stdout, stderr) => {
        if (err) {
            console.error(err)
        } else {
            exec(`wget "${url}"`, async (err, stdout, stderr) => {
                if (err) {
                    console.error(err)
                } else {
                    const urlArr = url.split("/");
                    const zipFile = urlArr[urlArr.length-1];
                    let toDir = "";
                    let toRemove;
                    const data = await readFileSync(zipFile);
                    const zipped = await zip.loadAsync(data)
                    const files = Object.keys(zipped.files);
                    const mapped = files.map(file => file.split('/')[0]);
                    toRemove = [...new Set(mapped)];
                    if(toRemove.length > 1) toDir = `-d ${serverFolder}/${zipFile.replace('.zip', '')}`;
                    console.log(`1: ${toRemove}`);
                    console.log(`2: ${toDir}`);
                    const command = `unzip "${zipFile}" ${toDir}`;
                    console.log(command);
                    exec(`unzip "${zipFile}" ${toDir}`, (err, stdout, stderr) => {
                        if (err) {
                            console.error(err)
                        } else {
                            const modpackFolder = zipFile.replace('.zip', '');
                            exec(`rm -drf ${toRemove.join(" ")}`, (err, stdout, stderr) => {
                                if (err) {
                                    console.error(err)
                                } else {
                                    for(const file of toRemove) {
                                        exec(`mv ${serverFolder}/${modpackFolder}/${file} ${serverFolder}`)
                                    };
                                    exec(`rm -drf ${modpackFolder} && curl "https://pan.litecraft.org/api/client/servers/${serverId}/power" \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer ${process.env.APIK}' \
  -d '{
  "signal": "start"
}' `, (err, stdout, stderr) => {
                                        if (err) {
                                            console.error(err)
                                        } else {
                                            console.log(stderr);
                                            console.log(stdout);
                                            console.log("Modpack updated!")
                                        }
                                    })
                                }
                            })
                        }
                    })
                }
            });
        }
    });
};

module.exports = {
    updateModpack
};