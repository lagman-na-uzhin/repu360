import {IEmployeeRepository} from "@domain/employee/repositories/employee-repository.interface";
import {IRoleRepository} from "@domain/policy/repositories/role-repository.interface";
import {IReviewRepository} from "@domain/review/repositories/review-repository.interface";
import {IProfileRepository} from "@domain/review/repositories/profile-repository.interface";
import {ILeadRepository} from "@domain/lead/repositories/lead-repository.interface";
import {ICompanyRepository} from "@domain/company/repositories/company-repository.interface";

export interface IUnitOfWork {
    run<T>(work: (ctx: IUnitOfWorkContext) => Promise<T>): Promise<T>;
}


export interface IUnitOfWorkContext {
    roleRepo: IRoleRepository;
    employeeRepo: IEmployeeRepository;
    reviewRepo: IReviewRepository;
    profileRepo: IProfileRepository;
    leadRepo: ILeadRepository;
    companyRepo: ICompanyRepository;
}
