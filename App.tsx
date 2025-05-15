import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import TeamPage from './components/TeamPage';
import HowItWorksPage from './components/HowItWorksPage';
import Register from './components/Register';
import VerifyEmail from './components/VerifyEmail';
import Login from './components/Login';
import Profile from './components/Profile';
import OrganizationVerification from './components/OrganizationVerification';
import CampaignCreate from './components/CampaignCreate';
import Dashboard from './components/Dashboard';
import CampaignEdit from './components/CampaignEdit';
import OwnerLogin from './components/OwnerLogin';
import OwnerDashboard from './components/OwnerDashboard';
import OwnerLogout from './components/OwnerLogout';

function App() {
  return (
    <Router>
      <div className="App">
        <Switch>
          <Route exact path="/" component={LandingPage} />
          <Route path="/team" component={TeamPage} />
          <Route path="/how-it-works" component={HowItWorksPage} />
          <Route path="/register" component={Register} />
          <Route path="/verify-email" component={VerifyEmail} />
          <Route path="/login" component={Login} />
          <Route path="/profile" component={Profile} />
          <Route path="/organization-verification" component={OrganizationVerification} />
          <Route path="/campaign/create" component={CampaignCreate} />
          <Route path="/campaign/edit/:id" component={CampaignEdit} />
          <Route path="/dashboard" component={Dashboard} />
          <Route path="/owner-login" component={OwnerLogin} />
          <Route path="/owner-dashboard" component={OwnerDashboard} />
          <Route path="/owner-logout" component={OwnerLogout} />
        </Switch>
      </div>
    </Router>
  );
}

export default App; 