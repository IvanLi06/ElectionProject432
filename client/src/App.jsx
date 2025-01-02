import React from 'react';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Home from './components/Home';
import BallotManagementAdmin from './components/BallotManagementAdmin';
import BallotManagementEmployee from './components/BallotManagementEmployee';
import Ballot from './components/Ballot';
import CreateBallot from './components/CreateBallot';
import VoteStats from './components/Status';

function App() {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));

  return (
    <BrowserRouter>
      <Routes>
        {token && user ? (
          // Authorized routes
          <>
            <Route path="/home" element={<Home />} />
            <Route path="/admin/manage-ballots" element={<BallotManagementAdmin user={user}/>} />
            <Route path="/admin/manage-employees" element={<p>Manage employees</p>} />
            <Route path="/admin/manage-societies" element={<p>Manage societies</p>} />
            <Route path="/admin/manage-members" element={<p>Manage members</p>} />
            <Route path="/admin/reports" element={<p>Manage REPORTS</p>} />

            <Route path="/employee/manage-ballots" element={<BallotManagementEmployee user={user}/>} />
            <Route path="/view-ballot" element={<Ballot user={user} mode="preview"/>} />
            <Route path="/edit-ballot" element={<Ballot user={user} mode="edit"/>} />
            <Route path="/create-ballot" element={<Ballot user={user} mode="edit" isNewBallot= {true}/>} />


            <Route path="/election-view" element={<Ballot user={user} mode="user_fill" />} />
            <Route path="/election-status" element={<VoteStats />} />

            <Route path="*" element={<Navigate to="/home" replace/>} />
          </>
        ) : (
          // Unauthorized routes
          <>
            <Route path="/login" element={<Login />} />
            <Route path="*" element={<Navigate to="/login" replace/>} />
          </>
        )}
      </Routes>
    </BrowserRouter>
  );
}


export default App;
