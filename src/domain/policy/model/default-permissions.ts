import { OrganizationId } from "@domain/organization/organization";
import {DefaultCompanyPermission} from "@domain/policy/model/default/default-company-permission.enum";
import {DefaultReviewPermission} from "@domain/policy/model/default/default-review-permission.enum";
import {DefaultOrganizationPermission} from "@domain/policy/model/default/default-organization-permission.enum";
import {DefaultEmployeePermission} from "@domain/policy/model/default/default-employee-permission.enum"; // Убедитесь в правильности пути

export const GLOBAL_ORGANIZATION_KEY = '*'; // Глобальный ключ, используемый для Map
export const DEFAULT_PERMISSIONS_MODULE = {
        COMPANIES: "COMPANIES",
        EMPLOYEE: "EMPLOYEE",
        ORGANIZATION: "ORGANIZATION",
        PLACEMENT: "PLACEMENT",
        REVIEW: "REVIEW",
        SUBSCRIPTION: "SUBSCRIPTION"
} as const;

export class DefaultPermissions {
    constructor(
        private readonly _companies: DefaultCompanyPermission[] = [],
        private readonly _employees: DefaultEmployeePermission[] = [],
        private readonly _reviews: Map<string, DefaultReviewPermission[]> = new Map(),
        private readonly _organizations: Map<string, DefaultOrganizationPermission[]> = new Map(),
    ) {}

    /**
     * @method fromPersistence
     * @description Создает экземпляр EmployeePermissions из "плоского" персистентного представления (Record<string, T[]>).
     * @param companies Массив строковых разрешений компаний.
     * @param reviews Объект Record, маппирующий строковые ID организаций на массивы строковых разрешений отзывов.
     * @param organizations Объект Record, маппирующий строковые ID организаций на массивы строковых разрешений организаций.
     * @returns Экземпляр EmployeePermissions.
     */
    static fromPersistence(
        companies: DefaultCompanyPermission[],
        employees: DefaultEmployeePermission[],
        reviews: Map<string, DefaultReviewPermission[]>,
        organizations: Map<string, DefaultOrganizationPermission[]>,
    ): DefaultPermissions {
        return new DefaultPermissions(companies, employees, reviews, organizations);
    }
    /**
     * @method owner
     * @description Создает экземпляр EmployeePermissions с полными "владельческими" правами
     * по всем категориям, используя глобальный ключ для разрешений на уровне организаций и отзывов.
     * @returns Экземпляр EmployeePermissions с правами владельца.
     */
    static owner(): DefaultPermissions {
        const allCompanyPermissions: DefaultCompanyPermission[] = Object.values(DefaultCompanyPermission);
        const allEmployeePermissions: DefaultEmployeePermission[] = Object.values(DefaultEmployeePermission);
        const allReviewPermissions: DefaultReviewPermission[] = Object.values(DefaultReviewPermission);
        const allOrganizationPermissions: DefaultOrganizationPermission[] = Object.values(DefaultOrganizationPermission);

        // Инициализируем Map'ы с глобальным ключом
        const reviewsMap = new Map<string, DefaultReviewPermission[]>([[GLOBAL_ORGANIZATION_KEY, allReviewPermissions]]);
        const organizationsMap = new Map<string, DefaultOrganizationPermission[]>([[GLOBAL_ORGANIZATION_KEY, allOrganizationPermissions]]);

        return new DefaultPermissions(
            allCompanyPermissions,
            allEmployeePermissions,
            reviewsMap,
            organizationsMap
        );
    }

    // --- Геттеры для доступа к данным ---
    // Они теперь возвращают Map<string, T[]>
    public get companies(): DefaultCompanyPermission[] {
        return this._companies;
    }

    public get reviews(): Map<string, DefaultReviewPermission[]> {
        return this._reviews;
    }

    public get organizations(): Map<string, DefaultOrganizationPermission[]> {
        return this._organizations;
    }

    public get employees(): DefaultEmployeePermission[] {
        return this._employees;
    }

    // --- Методы проверки прав ---

    /**
     * @method hasCompanyPermission
     * @description Проверяет, имеет ли сотрудник указанное разрешение на уровне компании.
     * @param permission Проверяемое разрешение.
     * @returns true, если разрешение есть, иначе false.
     */
    public hasCompanyPermission(permission: DefaultCompanyPermission): boolean {
        return this._companies.includes(permission);
    }

    public hasEmployeePermission(permission: DefaultEmployeePermission): boolean {
        return this._employees.includes(permission);
    }
    /**
     * @method hasOrganizationPermission
     * @description Проверяет, имеет ли сотрудник указанное разрешение для конкретной организации.
     * Учитывает наличие глобальных разрешений.
     * @param orgId ID организации.
     * @param permission Проверяемое разрешение.
     * @returns true, если разрешение есть, иначе false.
     */
    public hasOrganizationPermission(orgId: OrganizationId, permission: DefaultOrganizationPermission): boolean {
        // Сначала проверяем глобальное разрешение в Map
        if (this._organizations.has(GLOBAL_ORGANIZATION_KEY) && this._organizations.get(GLOBAL_ORGANIZATION_KEY)?.includes(permission)) {
            return true;
        }
        // Затем проверяем разрешение для конкретной организации по ее строковому ID
        const orgPermissions = this._organizations.get(orgId.toString());
        return orgPermissions ? orgPermissions.includes(permission) : false;
    }

