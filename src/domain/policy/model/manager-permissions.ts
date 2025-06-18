import {ManagerOrganizationPermission} from "@domain/policy/model/manager/manager-organization-permission.enum";
import {ManagerLeadPermission} from "@domain/policy/model/manager/manager-lead-permission.enum";
import {OrganizationId} from "@domain/organization/organization";
import {ManagerCompanyPermission} from "@domain/policy/model/manager/manager-company.permission.enum";

const GLOBAL_ORGANIZATION_KEY = '*';

export class ManagerPermissions {
    constructor(
        private readonly _companies: ManagerCompanyPermission[],
        private readonly _organizations: Map<string, ManagerOrganizationPermission[]>,
        private readonly _leads: ManagerLeadPermission[],
    ) {}

    static fromPersistence(
        companies: ManagerCompanyPermission[],
        organizations: Map<string, ManagerOrganizationPermission[]>,
        leads: ManagerLeadPermission[],
    ): ManagerPermissions {
        return new ManagerPermissions(companies, organizations, leads);
    }

    static admin(): ManagerPermissions {
        const allCompanyPermissions: ManagerCompanyPermission[] = Object.values(ManagerCompanyPermission) as ManagerCompanyPermission[];
        const allOrganizationPermissions: ManagerOrganizationPermission[] = Object.values(ManagerOrganizationPermission) as ManagerOrganizationPermission[];
        const allLeadPermissions: ManagerLeadPermission[] = Object.values(ManagerLeadPermission) as ManagerLeadPermission[];

        const organizationsMap = new Map<string, ManagerOrganizationPermission[]>([[GLOBAL_ORGANIZATION_KEY, allOrganizationPermissions]]);

        return new ManagerPermissions(
            allCompanyPermissions,
            organizationsMap,
            allLeadPermissions
        );
    }

    public toPlainObject(): {
        companies: string[];
        organizations: Record<string, string[]>;
        leads: string[];
    } {
        return {
            companies: this._companies,
            organizations: Object.fromEntries(this._organizations.entries()) as Record<string, string[]>,
            leads: this._leads,
        };
    }

    public hasOrganizationPermission(orgId: OrganizationId, permission: ManagerOrganizationPermission): boolean {
        if (this._organizations[GLOBAL_ORGANIZATION_KEY]?.includes(permission)) {
            return true;
        }
        const orgPermissions = this.organizations[orgId.toString()];
        return orgPermissions ? orgPermissions.includes(permission) : false;
    }

    public hasCompanyPermission(permission: ManagerCompanyPermission): boolean {
        return this._companies.includes(permission);

    }

    public hasLeadPermission(orgId: OrganizationId | "*", permission: ManagerLeadPermission): boolean {
        if (this._leads["*"]?.includes(permission)) {
            return true;
        }
        const leadPermissions = this._leads[orgId.toString()];
        return leadPermissions ? leadPermissions.includes(permission) : false;
    }

    get companies() {
        return this._companies;
    }

    get organizations() {
        return this._organizations;
    }

    get leads() {
        return this._leads;
    }
}
