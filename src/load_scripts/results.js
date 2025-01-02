const fs = require('fs').promises;
const path = require('path');

async function readAllResults() {
    let results = [];
    const filePath = path.join(__dirname, './resources/votes_candidates_ballots.psv');

    try {
        const data = await fs.readFile(filePath, 'utf8');
        const lines = data.split('\n');

        // For each line create a json object
        for (let i = 1; i < lines.length; i++) {
            const results_attr = lines[i].split('|');
            if (results_attr.length < 3) {
                console.error('Invalid line:', lines[i]);
                continue; // Skip invalid lines
            }

            // Election ID|Office ID|Candidate ID
            const result = {
                ballotID: parseInt(results_attr[0].trim(), 10),
                officeID: parseInt(results_attr[1].trim(), 10),
                candidateID: results_attr[2].trim() === '' ? null : parseInt(results_attr[2].trim(), 10),
                createdAt: new Date(),
                updatedAt: new Date(),
            };
            results.push(result);
        }

        return results; 

    } catch (err) {
        console.error('Error reading the file:', err);
        return [];
    }
}

module.exports = { readAllResults };