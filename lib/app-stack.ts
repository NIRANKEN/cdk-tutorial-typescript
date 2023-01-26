import { Stack, StackProps, App } from 'aws-cdk-lib';
import { Function, Runtime, Code } from 'aws-cdk-lib/aws-lambda';
import { LambdaRestApi } from 'aws-cdk-lib/aws-apigateway';

export class AppStack extends Stack {
  constructor(scope: App, id: string, props?: StackProps) {
    super(scope, id, props);

    // defines an AWS Lambda resource
    const hello = new Function(this, 'HelloHandler', {
      runtime: Runtime.NODEJS_14_X, // 実行環境
      code: Code.fromAsset('lambda'), // "lambda" directoryからコードを読み込むよ。
      handler: 'hello.handler' // helloっていうファイルの、functionが"handler"だよ
    });

    // defines an API Gateway REST API resouce backed by our "hello" function
    new LambdaRestApi(this, 'Endpoint', {
      handler: hello
    });
  }
}
