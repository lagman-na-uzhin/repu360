export enum EmployeeOrganizationPermission {
    READ_ORGANIZATION_SETTINGS = 'read_organization_settings',
    UPDATE_ORGANIZATION_SETTINGS = 'update_organization_settings', // Может быть, только для менеджеров
    MANAGE_ORGANIZATION_MEMBERS = 'manage_organization_members', // Может быть, только для менеджеров
}
