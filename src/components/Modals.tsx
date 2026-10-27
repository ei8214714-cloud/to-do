import React, { useState } from 'react';
import { ProjectItem, BudgetItem } from '../types';

interface ProjectRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (newProject: Partial<ProjectItem>) => void;
}

export const ProjectRegistrationModal: React.FC<ProjectRegistrationModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [title, setTitle] = useState('');
  const [mode, setMode] = useState('국외방문형 (해외직접파견)');
  const [department, setDepartment] = useState('세종교육청 진로교육과');
  const [participants, setParticipants] = useState('50');
  const [budget, setBudget] = useState('45,000,000');
  const [hasError, setHasError] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setHasError(true);
      return;
    }

    const cleanBudget = parseInt(budget.replace(/[^0-9]/g, ''), 10) || 50000000;
    const cleanParticipants = parseInt(participants, 10) || 50;
    const newCode = `PRJ-2027-${String(Math.floor(Math.random() * 900) + 100)}`;

    onSubmit({
      id: newCode,
      code: newCode,
      title: title.trim(),
      type: mode.includes('국외') ? '국외체험(직접파견)' : '국내집중형',
      destination: mode.includes('국외') ? '해외 거점 기관' : '국내 거점 캠퍼스',
      period: '27.09.01~09.08',
      startDate: '2027.09.01',
      endDate: '2027.09.08',
      participants: cleanParticipants,
      status: '계획수립',
      totalBudget: cleanBudget,
      allocatedBudget: cleanBudget,
      department: department,
      manager: '김지현 장학관',
      managerContact: '044-320-1542',
      purpose: '세종시 청소년 대상 미래 진로 탐색 및 글로벌 역량 배양 프로그램',
      background: '2027 세종미래교육 비전 연계 실천 사업',
      targetInfo: `관내 중·고교 선발 ${cleanParticipants}명`,
      hostOrgs: '글로벌 대학 및 첨단 R&D 연구센터',
      approvalDocNum: '진로-2027-신규초안',
      escortProofDoc: '인솔교사배치계획_수립중.pdf',
      updatedAt: `${new Date().toISOString().slice(0, 10).replace(/-/g, '.')} 10:00:00`,
    });

    onClose();
    setTitle('');
    setHasError(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-primary/60 flex items-center justify-center p-space-md">
      <div className="bg-surface-container-lowest w-full max-w-3xl border-2 border-primary shadow-xl flex flex-col">
        {/* Modal Header */}
        <div className="bg-primary text-on-primary p-space-md flex items-center justify-between">
          <div className="flex items-center gap-space-xs">
            <span className="material-symbols-outlined text-lg">post_add</span>
            <span className="font-headline-sm text-headline-sm font-bold">
              신규 글로벌 진로탐험 사업 등록
            </span>
          </div>
          <button 
            type="button"
            onClick={onClose} 
            className="text-on-primary hover:text-surface-variant cursor-pointer"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="flex flex-col">
          <div className="p-space-lg space-y-space-md overflow-y-auto max-h-[768px]">
            <div className="bg-surface-container-low p-space-sm font-body-sm text-body-sm text-on-surface-variant flex items-center gap-space-xs border border-surface-container">
              <span className="material-symbols-outlined text-secondary text-base">info</span>
              <span>필수 항목 누락 시 경고문이 표시됩니다. 행정 서식 양식에 맞춰 빈칸을 채워주십시오.</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
              <div className="flex flex-col gap-space-2xs md:col-span-2">
                <label className="font-label-code text-label-code text-on-surface-variant font-bold flex items-center gap-1">
                  <span>사업 공식 명칭</span>
                  <span className="text-error font-bold">*</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                    if (hasError) setHasError(false);
                  }}
                  placeholder="예: 2027 세종 청소년 실리콘밸리 테크원정대"
                  className="w-full h-9 px-space-xs bg-surface-container-low font-body-sm text-body-sm text-on-surface focus:outline-none focus:bg-surface-container-lowest border border-surface-container focus:border-primary"
                />
                {hasError && (
                  <span className="font-label-code text-label-code text-error font-bold flex items-center gap-1 mt-1">
                    <span className="material-symbols-outlined text-xs">error</span>
                    <span>※ 필수 입력 항목입니다</span>
                  </span>
                )}
              </div>

              <div className="flex flex-col gap-space-2xs">
                <label className="font-label-code text-label-code text-on-surface-variant font-bold">
                  운영 방식 구분
                </label>
                <select
                  value={mode}
                  onChange={(e) => setMode(e.target.value)}
                  className="w-full h-9 px-space-xs bg-surface-container-low font-body-sm text-body-sm text-on-surface focus:outline-none border border-surface-container"
                >
                  <option>국외방문형 (해외직접파견)</option>
                  <option>국내집중형 (국제특화캠프)</option>
                  <option>온·오프라인연계형</option>
                </select>
              </div>

              <div className="flex flex-col gap-space-2xs">
                <label className="font-label-code text-label-code text-on-surface-variant font-bold">
                  소관 부서
                </label>
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full h-9 px-space-xs bg-surface-container-low font-body-sm text-body-sm text-on-surface focus:outline-none border border-surface-container"
                >
                  <option>세종교육청 진로교육과</option>
                  <option>세종교육청 미래교육과</option>
                  <option>환경교육팀</option>
                  <option>학교자율공모</option>
                </select>
              </div>

              <div className="flex flex-col gap-space-2xs">
                <label className="font-label-code text-label-code text-on-surface-variant font-bold flex items-center gap-1">
                  <span>목표 학생 정원 (명)</span>
                  <span className="text-error font-bold">*</span>
                </label>
                <input
                  type="number"
                  value={participants}
                  onChange={(e) => setParticipants(e.target.value)}
                  placeholder="50"
                  className="w-full h-9 px-space-xs bg-surface-container-low font-body-sm text-body-sm text-on-surface focus:outline-none focus:bg-surface-container-lowest border border-surface-container focus:border-primary"
                />
              </div>

              <div className="flex flex-col gap-space-2xs">
                <label className="font-label-code text-label-code text-on-surface-variant font-bold flex items-center gap-1">
                  <span>신청 총예산액 (원)</span>
                  <span className="text-error font-bold">*</span>
                </label>
                <input
                  type="text"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  placeholder="예: 45,000,000"
                  className="w-full h-9 px-space-xs bg-surface-container-low font-body-sm text-body-sm text-on-surface focus:outline-none focus:bg-surface-container-lowest font-tabular-num border border-surface-container focus:border-primary"
                />
              </div>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="bg-surface-container-low p-space-md flex items-center justify-between border-t border-surface-container">
            <span className="font-label-code text-label-code text-on-surface-variant">
              상태: 초안(DRAFT)으로 등록됩니다
            </span>
            <div className="flex items-center gap-space-xs">
              <button
                type="button"
                onClick={onClose}
                className="px-space-md py-space-sm bg-surface-container text-on-surface font-label-code text-label-code uppercase tracking-wider hover:bg-surface-container-high transition-colors font-bold cursor-pointer"
              >
                취소
              </button>
              <button
                type="submit"
                className="px-space-md py-space-sm bg-primary text-on-primary font-label-code text-label-code uppercase tracking-wider hover:bg-primary-container transition-colors font-bold cursor-pointer"
              >
                신규 등록 완료
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

