// Website hit counter functionality
document.addEventListener("DOMContentLoaded", function() {
    // DOM Elements
    const counterElement = document.getElementById('hitCounter');
    const apiEndpoint = 'https://qyxgmu3at7.execute-api.ap-southeast-2.amazonaws.com/default/aman_portfolio_hits_lambda_python';

    // Function to update the hit counter display
    function updateHitCounter(hits) {
        if (counterElement) {
            // Add animation class
            counterElement.classList.add('updated');
            
            // Update the counter value
            counterElement.textContent = hits;
            
            // Remove animation class after animation completes
            setTimeout(() => {
                counterElement.classList.remove('updated');
            }, 500);
        }
    }

    // Function to handle API errors
    function handleError(error) {
        console.error('Error:', error);
        if (counterElement) {
            counterElement.textContent = 'Error';
        }
    }

    // Make API call to update hit counter
    fetch(apiEndpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        if (data.updated_hits !== undefined) {
            updateHitCounter(data.updated_hits);
        } else {
            throw new Error('Invalid response format');
        }
    })
    .catch(handleError);
});


// AWS Lambda code pyhton

/* 

import boto3
import json

print('Loading function')
dynamo = boto3.client('dynamodb')

TABLE_NAME = 'aman_portfolio_hits2'
PRIMARY_KEY = 'id'
PAGE_ID_VALUE = '1'  # Use the actual page ID you want to update
COUNTER_ATTRIBUTE = 'hits'


def respond(err, res=None):
    return {
        'statusCode': '400' if err else '200',
        'body': str(err) if err else json.dumps(res),
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',  # This allows CORS
            'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type'
        },
    }


def lambda_handler(event, context):
    '''Handles updating a hit counter in a DynamoDB table.'''

    print("Received event: " + json.dumps(event, indent=2))

    if event['httpMethod'] == 'OPTIONS':
        return respond(None, "OK")

    if event['httpMethod'] != 'POST':
        return respond(ValueError('Unsupported method "{}"'.format(event['httpMethod'])))

    try:
        response = dynamo.update_item(
            TableName=TABLE_NAME,
            Key={PRIMARY_KEY: {'S': PAGE_ID_VALUE}},
            UpdateExpression='SET {} = if_not_exists({}, :start) + :incr'.format(COUNTER_ATTRIBUTE, COUNTER_ATTRIBUTE),
            ExpressionAttributeValues={
                ':incr': {'N': '1'},
                ':start': {'N': '0'}
            },
            ReturnValues='UPDATED_NEW'
        )

        updated_hits = response['Attributes'][COUNTER_ATTRIBUTE]['N']

        return respond(None, {"updated_hits": int(updated_hits)})
    except Exception as e:
        return respond(e)


*/
