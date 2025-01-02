import React, {useEffect, useState} from "react";
import {useLocation, useNavigate} from "react-router-dom";
import {Card, Typography, Divider, Button, Box} from "@mui/material";

import Initiative from "./ballotComponents/Initiative";
import BallotDetails from "./ballotComponents/BallotDetails";
import Office from "./ballotComponents/Office";
import {unlockBallot} from "../utils/ballotUtils";

const Ballot = ({user, mode, isNewBallot = false}) => {
    const location = useLocation();

    const {ballotData} = location.state || {}; // Destructure to get ballotData

    // Ensure 'initiatives' is initialized to an empty object if not present in the ballotData
    const [editableBallotData, setEditableBallotData] = useState(() => {
        // Check if 'initiatives' exists; if not, initialize as an empty object
        const initializedBallotData = ballotData || {};

        if (!initializedBallotData.content) {
            initializedBallotData.content = {};
        }
        if (!initializedBallotData.content.hasOwnProperty("initiatives")) {
            initializedBallotData.content.initiatives = {};
        }
        if (!initializedBallotData.content.hasOwnProperty("offices")) {
            initializedBallotData.content.offices = {};
        }
        return initializedBallotData;
    });

    // Track the mode (Edit/Preview)
    const [isEditMode, setIsEditMode] = useState(mode === "edit");
    const [isUserFillMode, setIsUserFillMode] = useState(mode === "user_fill");
    const [votes, setVotes] = useState({});

    const token = localStorage.getItem("token");

    const navigate = useNavigate();

    useEffect(() => {
        console.log("editableBallotData updated:", editableBallotData);
        // Check if ballotData is available
    }, [editableBallotData]);
    
    

    ///////////////////////// GENERAL ///////////////////////////////

    const cancelChanges = async () => {
        if (!isNewBallot) {
            unlockBallot(editableBallotData.id, user.id, token);
            // redirect to previous page -> view ballots
            navigate("/employee/manage-ballots");
        } else {
            try {
                const response = await fetch(
                    `/ballots/${editableBallotData.id}`,
                    {
                        method: "DELETE",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                if (response.ok) {
                    console.log("Draft ballot cancelled successfully");
                    navigate("/employee/manage-ballots"); // Redirect to the manage ballots page
                } else {
                    console.error("Error cancelling draft ballot");
                }
            } catch (error) {
                console.error("Error during cancellation: ", error);
            }
        }
    };

    const saveAndStay = async () => {
        try {
            const ballotId = ballotData.id;
            const userId = user.id;
            const changes = editableBallotData;

            // Call saveChanges with `exitAfterSave` set to false to stay on the page
            await saveChanges(ballotId, userId, changes, false);

            // if savechanges throws an error, handle it here

            console.log("Changes saved, staying on page.");
        } catch (error) {
            console.error("Error saving changes:", error);
        }
    };

    const saveAndExit = async () => {
        try {
            const ballotId = ballotData.id;
            const userId = user.id;
            const changes = editableBallotData;

            // Call saveChanges with `exitAfterSave` set to true to exit after saving
            await saveChanges(ballotId, userId, changes, true);
            console.log("Changes saved, exiting to homepage.");
            // Redirect user to homepage
            window.location.href = "/home";
        } catch (error) {
            console.error("Error saving changes:", error);
        }
    };

    const saveChanges = async (ballotId, userId, changes, exitAfterSave) => {
        try {
            const response = await fetch(
                `/ballots/${ballotId}/save`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`, // Make sure `token` is defined with your user's token
                    },
                    body: JSON.stringify({
                        userId,
                        changes,
                        exitAfterSave, // This tells the backend if the ballot should be unlocked after saving
                    }),
                }
            );

            console.log(response);
            const data = await response.json();
            console.log(data);

            if (response.ok) {
                console.log(data.message); 
            } else {
                console.error("Error:", data.message);
            }
        } catch (error) {
            console.error("Failed to save changes:", error);
        }
    };

    const handleFieldChange = (value, field) => {
        setEditableBallotData((prevData) => ({
            ...prevData,
            [field]: value,
        }));
    };

    ///////////////////// SUBMIT //////////////////////////////

    const submitBallot = async () => {
        try {
            console.log("Submitted Votes:", votes);
            const response = await fetch(
                `/votes/vote`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Accept: "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        ballotID: ballotData.id,
                        userID: user.id,
                        votes: votes,
                    }),
                }
            );

            if (response.ok) {
                alert(
                    "Ballot submitted! Check the console for the selected votes."
                );
                navigate("/home", {state: {user}});
            } else {
                alert("Error: ", response);
            }
        } catch (error) {
            alert("Network error. Please check your connection and try again.");
            console.error("Login error:", error);
        }
    };

    const handleOfficeVoteChange = (
        officeId,
        candidateId,
        isMultiVote,
        allowedVotes
    ) => {
        setVotes((prevVotes) => {
            const currentVotes = prevVotes.offices?.[officeId] || [];

            if (!isMultiVote) {
                // Single-vote: replace the selection with the new candidate
                return {
                    ...prevVotes,
                    offices: {
                        ...prevVotes.offices,
                        [officeId]: [candidateId],
                    },
                };
            }

            const isSelected = currentVotes.includes(candidateId);

            if (isSelected) {
                return {
                    ...prevVotes,
                    offices: {
                        ...prevVotes.offices,
                        [officeId]: currentVotes.filter(
                            (id) => id !== candidateId
                        ),
                    },
                };
            }

            if (currentVotes.length < allowedVotes) {
                return {
                    ...prevVotes,
                    offices: {
                        ...prevVotes.offices,
                        [officeId]: [...currentVotes, candidateId],
                    },
                };
            }

            // No change if the limit is reached
            return prevVotes;
        });
    };

    const handleInitiativeVoteChange = (initiativeID, optionID) => {
        const updatedVotes = {...votes};

        if (!updatedVotes.initiatives) {
            updatedVotes.initiatives = {};
        }

        updatedVotes.initiatives[initiativeID] = [optionID]; // Save the initiativeID with the selected optionID

        setVotes(updatedVotes); // Update the votes state
    };

    ///////////////////// INITIATIVES //////////////////////////////
    const initiatives = editableBallotData.content.initiatives || {};

    const handleAddInitiative = () => {
        const newInitiativeId = (Date.now() % 1e7).toString(); // Generate a unique string ID
        const newInitiative = {
            id: newInitiativeId,
            title: "",
            description: "",
            options: {}, // Start with an empty options object
            selectedOption: "", // Track the selected option
        };

        setEditableBallotData((prevData) => ({
            ...prevData,
            content: {
                ...prevData.content,
                initiatives: {
                    ...prevData.content.initiatives,
                    [newInitiativeId]: newInitiative,
                },
            },
        }));
    };

    const handleDeleteInitiative = (initiativeKey) => {
        setEditableBallotData((prevData) => {
            const updatedInitiatives = { ...prevData.content.initiatives }; // Clone the current initiatives object
            delete updatedInitiatives[initiativeKey]; // Remove the specific key
    
            return {
                ...prevData,
                content: {
                    ...prevData.content,
                    initiatives: updatedInitiatives,
                },
            };
        });
    };

    const handleInitiativeChange = (initiativeID, field, updatedValue) => {
        const updatedInitiatives = {
            ...editableBallotData.content.initiatives,
            [initiativeID]: {
                ...editableBallotData.content.initiatives[initiativeID],
                [field]: updatedValue,
            },
        };

        setEditableBallotData((prevData) => ({
            ...prevData,
            content: {...prevData.content, initiatives: updatedInitiatives},
        }));
    };

    const handleAddOption = (initiativeID) => {
        const updatedInitiatives = {
            ...editableBallotData.content.initiatives, // Spread existing initiatives
            [initiativeID]: {
                ...editableBallotData.content.initiatives[initiativeID], // Spread the specific initiative
                options: {
                    ...editableBallotData.content.initiatives[initiativeID]
                        .options, // Spread existing options
                    [(Date.now() % 1e7).toString()]: "", // Add a new empty option with a unique timestamp key
                },
            },
        };

        setEditableBallotData((prevData) => ({
            ...prevData,
            content: {...prevData.content, initiatives: updatedInitiatives},
        }));
    };

    const handleDeleteOption = (initiativeID, optionKey) => {
        const updatedInitiatives = editableBallotData.content.initiatives.map(
            (initiative) => {
                if (initiative.id === initiativeID) {
                    const {[optionKey]: _, ...remainingOptions} =
                        initiative.options;
                    return {
                        ...initiative,
                        options: remainingOptions,
                    };
                }
                return initiative;
            }
        );
        setEditableBallotData((prevData) => ({
            ...prevData,
            content: {...prevData.content, initiatives: updatedInitiatives},
        }));
    };

    //////////////////////// CANDIDATES ///////////////////////////

    const handleCandidateChange = (officeKey, candidateKey, e) => {
        const {name, value} = e.target;
        setEditableBallotData((prevData) => {
            const updatedOffices = {...prevData.content.offices};
            updatedOffices[officeKey].candidates[candidateKey][name] = value;
            return {
                ...prevData,
                content: {...prevData.content, offices: updatedOffices},
            };
        });
    };

    const handleAddCandidate = (officeKey) => {
        const newCandidateKey = (Date.now() % 1e7).toString(); // Generate a unique key for the new candidate
        const newCandidate = {
            firstname: "",
            lastname: "",
            credentials: "",
            bio: "",
        };

        setEditableBallotData((prevData) => {
            const updatedOffices = {...prevData.content.offices};
            updatedOffices[officeKey].candidates[newCandidateKey] =
                newCandidate;
            return {
                ...prevData,
                content: {...prevData.content, offices: updatedOffices},
            };
        });
    };

    const handleDeleteCandidate = (officeKey, candidateKey) => {
        setEditableBallotData((prevData) => {
            const updatedOffices = {...prevData.content.offices};
            delete updatedOffices[officeKey].candidates[candidateKey];
            return {
                ...prevData,
                content: {...prevData.content, offices: updatedOffices},
            };
        });
    };

    ///////////////////////// OFFICES ///////////////////////////////
    const offices = editableBallotData.content.offices || {};

    const handleOfficeChange = (e, officeKey, field) => {
        const {value} = e.target;
        setEditableBallotData((prevData) => ({
            ...prevData,
            content: {
                ...prevData.content,
                offices: {
                    ...prevData.content.offices,
                    [officeKey]: {
                        ...prevData.content.offices[officeKey],
                        [field]:
                            field === "allowedVotes"
                                ? Math.min(Math.max(value, 1), 50) // Numeric handling for 'allowedVotes'
                                : value, // Direct assignment for text fields like 'title'
                    },
                },
            },
        }));
    };

    const handleAddOffice = () => {
        // To make sure we get a unique ID
        const newOfficeKey = (Date.now() % 1e7).toString(); // Max 7 digits
        
        const newOffice = {
            title: "",
            candidates: {},
            allowedVotes: 1, // Default to 1
        };
        setEditableBallotData((prevData) => {
            const updatedOffices = {...prevData.content.offices};
            updatedOffices[newOfficeKey] = newOffice;
            return {
                ...prevData,
                content: {...prevData.content, offices: updatedOffices},
            };
        });
    };

    const handleDeleteOffice = (officeKey) => {
        setEditableBallotData((prevData) => {
            const updatedOffices = {...prevData.content.offices};
            delete updatedOffices[officeKey];
            return {
                ...prevData,
                content: {...prevData.content, offices: updatedOffices},
            };
        });
    };

    return (
        <Card sx={{maxWidth: 600, margin: "20px auto", padding: 2}}>
            {/* Buttons */}

            {isEditMode && (
                <Box sx={{marginTop: 2}}>
                    <Button
                        onClick={saveAndStay}
                        variant="contained"
                    >
                        Save Changes
                    </Button>
                    <Button
                        onClick={saveAndExit}
                        variant="contained"
                    >
                        Save & Exit
                    </Button>
                    <Button
                        onClick={cancelChanges}
                        variant="outlined"
                    >
                        Cancel
                    </Button>
                </Box>
            )}

            {/* Ballot Details */}
            <BallotDetails
                ballotData={editableBallotData}
                isEditMode={isEditMode}
                onFieldChange={handleFieldChange}
            />

            <Divider sx={{marginY: 2}} />

            {/* Ballot Offices */}
            <Typography
                variant="h6"
                gutterBottom
            >
                Offices:
            </Typography>
            {offices && Object.keys(offices).length > 0 ? (
                Object.keys(offices).map((officeKey) => {
                    const office = offices[officeKey];
                    return (
                        <Office
                            key={officeKey}
                            officeKey={officeKey}
                            office={office}
                            mode={mode}
                            handleOfficeChange={handleOfficeChange}
                            handleCandidateChange={handleCandidateChange}
                            handleAddCandidate={handleAddCandidate}
                            handleDeleteCandidate={handleDeleteCandidate}
                            handleDeleteOffice={handleDeleteOffice}
                            onVoteChange={handleOfficeVoteChange}
                        />
                    );
                })
            ) : (
                <Typography>No offices available</Typography>
            )}

            {isEditMode && (
                <Button
                    onClick={handleAddOffice}
                    variant="contained"
                >
                    Add Office
                </Button>
            )}

            <Divider sx={{marginY: 2}} />

            {/* Ballot Initiatives */}
            <Typography
                variant="h6"
                gutterBottom
            >
                Initiatives:
            </Typography>
            {initiatives &&
                Object.entries(initiatives).map(
                    ([initiativeID, initiative]) => {
                        return (
                            <Initiative
                                key={initiativeID}
                                initiative={initiative}
                                initiativeID={initiativeID} // Make sure initiativeID is passed down
                                mode={mode}
                                handleInitiativeChange={handleInitiativeChange}
                                handleAddOption={handleAddOption}
                                handleDeleteOption={handleDeleteOption}
                                handleDeleteInitiative={handleDeleteInitiative}
                                onVoteChange={handleInitiativeVoteChange} // Make sure this is passed as a prop
                            />
                        );
                    }
                )}

            {isEditMode && (
                <Button
                    onClick={handleAddInitiative}
                    variant="contained"
                >
                    Add Initiative
                </Button>
            )}

            {isUserFillMode && (
                <Button
                    onClick={submitBallot}
                    variant="contained"
                    color="primary"
                    sx={{marginTop: 2}}
                >
                    Submit Votes
                </Button>
            )}
        </Card>
    );
};

export default Ballot;
