# Link packages
Run this command in this repo:
`npm link`

Run this command in the repo that needs to import queue_manager:
`npm link queue_manager`

# Launch SQS locally
docker run -d -p 9324:9324 vsouza/sqs-local

# Launch ActiveMQ and create queue
docker run --name='activemq' -it --rm \
    -e 'ACTIVEMQ_MIN_MEMORY=512' \
    -e 'ACTIVEMQ_MAX_MEMORY=2048'\
    -e 'ACTIVEMQ_USER_LOGIN=admin'\
    -e 'ACTIVEMQ_USER_PASSWORD=admin'\
    -e 'ACTIVEMQ_STATIC_QUEUES=myqueue'\
    -p 61613:61613 -p 8161:8161 -d \
    webcenter/activemq:latest

# Create queue in SQS
aws --endpoint http://localhost:9324 sqs create-queue --queue-name myqueue

# More information
https://blog.skyliner.io/a-simple-pattern-for-jobs-and-crons-on-aws-2f965e43932f
