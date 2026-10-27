import React, { useState } from 'react';
import { ProjectItem, NavTab } from '../types';

interface ProjectManagementViewProps {
  projects: ProjectItem[];
  selectedProject: ProjectItem;
  onSelectProject: (project: ProjectItem) => void;
  onUpdateProject: (updated: ProjectItem) => void;
  onOpenNewProject: () => void;
  onNavigateTab: (tab: NavTab) => void;
  onShowToast: (message: string) => void;
}

export const ProjectManagementView: React.FC<ProjectManagementViewProps> = ({
  projects,
  selectedProject,
  onSelectProject,
  onUpdateProject,
  onOpenNewProject,
  onNavigateTab,
  onShowToast,
}) => {
  // Filter states
  const [keyword, setKeyword] = useState('2027 글로벌 진로탐험대');
  const [filterYear, setFilterYear] = useState('2027');
  const [filterMode, setFilterMode] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  // Active Detail Tab
  const [activeTab, setActiveTab] = useState<'basic' | 'plan' | 'budget' | 'participation' | 'safety' | 'performance' | 'history'>('basic');

  // Form edit states based on selected project
  const [formData, setFormData] = useState<ProjectItem>(selectedProject);

  // Sync formData when selectedProject changes
  React.useEffect(() => {
    setFormData(selectedProject);
  }, [selectedProject]);

  const handleInputChange = (field: keyof ProjectItem, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    onUpdateProject(formData);
    onShowToast(`[${formData.title}] 변경사항이 행정 데이터베이스에 정상적으로 저장되었습니다.`);
  };

  const handlePrintPDF = () => {
    window.print();
  };

  const handleExportExcel = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + ["사업코드,사업명,사업유형,목표인원,총사업비,담당자,추진상태,최종수정일"]
      .concat(projects.map(p => `${p.code},"${p.title}",${p.type},${p.participants},${p.totalBudget},${p.manager},${p.status},${p.updatedAt}`))
      .join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `2027_세종글로벌진로탐험대_사업목록_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    onShowToast('사업 관리 목록 엑셀(CSV) 파일이 정상 다운로드되었습니다.');
  };

  // Filter projects
  const filteredProjects = projects.filter(p => {
    if (keyword.trim()) {
      const matchKey = p.title.toLowerCase().includes(keyword.toLowerCase()) || 
                       p.code.toLowerCase().includes(keyword.toLowerCase()) ||
                       p.destination.toLowerCase().includes(keyword.toLowerCase());
      if (!matchKey) return false;
    }
    if (filterStatus !== 'all' && p.status !== filterStatus) {
      if (filterStatus === 'operating' && p.status !== '운영중' && p.status !== '운영승인완료') return false;
      if (filterStatus === 'plan' && p.status !== '계획수립' && p.status !== '계획승인') return false;
      if (filterStatus === 'budget' && p.status !== '예산검토') return false;
      if (filterStatus === 'safety' && p.status !== '안전심의') return false;
    }
    return true;
  });

  return (
    <div className="flex flex-col w-full">
      {/* Top Control Banner */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-space-md pb-space-lg">
        <div className="flex flex-col gap-space-2xs">
          <div className="flex items-center gap-space-xs font-label-code text-label-code text-secondary tracking-widest uppercase">
            <span className="w-2 h-2 bg-secondary inline-block"></span>
            <span>MUNICIPAL ADMINISTRATION // EXPEDITION DISPATCH MGMT</span>
          </div>
          <h1 className="font-headline-lg text-display-md text-primary tracking-tight font-bold">
            사업관리
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant max-w-3xl">
            세종시 관내 글로벌 진로탐험대 사업계획, 승인 및 세부 운영내역을 총괄 관리합니다.
          </p>
        </div>

        <div className="flex items-center gap-space-xs shrink-0">
          <button
            type="button"
            onClick={handleExportExcel}
            className="px-space-md py-space-sm bg-surface-container-low text-primary font-label-code text-label-code uppercase tracking-wider hover:bg-surface-container transition-colors flex items-center gap-space-xs border border-surface-container font-bold cursor-pointer"
          >
            <span className="material-symbols-outlined text-base">file_download</span>
            <span>엑셀 내보내기</span>
          </button>
          <button
            type="button"
            onClick={onOpenNewProject}
            className="px-space-md py-space-sm bg-primary text-on-primary font-label-code text-label-code uppercase tracking-wider hover:bg-primary-container transition-colors flex items-center gap-space-xs font-bold cursor-pointer"
          >
            <span className="material-symbols-outlined text-base">add</span>
            <span>신규 사업 등록</span>
          </button>
        </div>
      </div>

      {/* Operational Stat Cards / Telemetry Strips */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-space-md mb-space-lg">
        <div className="bg-surface-container-lowest p-space-md shadow-xs border border-surface-container">
          <div className="flex items-center justify-between text-on-surface-variant font-label-code text-label-code mb-1">
            <span>총괄 등록 사업</span>
            <span className="material-symbols-outlined text-base text-secondary">inventory_2</span>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="font-headline-lg text-display-md text-primary font-bold">
              14<span className="text-headline-sm font-normal text-on-surface-variant ml-1">건</span>
            </span>
            <span className="font-tabular-num text-body-sm text-secondary bg-surface-container px-space-xs py-0.5 font-bold">
              FY27 ACTIVE
            </span>
          </div>
        </div>

        <div className="bg-surface-container-lowest p-space-md shadow-xs border border-surface-container">
          <div className="flex items-center justify-between text-on-surface-variant font-label-code text-label-code mb-1">
            <span>총 투입 예정 예산</span>
            <span className="material-symbols-outlined text-base text-secondary">payments</span>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="font-headline-lg text-display-md text-primary font-bold">
              205<span className="text-headline-sm font-normal text-on-surface-variant ml-1">백만원</span>
            </span>
            <span className="font-tabular-num text-body-sm text-on-tertiary-container bg-surface-container-low px-space-xs py-0.5 font-bold">
              집행율 24.3%
            </span>
          </div>
        </div>

        <div className="bg-surface-container-lowest p-space-md shadow-xs border border-surface-container">
          <div className="flex items-center justify-between text-on-surface-variant font-label-code text-label-code mb-1">
            <span>대상 학생 총원</span>
            <span className="material-symbols-outlined text-base text-secondary">group</span>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="font-headline-lg text-display-md text-primary font-bold">
              280<span className="text-headline-sm font-normal text-on-surface-variant ml-1">명</span>
            </span>
            <span className="font-tabular-num text-body-sm text-primary font-bold bg-surface-container-high px-space-xs py-0.5">
              선발완료 71%
            </span>
          </div>
        </div>

        <div className="bg-surface-container-lowest p-space-md shadow-xs border border-surface-container">
          <div className="flex items-center justify-between text-on-surface-variant font-label-code text-label-code mb-1">
            <span>안전심의 승인율</span>
            <span className="material-symbols-outlined text-base text-error">security</span>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="font-headline-lg text-display-md text-primary font-bold">
              85.7<span className="text-headline-sm font-normal text-on-surface-variant ml-1">%</span>
            </span>
            <span className="font-tabular-num text-body-sm text-error bg-error-container/40 px-space-xs py-0.5 font-bold">
              미완료 2건
            </span>
          </div>
        </div>
      </div>

      {/* Integrated Filter & Search Console */}
      <div className="bg-surface-container-lowest p-space-md shadow-xs mb-space-lg border border-surface-container">
        <div className="flex items-center justify-between pb-space-sm mb-space-sm bg-surface-container-low/40 px-space-sm py-space-xs border-b border-surface-container">
          <div className="flex items-center gap-space-xs font-label-code text-label-code text-on-surface">
            <span className="material-symbols-outlined text-sm text-secondary">filter_alt</span>
            <span className="font-bold">행정 파라미터 필터 &amp; 다차원 검색기</span>
          </div>
          <span className="font-tabular-num text-label-code text-on-surface-variant">
            조건 검색 일치 항목: {filteredProjects.length}건
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-space-sm items-end">
          {/* Search Input */}
          <div className="md:col-span-4 flex flex-col gap-space-2xs">
            <label className="font-label-code text-label-code text-on-surface-variant font-bold">
              사업명 또는 키워드 검색
            </label>
            <div className="relative w-full">
              <span className="material-symbols-outlined absolute left-2 top-2 text-outline text-base">
                search
              </span>
              <input
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="사업명 또는 키워드 검색..."
                className="w-full h-9 pl-8 pr-2 bg-surface-container-low font-body-sm text-body-sm text-on-surface placeholder:text-outline focus:outline-none focus:bg-surface-container-lowest border border-surface-container focus:border-primary"
              />
            </div>
          </div>

          {/* Filter 1: 회계연도 */}
          <div className="md:col-span-2 flex flex-col gap-space-2xs">
            <label className="font-label-code text-label-code text-on-surface-variant font-bold">
              사업연도
            </label>
            <select
              value={filterYear}
              onChange={(e) => setFilterYear(e.target.value)}
              className="w-full h-9 px-space-xs bg-surface-container-low font-body-sm text-body-sm text-on-surface focus:outline-none border border-surface-container"
            >
              <option value="2027">2027년 (당해년도)</option>
              <option value="2026">2026년 (직전년도)</option>
              <option value="2025">2025년</option>
            </select>
          </div>

          {/* Filter 2: 운영방식 */}
          <div className="md:col-span-2 flex flex-col gap-space-2xs">
            <label className="font-label-code text-label-code text-on-surface-variant font-bold">
              운영방식
            </label>
            <select
              value={filterMode}
              onChange={(e) => setFilterMode(e.target.value)}
              className="w-full h-9 px-space-xs bg-surface-container-low font-body-sm text-body-sm text-on-surface focus:outline-none border border-surface-container"
            >
              <option value="all">전체 운영방식</option>
              <option value="outbound">국외방문형</option>
              <option value="domestic">국내집중형</option>
              <option value="hybrid">온·오프라인연계</option>
            </select>
          </div>

          {/* Filter 3: 진행 상태 */}
          <div className="md:col-span-2 flex flex-col gap-space-2xs">
            <label className="font-label-code text-label-code text-on-surface-variant font-bold">
              진행 상태
            </label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full h-9 px-space-xs bg-surface-container-low font-body-sm text-body-sm text-on-surface focus:outline-none border border-surface-container"
            >
              <option value="all">전체 상태</option>
              <option value="plan">계획수립</option>
              <option value="budget">예산검토</option>
              <option value="safety">안전심의</option>
              <option value="operating">운영중</option>
              <option value="closed">정산완료</option>
            </select>
          </div>

          {/* Actions */}
          <div className="md:col-span-2 flex items-center gap-space-xs">
            <button
              type="button"
              onClick={() => {
                setKeyword('');
                setFilterMode('all');
                setFilterStatus('all');
              }}
              className="w-1/2 h-9 bg-surface-container text-on-surface font-label-code text-label-code font-bold hover:bg-surface-container-high transition-colors cursor-pointer border border-surface-container-high"
            >
              초기화
            </button>
            <button
              type="button"
              onClick={() => onShowToast(`검색 필터가 실행되어 ${filteredProjects.length}건이 조회되었습니다.`)}
              className="w-1/2 h-9 bg-secondary text-on-secondary font-label-code text-label-code font-bold hover:bg-secondary-container transition-colors cursor-pointer"
            >
              조회 실행
            </button>
          </div>
        </div>
      </div>

      {/* Master-Detail Split Workspace Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-space-md items-start">
        {/* Left Master Column: Project Ledger Table (5 cols on XL) */}
        <div className="xl:col-span-5 flex flex-col gap-space-sm bg-surface-container-lowest p-space-md shadow-xs border border-surface-container">
          <div className="flex items-center justify-between pb-space-xs bg-surface-container-low/30 px-space-sm py-space-xs border-b border-surface-container">
            <div className="flex items-center gap-space-xs">
              <span className="material-symbols-outlined text-base text-primary">table_chart</span>
              <span className="font-headline-sm text-body-lg text-primary font-bold">
                사업 목록 현황
              </span>
            </div>
            <span className="font-label-code text-label-code text-on-surface-variant">
              정렬: 최종수정일 역순
            </span>
          </div>

          {/* Compact Ledger Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left font-body-sm">
              <thead>
                <tr className="bg-primary text-on-primary font-label-code text-label-code uppercase tracking-wider">
                  <th className="p-space-xs font-semibold">사업명 / 사업 유형</th>
                  <th className="p-space-xs font-semibold text-center">인원 / 상태</th>
                  <th className="p-space-xs font-semibold text-right">총사업비</th>
                  <th className="p-space-xs font-semibold text-center">조회</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-container-high font-body-sm">
                {filteredProjects.map((proj) => {
                  const isSelected = selectedProject.id === proj.id;
                  return (
                    <tr
                      key={proj.id}
                      onClick={() => onSelectProject(proj)}
                      className={`cursor-pointer transition-colors ${
                        isSelected 
                          ? 'bg-surface-container-high/60 border-l-4 border-secondary' 
                          : 'hover:bg-surface-container-low'
                      }`}
                    >
                      <td className="p-space-xs">
                        <div 
                          className="font-headline-sm text-body-md text-primary font-bold truncate max-w-[210px]" 
                          title={proj.title}
                        >
                          {proj.title}
                        </div>
                        <div className="flex items-center gap-space-2xs text-on-surface-variant font-label-code text-label-code mt-0.5">
                          <span className="text-secondary font-bold">{proj.type}</span>
                          <span>•</span>
                          <span>{proj.period}</span>
                        </div>
                      </td>
                      <td className="p-space-xs text-center">
                        <div className="font-tabular-num font-bold text-on-surface">
                          {proj.participants}명
                        </div>
                        <span className={`inline-block mt-0.5 font-label-code text-label-code px-1.5 py-0.5 font-bold ${
                          proj.status === '운영중' || proj.status === '운영승인완료'
                            ? 'bg-surface-container text-on-tertiary-container'
                            : proj.status === '안전심의'
                              ? 'bg-surface-container text-secondary'
                              : proj.status === '예산검토'
                                ? 'bg-surface-container text-on-primary-fixed-variant'
                                : 'bg-surface-container-high text-on-surface'
                        }`}>
                          {proj.status}
                        </span>
                      </td>
                      <td className="p-space-xs text-right font-tabular-num font-semibold text-on-surface">
                        ₩{(proj.totalBudget).toLocaleString()}
                        <div className="font-label-code text-label-code text-on-surface-variant font-normal">
                          {proj.department}
                        </div>
                      </td>
                      <td className="p-space-xs text-center">
                        <button
                          type="button"
                          className={`w-7 h-7 flex items-center justify-center font-label-code text-label-code ${
                            isSelected 
                              ? 'bg-primary text-on-primary' 
                              : 'bg-surface-container text-primary hover:bg-surface-container-high'
                          }`}
                          title={isSelected ? '선택됨' : '상세보기'}
                        >
                          <span className="material-symbols-outlined text-sm">
                            {isSelected ? 'visibility' : 'chevron_right'}
                          </span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination / Audit Strip */}
          <div className="flex items-center justify-between pt-space-xs font-label-code text-label-code text-on-surface-variant border-t border-surface-container">
            <span>페이지 1 / 1 (전체 {filteredProjects.length}건 로드)</span>
            <div className="flex items-center gap-1">
              <button 
                type="button" 
                disabled 
                className="px-2 py-1 bg-surface-container text-on-surface disabled:opacity-40"
              >
                이전
              </button>
              <button 
                type="button" 
                className="px-2 py-1 bg-primary text-on-primary font-bold"
              >
                1
              </button>
              <button 
                type="button" 
                disabled 
                className="px-2 py-1 bg-surface-container text-on-surface disabled:opacity-40"
              >
                다음
              </button>
            </div>
          </div>

          {/* Visual Context: Institutional Photo Card */}
          <div className="mt-space-sm bg-surface-container-low p-space-sm border border-surface-container">
            <div className="flex items-center justify-between mb-space-xs font-label-code text-label-code text-on-surface-variant">
              <span>현지 거점 연구소 및 탐방지</span>
              <span className="text-secondary font-bold">SINGAPORE BIO-POLIS</span>
            </div>
            <img
              alt="Singapore Bio-Polis research complex"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDp1xRXjnNlniui-VaOU8M4lml-DPZhx7sB_baSib2x43R1WdbvJvp5coyK98uL3qGcNytAa9My_COB8tE40Ayk9dag5OmXLta_q-Vjw5wkNQyzI-_R8Gox1OmaM6jsDna873TAmeMBTeD-EOVEYpqkSaZj5zYEc-Le__XGjP2pIPiF48Wqtre_15_jJvIpN40h0LUMafLDxQNrZ58Y40iqi1xkcYsolPtp2IuLNH-LxOrEZdwVH-U"
              className="w-full h-32 object-cover border border-outline-variant/60"
            />
          </div>
        </div>

        {/* Right Detail Column: Selected Project Comprehensive Panel (7 cols on XL) */}
        <div className="xl:col-span-7 flex flex-col gap-space-sm bg-surface-container-lowest p-space-md shadow-xs border border-surface-container">
          {/* Detail Header Bar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between pb-space-sm gap-space-xs bg-surface-container-low/40 px-space-sm py-space-xs border-b border-surface-container">
            <div className="flex items-center gap-space-xs">
              <span className="w-2.5 h-2.5 bg-secondary"></span>
              <h2 className="font-headline-sm text-body-lg text-primary font-bold tracking-tight">
                선택 사업 상세정보: {selectedProject.title}
              </h2>
            </div>
            <div className="flex items-center gap-space-xs">
              <span className="font-label-code text-label-code bg-surface-container-high px-space-xs py-0.5 text-primary font-bold">
                ID: {selectedProject.code}
              </span>
              <span className="font-label-code text-label-code bg-surface-container text-on-tertiary-container px-space-xs py-0.5 font-bold">
                상태: {selectedProject.status}
              </span>
            </div>
          </div>

          {/* Tab Navigation Strip */}
          <div className="flex flex-wrap items-center bg-surface-container gap-space-2xs p-space-2xs text-label-code font-label-code uppercase border border-surface-container-high">
            <button
              type="button"
              onClick={() => setActiveTab('basic')}
              className={`px-space-md py-space-xs font-bold cursor-pointer transition-colors ${
                activeTab === 'basic' ? 'bg-primary text-on-primary' : 'bg-surface-container-low text-on-surface hover:bg-surface-container-lowest'
              }`}
            >
              기본정보 {activeTab === 'basic' && '(선택됨)'}
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('plan')}
              className={`px-space-md py-space-xs cursor-pointer transition-colors ${
                activeTab === 'plan' ? 'bg-primary text-on-primary font-bold' : 'bg-surface-container-low text-on-surface hover:bg-surface-container-lowest'
              }`}
            >
              운영계획
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('budget')}
              className={`px-space-md py-space-xs cursor-pointer transition-colors flex items-center gap-1 ${
                activeTab === 'budget' ? 'bg-primary text-on-primary font-bold' : 'bg-surface-container-low text-on-surface hover:bg-surface-container-lowest'
              }`}
            >
              <span>예산</span>
              <span className="font-tabular-num font-bold text-secondary">
                ₩{(selectedProject.totalBudget / 1000000).toFixed(0)}M
              </span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('participation')}
              className={`px-space-md py-space-xs cursor-pointer transition-colors flex items-center gap-1 ${
                activeTab === 'participation' ? 'bg-primary text-on-primary font-bold' : 'bg-surface-container-low text-on-surface hover:bg-surface-container-lowest'
              }`}
            >
              <span>참여 현황</span>
              <span className="font-tabular-num font-bold text-primary">
                {selectedProject.participants}명
              </span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('safety')}
              className={`px-space-md py-space-xs cursor-pointer transition-colors flex items-center gap-1 ${
                activeTab === 'safety' ? 'bg-primary text-on-primary font-bold' : 'bg-surface-container-low text-on-surface hover:bg-surface-container-lowest'
              }`}
            >
              <span>안전관리</span>
              <span className="font-tabular-num font-bold text-on-tertiary-container">80%</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('performance')}
              className={`px-space-md py-space-xs cursor-pointer transition-colors ${
                activeTab === 'performance' ? 'bg-primary text-on-primary font-bold' : 'bg-surface-container-low text-on-surface hover:bg-surface-container-lowest'
              }`}
            >
              교육성과
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('history')}
              className={`px-space-md py-space-xs cursor-pointer transition-colors ${
                activeTab === 'history' ? 'bg-primary text-on-primary font-bold' : 'bg-surface-container-low text-on-surface hover:bg-surface-container-lowest'
              }`}
            >
              변경 이력
            </button>
          </div>

          {/* Tab 1: Administrative Field Grid (Editable Specimen) */}
          {activeTab === 'basic' && (
            <div className="space-y-space-md pt-space-xs">
              {/* Standard Notice / Validation Guide Strip */}
              <div className="bg-surface-container-low p-space-sm flex items-start gap-space-sm border border-surface-container">
                <span className="material-symbols-outlined text-secondary text-lg mt-0.5">verified_user</span>
                <div className="flex flex-col text-on-surface-variant font-body-sm text-body-sm">
                  <span className="font-bold text-on-surface">행정 데이터 무결성 검증 기준</span>
                  <span>
                    필수 입력 항목이 누락되면 해당 필드 아래에 구체적인 오류 안내문('※ 필수 입력 항목입니다')을 표기하는 표준 행정 가이드라인을 준수합니다.
                  </span>
                </div>
              </div>

              {/* Two-Column Form Field Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
                {/* 사업 목적 (Full Span) */}
                <div className="md:col-span-2 flex flex-col gap-space-2xs">
                  <label className="font-label-code text-label-code text-on-surface-variant font-bold flex items-center gap-1">
                    <span>사업 목적</span>
                    <span className="text-error font-bold">*</span>
                  </label>
                  <textarea
                    rows={2}
                    value={formData.purpose}
                    onChange={(e) => handleInputChange('purpose', e.target.value)}
                    className="w-full p-space-xs bg-surface-container-low font-body-sm text-body-sm text-on-surface focus:outline-none focus:bg-surface-container-lowest leading-relaxed border border-surface-container focus:border-primary"
                  />
                </div>

                {/* 추진 배경 (Full Span) */}
                <div className="md:col-span-2 flex flex-col gap-space-2xs">
                  <label className="font-label-code text-label-code text-on-surface-variant font-bold flex items-center gap-1">
                    <span>추진 배경</span>
                    <span className="text-error font-bold">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.background}
                    onChange={(e) => handleInputChange('background', e.target.value)}
                    className="w-full h-9 px-space-xs bg-surface-container-low font-body-sm text-body-sm text-on-surface focus:outline-none focus:bg-surface-container-lowest border border-surface-container focus:border-primary"
                  />
                </div>

                {/* 대상 및 인원 */}
                <div className="flex flex-col gap-space-2xs">
                  <label className="font-label-code text-label-code text-on-surface-variant font-bold flex items-center gap-1">
                    <span>대상 및 인원 구성</span>
                    <span className="text-error font-bold">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.targetInfo}
                    onChange={(e) => handleInputChange('targetInfo', e.target.value)}
                    className="w-full h-9 px-space-xs bg-surface-container-low font-body-sm text-body-sm text-on-surface focus:outline-none focus:bg-surface-container-lowest border border-surface-container focus:border-primary"
                  />
                  <span className="font-label-code text-label-code text-secondary font-bold">
                    사회배려대상자 의무 배정 기준 (20%) 충족완료
                  </span>
                </div>

                {/* 운영 기간 및 일정 */}
                <div className="flex flex-col gap-space-2xs">
                  <label className="font-label-code text-label-code text-on-surface-variant font-bold flex items-center gap-1">
                    <span>운영 기간 및 일정</span>
                    <span className="text-error font-bold">*</span>
                  </label>
                  <div className="flex items-center gap-space-xs">
                    <input
                      type="text"
                      value={formData.startDate}
                      onChange={(e) => handleInputChange('startDate', e.target.value)}
                      className="w-1/2 h-9 px-space-xs bg-surface-container-low font-body-sm text-body-sm text-on-surface text-center focus:outline-none focus:bg-surface-container-lowest border border-surface-container focus:border-primary"
                    />
                    <span className="text-on-surface-variant font-bold">~</span>
                    <input
                      type="text"
                      value={formData.endDate}
                      onChange={(e) => handleInputChange('endDate', e.target.value)}
                      className="w-1/2 h-9 px-space-xs bg-surface-container-low font-body-sm text-body-sm text-on-surface text-center focus:outline-none focus:bg-surface-container-lowest border border-surface-container focus:border-primary"
                    />
                  </div>
                  <span className="font-label-code text-label-code text-on-surface-variant">
                    파견 기간: 6박 8일 현지 체류 기준
                  </span>
                </div>

                {/* 방문 기관 */}
                <div className="flex flex-col gap-space-2xs">
                  <label className="font-label-code text-label-code text-on-surface-variant font-bold flex items-center gap-1">
                    <span>주요 방문 기관</span>
                    <span className="text-error font-bold">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.hostOrgs}
                    onChange={(e) => handleInputChange('hostOrgs', e.target.value)}
                    className="w-full h-9 px-space-xs bg-surface-container-low font-body-sm text-body-sm text-on-surface focus:outline-none focus:bg-surface-container-lowest border border-surface-container focus:border-primary"
                  />
                </div>

                {/* 총괄 담당자 */}
                <div className="flex flex-col gap-space-2xs">
                  <label className="font-label-code text-label-code text-on-surface-variant font-bold flex items-center gap-1">
                    <span>총괄 담당자 (장학관/연구사)</span>
                    <span className="text-error font-bold">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.managerContact ? `${formData.manager} (${formData.managerContact})` : formData.manager}
                    onChange={(e) => handleInputChange('manager', e.target.value)}
                    className="w-full h-9 px-space-xs bg-surface-container-low font-body-sm text-body-sm text-on-surface focus:outline-none focus:bg-surface-container-lowest border border-surface-container focus:border-primary"
                  />
                </div>

                {/* 추진 상태 및 결재 번호 */}
                <div className="md:col-span-2 flex flex-col gap-space-2xs bg-surface-container-low p-space-sm border border-surface-container">
                  <div className="flex items-center justify-between">
                    <span className="font-label-code text-label-code text-on-surface-variant font-bold">
                      공식 행정 결재 및 감사 상태
                    </span>
                    <span className="font-label-code text-label-code bg-surface-container text-on-surface px-space-xs py-0.5">
                      정부 전자문서유통시스템 연계
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-space-sm pt-space-2xs">
                    <div className="flex items-center justify-between bg-surface-container-lowest px-space-sm py-space-xs border border-surface-container">
                      <span className="font-body-sm text-on-surface-variant">추진 상태:</span>
                      <span className="font-headline-sm text-body-md text-on-tertiary-container font-bold">
                        {formData.status}
                      </span>
                    </div>
                    <div className="flex items-center justify-between bg-surface-container-lowest px-space-sm py-space-xs border border-surface-container">
                      <span className="font-body-sm text-on-surface-variant">결재문서번호:</span>
                      <span className="font-tabular-num text-body-sm text-primary font-bold">
                        {formData.approvalDocNum}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Simulated Field with Validation Guard */}
                <div className="md:col-span-2 flex flex-col gap-space-2xs">
                  <label className="font-label-code text-label-code text-on-surface-variant font-bold flex items-center justify-between">
                    <span className="flex items-center gap-1">
                      <span>현지 인솔단 지정 증빙 첨부서류</span>
                      <span className="text-error font-bold">*</span>
                    </span>
                    <span className="font-label-code text-label-code text-outline">
                      규정: 교원 1인당 학생 15명 이하 엄수
                    </span>
                  </label>
                  <input
                    type="text"
                    readOnly
                    value={formData.escortProofDoc}
                    className="w-full h-9 px-space-xs bg-surface-container-low font-body-sm text-body-sm text-on-surface focus:outline-none border border-surface-container"
                  />
                </div>
              </div>

              {/* Action Control Bar */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-space-sm pt-space-md bg-surface-container-low/50 px-space-sm py-space-sm border-t border-surface-container">
                <div className="flex items-center gap-space-xs font-label-code text-label-code text-on-surface-variant">
                  <span className="material-symbols-outlined text-base text-secondary">history</span>
                  <span>최종 갱신: {formData.updatedAt} (KST)</span>
                </div>
                <div className="flex items-center gap-space-xs w-full sm:w-auto justify-end">
                  <button
                    type="button"
                    onClick={handlePrintPDF}
                    className="px-space-md py-space-sm bg-surface-container-lowest text-primary font-label-code text-label-code uppercase tracking-wider hover:bg-surface-container transition-colors flex items-center gap-space-xs border border-surface-container cursor-pointer font-bold"
                  >
                    <span className="material-symbols-outlined text-base">print</span>
                    <span>사업계획서 인쇄/PDF</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => onNavigateTab('safety-management')}
                    className="px-space-md py-space-sm bg-surface-container text-secondary font-label-code text-label-code uppercase tracking-wider hover:bg-surface-container-high transition-colors flex items-center gap-space-xs border border-surface-container-high cursor-pointer font-bold"
                  >
                    <span className="material-symbols-outlined text-base">health_and_safety</span>
                    <span>안전점검 연계 확인</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleSave}
                    className="px-space-md py-space-sm bg-primary text-on-primary font-label-code text-label-code uppercase tracking-wider hover:bg-primary-container transition-colors flex items-center gap-space-xs font-bold cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-base">save</span>
                    <span>수정사항 저장</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: 운영계획 */}
          {activeTab === 'plan' && (
            <div className="space-y-space-md pt-space-xs font-body-sm text-body-sm">
              <div className="p-space-sm bg-surface-container-low border border-surface-container">
                <span className="font-headline-sm text-body-md text-primary font-bold block mb-1">
                  6박 8일 표준 세부 여정 계획안
                </span>
                <p className="text-on-surface-variant mb-space-sm">
                  인천국제공항 출발부터 창이공항 귀국까지 안전통제 및 현지 학술 교류 일정 요약입니다.
                </p>
                <div className="space-y-2">
                  <div className="p-2 bg-surface-container-lowest border border-surface-container flex justify-between">
                    <span><strong>1일차 (출국):</strong> 세종종합청사 집결 → 인천공항 직항 출발 → 싱가포르 창이공항 도착 및 호텔 입실</span>
                    <span className="font-label-code text-on-tertiary-container font-bold">확정</span>
                  </div>
                  <div className="p-2 bg-surface-container-lowest border border-surface-container flex justify-between">
                    <span><strong>2~3일차 (학술):</strong> 싱가포르 국립대(NUS) AI 연구실 석학 세미나 및 현지 대학생 진로 멘토링</span>
                    <span className="font-label-code text-on-tertiary-container font-bold">확정</span>
                  </div>
                  <div className="p-2 bg-surface-container-lowest border border-surface-container flex justify-between">
                    <span><strong>4~5일차 (산업):</strong> A*STAR 연구단지 바이오폴리스 방문, 구글 아태본부 테크 세션</span>
                    <span className="font-label-code text-secondary font-bold">일정 조율</span>
                  </div>
                  <div className="p-2 bg-surface-container-lowest border border-surface-container flex justify-between">
                    <span><strong>6~7일차 (성과/귀국):</strong> 탐구 결과물 조별 발표회 및 안전 평가회, 공항 이동</span>
                    <span className="font-label-code text-on-tertiary-container font-bold">확정</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 3: 예산 */}
          {activeTab === 'budget' && (
            <div className="space-y-space-md pt-space-xs font-body-sm text-body-sm">
              <div className="p-space-sm bg-surface-container-low border border-surface-container flex items-center justify-between">
                <div>
                  <span className="font-headline-sm text-body-md text-primary font-bold block">
                    본 사업 배정 예산 총괄: ₩{(selectedProject.totalBudget).toLocaleString()}
                  </span>
                  <span className="text-on-surface-variant">세종교육청 진로교육 특별회계 교부금</span>
                </div>
                <button
                  type="button"
                  onClick={() => onNavigateTab('budget-management')}
                  className="px-space-md py-1 bg-primary text-on-primary font-label-code text-label-code uppercase font-bold"
                >
                  예산관리 터미널로 이동 →
                </button>
              </div>
            </div>
          )}

          {/* Tab 4: 참여 현황 */}
          {activeTab === 'participation' && (
            <div className="space-y-space-md pt-space-xs font-body-sm text-body-sm">
              <div className="p-space-sm bg-surface-container-low border border-surface-container space-y-2">
                <span className="font-headline-sm text-body-md text-primary font-bold block">
                  참가 학생 선발 현황 (선발 완료 100명 / 결원 0명)
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2 bg-surface-container-lowest border border-surface-container">
                    <span className="text-on-surface-variant block text-xs">일반고 선발</span>
                    <span className="font-bold text-base text-primary">60명 (60%)</span>
                  </div>
                  <div className="p-2 bg-surface-container-lowest border border-surface-container">
                    <span className="text-on-surface-variant block text-xs">특성화고 및 영재고</span>
                    <span className="font-bold text-base text-primary">40명 (40%)</span>
                  </div>
                </div>
                <div className="p-2 bg-secondary-fixed/40 border border-secondary text-primary font-semibold text-xs">
                  ※ 국민기초생활수급권자, 차상위계층, 한부모가정 의무 배정 20명(20%) 전원 선발 및 여비 전액 감면 조치 완료
                </div>
              </div>
            </div>
          )}

          {/* Tab 5: 안전관리 */}
          {activeTab === 'safety' && (
            <div className="space-y-space-md pt-space-xs font-body-sm text-body-sm">
              <div className="p-space-sm bg-surface-container-low border border-surface-container flex items-center justify-between">
                <div>
                  <span className="font-headline-sm text-body-md text-primary font-bold block">
                    법정 안전 점검 진척도 (83.3% 승인 완료)
                  </span>
                  <span className="text-error font-bold text-xs">
                    ※ 미완료 항목 2건: 방문기관 안전확약, 현지 이동차량 보험
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => onNavigateTab('safety-management')}
                  className="px-space-md py-1 bg-error text-on-error font-label-code text-label-code uppercase font-bold"
                >
                  안전관리 점검대장 확인 →
                </button>
              </div>
            </div>
          )}

          {/* Tab 6: 교육성과 */}
          {activeTab === 'performance' && (
            <div className="space-y-space-md pt-space-xs font-body-sm text-body-sm">
              <div className="p-space-sm bg-surface-container-low border border-surface-container space-y-2">
                <span className="font-headline-sm text-body-md text-primary font-bold block">
                  목표 K-CDI 역량 변화 지표
                </span>
                <p className="text-on-surface-variant text-xs">
                  사전 측정 3.12점에서 사후 종합 역량 지수 4.38점(+1.26점) 달성을 목표로 진로 코칭을 병행합니다.
                </p>
              </div>
            </div>
          )}

          {/* Tab 7: 변경 이력 */}
          {activeTab === 'history' && (
            <div className="space-y-space-md pt-space-xs font-body-sm text-body-sm">
              <div className="p-space-sm bg-surface-container-low border border-surface-container space-y-2">
                <span className="font-headline-sm text-body-md text-primary font-bold block">
                  행정 감사 추적 로그
                </span>
                <div className="text-xs space-y-1 text-on-surface-variant">
                  <div>[2027-05-14 16:32:01] 김지현 장학관: 인솔교사배치계획 승인문서 갱신</div>
                  <div>[2027-05-10 11:15:20] 박성훈 장학사: 방문기관 목록 싱가포르 A*STAR 연구소 추가</div>
                  <div>[2027-04-28 09:30:00] 김재원 주무관: 본예산 ₩50,000,000 교부액 전산 확정</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
