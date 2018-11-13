//NOTE: This file is a work in progress
//TODO: communicate with other lambda to get birthday response to avoid duplicated code here

exports.handler = async (event) => {
    var aws = require('aws-sdk');
    var lambda = new aws.Lambda({
        region: 'us-east-1'
    });

    var nextRequest = {
        "version": "1.0",
        "session": {
            "new": false,
            "sessionId": "amzn1.echo-api.session.e03bc9ad-4290-4b47-ae78-26ffd00c3d63",
            "application": {
                "applicationId": "amzn1.ask.skill.a8d85ea2-1095-48b6-b517-6d3f64153b8f"
            },
            "attributes": {
                "STATE": "_SEARCHMODE"
            },
            "user": {
                "userId": "amzn1.ask.account.AHQA33QO2M7IMSSYRPL3IAVEYBMMNCKHSIHFMFGFKODFED7LK6E4H7Q3SQDFGDKNAHDQZGCWQQJLPNAWPDDMQPZGRH5UHMB6XIBJ7SKRZI7G4JB2QNUNCUHBIT2KK73SS3APK5NT5X7PZLOI5GPXRTPUSHBO4U6USLKV5FSMXZIFD4KSURTIGHYWR4YALHMDVYHYACFU4ELMDTI"
            }
        },
        "context": {
            "System": {
                "application": {
                    "applicationId": "amzn1.ask.skill.a8d85ea2-1095-48b6-b517-6d3f64153b8f"
                },
                "user": {
                    "userId": "amzn1.ask.account.AHQA33QO2M7IMSSYRPL3IAVEYBMMNCKHSIHFMFGFKODFED7LK6E4H7Q3SQDFGDKNAHDQZGCWQQJLPNAWPDDMQPZGRH5UHMB6XIBJ7SKRZI7G4JB2QNUNCUHBIT2KK73SS3APK5NT5X7PZLOI5GPXRTPUSHBO4U6USLKV5FSMXZIFD4KSURTIGHYWR4YALHMDVYHYACFU4ELMDTI"
                },
                "device": {
                    "deviceId": "amzn1.ask.device.AHSBCXTECPYL5HVSX6CZIZQPJMYO6FCUK6MDJRDQXCQXILPASG6QWWDAFFT53MVYKRAGBNF3XH4RDA47STYTIXHVUIKYZZ3X45UKWU36SELLBXUVVIGTQQB7NUFURA6RX5CI5IRQL6DGCOVL7AC5TGBY3MSF4QKLL4VFAUQYI5JTI4VMHACVO",
                    "supportedInterfaces": {}
                },
                "apiEndpoint": "https://api.amazonalexa.com",
                "apiAccessToken": "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6IjEifQ.eyJhdWQiOiJodHRwczovL2FwaS5hbWF6b25hbGV4YS5jb20iLCJpc3MiOiJBbGV4YVNraWxsS2l0Iiwic3ViIjoiYW16bjEuYXNrLnNraWxsLmE4ZDg1ZWEyLTEwOTUtNDhiNi1iNTE3LTZkM2Y2NDE1M2I4ZiIsImV4cCI6MTU0MjA1OTk3NiwiaWF0IjoxNTQyMDU2Mzc2LCJuYmYiOjE1NDIwNTYzNzYsInByaXZhdGVDbGFpbXMiOnsiY29uc2VudFRva2VuIjpudWxsLCJkZXZpY2VJZCI6ImFtem4xLmFzay5kZXZpY2UuQUhTQkNYVEVDUFlMNUhWU1g2Q1pJWlFQSk1ZTzZGQ1VLNk1ESlJEUVhDUVhJTFBBU0c2UVdXREFGRlQ1M01WWUtSQUdCTkYzWEg0UkRBNDdTVFlUSVhIVlVJS1laWjNYNDVVS1dVMzZTRUxMQlhVVlZJR1RRUUI3TlVGVVJBNlJYNUNJNUlSUUw2REdDT1ZMN0FDNVRHQlkzTVNGNFFLTEw0VkZBVVFZSTVKVEk0Vk1IQUNWTyIsInVzZXJJZCI6ImFtem4xLmFzay5hY2NvdW50LkFIUUEzM1FPMk03SU1TU1lSUEwzSUFWRVlCTU1OQ0tIU0lIRk1GR0ZLT0RGRUQ3TEs2RTRIN1EzU1FERkdES05BSERRWkdDV1FRSkxQTkFXUERETVFQWkdSSDVVSE1CNlhJQko3U0tSWkk3RzRKQjJRTlVOQ1VIQklUMktLNzNTUzNBUEs1TlQ1WDdQWkxPSTVHUFhSVFBVU0hCTzRVNlVTTEtWNUZTTVhaSUZENEtTVVJUSUdIWVdSNFlBTEhNRFZZSFlBQ0ZVNEVMTURUSSJ9fQ.Vzcq-t58apXTtPci6Mgs1HPlgNOjBaNgtRf0dREJnKLjxLI9IOmwGp360h7UI9qhoH0iTS9KrRldxbG6Q6BPfgmV3XLazIvCthPzfuE-q-5aeAe94fXlyRQSt561mC65OmjlymdkQ-nap4vbtV7BBBBQ_1ocbsa8OWMRBq8A2fY4W3mu0Z52LbFILYo5dV2UOuphDeG99pN3DalkZMCGh4thm-rM7brTLz--9XcWSgMcn8vM99KlWi1RTHZpqFHF0xabuq1TTkXfGg5i1UAyjT0IfxIsmnS0gV19Gs8quC-Xxcf0dYHzeXU-fPDXvLNkPojIO2QyXNj2yP7zD_6TYA"
            },
            "Viewport": {
                "experiences": [
                    {
                        "arcMinuteWidth": 246,
                        "arcMinuteHeight": 144,
                        "canRotate": false,
                        "canResize": false
                    }
                ],
                "shape": "RECTANGLE",
                "pixelWidth": 1024,
                "pixelHeight": 600,
                "dpi": 160,
                "currentPixelWidth": 1024,
                "currentPixelHeight": 600,
                "touch": [
                    "SINGLE"
                ]
            }
        },
        "request": {
            "type": "SessionEndedRequest",
            "requestId": "amzn1.echo-api.request.34798ae2-be3f-4b93-a5fb-7062d9a6c1db",
            "timestamp": "2018-11-12T20:59:36Z",
            "locale": "en-US",
            "reason": "USER_INITIATED"
        }
    }
    var payload = JSON.stringify(nextRequest, null, 2);
    console.log('payload is ', payload);

    var response = await lambda.invoke({
        FunctionName: 'arn:aws:lambda:us-east-1:173727954206:function:alexaBirthdayGetter',
        Payload: payload
    }, function(error, data) {
        if (error) {
            console.log('This failed with ', error);
            context.done('error', error);
        }
        if(data.Payload){
            console.log('success here', data.Payload);
            context.succeed(data.Payload)
            return  JSON.stringify('Hello from Lambda!');
        }
    });
    console.log('response');
}

