const axios = require('axios');
const HttpResponse = require('../helpers/http-response')
const { MissingParamError, InvalidParamError } = require('../../utils/errors')

module.exports = class FoodRouter {
  async route (httpRequest) {
    try {
      const {apiKey, query} = httpRequest.body;
      if (!apiKey) {
        return HttpResponse.badRequest(new MissingParamError('apiKey'));
      }
      if (!query) {
        return HttpResponse.badRequest(new MissingParamError('query'));
      }
      this.getIngredientInfo(apiKey, query);
    } catch (error) {
      return HttpResponse.serverError();
    }
  }

  async getIngredientInfo(apiKey, query) {
    try {
      const number = 10;
      const url = 'https://api.spoonacular.com/food/ingredients/autocomplete?query=' + query + '&number=' + number;
      console.log(url);
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