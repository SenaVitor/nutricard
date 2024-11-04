const foodRouter = require('../composers/food-router-composer');

module.exports = router => {
    router.get('/food', foodRouter);
}