interface AddBudgetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (item: Partial<BudgetItem>) => void;
}

export const AddBudgetModal: React.FC<AddBudgetModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [name, setName] = useState('');
  const [basis, setBasis] = useState('');
  const [unitPrice, setUnitPrice] = useState('100000');
  const [quantity, setQuantity] = useState('100');
  const [unit, setUnit] = useState('명');
  const [category, setCategory] = useState('program');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const uPrice = parseInt(unitPrice.replace(/[^0-9]/g, ''), 10) || 0;
    const qty = parseInt(quantity, 10) || 1;
    const planned = uPrice * qty;

    onSubmit({
      name: name.trim(),
      basis: basis.trim(),
      unitPrice: uPrice,
      quantity: qty,
      unit: unit,
      plannedTotal: planned,
      executedAmount: 0,
      balance: planned,
      status: '계획승인대기',
      statusType: 'pending',
      category: category,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-primary/60 flex items-center justify-center p-space-md">
      <form onSubmit={handleSubmit} className="bg-surface-container-lowest w-full max-w-xl border-2 border-primary shadow-xl flex flex-col">
        <div className="bg-primary text-on-primary p-space-md flex items-center justify-between">
          <div className="flex items-center gap-space-xs">
            <span className="material-symbols-outlined text-lg">add_box</span>
            <span className="font-headline-sm text-headline-sm font-bold">예산 산출 항목 추가</span>
          </div>
          <button type="button" onClick={onClose} className="text-on-primary hover:text-surface-variant cursor-pointer">
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        <div className="p-space-lg space-y-space-md">
          <div className="space-y-1">
            <label className="font-label-code text-label-code text-on-surface-variant font-bold block">
              비목 구분
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full h-9 px-space-xs bg-surface-container-low font-body-sm text-on-surface border border-surface-container"
            >
              <option value="program">프로그램 운영비</option>
              <option value="transport">항공 및 교통비</option>
              <option value="lodging">숙박비</option>
              <option value="insurance">안전보험 및 방역</option>
              <option value="emergency">비상대응 예비비</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="font-label-code text-label-code text-on-surface-variant font-bold block">
              예산 항목명 *
            </label>
            <input
              type="text"
              required
              placeholder="예: 현지 전문 통역원 수당"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full h-9 px-space-xs bg-surface-container-low font-body-sm text-on-surface border border-surface-container"
            />
          </div>

          <div className="space-y-1">
            <label className="font-label-code text-label-code text-on-surface-variant font-bold block">
              산출 근거 (수식 및 사유)
            </label>
            <input
              type="text"
              placeholder="1일 ₩250,000 × 2인 × 6일"
              value={basis}
              onChange={(e) => setBasis(e.target.value)}
              className="w-full h-9 px-space-xs bg-surface-container-low font-body-sm text-on-surface border border-surface-container"
            />
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="font-label-code text-label-code text-on-surface-variant font-bold block">단가 (원)</label>
              <input
                type="number"
                value={unitPrice}
                onChange={(e) => setUnitPrice(e.target.value)}
                className="w-full h-9 px-space-xs bg-surface-container-low font-body-sm text-on-surface border border-surface-container"
              />
            </div>
            <div>
              <label className="font-label-code text-label-code text-on-surface-variant font-bold block">수량</label>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="w-full h-9 px-space-xs bg-surface-container-low font-body-sm text-on-surface border border-surface-container"
              />
            </div>
            <div>
              <label className="font-label-code text-label-code text-on-surface-variant font-bold block">단위</label>
              <input
                type="text"
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                className="w-full h-9 px-space-xs bg-surface-container-low font-body-sm text-on-surface border border-surface-container"
              />
            </div>
          </div>
        </div>

        <div className="bg-surface-container-low p-space-md flex items-center justify-end gap-space-xs border-t border-surface-container">
          <button type="button" onClick={onClose} className="px-space-md py-1 bg-surface-container font-label-code font-bold cursor-pointer">
            취소
          </button>
          <button type="submit" className="px-space-md py-1 bg-primary text-on-primary font-label-code font-bold cursor-pointer">
            추가 완료
          </button>
        </div>
      </form>
    </div>
  );
};

