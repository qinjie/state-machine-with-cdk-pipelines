import * as codepipeline from "@aws-cdk/aws-codepipeline";
import * as codepipeline_actions from "@aws-cdk/aws-codepipeline-actions";
import { Action } from "@aws-cdk/aws-codepipeline";
import * as cdk from "@aws-cdk/core";
import * as pipelines from "@aws-cdk/pipelines";
import { LambdaAlphaStage } from "./lambda-alpha-stage";
import { LambdaEvenStage } from "./lambda-even-stage";
import { LambdaOddStage } from "./lambda-odd-stage";
import * as sfn from "@aws-cdk/aws-stepfunctions";
import * as tasks from "@aws-cdk/aws-stepfunctions-tasks";
import { Duration } from "@aws-cdk/core";

export class PipelineStack extends cdk.Stack {
  repo_owner: string = process.env.REPO_OWNER!;
  repo_name: string = process.env.REPO_NAME!;
  repo_branch: string = process.env.REPO_BRANCH!;
  secrets_manager_var: string = process.env.SECRETS_MANAGER_VAR!;

  private getSourceAction(sourceArtifact: codepipeline.Artifact): Action {
    const sourceActionProps = {
      actionName: "GitHub",
      output: sourceArtifact,
      oauthToken: cdk.SecretValue.secretsManager(this.secrets_manager_var),
      owner: this.repo_owner,
      repo: this.repo_name,
      branch: this.repo_branch,
    };

    return new codepipeline_actions.GitHubSourceAction(sourceActionProps);
  }

  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const sourceArtifact = new codepipeline.Artifact();
    const cloudAssemblyArtifact = new codepipeline.Artifact();

    const sourceAction = this.getSourceAction(sourceArtifact);

    const synthAction = pipelines.SimpleSynthAction.standardNpmSynth({
      sourceArtifact,
      cloudAssemblyArtifact,
      installCommand: "npm install --include=dev",
      buildCommand: "npm run build",
      environment: {
        privileged: true,
      },
    });

    const pipeline = new pipelines.CdkPipeline(this, "Pipeline", {
      // Disable Customer Master Keys for same account deployment
      crossAccountKeys: false,
      // Other setups
      pipelineName: id,
      cloudAssemblyArtifact,
      sourceAction,
      synthAction,
      /* Diable mutating when developing pipeline only */
      // selfMutating: false,
    });

    // Add one or more application stage
    const stageDev = pipeline.addStage("dev");
    const lambdaAlphaStage = new LambdaAlphaStage(this, "LambdaAlphaStage");
    const lambdaEvenStage = new LambdaEvenStage(this, "LambdaEvenStage");
    const lambdaOddStage = new LambdaOddStage(this, "LambdaOddStage");
    stageDev.addApplication(lambdaAlphaStage);
    stageDev.addApplication(lambdaEvenStage);
    stageDev.addApplication(lambdaOddStage);

    // // Define step function
    // const taskAlpha = new tasks.LambdaInvoke(this, "LambdaAlpha", {
    //   lambdaFunction: lambdaAlphaStage.lambdaFunction,
    //   inputPath: "$.number",
    //   outputPath: "$.Payload",
    // });
    // const taskEven = new tasks.LambdaInvoke(this, "LambdaEven", {
    //   lambdaFunction: lambdaEvenStage.lambdaFunction,
    //   inputPath: "$.result",
    //   outputPath: "$.Payload",
    // });
    // const taskOdd = new tasks.LambdaInvoke(this, "LambdaOdd", {
    //   lambdaFunction: lambdaOddStage.lambdaFunction,
    //   inputPath: "$.result",
    //   outputPath: "$.Payload",
    // });

    // const WAIT_SECONDS = 2;
    // const waitX = new sfn.Wait(this, "Wait X Seconds", {
    //   time: sfn.WaitTime.duration(Duration.seconds(WAIT_SECONDS)),
    // });

    // const definition = taskAlpha
    //   .next(waitX)
    //   .next(
    //     new sfn.Choice(this, "Even or Odd?")
    //       .when(sfn.Condition.numberEquals("$.result", 1), taskOdd)
    //       .when(sfn.Condition.numberEquals("$.result", 0), taskEven)
    //   );

    // const stateMachine = new sfn.StateMachine(this, "MyStateMachine", {
    //   definition,
    //   timeout: Duration.minutes(5),
    // });
  }
}
