const FoodRouter = require('../presentation/routers/food-router');
const app = require('express')();

app.listen(3000, () => console.log('Server running'));

const foodRouter = new FoodRouter();
const httpRequest = {
    body: {
        apiKey: 'key',
        query: 'appl'
    }
}
const httpResponse = foodRouter.route(httpRequest);
console.log(httpResponse)