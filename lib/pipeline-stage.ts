import { CfnOutput, Stage, StageProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import { AppStack } from "./app-stack";

export class WorkshopPipelineStage extends Stage {
  public readonly hcViewerUrl: CfnOutput;
  public readonly hcEndpoint: CfnOutput;

  constructor(scope: Construct, id: string, props?: StageProps) {
    super(scope, id, props);

    const service = new AppStack(this, "WebService");
    this.hcViewerUrl = service.hcViewerUrl;
    this.hcEndpoint = service.hcEndpoint;
  }
}
