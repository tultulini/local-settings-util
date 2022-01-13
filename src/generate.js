import path from 'path'
import { promises as fs } from 'fs'
import{  getSettingsKeyVaultEntries } from './adjust-kv-values/index.js'
import { exec } from "child_process";


global.__dirname = path.resolve('./');

const createLocalSettingsFile = async () => {
    const localAppSettings = await convertDownloadedAppSettings()
    const secretEntries = getSettingsKeyVaultEntries(localAppSettings)
    for (const prop in secretEntries) {
        const entry = secretEntries[prop]
        const results = removeUnwantedChars(await getSecretVal(entry))
        localAppSettings.Values[prop] = results

    }
    await fs.writeFile('output\\local.settings.json', JSON.stringify(localAppSettings, null, '\t'))

}
const removeUnwantedChars = (val) => {
        return val.replaceAll('\\r\\n', '').replaceAll('\r\n', '').replaceAll('\"', '')
}
const getSecretVal = (secretEntry) => {
    console.log(`Getting secret value for ${JSON.stringify(secretEntry, null, '\t')}`);
    //secretName, keyVaultName
    return new Promise((resolve, reject) => {
        exec(`az keyvault secret show --name ${secretEntry.secretName} --vault-name ${secretEntry.keyVaultName} --query "value" `, (error, stdout, stderr) => {
            if (error) {
                console.log(`error: ${error.message}`)
                reject(error.message)
                return;
            }
            if (stderr) {
                console.log(`stderr: ${stderr}`)
                reject(stderr)
                return;
            }
            resolve(stdout)
            console.log(`stdout: ${stdout}`)
        });

    })
}

const convertDownloadedAppSettings = async () => {
    const json = (await fs.readFile('output\\functionapp_settings.json')).toString()
    const functionProperties = JSON.parse(json)
    const localAppSettings = {
        "IsEncrypted": false,
        Values: functionProperties.reduce((previousValue, currentValue) => {
            previousValue[currentValue.name] = currentValue.value
            return previousValue
        }, {})
    }

    await fs.writeFile('output\\local.settings.json', JSON.stringify(localAppSettings, null, '\t'))
    return localAppSettings

}

await createLocalSettingsFile()
