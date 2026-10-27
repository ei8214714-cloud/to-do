import React, { useState } from 'react';
import { ProjectItem, ActionItem, KCDIDimension, NavTab } from '../types';
import { MONTHLY_BUDGET_DATA, PIPELINE_STAGES } from '../data/mockData';

interface DashboardViewProps {
  projects: ProjectItem[];
  actionItems: ActionItem[];
  kcdiMetrics: KCDIDimension[];
  onNavigateTab: (tab: NavTab) => void;
  onSelectProject: (project: ProjectItem) => void;
  onOpenNewProject: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  projects,
  actionItems,
  kcdiMetrics,
  onNavigateTab,
  onSelectProject,
  onOpenNewProject,
}) => {
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);
  const [tableFilter, setTableFilter] = useState<'all' | 'recent'>('recent');

  const displayedProjects = tableFilter === 'recent' ? projects.slice(0, 4) : projects;

  // Calculate dynamic KPIs
  const totalProjects = projects.length;
  const inProgressCount = projects.filter(p => p.status === '운영중' || p.status === '운영승인완료').length;
  const planningCount = projects.filter(p => p.status === '계획수립' || p.status === '계획승인' || p.status === '예산검토' || p.status === '안전심의').length;
  const completedCount = projects.filter(p => p.status === '정산완료').length;
  const totalStudents = projects.reduce((acc, p) => acc + (p.participants || 0), 0) + 1000; // calibrated with total

  return (
    <div className="flex flex-col w-full space-y-space-md">
      {/* Command Operations Header */}
      <div className="bg-surface-container-lowest p-space-lg shadow-xs flex flex-col xl:flex-row xl:items-center justify-between gap-space-md border border-surface-container">
        <div className="flex flex-col space-y-space-2xs min-w-0">
          <div className="flex flex-wrap items-center gap-space-xs">
            <span className="font-label-code text-label-code px-space-xs py-0.5 bg-primary text-on-primary">
              MUNICIPAL DEPT. CAREER &amp; TALENT
            </span>
            <span className="font-label-code text-label-code px-space-xs py-0.5 bg-surface-container text-on-primary-fixed-variant">
              SEJONG EDU COUNCIL
            </span>
            <span className="font-label-code text-label-code px-space-xs py-0.5 bg-surface-container-high text-on-surface">
              SYS.VER 2.4.1
            </span>
          </div>
          <h1 className="font-display-lg text-display-lg text-primary tracking-tight">
            글로벌 진로탐험대 NEXT
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant">
            사업 운영 현황과 주요 성과를 한눈에 확인하세요. 
            <span className="font-label-code text-label-code text-error bg-error-container/40 px-space-xs py-0.5 ml-1">
              ※ 본 화면의 모든 수치는 시뮬레이션용 예시 데이터입니다
            </span>
          </p>
        </div>

        {/* Executive Action Group */}
        <div className="flex items-center flex-wrap gap-space-xs shrink-0">
          <button 
            type="button" 
            onClick={() => onNavigateTab('budget-management')}
            className="h-9 px-space-md bg-surface-container-lowest text-primary hover:bg-surface-container-low transition-colors font-body-sm text-body-sm font-bold flex items-center gap-space-xs border border-surface-container"
          >
            <span className="material-symbols-outlined text-base">account_balance_wallet</span>
            <span>예산 현황 보기</span>
          </button>
          <button 
            type="button"
            onClick={() => onNavigateTab('performance-evaluation')}
            className="h-9 px-space-md bg-surface-container-lowest text-primary hover:bg-surface-container-low transition-colors font-body-sm text-body-sm font-bold flex items-center gap-space-xs border border-surface-container"
          >
            <span className="material-symbols-outlined text-base">assessment</span>
            <span>성과 보고서 보기</span>
          </button>
          <button 
            type="button"
            onClick={onOpenNewProject}
            className="h-9 px-space-lg bg-primary text-on-primary hover:bg-primary-container transition-colors font-body-sm text-body-sm font-bold flex items-center gap-space-xs"
          >
            <span className="material-symbols-outlined text-base">add_circle</span>
            <span>+ 신규 사업 등록</span>
          </button>
        </div>
      </div>

      {/* Critical Operational Alert Ribbon */}
      <div className="bg-surface-container-high p-space-md shadow-xs flex items-start sm:items-center justify-between gap-space-md border-l-4 border-error">
        <div className="flex items-center gap-space-sm min-w-0">
          <div className="w-8 h-8 bg-primary text-surface flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-lg">crisis_alert</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-x-space-md gap-y-0.5 min-w-0">
            <span className="font-headline-sm text-headline-sm text-primary whitespace-nowrap font-bold">
              2027 상반기 정기 행정점검 기간
            </span>
            <p className="font-body-sm text-body-sm text-on-surface truncate">
              2027 사업연도 상반기 진로탐험대 정기 점검 기간입니다. 안전점검 미완료 사업 2건 및 산출근거 검토 필요 항목을 확인하세요.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-space-xs shrink-0">
          <span className="font-label-code text-label-code px-space-xs py-0.5 bg-error text-on-error font-bold">
            D-5 ACTION REQUIRED
          </span>
          <button 
            type="button"
            onClick={() => onNavigateTab('safety-management')}
            className="font-label-code text-label-code px-space-sm py-1 bg-primary text-on-primary hover:bg-primary-container transition-colors flex items-center gap-space-2xs cursor-pointer font-bold"
          >
            조치 바로가기
            <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </button>
        </div>
      </div>

      {/* Top KPI Analytical Matrix (5-Column Structured Grid) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-space-md">
        {/* KPI 1: 전체 사업 수 */}
        <div className="bg-surface-container-lowest p-space-md shadow-xs flex flex-col justify-between border border-surface-container">
          <div className="flex items-center justify-between pb-space-xs">
            <span className="font-label-code text-label-code text-on-surface-variant uppercase">
              전체 사업 수 (PROJECTS)
            </span>
            <span className="font-label-code text-label-code bg-surface-container px-space-2xs py-0.5 text-primary font-bold">
              FY27
            </span>
          </div>
          <div className="py-space-xs">
            <div className="flex items-baseline gap-space-2xs">
              <span className="font-display-lg text-display-lg text-primary tabular-nums font-bold">
                {totalProjects}
              </span>
              <span className="font-headline-sm text-headline-sm text-on-surface-variant">개 사업</span>
            </div>
            <div className="flex items-center gap-space-xs font-label-code text-label-code text-on-surface-variant mt-1">
              <span className="text-secondary font-bold">진행 {inProgressCount || 8}</span>
              <span>·</span>
              <span>계획 {planningCount || 3}</span>
              <span>·</span>
              <span className="text-outline">완료 {completedCount || 1}</span>
            </div>
          </div>
          <div className="pt-space-xs bg-surface-container-low px-space-xs py-1 flex items-center justify-between font-label-code text-label-code text-on-surface-variant border-t border-surface-container">
            <span>산출기준: 전수조사</span>
            <span className="font-tabular-num text-tabular-num">2027.05.15</span>
          </div>
        </div>

        {/* KPI 2: 총사업비 */}
        <div className="bg-surface-container-lowest p-space-md shadow-xs flex flex-col justify-between border border-surface-container">
          <div className="flex items-center justify-between pb-space-xs">
            <span className="font-label-code text-label-code text-on-surface-variant uppercase">
              총사업비 (ALLOCATED)
            </span>
            <span className="font-label-code text-label-code bg-surface-container px-space-2xs py-0.5 text-primary font-bold">
              본예산
            </span>
          </div>
          <div className="py-space-xs">
            <div className="flex items-baseline gap-space-2xs">
              <span className="font-headline-lg text-headline-lg text-primary tabular-nums font-bold">
                ₩580,000,000
              </span>
            </div>
            <div className="font-body-sm text-body-sm text-on-surface-variant mt-1 flex items-center gap-space-2xs">
              <span className="material-symbols-outlined text-sm text-primary">account_balance</span>
              <span>세종교육청 본예산 확정액</span>
            </div>
          </div>
          <div className="pt-space-xs bg-surface-container-low px-space-xs py-1 flex items-center justify-between font-label-code text-label-code text-on-surface-variant border-t border-surface-container">
            <span>기준: 진로교육 특별회계</span>
            <span className="font-tabular-num text-tabular-num font-bold">100% 확정</span>
          </div>
        </div>

        {/* KPI 3: 예산 집행률 */}
        <div className="bg-surface-container-lowest p-space-md shadow-xs flex flex-col justify-between border border-surface-container">
          <div className="flex items-center justify-between pb-space-xs">
            <span className="font-label-code text-label-code text-on-surface-variant uppercase">
              예산 집행률 (EXECUTION)
            </span>
            <span className="font-label-code text-label-code bg-secondary-fixed text-on-secondary-fixed px-space-2xs py-0.5 font-bold">
              정상
            </span>
          </div>
          <div className="py-space-xs">
            <div className="flex items-baseline gap-space-2xs">
              <span className="font-display-lg text-display-lg text-secondary tabular-nums font-bold">
                42.8%
              </span>
            </div>
            <div className="font-body-sm text-body-sm text-on-surface-variant mt-1 truncate">
              집행 ₩248,240,000 / ₩580M
            </div>
          </div>
          <div className="pt-space-xs">
            <div className="w-full bg-surface-container h-1.5 overflow-hidden">
              <div className="bg-secondary h-full" style={{ width: '42.8%' }}></div>
            </div>
          </div>
        </div>

        {/* KPI 4: 참여 학생 수 */}
        <div className="bg-surface-container-lowest p-space-md shadow-xs flex flex-col justify-between border border-surface-container">
          <div className="flex items-center justify-between pb-space-xs">
            <span className="font-label-code text-label-code text-on-surface-variant uppercase">
              참여 학생 수 (STUDENTS)
            </span>
            <span className="font-label-code text-label-code bg-surface-container px-space-2xs py-0.5 text-primary font-bold">
              누적
            </span>
          </div>
          <div className="py-space-xs">
            <div className="flex items-baseline gap-space-2xs">
              <span className="font-display-lg text-display-lg text-primary tabular-nums font-bold">
                1,420
              </span>
              <span className="font-headline-sm text-headline-sm text-on-surface-variant">명</span>
            </div>
            <div className="font-body-sm text-body-sm text-on-surface-variant mt-1">
              목표 1,800명 대비 <span className="text-primary font-bold">78.9%</span> 달성
            </div>
          </div>
          <div className="pt-space-xs bg-surface-container-low px-space-xs py-1 flex items-center justify-between font-label-code text-label-code text-on-surface-variant border-t border-surface-container">
            <span>세종 관내 중·고</span>
            <span className="font-tabular-num text-tabular-num font-bold">총 24개교 참여</span>
          </div>
        </div>

        {/* KPI 5: 안전 점검 완료율 */}
        <div className="bg-surface-container-lowest p-space-md shadow-xs flex flex-col justify-between border border-surface-container">
          <div className="flex items-center justify-between pb-space-xs">
            <span className="font-label-code text-label-code text-on-surface-variant uppercase">
              안전 점검 완료율 (SAFETY)
            </span>
            <span className="font-label-code text-label-code bg-error text-on-error px-space-2xs py-0.5 font-bold">
              주의 (6건)
            </span>
          </div>
          <div className="py-space-xs">
            <div className="flex items-baseline gap-space-2xs">
              <span className="font-display-lg text-display-lg text-primary tabular-nums font-bold">
                83.3%
              </span>
            </div>
            <div className="font-body-sm text-body-sm text-on-surface-variant mt-1">
              총 36건 중 30건 승인 완료
            </div>
          </div>
          <div className="pt-space-xs">
            <div className="w-full bg-surface-container h-1.5 overflow-hidden flex">
              <div className="bg-on-tertiary-container h-full" style={{ width: '83.3%' }}></div>
              <div className="bg-error h-full" style={{ width: '16.7%' }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Operational Analytical Bento (4 Core Panels) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-md">
        {/* Chart Panel 1: Budget Planning vs Execution (8 cols) */}
        <div className="lg:col-span-8 bg-surface-container-lowest shadow-xs flex flex-col border border-surface-container">
          <div className="p-space-md bg-surface-container-low flex items-center justify-between border-b border-surface-container">
            <div className="flex items-center gap-space-sm">
              <span className="material-symbols-outlined text-primary text-lg">bar_chart</span>
              <span className="font-headline-sm text-headline-sm text-primary font-bold">
                월별 예산 계획 대비 집행액 현황 (2027 상반기)
              </span>
            </div>
            <div className="flex items-center gap-space-md font-label-code text-label-code">
              <div className="flex items-center gap-space-2xs">
                <span className="w-3 h-3 bg-surface-variant"></span>
                <span className="text-on-surface-variant">계획 예산 (Planned)</span>
              </div>
              <div className="flex items-center gap-space-2xs">
                <span className="w-3 h-3 bg-primary"></span>
                <span className="text-primary font-bold">실제 집행액 (Actual)</span>
              </div>
              <span className="text-outline">|</span>
              <span className="text-on-surface-variant">단위: 백만원</span>
            </div>
          </div>

          <div className="p-space-lg flex-1 flex flex-col justify-end">
            {/* Visual Bar Matrix */}
            <div className="h-56 flex items-end justify-between gap-space-md pb-space-sm">
              {MONTHLY_BUDGET_DATA.map((item) => (
                <div
                  key={item.month}
                  onMouseEnter={() => setSelectedMonth(item.month)}
                  onMouseLeave={() => setSelectedMonth(null)}
                  className={`flex-1 flex flex-col items-center h-full justify-end group transition-all ${
                    item.isCurrent ? 'bg-surface-container/30 p-1' : ''
                  }`}
                >
                  <div className={`font-tabular-num text-body-sm mb-1 transition-opacity ${
                    item.isCurrent 
                      ? 'text-secondary font-bold opacity-100' 
                      : selectedMonth === item.month ? 'opacity-100 text-primary font-bold' : 'opacity-0 group-hover:opacity-100 text-outline'
                  }`}>
                    {item.label}
                  </div>
                  <div className="w-full flex items-end justify-center gap-1 h-44">
                    {/* Planned Bar */}
                    <div
                      className="w-5 bg-surface-variant transition-all hover:opacity-80"
                      style={{ height: `${(item.planned / 120) * 100}%` }}
                      title={`계획: ₩${item.planned}M`}
                    ></div>
                    {/* Actual Bar */}
                    <div
                      className={`w-5 transition-all ${
                        item.isCurrent 
                          ? 'bg-secondary' 
                          : item.isFuture 
                            ? 'bg-outline-variant' 
                            : 'bg-primary'
                      }`}
                      style={{ height: `${(item.actual / 120) * 100}%` }}
                      title={`실집행: ₩${item.actual}M`}
                    ></div>
                  </div>
                  <span className={`font-label-code text-label-code mt-space-xs ${
                    item.isCurrent ? 'text-secondary font-bold' : 'text-on-surface-variant'
                  }`}>
                    {item.month}
                  </span>
                </div>
              ))}
            </div>

            <div className="bg-surface-container-low p-space-sm flex flex-wrap items-center justify-between font-label-code text-label-code text-on-surface-variant mt-space-sm border-t border-surface-container">
              <span>누적 집행 총액: <strong className="text-primary font-tabular-num text-body-sm font-bold">₩248,240,000</strong></span>
              <span>집행률 편차: <span className="text-on-tertiary-container font-bold">+1.2% 안정권</span> (전년 동기 대비)</span>
              <span>미집행 잔여예산: <span className="text-on-surface font-tabular-num font-bold">₩331,760,000</span></span>
            </div>
          </div>
        </div>

        {/* Chart Panel 2: Program Enrollment Distribution (4 cols) */}
        <div className="lg:col-span-4 bg-surface-container-lowest shadow-xs flex flex-col justify-between border border-surface-container">
          <div className="p-space-md bg-surface-container-low flex items-center justify-between border-b border-surface-container">
            <div className="flex items-center gap-space-sm">
              <span className="material-symbols-outlined text-primary text-lg">pie_chart</span>
              <span className="font-headline-sm text-headline-sm text-primary font-bold">
                사업별 참여 학생 수 비교
              </span>
            </div>
            <span className="font-label-code text-label-code px-space-xs py-0.5 bg-surface-container text-primary font-bold">
              총 1,420명
            </span>
          </div>

          <div className="p-space-md space-y-space-md flex-1 flex flex-col justify-center">
            {/* Item 1 */}
            <div className="space-y-space-2xs">
              <div className="flex items-center justify-between text-body-sm">
                <span className="font-body-md text-primary font-semibold truncate">
                  글로벌 첨단기술 탐험(싱가포르)
                </span>
                <span className="font-tabular-num text-tabular-num font-bold text-primary">
                  480명 <span className="text-outline font-normal">(33.8%)</span>
                </span>
              </div>
              <div className="w-full bg-surface-container h-2.5 overflow-hidden">
                <div className="bg-primary h-full" style={{ width: '33.8%' }}></div>
              </div>
            </div>

            {/* Item 2 */}
            <div className="space-y-space-2xs">
              <div className="flex items-center justify-between text-body-sm">
                <span className="font-body-md text-primary font-semibold truncate">
                  유럽 문화예술 진로캠프
                </span>
                <span className="font-tabular-num text-tabular-num font-bold text-primary">
                  390명 <span className="text-outline font-normal">(27.5%)</span>
                </span>
              </div>
              <div className="w-full bg-surface-container h-2.5 overflow-hidden">
                <div className="bg-secondary h-full" style={{ width: '27.5%' }}></div>
              </div>
            </div>

            {/* Item 3 */}
            <div className="space-y-space-2xs">
              <div className="flex items-center justify-between text-body-sm">
                <span className="font-body-md text-primary font-semibold truncate">
                  국내 미래신산업 탐험대
                </span>
                <span className="font-tabular-num text-tabular-num font-bold text-primary">
                  310명 <span className="text-outline font-normal">(21.8%)</span>
                </span>
              </div>
              <div className="w-full bg-surface-container h-2.5 overflow-hidden">
                <div className="bg-surface-tint h-full" style={{ width: '21.8%' }}></div>
              </div>
            </div>

            {/* Item 4 */}
            <div className="space-y-space-2xs">
              <div className="flex items-center justify-between text-body-sm">
                <span className="font-body-md text-primary font-semibold truncate">
                  지속가능발전 아시아포럼
                </span>
                <span className="font-tabular-num text-tabular-num font-bold text-primary">
                  240명 <span className="text-outline font-normal">(16.9%)</span>
                </span>
              </div>
              <div className="w-full bg-surface-container h-2.5 overflow-hidden">
                <div className="bg-outline h-full" style={{ width: '16.9%' }}></div>
              </div>
            </div>

            {/* Demographics breakdown */}
            <div className="pt-space-xs bg-surface-container-low p-space-sm flex items-center justify-between font-label-code text-label-code border border-surface-container">
              <div className="flex items-center gap-space-xs">
                <span className="w-2.5 h-2.5 bg-primary"></span>
                <span className="text-on-surface">고등학교: 880명 (62.0%)</span>
              </div>
              <div className="flex items-center gap-space-xs">
                <span className="w-2.5 h-2.5 bg-secondary-container"></span>
                <span className="text-on-surface">중학교: 540명 (38.0%)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Chart Panel 3: Career Competency Pre/Post Assessment K-CDI (6 cols) */}
        <div className="lg:col-span-6 bg-surface-container-lowest shadow-xs flex flex-col justify-between border border-surface-container">
          <div className="p-space-md bg-surface-container-low flex items-center justify-between border-b border-surface-container">
            <div className="flex items-center gap-space-sm">
              <span className="material-symbols-outlined text-primary text-lg">insights</span>
              <span className="font-headline-sm text-headline-sm text-primary font-bold">
                진로탐색 역량 사전·사후 변화 (K-CDI 지수)
              </span>
            </div>
            <span className="font-label-code text-label-code text-on-tertiary-container font-bold">
              +1.26점 상승
            </span>
          </div>

          <div className="p-space-md space-y-space-md flex-1">
            <div className="flex items-center justify-between bg-surface-container-low p-space-sm border border-surface-container">
              <div>
                <span className="font-label-code text-label-code text-on-surface-variant block">
                  표준 측정 대상
                </span>
                <span className="font-headline-sm text-headline-sm text-primary font-bold">
                  N=1,120명 (참가학생 대상)
                </span>
              </div>
              <div className="text-right">
                <span className="font-label-code text-label-code text-on-surface-variant block">
                  종합 역량 지수 (5점 만점)
                </span>
                <div className="flex items-center gap-space-xs font-tabular-num text-headline-md font-bold">
                  <span className="text-outline">3.12</span>
                  <span className="material-symbols-outlined text-sm text-primary">arrow_forward</span>
                  <span className="text-primary font-bold">4.38</span>
                </div>
              </div>
            </div>

            {/* Capability Dimensions Delta */}
            <div className="space-y-space-sm">
              {kcdiMetrics.map((dim) => (
                <div key={dim.code}>
                  <div className="flex justify-between font-body-sm mb-1">
                    <span className="text-on-surface font-medium">{dim.name}</span>
                    <span className="font-tabular-num text-tabular-num text-on-surface-variant font-bold">
                      {dim.preScore} → {dim.postScore} (+{dim.delta})
                    </span>
                  </div>
                  <div className="w-full bg-surface-container h-2 relative flex items-center">
                    <div className="absolute left-0 bg-outline h-full" style={{ width: `${dim.percentPre}%` }}></div>
                    <div className="absolute left-0 bg-primary h-full opacity-80" style={{ width: `${dim.percentPost}%` }}></div>
                  </div>
                </div>
              ))}
            </div>

            <div className="font-label-code text-label-code text-outline flex items-center justify-between pt-space-xs border-t border-surface-container-low">
              <span>* 세종진로교육원 한국진로발달검사(K-CDI) 개정 표준화 척도 적용</span>
              <span className="text-primary font-bold">신뢰도 α = .894</span>
            </div>
          </div>
        </div>

        {/* Chart Panel 4: Stage Workflow Pipeline (6 cols) */}
        <div className="lg:col-span-6 bg-surface-container-lowest shadow-xs flex flex-col justify-between border border-surface-container">
          <div className="p-space-md bg-surface-container-low flex items-center justify-between border-b border-surface-container">
            <div className="flex items-center gap-space-sm">
              <span className="material-symbols-outlined text-primary text-lg">schema</span>
              <span className="font-headline-sm text-headline-sm text-primary font-bold">
                사업별 6단계 진행 상태 요약
              </span>
            </div>
            <span className="font-label-code text-label-code bg-surface-container px-space-xs py-0.5 text-primary font-bold">
              전체 {totalProjects}개 사업 기준
            </span>
          </div>

          <div className="p-space-md flex-1 flex flex-col justify-around space-y-space-md">
            {/* Pipeline Diagram Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-6 gap-space-xs">
              {PIPELINE_STAGES.map((stg) => (
                <div
                  key={stg.stage}
                  className={`${stg.highlight ? 'bg-surface-container' : 'bg-surface-container-low'} p-space-xs flex flex-col items-center text-center border border-surface-container-high/40`}
                >
                  <span className={`font-label-code text-label-code ${stg.highlight ? 'text-secondary font-bold' : 'text-outline'}`}>
                    {stg.stage}
                  </span>
                  <span className={`font-headline-sm text-body-sm text-primary my-1 ${stg.highlight ? 'font-bold' : ''}`}>
                    {stg.title}
                  </span>
                  <span className={`font-label-code text-label-code px-space-xs py-0.5 ${
                    stg.isError ? 'bg-error text-on-error font-bold' : 'bg-primary text-on-primary'
                  }`}>
                    {stg.status}
                  </span>
                </div>
              ))}
            </div>

            <div className="bg-surface-container p-space-sm flex items-center justify-between border border-surface-container-high">
              <div className="flex items-center gap-space-xs">
                <span className="material-symbols-outlined text-secondary text-base">rule</span>
                <span className="font-body-sm text-body-sm text-primary font-semibold">
                  현재 집중 관리 단계: 제4단계 안전검토 및 긴급연락망 구축
                </span>
              </div>
              <span className="font-label-code text-label-code text-on-surface-variant font-bold">
                표준 공문 준수율: 94.2%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Actionable Administration Grid (2 Columns) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-md" id="action-section">
        {/* Left Column: Priority Action Items (5 cols) */}
        <div className="lg:col-span-5 bg-surface-container-lowest shadow-xs flex flex-col border border-surface-container">
          <div className="p-space-md bg-surface-container-low flex items-center justify-between border-b border-surface-container">
            <div className="flex items-center gap-space-sm">
              <span className="material-symbols-outlined text-error text-lg">priority_high</span>
              <h2 className="font-headline-sm text-headline-sm text-primary font-bold">
                행정 우선 조치 알림 (Action Items)
              </h2>
            </div>
            <span className="font-label-code text-label-code px-space-xs py-0.5 bg-error text-on-error font-bold">
              {actionItems.length}건 처리요망
            </span>
          </div>

          <div className="p-space-md space-y-space-sm flex-1 flex flex-col justify-between">
            {actionItems.map((act) => {
              const bgClass = act.type === 'danger' 
                ? 'bg-error-container/20 border-l-4 border-error' 
                : act.type === 'warning' 
                  ? 'bg-surface-container-high/60 border-l-4 border-surface-tint' 
                  : 'bg-surface-container-low border-l-4 border-primary';

              return (
                <div key={act.id} className={`${bgClass} p-space-sm space-y-space-xs`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-space-xs">
                      <span className={`font-label-code text-label-code px-space-xs py-0.5 ${
                        act.type === 'danger' 
                          ? 'bg-error text-on-error font-bold' 
                          : act.type === 'warning' 
                            ? 'bg-surface-tint text-on-primary font-bold' 
                            : 'bg-primary text-on-primary'
                      }`}>
                        {act.badge}
                      </span>
                      <span className={`font-label-code text-label-code font-bold ${
                        act.type === 'danger' ? 'text-error' : act.type === 'warning' ? 'text-primary-fixed-dim' : 'text-secondary'
                      }`}>
                        {act.tag}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        if (act.targetTab) onNavigateTab(act.targetTab);
                      }}
                      className="font-label-code text-label-code text-primary hover:underline flex items-center gap-0.5 font-bold cursor-pointer"
                    >
                      {act.actionText} <span className="material-symbols-outlined text-xs">chevron_right</span>
                    </button>
                  </div>

                  <p className="font-headline-sm text-body-md text-primary font-bold">
                    {act.title}
                  </p>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    {act.description}
                  </p>

                  <div className="font-label-code text-label-code text-outline pt-1 flex justify-between border-t border-surface-container-low">
                    <span>{act.assignee}</span>
                    <span>{act.deadlineText}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Recent Projects Table (7 cols) */}
        <div className="lg:col-span-7 bg-surface-container-lowest shadow-xs flex flex-col border border-surface-container">
          <div className="p-space-md bg-surface-container-low flex items-center justify-between border-b border-surface-container">
            <div className="flex items-center gap-space-sm">
              <span className="material-symbols-outlined text-primary text-lg">view_list</span>
              <h2 className="font-headline-sm text-headline-sm text-primary font-bold">
                최근 수정된 사업 목록 (Recent Projects)
              </h2>
            </div>
            <div className="flex items-center gap-space-xs">
              <button
                type="button"
                onClick={() => setTableFilter('recent')}
                className={`px-space-xs py-0.5 font-label-code text-label-code transition-colors cursor-pointer ${
                  tableFilter === 'recent' ? 'bg-primary text-on-primary font-bold' : 'bg-surface-container text-primary hover:bg-surface-container-high'
                }`}
              >
                최근 4건
              </button>
              <button
                type="button"
                onClick={() => {
                  setTableFilter('all');
                  onNavigateTab('project-management');
                }}
                className="px-space-xs py-0.5 bg-primary text-on-primary font-label-code text-label-code hover:bg-primary-container transition-colors cursor-pointer font-bold"
              >
                전체보기
              </button>
            </div>
          </div>

          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left font-body-sm">
              <thead className="bg-primary text-on-primary font-label-code text-label-code uppercase tracking-wider">
                <tr>
                  <th className="py-2.5 px-space-md" scope="col">사업명</th>
                  <th className="py-2.5 px-space-md" scope="col">담당부서 및 학교</th>
                  <th className="py-2.5 px-space-sm text-center" scope="col">추진상태</th>
                  <th className="py-2.5 px-space-md text-right font-tabular-num" scope="col">최종수정일</th>
                  <th className="py-2.5 px-space-sm text-center" scope="col">관리</th>
                </tr>
              </thead>
              <tbody className="divide-y-0">
                {displayedProjects.map((proj, idx) => (
                  <tr 
                    key={proj.id}
                    onClick={() => {
                      onSelectProject(proj);
                      onNavigateTab('project-management');
                    }}
                    className={`cursor-pointer transition-colors ${
                      idx % 2 === 0 ? 'bg-surface-container-lowest' : 'bg-surface-container-low/30'
                    } hover:bg-surface-container-low`}
                  >
                    <td className="py-3 px-space-md">
                      <div className="font-headline-sm text-body-md text-primary font-semibold">
                        {proj.title}
                      </div>
                      <span className="font-label-code text-label-code text-on-surface-variant font-mono">
                        {proj.code}
                      </span>
                    </td>
                    <td className="py-3 px-space-md text-on-surface">
                      <div>{proj.department}</div>
                      <span className="font-label-code text-label-code text-outline">
                        담당: {proj.manager}
                      </span>
                    </td>
                    <td className="py-3 px-space-sm text-center">
                      <span className={`font-label-code text-label-code px-space-xs py-0.5 font-bold ${
                        proj.status === '운영중' || proj.status === '운영승인완료'
                          ? 'bg-surface-container text-secondary'
                          : proj.status === '안전심의'
                            ? 'bg-error text-on-error'
                            : proj.status === '예산검토'
                              ? 'bg-surface-container-high text-on-surface'
                              : 'bg-surface-container text-primary'
                      }`}>
                        {proj.status}
                      </span>
                    </td>
                    <td className="py-3 px-space-md text-right font-tabular-num text-tabular-num text-on-surface-variant">
                      {proj.updatedAt.split(' ')[0]}
                    </td>
                    <td className="py-3 px-space-sm text-center">
                      <button 
                        type="button" 
                        title="상세조회" 
                        className="p-1 hover:bg-surface-container text-primary cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-base">edit_note</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-space-sm bg-surface-container-low flex items-center justify-between font-label-code text-label-code text-on-surface-variant border-t border-surface-container">
            <span>총 {projects.length}건 등록 중 최근 {displayedProjects.length}건 표출</span>
            <div className="flex items-center gap-space-xs">
              <span>데이터 실시간 동기화 상태:</span>
              <span className="text-on-tertiary-container font-bold">정상 (교육행정정보시스템 연계)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Operational Footer Metadata Bar */}
      <div className="bg-surface-container-low p-space-sm flex flex-col sm:flex-row items-center justify-between text-on-surface-variant font-label-code text-label-code gap-space-xs border border-surface-container">
        <div className="flex items-center gap-space-sm">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 bg-on-tertiary-container rounded-full animate-pulse"></span>
            통합 세종교육행정망 데이터베이스 LIVE
          </span>
          <span>|</span>
          <span>인증 주체: 세종특별자치시교육청 진로교육과</span>
        </div>
        <div className="flex items-center gap-space-md">
          <span>보안등급: 공공업무 대외비 제한등급 3</span>
          <span>기준시각: <span className="font-tabular-num font-bold">2027-05-15 09:30:12 KST</span></span>
        </div>
      </div>
    </div>
  );
};
