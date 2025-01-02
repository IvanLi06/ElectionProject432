const fs = require('fs').promises;
const path = require('path');

async function readAllVotes() {
    let votes = [];
    const filePath = path.join(__dirname, './resources/votes_members_ballots.psv');

    try {
        const data = await fs.readFile(filePath, 'utf8');
        const lines = data.split('\n');

        // For each line create a json object
        for (let i = 1; i < lines.length; i++) {
            const votes_attr = lines[i].split('|');
            if (votes_attr.length < 2) {
                console.error('Invalid line:', lines[i]);
                continue; // Skip invalid lines
            }

            // Member ID|Election ID
            const vote = {
                userID: parseInt(votes_attr[0].trim(), 10),
                ballotID: parseInt(votes_attr[1].trim(), 10),
                hasVoted: true,
                votedTime: new Date(), 
                createdAt: new Date(),
                updatedAt: new Date(),
            };
            votes.push(vote);
        }

        // console.log('Votes read from file:', votes);
        return votes; 

    } catch (err) {
        console.error('Error reading the file:', err);
        return [];
    }
}

module.exports = { readAllVotes };