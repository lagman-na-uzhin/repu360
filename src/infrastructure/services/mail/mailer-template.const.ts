
const linkToLogin =
    '<div>Ссылка для входа: <a href="https://1.leaders.kz">Войти</a></div>';

export const MAIL_TEMPLATES = {
    EMPLOYEE_CREATED_PASSWORD: {
        title: 'LEADERS: Восстановление пароля',
        body:
            '<strong>Вы сделали восстановление пароля.</strong>' +
            '<div>Данные для входа:</div>' +
            '<div>Эл. почта: <%= mail %></div>' +
            '<div>Новый пароль: <%= newPassword %></div>' +
            linkToLogin,
    },
};
