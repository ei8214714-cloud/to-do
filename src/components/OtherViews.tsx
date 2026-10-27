import React, { useState } from 'react';
import { ProjectItem, KCDIDimension } from '../types';

export const ParticipationView: React.FC<{ projects: ProjectItem[]; onShowToast: (msg: string) => void }> = ({
  projects,
  onShowToast,
}) => {
  const [selectedSchool, setSelectedSchool] = useState('세종과학예술영재학교');

  const schools = [
    { name: '세종과학예술영재학교', type: '영재고', allocated: 25, applied: 38, selected: 25, minority: 5, status: '선발완료' },
    { name: '세종국제고등학교', type: '특목고', allocated: 25, applied: 42, selected: 25, minority: 5, status: '선발완료' },
    { name: '아름고등학교', type: '일반고', allocated: 20, applied: 31, selected: 20, minority: 4, status: '선발완료' },
    { name: '도담고등학교', type: '일반고', allocated: 15, applied: 22, selected: 15, minority: 3, status: '선발완료' },
    { name: '세종하이텍고등학교', type: '특성화고', allocated: 15, applied: 18, selected: 15, minority: 3, status: '선발완료' },
  ];

  return (
    <div className="space-y-space-md">
      <div className="bg-surface-container-lowest p-space-lg border border-surface-container shadow-xs flex justify-between items-center">
        <div>
          <span className="font-label-code text-secondary font-bold uppercase">MUNICIPAL STUDENT REGISTRY // FY27</span>
          <h1 className="font-headline-lg text-display-md text-primary font-bold">참여관리</h1>
          <p className="font-body-sm text-on-surface-variant">세종시 관내 24개교 1,420명 학생 선발 현황 및 사회배려계층 20% 의무 할당을 총괄 관리합니다.</p>
        </div>
        <button
          onClick={() => onShowToast('참가 학생 명단 전체 전산 조회가 완료되었습니다.')}
          className="px-space-md py-space-sm bg-primary text-on-primary font-label-code font-bold cursor-pointer"
        >
          명단 전산 대조
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-space-md">
        <div className="p-space-md bg-surface-container-lowest border border-surface-container">
          <span className="font-label-code text-outline block">총 배정 정원</span>
          <span className="font-display-md text-primary font-bold">1,800명</span>
        </div>
        <div className="p-space-md bg-surface-container-lowest border border-surface-container">
          <span className="font-label-code text-outline block">현재 선발 인원</span>
          <span className="font-display-md text-secondary font-bold">1,420명</span>
        </div>
        <div className="p-space-md bg-surface-container-lowest border border-surface-container">
          <span className="font-label-code text-outline block">사회배려대상자 비율</span>
          <span className="font-display-md text-on-tertiary-container font-bold">20.4%</span>
          <span className="text-xs text-on-tertiary-container font-semibold">법정 20% 초과달성</span>
        </div>
        <div className="p-space-md bg-surface-container-lowest border border-surface-container">
          <span className="font-label-code text-outline block">선발 완료교</span>
          <span className="font-display-md text-primary font-bold">24 / 24개교</span>
        </div>
      </div>

      <div className="bg-surface-container-lowest border border-surface-container p-space-md">
        <div className="flex items-center justify-between pb-space-xs border-b border-surface-container mb-space-sm">
          <span className="font-headline-sm text-primary font-bold">관내 참여 학교별 배정 및 선발 대장</span>
          <span className="font-label-code text-on-surface-variant">2027.05.15 기준</span>
        </div>
        <table className="w-full text-left font-body-sm">
          <thead className="bg-primary text-on-primary font-label-code">
            <tr>
              <th className="p-2">학교명</th>
              <th className="p-2 text-center">유형</th>
              <th className="p-2 text-right">배정 정원</th>
              <th className="p-2 text-right">지원자수</th>
              <th className="p-2 text-right">최종선발</th>
              <th className="p-2 text-right">사회배려대상(20%)</th>
              <th className="p-2 text-center">진행상태</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-container">
            {schools.map(s => (
              <tr key={s.name} className="hover:bg-surface-container-low transition-colors">
                <td className="p-2 font-bold text-primary">{s.name}</td>
                <td className="p-2 text-center text-outline">{s.type}</td>
                <td className="p-2 text-right font-mono">{s.allocated}명</td>
                <td className="p-2 text-right font-mono">{s.applied}명</td>
                <td className="p-2 text-right font-mono font-bold text-primary">{s.selected}명</td>
                <td className="p-2 text-right font-mono text-secondary font-bold">{s.minority}명</td>
                <td className="p-2 text-center font-label-code text-on-tertiary-container font-bold">{s.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export const PerformanceView: React.FC<{ kcdiMetrics: KCDIDimension[]; onShowToast: (msg: string) => void }> = ({
  kcdiMetrics,
  onShowToast,
}) => {
  return (
    <div className="space-y-space-md">
      <div className="bg-surface-container-lowest p-space-lg border border-surface-container shadow-xs flex justify-between items-center">
        <div>
          <span className="font-label-code text-secondary font-bold uppercase">K-CDI ASSESSMENT &amp; SATISFACTION ANALYTICS</span>
          <h1 className="font-headline-lg text-display-md text-primary font-bold">성과관리</h1>
          <p className="font-body-sm text-on-surface-variant">한국진로발달검사(K-CDI) 표준화 척도를 통한 참여 학생 진로 효능감 및 프로그램 종합 만족도를 정밀 측정합니다.</p>
        </div>
        <button
          onClick={() => onShowToast('2027 상반기 K-CDI 역량 성과평가 종합보고서 PDF 출력이 요청되었습니다.')}
          className="px-space-md py-space-sm bg-primary text-on-primary font-label-code font-bold cursor-pointer"
        >
          성과보고서 발간 (PDF)
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-space-md">
        <div className="p-space-md bg-surface-container-lowest border border-surface-container">
          <span className="font-label-code text-outline block">종합 역량 지수 상승치</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="font-display-md text-primary font-bold">3.12 → 4.38</span>
            <span className="text-secondary font-bold text-sm">(+1.26점)</span>
          </div>
          <span className="text-xs text-on-surface-variant block mt-1">5점 만점 기준 전수 표본 분석</span>
        </div>
        <div className="p-space-md bg-surface-container-lowest border border-surface-container">
          <span className="font-label-code text-outline block">참가자 만족도 설문 회수율</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="font-display-md text-secondary font-bold">70.8%</span>
            <span className="text-xs text-outline">(17/24개교)</span>
          </div>
          <span className="text-xs text-on-surface-variant block mt-1">D-3 마감 전 독촉 알림 발송 중</span>
        </div>
        <div className="p-space-md bg-surface-container-lowest border border-surface-container">
          <span className="font-label-code text-outline block">진로 확신도 긍정 응답률</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="font-display-md text-on-tertiary-container font-bold">94.6%</span>
          </div>
          <span className="text-xs text-on-surface-variant block mt-1">사전 대비 38.2%p 대폭 향상</span>
        </div>
      </div>

      <div className="bg-surface-container-lowest border border-surface-container p-space-md space-y-space-md">
        <span className="font-headline-sm text-primary font-bold block border-b border-surface-container pb-space-xs">
          3대 핵심 역량 차원별 사전-사후 정밀 대조군 분석
        </span>
        <div className="space-y-space-md">
          {kcdiMetrics.map(item => (
            <div key={item.code} className="p-space-sm bg-surface-container-low border border-surface-container space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-bold text-primary">{item.name}</span>
                <span className="font-mono text-sm font-bold text-secondary">
                  사전 {item.preScore}점 → 사후 {item.postScore}점 (상승 폭: +{item.delta}점)
                </span>
              </div>
              <div className="w-full bg-surface-container h-3 relative">
                <div className="absolute left-0 bg-outline h-full" style={{ width: `${item.percentPre}%` }}></div>
                <div className="absolute left-0 bg-primary h-full opacity-80" style={{ width: `${item.percentPost}%` }}></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const AlternativeComparisonView: React.FC<{ onShowToast: (msg: string) => void }> = ({ onShowToast }) => {
  return (
    <div className="space-y-space-md">
      <div className="bg-surface-container-lowest p-space-lg border border-surface-container shadow-xs">
        <span className="font-label-code text-secondary font-bold uppercase">FEASIBILITY &amp; POLICY TRADE-OFF MATRIX</span>
        <h1 className="font-headline-lg text-display-md text-primary font-bold">대안비교</h1>
        <p className="font-body-sm text-on-surface-variant">
          국외직접파견, 국내집중형(국제캠프), 온·오프라인 하이브리드 모델 간 비용 효과성, 안전 위험도, 학생 수혜 범위를 비교 분석합니다.
        </p>
      </div>

      <div className="overflow-x-auto bg-surface-container-lowest border border-surface-container">
        <table className="w-full text-left font-body-sm">
          <thead className="bg-primary text-on-primary font-label-code">
            <tr>
              <th className="p-3">비교 평가 항목</th>
              <th className="p-3 text-secondary-fixed">대안 1: 국외직접파견 (현행)</th>
              <th className="p-3">대안 2: 국내집중형 국제특화캠프</th>
              <th className="p-3">대안 3: 온·오프라인 하이브리드</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-container font-body-sm">
            <tr>
              <td className="p-3 font-bold bg-surface-container-low">학생 1인당 소요 예산</td>
              <td className="p-3 font-mono font-bold text-primary">₩1,300,000 ~ ₩1,800,000</td>
              <td className="p-3 font-mono text-on-surface-variant">₩400,000 ~ ₩600,000</td>
              <td className="p-3 font-mono text-on-surface-variant">₩250,000 ~ ₩350,000</td>
            </tr>
            <tr>
              <td className="p-3 font-bold bg-surface-container-low">안전 통제 및 리스크 관리</td>
              <td className="p-3 text-error font-semibold">높음 (해외 항공/현지 이동/감염병)</td>
              <td className="p-3 text-on-tertiary-container font-semibold">매우 낮음 (국내 안전망 통제)</td>
              <td className="p-3 text-on-tertiary-container font-semibold">최소 (비대면 및 교내 활동)</td>
            </tr>
            <tr>
              <td className="p-3 font-bold bg-surface-container-low">학습 몰입도 및 진로 효능감</td>
              <td className="p-3 text-secondary font-bold">최상 (글로벌 현장 직접 체감)</td>
              <td className="p-3 text-on-surface-variant">중상 (해외 석학 초청 및 시뮬레이션)</td>
              <td className="p-3 text-on-surface-variant">보통 (온라인 교류 한계)</td>
            </tr>
            <tr>
              <td className="p-3 font-bold bg-surface-container-low">연간 수혜 가능 학생 수</td>
              <td className="p-3 font-mono">약 1,400명 (예산 제약)</td>
              <td className="p-3 font-mono font-bold text-primary">약 3,500명 (동일 예산 대비)</td>
              <td className="p-3 font-mono font-bold text-primary">약 6,000명 이상</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export const ReportsView: React.FC<{ onShowToast: (msg: string) => void }> = ({ onShowToast }) => {
  const reports = [
    { title: '2027 글로벌 진로탐험대 상반기 종합운영 성과보고서', code: 'REP-2027-01', date: '2027.05.14', size: '4.8MB', type: 'PDF' },
    { title: '싱가포르 연수단 출국 전 법정 안전점검표 및 심의 의결서', code: 'SAFE-DOC-2027', date: '2027.05.10', size: '2.1MB', type: 'PDF' },
    { title: '2027년 교육비특별회계 진로교육 특별비목 집행 결산서', code: 'BGT-2027-FIN', date: '2027.04.30', size: '1.5MB', type: 'XLSX' },
    { title: '한국진로발달검사(K-CDI) 척도 표준화 분석 및 통계표', code: 'STAT-KCDI-02', date: '2027.04.15', size: '3.2MB', type: 'PDF' },
  ];

  return (
    <div className="space-y-space-md">
      <div className="bg-surface-container-lowest p-space-lg border border-surface-container shadow-xs">
        <span className="font-label-code text-secondary font-bold uppercase">OFFICIAL DOCUMENT ARCHIVE &amp; EXPORT</span>
        <h1 className="font-headline-lg text-display-md text-primary font-bold">보고서</h1>
        <p className="font-body-sm text-on-surface-variant">공식 행정 결재 및 의회 감사 제출용 법정 서식 및 통계 자료 아카이브입니다.</p>
      </div>

      <div className="bg-surface-container-lowest border border-surface-container p-space-md">
        <div className="divide-y divide-surface-container">
          {reports.map((r) => (
            <div key={r.code} className="py-space-md flex items-center justify-between">
              <div>
                <span className="font-bold text-primary block">{r.title}</span>
                <span className="font-label-code text-outline text-xs">문서번호: {r.code} | 등록일: {r.date} | 파일용량: {r.size}</span>
              </div>
              <button
                onClick={() => onShowToast(`[${r.title}] 파일이 정상 다운로드되었습니다.`)}
                className="px-space-md py-1 bg-surface-container-low hover:bg-surface-container text-primary font-label-code font-bold border border-surface-container cursor-pointer"
              >
                다운로드 ({r.type})
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const SystemAdminView: React.FC<{ onShowToast: (msg: string) => void }> = ({ onShowToast }) => {
  return (
    <div className="space-y-space-md">
      <div className="bg-surface-container-lowest p-space-lg border border-surface-container shadow-xs">
        <span className="font-label-code text-secondary font-bold uppercase">SYSTEM ARCHITECTURE &amp; NEIS INTEGRATION</span>
        <h1 className="font-headline-lg text-display-md text-primary font-bold">시스템관리</h1>
        <p className="font-body-sm text-on-surface-variant">세종교육청 기관망 연계, 사용자 권한 매트릭스, 감사 추적 및 데이터베이스 무결성을 관리합니다.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
        <div className="bg-surface-container-lowest border border-surface-container p-space-md space-y-2">
          <span className="font-headline-sm text-primary font-bold block border-b border-surface-container pb-1">
            기관망 연계 인터페이스 상태
          </span>
          <div className="flex justify-between text-xs py-1">
            <span>교육행정정보시스템 (NEIS) 연계</span>
            <span className="text-on-tertiary-container font-bold">정상 (LATENCY: 18ms)</span>
          </div>
          <div className="flex justify-between text-xs py-1">
            <span>교육비특별회계 전자문서 시스템</span>
            <span className="text-on-tertiary-container font-bold">연동 활성화</span>
          </div>
          <div className="flex justify-between text-xs py-1">
            <span>외교부 해외안전여행 핫라인 API</span>
            <span className="text-on-tertiary-container font-bold">실시간 수신중</span>
          </div>
        </div>

        <div className="bg-surface-container-lowest border border-surface-container p-space-md space-y-2">
          <span className="font-headline-sm text-primary font-bold block border-b border-surface-container pb-1">
            보안 및 접근 제어 등급
          </span>
          <div className="text-xs space-y-1 text-on-surface-variant">
            <div>보안 등급: 공공업무 대외비 제한등급 3</div>
            <div>인증 방식: 공공 GPKI 전자서명 + 행정망 SSO 연계</div>
            <div>최근 전산 정기 점검: 2027.05.15 00:00:00 (전 항목 적합)</div>
          </div>
        </div>
      </div>
    </div>
  );
};
