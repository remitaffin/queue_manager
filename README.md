# Link packages
Run this command in this repo:
`npm link`

Run this command in the repo that needs to import queue_manager:
`npm link queue_manager`

# Launch SQS locally
docker run -d -p 9324:9324 vsouza/sqs-local

# Create queue in SQS
aws --endpoint http://localhost:9324 sqs create-queue --queue-name myqueue

# More information
https://blog.skyliner.io/a-simple-pattern-for-jobs-and-crons-on-aws-2f965e43932f
