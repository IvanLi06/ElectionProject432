const fs = require('fs').promises;
const path = require('path');
const { Ballot } = require('../models');

async function readAllCandidates(){
    const filePath = path.join(__dirname, './resources/candidates.psv');
    
    try {
        const data = await fs.readFile(filePath, 'utf8');
        
        let lines = data.trim().split('\n');

        for (let i = 1; i < lines.length; i++) {
            const attr = lines[i].split('|');
            if (attr.length < 9) {
                // console.log(`Skipping line ${i}, invalid data.`);
                continue;
            }

            // Parse attributes
            const candidateID = parseInt(attr[0].trim(), 10);
            const officeID = parseInt(attr[1].trim(), 10);
            const ballotID = parseInt(attr[2].trim(), 10);

            // console.log(`Processing Ballot ID: ${ballotID}, Office ID: ${officeID}, Candidate ID: ${candidateID}`);
            
            // Fetch the ballot
            let ballot = await Ballot.findOne({ where: { id: ballotID } });
            if (!ballot) {
                // console.log(`Ballot with ID ${ballotID} not found.`);
                continue;
            }

            // Load ballot content
            let content = ballot.content || {};
            let offices = content.offices || {};

            // Initialize office if it doesn't exist
            if (!offices[officeID]) {
                offices[officeID] = {
                    title: attr[3].trim(),
                    allowedVotes: parseInt(attr[4].trim(), 10),
                    candidates: {} // Initialize candidates as an empty object
                };
            }

            // Add candidate to the office's candidates
            offices[officeID].candidates[candidateID] = {
                firstname: attr[5].trim(),
                lastname: attr[6].trim(),
                credentials: attr[7].trim(),
                bio: attr[8].trim() // Assuming bio is the 9th attribute
            };

            // Update ballot content and save
            content.offices = offices;
            ballot.content = content;
            ballot.changed('content', true); // Explicitly mark the content as changed
            
            await ballot.save();
            // console.log(`Updated Ballot ID: ${ballotID} with Office ID: ${officeID} and Candidate ID: ${candidateID}`);
        }
    } catch (err) {
        console.error('Error reading the file:', err);
    }
}

module.exports = { readAllCandidates };
