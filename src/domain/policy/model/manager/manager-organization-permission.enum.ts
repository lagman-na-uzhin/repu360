export enum ManagerOrganizationPermission {
    /** Чтение всех настроек организации, включая конфиденциальные. */
    READ_ORGANIZATION_SETTINGS = 'read_organization_settings',
    /** Изменение всех настроек организации. */
    UPDATE_ORGANIZATION_SETTINGS = 'update_organization_settings',
    /** Управление членами организации (добавление, удаление, изменение ролей). */
    MANAGE_ORGANIZATION_MEMBERS = 'manage_organization_members',
    /** Создание новых организаций. */
    CREATE_ORGANIZATION = 'create_organization',
    /** Удаление организаций. */
    DELETE_ORGANIZATION = 'delete_organization',
    /** Просмотр финансовой информации конкретной организации. */
    VIEW_ORGANIZATION_FINANCE = 'view_organization_finance',
    /** Управление шаблонами и настройками для конкретной организации. */
    MANAGE_ORGANIZATION_TEMPLATES = 'manage_organization_templates',
}