    /**
     * @method hasReviewPermission
     * @description Проверяет, имеет ли сотрудник указанное разрешение для отзыва в конкретной организации.
     * Учитывает наличие глобальных разрешений.
     * @param orgId ID организации, к которой относится отзыв.
     * @param permission Проверяемое разрешение.
     * @returns true, если разрешение есть, иначе false.
     */
    public hasReviewPermission(orgId: OrganizationId, permission: DefaultReviewPermission): boolean {
        // Сначала проверяем глобальное разрешение в Map
        if (this._reviews.has(GLOBAL_ORGANIZATION_KEY) && this._reviews.get(GLOBAL_ORGANIZATION_KEY)?.includes(permission)) {
            return true;
        }
        // Затем проверяем разрешение для конкретной организации по ее строковому ID
        const reviewPermissions = this._reviews.get(orgId.toString());
        return reviewPermissions ? reviewPermissions.includes(permission) : false;
    }

    // --- Методы для предоставления/отзыва разрешений (возвращают новый экземпляр) ---
    // Эти методы также должны работать с Map и создавать новые экземпляры, сохраняя иммутабельность.

    public grantCompanyPermission(permission: DefaultCompanyPermission): DefaultPermissions {
        const newCompanies = new Set(this._companies);
        newCompanies.add(permission);
        return new DefaultPermissions(
            Array.from(newCompanies),
            this._employees,
            this._reviews, // Map передается по ссылке, но его содержимое не изменяется
            this._organizations // Map передается по ссылке, но его содержимое не изменяется
        );
    }

    public grantOrganizationPermission(orgId: OrganizationId, permission: DefaultOrganizationPermission): DefaultPermissions {
        // Если уже есть глобальное разрешение на этот тип, нет смысла добавлять конкретное
        if (this._organizations.has(GLOBAL_ORGANIZATION_KEY) && this._organizations.get(GLOBAL_ORGANIZATION_KEY)?.includes(permission)) {
            return this;
        }

        const orgIdString = orgId.toString();
        // Создаем новый Map, чтобы не мутировать существующий
        const newOrganizations = new Map(this._organizations);
        const currentOrgPermissions = new Set(newOrganizations.get(orgIdString) || []);
        currentOrgPermissions.add(permission);
        newOrganizations.set(orgIdString, Array.from(currentOrgPermissions));

        return new DefaultPermissions(
            this._companies,
            this._employees,
            this._reviews,
            newOrganizations
        );
    }

    public grantReviewPermission(orgId: OrganizationId, permission: DefaultReviewPermission): DefaultPermissions {
        // Если уже есть глобальное разрешение на этот тип, нет смысла добавлять конкретное
        if (this._reviews.has(GLOBAL_ORGANIZATION_KEY) && this._reviews.get(GLOBAL_ORGANIZATION_KEY)?.includes(permission)) {
            return this;
        }

        const orgIdString = orgId.toString();
        // Создаем новый Map
        const newReviews = new Map(this._reviews);
        const currentReviewPermissions = new Set(newReviews.get(orgIdString) || []);
        currentReviewPermissions.add(permission);
        newReviews.set(orgIdString, Array.from(currentReviewPermissions));

        return new DefaultPermissions(
            this._companies,
            this._employees,
            newReviews,
            this._organizations
        );
    }

    public revokeCompanyPermission(permission: DefaultCompanyPermission): DefaultPermissions {
        const newCompanies = new Set(this._companies);
        newCompanies.delete(permission);
        return new DefaultPermissions(
            Array.from(newCompanies),
            this._employees,
            this._reviews,
            this._organizations
        );
    }

    public revokeOrganizationPermission(orgId: OrganizationId, permission: DefaultOrganizationPermission): DefaultPermissions {
        // Нельзя отозвать, если есть глобальное разрешение
        if (this._organizations.has(GLOBAL_ORGANIZATION_KEY) && this._organizations.get(GLOBAL_ORGANIZATION_KEY)?.includes(permission)) {
            console.warn(`Attempted to revoke global organization permission for ${permission}. This operation is ignored.`);
            return this;
        }

        const orgIdString = orgId.toString();
        const newOrganizations = new Map(this._organizations); // Создаем новый Map
        if (newOrganizations.has(orgIdString)) {
            const currentOrgPermissions = new Set(newOrganizations.get(orgIdString)!);
            currentOrgPermissions.delete(permission);
            newOrganizations.set(orgIdString, Array.from(currentOrgPermissions));
        }

        return new DefaultPermissions(
            this._companies,
            this._employees,
            this._reviews,
            newOrganizations
        );
    }

    public revokeReviewPermission(orgId: OrganizationId, permission: DefaultReviewPermission): DefaultPermissions {
        if (this._reviews.has(GLOBAL_ORGANIZATION_KEY) && this._reviews.get(GLOBAL_ORGANIZATION_KEY)?.includes(permission)) {
            console.warn(`Attempted to revoke global review permission for ${permission}. This operation is ignored.`);
            return this;
        }

        const orgIdString = orgId.toString();
        const newReviews = new Map(this._reviews); // Создаем новый Map
        if (newReviews.has(orgIdString)) {
            const currentReviewPermissions = new Set(newReviews.get(orgIdString)!);
            currentReviewPermissions.delete(permission);
            newReviews.set(orgIdString, Array.from(currentReviewPermissions));
        }

        return new DefaultPermissions(
            this._companies,
            this._employees,
            newReviews,
            this._organizations
        );
    }

}
