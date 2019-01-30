// On other environments, will require:
//  - AWS_ACCESS_KEY_ID
//  - AWS_SECRET_ACCESS_KEY
import 'reflect-metadata';
import * as AWS from 'aws-sdk';
import { Inject, Service } from 'typedi';
import { BaseService } from './BaseService';

@Service()
export class SQSService implements BaseService {
    @Inject()
    private sqs: AWS.SQS;

    constructor() {
        // Set the default region and api version
        AWS.config.update({region: 'us-east-1'});
        AWS.config.apiVersions = {sqs: '2012-11-05'};
    }

    public async send_message(env: any, body_dict: any): Promise<boolean> {
        // Publisher (Send message to SQS)

        const params = {
            DelaySeconds: 10,
            MessageBody: JSON.stringify(body_dict),
            QueueUrl: env.queueUrl,
        };

        return await this._sendMessageAsync(params);
    }

    public async get_message(env: any): Promise<any> {
        // Receive message from SQS

        const params = {
            AttributeNames: ['SentTimestamp'],
            MaxNumberOfMessages: 1,
            MessageAttributeNames: ['All'],
            QueueUrl: env.queueUrl,
            VisibilityTimeout: 20,
            // WaitTimeSeconds needs to be between 1 and 20.
            // Increasing the number will check the queue less often, but will
            // make the AWS bill cheaper
            WaitTimeSeconds: 5,
        };

        return await this._receiveMessageAsync(params);
    }

    public async clear_message(env: any, receiptHandle: any): Promise<any> {
        // Delete message from SQS Queue

        const deleteParams = {
            QueueUrl: env.queueUrl,
            ReceiptHandle: receiptHandle,
        };

        return await this._clearMessageAsync(deleteParams);
    }

    private async _sendMessageAsync(params: any): Promise<any> {
        return new Promise((resolve, reject) => {
            try {
                this.sqs.sendMessage(params, (err, data) => {
                    if (err) {
                        console.log('Error', err);
                        reject(false);
                    } else {
                        console.log('Success', data);
                        resolve(true);
                    }
                });
            } catch (error) {
                reject(error);
            }
        });
    }

    private async _receiveMessageAsync(params: any): Promise<any> {
        return new Promise((resolve, reject) => {
            try {
                this.sqs.receiveMessage(params, (err, data) => {
                    if (err) {
                        console.log('Receive Error', err);
                        reject(err);
                    } else if (data.Messages) {
                        // Returns an object that contains
                        // {Body: '{"stringified_json": ""}', ReceiptHandle: {}}
                        resolve(data.Messages[0]);
                    } else {
                        reject('Empty message');
                    }
                });
            } catch (error) {
                reject(error);
            }
        });
    }

    private async _clearMessageAsync(params: any): Promise<any> {
        return new Promise((resolve, reject) => {
            try {
                this.sqs.deleteMessage(params, (err, data) => {
                    if (err) {
                        console.log('Delete Error');
                        reject(err);
                    } else {
                        resolve(true);
                    }
                });
            } catch (error) {
                reject(error);
            }
        });
    }

}
