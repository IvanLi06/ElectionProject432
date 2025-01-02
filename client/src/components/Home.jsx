import { Box, Button, Paper, Typography } from '@mui/material';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import BadgeIcon from '@mui/icons-material/Badge';
import BusinessIcon from '@mui/icons-material/Business';
import AssignmentIcon from '@mui/icons-material/Assignment';
import QueryStatsIcon from '@mui/icons-material/QueryStats';
import BallotList from './BallotList';

const Home = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    const navigate = useNavigate();

    if (!user) {
      navigate('/login', { replace: true });
      return null;
    };
    
    const renderMenuItems = () => {
        switch (user.userType) {
          case 'admin':
            return (
              <>
                <PaperMenuOption label="Manage Members" path="/admin/manage-members" icon={<AccountCircleIcon sx={{ width: '60%', height: 'auto' }}/>}/>
                <PaperMenuOption label="Manage Employees" path="/admin/manage-employees" icon={<BadgeIcon sx={{ width: '60%', height: 'auto' }}/>}/>
                <PaperMenuOption label="Manage Societies" path="/admin/manage-societies" icon={<BusinessIcon sx={{ width: '60%', height: 'auto' }}/>}/>
                <PaperMenuOption label="Manage Ballots" path="/admin/manage-ballots" icon={<AssignmentIcon sx={{ width: '60%', height: 'auto' }}/>}/>
                <PaperMenuOption label="Reports" path="/admin/reports" icon={<QueryStatsIcon sx={{ width: '60%', height: 'auto' }}/>}/>
              </>
            );
            case 'employee':
                return (
                <>
                    <PaperMenuOption label="Manage Ballots" path="/employee/manage-ballots" icon={<AssignmentIcon sx={{ width: '60%', height: 'auto' }}/>}/>
                    <PaperMenuOption label="Manage Societies" path="/employee/manage-societies" icon={<BusinessIcon sx={{ width: '60%', height: 'auto' }}/>}/>
                </>
            );
          case 'officer':
            return (
              <>
                <BallotList userId={user.id} userType={user.userType}/>
              </>
            );
          case 'member':
            return (
              <>
                <BallotList userId={user.id} userType={user.userType}/>
              </>
            );
          default:
            return <Typography variant="body2">Please contact support for access.</Typography>;
        }
      };


    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login', {replace: true});
    }

    return (
        <div>
        <h1>Welcome to the Home Page!</h1>
        {user ? (
            <div>
                <p>Hello, {user.firstname}!</p>

                {user.userType === 'admin' && (
                    <div>
                    <h2>Admin Options</h2>
                    <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2, mt: 2, padding: '1em', justifyContent: 'center', flexWrap: 'wrap'}}>
                        {renderMenuItems()}
                    </Box>
                    </div>
                )}
                {user.userType === 'employee' && (
                    <div>
                    <h2>Employee Options</h2>
                    <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2, mt: 2, padding: '1em', justifyContent: 'center'}}>
                        {renderMenuItems()}
                    </Box>
                    </div>
                )}
                {user.userType === 'member' && (
                    <div>
                    <h2>Member Options</h2>
                    <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2, mt: 2, padding: '1em', justifyContent: 'center'}}>
                        {renderMenuItems()}
                    </Box>
                    </div>
                )}
                {user.userType === 'officer' && (
                    <div>
                    <h2>Officer Options</h2>
                    <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2, mt: 2, padding: '1em', justifyContent: 'center'}}>
                        {renderMenuItems()}
                    </Box>
                    </div>
                )}
            </div>

        ) : (
            <p>No user information available.</p>
        )}
        <Button onClick={handleLogout}>Logout</Button>
    </div>
    );
  };
  

  
  const PaperMenuOption = ({ label, path, icon }) => (
    <Paper
      elevation={5}
      sx={{
        padding: '2.5em 1em 1em 1em',
        textAlign: 'center',
        cursor: 'pointer',
        '&:hover': { backgroundColor: 'grey.200' },
        width: '30%',
        height: 'auto',
      }}
      onClick={() => (window.location.href = path)}
    >
        <Typography variant="h5">{label}</Typography>
        {icon}
    </Paper>
  );

export default Home;
