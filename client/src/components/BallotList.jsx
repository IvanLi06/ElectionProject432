import React, {useState, useEffect} from "react";
import getData from "../utils/getData";
import TimelineIcon from "@mui/icons-material/Timeline";
import HowToVoteIcon from "@mui/icons-material/HowToVote";
import {IconButton, Paper, Stack} from "@mui/material";
import {styled} from "@mui/material/styles";

import {useNavigate} from "react-router-dom";

const BallotList = ({userId, userType}) => {
    const [societyID, setSocietyID] = useState(null);
    const [ballots, setBallots] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const token = localStorage.getItem("token");

    const navigate = useNavigate(); // Hook to navigate to different routes

    const handleViewBallot = (ballot) => {
        console.log("handling ballot view");
        navigate("/election-view", { state: { ballotData: ballot } });
    };

    const handleViewBallotStatus = (ballot) => {
        console.log("handling ballot view status");
        navigate("/election-status", { state: { ballotID: ballot.id } });
    };

    useEffect(() => {
        const fetchSociety = async () => {
            try {
                const data = await getData(`/societies/user/${userId}`, token);
                console.log("data",data);

                if (userType === "member" || userType === "officer") {
                    const fetchedSocietyID = data[0];
                    console.log("fetchedSocietyID",fetchedSocietyID);
                    setSocietyID(data[0]);
                    console.log("societyId",societyID);
                }
            } catch (err) {
                setError(err.message);
                console.log(err)
            }
        };

        // Only fetch if user is a member or officer
        if (userType === "member" || userType === "officer") {
            fetchSociety();
        }
    }, [userId, userType, token]);

    useEffect(() => {
        const fetchBallots = async () => {
            try {
                if (societyID) {
                    const ballotData = await getData(
                        `/ballots/society/${societyID}`,
                        token
                    );
                    // Process only active ballots
                    setBallots(ballotData);
                    console.log(ballotData);
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (societyID) {
            fetchBallots();
        }
    }, [societyID, token]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div>
            <h2>Ballot List</h2>
            {societyID ? (
                <>
                    <p>Society ID: {societyID}</p>

                    {ballots.length !== 0 ? (
                        <Stack spacing={2}>
                            {ballots.map((ballot, index) => (
                                <Item key={index}>
                                    {ballot.title}
                                    {userType === "officer" ? (
                                        <>
                                            {/* <TimelineIcon /> */}
                                            <IconButton
                                                aria-label="status"
                                                size="large"
                                                onClick={() => handleViewBallotStatus(ballot)}
                                            >
                                                <TimelineIcon fontSize="inherit" />
                                            </IconButton>
                                        </>
                                    ) : (
                                        <></>
                                    )}
                                    {/* <HowToVoteIcon /> */}
                                    <IconButton
                                        aria-label="status"
                                        size="large"
                                        onClick={() => handleViewBallot(ballot)}
                                    >
                                        <HowToVoteIcon fontSize="inherit" />
                                    </IconButton>
                                </Item>
                            ))}
                        </Stack>
                    ) : (
                        <p>Sorry, no active ballots were found.</p>
                    )}
                </>
            ) : (
                <p>No society found for this user.</p>
            )}
        </div>
    );
};

const Item = styled(Paper)(({theme}) => ({
    backgroundColor: "#fff",
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: "center",
    color: theme.palette.text.secondary,
    ...theme.applyStyles("dark", {
        backgroundColor: "#1A2027",
    }),
}));

export default BallotList;
