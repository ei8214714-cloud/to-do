import React, { useState } from 'react';
import { BudgetItem, ProjectItem } from '../types';

interface BudgetManagementViewProps {
  budgetItems: BudgetItem[];
  currentProject: ProjectItem;
  onUpdateBudgetItems: (items: BudgetItem[]) => void;
  onOpenAddBudgetModal: () => void;
  onOpenAuditRemediationModal: () => void;
  onShowToast: (message: string) => void;
}

export const BudgetManagementView: React.FC<BudgetManagementViewProps> = ({
  budgetItems,
  currentProject,
  onUpdateBudgetItems,
  onOpenAddBudgetModal,
  onOpenAuditRemediationModal,
  onShowToast,
}) => {
  const [showComparisonModal, setShowComparisonModal] = useState(false);
  const [showAuditLogs, setShowAuditLogs] = useState(false);

  // Dynamic calculations
  const totalPlanned = budgetItems.reduce((acc, item) => acc + item.plannedTotal, 0);
  const totalExecuted = budgetItems.reduce((acc, item) => acc + item.executedAmount, 0);
  const totalBalance = totalPlanned - totalExecuted;
  const executionRatio = totalPlanned > 0 ? ((totalExecuted / totalPlanned) * 100).toFixed(2) : '0';
  const perStudentCost = Math.round(50000000 / (currentProject.participants || 100));

  const handleExportXLSX = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + ["예산항목,산출근거,단가,수량,단위,계획예산,집행액,잔액,상태,비고"]
      .concat(budgetItems.map(b => `"${b.name}","${b.basis}",${b.unitPrice},${b.quantity},"${b.unit}",${b.plannedTotal},${b.executedAmount},${b.balance},"${b.status}","${b.comment || ''}"`))
      .join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `2027_세종글로벌진로탐험대_예산서_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    onShowToast('세부 예산 산출내역서(XLSX/CSV) 파일이 정상 다운로드되었습니다.');
  };

  const handleRecalculate = () => {
    const recalculated = budgetItems.map(item => {
      const planned = item.unitPrice * item.quantity;
      return {
        ...item,
        plannedTotal: planned,
        balance: planned - item.executedAmount,
      };
    });
    onUpdateBudgetItems(recalculated);
    onShowToast('전산 수식 재계산 및 검증이 완료되었습니다.');
  };

  return (
    <div className="flex flex-col w-full space-y-space-md">
      {/* Command Header & Scope Indicator */}
      <div className="bg-surface-container-lowest p-space-lg flex flex-col xl:flex-row xl:items-center justify-between gap-space-md shadow-xs border border-surface-container">
        <div className="space-y-space-2xs min-w-0">
          <div className="flex flex-wrap items-center gap-space-xs">
            <h1 className="font-headline-lg text-headline-lg text-primary tracking-tight font-bold">
              예산관리
            </h1>
            <span className="font-label-code text-label-code bg-surface-container-high text-primary px-space-xs py-0.5 font-bold">
              FY2027 AUDIT ACTIVE
            </span>
            <span className="font-label-code text-label-code bg-tertiary-container text-tertiary-fixed px-space-xs py-0.5 font-bold">
              회계검토모드
            </span>
          </div>
          <p className="font-body-sm text-body-sm text-on-surface-variant truncate">
            사업비 편성, 산출 근거, 세부 집행 내역 및 예산 투명성을 검토·관리합니다.
          </p>
          <div className="inline-flex items-center gap-space-xs bg-surface-container-low px-space-sm py-1 mt-1 border border-surface-container">
            <span className="material-symbols-outlined text-secondary text-sm">verified</span>
            <span className="font-body-sm text-body-sm text-on-surface font-semibold">
              현재 조회 사업: {currentProject.title}
            </span>
            <span className="font-label-code text-label-code text-outline">|</span>
            <span className="font-tabular-num text-tabular-num text-secondary font-bold">
              확정교부액 ₩{(currentProject.totalBudget).toLocaleString()}
            </span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center flex-wrap gap-space-xs shrink-0">
          <button
            type="button"
            onClick={() => setShowComparisonModal(true)}
            className="h-9 px-space-md bg-surface text-primary border border-surface-container hover:bg-surface-container-high transition-colors font-label-code text-label-code uppercase tracking-wider flex items-center gap-space-xs font-bold cursor-pointer"
          >
            <span className="material-symbols-outlined text-sm">compare_arrows</span>
            예산 비교
          </button>
          <button
            type="button"
            onClick={handleExportXLSX}
            className="h-9 px-space-md bg-surface text-primary border border-surface-container hover:bg-surface-container-high transition-colors font-label-code text-label-code uppercase tracking-wider flex items-center gap-space-xs font-bold cursor-pointer"
          >
            <span className="material-symbols-outlined text-sm">file_download</span>
            엑셀 내보내기 (XLSX)
          </button>
          <button
            type="button"
            onClick={onOpenAddBudgetModal}
            className="h-9 px-space-md bg-primary-container text-surface-bright hover:bg-primary transition-colors font-label-code text-label-code uppercase tracking-wider flex items-center gap-space-xs font-bold cursor-pointer"
          >
            <span className="material-symbols-outlined text-sm">add_box</span>
            예산 항목 추가
          </button>
        </div>
      </div>

      {/* Top KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-gutter">
        {/* Card 1: 확정 예산 */}
        <div className="bg-surface-container-lowest p-space-md space-y-space-xs shadow-xs flex flex-col justify-between border border-surface-container">
          <div className="flex items-center justify-between">
            <span className="font-label-code text-label-code text-on-surface-variant uppercase">
              01. 확정 예산 (분모)
            </span>
            <span className="material-symbols-outlined text-outline text-base">account_balance_wallet</span>
          </div>
          <div>
            <div className="font-tabular-num text-headline-lg font-bold text-primary">
              ₩{(currentProject.totalBudget).toLocaleString()}
            </div>
            <div className="font-label-code text-label-code text-outline mt-1 truncate">
              교육비특별회계 확정액
            </div>
          </div>
          <div className="h-1 w-full bg-surface-container">
            <div className="h-full bg-primary" style={{ width: '100%' }}></div>
          </div>
        </div>

        {/* Card 2: 현재 집행액 */}
        <div className="bg-surface-container-lowest p-space-md space-y-space-xs shadow-xs flex flex-col justify-between border border-surface-container">
          <div className="flex items-center justify-between">
            <span className="font-label-code text-label-code text-on-surface-variant uppercase">
              02. 현재 집행액
            </span>
            <span className="material-symbols-outlined text-secondary text-base">receipt_long</span>
          </div>
          <div>
            <div className="font-tabular-num text-headline-lg font-bold text-secondary">
              ₩{(totalExecuted).toLocaleString()}
            </div>
            <div className="font-label-code text-label-code text-outline mt-1 truncate">
              원인행위 및 지출완료
            </div>
          </div>
          <div className="h-1 w-full bg-surface-container">
            <div className="h-full bg-secondary" style={{ width: '40%' }}></div>
          </div>
        </div>

        {/* Card 3: 잔여 예산 */}
        <div className="bg-surface-container-lowest p-space-md space-y-space-xs shadow-xs flex flex-col justify-between border border-surface-container">
          <div className="flex items-center justify-between">
            <span className="font-label-code text-label-code text-on-surface-variant uppercase">
              03. 잔여 예산
            </span>
            <span className="material-symbols-outlined text-tertiary-container text-base">savings</span>
          </div>
          <div>
            <div className="font-tabular-num text-headline-lg font-bold text-primary-container">
              ₩{(currentProject.totalBudget - totalExecuted).toLocaleString()}
            </div>
            <div className="font-label-code text-label-code text-outline mt-1 truncate">
              집행가능 잔여액
            </div>
          </div>
          <div className="h-1 w-full bg-surface-container">
            <div className="h-full bg-on-tertiary-container" style={{ width: '60%' }}></div>
          </div>
        </div>

        {/* Card 4: 예산 집행률 */}
        <div className="bg-surface-container-lowest p-space-md space-y-space-xs shadow-xs flex flex-col justify-between border border-surface-container">
          <div className="flex items-center justify-between">
            <span className="font-label-code text-label-code text-on-surface-variant uppercase">
              04. 예산 집행률
            </span>
            <span className="material-symbols-outlined text-secondary text-base">donut_large</span>
          </div>
          <div>
            <div className="flex items-baseline gap-space-xs">
              <span className="font-tabular-num text-headline-lg font-bold text-primary">
                40.0%
              </span>
              <span className="font-label-code text-label-code text-secondary font-bold">
                정상추진
              </span>
            </div>
            <div className="font-label-code text-label-code text-outline mt-1 truncate">
              공공지표 달성기준 적정
            </div>
          </div>
          <div className="h-1 w-full bg-surface-container">
            <div className="h-full bg-secondary-container" style={{ width: '40%' }}></div>
          </div>
        </div>

        {/* Card 5: 학생 1인당 소요비용 */}
        <div className="bg-surface-container-lowest p-space-md space-y-space-xs shadow-xs flex flex-col justify-between border border-surface-container">
          <div className="flex items-center justify-between">
            <span className="font-label-code text-label-code text-on-surface-variant uppercase">
              05. 학생 1인당 비용
            </span>
            <span className="material-symbols-outlined text-outline text-base">person</span>
          </div>
          <div>
            <div className="font-tabular-num text-headline-lg font-bold text-primary">
              ₩{(perStudentCost).toLocaleString()}
            </div>
            <div className="font-label-code text-label-code text-outline mt-1 truncate">
              공공예산 총 {currentProject.participants}명 분할
            </div>
          </div>
          <div className="h-1 w-full bg-surface-container">
            <div className="h-full bg-primary-fixed-dim" style={{ width: '100%' }}></div>
          </div>
        </div>
      </div>

      {/* Legend & Auditing Guide */}
      <div className="bg-surface-container-low px-space-md py-space-sm flex flex-wrap items-center justify-between gap-space-sm text-body-sm font-body-sm text-on-surface-variant border border-surface-container">
        <div className="flex items-center gap-space-sm">
          <span className="font-label-code text-label-code bg-primary text-on-primary px-space-xs py-0.5 uppercase font-bold">
            회계원칙
          </span>
          <span>계산값(자동계산)과 입력값을 명확히 구분하여 전산 감사 추적성을 확보합니다.</span>
        </div>
        <div className="flex items-center gap-space-md font-label-code text-label-code">
          <span className="inline-flex items-center gap-1.5">
            <span className="w-3 h-3 bg-surface-container-lowest border border-surface-container"></span>
            입력항목 (단가·수량)
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="w-3 h-3 bg-surface-container-high border border-surface-container"></span>
            <span className="material-symbols-outlined text-xs">functions</span> 전산 자동 산출값
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="w-2 h-2 bg-error rounded-full"></span> 즉시 보완필요
          </span>
        </div>
      </div>

      {/* Main Table Section: 세부 예산 산출내역 및 집행 현황 */}
      <div className="bg-surface-container-lowest shadow-xs flex flex-col overflow-hidden border border-surface-container">
        {/* Panel Header Bar */}
        <div className="bg-surface-container-low px-space-md py-space-sm flex items-center justify-between border-b border-surface-container">
          <div className="flex items-center gap-space-xs">
            <span className="material-symbols-outlined text-primary text-lg">table_chart</span>
            <span className="font-headline-sm text-headline-sm text-primary font-bold">
              세부 예산 산출내역 및 집행 현황
            </span>
            <span className="font-label-code text-label-code bg-surface-container px-space-xs py-0.5 text-on-surface-variant font-bold">
              전산 대사 완료 ({budgetItems.length}건)
            </span>
          </div>
          <div className="flex items-center gap-space-sm font-label-code text-label-code text-on-surface-variant">
            <span>통화단위: KRW (원)</span>
            <button
              type="button"
              onClick={handleRecalculate}
              className="hover:text-primary transition-colors flex items-center gap-1 cursor-pointer font-bold"
            >
              <span className="material-symbols-outlined text-sm">refresh</span>
              새로고침
            </button>
          </div>
        </div>

        {/* Data Table Container */}
        <div className="overflow-x-auto">
          <table className="w-full text-left font-body-sm text-body-sm">
            <thead>
              <tr className="bg-primary text-on-primary font-label-code text-label-code tracking-wider uppercase">
                <th className="py-space-sm px-space-md font-semibold whitespace-nowrap">예산 항목</th>
                <th className="py-space-sm px-space-md font-semibold">산출 근거 (상세 수식)</th>
                <th className="py-space-sm px-space-md font-semibold text-right whitespace-nowrap bg-primary-container">
                  단가 (원) [입력]
                </th>
                <th className="py-space-sm px-space-md font-semibold text-right whitespace-nowrap bg-primary-container">
                  수량 [입력]
                </th>
                <th className="py-space-sm px-space-md font-semibold text-right whitespace-nowrap bg-surface-container-high text-primary">
                  <span className="inline-flex items-center gap-1">
                    <span className="material-symbols-outlined text-xs">functions</span>
                    계획 예산 (원) [계산값]
                  </span>
                </th>
                <th className="py-space-sm px-space-md font-semibold text-right whitespace-nowrap">집행액 (원)</th>
                <th className="py-space-sm px-space-md font-semibold text-right whitespace-nowrap">잔액 (원)</th>
                <th className="py-space-sm px-space-md font-semibold text-center whitespace-nowrap">상태 / 검토의견</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container text-on-surface font-body-md text-body-md">
              {budgetItems.map((item, idx) => {
                const isWarning = item.statusType === 'warning';
                return (
                  <tr
                    key={item.id}
                    className={`transition-colors ${
                      isWarning 
                        ? 'bg-error-container/20 hover:bg-error-container/30' 
                        : idx % 2 === 0 ? 'bg-surface-container-lowest' : 'bg-surface-container-low/30'
                    } hover:bg-surface-container-low`}
                  >
                    <td className="py-space-sm px-space-md font-semibold whitespace-nowrap">
                      <div className="flex items-center gap-space-xs">
                        <span className={`material-symbols-outlined text-sm ${
                          isWarning ? 'text-error' : item.category === 'transport' ? 'text-secondary' : 'text-outline'
                        }`}>
                          {item.category === 'transport' ? 'flight_takeoff' :
                           item.category === 'lodging' ? 'hotel' :
                           item.category === 'program' ? 'psychology' :
                           item.category === 'insurance' ? 'security' : 'medical_services'}
                        </span>
                        <span>{item.name}</span>
                      </div>
                    </td>

                    <td className="py-space-sm px-space-md font-body-sm text-body-sm">
                      <div className="text-on-surface-variant">{item.basis}</div>
                      {isWarning && (
                        <div className="text-error font-label-code text-label-code flex items-center gap-1 mt-0.5">
                          <span className="material-symbols-outlined text-xs">warning</span>
                          <span>강사료 산출근거 미등록 (원천징수/환율기준 누락)</span>
                        </div>
                      )}
                    </td>

                    <td className="py-space-sm px-space-md text-right font-tabular-num text-tabular-num text-on-surface">
                      ₩{(item.unitPrice).toLocaleString()}
                    </td>

                    <td className="py-space-sm px-space-md text-right font-tabular-num text-tabular-num text-on-surface">
                      {item.quantity}{item.unit}
                    </td>

                    <td className="py-space-sm px-space-md text-right font-tabular-num text-tabular-num font-bold bg-surface-container-high text-primary">
                      ₩{(item.plannedTotal).toLocaleString()}
                    </td>

                    <td className="py-space-sm px-space-md text-right font-tabular-num text-tabular-num font-semibold text-secondary">
                      ₩{(item.executedAmount).toLocaleString()}
                    </td>

                    <td className="py-space-sm px-space-md text-right font-tabular-num text-tabular-num font-semibold text-on-surface">
                      ₩{(item.balance).toLocaleString()}
                    </td>

                    <td className="py-space-sm px-space-md text-center whitespace-nowrap">
                      <span className={`inline-block px-space-xs py-0.5 font-label-code text-label-code font-bold ${
                        item.statusType === 'warning'
                          ? 'bg-error text-on-error'
                          : item.statusType === 'normal'
                            ? 'bg-surface-container text-secondary'
                            : item.statusType === 'pending'
                              ? 'bg-surface-container-high text-on-surface-variant'
                              : 'bg-surface-container-low text-tertiary'
                      }`}>
                        {item.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>

            {/* Table Total Row */}
            <tfoot>
              <tr className="bg-primary-container text-surface-bright font-headline-sm text-body-lg">
                <td className="py-space-md px-space-md font-bold whitespace-nowrap">
                  계획 합계
                </td>
                <td className="py-space-md px-space-md font-body-sm text-body-sm text-on-primary-container">
                  총 {budgetItems.length}개 회계항목 (교육청 교부금 ₩{(currentProject.totalBudget).toLocaleString()} + 수익자부담/참가보조 포함 총액)
                </td>
                <td className="py-space-md px-space-md text-right font-tabular-num text-on-primary-container">-</td>
                <td className="py-space-md px-space-md text-right font-tabular-num text-on-primary-container">-</td>
                <td className="py-space-md px-space-md text-right font-tabular-num text-headline-sm font-bold text-surface-bright bg-primary">
                  ₩{(totalPlanned).toLocaleString()}
                </td>
                <td className="py-space-md px-space-md text-right font-tabular-num text-headline-sm font-bold text-secondary-fixed">
                  ₩{(totalExecuted).toLocaleString()}
                </td>
                <td className="py-space-md px-space-md text-right font-tabular-num text-headline-sm font-bold text-surface-bright">
                  ₩{(totalBalance).toLocaleString()}
                </td>
                <td className="py-space-md px-space-md text-center font-label-code text-label-code text-tertiary-fixed font-bold">
                  집행률 {executionRatio}%
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Table Action & Pagination Footer */}
        <div className="px-space-md py-space-sm bg-surface-container-low flex flex-wrap items-center justify-between gap-space-sm text-body-sm font-body-sm text-on-surface-variant border-t border-surface-container">
          <div className="flex items-center gap-space-sm">
            <span className="font-label-code text-label-code">총 {budgetItems.length}개 항목 표시 중</span>
            <span className="text-outline">|</span>
            <span>기준환율: 1 SGD = 1,020.50 KRW (실시간 고시환율 자동적용)</span>
          </div>
          <div className="flex items-center gap-space-xs font-label-code text-label-code">
            <button
              type="button"
              onClick={handleRecalculate}
              className="px-space-sm py-1 bg-surface-container-lowest text-primary hover:bg-surface-container transition-colors border border-surface-container cursor-pointer font-bold"
            >
              수식 재계산
            </button>
            <button
              type="button"
              onClick={() => setShowAuditLogs(true)}
              className="px-space-sm py-1 bg-surface-container-lowest text-primary hover:bg-surface-container transition-colors border border-surface-container cursor-pointer font-bold"
            >
              감사로그 확인
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Analysis Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-gutter">
        {/* Left Card: 비목별 계획 예산 비중 */}
        <div className="bg-surface-container-lowest p-space-md shadow-xs flex flex-col justify-between space-y-space-md border border-surface-container">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-space-xs">
              <span className="material-symbols-outlined text-primary text-base">bar_chart</span>
              <span className="font-headline-sm text-headline-sm text-primary font-bold">
                비목별 계획 예산 비중
              </span>
            </div>
            <span className="font-label-code text-label-code text-on-surface-variant">
              총액 ₩130.2M 기준
            </span>
          </div>

          <div className="space-y-space-sm">
            {/* Transportation: 65% */}
            <div className="space-y-1">
              <div className="flex justify-between font-label-code text-label-code">
                <span className="text-on-surface flex items-center gap-1 font-semibold">
                  <span className="w-2 h-2 bg-secondary"></span> 항공 및 교통비
                </span>
                <span className="font-tabular-num font-bold text-primary">65.3% (₩85,000,000)</span>
              </div>
              <div className="h-2 w-full bg-surface-container">
                <div className="h-full bg-secondary" style={{ width: '65.3%' }}></div>
              </div>
            </div>

            {/* Accommodation: 21% */}
            <div className="space-y-1">
              <div className="flex justify-between font-label-code text-label-code">
                <span className="text-on-surface flex items-center gap-1 font-semibold">
                  <span className="w-2 h-2 bg-primary"></span> 숙박비
                </span>
                <span className="font-tabular-num font-bold text-primary">20.7% (₩27,000,000)</span>
              </div>
              <div className="h-2 w-full bg-surface-container">
                <div className="h-full bg-primary" style={{ width: '20.7%' }}></div>
              </div>
            </div>

            {/* Program Operations: 12% */}
            <div className="space-y-1">
              <div className="flex justify-between font-label-code text-label-code">
                <span className="text-on-surface flex items-center gap-1 font-semibold">
                  <span className="w-2 h-2 bg-error"></span> 프로그램 운영비
                </span>
                <span className="font-tabular-num font-bold text-error">11.5% (₩15,000,000)</span>
              </div>
              <div className="h-2 w-full bg-surface-container">
                <div className="h-full bg-error" style={{ width: '11.5%' }}></div>
              </div>
            </div>

            {/* Insurance & Emergency: 2% */}
            <div className="space-y-1">
              <div className="flex justify-between font-label-code text-label-code">
                <span className="text-on-surface flex items-center gap-1 font-semibold">
                  <span className="w-2 h-2 bg-on-tertiary-container"></span> 안전보험 및 방역
                </span>
                <span className="font-tabular-num font-bold text-primary">2.5% (₩3,250,000)</span>
              </div>
              <div className="h-2 w-full bg-surface-container">
                <div className="h-full bg-on-tertiary-container" style={{ width: '2.5%' }}></div>
              </div>
            </div>
          </div>

          <div className="bg-surface-container-low p-space-sm flex items-center justify-between font-body-sm text-body-sm border border-surface-container">
            <span className="text-on-surface-variant">원인행위 기준 집행 진척률</span>
            <span className="font-tabular-num text-secondary font-bold">15.4% (선급금 지급 완료)</span>
          </div>
        </div>

        {/* Middle Card: 산출근거 정합성 감사 */}
        <div className="bg-surface-container-lowest p-space-md shadow-xs flex flex-col justify-between space-y-space-md border border-surface-container">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-space-xs">
              <span className="material-symbols-outlined text-error text-base">rule_settings</span>
              <span className="font-headline-sm text-headline-sm text-primary font-bold">
                산출근거 정합성 감사
              </span>
            </div>
            <span className="font-label-code text-label-code bg-error-container text-on-error-container px-space-xs py-0.5 font-bold">
              1건 요조치
            </span>
          </div>

          {/* Amber Alert Box */}
          <div className="bg-error-container/30 p-space-md space-y-space-xs border border-error/40">
            <div className="flex items-center gap-space-xs">
              <span className="material-symbols-outlined text-error text-lg">error</span>
              <span className="font-headline-sm text-body-md text-error font-bold">
                프로그램 운영비 항목 지적
              </span>
            </div>
            <p className="font-body-sm text-body-sm text-on-surface leading-relaxed">
              싱가포르 국립대 AI 워크숍 강사료 지급 기준(시간당 단가 산출내역서 및 해외 송금 증빙 서식)이 전산에 미입력되었습니다.
            </p>
            <div className="pt-space-xs flex items-center justify-between font-label-code text-label-code text-on-surface-variant border-t border-error/20">
              <span>영향: 지출원인행위 전결 승인 보류</span>
              <span className="text-error font-bold">D-3 이내 보완요망</span>
            </div>
          </div>

          {/* Action Button */}
          <button
            type="button"
            onClick={onOpenAuditRemediationModal}
            className="w-full h-9 bg-surface-container-high hover:bg-surface-container text-primary font-label-code text-label-code uppercase tracking-wider flex items-center justify-center gap-space-xs transition-colors font-bold cursor-pointer border border-surface-container-highest"
          >
            <span className="material-symbols-outlined text-sm">edit_document</span>
            산출근거 보완서 등록 바로가기
          </button>
        </div>

        {/* Right Card: 예산 검토관 종합의견 */}
        <div className="bg-surface-container-lowest p-space-md shadow-xs flex flex-col justify-between space-y-space-md border border-surface-container">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-space-xs">
              <span className="material-symbols-outlined text-primary text-base">rate_review</span>
              <span className="font-headline-sm text-headline-sm text-primary font-bold">
                예산 검토관 종합의견
              </span>
            </div>
            <span className="font-label-code text-label-code bg-surface-container-high text-primary px-space-xs py-0.5 font-bold">
              조건부 승인
            </span>
          </div>

          <div className="space-y-space-sm">
            <div className="flex items-center gap-space-sm bg-surface-container-low p-space-sm border border-surface-container">
              <div className="w-8 h-8 bg-primary text-on-primary flex items-center justify-center font-label-code text-label-code font-bold">
                재정
              </div>
              <div>
                <div className="font-headline-sm text-body-md text-on-surface font-bold">
                  김재원 주무관
                </div>
                <div className="font-label-code text-label-code text-on-surface-variant">
                  세종특별자치시교육청 재정복지과
                </div>
              </div>
            </div>

            <blockquote className="bg-surface-bright p-space-sm font-body-sm text-body-sm text-on-surface leading-relaxed italic border-l-2 border-primary">
              "학생 1인당 자부담 경감 방안 검토가 완료되었습니다. 취약계층 학생 전액 지원분(10명, ₩5,000,000)이 지자체 대응예산으로 정상 편성되었음을 확인하였습니다. 단, 싱가포르 안전보험계약은 출국 14일 전까지 우선 집행 완료 권고합니다."
            </blockquote>
          </div>

          <div className="flex items-center justify-between font-label-code text-label-code text-outline pt-space-2xs border-t border-surface-container-low">
            <span>최종검토: 2027-04-12 14:30:22</span>
            <span className="text-secondary font-bold">전자서명 인증완료</span>
          </div>
        </div>
      </div>

      {/* Audit Logs Popover / Modal */}
      {showAuditLogs && (
        <div className="fixed inset-0 z-50 bg-primary/60 flex items-center justify-center p-space-md">
          <div className="bg-surface-container-lowest w-full max-w-2xl border-2 border-primary shadow-xl p-space-md space-y-space-md">
            <div className="flex items-center justify-between pb-space-xs border-b border-surface-container">
              <span className="font-headline-sm text-primary font-bold">회계 감사 추적 로그 (Audit Logs)</span>
              <button 
                type="button" 
                onClick={() => setShowAuditLogs(false)} 
                className="material-symbols-outlined text-outline hover:text-primary cursor-pointer"
              >
                close
              </button>
            </div>
            <div className="text-xs space-y-2 font-mono max-h-64 overflow-y-auto">
              <div className="p-2 bg-surface-container-low border border-surface-container">
                [2027-04-12 14:30:22] 재정복지과 김재원: 예산 심의 조건부 승인 등록 (서명 해시: SHA256-4b9f2)
              </div>
              <div className="p-2 bg-surface-container-low border border-surface-container">
                [2027-04-05 10:15:00] 진로교육과 김지현: 항공권 선금 원인행위 결재 (₩20,000,000)
              </div>
              <div className="p-2 bg-surface-container-low border border-surface-container">
                [2027-03-25 16:00:14] 시스템 자동: 2027년 교육비특별회계 5,000만원 교부금 매핑 완료
              </div>
            </div>
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setShowAuditLogs(false)}
                className="px-space-md py-1 bg-primary text-on-primary font-label-code text-label-code font-bold cursor-pointer"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Comparison Modal */}
      {showComparisonModal && (
        <div className="fixed inset-0 z-50 bg-primary/60 flex items-center justify-center p-space-md">
          <div className="bg-surface-container-lowest w-full max-w-3xl border-2 border-primary shadow-xl p-space-md space-y-space-md">
            <div className="flex items-center justify-between pb-space-xs border-b border-surface-container">
              <span className="font-headline-sm text-primary font-bold">사업별 예산 편성 비교 (FY26 vs FY27)</span>
              <button 
                type="button" 
                onClick={() => setShowComparisonModal(false)} 
                className="material-symbols-outlined text-outline hover:text-primary cursor-pointer"
              >
                close
              </button>
            </div>
            <div className="overflow-x-auto text-xs">
              <table className="w-full text-left">
                <thead className="bg-primary text-on-primary font-label-code">
                  <tr>
                    <th className="p-2">항목</th>
                    <th className="p-2 text-right">2026년 실집행</th>
                    <th className="p-2 text-right">2027년 계획</th>
                    <th className="p-2 text-right">증감액</th>
                    <th className="p-2 text-center">비고</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-container">
                  <tr>
                    <td className="p-2 font-bold">항공 및 교통비</td>
                    <td className="p-2 text-right font-mono">₩78,000,000</td>
                    <td className="p-2 text-right font-mono">₩85,000,000</td>
                    <td className="p-2 text-right font-mono text-error font-bold">+₩7,000,000</td>
                    <td className="p-2 text-center text-outline">유류할증료 반영</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-bold">숙박비</td>
                    <td className="p-2 text-right font-mono">₩26,000,000</td>
                    <td className="p-2 text-right font-mono">₩27,000,000</td>
                    <td className="p-2 text-right font-mono text-error font-bold">+₩1,000,000</td>
                    <td className="p-2 text-center text-outline">안전인증 호텔 선정</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-bold">프로그램 운영비</td>
                    <td className="p-2 text-right font-mono">₩14,000,000</td>
                    <td className="p-2 text-right font-mono">₩15,000,000</td>
                    <td className="p-2 text-right font-mono text-error font-bold">+₩1,000,000</td>
                    <td className="p-2 text-center text-outline">NUS 랩 실습 추가</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setShowComparisonModal(false)}
                className="px-space-md py-1 bg-primary text-on-primary font-label-code text-label-code font-bold cursor-pointer"
              >
                확인 완료
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
