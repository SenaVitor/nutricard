const foodRouter = require('../composers/food-router-composer');
const ExpressRouterAdapter = require('../adapters/express-router-adapter');

module.exports = router => {
    router.get('/food', ExpressRouterAdapter.adapt(foodRouter));
}