import { Stack } from "aws-cdk-lib";
import * as lambda from "aws-cdk-lib/aws-lambda";
import { Template, Match, Capture } from "aws-cdk-lib/assertions";
import * as App from "../lib/app-stack";
import { HitCounter } from "../lib/hitcounter";

const createHitCounter = (stack: Stack, readCapacity?: number) =>
  new HitCounter(stack, "MyTestConstruct", {
    downstream: new lambda.Function(stack, "TestFunction", {
      runtime: lambda.Runtime.NODEJS_14_X,
      handler: "hello.handler",
      code: lambda.Code.fromAsset("lambda"),
    }),
    readCapacity,
  });

test("DynamoDB Table Created", () => {
  const stack = new Stack();
  // WHEN
  createHitCounter(stack);
  // THEN
  const template = Template.fromStack(stack);
  template.resourceCountIs("AWS::DynamoDB::Table", 1);
});

test("Lambda Has Environment Variables", () => {
  const stack = new Stack();
  // WHEN
  createHitCounter(stack);
  // THEN
  const template = Template.fromStack(stack);
  const envCapture = new Capture();
  template.hasResourceProperties("AWS::Lambda::Function", {
    Environment: envCapture,
  });

  expect(envCapture.asObject()).toEqual({
    Variables: {
      DOWNSTREAM_FUNCTION_NAME: {
        Ref: "TestFunction22AD90FC",
      },
      HITS_TABLE_NAME: {
        Ref: "MyTestConstructHits24A357F0",
      },
    },
  });
});

test("read capacity can be configured", () => {
  const stack = new Stack();

  expect(() => {
    const invalidSmallReadCapacity = 4;
    createHitCounter(stack, invalidSmallReadCapacity);
  }).toThrowError(/readCapacity must be greater than 5 and less than 20/);
});
