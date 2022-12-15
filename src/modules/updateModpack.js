const { exec } = require('child_process');
const { readdirSync } = require('fs');

async function updateModpack(url, serverFolder) {
    exec(`cd "${serverFolder}"`, (err, stdout, stderr) => {
        if (err) {
            console.error(err)
        } else {
            exec(`wget "${url}"`, (err, stdout, stderr) => {
                if (err) {
                    console.error(err)
                } else {
                    const urlArr = url.split("/");
                    const zipFile = urlArr[urlArr.length-1];
                    exec(`unzip "${zipFile}"`, (err, stdout, stderr) => {
                        if (err) {
                            console.error(err)
                        } else {
                            const modpackFolder = zipFile.replace('.zip', '');
                            const packFiles = readdirSync(`${serverFolder}/${modpackFolder}`);
                            const mainFiles = readdirSync(serverFolder);
                            const toRemove = [];
                            for(const file of packFiles) {
                                if(mainFiles.includes(file)) toRemove.push(file);
                            };
                            exec(`rm -drf ${toRemove.join(" ")}`, (err, stdout, stderr) => {
                                if (err) {
                                    console.error(err)
                                } else {
                                    for(const file of toRemove) {
                                        exec(`mv ${serverFolder}/${modpackFolder}/${file} ${serverFolder}`)
                                    };
                                    exec(`rm -drf ${modpackFolder}`, (err, stdout, stderr) => {
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