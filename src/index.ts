import { SQSHelper } from './helpers/sqs';

export function send_message(env: any): boolean {
    const body = {
        method: 'POST',
        message: 'http://url/endpoint?test=1',
    };
    const sqshelper = new SQSHelper();
    return sqshelper.send_message(env, body);
}

export function get_message(env: any): any {
    const sqshelper = new SQSHelper();
    return sqshelper.get_first_message(env);
}
