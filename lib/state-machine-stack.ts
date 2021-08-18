import * as cdk from "@aws-cdk/core";
import * as lambda from "@aws-cdk/aws-lambda";
import * as lambda_python from "@aws-cdk/aws-lambda-python";
import * as path from "path";
import * as dotenv from "dotenv";
import { Construct } from "@aws-cdk/core";
import { IFunction } from "@aws-cdk/aws-lambda";
import * as sfn from "@aws-cdk/aws-stepfunctions";
import * as tasks from "@aws-cdk/aws-stepfunctions-tasks";
import { Duration } from "@aws-cdk/core";

interface StateMachineProps extends cdk.StackProps {
  lambdaAlpha: IFunction;
  lambdaEven: IFunction;
  lambdaOdd: IFunction;
}

export class StateMachineStack extends cdk.Stack {
  output: cdk.CfnOutput;
  name: string;

  constructor(scope: cdk.Construct, id: string, props?: StateMachineProps) {
    super(scope, id, props);

    // Step Function
    const taskAlpha = new tasks.LambdaInvoke(this, "LambdaAlpha", {
      lambdaFunction: props!.lambdaAlpha,
      inputPath: "$.number",
      outputPath: "$.Payload",
    });
    const taskEven = new tasks.LambdaInvoke(this, "LambdaEven", {
      lambdaFunction: props!.lambdaEven,
      inputPath: "$.result",
      outputPath: "$.Payload",
    });
    const taskOdd = new tasks.LambdaInvoke(this, "LambdaOdd", {
      lambdaFunction: props!.lambdaOdd,
      inputPath: "$.result",
      outputPath: "$.Payload",
    });

    const WAIT_SECONDS = 2;
    const waitX = new sfn.Wait(this, "Wait X Seconds", {
      time: sfn.WaitTime.duration(Duration.seconds(WAIT_SECONDS)),
    });

    const definition = taskAlpha
      .next(waitX)
      .next(
        new sfn.Choice(this, "Even or Odd?")
          .when(sfn.Condition.numberEquals("$.result", 1), taskOdd)
          .when(sfn.Condition.numberEquals("$.result", 0), taskEven)
      );

    const stateMachine = new sfn.StateMachine(this, this.name, {
      definition,
      timeout: Duration.minutes(5),
    });

    this.output = new cdk.CfnOutput(this, `${this.name}_FunctionName`, {
      value: stateMachine.stateMachineName,
    });
  }
}
