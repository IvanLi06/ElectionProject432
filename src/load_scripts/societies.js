const fs = require('fs').promises;
const path = require('path');

async function readAllSocieties(){
    let societies = [];
    const filePath = path.join(__dirname, './resources/societies.psv');
    
    try{
        const data = await fs.readFile(filePath, 'utf8');
        
        const lines = data.split('\n');
        // For each line create a json object
        lines.forEach((line) => {
            const soc_attr = line.split('|');
            if (soc_attr.length < 4) {
                return;
            }
            // id, name, abbrev, research_area
            const society = {
                id: parseInt(soc_attr[0].trim(), 10),
                name: soc_attr[1].trim(),
                abbrev: soc_attr[2].trim(),
                research_area: soc_attr[3].trim(),
                createdAt: new Date(),
                updatedAt: new Date(),
            }
            // Append it to societies
            societies.push(society);
        });
        return societies;
    } catch (err){
        console.error('Error reading the file:', err);
        return [];
    }
    
}

module.exports = { readAllSocieties };
