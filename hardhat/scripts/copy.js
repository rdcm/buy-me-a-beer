const fs = require('fs');
const path = require('path');

function main() {
    const fileName = 'Wallet.json';
    // eslint-disable-next-line no-undef
    const contractsDir = path.join(__dirname, '../../', 'frontend/contracts');
    // eslint-disable-next-line no-undef
    const artifactsDir = path.join(__dirname, '../', 'artifacts/contracts/Wallet.sol');

    if(!fs.existsSync(contractsDir)) {
        fs.mkdirSync(contractsDir)
    }

    fs.copyFileSync(path.join(artifactsDir, fileName), path.join(contractsDir, fileName));
}

main();