// On other environments, will require:
//  - AWS_ACCESS_KEY_ID
//  - AWS_SECRET_ACCESS_KEY
import * as AWS from 'aws-sdk';

export class SQSHelper {

    public send_message(env: any, body_dict: any): boolean {
        // Publisher (Send message to SQS)

        // Set the region
        AWS.config.update({ region: env.region });

        // Create an SQS service object
        const sqs = new AWS.SQS({apiVersion: '2012-11-05'});

        const params = {
            DelaySeconds: 10,
            MessageBody: JSON.stringify(body_dict),
            QueueUrl: env.queueUrl,
        };

        let returnedValue: boolean;
        sqs.sendMessage(params, (err, data) => {
            if (err) {
                console.log('Error', err);
                returnedValue = false;
            } else {
                console.log('Success', data);
                returnedValue = true;
            }
        });
        return returnedValue;
    }

    public get_first_message(env: any): any {
        // Receive message from SQS
        // Set the region
        AWS.config.update({ region: env.region });

        // Create an SQS service object
        const sqs = new AWS.SQS({apiVersion: '2012-11-05'});

        const params = {
            AttributeNames: [
                'SentTimestamp',
            ],
            MaxNumberOfMessages: 1,
            MessageAttributeNames: ['All'],
            QueueUrl: env.queueUrl,
            VisibilityTimeout: 20,
            WaitTimeSeconds: 0,
        };

        let returnedValue: boolean;
        let messageData: any;
        sqs.receiveMessage(params, (err, data) => {
            if (err) {
                console.log('Receive Error', err);
                returnedValue = false;
            } else if (data.Messages) {
                const deleteParams = {
                    QueueUrl: env.queueUrl,
                    ReceiptHandle: data.Messages[0].ReceiptHandle,
                };
                sqs.deleteMessage(deleteParams, (err2, data2) => {
                    if (err2) {
                        console.log('Delete Error', err2);
                        returnedValue = false;
                    } else {
                        console.log('Message Deleted', data2);
                        messageData = data.Messages[0];
                        console.log('Process job:');
                        console.log(JSON.parse(data.Messages[0].Body));
                        returnedValue = true;
                    }
                });
            }
        });
        if (returnedValue === true) {
            return messageData;
        } else {
            return returnedValue;
        }
    }

}
