import React from "react";
import { TextField, IconButton, Button, Typography, List, ListItem, ListItemText, Card } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

const OptionsEditor = ({ options, onOptionsChange, isEditMode }) => {
  const handleOptionChange = (index, newValue) => {
    const updatedOptions = [...options];
    updatedOptions[index] = newValue;
    onOptionsChange(updatedOptions);
  };

  const handleDeleteOption = (index) => {
    const updatedOptions = options.filter((_, i) => i !== index);
    onOptionsChange(updatedOptions);
  };

  const handleAddOption = () => {
    const updatedOptions = [...options, ""];
    onOptionsChange(updatedOptions);
  };

  return (
    <Card sx={{m: 2, p:2}}>
            <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                Options:
            </Typography>
            {isEditMode ? (
                options.map((option, index) => (
                    <div key={index} style={{ marginBottom: "8px" }}>
                        <TextField
                            value={option}
                            onChange={(e) =>
                                handleOptionChange(index, e.target.value)
                            }
                            fullWidth
                            variant="outlined"
                            placeholder={`Option ${index + 1}`}
                        />
                        <IconButton
                            onClick={() => handleDeleteOption(index)}
                            color="secondary"
                            sx={{ marginLeft: "8px" }}
                        >
                            <DeleteIcon />
                        </IconButton>
                    </div>
                ))
            ) : (
                <List dense={true}>
                    {options.map((option, index) => (
                        <ListItem key={index} disablePadding>
                            <ListItemText primary={`${option}`} />
                        </ListItem>
                    ))}
                </List>
            )}
            {isEditMode && (
                <Button
                    onClick={handleAddOption}
                    variant="contained"
                    color="primary"
                    sx={{ marginTop: "8px" }}
                >
                    Add Option
                </Button>
            )}
        </Card>
  );
};

export default OptionsEditor;
