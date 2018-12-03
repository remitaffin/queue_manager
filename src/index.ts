import { Container } from 'typedi';

// import { SQSService as QueueService } from './services/SQSService';
// import { ActiveMQService as QueueService } from './services/ActiveMQService';
import { RabbitMQService as QueueService } from './services/RabbitMQService';

export function send_message(env: any): any {
    const body = {
        method: 'POST',
        message: 'http://url/endpoint?test=1',
    };
    const queueManager = Container.get(QueueService);
    return queueManager.send_message(env, body);
}

export function get_message(env: any): any {
    const queueManager = Container.get(QueueService);
    return queueManager.get_message(env);
}
