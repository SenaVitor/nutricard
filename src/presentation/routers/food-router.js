const axios = require('axios');
const HttpResponse = require('../helpers/http-response')
const { MissingParamError, InvalidParamError } = require('../../utils/errors')

module.exports = class FoodRouter {
  async route (httpRequest) {
    try {
      const {apiKey, foodId} = httpRequest.body;
      if (!apiKey) {
        return HttpResponse.badRequest(new MissingParamError('apiKey'));
      }
      if (!foodId) {
        return HttpResponse.badRequest(new MissingParamError('foodId'));
      }
      this.getIngredientInfo(apiKey, foodId);
    } catch (error) {
      return HttpResponse.serverError();
    }
  }

  async getIngredientInfo(apiKey, foodId) {
    try {
      const url = 'https://api.spoonacular.com/food/ingredients/' + foodId + '/information';
      const response = await axios.get(url, {
        params: {
          amount: 1,
          apiKey: apiKey
        }
      });

      console.log(response.data);
      return HttpResponse.ok(response);
    } catch (error) {
      console.error('Erro ao fazer a requisição:', error.message);
    }
  }
}