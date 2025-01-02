export const saveChanges = async (ballotId, userId, changes, exitAfterSave, token) => {
    try {
      const response = await fetch(
        `/ballots/${ballotId}/save`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            userId,
            changes,
            exitAfterSave,
          }),
        }
      );
      const data = await response.json();
      if (response.ok) {
        console.log(data.message);
      } else {
        console.error("Error:", data.message);
      }
    } catch (error) {
      console.error("Failed to save changes:", error);
    }
  };
  
  export const unlockBallot = async (ballotId, userId, token) => {
    try {
      const response = await fetch(
        `/ballots/${ballotId}/unlock`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ userId }),
        }
      );
      const data = await response.json();
      if (response.ok) {
        alert(data.message);
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Error unlocking ballot:", error);
      alert("An error occurred while unlocking the ballot");
    }
  };
  
  export const transformVotes = (votes) => {
    const transformedVotes = [];
  
    for (const [officeID, candidateIDs] of Object.entries(votes.offices)) {
      candidateIDs.forEach((candidateID) => {
        transformedVotes.push({
          officeID: parseInt(officeID, 10),
          candidateID: parseInt(candidateID, 10),
        });
      });
    }
  
    for (const [initiativeID, optionID] of Object.entries(votes.initiatives)) {
      transformedVotes.push({
        initiativeID: parseInt(initiativeID, 10),
        optionID: parseInt(optionID, 10),
      });
    }
  
    return transformedVotes;
  };
  