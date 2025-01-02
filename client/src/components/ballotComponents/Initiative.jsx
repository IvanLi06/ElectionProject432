import React, {useEffect, useState} from "react";
import {
    Card,
    Typography,
    TextField,
    Button,
    IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

const Initiative = ({
    initiative,
    initiativeID,
    mode = "edit", // edit | preview | user_fill
    handleInitiativeChange,
    handleDeleteInitiative,
    handleAddOption,
    onVoteChange,
}) => {
    const isEditMode = mode === "edit";
    const isPreviewMode = mode === "preview";
    const isUserFillMode = mode === "user_fill";

    // Local state to track the selected option in user_fill mode
    const [selectedOption, setSelectedOption] = useState("");

    useEffect(() => {
        if (isUserFillMode && initiative.selectedOption) {
            setSelectedOption(initiative.selectedOption); // Initialize selected option if available
        }
    }, [initiative, isUserFillMode]);

    // Function to handle changes in options (edit mode)
    const handleOptionChange = (e, optionID) => {
        const updatedOptions = {...initiative.options};
        updatedOptions[optionID] = e.target.value; // Update option text

        // Call the parent callback and pass the initiativeID and the updated options
        handleInitiativeChange(initiative.id, "options", updatedOptions);
    };



    return (
        <Card sx={{marginBottom: 2, padding: 2}}>
            {/* Display title */}
            <Typography variant="h6">
                {isEditMode ? (
                    <TextField
                        value={initiative.title}
                        onChange={(e) =>
                            handleInitiativeChange(
                                initiative.id,
                                "title",
                                e.target.value
                            )
                        }
                        fullWidth
                        variant="outlined"
                        placeholder="Initiative Title"
                    />
                ) : (
                    initiative?.title
                )}
            </Typography>

            {/* Options Section */}
            <Typography
                variant="body2"
                sx={{marginY: 1}}
            >
                Options:
            </Typography>

            {Object.entries(initiative.options).map(
                ([optionID, optionText]) => (
                    <div
                        key={optionID}
                        style={{display: "flex", alignItems: "center"}}
                    >
                        {isEditMode && (
                            <TextField
                                value={optionText}
                                onChange={(e) =>
                                    handleOptionChange(e, optionID)
                                }
                                fullWidth
                                variant="outlined"
                                placeholder="Enter option"
                                style={{marginRight: "8px"}}
                            />
                        )}
                        {isEditMode && (
                            <IconButton
                                onClick={() => {
                                    const {[optionID]: _, ...remainingOptions} =
                                        initiative.options;
                                    handleInitiativeChange(
                                        initiative.id,
                                        "options",
                                        remainingOptions
                                    );
                                }}
                                color="secondary"
                            >
                                <DeleteIcon />
                            </IconButton>
                        )}
                        {isPreviewMode && (
                            <Typography variant="body2">
                                {optionText}
                            </Typography>
                        )}
                        {isUserFillMode && (
                            <div key={optionID}>
                                <label>
                                    <input
                                        type="radio"
                                        name={initiativeID} // Group by initiativeID
                                        value={optionID} // Store optionID
                                        onChange={() =>
                                            onVoteChange(initiativeID, optionID)
                                        } // Pass both initiativeID and optionID
                                    />
                                    {optionText}
                                </label>
                            </div>
                        )}
                    </div>
                )
            )}

            {/* Add Option Button (only in edit mode) */}
            {isEditMode && (
                <Button
                    onClick={() => handleAddOption(initiative.id)}
                    variant="contained"
                >
                    Add Option
                </Button>
            )}

            {/* Delete Initiative Button (only in edit mode) */}
            {isEditMode && (
                <Button
                    onClick={() => handleDeleteInitiative(initiative.id)}
                    variant="outlined"
                    color="error"
                >
                    Delete Initiative
                </Button>
            )}
        </Card>
    );
};

export default Initiative;
