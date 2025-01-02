import React, { useState } from 'react';
import { Button, Typography, Card, CardContent, CircularProgress, Alert, List, ListItem, ListItemText } from '@mui/material';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import getData from '../utils/getData';
import { useLocation } from 'react-router-dom';

const VoteStats = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const location = useLocation();
    const { ballotID } = location.state || {};
    const token = localStorage.getItem("token");

    const fetchVoteStats = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getData(`/votes/vote-stats/${ballotID}`, token);
            console.log(data);
            setStats(data);
        } catch (err) {
            setError('Failed to fetch vote statistics.');
        } finally {
            setLoading(false);
        }
    };

    // Calculate total users and percentage of voters
    const totalCount = stats ? stats.votedCount + stats.nonVotersCount : 0;
    const percentageVoters = totalCount > 0 ? (stats.votedCount / totalCount) * 100 : 0;

    return (
        <Card sx={{ maxWidth: 600, margin: '20px auto', padding: '10px' }}>
            <CardContent>
                <Typography variant="h5" gutterBottom>
                    Voting Statistics
                </Typography>
                {error && <Alert severity="error">{error}</Alert>}
                {loading ? (
                    <CircularProgress />
                ) : stats ? (
                    <div>
                        <Typography variant="body1">
                            <strong>Total Users:</strong> {totalCount}
                        </Typography>
                        <Typography variant="body1">
                            <strong>Voted Count:</strong> {stats.votedCount}
                        </Typography>
                        <Typography variant="body1">
                            <strong>Non-Voters:</strong> {stats.nonVotersCount}
                        </Typography>

                        {/* Circular Progress Bar for Voters */}
                        <div style={{ width: '25%', height: 200, marginTop: '20px', textAlign: 'center', minWidth: 100, minHeight: 100 }}>
                            <CircularProgressbar
                                value={percentageVoters}
                                text={`${Math.round(percentageVoters)}% Voters`}
                                styles={buildStyles({
                                    pathColor: '#4caf50', // Green for voters
                                    textColor: '#000000',
                                    trailColor: '#d6d6d6',
                                })}
                            />
                        </div>

                        {/* List of Non-Voters */}
                        <Typography variant="h6" gutterBottom sx={{ marginTop: '15px' }}>
                            Non-Voters
                        </Typography>
                        <List>
                            {stats.nonVoters.map(nonVoter => (
                                <ListItem key={nonVoter.userID}>
                                    <ListItemText
                                        primary={`${nonVoter.firstname} ${nonVoter.lastname}`}
                                    />
                                </ListItem>
                            ))}
                        </List>

                        {/* List of Voters */}
                        <Typography variant="h6" gutterBottom sx={{ marginTop: '15px' }}>
                            Voters
                        </Typography>
                        <List>
                            {stats.voters.map(voter => (
                                <ListItem key={voter.userID}>
                                    <ListItemText
                                        primary={`${voter.firstname} ${voter.lastname}`}
                                        secondary={`Voted at: ${voter.votedTime || 'N/A'}`}
                                    />
                                </ListItem>
                            ))}
                        </List>
                    </div>
                ) : (
                    <Typography variant="body2">
                        Click the button below to fetch the voting statistics.
                    </Typography>
                )}
                <Button 
                    variant="contained" 
                    color="primary" 
                    onClick={fetchVoteStats} 
                    sx={{ marginTop: '10px' }}
                >
                    Fetch Statistics
                </Button>
            </CardContent>
        </Card>
    );
};

export default VoteStats;
