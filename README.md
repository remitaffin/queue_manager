# Link packages
Run this command in this repo:
`npm link`

Run this command in the repo that needs to import queue_manager:
`npm link queue_manager`

# Launch SQS locally and create queue

```
docker run -d -p 9324:9324 vsouza/sqs-local
sleep 3
aws --endpoint http://localhost:9324 sqs create-queue --queue-name myqueue
```

# Launch ActiveMQ and create queue
```
docker run --name='activemq' -it --rm \
    -e 'ACTIVEMQ_MIN_MEMORY=512' \
    -e 'ACTIVEMQ_MAX_MEMORY=2048'\
    -e 'ACTIVEMQ_USER_LOGIN=admin'\
    -e 'ACTIVEMQ_USER_PASSWORD=admin'\
    -e 'ACTIVEMQ_STATIC_QUEUES=myqueue'\
    -p 61613:61613 -p 8161:8161 -d \
    webcenter/activemq:latest
```

# Launch RabbitMQ locally
```
docker run -d --hostname rabbitmq --name rabbitmq \
    -e RABBITMQ_DEFAULT_USER=user \
    -e RABBITMQ_DEFAULT_PASS=password \
    -p 5672:5672 -p 15672:15672 -d \
    rabbitmq:3-management
```
