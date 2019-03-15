# Introduction
This AWS Lambda function works with a FortiGate Automation Action and an API gateway to change the security group of a requested EC2 instance to one specified in an environment variable.

# Set up the AWS Lambda function

> **Note:** The FortiGate and the AWS Lambda function will need to be in the same AWS region, i.e us-east-2. The FortiGate will automatically set the AWS region for the POST request based on the AWS region it is set up in.

  1. In the AWS Console, select **Services > Compute > Lambda**.
  2. Click **Create (a) function**.
  3. Select **Author from scratch** and enter **Basic information** as follows:
     * **Function name:** Enter a function name of your choosing.
     * **Runtime:** Select **Node.js 8.10**.
     * **Permissions:** Select an existing role, or create a new one. The function will need basic **AWS Lambda Execution** as well as EC2 **Describe** and **Modify**. The JSON below can be used to create policies with these permissions.

     **AWSLambdaBasicExecutionRole:**
      ```
      {
        "Version": "2012-10-17",
        "Statement": [
            {
                "Effect": "Allow",
                "Action": [
                    "logs:CreateLogGroup",
                    "logs:CreateLogStream",
                    "logs:PutLogEvents"
                ],
                "Resource": "*"
            }
        ]
      }
      ```

     **EC2 Describe and Modify JSON:**

      ```
      {
        "Version": "2012-10-17",
        "Statement": [
            {
                "Sid": "VisualEditor0",
                "Effect": "Allow",
                "Action": [
                    "ec2:DescribeInstances",
                    "ec2:ModifyInstanceAttribute"
                ],
                "Resource": "*"
            }
        ]
      }
      ```

  4. Click **Create function** to create the function.
  5. Under **Function code**, copy the provided `index.js` code into the AWS Lambda function.
  6. Under **Environment variables** add the following key-value pair:
     * **Key:** DEFAULT_GROUP.
     * **Value:** The security group that EC2 instances will be reset to.
  7. Click **Save** (top right) to save changes to the AWS Lambda function.
  8. Under **Designer** click **API Gateway** and configure the trigger as follows:
     * **API:** Select **Create a new API**.
     * **Security:** Select **Open with API key**.
  9. Click **Add**.
  10. Click **Save** (top right) to save changes to the API Gateway.
  11. Make note of the **API endpoint** and the **API key**, as they will be used in the next section.

# Set up the FortiGate

  1. Log into your FortiGate.
  2. Select **Security Fabric > Automation**.
  3. Click **Create New**.
  4. Enter a **Name**.
  5. Under **Trigger**, select **Compromised Host**.
  6. Under **Action**, select **AWS Lambda**. If desired, an email notification can be configured to notify you that the event has triggered. (Select **Email** and configure appropriately).
  7. Under **AWS Lambda**, set the **API gateway** and **API key** with the values generated in the previous section.

An example is shown below.

  ![FortiOS Security Fabric Automation Screenshot](img/fortigate_lambda2.png)

# Support
Fortinet-provided scripts in this and other GitHub projects do not fall under the regular Fortinet technical support scope and are not supported by FortiCare Support Services.
For direct issues, please refer to the [Issues](https://github.com/fortinet/aws-security-group-update/issues) tab of this GitHub project.
For other questions related to this project, contact [github@fortinet.com](mailto:github@fortinet.com).

## License
[License](./LICENSE) © Fortinet Technologies. All rights reserved.
