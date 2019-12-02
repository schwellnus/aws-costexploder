const AWS = require('aws-sdk');
const moment = require("moment");
const { IncomingWebhook } = require('@slack/webhook');


const currencyRound=function(num) {
  return Math.round(Number.parseFloat(num)*100)/100;
}



exports.handler = function(event, context) {
  console.log('start: ' + moment().format('YYYY-MM-DD hh:mm:ss.SSS'));

  var aws_config = {
      apiVersion: '2017-10-25',
      accessKeyId : process.env.AWS_ACCESSKEY,
      secretAccessKey : process.env.AWS_SECRET_ACCESSKEY,
      region : 'us-east-1'
  };


  var returnval = 0;
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


  const messagePrefix = process.env.COSTEXPLODER_MSGPREFIX || false;

  awsCostExplorer.getCostForecast(params, function(err, data) {
    var returnval=0;
    console.log("in awsCOstExplorer");
    if (err) {
      console.log(err, err.stack); // an error occurred
    } else {
      console.log(data);           // successful response
      returnval=data.Total.Amount;
      //console.log(data.Total.Amount);

      const textmessage = (messagePrefix || 'Cost estimate until end of the month: ') + data.Total.Unit + " " + currencyRound(data.Total.Amount);
      const webhook = new IncomingWebhook(slack_webhook_url);
      (async () => {
        await webhook.send({
          text: textmessage,
        });
      })();
    }
    return returnval;
  });






  console.log('end: ' + moment().format('YYYY-MM-DD hh:mm:ss.SSS'));
  return context.logStreamName;
}
