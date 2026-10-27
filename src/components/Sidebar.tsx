import React from 'react';
import { NavTab } from '../types';

interface SidebarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  unresolvedSafetyCount?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  unresolvedSafetyCount = 2,
}) => {
  const navItems = [
    { id: 'dashboard' as NavTab, label: '대시보드', icon: 'dashboard', badge: 'SYS' },
    { id: 'project-management' as NavTab, label: '사업관리', icon: 'folder_open' },
    { id: 'budget-management' as NavTab, label: '예산관리', icon: 'payments', badge: 'FY27', badgeStyle: 'text-surface-variant font-semibold' },
    { id: 'participation-management' as NavTab, label: '참여관리', icon: 'groups' },
    { 
      id: 'safety-management' as NavTab, 
      label: '안전관리', 
      icon: 'health_and_safety', 
      badge: `${unresolvedSafetyCount}건 미완료`, 
      badgeStyle: 'bg-error text-on-error font-bold' 
    },
    { id: 'performance-evaluation' as NavTab, label: '성과관리', icon: 'query_stats' },
    { id: 'alternative-comparison' as NavTab, label: '대안비교', icon: 'compare_arrows' },
    { id: 'reports-export' as NavTab, label: '보고서', icon: 'description' },
    { id: 'system-administration' as NavTab, label: '시스템관리', icon: 'admin_panel_settings' },
  ];

  return (
    <aside className="fixed left-0 top-0 h-full w-72 bg-primary text-on-primary z-50 flex flex-col justify-between select-none border-r border-[#00174b]/40">
      <div className="flex flex-col flex-1 min-h-0">
        {/* Brand Header */}
        <div 
          onClick={() => onSelectTab('dashboard')}
          className="h-16 px-space-lg flex items-center gap-space-md bg-primary-container shrink-0 cursor-pointer border-b border-[#00174b]/50 hover:bg-[#133257] transition-colors"
        >
          <div className="w-9 h-9 bg-surface-container-lowest flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-primary text-xl">account_balance</span>
          </div>
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-space-xs">
              <span className="font-headline-sm text-headline-sm text-surface truncate tracking-tight font-bold">
                글로벌 진로탐험대 NEXT
              </span>
            </div>
            <span className="font-label-code text-label-code text-on-primary-container truncate">
              세종특별자치시교육청 행정지원포털
            </span>
          </div>
        </div>

        {/* Live Channel Status Strip */}
        <div className="px-space-md py-space-sm bg-surface-container/10 flex items-center justify-between shrink-0 border-b border-primary-container/80">
          <span className="font-label-code text-label-code text-on-primary-container uppercase tracking-wider">
            기관망 직통 채널
          </span>
          <span className="inline-flex items-center gap-space-2xs font-label-code text-label-code text-tertiary-fixed">
            <span className="w-1.5 h-1.5 bg-tertiary-fixed rounded-full animate-pulse"></span>
            ONLINE
          </span>
        </div>

        {/* Navigation Items List */}
        <nav className="flex-1 overflow-y-auto px-space-xs py-space-xs space-y-space-2xs">
          {navItems.map((item) => {
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`w-full flex items-center justify-between px-space-md py-space-sm transition-colors text-left ${
                  isActive
                    ? 'bg-primary-container text-surface-bright font-bold border-l-2 border-secondary'
                    : 'text-on-primary-container hover:bg-primary-container/60 hover:text-surface'
                }`}
              >
                <div className="flex items-center gap-space-md">
                  <span className={`material-symbols-outlined text-lg ${isActive ? 'text-surface-bright' : 'text-on-primary-container'}`}>
                    {item.icon}
                  </span>
                  <span className="font-body-md text-body-md tracking-tight">
                    {item.label}
                  </span>
                </div>
                {item.badge && (
                  <span className={`font-label-code text-label-code px-space-xs py-0.5 ${
                    item.badgeStyle ? item.badgeStyle : 'bg-surface/10 text-surface'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Persistent Bottom Status Information */}
      <div className="p-space-md bg-primary-container shrink-0 space-y-space-xs border-t border-[#00174b]/60">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-space-xs">
            <span className="w-2 h-2 bg-on-tertiary-container rounded-full"></span>
            <span className="font-body-sm text-body-sm text-surface font-semibold">통합행정망 정상가동중</span>
          </div>
          <span className="font-label-code text-label-code text-on-primary-container">v2.4.1</span>
        </div>
        <div className="flex items-center justify-between font-label-code text-label-code text-on-primary-container pt-space-2xs">
          <span className="truncate">교육청 통합데이터연계</span>
          <span className="text-tertiary-fixed font-bold">SYNC OK</span>
        </div>
      </div>
    </aside>
  );
};
