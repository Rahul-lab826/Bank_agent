import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Layout
import { DashboardLayout } from './layouts/DashboardLayout';

// Pages
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { BankDashboard } from './pages/BankDashboard';
import { WealthDashboard } from './pages/WealthDashboard';
import { DigitalTwin } from './pages/DigitalTwin';
import { AIAdvisor } from './pages/AIAdvisor';
import { Simulator } from './pages/Simulator';
import { GoalPlanner } from './pages/GoalPlanner';
import { NotFoundPage } from './pages/NotFoundPage';

// Placeholders
import { 
  AccountsPlaceholder, 
  TransactionsPlaceholder, 
  InvestmentsPlaceholder 
} from './pages/Placeholders';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />

        {/* Private Dashboard Core Wrapper */}
        <Route element={<DashboardLayout />}>
          {/* Main Bank Routes */}
          <Route path="/dashboard" element={<BankDashboard />} />
          <Route path="/accounts" element={<AccountsPlaceholder />} />
          <Route path="/transactions" element={<TransactionsPlaceholder />} />
          <Route path="/investments" element={<InvestmentsPlaceholder />} />

          {/* WealthTwin AI Suite Routes */}
          <Route path="/wealth" element={<WealthDashboard />} />
          <Route path="/wealth/twin" element={<DigitalTwin />} />
          <Route path="/wealth/advisor" element={<AIAdvisor />} />
          <Route path="/wealth/simulator" element={<Simulator />} />
          <Route path="/wealth/goals" element={<GoalPlanner />} />
        </Route>

        {/* Redirects / Wildcard */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
