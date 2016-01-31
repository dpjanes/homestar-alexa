# README-AWS

## Introduction

This is a rudimentary linking of Alexa / Amazon Echo with Home☆Star / IOTDB using
AWS IoT MQTT as the linking bit. This will be getting better and better with time,
but let's consider this a step 1.

First, [here's a demo on YouTube](https://www.youtube.com/watch?v=WMyh5IFl4o8).
You should be able to set this up at home, if you follow the instructions below.
The warning is it's really complicated because AWS IoT is really complicated to 
get set up and understand. Once you understand it it's not so bad, but that warning
up front.

The command architecture looks like this:

* you say: "Alexa, tell HomeStar to turn on the lights". 
* Amazon Echo thinks about it and sends the command up to Alexa
* our Alexa skill called HomeStar (code in this folder) takes
the command and formats it as an MQTT message to be sent to MQTT 
* the Alexa skill then says "OK command received". It doesn't know
if the command completes successfully or not - we will get this in 
a future version where it will be able to reason on your Things
in the cloud, but we're not there yet
* AWS IoT receives the MQTT message and forwards it to any 
listeners with the proper permissions.
* the command "AWS.js" (code in this folder) is listening for commands
on MQTT from AWS IoT.
* it receives the messsage
* it does reasoning on the message using the GitHub project 
[iotdb-commands](https://github.com/dpjanes/iotdb-commands)
to find the the appropriate Things to send the commands to
* the commands get executed

The cool thing about [IOTDB](https://iotdb.org) is it provides a universal infrastructure
for describing how Things can be found and how they work.

## Installation

Note: THIS IS VERY VERY COMPLICATED. Sorry, in the next two months
I hope to have an account system where the only thing you'll need
to do is install HomeStar. 

### Install Source code

    $ git clone https://github.com/dpjanes/homestar-alexa

For reference purposes, we'll assume you did this in your $HOME
folder. If you didn't you'll have to ajust your code below.

### Install NodeJS

This is heavily dependent on NodeJS. Here's how you do this:

* [https://nodejs.org/en/download/][https://nodejs.org/en/download/]

### Install HomeStar

Home☆Star / IOTDB provides all the intelligence for controlling 
things locally. You can read more about this [here](https://homestar.io/about).

    $ npm install -g homestar   ## may require sudo
    $ homestar setup

If you have a WeMo

    $ homestar install homestar-wemo

If you have a Hue

    $ homestar install homestar-hue
    $ homestar configure homestar-hue

If you have a LIFX

    $ homestar install homestar-lifx

If you have an ITach IR controller

    $ homestar install homestar-itach-ir

### Make Certs

This is the super complicated part of the project. 

* [Get an AWS account](https://aws.amazon.com/documentation/gettingstarted/)
* [Install the Command Line Tools](http://docs.aws.amazon.com/cli/latest/userguide/cli-chap-getting-set-up.html)


You're going to need to create a set of AWS IoT permissions to publish and
subscribe on this AWS IoT MQTT path:

    iotdb/homestar/0/81EA6324-418D-459C-A9C4-D430F30021C7/alexa/FirstIntent/command 

You can do this by following the instructions
[here](http://docs.aws.amazon.com/iot/latest/developerguide/what-is-aws-iot.html), though it may take some time.

To simplify this, we've made some tools:

    $ git clone https://github.com/dpjanes/iotdb-aws-toolkit.git
    $ cd iotdb-aws-toolkit

If you're new to AWS IoT this are handy. If you've got an established 
setup I might be wary of using this, just because it's creating new
Roles and Policies that you may or may not want.

#### Get your AWS Endpoint / Hostname

You'll need this in later steps

    $ sh $HOME/iotdb-aws-toolkit/tools/GetIOTEndpoint.sh
    XXXXXXXXXXXXXX.iot.us-east-1.amazonaws.com

#### Create IAM Roles

    $ cd $HOME/iotdb-aws-toolkit/iam 
    $ sh EnableAWS.sh --all

#### Create IoT Policy

This will create a IoT Policy that allows publish and subscribe to the MQTT path 'iotdb/homestar/#'.
It will be called **AllowTopicIoTConnectPublishSubscribe-iotdb-homestar**.

    $ cd $HOME/iotdb-aws-toolkit/iot/policies
    $ sh AddPolicy.sh --org iotdb --grp homestar topic-grp/AllowTopicIoTConnectPublishSubscribe-my_org-my_grp.json

#### Create Certificates

    $ cd $HOME/iotdb-aws-toolkit/iot/certificates
    $ sh MakeCertificate.sh --policy AllowTopicIoTConnectPublishSubscribe-iotdb-homestar

You now have a ZIP file with all the certificates. Keep this handy (but private);

### AWS Lambda: HomeStar

* go to the [AWS Lambda console](https://console.aws.amazon.com/lambda/home?region=us-east-1#/functions)
* create a new function called **HomeStar**. Choose some simple default project for it: it doesn't matter, we're going to wipe it out
* then

    $ cd $HOME/homestar-alexa ## you installed this near the top
    $ cd AWS/HomeStar
    $ sh Push.sh

This will upload the Lambda code.

You will also need the "ARN" for this Lambda Functions. It will look something like **arn:aws:lambda:us-east-1:99999999999:function:HomeStar**. Keep a note of this.

### Alexa Skill: alexa

Note that the Alexa console is entirely separate from the AWS console. You may have to do verifications

* familiarize yourself with [Alexa Skills](https://developer.amazon.com/public/solutions/alexa/alexa-skills-kit/getting-started-guide)
* go to the [Amazon Developer Console](https://developer.amazon.com/edw/home.html#/skills/list)
* create a new Skill called HomeStar
  * enter the ARN for the Lambda function
* from the $HOME/homestar-alexa/alexa/speechAssets folder
  * upload "Intent Schema"
  * upload the LIST_OF_ACTIONS 
  * upload the LIST_OF_THINGS
  * upload the Sample Utterances
  

### Test

You'll need a connected light for this to work. Try a LIFX or TCP Connected or Philips Hue.

	$ cd $HOME/homestar-alexa/AWS
	$ node AWS.js
	(lots of output)
	
Say your commands:

* Alexa, tell HomeStar to turn off the lights
* Alexa, tell HomeStar to turn on the lights

The lights should turn on or off.

### Troubleshooting

* AWS Lambda logs everything
* Try the MQTT console on AWS IoT to see if messages are being sent
* Get in touch with me: davidjanes@iotdb.org

