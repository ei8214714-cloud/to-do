import React, { useState } from 'react';
import { NavTab, ActionItem } from '../types';

interface HeaderProps {
  currentTab: NavTab;
  currentYear: string;
  onYearChange: (year: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  actionItems: ActionItem[];
  onSelectAction: (item: ActionItem) => void;
  onOpenHelp: () => void;
  onOpenSettings: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  currentYear,
  onYearChange,
  searchQuery,
  onSearchChange,
  actionItems,
  onSelectAction,
  onOpenHelp,
  onOpenSettings,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const getTabLabel = (tab: NavTab) => {
    switch (tab) {
      case 'dashboard': return '대시보드';
      case 'project-management': return '사업관리';
      case 'budget-management': return '예산관리';
      case 'participation-management': return '참여관리';
      case 'safety-management': return '안전관리';
      case 'performance-evaluation': return '성과관리';
      case 'alternative-comparison': return '대안비교';
      case 'reports-export': return '보고서';
      case 'system-administration': return '시스템관리';
    }
  };

  return (
    <header className="fixed top-0 left-72 right-0 h-16 bg-surface-container-lowest z-40 px-space-lg flex items-center justify-between border-b border-surface-container-high/60 shadow-xs">
      {/* Left zone: Breadcrumb + Year selector + Omnibar search */}
      <div className="flex items-center gap-space-lg">
        <div className="flex items-center gap-space-xs font-body-sm text-body-sm text-on-surface-variant">
          <span className="material-symbols-outlined text-sm">home</span>
          <span>행정지원포털</span>
          <span className="text-outline">/</span>
          <span>운영관리</span>
          <span className="text-outline">/</span>
          <span className="text-on-surface font-semibold">{getTabLabel(currentTab)}</span>
        </div>

        {/* Fiscal Year Filter Dropdown */}
        <div className="hidden xl:flex items-center gap-space-xs bg-surface-container-low px-space-sm py-1 border border-surface-container">
          <span className="font-label-code text-label-code text-on-surface-variant uppercase">
            회계연도
          </span>
          <select 
            value={currentYear}
            onChange={(e) => onYearChange(e.target.value)}
            className="bg-transparent font-headline-sm text-body-md text-primary font-bold focus:outline-none cursor-pointer pr-space-xs"
          >
            <option value="2027">2027 사업연도 [선택]</option>
            <option value="2026">2026 사업연도</option>
            <option value="2025">2025 사업연도</option>
          </select>
          <span className="font-label-code text-label-code bg-surface-container px-space-xs py-0.5 text-primary-container">
            예시 데이터 기준
          </span>
        </div>

        {/* Global Omnibar Search */}
        <div className="relative hidden lg:block w-72">
          <span className="material-symbols-outlined absolute left-space-sm top-2 text-outline text-lg">
            search
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="사업명, 연수단 ID, 문서 검색..."
            className="w-full h-9 pl-9 pr-space-sm bg-surface-container-low font-body-sm text-body-sm text-on-surface placeholder:text-outline focus:outline-none focus:bg-surface-container-lowest focus:ring-1 focus:ring-primary border border-transparent focus:border-primary"
          />
        </div>
      </div>

      {/* Right zone: Notifications, Help, Settings, Profile */}
      <div className="flex items-center gap-space-md">
        <div className="flex items-center gap-space-xs relative">
          {/* Notifications button */}
          <button
            type="button"
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative w-9 h-9 flex items-center justify-center text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface transition-colors"
            title="시스템 알림"
          >
            <span className="material-symbols-outlined text-xl">notifications</span>
            {actionItems.length > 0 && (
              <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-error text-on-error font-label-code text-label-code flex items-center justify-center font-bold">
                {actionItems.length}
              </span>
            )}
          </button>

          {/* Notifications Dropdown Panel */}
          {showNotifications && (
            <div className="absolute right-0 top-11 w-96 bg-surface-container-lowest border border-surface-container-high shadow-lg z-50 p-space-sm">
              <div className="flex items-center justify-between pb-space-xs border-b border-surface-container-low mb-space-xs">
                <span className="font-headline-sm text-body-md text-primary font-bold">
                  행정 우선 알림 ({actionItems.length}건)
                </span>
                <span className="font-label-code text-label-code text-outline">실시간 동기화</span>
              </div>
              <div className="space-y-space-xs max-h-80 overflow-y-auto">
                {actionItems.map((item) => (
                  <div 
                    key={item.id}
                    onClick={() => {
                      onSelectAction(item);
                      setShowNotifications(false);
                    }}
                    className="p-space-xs bg-surface-container-low/60 hover:bg-surface-container cursor-pointer transition-colors border-l-2 border-error"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-label-code text-label-code text-error font-bold">{item.badge}</span>
                      <span className="font-label-code text-label-code text-outline">{item.tag}</span>
                    </div>
                    <div className="font-body-sm text-primary font-bold text-xs mt-0.5">{item.title}</div>
                    <div className="text-[11px] text-on-surface-variant line-clamp-1">{item.description}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Help Manual Button */}
          <button
            type="button"
            onClick={onOpenHelp}
            className="w-9 h-9 flex items-center justify-center text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface transition-colors"
            title="업무 매뉴얼 / 도움말"
          >
            <span className="material-symbols-outlined text-xl">help_outline</span>
          </button>

          {/* System Settings Button */}
          <button
            type="button"
            onClick={onOpenSettings}
            className="w-9 h-9 flex items-center justify-center text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface transition-colors"
            title="시스템 환경설정"
          >
            <span className="material-symbols-outlined text-xl">settings</span>
          </button>
        </div>

        <div className="h-6 w-px bg-outline-variant"></div>

        {/* User Profile Bar */}
        <div className="flex items-center gap-space-sm relative">
          <img
            alt="김지현 장학관 프로필"
            className="w-8 h-8 rounded-full object-cover border border-outline-variant"
            src="https://lh3.googleusercontent.com/aida/AEtjO1UDEam6K8i61R-2cnrEZTy_-Vn42YXJtWCSo1Gdjky5Y_RAGHdADwxgWNuCSgGDTs2m71IBSrQYUo8muhQZsomD8EstXjRIlxO3nxhkUFlk1Uz9R54SRMYwYkApqnHEHUrsE8DoT8hr7l_bLLWiyKwyRWFo0ps9_WngrbC2YiMNyz_dgtQQbIZExnbZT2l-MjeudE7NbJJbLc8iF-yLPV7sRhQR7FbCHE07KyZhfoYOR6qbmV1BBgKi9Q"
          />
          <div className="flex flex-col text-left">
            <div className="flex items-center gap-space-xs">
              <span className="font-headline-sm text-body-md text-on-surface font-bold leading-none">
                김지현 장학관
              </span>
              <span className="font-label-code text-label-code bg-primary text-on-primary px-space-xs py-0.5">
                교육청 총괄 관리자
              </span>
            </div>
            <span className="font-label-code text-label-code text-on-surface-variant leading-none mt-1">
              세종교육청 진로교육과
            </span>
          </div>

          <button
            type="button"
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="w-8 h-8 flex items-center justify-center text-outline hover:text-error hover:bg-error-container/30 transition-colors ml-space-xs"
            title="사용자 메뉴"
          >
            <span className="material-symbols-outlined text-lg">logout</span>
          </button>

          {showUserMenu && (
            <div className="absolute right-0 top-11 w-52 bg-surface-container-lowest border border-surface-container-high shadow-lg z-50 p-space-xs">
              <div className="px-space-xs py-1 border-b border-surface-container-low font-body-sm text-xs text-outline">
                세종교육행정통합망 SSO 인증중
              </div>
              <button 
                onClick={() => {
                  alert('보안 규정에 따라 교육행정정보시스템(NEIS) 연계 세션이 유지됩니다.');
                  setShowUserMenu(false);
                }}
                className="w-full text-left px-space-xs py-1.5 text-xs text-primary hover:bg-surface-container-low font-medium"
              >
                세션 연장 (120분)
              </button>
              <button 
                onClick={() => {
                  alert('안전하게 로그아웃 절차가 완료되었습니다.');
                  setShowUserMenu(false);
                }}
                className="w-full text-left px-space-xs py-1.5 text-xs text-error hover:bg-error-container/20 font-bold"
              >
                보안 로그아웃
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
