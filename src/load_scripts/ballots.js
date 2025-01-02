const fs = require('fs').promises;
const path = require('path');

async function readAllBallots(){
    let ballots = [];
    const filePath = path.join(__dirname, './resources/ballots.psv');
    
    try{
        const data = await fs.readFile(filePath, 'utf8');
        
        let lines = data.trim().split('\n');

        // For each line create a json object
        for (let i = 1; i < lines.length; i++) {
            const ball_attr = lines[i].split('|');
            if (ball_attr.length < 5) {
                return;
            }
            // Election ID|Election Title|Society ID|Start Date|End Date
            const ballot = {
                id: parseInt(ball_attr[0].trim(), 10),
                title: ball_attr[1].trim(),
                societyID: parseInt(ball_attr[2].trim(), 10),
                starttime: new Date(ball_attr[3].trim()),
                endtime: new Date(ball_attr[4].trim()),
                content: null,
                active: true,
                locked: false,
                lockedBy: null,
                createdAt: new Date(),
                updatedAt: new Date(),
            }
            // Append it to ballots
            ballots.push(ballot);
        };

        return ballots;
    } catch (err){
        console.error('Error reading the file:', err);
        return [];
    }
    
}

module.exports = { readAllBallots };
