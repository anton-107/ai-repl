# How to get output from Claude 3 on Bedrock:
Run the CLI command:
```
aws bedrock-runtime converse     --model-id anthropic.claude-3-sonnet-20240229-v1:0     --messages '{"role": "user", "content": [{"text": "I have AWS CLI authenticated with my credentials. How can I list all my s3 buckets that have name 'test' in them?"}]}' --query output.message.content     --output text
```