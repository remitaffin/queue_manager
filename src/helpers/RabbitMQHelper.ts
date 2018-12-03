import * as amqp from 'amqplib/callback_api';

export class RabbitMQHelper {

    public async send_message(env: any, body_dict: any): Promise<any> {
        const task = JSON.stringify(body_dict);
        return await this._sendMessageAsync(env, task);
    }

    public async get_message(env: any): Promise<any> {
        const stringified_message = await this._receiveMessageAsync(env);
        return JSON.parse(stringified_message);
    }

    private _get_connection_string(env: any): string {
        return 'amqp://' + env.user + ':' + env.password + '@' + env.host + env.virtualHost;
    }

    private async _sendMessageAsync(env: any, task: any): Promise<any> {
        return new Promise((resolve, reject) => {
            try {
                const connection_string = this._get_connection_string(env);
                amqp.connect(connection_string, (err, conn) => {
                    conn.createChannel((err2, ch) => {
                       ch.assertQueue(env.queueName);
                       ch.sendToQueue(env.queueName, Buffer.from(task));
                       resolve(true);
                    });
                });
            } catch (error) {
                reject(error);
            }
        });
    }

    private async _receiveMessageAsync(env: any): Promise<any> {
        return new Promise((resolve, reject) => {
            try {
                const connection_string = this._get_connection_string(env);
                amqp.connect(connection_string, (err, conn) => {
                    conn.createChannel((err2, ch) => {
                        ch.assertQueue(env.queueName);
                        ch.consume(env.queueName, (msg) => {
                            if (msg !== null) {
                                resolve(msg.content.toString());
                                ch.ack(msg);
                            }
                        });
                    });
                });
            } catch (error) {
                reject(error);
            }
        });
    }

}
