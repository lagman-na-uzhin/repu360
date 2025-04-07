import {Resources} from "@domain/company/types/company-resources.const";

type CompanyDataSyncPermissions = 'UPDATE_PLACEMENT_DATA';
type ReviewSyncPermissions = 'READ';
type MultiAccessPermissions = 'CREATE_EMPLOYEE' | 'CREATE_ROLE';
type RegisterPlacementPermissions = 'REGISTER_NEW';
type ReviewReplyPermissions = 'CREATE' | 'UPDATE' | 'DELETE';
type ReviewAutoReplyPermissions = 'ACTIVATE' | 'DEACTIVATE';
type ReviewComplaintPermissions = 'CREATE' | 'UPDATE' | 'DELETE';
type ReviewAutoComplaintPermissions = 'ACTIVATE' | 'DEACTIVATE';
type AnalysisReviewPermissions = 'READ';
type AnalysisByRadiusPermissions = 'READ';
type AnalysisCompetitorPermissions = 'READ';


export const EmployeePermissions: Resources<string[]> = {
    companyDataSync: ['UPDATE_PLACEMENT_DATA'] as CompanyDataSyncPermissions[],
    reviewSync: ['READ'] as ReviewSyncPermissions[],
    multiAccess: ['CREATE_EMPLOYEE', 'CREATE_ROLE'] as MultiAccessPermissions[],
    registerPlacement: ['REGISTER_NEW'] as RegisterPlacementPermissions[],
    reviewReply: ['CREATE', 'UPDATE', 'DELETE'] as ReviewReplyPermissions[],
    reviewAutoReply: ['ACTIVATE', 'DEACTIVATE'] as ReviewAutoReplyPermissions[],
    reviewComplaint: ['CREATE', 'UPDATE', 'DELETE'] as ReviewComplaintPermissions[],
    reviewAutoComplaint: ['ACTIVATE', 'DEACTIVATE'] as ReviewAutoComplaintPermissions[],
    analysisReview: ['READ'] as AnalysisReviewPermissions[],
    analysisByRadius: ['READ'] as AnalysisByRadiusPermissions[],
    analysisCompetitor: ['READ'] as AnalysisCompetitorPermissions[],
};


export type PermissionResource = keyof typeof EmployeePermissions;

export type PermissionAction<T extends PermissionResource> = typeof EmployeePermissions[T][number];

