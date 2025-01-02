import React from 'react';
import { CardContent, Typography, TextField, FormControl, Select, MenuItem } from '@mui/material';

const BallotDetails = ({ ballotData, isEditMode, onFieldChange }) => {

    return (
        <CardContent>
            <Typography variant="h4" component="h1" gutterBottom>
                {isEditMode ? (
                    <TextField
                        value={ballotData.title || ""}
                        onChange={(e) => onFieldChange(e.target.value, "title")}
                        fullWidth
                        variant="outlined"
                        placeholder="Ballot Title"
                    />
                ) : (
                    ballotData.title
                )}
            </Typography>
            <Typography variant="body1" color="textSecondary">
                <strong>Start Time:</strong>{" "}
                {isEditMode ? (
                    <TextField
                        type="datetime-local"
                        value={
                            ballotData.starttime
                                ? new Date(ballotData.starttime)
                                      .toISOString()
                                      .slice(0, 16)
                                : ""
                        }
                        onChange={(e) => onFieldChange(e.target.value, "starttime")}
                        variant="outlined"
                        fullWidth
                    />
                ) : (
                    ballotData.starttime
                        ? new Date(ballotData.starttime).toLocaleString()
                        : "N/A"
                )}
            </Typography>

            <Typography variant="body1" color="textSecondary">
                <strong>End Time:</strong>{" "}
                {isEditMode ? (
                    <TextField
                        type="datetime-local"
                        value={
                            ballotData.endtime
                                ? new Date(ballotData.endtime)
                                      .toISOString()
                                      .slice(0, 16)
                                : ""
                        }
                        onChange={(e) => onFieldChange(e.target.value, "endtime")}
                        variant="outlined"
                        fullWidth
                    />
                ) : (
                    ballotData.endtime
                        ? new Date(ballotData.endtime).toLocaleString()
                        : "N/A"
                )}
            </Typography>

            <Typography variant="body1" color="textSecondary">
                <strong>Status:</strong>{" "}
                {isEditMode ? (
                    <FormControl fullWidth>
                        <Select
                            value={ballotData.active ? "Active" : "Inactive"}
                            onChange={(e) => onFieldChange(e.target.value === "Active", "active")}
                        >
                            <MenuItem value="Active">Active</MenuItem>
                            <MenuItem value="Inactive">Inactive</MenuItem>
                        </Select>
                    </FormControl>
                ) : ballotData.active ? (
                    "Active"
                ) : (
                    "Inactive"
                )}
            </Typography>
        </CardContent>
    );
};

export default BallotDetails;
