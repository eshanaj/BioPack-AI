/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { I18nProvider } from './locales/i18n.tsx';
import { ThemeProvider } from './context/ThemeContext.tsx';
import { AuthProvider, useAuth } from './context/AuthContext.tsx';
import { Navbar } from './components/Navbar.tsx';
import { Footer } from './components/Footer.tsx';
import { RoleLoginView } from './components/views/RoleLoginView.tsx';
import { RoleLoginModal } from './components/RoleLoginModal.tsx';
import { HomeView } from './components/views/HomeView.tsx';
import { AnalyzeView } from './components/views/AnalyzeView.tsx';
import { AuditView } from './components/views/AuditView.tsx';
import { CompareView } from './components/views/CompareView.tsx';
import { FreshProduceView } from './components/views/FreshProduceView.tsx';
import { ValidationView } from './components/views/ValidationView.tsx';
import { WhatIfView } from './components/views/WhatIfView.tsx';
import { SpecGeneratorView } from './components/views/SpecGeneratorView.tsx';
import { ReportsView } from './components/views/ReportsView.tsx';
import { BenchmarkView } from './components/views/BenchmarkView.tsx';
import { SystemStatusView } from './components/views/SystemStatusView.tsx';
import { KnowledgeView } from './components/views/KnowledgeView.tsx';
import { Commodity, CandidateEvaluation, StorageCondition } from './types/index.ts';

function AppContent() {
  const { user } = useAuth();
  const [currentTab, setCurrentTab] = useState<string>('home');
  const [isRoleModalOpen, setIsRoleModalOpen] = useState<boolean>(false);

  // Cross-view handover state
  const [activeCommodityId, setActiveCommodityId] = useState<string | undefined>('potato_chips');
  const [selectedSpecCommodity, setSelectedSpecCommodity] = useState<Commodity | undefined>();
  const [selectedSpecCandidate, setSelectedSpecCandidate] = useState<CandidateEvaluation | undefined>();
  const [whatIfStorage, setWhatIfStorage] = useState<StorageCondition | undefined>();

  // Complete reset of all input and navigation states when user logs out
  React.useEffect(() => {
    if (!user) {
      setCurrentTab('home');
      setActiveCommodityId('potato_chips');
      setSelectedSpecCommodity(undefined);
      setSelectedSpecCandidate(undefined);
      setWhatIfStorage(undefined);
      setIsRoleModalOpen(false);
    }
  }, [user]);

  // If user is not logged in, show dedicated Role-based Login Page
  if (!user) {
    return <RoleLoginView onLoginSuccess={() => setCurrentTab('home')} />;
  }

  const handleStartAnalysis = (commodityId?: string) => {
    if (commodityId) {
      setActiveCommodityId(commodityId);
    }
    setCurrentTab('analyze');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStartAudit = () => {
    setCurrentTab('audit');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleExploreProduce = () => {
    setCurrentTab('fresh_produce');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateToSpec = (commodity: Commodity, candidate: CandidateEvaluation) => {
    setSelectedSpecCommodity(commodity);
    setSelectedSpecCandidate(candidate);
    setCurrentTab('spec');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateToValidation = (commodity: Commodity, candidate: CandidateEvaluation) => {
    setSelectedSpecCommodity(commodity);
    setSelectedSpecCandidate(candidate);
    setCurrentTab('validation');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateToWhatIf = (commodity: Commodity, storage: StorageCondition) => {
    setSelectedSpecCommodity(commodity);
    setWhatIfStorage(storage);
    setCurrentTab('what_if');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-[#061d15] text-slate-900 dark:text-emerald-50 antialiased selection:bg-emerald-100 dark:selection:bg-emerald-900/60 selection:text-emerald-900 dark:selection:text-emerald-100 transition-colors">
      {/* Top Navigation */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        onOpenRoleModal={() => setIsRoleModalOpen(true)}
      />

      {/* Main Content Area - Keyed by user.id so all inputs completely reset per login session */}
      <main key={user.id} className="flex-1">
        {currentTab === 'home' && (
          <HomeView
            key={`home-${user.id}`}
            onStartAnalysis={handleStartAnalysis}
            onStartAudit={handleStartAudit}
            onExploreProduce={handleExploreProduce}
            onNavigateToBenchmarks={() => {
              setCurrentTab('benchmarks');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onNavigateToCompare={() => {
              setCurrentTab('compare');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onNavigateToValidation={() => {
              setCurrentTab('validation');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenRoleModal={() => setIsRoleModalOpen(true)}
          />
        )}

        {currentTab === 'analyze' && (
          <AnalyzeView
            key={`analyze-${user.id}`}
            initialCommodityId={activeCommodityId}
            onNavigateToSpec={handleNavigateToSpec}
            onNavigateToValidation={handleNavigateToValidation}
            onNavigateToWhatIf={handleNavigateToWhatIf}
            onNavigateToReports={() => setCurrentTab('reports')}
          />
        )}

        {currentTab === 'audit' && (
          <AuditView
            key={`audit-${user.id}`}
            onStartAnalysisWithCommodity={handleStartAnalysis}
            onGoToValidation={() => setCurrentTab('validation')}
          />
        )}

        {currentTab === 'compare' && <CompareView key={`compare-${user.id}`} />}

        {currentTab === 'fresh_produce' && <FreshProduceView key={`fresh-${user.id}`} />}

        {currentTab === 'validation' && (
          <ValidationView
            key={`validation-${user.id}`}
            initialCommodity={selectedSpecCommodity}
            initialCandidate={selectedSpecCandidate}
          />
        )}

        {currentTab === 'what_if' && (
          <WhatIfView
            key={`what_if-${user.id}`}
            initialCommodity={selectedSpecCommodity}
            initialStorage={whatIfStorage}
          />
        )}

        {currentTab === 'spec' && (
          <SpecGeneratorView
            key={`spec-${user.id}`}
            initialCommodity={selectedSpecCommodity}
            initialCandidate={selectedSpecCandidate}
          />
        )}

        {currentTab === 'reports' && <ReportsView key={`reports-${user.id}`} />}

        {currentTab === 'benchmarks' && <BenchmarkView key={`benchmarks-${user.id}`} />}

        {currentTab === 'status' && <SystemStatusView key={`status-${user.id}`} />}

        {currentTab === 'knowledge' && <KnowledgeView key={`knowledge-${user.id}`} />}
      </main>

      {/* Global Footer */}
      <Footer setCurrentTab={setCurrentTab} />

      {/* Role Profile Modal */}
      <RoleLoginModal
        isOpen={isRoleModalOpen}
        onClose={() => setIsRoleModalOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <I18nProvider>
          <AppContent />
        </I18nProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
