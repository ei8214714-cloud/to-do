export type NavTab = 
  | 'dashboard' 
  | 'project-management' 
  | 'budget-management' 
  | 'participation-management' 
  | 'safety-management' 
  | 'performance-evaluation' 
  | 'alternative-comparison' 
  | 'reports-export' 
  | 'system-administration';

export interface ProjectItem {
  id: string;
  code: string;
  title: string;
  type: string;
  destination: string;
  period: string;
  startDate: string;
  endDate: string;
  participants: number;
  status: '계획수립' | '예산검토' | '안전심의' | '운영중' | '운영승인완료' | '정산완료' | '계획승인';
  totalBudget: number;
  allocatedBudget?: number;
  department: string;
  manager: string;
  managerContact: string;
  purpose: string;
  background: string;
  targetInfo: string;
  hostOrgs: string;
  approvalDocNum: string;
  escortProofDoc: string;
  updatedAt: string;
  schoolType?: string;
  highSchoolCount?: number;
  middleSchoolCount?: number;
}

export interface BudgetItem {
  id: string;
  category: string;
  name: string;
  basis: string;
  unitPrice: number;
  quantity: number;
  unit: string;
  plannedTotal: number;
  executedAmount: number;
  balance: number;
  status: string;
  statusType: 'normal' | 'pending' | 'warning' | 'approved';
  comment?: string;
}

export interface SafetyItem {
  id: string;
  name: string;
  criteria: string;
  assignee: string;
  scheduledDate: string;
  status: '조치 필요' | '미점검' | '점검 완료' | '조치 완료';
  actionDetails: string;
  verifiedDate?: string;
  attachmentName?: string;
}

export interface ActionItem {
  id: string;
  type: 'danger' | 'warning' | 'info';
  badge: string;
  tag: string;
  actionText: string;
  title: string;
  description: string;
  assignee: string;
  deadlineText: string;
  targetTab?: NavTab;
  projectId?: string;
}

export interface KCDIDimension {
  name: string;
  code: string;
  preScore: number;
  postScore: number;
  delta: number;
  percentPre: number;
  percentPost: number;
}
