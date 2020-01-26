const fsPromises = require('fs').promises;
const _ = require('lodash');

const createVscodeLaunchConfigGenerator = (urlOfWebsite, themeName, pages) => {
    return function createVscodeLaunchConfig() {
        const settings = {
            // Use IntelliSense to learn about possible attributes.
            // Hover to view descriptions of existing attributes.
            // For more information, visit: https://go.microsoft.com/fwlink/?linkid=830387
            version: "0.2.0"
        };
        const templateOfConfig = {
            "type": "chrome",
            "request": "launch",
            "pathMapping": {
                "/": "${workspaceFolder}",
                [`/wp-content/themes/${themeName}/`]:"${workspaceFolder}"
            },
            "disableNetworkCache":true
        }

        const home = Object.assign({
            "name": `chrome 首頁`,
            "url": `${urlOfWebsite}`
        }, templateOfConfig);

        settings['configurations'] = [home];

        if (Array.isArray(pages)) {
            pages.forEach(page => {
                if (_.isObjectLike(page)) {
                    const pageName = page.name;
                    const pageUrl = page.url;
                    if (_.isString(pageName) && pageName != '' && _.isString(pageUrl) && pageName != '') {
                        const launchSetting = Object.assign({
                            "name": `chrome ${pageName}`,
                            "url": pageUrl
                        }, templateOfConfig);
                        settings['configurations'].push(launchSetting);
                    }
                }
            });
        }
        return new Promise((resolve, reject) => {
                    fsPromises.stat('./.vscode')
                              .then(stats => {
                                  if (stats.isDirectory()) {
                                      resolve();
                                  } else {
                                      const msg = `The folder of vscode settings is not a folder. ${stats}`;
                                      reject(msg);
                                  }
                              })
                              .catch(() => {
                                  fsPromises.mkdir('./.vscode')
                                            .catch(err => {
                                                const msg = `Can not create the folder of vscode settings. ${err}`;
                                                reject(msg);
                                            })
                                            .then(() => {
                                                resolve();
                                            });
                              });
                }).then(() => {
                    return fsPromises.writeFile('./.vscode/launch.json', JSON.stringify(settings));
                });
    };
}

//注意，即使只輸出一個變數也要用 module.exports 這種做法，不能用 exports =，否則型態會出錯。
module.exports = createVscodeLaunchConfigGenerator;