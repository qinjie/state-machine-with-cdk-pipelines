import { IFunction } from "@aws-cdk/aws-lambda";
import * as cdk from "@aws-cdk/core";
import { CfnOutput } from "@aws-cdk/core";
import { LambdaEvenStack } from "./lambda-even-stack";

export class LambdaEvenStage extends cdk.Stage {
  output: CfnOutput;
  lambdaFunction: IFunction;

  constructor(scope: cdk.Construct, id: string, props?: cdk.StageProps) {
    super(scope, id, props);

    const stack = new LambdaEvenStack(this, "StageEven", {
      tags: {
        Application: "StageEven",
        Environment: id,
      },
    });

    this.lambdaFunction = stack.lambdaFunction;
    this.output = stack.output;
  }
}
