export class AddOrganizationCommand {
    constructor(
        public readonly partnerId: string,
        public readonly name: string,
    ) {
    }
}
