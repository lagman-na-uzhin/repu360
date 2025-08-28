interface FillialCreatedPayload {
    userId: string;
    name: string;
    email: string;
}

/**
 * Доменное событие, представляющее регистрацию нового пользователя.
 * Это чистый объект данных, который описывает произошедшее событие.
 * Он не содержит логики, связанной с инфраструктурой (например, с очередями).
 */
class UserRegisteredEvent {
    public readonly name: string = 'fillial_created';

    public readonly payload: FillialCreatedPayload;

    public readonly timestamp: Date;

    constructor(userId: string, name: string, email: string) {
        this.payload = { userId, name, email };
        this.timestamp = new Date();
    }
}
