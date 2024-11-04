const FoodRouter = require('../presentation/routers/food-router');
const app = require('./config/app');

app.listen(3000, () => console.log('Server running'));

const foodRouter = new FoodRouter();
const httpRequest = {
    body: {
        query: 'appl',
        numberOfResults: 1
    }
}
const httpResponse = foodRouter.route(httpRequest);
console.log("httpResponse " + JSON.stringify(httpResponse));