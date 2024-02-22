class CustomErrors extends Error {
    public statusCode: number;
    constructor(message: string, statusCode: number) {
        super(message)
        this.statusCode = statusCode;
    }
}

class EmailNotValid extends CustomErrors {
    constructor() {
        super("Endereço de Email inválido.", 400);
    }
}

class PasswordNotValid extends CustomErrors {
    constructor() {
        super("Corpo da senha inválido.", 400);
    }
}

class PasswordTooSmall extends CustomErrors {
    constructor() {
        super("Senha pequena demais. Faça uma maior!", 403);
    }
}

class ExpiredVerificationCode extends CustomErrors {
    constructor() {
        super("Código de Verificação expirado. Solicite novamente", 410);
    }
}

class EmailVerified extends CustomErrors {
    constructor() {
        super("Email já verificado.", 400);
    }
}

class EmailAlreadyRegistered extends CustomErrors {
    constructor() {
        super("Email já registrado.", 400);
    }
}

class InvalidCode extends CustomErrors {
    constructor() {
        super("Código de verificação inválido.", 400);
    }
}

class InvalidCPF extends CustomErrors {
    constructor() {
        super("Número de CPF inválido.", 400);
    }
}

class InvalidCredencials extends CustomErrors {
    constructor() {
        super("Email ou senha inválidos.", 405);
    }
}

class ActionNotAllowed extends CustomErrors {
    constructor() {
        super("Ação não permitida.", 405);
    }
}

class UserNotFound extends CustomErrors {
    constructor() {
        super("Usuário não encontrado.", 404);
    }
}

class LoginRequired extends CustomErrors {
    constructor() {
        super("É necessário fazer login para realizar essa ação.", 400);
    }
}

export {
    CustomErrors,
    EmailNotValid,
    ExpiredVerificationCode,
    EmailVerified,
    EmailAlreadyRegistered,
    InvalidCode,
    InvalidCPF,
    InvalidCredencials,
    ActionNotAllowed,
    UserNotFound,
    LoginRequired,
    PasswordNotValid,
    PasswordTooSmall,
}