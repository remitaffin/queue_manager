// import 'reflect-metadata';
import { StompClient } from 'stomp-client';
import { Inject } from 'typedi';

export class ActiveMQHelper {
    @Inject()
    private stompClient: StompClient;

    public async send_message(env: any, body_dict: any): Promise<any> {
        this._connect(env);
        return await this._sendMessageAsync(env.queueName, body_dict);
    }

    public async get_message(env: any): Promise<any> {
        this._connect(env);
        return await this._receiveMessageAsync(env.queueName);
    }

    private _connect(env: any): void {
        this.stompClient.address = '127.0.0.1';
        this.stompClient.port = 61613;
        this.stompClient.user = 'admin';
        this.stompClient.pass = 'admin';
    }

    private async _sendMessageAsync(queueName: string, body_dict: any): Promise<any> {
        return new Promise((resolve, reject) => {
            try {
                const destination = '/queue/' + queueName;
                this.stompClient.connect((sessionId) => {
                    this.stompClient.publish(destination, JSON.stringify(body_dict));
                    resolve(true);
                });
            } catch (error) {
                reject(error);
            }
        });
    }

    private async _receiveMessageAsync(queueName: string): Promise<any> {
        return new Promise((resolve, reject) => {
            try {
                const destination = '/queue/' + queueName;
                this.stompClient.connect((sessionId) => {
                    const subscription = this.stompClient.subscribe(destination, (body, headers) => {
                        resolve(JSON.parse(body));
                    });
                    subscription.unsubscribe();
                });
            } catch (error) {
                reject(error);
            }
        });
    }

}