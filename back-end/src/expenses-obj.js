// Suggested by ChatGPT (GPT 3.5)
function generateObjectId() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = (Math.random() * 16) | 0,
            v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
}

export const expenses = {
    "list": [
        {
            _id: generateObjectId(),
            "userId": "5f93e3e2c4e187001cc92448",
            "date": new Date(2023, 9, 7),
            "category": "Groceries",
            "description": "Weekly grocery shopping",
            "amount": 85.75,
            "createdAt": "2023-03-15T08:30:00.000Z",
            "updatedAt": "2023-03-15T08:30:00.000Z"
        },
        {
            _id: generateObjectId(),
            "userId": "5f93e3e2c4e187001cc9244c",
            "date": new Date(2023, 9, 5),
            "category": "Entertainment",
            "description": "Peliculita porfaaa",
            "amount": 20.50,
            "createdAt": "2023-03-17T19:45:00.000Z",
            "updatedAt": "2023-03-17T19:45:00.000Z"
        },
        {
            _id: generateObjectId(),
            "userId": "5f93e3e2c4e187001cc9244e",
            "date": new Date(2023, 9, 3),
            "category": "Dining Out",
            "description": "Dinner at a local restaurant",
            "amount": 55.00,
            "createdAt": "2023-03-18T20:00:00.000Z",
            "updatedAt": "2023-03-18T20:00:00.000Z"
        },
        {
            _id: generateObjectId(),
            "userId": "5f93e3e2c4e187001cc9244a",
            "date": new Date(2023, 9, 1),
            "category": "Transportation",
            "description": "Gasoline refill",
            "amount": 45.25,
            "createdAt": "2023-03-16T12:15:00.000Z",
            "updatedAt": "2023-03-16T12:15:00.000Z"
        },
        {
            _id: generateObjectId(),
            "userId": "5f93e3e2c4e187001cc9244a",
            "date": new Date(2023, 8, 1),
            "category": "Transportation",
            "description": "A Puebla",
            "amount": 5,
            "createdAt": "2023-03-16T12:15:00.000Z",
            "updatedAt": "2023-03-16T12:15:00.000Z"
        },
        {
            _id: generateObjectId(),
            "userId": "5f93e3e2c4e187001cc9244a",
            "date": new Date(2023, 8, 5),
            "category": "Games",
            "description": "Movies",
            "amount": 49.25,
            "createdAt": "2023-03-16T12:15:00.000Z",
            "updatedAt": "2023-03-16T12:15:00.000Z"
        },
    ],
    "categories": [
        {
            _id: generateObjectId(),
            userId: '5f93e3e2c4e187001cc9244a',
            name: 'Groceries',
            limit: 500,
            month: 9,
            year: 2023,
            createdAt: new Date(),
        },
        {
            _id: generateObjectId(),
            userId: '5f93e3e2c4e187001cc9244a',
            name: 'Entertainment',
            limit: 200,
            month: 9,
            year: 2023,
            createdAt: new Date(),
        },
        {
            _id: generateObjectId(),
            userId: '5f93e3e2c4e187001cc9244a',
            name: 'Dining Out',
            limit: 300,
            month: 9,
            year: 2023,
            createdAt: new Date(),
        },
        {
            _id: generateObjectId(),
            userId: '5f93e3e2c4e187001cc9244a',
            name: 'Transportation',
            limit: 900,
            month: 9,
            year: 2023,
            createdAt: new Date(),
        },
        {
            _id: generateObjectId(),
            userId: '5f93e3e2c4e187001cc9244a',
            name: 'Games',
            limit: 350,
            month: 9,
            year: 2023,
            createdAt: new Date(),
        },
    ]
}