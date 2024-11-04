const FoodRouter = require('../presentation/routers/food-router');
const env = require('./config/env');
const app = require('./config/app');

app.listen(env.port, () => console.log(`Server running at http://localhost:${env.port}`));

const foodRouter = new FoodRouter();
const httpRequest = {
    body: {
        query: 'appl',
        numberOfResults: 1
    }
}
const httpResponse = foodRouter.route(httpRequest);
console.log("httpResponse " + JSON.stringify(httpResponse));