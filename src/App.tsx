import React, { useState } from 'react';
import { NavTab, ProjectItem, BudgetItem, SafetyItem, ActionItem } from './types';
import {
  INITIAL_PROJECTS,
  INITIAL_BUDGET_ITEMS,
  INITIAL_SAFETY_ITEMS,
  INITIAL_ACTION_ITEMS,
  KCDI_METRICS,
} from './data/mockData';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { DashboardView } from './components/DashboardView';
import { ProjectManagementView } from './components/ProjectManagementView';
import { BudgetManagementView } from './components/BudgetManagementView';
import { SafetyManagementView } from './components/SafetyManagementView';
import {
  ParticipationView,
  PerformanceView,
  AlternativeComparisonView,
  ReportsView,
  SystemAdminView,
} from './components/OtherViews';
import {
  ProjectRegistrationModal,
  AddBudgetModal,
  RemediationModal,
} from './components/Modals';

export default function App() {
  const [currentTab, setCurrentTab] = useState<NavTab>('dashboard');
  const [currentYear, setCurrentYear] = useState('2027');
  const [searchQuery, setSearchQuery] = useState('');

  // Primary data state
  const [projects, setProjects] = useState<ProjectItem[]>(INITIAL_PROJECTS);
  const [selectedProject, setSelectedProject] = useState<ProjectItem>(INITIAL_PROJECTS[0]);
  const [budgetItems, setBudgetItems] = useState<BudgetItem[]>(INITIAL_BUDGET_ITEMS);
  const [safetyItems, setSafetyItems] = useState<SafetyItem[]>(INITIAL_SAFETY_ITEMS);
  const [actionItems, setActionItems] = useState<ActionItem[]>(INITIAL_ACTION_ITEMS);

  // Modals state
  const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState(false);
  const [isAddBudgetModalOpen, setIsAddBudgetModalOpen] = useState(false);
  const [isRemediationModalOpen, setIsRemediationModalOpen] = useState(false);
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Handlers
  const handleSelectAction = (action: ActionItem) => {
    if (action.targetTab) {
      setCurrentTab(action.targetTab);
    }
    if (action.projectId) {
      const found = projects.find(p => p.id === action.projectId);
      if (found) setSelectedProject(found);
    }
    showToast(`알림 항목 [${action.title}] 관련 화면으로 이동하였습니다.`);
  };

  const handleUpdateProject = (updated: ProjectItem) => {
    setProjects(prev => prev.map(p => p.id === updated.id ? updated : p));
    setSelectedProject(updated);
  };

  const handleCreateNewProject = (newProjectData: Partial<ProjectItem>) => {
    const fullProject: ProjectItem = {
      id: newProjectData.id || `PRJ-2027-${Date.now()}`,
      code: newProjectData.code || `PRJ-2027-${Date.now()}`,
      title: newProjectData.title || '신규 글로벌 진로탐험 프로젝트',
      type: newProjectData.type || '국외체험(직접파견)',
      destination: newProjectData.destination || '해외 거점 기관',
      period: newProjectData.period || '27.09.01~09.08',
      startDate: newProjectData.startDate || '2027.09.01',
      endDate: newProjectData.endDate || '2027.09.08',
      participants: newProjectData.participants || 50,
      status: '계획수립',
      totalBudget: newProjectData.totalBudget || 45000000,
      allocatedBudget: newProjectData.allocatedBudget || 45000000,
      department: newProjectData.department || '세종교육청 진로교육과',
      manager: newProjectData.manager || '김지현 장학관',
      managerContact: newProjectData.managerContact || '044-320-1542',
      purpose: newProjectData.purpose || '세종 청소년 미래 진로 탐색 지원',
      background: newProjectData.background || '2027 미래교육 비전 사업',
      targetInfo: newProjectData.targetInfo || '관내 학생 50명',
      hostOrgs: newProjectData.hostOrgs || '해외 연구소 및 대학',
      approvalDocNum: newProjectData.approvalDocNum || '진로-2027-신규',
      escortProofDoc: newProjectData.escortProofDoc || '인솔교사배치계획_수립중.pdf',
      updatedAt: newProjectData.updatedAt || `${new Date().toISOString().slice(0, 10).replace(/-/g, '.')} 10:00:00`,
    };

    setProjects(prev => [fullProject, ...prev]);
    setSelectedProject(fullProject);
    showToast(`신규 사업 [${fullProject.title}] 계획이 성공적으로 등록되었습니다.`);
  };

  const handleAddBudgetItem = (newItem: Partial<BudgetItem>) => {
    const fullItem: BudgetItem = {
      id: `BGT-${Date.now()}`,
      category: newItem.category || 'program',
      name: newItem.name || '추가 예산 항목',
      basis: newItem.basis || '단가 × 수량 산출',
      unitPrice: newItem.unitPrice || 0,
      quantity: newItem.quantity || 1,
      unit: newItem.unit || '건',
      plannedTotal: newItem.plannedTotal || 0,
      executedAmount: 0,
      balance: newItem.plannedTotal || 0,
      status: '계획수립중',
      statusType: 'normal',
    };
    setBudgetItems(prev => [...prev, fullItem]);
    showToast(`예산 항목 [${fullItem.name}]이 세부 내역에 추가되었습니다.`);
  };

  const handleResolveRemediation = () => {
    setBudgetItems(prev => prev.map(b => {
      if (b.id === 'BGT-03') {
        return {
          ...b,
          status: '소명완료 (승인심사중)',
          statusType: 'normal',
          comment: 'NUS 강사료 산출근거 및 전신송금 영수증 소명서 제출 완료',
        };
      }
      return b;
    }));
    // Remove the warning from action items
    setActionItems(prev => prev.filter(a => a.id !== 'ACT-02'));
    showToast('프로그램 운영비 산출근거 보완서가 행정 감사관에게 제출되었습니다.');
  };

  // Filter projects by global search query if user typed something
  const filteredProjects = searchQuery.trim()
    ? projects.filter(p => p.title.toLowerCase().includes(searchQuery.toLowerCase()) || p.code.toLowerCase().includes(searchQuery.toLowerCase()))
    : projects;

  const unresolvedSafetyCount = safetyItems.filter(s => s.status === '미점검' || s.status === '조치 필요').length;

  return (
    <div className="min-h-screen bg-surface flex">
      {/* Sidebar Navigation */}
      <Sidebar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        unresolvedSafetyCount={unresolvedSafetyCount}
      />

      {/* Main Container */}
      <div className="pl-72 flex-1 min-w-0">
        <Header
          currentTab={currentTab}
          currentYear={currentYear}
          onYearChange={setCurrentYear}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          actionItems={actionItems}
          onSelectAction={handleSelectAction}
          onOpenHelp={() => setIsHelpModalOpen(true)}
          onOpenSettings={() => setIsSettingsModalOpen(true)}
        />

        <main className="relative w-full pt-16 bg-surface min-h-screen px-space-lg py-space-lg">
          {currentTab === 'dashboard' && (
            <DashboardView
              projects={filteredProjects}
              actionItems={actionItems}
              kcdiMetrics={KCDI_METRICS}
              onNavigateTab={setCurrentTab}
              onSelectProject={setSelectedProject}
              onOpenNewProject={() => setIsNewProjectModalOpen(true)}
            />
          )}

          {currentTab === 'project-management' && (
            <ProjectManagementView
              projects={filteredProjects}
              selectedProject={selectedProject}
              onSelectProject={setSelectedProject}
              onUpdateProject={handleUpdateProject}
              onOpenNewProject={() => setIsNewProjectModalOpen(true)}
              onNavigateTab={setCurrentTab}
              onShowToast={showToast}
            />
          )}

          {currentTab === 'budget-management' && (
            <BudgetManagementView
              budgetItems={budgetItems}
              currentProject={selectedProject}
              onUpdateBudgetItems={setBudgetItems}
              onOpenAddBudgetModal={() => setIsAddBudgetModalOpen(true)}
              onOpenAuditRemediationModal={() => setIsRemediationModalOpen(true)}
              onShowToast={showToast}
            />
          )}

          {currentTab === 'safety-management' && (
            <SafetyManagementView
              safetyItems={safetyItems}
              onUpdateSafetyItems={setSafetyItems}
              onShowToast={showToast}
            />
          )}

          {currentTab === 'participation-management' && (
            <ParticipationView projects={projects} onShowToast={showToast} />
          )}

          {currentTab === 'performance-evaluation' && (
            <PerformanceView kcdiMetrics={KCDI_METRICS} onShowToast={showToast} />
          )}

          {currentTab === 'alternative-comparison' && (
            <AlternativeComparisonView onShowToast={showToast} />
          )}

          {currentTab === 'reports-export' && (
            <ReportsView onShowToast={showToast} />
          )}

          {currentTab === 'system-administration' && (
            <SystemAdminView onShowToast={showToast} />
          )}
        </main>
      </div>

      {/* Global Modals */}
      <ProjectRegistrationModal
        isOpen={isNewProjectModalOpen}
        onClose={() => setIsNewProjectModalOpen(false)}
        onSubmit={handleCreateNewProject}
      />

      <AddBudgetModal
        isOpen={isAddBudgetModalOpen}
        onClose={() => setIsAddBudgetModalOpen(false)}
        onSubmit={handleAddBudgetItem}
      />

      <RemediationModal
        isOpen={isRemediationModalOpen}
        onClose={() => setIsRemediationModalOpen(false)}
        onResolved={handleResolveRemediation}
      />

      {/* Help Modal */}
      {isHelpModalOpen && (
        <div className="fixed inset-0 z-50 bg-primary/60 flex items-center justify-center p-space-md">
          <div className="bg-surface-container-lowest w-full max-w-2xl border-2 border-primary shadow-xl p-space-md space-y-space-md">
            <div className="flex items-center justify-between pb-space-xs border-b border-surface-container">
              <span className="font-headline-sm text-primary font-bold">
                글로벌 진로탐험대 NEXT 행정지원포털 업무 매뉴얼
              </span>
              <button
                type="button"
                onClick={() => setIsHelpModalOpen(false)}
                className="material-symbols-outlined text-outline hover:text-primary cursor-pointer"
              >
                close
              </button>
            </div>
            <div className="text-xs space-y-2 text-on-surface leading-relaxed max-h-80 overflow-y-auto">
              <p><strong>1. 개요:</strong> 본 포털은 세종특별자치시교육청 진로교육과 및 관내 학교의 국외·국내 글로벌 진로탐험대 사업계획, 예산 산출, 법정 6대 안전점검 및 K-CDI 진로역량 성과를 단일 터미널에서 통합 관리하도록 구축된 행정 시스템입니다.</p>
              <p><strong>2. 예산편성 원칙:</strong> 모든 예산 항목은 단가와 수량을 입력하면 전산 자동 계산되며, 해외 송금 및 강사료는 반드시 원천징수 면제조약 또는 소명 자료를 첨부해야 승인됩니다.</p>
              <p><strong>3. 안전관리 필수 사항:</strong> 출국 전 5대 필수 항목(방문기관 확약, 운송차량 보험, 학생 상해사망 3억원 보험, 인솔교원 15:1 배치, 비상연락망) 승인이 종결되어야 교육감 인가가 완료됩니다.</p>
            </div>
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setIsHelpModalOpen(false)}
                className="px-space-md py-1 bg-primary text-on-primary font-label-code text-label-code font-bold cursor-pointer"
              >
                확인
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Settings Modal */}
      {isSettingsModalOpen && (
        <div className="fixed inset-0 z-50 bg-primary/60 flex items-center justify-center p-space-md">
          <div className="bg-surface-container-lowest w-full max-w-xl border-2 border-primary shadow-xl p-space-md space-y-space-md">
            <div className="flex items-center justify-between pb-space-xs border-b border-surface-container">
              <span className="font-headline-sm text-primary font-bold">
                시스템 환경설정 (Administrative Preferences)
              </span>
              <button
                type="button"
                onClick={() => setIsSettingsModalOpen(false)}
                className="material-symbols-outlined text-outline hover:text-primary cursor-pointer"
              >
                close
              </button>
            </div>
            <div className="space-y-3 text-xs">
              <div className="flex justify-between items-center p-2 bg-surface-container-low border border-surface-container">
                <span>데이터 실시간 동기화 주기</span>
                <span className="font-bold text-secondary">30초 자동 갱신</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-surface-container-low border border-surface-container">
                <span>표준 행정 감사 로깅 레벨</span>
                <span className="font-bold text-primary">DEBUG &amp; AUDIT</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-surface-container-low border border-surface-container">
                <span>환율 자동 변동폭 알림</span>
                <span className="font-bold text-on-tertiary-container">±2.0% 변동 시 통보</span>
              </div>
            </div>
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => {
                  showToast('환경설정이 정상 적용되었습니다.');
                  setIsSettingsModalOpen(false);
                }}
                className="px-space-md py-1 bg-primary text-on-primary font-label-code text-label-code font-bold cursor-pointer"
              >
                저장 및 적용
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Operational Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-primary text-on-primary p-space-md shadow-2xl flex items-center gap-space-sm border-2 border-secondary animate-in fade-in duration-200">
          <span className="material-symbols-outlined text-secondary-fixed">check_circle</span>
          <span className="font-body-sm text-body-sm font-semibold">{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
