export class Notification {

    constructor(message, type) {
        this.message = message;
        this.type = type;

    }

    static types =
    {
        SUCCESS: 'success',
        WARNING: 'warning',
        ERROR: 'danger'
    };

    message: string;
    type: string;


}

