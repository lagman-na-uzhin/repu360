export class TwogisCabinetCredentials {
    private readonly _login: string;
    private readonly _password: string;

    constructor(login: string, password: string) {
        const trimmedLogin = login?.trim();
        const trimmedPassword = password?.trim();

        if (!trimmedLogin || trimmedLogin.length < 3) {
            throw new Error('Login must be at least 3 characters long.');
        }

        if (!trimmedPassword || trimmedPassword.length < 6) {
            throw new Error('Password must be at least 6 characters long.');
        }

        this._login = trimmedLogin;
        this._password = trimmedPassword;
    }

    get login() {
        return this._login;
    }

    get password() {
        return this._password;
    }

    get credentials(): {login: string, password: string} {
        return {login: this._login, password: this._password};
    }
}
