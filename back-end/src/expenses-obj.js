// Suggested by ChatGPT (GPT 3.5)
function generateObjectId() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
        const r = (Math.random() * 16) | 0,
            v = c === "x" ? r : (r & 0x3) | 0x8;
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
            userId: "1",
            name: "Groceries",
            createdAt: "2023-03-15T08:30:00.000Z",
        },
        {
            userId: "1",
            name: "Entertainment",
            createdAt: "2023-03-15T08:30:00.000Z",
        },
        {
            userId: "1",
            name: "Dining Out",
            createdAt: "2023-03-15T08:30:00.000Z",
        },
        {
            userId: "1",
            name: "Transportation",
            createdAt: "2023-03-15T08:30:00.000Z",
        },
        {
            userId: "1",
            name: "Games",
            createdAt: "2023-03-15T08:30:00.000Z",
        },
    ],
    "budgetDetails": [
        {
            budgetId: ObjectId("65308fdab6497f11c59cebaf"),
            limit: 350,
            month: 9,
            year: 2023,
        },
        {
            budgetId: ObjectId("65308fdab6497f11c59cebb0"),
            limit: 650,
            month: 9,
            year: 2023,
        },
        {
            budgetId: ObjectId("65308fdab6497f11c59cebb1"),
            limit: 380,
            month: 9,
            year: 2023,
        },
        {
            budgetId: ObjectId("65308fdab6497f11c59cebb2"),
            limit: 500,
            month: 9,
            year: 2023,
        },
        {
            budgetId: ObjectId("65308fdab6497f11c59cebb3"),
            limit: 125,
            month: 9,
            year: 2023,
        },
        {
            budgetId: ObjectId("65308fdab6497f11c59cebb2"),
            limit: 500,
            month: 8,
            year: 2023,
        },
        {
            budgetId: ObjectId("65308fdab6497f11c59cebb3"),
            limit: 125,
            month: 8,
            year: 2023,
        },
    ]
}