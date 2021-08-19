# State Machine with CDK Pipelines



This project demonstrates how to create a simple state machine using a Step Function and 3 Lambda functions.

Lambda function `LambdaAlpha` performs a `mod 2` operation on the input `number`. It passes the calculation`result` to the next stage. Depends on whether the `result` value is odd or even, it will activate `LambdaOdd` or `LambdaEven` respectively.  

<img src="https://raw.githubusercontent.com/qinjie/picgo-images/main/image-20210818230454083.png" alt="image-20210818230454083 " style="zoom:75%;" />

It uses [AWS CDk Pipelines](https://aws.amazon.com/blogs/developer/cdk-pipelines-continuous-delivery-for-aws-cdk-applications/) for continuous delivery. During deployment, it will first create a CodePipeline and connect it with a GitHub repository. When there is any commit in the repository, the pipeline will self mutate if necessary. The pipeline will then acquire resources in AWS and deploy the application.  

<img src="https://raw.githubusercontent.com/qinjie/picgo-images/main/image-20210819163455833.png" alt="image-20210819163455833" style="zoom:70%;" />

## Prerequisite



#### Dev Environment

You need to have [AWS CDK development environment](https://docs.aws.amazon.com/cdk/latest/guide/getting_started.html) setup in your computer. You may go through the Prerequisite session of the [CDK Workshop](https://cdkworkshop.com/15-prerequisites.html). 

Compiling of CDK projects may use Docker images. You may need to install [Docker Desktop](https://docs.docker.com/desktop/windows/install/) too. 




#### Create a GitHub Repo

Create a GitHub repo for this project.



#### Grant AWS Access to GitHub

This project uses GitHub for source control. We need to grant AWS access to the GitHub repository. 

* In GitHub account, create a **Personal access token** with both scope **`repo`** and **`admin:repo_hook`** selected.
* Copy the token value. 



<img src="https://raw.githubusercontent.com/qinjie/picgo-images/main/image-20210819165055631.png" alt="image-20210819165055631" style="zoom: 50%;" />

  

In AWS Console, go to Secret Manager. 

* Create a new secret. Take note of your Secret Name.
* Choose **plaintext** type and paste token value in.

<img src="C:/Users/Qinjie/AppData/Roaming/Typora/typora-user-images/image-20210819200222280.png" alt="image-20210819200222280" style="zoom: 67%;" />



## Project Structure

This project is generated using `cdk init` command. 

The `src` folder is manually added and it contains code for lambda functions. 

```
├── README.md
├── bin
│   └── main.ts
├── cdk.json
├── lib
│   ├── lambda-alpha-stack.ts
│   ├── lambda-even-stack.ts
│   ├── lambda-odd-stack.ts
│   ├── pipeline-stack.ts
│   ├── state-machine-stack.ts
│   └── state-machine-stage.ts
├── package.json
├── src
│   ├── lambda-alpha
│   ├── lambda-even
│   └── lambda-odd
├── .env
```

The `.env` file contains configuration of the CDK project. Update this file accordingly.

```ini
PROJECT_NAME=StateMachine
MODULE_NAME=StateMachine
MODULE_OWNER=zhang_qinjie

REPO_NAME=state-machine-with-cdk-pipelines
REPO_BRANCH=main
REPO_OWNER=qinjie
SECRETS_MANAGER_VAR=GITHUB_MARKQJ
```



### Lambda Function

In each lambda function, there is always a `.env` file, and a `requirements.txt` file. 

* The `requirements.txt` file contains libraries used by the lambda
* The `.env` file contains the environment variables of the lambda function

```
src
├── lambda-alpha
│   ├── .env
│   ├── main.py
│   └── requirements.txt
```



## Test

#### Update Project

1. Update the `.env` file in project root folder accordingly.
2. Commit project into repository in GitHub.

#### Deploy Project
1. Make sure Docker Desktop is running.
2. Run `cdk deploy` to deploy the project. 
   * In AWS CodePipeline, make sure the new pipeline is created successfully. 
   * In AWS Lambda, there will be 3 lambda functions are created.
   * In AWS Step Functions, there will be a step function created.
3. After successful deployment, there will be 4 stacks in AWS CloudFormation. 



### Examine Deployment in AWS Console

Use AWS Console, go to Step Function and check out the state machine created.

Start a new execution with following input:

```json
{
  	"number": 12
}
```

The code will run as 

<img src="https://raw.githubusercontent.com/qinjie/picgo-images/main/image-20210819143605198.png" alt="image-20210819143605198|" style="zoom:75%;" />

