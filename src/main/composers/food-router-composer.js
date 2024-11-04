const FoodRouter = require('../../presentation/routers/food-router');

module.exports = class FoodRouterComposer {
    static compose() {
        return new FoodRouter();
    }
}
