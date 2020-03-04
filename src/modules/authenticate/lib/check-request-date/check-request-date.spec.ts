import { pipe, toPairs, fromPairs, map } from 'ramda';
import { v4 } from 'uuid';
import { ParsedUrlQuery } from 'querystring';
import { checkRequestDate } from './check-request-date';

describe('Check Request Date', () => {
  it('should throw error when query date and date in credentials are not the same', () => {
    const config = createConfig();
    const query = createParsedUrlQuery({
      query: createQuery({ Credentials: 'AKIDEXAMPLE/19000210/escher_request', Date: '99990210T011703Z' }),
      config,
    });
    expect(() => checkRequestDate(config, query, new Date())).toThrow(
      new Error('Invalid date in authorization header, it should equal with date header'),
    );
  });

  it('should not throw error when query date and date in credentials are the same', () => {
    const config = createConfig();
    const query = createParsedUrlQuery({
      query: createQuery({ Credentials: 'AKIDEXAMPLE/19780210/escher_request', Date: '19780210T011703Z' }),
      config,
    });
    expect(() => checkRequestDate(config, query, new Date('1978 02 10 01:17:03 GMT'))).not.toThrow();
  });

  it('should throw error when query date expired', () => {
    const config = createConfig();
    const query = createParsedUrlQuery({
      query: createQuery({
        Credentials: 'AKIDEXAMPLE/19780210/escher_request',
        Date: '19780210T011703Z',
        Expires: 1000,
      }),
      config,
    });
    expect(() => checkRequestDate(config, query, new Date('1978 02 10 02:17:03 GMT'))).toThrow(
      new Error('The request date is not within the accepted time range'),
    );
  });

  it('should not throw error when query date not expired', () => {
    const config = createConfig();
    const query = createParsedUrlQuery({
      query: createQuery({
        Credentials: 'AKIDEXAMPLE/19780210/escher_request',
        Date: '19780210T011703Z',
        Expires: 1000,
      }),
      config,
    });
    expect(() => checkRequestDate(config, query, new Date('1978 02 10 01:17:03 GMT'))).not.toThrow();
  });
});

function createParsedUrlQuery({ query = {}, config = createConfig() } = {}): ParsedUrlQuery {
  return (pipe as any)(toPairs, map(([key, value]: any) => [`X-${config.vendorKey}-${key}`, value]), fromPairs)(query);
}

function createQuery(override = {}): object {
  return { Credentials: 'AKIDEXAMPLE/19780210/escher_request', Date: '19780210T011703Z', Expires: 1000, ...override };
}

function createConfig({ vendorKey = v4(), clockSkew = 0 } = {}): any {
  return { vendorKey, clockSkew };
}
