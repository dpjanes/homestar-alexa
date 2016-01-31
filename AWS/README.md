# README-AWS


## Installation

Note: THIS IS VERY VERY COMPLICATED. Sorry, in the next two months
I hope to have an account system where the only thing you'll need
to do is install HomeStar. 

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

### Alexa Skill: alexa

