# aws-costexploder

The AWS key will need the following permissions:

```
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "ce:*"
      ],
      "Resource": [
        "*"
      ]
    }
  ]
}
```

The Slack Webhook needs permission to write messages.


The lambda needs the following ENV variables:

```
AWS_ACCESSKEY='<add aws accesskey here>'
AWS_SECRET_ACCESSKEY='<add aws secret access key here>'
SLACK_WEBHOOK_URL='<add slack webhook url here>'
```

To deploy manually, zip up index.js and node_modules/ and upload to lambda in the AWS console.


To trigger automatically, use CloudWatch Events:

Setup a cron like so:
```cron(59 7,16 * * ? *)```
to run the lambda at 7:59am UTC and 6:59pm UTC every day.
