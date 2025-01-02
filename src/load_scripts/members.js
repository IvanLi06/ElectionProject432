const fs = require('fs').promises;
const path = require('path');
const { UserType} = require('../models');

async function readAllMembers(){
    const filePath = path.join(__dirname, './resources/members.psv');
    
    try{
        const data = await fs.readFile(filePath, 'utf8');
        
        const lines = data.trim().split('\n');
        // Member ID|First Name|Last Name|Username|HashedPassword|Society ID|Role

        // Skip the first line 
        const userAttributes = lines.slice(1).map(line => line.split('|')).filter(attrs => attrs.length >= 6);

        // Get all user types
        const userTypeMap = await createUserTypeMap();

        // Process user attributes to construct user objects
        const membersWithSocieties = userAttributes.map(user_attr => {
            const userTypeID = userTypeMap[user_attr[6].trim().toLowerCase()];

            if (!userTypeID) return null; // Skip if the userTypeID is not found

            return [
                {
                    id: parseInt(user_attr[0].trim(), 10),
                    firstname: user_attr[1].trim(),
                    lastname: user_attr[2].trim(),
                    email: user_attr[3].trim(), // Using username instead of email
                    password: user_attr[4].trim(), 
                    userTypeID: userTypeID,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                parseInt(user_attr[5].trim(), 10) // Society ID
            ];
        }).filter(member => member !== null); // Remove null entries

        return membersWithSocieties;

    } catch (err){
        console.error('Error reading the file:', err);
        return [];
    }
    
}

// Helper function to create a user type map for fast lookup
async function createUserTypeMap() {
    const userTypes = await UserType.findAll();
    return userTypes.reduce((map, userType) => {
        map[userType.description.toLowerCase()] = userType.id; // Case-insensitive mapping
        return map;
    }, {});
}

module.exports = { readAllMembers };