interface RemediationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onResolved: () => void;
}

export const RemediationModal: React.FC<RemediationModalProps> = ({
  isOpen,
  onClose,
  onResolved,
}) => {
  const [note, setNote] = useState('싱가포르 국립대 AI 석학 초빙 강사료: 시간당 250 SGD(원화 환산 ₩255,125), 총 20시간 = 5,000 SGD 전신송금 영수증 및 원천징수 면제조약 적용 신청서 첨부 완료.');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-primary/60 flex items-center justify-center p-space-md">
      <div className="bg-surface-container-lowest w-full max-w-2xl border-2 border-primary shadow-xl p-space-md space-y-space-md">
        <div className="flex items-center justify-between pb-space-xs border-b border-surface-container">
          <span className="font-headline-sm text-primary font-bold">
            산출근거 보완서 등록 및 정합성 소명 (프로그램 운영비)
          </span>
          <button type="button" onClick={onClose} className="material-symbols-outlined text-outline hover:text-primary cursor-pointer">
            close
          </button>
        </div>

        <div className="space-y-space-sm text-body-sm">
          <div className="p-space-sm bg-error-container/30 border border-error/30 text-xs">
            <strong>지적 사항:</strong> 싱가포르 국립대 AI 워크숍 강사료 지급 기준(시간당 단가 산출내역서 및 해외 송금 증빙 서식) 미입력
          </div>

          <div>
            <label className="font-label-code text-label-code text-on-surface-variant font-bold block mb-1">
              소명 내역 및 산출근거 상세 기술
            </label>
            <textarea
              rows={4}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full p-space-xs bg-surface-container-low font-body-sm text-body-sm text-on-surface border border-surface-container"
            />
          </div>

          <div className="p-space-xs bg-surface-container-low border border-surface-container text-xs flex items-center justify-between">
            <span>증빙 첨부: NUS_Lecture_Invoice_FeeSchedule.pdf (840KB)</span>
            <span className="text-secondary font-bold">정상 업로드됨</span>
          </div>
        </div>

        <div className="flex justify-end gap-space-xs pt-space-xs border-t border-surface-container">
          <button type="button" onClick={onClose} className="px-space-md py-1 bg-surface-container font-label-code font-bold cursor-pointer">
            취소
          </button>
          <button
            type="button"
            onClick={() => {
              onResolved();
              onClose();
            }}
            className="px-space-md py-1 bg-on-tertiary-container text-white font-label-code font-bold cursor-pointer"
          >
            소명서 제출 및 보완 완료
          </button>
        </div>
      </div>
    </div>
  );
};
