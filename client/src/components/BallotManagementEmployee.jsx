import { useEffect, useState } from "react";
import getData from "../utils/getData";
import {
  Box,
  Button,
  Paper,
  Typography,
} from "@mui/material";
import deleteData from "../utils/deleteData";
import { useNavigate } from "react-router-dom";


const BallotManagementEmployee = ({ user }) => {
  console.log(user);
  const [societies, setSocieties] = useState([]);
  const [ballots, setBallots] = useState({});
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  const navigate = useNavigate(); // Hook to navigate to different routes


  // Fetch societies
  useEffect(() => {
    let endpoint = "";

    if (user.userType === "admin") {
      endpoint = "/societies"; // Show all societies for admin
    } else if (user.userType === "employee") {
      endpoint = `/societies/user/${user.id}`; // Show assigned societies for employee
    }

    getData(endpoint, token)
      .then((data) => {
        setSocieties(data); // List of society IDs
      })
      .catch((error) => {
        console.error("Error fetching societies:", error);
      });
  }, [user, token]);

  // Fetch ballots for all societies
  useEffect(() => {
    if (societies.length > 0) {
      const fetchBallots = async () => {
        const ballotsData = {};
        for (const societyId of societies) {
          try {
            const details = await getData(`/ballots/society/${societyId}`, token);
            ballotsData[societyId] = details || [];
          } catch (error) {
            console.error("Error fetching ballots:", error);
            ballotsData[societyId] = [];
          }
        }
        setBallots(ballotsData);
        setLoading(false);
      };

      fetchBallots();
    }
  }, [societies, token]);


  const handleEditBallot = async (ballot) =>  {
    console.log(`Edit ballot with ID: ${ballot.id}`);
    console.log(ballot);
    await lockBallot(ballot.id, user.id);
    navigate("/edit-ballot", { state: { ballotData: ballot } });
  };

  const handleDeleteBallot = async (ballotId, societyId) => {
    console.log(`Delete ballot with ID: ${ballotId}`);
    try {
        // Make an API request to delete the ballot
        await deleteData(`/ballots/${ballotId}`, token);  // Ensure endpoint and token are correct
        
        // Remove the ballot from state
        setBallots((prev) => {
            const updatedBallots = { ...prev };
            updatedBallots[societyId] = updatedBallots[societyId].filter(
                (ballot) => ballot.id !== ballotId
            );
            return updatedBallots;
        });

        // Optional: Display a success message or feedback to the user
        console.log("Ballot deleted successfully");

    } catch (error) {
        console.error("Error deleting ballot:", error);
        // Optional: Display an error message to the user in the UI
    }
};


  const handleViewBallot = (ballot) => {
    console.log(`View ballot with ID: ${ballot.id}`);
    console.log(ballot);
    // Implement the logic to view the ballot content
    // You can display a modal or navigate to a detailed page
    navigate("/view-ballot", { state: { ballotData: ballot } });
  };

  const lockBallot = async (ballotId, userId) => {
    const response = await fetch(`/ballots/${ballotId}/lock`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ userId }), // Send userId in the request body
    });

    const data = await response.json();
    if (data.message === 'Ballot locked for editing') {
        // Inform the user and allow editing
    } else {
        // Show an error message if it's already locked
    }
};

const handleCreateNewBallot = async (societyId) => {
  try {
    // check if I can use the getData utils
    const response = await fetch('/ballots/create', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
            societyId: societyId,
            userId: user.id,
        }),
    });

    console.log(response);

    if (!response.ok) {
        throw new Error('Failed to create a new ballot');
    }

    const resjson = await response.json();
    console.log(resjson);

    const ballot = resjson.data;

    console.log('Ballot created successfully:', ballot);
    navigate("/create-ballot", {
      state: { ballotData: ballot }
  });

} catch (error) {
    console.error('Error creating ballot:', error);
}
};


  if (loading) return <>Loading Ballots for userID: {user.id}</>;

  return (
    <Box
      component="section"
      sx={{
        p: 2,
        width: "70%",
        display: "flex",
        flexDirection: "column",
        gap: "15px",
        margin: "0 auto",
      }}
    >
    
      {societies.map((societyId) => (
        <Box
          key={societyId}
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            padding: 2,
            border: "1px solid #ccc",
            borderRadius: 1,
          }}
        >
          <Typography variant="h6">Society Id: {societyId}</Typography>
          <Button variant="outlined" onClick={() => handleCreateNewBallot(societyId)}>
            Create New Ballot
          </Button>

          {/* Show loading or ballot list */}
          {ballots[societyId]?.length === 0 ? (
            <Typography variant="body2" align="center">
              No ballots available
            </Typography>
          ) : (
            <Paper sx={{ p: 2 }}>
              {ballots[societyId]?.map((ballot) => (
                <Box
                  key={ballot.id}
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 1,
                    mb: 2,
                    border: "1px solid #ccc",
                    p: 2,
                    borderRadius: 1,
                  }}
                >
                  <Typography variant="h6">{ballot.title}</Typography>
                  <Box sx={{ display: "flex", flexDirection: "column" }}>
                    <Typography variant="body2">
                      Start Date: {new Date(ballot.starttime).toLocaleString()}
                    </Typography>
                    <Typography variant="body2">
                      End Date: {new Date(ballot.endtime).toLocaleString()}
                    </Typography>
                    <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
                    <Button variant="outlined" onClick={() => handleEditBallot(ballot)}>
                      Edit
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={() => handleDeleteBallot(ballot.id, societyId)}
                    >
                      Delete
                    </Button>
                    <Button variant="outlined" onClick={() => handleViewBallot(ballot)}>
                      View Content
                    </Button>
                  </Box>
                  </Box>
                  
                </Box>
              ))}
            </Paper>
          )}
        </Box>
      ))}
    </Box>
  );
};

export default BallotManagementEmployee;
