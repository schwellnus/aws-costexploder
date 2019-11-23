const AWS = require('aws-sdk');
const moment = require("moment");
const { IncomingWebhook } = require('@slack/webhook');

/*

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

*/


var aws_config = {
    apiVersion: '2017-10-25',
    accessKeyId : process.env.AWS_ACCESSKEY,
    secretAccessKey : process.env.AWS_SECRET_ACCESSKEY,
    region : 'us-east-1'
}

const slack_webhook_url=process.env.SLACK_WEBHOOK_URL;

const awsCostExplorer = new AWS.CostExplorer(aws_config);

var now = new Date();

var monthFirst=moment(now).startOf('month').format('YYYY-MM-DD');
var monthLast=moment(now).endOf('month').format('YYYY-MM-DD');
var monthTomorrow=moment(now).add(1,"day").format('YYYY-MM-DD');
var monthToday=moment(now).format('YYYY-MM-DD');

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CostExplorer.html#getCostForecast-property
var params = {
  Granularity: 'MONTHLY', /* required */
  Metric: 'UNBLENDED_COST', /* required */
  TimePeriod: { /* required */
    End: monthLast, /* required */
    Start: monthTomorrow /* required */
  }
};



awsCostExplorer.getCostForecast(params, function(err, data) {
  if (err) console.log(err, err.stack); // an error occurred
  else {
    console.log(data);           // successful response
    const webhook = new IncomingWebhook(slack_webhook_url);
    console.log(data.Total.Amount);
    (async () => {
      await webhook.send({
        text: 'Cost estimate until end of the month: ' + data.Total.Amount,
      });
    })();
  }
});
