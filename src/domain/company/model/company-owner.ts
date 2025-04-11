// import {UniqueID} from "@domain/common/unique-id";
// import {OwnerEmail} from "@domain/company/value-object/owner-email.vo";
// import {OwnerName} from "@domain/company/value-object/owner-name.vo";
// import {OwnerPhone} from "@domain/company/value-object/owner-phone.vo";
// import {OwnerPassword} from "@domain/company/value-object/owner-password.vo";
//
// export class CompanyOwnerId extends UniqueID {}
//
// export class CompanyOwner {
//     private constructor(
//         private readonly _id: CompanyOwnerId,
//         private _name: OwnerName,
//         private _email: OwnerEmail,
//         private _phone: OwnerPhone,
//         private _password: OwnerPassword,
//         private _avatar: string | null,
//
//         private readonly _createdAt: Date = new Date(),
//         private _updatedAt: Date | null = null,
//         private _deletedAt: Date | null = null
//     ) {}
//
//     static create(
//         name: OwnerName,
//         email: OwnerEmail,
//         phone: OwnerPhone,
//         password: OwnerPassword,
//         avatar: string | null
//     ) {
//         return new CompanyOwner(new CompanyOwnerId(), name, email, phone, password, avatar);
//     }
// }
