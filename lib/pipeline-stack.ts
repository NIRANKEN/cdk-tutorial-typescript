import { Stack, StackProps } from "aws-cdk-lib";
import * as codecommit from "aws-cdk-lib/aws-codecommit";
import {
  CodeBuildStep,
  CodePipeline,
  CodePipelineSource,
} from "aws-cdk-lib/pipelines";
import { Construct } from "constructs";
import { WorkshopPipelineStage } from "./pipeline-stage";

export class WorkshopPipelineStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // Creates a CodeCommit repository called 'WorkshopRepo'
    const repo = new codecommit.Repository(this, "WorkshopRepo", {
      repositoryName: "WorkshopRepo",
    });

    // The basic pipeline declaration. This sets the initial structure of our pipeline
    const pipeline = new CodePipeline(this, "Pipeline", {
      pipelineName: "WorkshopPipeline",
      synth: new CodeBuildStep("SynthStep", {
        input: CodePipelineSource.codeCommit(repo, "main"),
        installCommands: ["npm install -g aws-cdk"],
        commands: [
          "npm install",
          "npm ci",
          "npm run build",
          "npm run cdk synth",
        ],
      }),
    });

    const deploy = new WorkshopPipelineStage(this, "Deploy");
    const deployStage = pipeline.addStage(deploy);
  }
}
