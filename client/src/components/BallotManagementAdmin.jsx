import {useEffect, useState} from "react";
import getData from "../utils/getData";
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Box,
    CircularProgress,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
} from "@mui/material";
import {ArrowDownward} from "@mui/icons-material";

const BallotManagementAdmin = ({user}) => {
    const [societies, setSocieties] = useState([]);
    const [ballots, setBallots] = useState([]);
    const [loaded, setLoaded] = useState(false);
    const token = localStorage.getItem("token");
    const [expanded, setExpanded] = useState(false);
    const [loadingBallots,setLoadingBallots] = useState(false);
    
    
    useEffect(() => {
        let endpoint = "";

        if (user.userType === "admin") {
            // If admin -> show all societies
            endpoint = "/societies";
        } else if (user.userType === "employee") {
            // If employee -> only show assigned societies
            endpoint = `/societies/user/${user.id}`;
        }

        getData(endpoint, token)
            .then((data) => {
                setSocieties(data);
                setLoaded(true);
            })
            .catch((error) => {
                console.error("Error fetching societies:", error);
                setLoaded(true); // Set loaded even if there was an error
            });
    }, [user, token]);

    // Handle accordion
    const handleAccordionChange = (societyId) => async (event, isExpanded) => {
        setExpanded(isExpanded ? societyId : false);

        // Only fetch if expanding
        if (isExpanded && !ballots[societyId] && !loadingBallots[societyId]) {
          setLoadingBallots((prev) => ({ ...prev, [societyId]: true }));
          try {
            const details = await getData(`/ballots/society/${societyId}`, token);
            setBallots((prev) => ({
              ...prev,
              [societyId]: details,
            }));
          } catch (error) {
            console.error("Error fetching ballots:", error);
          } finally {
            setLoadingBallots((prev) => ({ ...prev, [societyId]: false }));
          }
        }
    };

    if (!loaded) return <>Loading Ballots for userID: {user.id}</>;

    return (
        <>
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
                {societies.map((society) => (
                    <Accordion
                        key={society.id}
                        expanded={expanded === society.id}
                        onChange={handleAccordionChange(society.id)}
                    >
                        <AccordionSummary
                            expandIcon={<ArrowDownward />}
                            id={society.id.toString()}
                        >
                            <Typography>
                                {society.abbrev} - {society.name}
                            </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
            {/* Show ballots */}
            {loadingBallots[society.id] ? (
              <CircularProgress size={10} />
            ) : (
              <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Ballot Title</TableCell>
                      <TableCell align="right">Start Date</TableCell>
                      <TableCell align="right">End date</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {(ballots[society.id] || []).length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={3} align="center">
                          No ballots available
                        </TableCell>
                      </TableRow>
                    ) : (
                      (ballots[society.id] || []).map((ballot) => (
                        <TableRow
                          key={ballot.id}
                          sx={{
                            "&:last-child td, &:last-child th": { border: 0 },
                          }}
                        >
                          <TableCell component="th" scope="row">
                            {ballot.title}
                          </TableCell>
                          <TableCell align="right">
                            {new Date(ballot.starttime).toLocaleString()}
                          </TableCell>
                          <TableCell align="right">
                            {new Date(ballot.endtime).toLocaleString()}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </AccordionDetails>
                    </Accordion>
                ))}
            </Box>
        </>
    );
};

export default BallotManagementAdmin;
