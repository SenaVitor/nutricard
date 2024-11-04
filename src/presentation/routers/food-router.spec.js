const FoodRouter = require('./food-router');
const { MissingParamError, InvalidParamError } = require('../../utils/errors');
const { ServerError } = require('../errors');
const { apiKey } = require('../../main/config/env');

describe('Food Router', () => {
  const makeSut = () => {
      const sut = new FoodRouter();
      return {
          sut
      }
  }

  test('Should return 400 if no query is provided', async () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        numberOfResults: 10
      }
    }
    const httpResponse = await sut.route(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamError('query'));
  });
  
  test('Should return 400 if no numberOfResults is provided', async () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        query: 'valid_query'
      }
    }
    const httpResponse = await sut.route(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamError('numberOfResults'));
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
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        query: 'valid_query',
        numberOfResults: 1
      }
    }
    const httpResponse = await sut.route(httpRequest);
    console.log(httpResponse);
    expect(httpResponse.statusCode).toBe(200);
  });
});
