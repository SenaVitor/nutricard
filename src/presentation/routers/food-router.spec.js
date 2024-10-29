const FoodRouter = require('./food-router');
const { MissingParamError, InvalidParamError } = require('../../utils/errors');
const { ServerError } = require('../errors');

describe('API Router', () => {
  const makeSut = () => {
      const sut = new FoodRouter()
      return {
          sut
      }
  }

  test('Should return 400 if no apiKey is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        foodId: 'any_foodId'
      }
    }
    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('apiKey'))
  });

  test('Should return 400 if no foodId is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        apiKey: 'any_apiKey'
      }
    }
    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('foodId'))
  });

  test('Should return 500 if no httpRequest is provided', async () => {
    const { sut } = makeSut();
    const httpResponse = await sut.route();
    expect(httpResponse.statusCode).toBe(500);
    expect(httpResponse.body).toEqual(new ServerError());
  });
    
  test('Should return 500 if httpRequest has no body', async () => {
    const { sut } = makeSut();
    const httpResponse = await sut.route({});
    expect(httpResponse.statusCode).toBe(500);
    expect(httpResponse.body).toEqual(new ServerError());
  });

  test('Should return 200 when valid credentials are provided', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        apiKey: 'valid_apiKey',
        foodId: 'valid_foodId'
      }
    }
    const httpResponse = await sut.route(httpRequest);
    expect(httpResponse.statusCode).toBe(200);
  });
});
