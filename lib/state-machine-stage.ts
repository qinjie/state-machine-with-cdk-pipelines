import { IFunction } from "@aws-cdk/aws-lambda";
import * as cdk from "@aws-cdk/core";
import { CfnOutput } from "@aws-cdk/core";
import { LambdaAlphaStack } from "./lambda-alpha-stack";
import { LambdaEvenStack } from "./lambda-even-stack";
import { LambdaOddStack } from "./lambda-odd-stack";
import { StateMachineStack } from "./state-machine-stack";

export class StateMachineStage extends cdk.Stage {
  outputAlpha: CfnOutput;
  lambdaAlpha: IFunction;
  outputEven: CfnOutput;
  lambdaEven: IFunction;
  outputOdd: CfnOutput;
  lambdaOdd: IFunction;

  constructor(scope: cdk.Construct, id: string, props?: cdk.StageProps) {
    super(scope, id, props);

    // Lambda Alpha
    const stackAlpha = new LambdaAlphaStack(this, "LambdaAlpha", {
      tags: {
        Application: "LambdaAlpha",
        Environment: id,
      },
    });
    this.lambdaAlpha = stackAlpha.lambdaFunction;
    this.outputAlpha = stackAlpha.output;

    // Lambda Even
    const stackEven = new LambdaEvenStack(this, "LambdaEven", {
      tags: {
        Application: "LambdaEven",
        Environment: id,
      },
    });
    this.lambdaEven = stackEven.lambdaFunction;
    this.outputEven = stackEven.output;

    // Lambda Odd
    const stackOdd = new LambdaOddStack(this, "LambdaOdd", {
      tags: {
        Application: "LambdaOdd",
        Environment: id,
      },
    });
    this.lambdaOdd = stackOdd.lambdaFunction;
    this.outputOdd = stackOdd.output;

    // Step Function
    const stackStepFunction = new StateMachineStack(this, "StateMachine", {
      lambdaAlpha: this.lambdaAlpha,
      lambdaEven: this.lambdaEven,
      lambdaOdd: this.lambdaOdd,
    });
  }
}
