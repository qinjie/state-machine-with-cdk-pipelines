import { IFunction } from "@aws-cdk/aws-lambda";
import * as cdk from "@aws-cdk/core";
import { CfnOutput } from "@aws-cdk/core";
import { LambdaOddStack } from "./lambda-odd-stack";

export class LambdaOddStage extends cdk.Stage {
  output: CfnOutput;
  lambdaFunction: IFunction;

  constructor(scope: cdk.Construct, id: string, props?: cdk.StageProps) {
    super(scope, id, props);

    const stack = new LambdaOddStack(this, "StageOdd", {
      tags: {
        Application: "StageOdd",
        Environment: id,
      },
    });

    this.lambdaFunction = stack.lambdaFunction;
    this.output = stack.output;
  }
}
