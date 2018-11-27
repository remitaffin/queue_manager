// On other environments, will require:
//  - AWS_ACCESS_KEY_ID
//  - AWS_SECRET_ACCESS_KEY
import * as AWS from 'aws-sdk';
import { Inject } from 'typedi';

export class SQSHelper {
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

        // Set the region
        AWS.config.update({ region: env.region });

        const params = {
            AttributeNames: ['SentTimestamp'],
            MaxNumberOfMessages: 1,
            MessageAttributeNames: ['All'],
            QueueUrl: env.queueUrl,
            VisibilityTimeout: 20,
            WaitTimeSeconds: 0,
        };

        return await this._receiveMessageAsync(params);
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
                        reject(false);
                    } else if (data.Messages) {
                        const deleteParams = {
                            QueueUrl: params.QueueUrl,
                            ReceiptHandle: data.Messages[0].ReceiptHandle,
                        };
                        this.sqs.deleteMessage(deleteParams, (err2, data2) => {
                            if (err2) {
                                console.log('Delete Error', err2);
                                reject(false);
                            } else {
                                console.log('Message Deleted', data2);
                                resolve(JSON.parse(data.Messages[0].Body));
                            }
                        });
                    }
                });
            } catch (error) {
                reject(error);
            }
        });
    }

}
