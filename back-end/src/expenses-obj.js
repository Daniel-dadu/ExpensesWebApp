// Suggested by ChatGPT (GPT 3.5)
function generateObjectId() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = (Math.random() * 16) | 0,
            v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
}

const categoryIDs = [
    generateObjectId(),
    generateObjectId(),
    generateObjectId(),
    generateObjectId(),
    generateObjectId(),
]

export const expenses = {
    "list": [
        {
            userId: "1",
            date: "2023-10-15T08:30:00.000Z",
            category: "Groceries",
            description: "Weekly grocery shopping",
            amount: 85.75,
            createdAt: "2023-03-15T08:30:00.000Z",
            updatedAt: "2023-03-15T08:30:00.000Z"
        },
        {
            userId: "1",
            date: "2023-10-18T08:30:00.000Z",
            category: "Entertainment",
            description: "Peliculita porfaaa",
            amount: 20.50,
            createdAt: "2023-03-17T19:45:00.000Z",
            updatedAt: "2023-03-17T19:45:00.000Z"
        },
        {
            userId: "1",
            date: "2023-10-13T08:30:00.000Z",
            category: "Dining Out",
            description: "Dinner at a local restaurant",
            amount: 55.00,
            createdAt: "2023-03-18T20:00:00.000Z",
            updatedAt: "2023-03-18T20:00:00.000Z"
        },
        {
            userId: "1",
            date: "2023-09-12T08:30:00.000Z",
            category: "Transportation",
            description: "A Puebla",
            amount: 5,
            createdAt: "2023-03-16T12:15:00.000Z",
            updatedAt: "2023-03-16T12:15:00.000Z"
        },
        {
            userId: "1",
            date: "2023-09-15T08:30:00.000Z",
            category: "Games",
            description: "Movies",
            amount: 49.25,
            createdAt: "2023-03-16T12:15:00.000Z",
            updatedAt: "2023-03-16T12:15:00.000Z"
        },
    ],
    "budget": [
        {
            _id: categoryIDs[0],
            userId: '5f93e3e2c4e187001cc9244a',
            name: 'Groceries',
            createdAt: new Date(),
        },
        {
            _id: categoryIDs[1],
            userId: '5f93e3e2c4e187001cc9244a',
            name: 'Entertainment',
            createdAt: new Date(),
        },
        {
            _id: categoryIDs[2],
            userId: '5f93e3e2c4e187001cc9244a',
            name: 'Dining Out',
            createdAt: new Date(),
        },
        {
            _id: categoryIDs[3],
            userId: '5f93e3e2c4e187001cc9244a',
            name: 'Transportation',
            createdAt: new Date(),
        },
        {
            _id: categoryIDs[4],
            userId: '5f93e3e2c4e187001cc9244a',
            name: 'Games',
            createdAt: new Date(),
        },
    ],
    "budgetDetails": [
        {
            _id: generateObjectId(),
            budgetId: categoryIDs[0],
            limit: 350,
            month: 9,
            year: 2023,
        },
        {
            _id: generateObjectId(),
            budgetId: categoryIDs[1],
            limit: 650,
            month: 9,
            year: 2023,
        },
        {
            _id: generateObjectId(),
            budgetId: categoryIDs[2],
            limit: 380,
            month: 9,
            year: 2023,
        },
        {
            _id: generateObjectId(),
            budgetId: categoryIDs[3],
            limit: 500,
            month: 9,
            year: 2023,
        },
        {
            _id: generateObjectId(),
            budgetId: categoryIDs[4],
            limit: 125,
            month: 9,
            year: 2023,
        },
        {
            _id: generateObjectId(),
            budgetId: categoryIDs[4],
            limit: 125,
            month: 8,
            year: 2023,
        },
    ]
}