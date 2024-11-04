const FoodRouterComposer = require('../composers/food-router-composer');
const { adapt } = require('../adapters/express-router-adapter');

module.exports = router => {
    router.get('/food', adapt(FoodRouterComposer.compose()));
}