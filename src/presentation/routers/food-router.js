const axios = require('axios');
const env = require('../../main/config/env');
const HttpResponse = require('../helpers/http-response');
const { MissingParamError, InvalidParamError } = require('../../utils/errors');

module.exports = class FoodRouter {
  apiKey = env.apiKey;
  async route (httpRequest) {
    try {
      const { query, numberOfResults } = httpRequest.body;
      if (!this.apiKey) {
        console.error("apiKey não definida: " + this.apiKey);
        return HttpResponse.serverError();
      }
      if (!query) {
        return HttpResponse.badRequest(new MissingParamError('query'));
      }
      if (!numberOfResults) {
        return HttpResponse.badRequest(new MissingParamError('numberOfResults'));
      }
      return this.getIngredientInfo(query, numberOfResults);
    } catch (error) {
      return HttpResponse.serverError();
    }
  }

  async getIngredientInfo(query, numberOfResults) {
    try {
      const url = 'https://api.spoonacular.com/food/ingredients/autocomplete?query=' + query + '&number=' + numberOfResults;
      console.log(url);
      const response = await axios.get(url, {
        params: {
          amount: 1,
          apiKey: this.apiKey
        }
      });
      console.log(response.data);
      return HttpResponse.ok(response);
    } catch (error) {
      console.error('Erro ao fazer a requisição:', error.message);
      return error;
    }
  }
}