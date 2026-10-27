import React, { useState } from 'react';
import { SafetyItem } from '../types';

interface SafetyManagementViewProps {
  safetyItems: SafetyItem[];
  onUpdateSafetyItems: (items: SafetyItem[]) => void;
  onShowToast: (message: string) => void;
}

export const SafetyManagementView: React.FC<SafetyManagementViewProps> = ({
  safetyItems,
  onUpdateSafetyItems,
  onShowToast,
}) => {
  const [filter, setFilter] = useState<'all' | 'unresolved' | 'resolved'>('all');
  const [activeItemModal, setActiveItemModal] = useState<SafetyItem | null>(null);
  const [showAddSafetyModal, setShowAddSafetyModal] = useState(false);
  const [showRoadmapRules, setShowRoadmapRules] = useState(false);
  const [newItemName, setNewItemName] = useState('');
  const [newItemCriteria, setNewItemCriteria] = useState('');
  const [newItemAssignee, setNewItemAssignee] = useState('김지현 장학관');

  // Stats calculation
  const totalCount = safetyItems.length;
  const resolvedCount = safetyItems.filter(s => s.status === '점검 완료' || s.status === '조치 완료').length;
  const unresolvedCount = safetyItems.filter(s => s.status === '미점검' || s.status === '조치 필요').length;
  const actionRequiredCount = safetyItems.filter(s => s.status === '조치 필요').length;
  const resolvedRatio = totalCount > 0 ? ((resolvedCount / totalCount) * 100).toFixed(1) : '0';

  // Filtered rows
  const filteredItems = safetyItems.filter(item => {
    if (filter === 'unresolved') return item.status === '미점검' || item.status === '조치 필요';
    if (filter === 'resolved') return item.status === '점검 완료' || item.status === '조치 완료';
    return true;
  });

  const handleStatusChange = (itemId: string, newStatus: SafetyItem['status'], newDetails?: string) => {
    const updated = safetyItems.map(item => {
      if (item.id === itemId) {
        return {
          ...item,
          status: newStatus,
          actionDetails: newDetails || item.actionDetails,
          verifiedDate: newStatus === '점검 완료' || newStatus === '조치 완료' ? new Date().toISOString().slice(0, 10).replace(/-/g, '.') : item.verifiedDate,
        };
      }
      return item;
    });
    onUpdateSafetyItems(updated);
    if (activeItemModal && activeItemModal.id === itemId) {
      setActiveItemModal({
        ...activeItemModal,
        status: newStatus,
        actionDetails: newDetails || activeItemModal.actionDetails,
      });
    }
    onShowToast(`안전점검 항목 상태가 [${newStatus}]으로 변경되었습니다.`);
  };

  const handleAddNewSafety = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim() || !newItemCriteria.trim()) {
      alert('점검 항목명과 점검 기준을 모두 입력하십시오.');
      return;
    }
    const newItem: SafetyItem = {
      id: `SAFE-${Date.now()}`,
      name: newItemName.trim(),
      criteria: newItemCriteria.trim(),
      assignee: newItemAssignee,
      scheduledDate: new Date().toISOString().slice(0, 10).replace(/-/g, '.'),
      status: '미점검',
      actionDetails: '신규 점검 항목 등록 완료. 담당자 확인 대기 중',
    };
    onUpdateSafetyItems([...safetyItems, newItem]);
    setShowAddSafetyModal(false);
    setNewItemName('');
    setNewItemCriteria('');
    onShowToast(`신규 법정 안전점검 항목 [${newItem.name}]이 등록되었습니다.`);
  };

  const handlePrintPDF = () => {
    window.print();
  };

  const handleEmergencyBroadcastTest = () => {
    alert('[세종교육청 안전총괄과 긴급 경보 테스트]\n정상적으로 비상연락망(주싱가포르 대사관, 교육청 종합상황실, 외교부 영사콜센터)에 통신 테스트 패킷이 전송되었습니다.\n상태: 24H STANDBY ALL CLEAR');
  };

  return (
    <div className="flex flex-col w-full space-y-space-md">
      {/* Command Header & Operational Control Zone */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-space-md bg-surface-container-lowest p-space-md border border-surface-container shadow-xs">
        <div className="flex flex-col space-y-space-2xs">
          <div className="flex items-center gap-space-xs">
            <span className="px-space-xs py-0.5 bg-primary text-on-primary font-label-code text-label-code tracking-wider uppercase">
              SAFE-SEC-05
            </span>
            <h1 className="font-headline-lg text-headline-lg text-primary tracking-tight font-bold">
              안전관리 (Safety Inspection Terminal)
            </h1>
            <span className="inline-flex items-center gap-space-2xs px-space-xs py-0.5 bg-error-container text-on-error-container font-label-code text-label-code font-bold">
              <span className="w-1.5 h-1.5 bg-error rounded-full animate-ping"></span>
              {unresolvedCount}건 승인 지연
            </span>
          </div>
          <p className="font-body-md text-body-md text-on-surface-variant">
            출발 전 필수 안전점검, 현지 이동·숙소 검증, 비상대응체계 및 안전 조치 내역을 종합 관리합니다.
          </p>
        </div>

        <div className="flex items-center flex-wrap gap-space-xs shrink-0">
          <button
            type="button"
            onClick={handlePrintPDF}
            className="inline-flex items-center gap-space-xs h-9 px-space-md bg-surface-container-low hover:bg-surface-container text-primary font-body-sm text-body-sm transition-colors border border-surface-container font-bold cursor-pointer"
          >
            <span className="material-symbols-outlined text-base">download</span>
            안전점검표 PDF 출력
          </button>
          <button
            type="button"
            onClick={() => onShowToast('안전심의위원회 제출용 점검결과 정규 보고서 초안이 생성되었습니다.')}
            className="inline-flex items-center gap-space-xs h-9 px-space-md bg-surface-container-low hover:bg-surface-container text-primary font-body-sm text-body-sm transition-colors border border-surface-container font-bold cursor-pointer"
          >
            <span className="material-symbols-outlined text-base">edit_document</span>
            점검결과 보고서 작성
          </button>
          <button
            type="button"
            onClick={() => setShowAddSafetyModal(true)}
            className="inline-flex items-center gap-space-xs h-9 px-space-md bg-primary-container hover:bg-primary text-on-primary font-body-sm text-body-sm transition-colors font-bold cursor-pointer"
          >
            <span className="material-symbols-outlined text-base">add_task</span>
            + 신규 안전점검 등록
          </button>
        </div>
      </div>

      {/* Mandatory Compliance Warning Banner */}
      <div className="bg-error-container/40 p-space-md flex items-start gap-space-md border-l-4 border-error">
        <div className="w-8 h-8 bg-error text-on-error flex items-center justify-center shrink-0">
          <span className="material-symbols-outlined text-xl">gpp_maybe</span>
        </div>
        <div className="flex flex-col space-y-space-2xs min-w-0">
          <div className="flex items-center gap-space-xs">
            <span className="font-headline-sm text-headline-sm text-on-error-container font-bold">
              법정 안전심의 및 파견 필수 요건 안내
            </span>
            <span className="font-label-code text-label-code px-space-xs py-0.5 bg-error text-on-error uppercase font-bold">
              심의대기
            </span>
          </div>
          <p className="font-body-md text-body-md text-on-surface leading-relaxed">
            <strong>※ 주의: 필수 안전 점검 항목 2건이 미완료 상태입니다.</strong> 본 시스템은 행정 안전점검 상태를 확인·기록하는 도구이며, 실제 국외 파견 승인은 세종시교육청 현장체험학습 안전심의위원회의 정식 심의를 거쳐야 최종 인가됩니다.
          </p>
        </div>
      </div>

      {/* 4-Column KPI Terminal Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-space-md">
        {/* KPI 1 */}
        <div className="bg-surface-container-lowest p-space-md flex flex-col justify-between space-y-space-sm border border-surface-container shadow-xs">
          <div className="flex items-center justify-between">
            <span className="font-label-code text-label-code text-on-surface-variant uppercase tracking-wider">
              법정 점검 풀
            </span>
            <span className="material-symbols-outlined text-outline text-lg">checklist</span>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="font-headline-lg text-display-md text-primary font-bold">
              {totalCount}<span className="text-headline-md font-normal text-on-surface-variant ml-1">개 항목</span>
            </span>
            <span className="font-label-code text-label-code bg-surface-container px-space-xs py-0.5 text-primary font-bold">
              지침 기준 100%
            </span>
          </div>
          <div className="w-full bg-surface-container h-1.5">
            <div className="bg-primary h-1.5" style={{ width: '100%' }}></div>
          </div>
          <span className="font-body-sm text-body-sm text-on-surface-variant">
            교육부·세종교육청 필수 안전지침 기준
          </span>
        </div>

        {/* KPI 2 */}
        <div className="bg-surface-container-lowest p-space-md flex flex-col justify-between space-y-space-sm border border-surface-container shadow-xs">
          <div className="flex items-center justify-between">
            <span className="font-label-code text-label-code text-on-surface-variant uppercase tracking-wider">
              점검 완료 항목
            </span>
            <span className="material-symbols-outlined text-on-tertiary-container text-lg">task_alt</span>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="font-headline-lg text-display-md text-on-tertiary-container font-bold">
              {resolvedCount}<span className="text-headline-md font-normal text-on-surface-variant ml-1">개 항목</span>
            </span>
            <span className="font-tabular-num text-tabular-num font-bold text-on-tertiary-container">
              {resolvedRatio}%
            </span>
          </div>
          <div className="w-full bg-surface-container h-1.5">
            <div className="bg-on-tertiary-container h-1.5" style={{ width: `${resolvedRatio}%` }}></div>
          </div>
          <span className="font-body-sm text-body-sm text-on-surface-variant">
            정상 승인 및 증빙 서류 대조 완료
          </span>
        </div>

        {/* KPI 3 */}
        <div className="bg-surface-container-lowest p-space-md flex flex-col justify-between space-y-space-sm border border-surface-container shadow-xs">
          <div className="flex items-center justify-between">
            <span className="font-label-code text-label-code text-error uppercase tracking-wider font-bold">
              미완료 점검 항목
            </span>
            <span className="material-symbols-outlined text-error text-lg">pending_actions</span>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="font-headline-lg text-display-md text-error font-bold">
              {unresolvedCount}<span className="text-headline-md font-normal text-on-surface-variant ml-1">개 항목</span>
            </span>
            <span className="font-label-code text-label-code bg-error-container text-on-error-container font-bold px-space-xs py-0.5">
              승인 불가
            </span>
          </div>
          <div className="w-full bg-surface-container h-1.5">
            <div className="bg-error h-1.5" style={{ width: `${(unresolvedCount / totalCount) * 100}%` }}></div>
          </div>
          <span className="font-body-sm text-body-sm text-error truncate font-medium">
            방문기관 안전확약, 현지 이동차량 보험
          </span>
        </div>

        {/* KPI 4 */}
        <div className="bg-surface-container-lowest p-space-md flex flex-col justify-between space-y-space-sm border border-surface-container shadow-xs">
          <div className="flex items-center justify-between">
            <span className="font-label-code text-label-code text-secondary uppercase tracking-wider font-bold">
              조치 필요 항목
            </span>
            <span className="material-symbols-outlined text-secondary text-lg">priority_high</span>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="font-headline-lg text-display-md text-secondary font-bold">
              {actionRequiredCount}<span className="text-headline-md font-normal text-on-surface-variant ml-1">개 항목</span>
            </span>
            <span className="font-label-code text-label-code bg-surface-container-high text-primary font-bold px-space-xs py-0.5">
              대응 진행중
            </span>
          </div>
          <div className="w-full bg-surface-container h-1.5">
            <div className="bg-secondary-container h-1.5" style={{ width: '16.6%' }}></div>
          </div>
          <span className="font-body-sm text-body-sm text-on-surface-variant truncate">
            비상연락망 교육청 종합상황실 연계
          </span>
        </div>
      </div>

      {/* Safety Inspection Management Table Terminal */}
      <div className="bg-surface-container-lowest flex flex-col border border-surface-container shadow-xs">
        {/* Panel Header Controls */}
        <div className="px-space-md py-space-sm bg-surface-container-low flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm border-b border-surface-container">
          <div className="flex items-center gap-space-sm">
            <span className="material-symbols-outlined text-primary text-lg">verified_user</span>
            <span className="font-headline-sm text-headline-sm text-primary font-bold">
              2027 싱가포르 연수단 법정 안전점검 대장
            </span>
            <span className="font-label-code text-label-code bg-surface-container px-space-xs py-0.5 text-on-surface-variant font-bold">
              ACTIVE DATASET
            </span>
          </div>
          <div className="flex items-center gap-space-xs">
            <span className="font-label-code text-label-code text-on-surface-variant">필터:</span>
            <button
              type="button"
              onClick={() => setFilter('all')}
              className={`px-space-xs py-0.5 font-label-code text-label-code font-bold cursor-pointer transition-colors ${
                filter === 'all' ? 'bg-primary text-on-primary' : 'bg-surface-container text-on-surface hover:bg-surface-variant'
              }`}
            >
              전체 ({totalCount})
            </button>
            <button
              type="button"
              onClick={() => setFilter('unresolved')}
              className={`px-space-xs py-0.5 font-label-code text-label-code font-bold cursor-pointer transition-colors ${
                filter === 'unresolved' ? 'bg-primary text-on-primary' : 'bg-surface-container text-on-surface hover:bg-surface-variant'
              }`}
            >
              미완료 ({unresolvedCount})
            </button>
            <button
              type="button"
              onClick={() => setFilter('resolved')}
              className={`px-space-xs py-0.5 font-label-code text-label-code font-bold cursor-pointer transition-colors ${
                filter === 'resolved' ? 'bg-primary text-on-primary' : 'bg-surface-container text-on-surface hover:bg-surface-variant'
              }`}
            >
              완료 ({resolvedCount})
            </button>
          </div>
        </div>

        {/* Scrollable High-Density Table Grid */}
        <div className="w-full overflow-x-auto">
          <table className="w-full text-left font-body-sm text-body-sm border-collapse min-w-[1040px]">
            <thead>
              <tr className="bg-primary text-on-primary font-label-code text-label-code">
                <th className="py-space-sm px-space-md w-36 whitespace-nowrap">점검 항목</th>
                <th className="py-space-sm px-space-md min-w-[220px]">법적 / 지침 점검 기준</th>
                <th className="py-space-sm px-space-md w-28 whitespace-nowrap">담당자</th>
                <th className="py-space-sm px-space-md w-28 whitespace-nowrap text-right">점검 예정일</th>
                <th className="py-space-sm px-space-md w-28 whitespace-nowrap text-center">점검 상태</th>
                <th className="py-space-sm px-space-md min-w-[260px]">조치 내용 및 첨부 증빙</th>
                <th className="py-space-sm px-space-md w-28 whitespace-nowrap text-right">최종 확인일</th>
                <th className="py-space-sm px-space-md w-24 text-center whitespace-nowrap">관리</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container font-body-md text-body-md">
              {filteredItems.map((item, idx) => {
                const isEven = idx % 2 === 0;
                let statusBadge = null;
                let actionBtnText = '점검서 보기';

                if (item.status === '조치 필요') {
                  statusBadge = (
                    <span className="inline-flex items-center gap-1 font-label-code text-label-code px-space-xs py-0.5 bg-surface-container-high text-secondary font-bold">
                      <span className="w-1.5 h-1.5 bg-secondary rounded-full"></span>
                      조치 필요
                    </span>
                  );
                  actionBtnText = '점검서 보기';
                } else if (item.status === '미점검') {
                  statusBadge = (
                    <span className="inline-flex items-center gap-1 font-label-code text-label-code px-space-xs py-0.5 bg-surface-variant text-on-surface-variant font-bold">
                      <span className="w-1.5 h-1.5 bg-outline rounded-full"></span>
                      미점검
                    </span>
                  );
                  actionBtnText = '등록하기';
                } else if (item.status === '점검 완료') {
                  statusBadge = (
                    <span className="inline-flex items-center gap-1 font-label-code text-label-code px-space-xs py-0.5 bg-tertiary-fixed text-on-tertiary-fixed font-bold">
                      <span className="w-1.5 h-1.5 bg-on-tertiary-container rounded-full"></span>
                      점검 완료
                    </span>
                  );
                  actionBtnText = item.name.includes('보험') ? '증빙확인' : item.name.includes('인솔') ? '명단확인' : '매뉴얼보기';
                } else {
                  statusBadge = (
                    <span className="inline-flex items-center gap-1 font-label-code text-label-code px-space-xs py-0.5 bg-secondary-fixed text-on-secondary-fixed font-bold">
                      <span className="w-1.5 h-1.5 bg-secondary rounded-full"></span>
                      조치 완료
                    </span>
                  );
                  actionBtnText = '상세보기';
                }

                return (
                  <tr
                    key={item.id}
                    className={`hover:bg-surface-container-low/70 transition-colors ${
                      isEven ? 'bg-surface-container-lowest' : 'bg-surface-container-low/30'
                    }`}
                  >
                    <td className="py-space-sm px-space-md font-bold text-on-surface">
                      {item.name}
                    </td>

                    <td className="py-space-sm px-space-md text-on-surface-variant text-body-sm">
                      {item.criteria}
                    </td>

                    <td className="py-space-sm px-space-md font-body-sm text-on-surface whitespace-nowrap">
                      {item.assignee}
                    </td>

                    <td className="py-space-sm px-space-md font-tabular-num text-tabular-num text-right whitespace-nowrap">
                      {item.scheduledDate}
                    </td>

                    <td className="py-space-sm px-space-md text-center whitespace-nowrap">
                      {statusBadge}
                    </td>

                    <td className="py-space-sm px-space-md text-body-sm">
                      <span className={item.status === '미점검' ? 'text-error font-medium' : 'text-on-surface'}>
                        {item.actionDetails}
                      </span>
                    </td>

                    <td className="py-space-sm px-space-md font-tabular-num text-tabular-num text-right whitespace-nowrap text-on-surface-variant">
                      {item.verifiedDate || '-'}
                    </td>

                    <td className="py-space-sm px-space-md text-center whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => setActiveItemModal(item)}
                        className={`px-space-xs py-1 font-label-code text-label-code font-bold cursor-pointer transition-colors ${
                          item.status === '미점검'
                            ? 'bg-primary text-on-primary hover:bg-primary-container'
                            : 'bg-surface-container-low hover:bg-surface-container text-primary border border-surface-container'
                        }`}
                      >
                        {actionBtnText}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Table Footer Meta Bar */}
        <div className="px-space-md py-space-xs bg-surface-container-low flex flex-col sm:flex-row items-start sm:items-center justify-between text-on-surface-variant font-label-code text-label-code border-t border-surface-container">
          <span>행정감사 데이터 보존 규정 제18조에 의거, 최종 점검서류는 5년간 교육행정정보시스템에 영구 보관됩니다.</span>
          <span className="font-tabular-num font-bold">최종 시스템 동기화: 2027-05-13 09:41:20 KST</span>
        </div>
      </div>

      {/* Bottom Visual Layout: Roadmap & Hotline Console */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-md">
        {/* Left Card: 단계별 안전관리 승인 로드맵 (7 Cols) */}
        <div className="lg:col-span-7 bg-surface-container-lowest p-space-md flex flex-col justify-between space-y-space-md border border-surface-container shadow-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-space-xs">
              <span className="material-symbols-outlined text-primary text-xl">route</span>
              <h2 className="font-headline-sm text-headline-sm text-primary font-bold">
                단계별 안전관리 승인 로드맵
              </h2>
            </div>
            <span className="font-label-code text-label-code px-space-xs py-0.5 bg-surface-container text-primary font-bold">
              CURRENT STAGE: 01
            </span>
          </div>

          {/* Roadmap Flow Horizontal Component */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-space-xs pt-space-xs">
            {/* Stage 1 */}
            <div className="p-space-sm bg-primary-container text-on-primary flex flex-col justify-between space-y-space-xs relative border border-primary">
              <div className="flex items-center justify-between">
                <span className="font-label-code text-label-code text-surface-variant font-bold">STEP 01</span>
                <span className="material-symbols-outlined text-tertiary-fixed text-base">sync</span>
              </div>
              <span className="font-headline-sm text-body-md font-bold leading-tight">사전점검 완료</span>
              <div className="flex items-center justify-between pt-space-2xs">
                <span className="font-tabular-num text-label-code text-surface-variant font-bold">
                  {resolvedCount}/{totalCount}건 완료
                </span>
                <span className="font-label-code text-label-code text-tertiary-fixed uppercase font-bold">
                  진행중
                </span>
              </div>
            </div>

            {/* Stage 2 */}
            <div className="p-space-sm bg-surface-container-low text-on-surface flex flex-col justify-between space-y-space-xs border border-surface-container">
              <div className="flex items-center justify-between">
                <span className="font-label-code text-label-code text-outline font-bold">STEP 02</span>
                <span className="material-symbols-outlined text-outline text-base">schedule</span>
              </div>
              <span className="font-headline-sm text-body-md font-bold leading-tight">학생·학부모 안전교육</span>
              <div className="flex items-center justify-between pt-space-2xs">
                <span className="font-label-code text-label-code text-outline">D-14 집합</span>
                <span className="font-label-code text-label-code text-on-surface-variant font-bold">대기</span>
              </div>
            </div>

            {/* Stage 3 */}
            <div className="p-space-sm bg-surface-container-low text-on-surface flex flex-col justify-between space-y-space-xs border border-surface-container">
              <div className="flex items-center justify-between">
                <span className="font-label-code text-label-code text-outline font-bold">STEP 03</span>
                <span className="material-symbols-outlined text-outline text-base">gavel</span>
              </div>
              <span className="font-headline-sm text-body-md font-bold leading-tight">안전심의위 정식 상정</span>
              <div className="flex items-center justify-between pt-space-2xs">
                <span className="font-label-code text-label-code text-outline">위원회 심의</span>
                <span className="font-label-code text-label-code text-on-surface-variant font-bold">대기</span>
              </div>
            </div>

            {/* Stage 4 */}
            <div className="p-space-sm bg-surface-container-low text-on-surface flex flex-col justify-between space-y-space-xs border border-surface-container">
              <div className="flex items-center justify-between">
                <span className="font-label-code text-label-code text-outline font-bold">STEP 04</span>
                <span className="material-symbols-outlined text-outline text-base">flight_takeoff</span>
              </div>
              <span className="font-headline-sm text-body-md font-bold leading-tight">출발 정식 승인</span>
              <div className="flex items-center justify-between pt-space-2xs">
                <span className="font-label-code text-label-code text-outline">최종 교육감 인가</span>
                <span className="font-label-code text-label-code text-on-surface-variant font-bold">미인가</span>
              </div>
            </div>
          </div>

          <div className="p-space-sm bg-surface-container-low flex items-center justify-between text-body-sm text-on-surface-variant border border-surface-container">
            <span>※ 1단계 사전점검의 미완료 2건이 종결되지 않을 시, 2단계 안전교육 후 심의 상정이 자동 반려됩니다.</span>
            <button
              type="button"
              onClick={() => setShowRoadmapRules(true)}
              className="text-secondary font-body-sm font-bold hover:underline shrink-0 cursor-pointer"
            >
              규정 확인 →
            </button>
          </div>
        </div>

        {/* Right Card: 비상 긴급 연락체계 요약 (5 Cols) */}
        <div className="lg:col-span-5 bg-surface-container-lowest p-space-md flex flex-col justify-between space-y-space-sm border border-surface-container shadow-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-space-xs">
              <span className="material-symbols-outlined text-error text-xl">contact_phone</span>
              <h2 className="font-headline-sm text-headline-sm text-primary font-bold">
                비상 긴급 연락체계 (Emergency Hotlines)
              </h2>
            </div>
            <span className="inline-flex items-center gap-1 font-label-code text-label-code px-space-xs py-0.5 bg-error-container text-on-error-container font-bold">
              <span className="w-1.5 h-1.5 bg-error rounded-full animate-pulse"></span>
              24H STANDBY
            </span>
          </div>

          <div className="divide-y divide-surface-container space-y-0">
            {/* Hotline 1 */}
            <div className="py-space-sm flex items-center justify-between">
              <div className="flex flex-col">
                <span className="font-headline-sm text-body-md font-bold text-on-surface">
                  주싱가포르 대한민국 대사관
                </span>
                <span className="font-body-sm text-body-sm text-on-surface-variant">
                  사건사고 긴급 당직 영사실
                </span>
              </div>
              <a
                href="tel:+6562561188"
                onClick={(e) => {
                  e.preventDefault();
                  alert('주싱가포르 대한민국 대사관 비상 핫라인 (+65-6256-1188) 호출 모의 연결을 시작합니다.');
                }}
                className="font-tabular-num text-tabular-num font-bold px-space-sm py-1 bg-surface-container hover:bg-surface-variant text-primary flex items-center gap-1 border border-surface-container-high"
              >
                <span className="material-symbols-outlined text-sm">call</span>
                +65-6256-1188
              </a>
            </div>

            {/* Hotline 2 */}
            <div className="py-space-sm flex items-center justify-between">
              <div className="flex flex-col">
                <span className="font-headline-sm text-body-md font-bold text-on-surface">
                  세종교육청 안전총괄과 긴급상황실
                </span>
                <span className="font-body-sm text-body-sm text-on-surface-variant">
                  원격 종합대책본부 직통전화
                </span>
              </div>
              <a
                href="tel:0443201119"
                onClick={(e) => {
                  e.preventDefault();
                  alert('세종교육청 안전총괄과 긴급상황실 직통 (044-320-1119) 모의 연결을 시작합니다.');
                }}
                className="font-tabular-num text-tabular-num font-bold px-space-sm py-1 bg-error-container text-on-error-container flex items-center gap-1 border border-error/30"
              >
                <span className="material-symbols-outlined text-sm">emergency</span>
                044-320-1119
              </a>
            </div>

            {/* Hotline 3 */}
            <div className="py-space-sm flex items-center justify-between">
              <div className="flex flex-col">
                <span className="font-headline-sm text-body-md font-bold text-on-surface">
                  대한민국 외교부 영사콜센터
                </span>
                <span className="font-body-sm text-body-sm text-on-surface-variant">
                  해외 체류 국민 24시간 종합지원
                </span>
              </div>
              <a
                href="tel:+82232100404"
                onClick={(e) => {
                  e.preventDefault();
                  alert('외교부 영사콜센터 24시간 핫라인 (+82-2-3210-0404) 모의 연결을 시작합니다.');
                }}
                className="font-tabular-num text-tabular-num font-bold px-space-sm py-1 bg-surface-container hover:bg-surface-variant text-primary flex items-center gap-1 border border-surface-container-high"
              >
                <span className="material-symbols-outlined text-sm">call</span>
                +82-2-3210-0404
              </a>
            </div>
          </div>

          <div className="pt-space-2xs">
            <button
              type="button"
              onClick={handleEmergencyBroadcastTest}
              className="w-full h-8 bg-surface-container-low hover:bg-surface-container text-primary font-body-sm text-body-sm flex items-center justify-center gap-1 border border-surface-container cursor-pointer font-bold"
            >
              <span className="material-symbols-outlined text-base">cell_tower</span>
              위기경보 발생 시 즉각 비상소집망 발령 시스템 연결
            </button>
          </div>
        </div>
      </div>

      {/* Safety Item Inspector & Approval Modal */}
      {activeItemModal && (
        <div className="fixed inset-0 z-50 bg-primary/60 flex items-center justify-center p-space-md">
          <div className="bg-surface-container-lowest w-full max-w-2xl border-2 border-primary shadow-xl flex flex-col">
            <div className="bg-primary text-on-primary p-space-md flex items-center justify-between">
              <div className="flex items-center gap-space-xs">
                <span className="material-symbols-outlined text-lg">verified_user</span>
                <span className="font-headline-sm text-headline-sm font-bold">
                  안전점검 상세 심의 및 행정 승인 ({activeItemModal.name})
                </span>
              </div>
              <button 
                type="button" 
                onClick={() => setActiveItemModal(null)} 
                className="text-on-primary hover:text-surface-variant cursor-pointer"
              >
                <span className="material-symbols-outlined text-xl">close</span>
              </button>
            </div>

            <div className="p-space-lg space-y-space-md">
              <div className="p-space-sm bg-surface-container-low border border-surface-container space-y-1">
                <span className="font-label-code text-label-code text-outline uppercase block">법적 점검 기준</span>
                <p className="font-body-md text-primary font-bold">{activeItemModal.criteria}</p>
                <span className="font-label-code text-label-code text-on-surface-variant block mt-1">
                  담당자: {activeItemModal.assignee} | 예정일: {activeItemModal.scheduledDate}
                </span>
              </div>

              <div className="space-y-space-xs">
                <label className="font-label-code text-label-code text-on-surface-variant font-bold block">
                  조치 내용 및 검증 의견
                </label>
                <textarea
                  rows={3}
                  value={activeItemModal.actionDetails}
                  onChange={(e) => setActiveItemModal({ ...activeItemModal, actionDetails: e.target.value })}
                  className="w-full p-space-xs bg-surface-container-low font-body-sm text-body-sm text-on-surface border border-surface-container focus:outline-none focus:bg-surface-container-lowest"
                />
              </div>

              <div className="flex items-center justify-between p-space-xs bg-surface-container-low border border-surface-container">
                <span className="font-label-code text-label-code text-outline">첨부 증빙 서류</span>
                <span className="font-tabular-num text-xs text-primary font-bold">
                  {activeItemModal.attachmentName || '현지 공문 증빙 첨부서류 업로드 대기'}
                </span>
              </div>
            </div>

            <div className="bg-surface-container-low p-space-md flex items-center justify-between border-t border-surface-container">
              <span className="font-label-code text-label-code text-outline">
                현재 상태: <strong className="text-primary font-bold">{activeItemModal.status}</strong>
              </span>
              <div className="flex items-center gap-space-xs">
                {activeItemModal.status !== '점검 완료' && (
                  <button
                    type="button"
                    onClick={() => {
                      handleStatusChange(activeItemModal.id, '점검 완료', activeItemModal.actionDetails);
                      setActiveItemModal(null);
                    }}
                    className="px-space-md py-space-sm bg-on-tertiary-container text-white font-label-code text-label-code uppercase tracking-wider font-bold cursor-pointer"
                  >
                    점검 완료 승인
                  </button>
                )}
                {activeItemModal.status !== '조치 필요' && (
                  <button
                    type="button"
                    onClick={() => {
                      handleStatusChange(activeItemModal.id, '조치 필요', activeItemModal.actionDetails);
                      setActiveItemModal(null);
                    }}
                    className="px-space-md py-space-sm bg-error text-on-error font-label-code text-label-code uppercase tracking-wider font-bold cursor-pointer"
                  >
                    보완 요구 (조치 필요)
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setActiveItemModal(null)}
                  className="px-space-md py-space-sm bg-surface-container text-on-surface font-label-code text-label-code uppercase font-bold cursor-pointer"
                >
                  닫기
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add New Safety Modal */}
      {showAddSafetyModal && (
        <div className="fixed inset-0 z-50 bg-primary/60 flex items-center justify-center p-space-md">
          <form onSubmit={handleAddNewSafety} className="bg-surface-container-lowest w-full max-w-xl border-2 border-primary shadow-xl flex flex-col">
            <div className="bg-primary text-on-primary p-space-md flex items-center justify-between">
              <div className="flex items-center gap-space-xs">
                <span className="material-symbols-outlined text-lg">add_task</span>
                <span className="font-headline-sm text-headline-sm font-bold">신규 안전 점검 항목 등록</span>
              </div>
              <button 
                type="button" 
                onClick={() => setShowAddSafetyModal(false)} 
                className="text-on-primary hover:text-surface-variant cursor-pointer"
              >
                <span className="material-symbols-outlined text-xl">close</span>
              </button>
            </div>

            <div className="p-space-lg space-y-space-md">
              <div className="space-y-1">
                <label className="font-label-code text-label-code text-on-surface-variant font-bold block">
                  점검 항목명 *
                </label>
                <input
                  type="text"
                  required
                  placeholder="예: 현지 호텔 비상대피로 및 화재경보 작동 실태 점검"
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  className="w-full h-9 px-space-xs bg-surface-container-low font-body-sm text-body-sm text-on-surface border border-surface-container focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-label-code text-label-code text-on-surface-variant font-bold block">
                  법적 및 지침 점검 기준 *
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder="세종특별자치시교육청 현장체험학습 운영 매뉴얼 제14조 준수 여부"
                  value={newItemCriteria}
                  onChange={(e) => setNewItemCriteria(e.target.value)}
                  className="w-full p-space-xs bg-surface-container-low font-body-sm text-body-sm text-on-surface border border-surface-container focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-label-code text-label-code text-on-surface-variant font-bold block">
                  책임 담당자
                </label>
                <select
                  value={newItemAssignee}
                  onChange={(e) => setNewItemAssignee(e.target.value)}
                  className="w-full h-9 px-space-xs bg-surface-container-low font-body-sm text-body-sm text-on-surface border border-surface-container focus:outline-none"
                >
                  <option value="김지현 장학관">김지현 장학관 (진로교육과 총괄)</option>
                  <option value="박성훈 장학사">박성훈 장학사 (안전기획팀)</option>
                  <option value="이수진 교사">이수진 교사 (인솔대표교원)</option>
                </select>
              </div>
            </div>

            <div className="bg-surface-container-low p-space-md flex items-center justify-end gap-space-xs border-t border-surface-container">
              <button
                type="button"
                onClick={() => setShowAddSafetyModal(false)}
                className="px-space-md py-space-sm bg-surface-container text-on-surface font-label-code text-label-code uppercase font-bold cursor-pointer"
              >
                취소
              </button>
              <button
                type="submit"
                className="px-space-md py-space-sm bg-primary text-on-primary font-label-code text-label-code uppercase font-bold cursor-pointer hover:bg-primary-container"
              >
                등록 완료
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Roadmap Regulations Drawer/Modal */}
      {showRoadmapRules && (
        <div className="fixed inset-0 z-50 bg-primary/60 flex items-center justify-center p-space-md">
          <div className="bg-surface-container-lowest w-full max-w-2xl border-2 border-primary shadow-xl p-space-md space-y-space-md">
            <div className="flex items-center justify-between pb-space-xs border-b border-surface-container">
              <span className="font-headline-sm text-primary font-bold">세종시교육청 학생국외체험학습 안전관리 규정</span>
              <button 
                type="button" 
                onClick={() => setShowRoadmapRules(false)} 
                className="material-symbols-outlined text-outline hover:text-primary cursor-pointer"
              >
                close
              </button>
            </div>
            <div className="text-xs space-y-2 text-on-surface leading-relaxed max-h-72 overflow-y-auto">
              <p><strong>제1조 (목적)</strong> 본 규정은 세종특별자치시 관내 초·중·고등학생의 안전하고 교육적인 국외 진로체험학습의 시행 및 위기관리 체계를 규정함을 목적으로 한다.</p>
              <p><strong>제8조 (사전 안전심의 의무)</strong> 학교장 또는 주관부서는 출국 30일 전까지 법정 6대 안전점검(방문기관, 교통수단, 여행자보험, 인솔단, 비상망, 방역)을 완료하고 교육청 심의위원회에 부의하여야 한다.</p>
              <p><strong>제14조 (인솔교원 배치)</strong> 학생 15명당 인솔교원 1인 이상을 의무 배치하며, 50인 이상 단체 파견 시 응급구조사 또는 수상·산악 안전지도사 자격 소지자 1인 이상이 필수 동행하여야 한다.</p>
            </div>
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setShowRoadmapRules(false)}
                className="px-space-md py-1 bg-primary text-on-primary font-label-code text-label-code font-bold cursor-pointer"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
