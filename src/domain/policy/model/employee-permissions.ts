import { OrganizationId } from "@domain/organization/organization";
import {EmployeeCompanyPermission} from "@domain/policy/model/employee/employee-company-permission.enum";
import {EmployeeReviewPermission} from "@domain/policy/model/employee/employee-review-permission.enum";
import {EmployeeOrganizationPermission} from "@domain/policy/model/employee/employee-organization-permission.enum"; // Убедитесь в правильности пути

const GLOBAL_ORGANIZATION_KEY = '*'; // Глобальный ключ, используемый для Map

export class EmployeePermissions {
    constructor(
        private readonly _companies: EmployeeCompanyPermission[] = [],
        // Изменено на Map<string, T[]>
        private readonly _reviews: Map<string, EmployeeReviewPermission[]> = new Map(),
        private readonly _organizations: Map<string, EmployeeOrganizationPermission[]> = new Map(),
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
        companies: EmployeeCompanyPermission[],
        reviews: Map<string, EmployeeReviewPermission[]>,
        organizations: Map<string, EmployeeOrganizationPermission[]> ,
    ): EmployeePermissions {
        // Преобразуем Record<string, T[]> в Map<string, T[]> для конструктора
        const reviewsMap = new Map(Object.entries(reviews));
        const organizationsMap = new Map(Object.entries(organizations));

        return new EmployeePermissions(companies, reviewsMap, organizationsMap);
    }

    /**
     * @method owner
     * @description Создает экземпляр EmployeePermissions с полными "владельческими" правами
     * по всем категориям, используя глобальный ключ для разрешений на уровне организаций и отзывов.
     * @returns Экземпляр EmployeePermissions с правами владельца.
     */
    static owner(): EmployeePermissions {
        const allCompanyPermissions: EmployeeCompanyPermission[] = Object.values(EmployeeCompanyPermission);
        const allReviewPermissions: EmployeeReviewPermission[] = Object.values(EmployeeReviewPermission);
        const allOrganizationPermissions: EmployeeOrganizationPermission[] = Object.values(EmployeeOrganizationPermission);

        // Инициализируем Map'ы с глобальным ключом
        const reviewsMap = new Map<string, EmployeeReviewPermission[]>([[GLOBAL_ORGANIZATION_KEY, allReviewPermissions]]);
        const organizationsMap = new Map<string, EmployeeOrganizationPermission[]>([[GLOBAL_ORGANIZATION_KEY, allOrganizationPermissions]]);

        return new EmployeePermissions(
            allCompanyPermissions,
            reviewsMap,
            organizationsMap
        );
    }

    /**
     * @method toPlainObject
     * @description Преобразует экземпляр EmployeePermissions в простой JS-объект (Record<string, string[]>)
     * для сериализации (например, в JSON или для сохранения в БД).
     * @returns Простой JS-объект, представляющий разрешения.
     */
    public toPlainObject(): {
        companies: string[];
        reviews: Record<string, string[]>;
        organizations: Record<string, string[]>;
    } {
        return {
            companies: this._companies,
            // Преобразуем Map обратно в Record для сериализации
            reviews: Object.fromEntries(this._reviews.entries()) as Record<string, string[]>,
            organizations: Object.fromEntries(this._organizations.entries()) as Record<string, string[]>,
        };
    }

    // --- Геттеры для доступа к данным ---
    // Они теперь возвращают Map<string, T[]>
    public get companies(): EmployeeCompanyPermission[] {
        return this._companies;
    }

    public get reviews(): Map<string, EmployeeReviewPermission[]> {
        return this._reviews;
    }

    public get organizations(): Map<string, EmployeeOrganizationPermission[]> {
        return this._organizations;
    }

    // --- Методы проверки прав ---

    /**
     * @method hasCompanyPermission
     * @description Проверяет, имеет ли сотрудник указанное разрешение на уровне компании.
     * @param permission Проверяемое разрешение.
     * @returns true, если разрешение есть, иначе false.
     */
    public hasCompanyPermission(permission: EmployeeCompanyPermission): boolean {
        return this._companies.includes(permission);
    }

    /**
     * @method hasOrganizationPermission
     * @description Проверяет, имеет ли сотрудник указанное разрешение для конкретной организации.
     * Учитывает наличие глобальных разрешений.
     * @param orgId ID организации.
     * @param permission Проверяемое разрешение.
     * @returns true, если разрешение есть, иначе false.
     */
    public hasOrganizationPermission(orgId: OrganizationId, permission: EmployeeOrganizationPermission): boolean {
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
    public hasReviewPermission(orgId: OrganizationId, permission: EmployeeReviewPermission): boolean {
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

    public grantCompanyPermission(permission: EmployeeCompanyPermission): EmployeePermissions {
        const newCompanies = new Set(this._companies);
        newCompanies.add(permission);
        return new EmployeePermissions(
            Array.from(newCompanies),
            this._reviews, // Map передается по ссылке, но его содержимое не изменяется
            this._organizations // Map передается по ссылке, но его содержимое не изменяется
        );
    }

    public grantOrganizationPermission(orgId: OrganizationId, permission: EmployeeOrganizationPermission): EmployeePermissions {
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

        return new EmployeePermissions(
            this._companies,
            this._reviews,
            newOrganizations
        );
    }

    public grantReviewPermission(orgId: OrganizationId, permission: EmployeeReviewPermission): EmployeePermissions {
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

        return new EmployeePermissions(
            this._companies,
            newReviews,
            this._organizations
        );
    }

    public revokeCompanyPermission(permission: EmployeeCompanyPermission): EmployeePermissions {
        const newCompanies = new Set(this._companies);
        newCompanies.delete(permission);
        return new EmployeePermissions(
            Array.from(newCompanies),
            this._reviews,
            this._organizations
        );
    }

    public revokeOrganizationPermission(orgId: OrganizationId, permission: EmployeeOrganizationPermission): EmployeePermissions {
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

        return new EmployeePermissions(
            this._companies,
            this._reviews,
            newOrganizations
        );
    }

    public revokeReviewPermission(orgId: OrganizationId, permission: EmployeeReviewPermission): EmployeePermissions {
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

        return new EmployeePermissions(
            this._companies,
            newReviews,
            this._organizations
        );
    }
}
