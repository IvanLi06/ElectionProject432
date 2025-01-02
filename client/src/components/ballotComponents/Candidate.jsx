import React from "react";
import {
    ListItem,
    ListItemText,
    TextField,
    IconButton,
    Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

const CandidateListItem = ({
    candidate,
    candidateKey,
    officeKey,
    mode,
    handleCandidateChange,
    handleDeleteCandidate,
    onVoteChange,
    isMultiVote = false,
    allowedVotes = 1,
}) => {

    
    return (
        <ListItem key={candidateKey} sx={{ display: "flex", alignItems: "center" }}>
        {mode === "edit" && (
            <>
                <ListItemText
                    primary={
                        <>
                            <TextField
                                value={candidate.firstname}
                                onChange={(e) =>
                                    handleCandidateChange(officeKey, candidateKey, e, "firstname")
                                }
                                name="firstname"
                                label="First Name"
                                variant="outlined"
                                size="small"
                                sx={{ marginRight: 1 }}
                            />
                            <TextField
                                value={candidate.lastname}
                                onChange={(e) =>
                                    handleCandidateChange(officeKey, candidateKey, e, "lastname")
                                }
                                name="lastname"
                                label="Last Name"
                                variant="outlined"
                                size="small"
                            />
                        </>
                    }
                    secondary={
                        <>
                            <TextField
                                value={candidate.credentials}
                                onChange={(e) =>
                                    handleCandidateChange(officeKey, candidateKey, e, "credentials")
                                }
                                name="credentials"
                                label="Credentials"
                                variant="outlined"
                                size="small"
                                fullWidth
                            />
                            <TextField
                                value={candidate.bio}
                                onChange={(e) =>
                                    handleCandidateChange(officeKey, candidateKey, e, "bio")
                                }
                                name="bio"
                                label="Bio"
                                variant="outlined"
                                size="small"
                                fullWidth
                            />
                        </>
                    }
                />
                <IconButton
                    onClick={() => handleDeleteCandidate(officeKey, candidateKey)}
                    color="secondary"
                >
                    <DeleteIcon />
                </IconButton>
            </>
        )}

        {mode === "preview" && (
            <ListItemText
                primary={
                    <Typography variant="body1">{`${candidate.firstname} ${candidate.lastname}`}</Typography>
                }
                secondary={
                    <Typography variant="body2">{`${candidate.credentials} - ${candidate.bio}`}</Typography>
                }
            />
        )}

        {mode === "user_fill" && (
            <div key={candidateKey}>
            {mode === "user_fill" && (
                <div>
                    {isMultiVote ? (
                        <label>
                            <input
                                type="checkbox" // Use checkbox for multiple votes
                                name={officeKey} // Group by officeKey
                                value={candidateKey} // Store candidateKey
                                onChange={() => onVoteChange(officeKey, candidateKey, isMultiVote, allowedVotes)} // Pass necessary params
                            />
                            {`${candidate.firstname} ${candidate.lastname} ${candidate.credentials ? `(${candidate.credentials})` : ""}`}
                        </label>
                    ) : (
                        <label>
                            <input
                                type="radio" // Use radio button for single vote
                                name={officeKey} // Group by officeKey
                                value={candidateKey} // Store candidateKey
                                onChange={() => onVoteChange(officeKey, candidateKey, isMultiVote, allowedVotes)} // Pass necessary params
                            />
                            {`${candidate.firstname} ${candidate.lastname} ${candidate.credentials ? `(${candidate.credentials})` : ""}`}
                        </label>
                    )}
                </div>
            )}
        </div>
        )}
    </ListItem>
);
};

export default CandidateListItem;