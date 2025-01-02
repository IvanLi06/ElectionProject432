import React from "react";
import {Card, Typography, TextField, List, Button} from "@mui/material";
import CandidateListItem from "./Candidate";

const Office = ({
    officeKey,
    office,
    mode = "edit", // edit | preview | user_fill
    handleOfficeChange,
    handleCandidateChange,
    handleAddCandidate,
    handleDeleteCandidate,
    handleDeleteOffice,
    onVoteChange,
    selectedCandidates = [],
}) => {
    const isEditMode = mode === "edit";

    return (
        <Card
            key={officeKey}
            sx={{marginBottom: 2, padding: 2}}
        >
            <Typography variant="h6">
                {isEditMode ? (
                    <TextField
                        value={office.title}
                        onChange={(e) =>
                            handleOfficeChange(e, officeKey, "title")
                        }
                        fullWidth
                        variant="outlined"
                        placeholder="Ballot Title"
                    />
                ) : (
                    office.title
                )}
            </Typography>
            <Typography variant="body2">
                Allowed Votes:{" "}
                {isEditMode ? (
                    <input
                        type="number"
                        value={office.allowedVotes ?? 1}
                        onChange={(e) =>
                            handleOfficeChange(
                                {target: {value: e.target.value}},
                                officeKey,
                                "allowedVotes"
                            )
                        }
                        min={1}
                        max={50}
                        style={{width: "100px"}}
                    />
                ) : (
                    office.allowedVotes
                )}
            </Typography>

            <Typography
                variant="body2"
                sx={{marginY: 1}}
            >
                Candidates:
            </Typography>
            <List>
                {Object.keys(office.candidates).map((candidateKey) => {
                    const candidate = office.candidates[candidateKey];
                    return (
                        <CandidateListItem
                            key={candidateKey}
                            candidate={candidate}
                            candidateKey={candidateKey}
                            officeKey={officeKey}
                            mode={mode}
                            handleCandidateChange={handleCandidateChange}
                            handleDeleteCandidate={handleDeleteCandidate}
                            onVoteChange={onVoteChange}
                            isMultiVote={office.allowedVotes > 1}
                            selectedCandidates={selectedCandidates}
                            allowedVotes={office.allowedVotes}
                        />
                    );
                })}
            </List>
            {isEditMode && (
                <Button
                    onClick={() => handleAddCandidate(officeKey)}
                    variant="contained"
                >
                    Add Candidate
                </Button>
            )}
            {isEditMode && (<Button
                onClick={() => handleDeleteOffice(officeKey)}
                variant="outlined"
            >
                Delete Office
            </Button>)}
        </Card>
    );
};

export default Office;
