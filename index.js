/*
Author: Fortinet
The following lambda function will be served as the api gateway.
FortiOS will hit this API, and change the security group of the requested
instance to the DEFAULT_GROUP which is configured by the environment
variable.
*/

var AWS = require('aws-sdk');

exports.handler = function(event, context, callback) {

    var code = 200,
        ec2 = new AWS.EC2(),
        group = false || process.env.DEFAULT_GROUP,
        requestBody = JSON.parse(event.body),
        src_ip = requestBody.log.srcip || null,
        resp = {
            'isBase64Encoded' : false,
            'statusCode': 200,
            'headers': { "Content-Type": "application/json" },
            'body': ''
        };

    //look up the instance for src_ip
    if (src_ip) {

        var filter = {
            Filters: [
                {
                    Name: 'ip-address',
                    Values: [src_ip]
                }
            ]
        }

        ec2.describeInstances(filter, function(err, data) {
           if (err) {
                code = 400;
                resp.statusCode = code;
                resp.body = JSON.stringify({
                    error: 'ip_lookup_fail',
                    ip: src_ip,
                    detail: err
                });
                callback(null, resp);
           }
           else {

               if (data.Reservations.length > 0) {
                    var instanceId = data.Reservations[0].Instances[0].InstanceId;

                    var params = {
                        InstanceId: instanceId,
                        Groups: [group]
                    }

                    ec2.modifyInstanceAttribute(params, function(err, data) {
                        if (err) {
                            code = 400;
                            resp.statusCode = code;
                            resp.body = JSON.stringify({
                                error: 'fail_to_update_security_group',
                                security_group_attemped: group,
                                detail: err
                            });
                            callback(null, resp);
                        }
                        else {
                            resp.statusCode = code;
                            resp.body = JSON.stringify({
                                message: 'security_group_updated',
                                security_group_attemped: group
                            });
                            callback(null, resp);
                        }
                    });
               } else {
                    code = 400;
                    resp.statusCode = code;
                    resp.body = JSON.stringify({error: 'reservation_not_found'});
                    callback(null, resp);
               }
           }
        });
    } else {
        code = 400;
        resp.statusCode = code;
        resp.body = JSON.stringify({error: 'missing_srcip'});
        callback(null, resp);
    }
};

