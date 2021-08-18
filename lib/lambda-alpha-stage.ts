import { IFunction } from "@aws-cdk/aws-lambda";
import * as cdk from "@aws-cdk/core";
import { CfnOutput } from "@aws-cdk/core";
import { LambdaAlphaStack } from "./lambda-alpha-stack";

export class LambdaAlphaStage extends cdk.Stage {
  output: CfnOutput;
  lambdaFunction: IFunction;

  constructor(scope: cdk.Construct, id: string, props?: cdk.StageProps) {
    super(scope, id, props);

    const stack = new LambdaAlphaStack(this, "StageAlpha", {
      tags: {
        Application: "StageAlpha",
        Environment: id,
      },
    });

    this.lambdaFunction = stack.lambdaFunction;
    this.output = stack.output;
  }
}
