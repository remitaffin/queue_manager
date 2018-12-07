import 'reflect-metadata';
import { StompClient } from 'stomp-client';
import { Inject, Service } from 'typedi';
import { BaseService } from './BaseService';

@Service()
export class ActiveMQService implements BaseService {
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
        this.stompClient.address = env.host;
        this.stompClient.port = env.port;
        this.stompClient.user = env.user;
        this.stompClient.pass = env.password;
    }

    private async _sendMessageAsync(queueName: string, body_dict: any): Promise<any> {
        return new Promise((resolve, reject) => {
            try {
                const destination = '/queue/' + queueName;
                this.stompClient.connect((sessionId) => {
                    this.stompClient.publish(destination, JSON.stringify(body_dict));
                    this.stompClient.disconnect();
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
                    this.stompClient.subscribe(destination, (body, headers) => {
                        resolve(JSON.parse(body));
                    });
                });
            } catch (error) {
                reject(error);
            }
        });
    }

}
