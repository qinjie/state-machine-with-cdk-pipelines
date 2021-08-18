
def handler(event, context):
    print(f"{event['number']} % 2 = {event['result']}")
    number = event['number']
    return {
        'status': 'SUCCEEDED',
        'number': number,
        'result': number ** 2
    }
