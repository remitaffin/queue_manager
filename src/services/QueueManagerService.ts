import 'reflect-metadata';
import { Inject, Service } from 'typedi';

// import { SQSHelper } from '../helpers/SQSHelper';
import { ActiveMQHelper } from '../helpers/ActiveMQHelper';
// import { RabbitMQHelper } from '../helpers/RabbitMQHelper';

export interface BaseQueue {
    send_message(env: any, body: any): boolean;
    get_message(env: any): any;
}

@Service()
export class QueueManagerService implements BaseQueue {
    @Inject()
    private helper: ActiveMQHelper;

    public send_message(env: any, body: any): any {
        return this.helper.send_message(env, body);
    }

    public get_message(env: any): any {
        return this.helper.get_message(env);
    }
}
