def handler(event, context):
    print(event)
    x = event['number']
    x = int(x)
    result = x % 2
    return {
        'message': "Return mod 2 result!",
        'status': 'SUCCEEDED',
        'number': x,
        'result': result
    }
