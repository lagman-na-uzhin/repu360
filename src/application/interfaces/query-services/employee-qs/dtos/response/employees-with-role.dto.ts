// src/application/queries/dtos/qs-employee-with-role.dto.ts

export interface QSEmployeeWithRoleDto {
    id: string;
    name: string; // <-- Изменено: У вас 'name' в UserEntity, а не firstName/lastName
    email: string;
    phone: string; // <-- Добавлено из UserEntity
    avatar: string | null; // <-- Добавлено из UserEntity
    companyId: string | null; // <-- Добавлено из UserEntity

    // Поля роли, могут быть null из-за LEFT JOIN
    roleId: string; // Это поле гарантированно будет, т.к. оно в UserEntity
    roleName: string | null;       // <-- Сделано `null`able
    roleDescription: string | null; // <-- Сделано `null`able

    // Поля дат
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null; // <-- Добавлено из UserEntity
}
