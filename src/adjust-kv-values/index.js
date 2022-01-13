import { promises as fs, createReadStream } from 'fs'
import readline from 'readline'
const KEYVAULT_TOKEN = "@Microsoft.KeyVault(SecretUri=https://"
const SECTRETS_TOKEN = "secrets/"



const getSettingsKeyVaultEntries = (localSettings) => {
    const localSettingsSecrets = {}
    let found = false
    for (const prop in localSettings.Values) {
        const currentVal = localSettings.Values[prop]
        if (!currentVal) {
            continue
        }
        let pos = 0
        if ((pos = currentVal.indexOf(KEYVAULT_TOKEN) < 0)) {
            continue;
        }

        pos += (KEYVAULT_TOKEN).length
        const keyVaultName = currentVal.substring(pos, currentVal.indexOf('.', pos))

        pos = currentVal.indexOf(SECTRETS_TOKEN, pos)
        if (pos < 0)
            continue

        pos += SECTRETS_TOKEN.length
        const secretName = currentVal.substring(pos, currentVal.indexOf('/', pos + 1))
        console.log(`secret Name: ${secretName}`);
        localSettingsSecrets[prop] = { secretName, keyVaultName }

        found = true
    }
    return found
        ? localSettingsSecrets
        : null

}



async function processLineByLine(fileName, delegate) {
    const fileStream = createReadStream(fileName);

    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
    });
    // Note: we use the crlfDelay option to recognize all instances of CR LF
    // ('\r\n') in input.txt as a single line break.

    for await (const line of rl) {
        // Each line in input.txt will be successively available here as `line`.
        console.log(`Line from file: ${line}`);
        delegate(line);
    }
}
export {getSettingsKeyVaultEntries }
// export default reconcileKvValues;