import { Container } from 'typedi';

import { SQSService } from './services/SQSService';
// import { ActiveMQService } from './services/ActiveMQService';
// import { RabbitMQService } from './services/RabbitMQService';

const selectedService = SQSService;

export function send_message(env: any): any {
    const body = {
        method: 'POST',
        message: 'http://url/endpoint?test=1',
    };
    const queueManager = Container.get(selectedService);
    return queueManager.send_message(env, body);
}

export function get_message(env: any): any {
    const queueManager = Container.get(selectedService);
    return queueManager.get_message(env);
}
