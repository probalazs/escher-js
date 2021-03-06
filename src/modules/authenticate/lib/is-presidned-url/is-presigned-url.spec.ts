import { isPresignedUrl } from './is-presigned-url';
import { createAuthenticateConfig, createParsedUrlQuery, createEscherRequest } from '../../../../factory';
import { v4 } from 'uuid';

describe('Is Presigned Url', () => {
  it('should return true when has signature query and method is GET', () => {
    const config = createAuthenticateConfig();
    const query = createParsedUrlQuery({ config, query: { Signature: v4() } });
    const request = createEscherRequest({ method: 'GET' });

    const result = isPresignedUrl(config, { query } as any, request);

    expect(result).toEqual(true);
  });

  it('should return false when method is not GET', () => {
    const request = createEscherRequest({ method: 'POST' });

    const result = isPresignedUrl(createAuthenticateConfig(), { query: createParsedUrlQuery() } as any, request);

    expect(result).toEqual(false);
  });

  it('should return false when no signature query', () => {
    const config = createAuthenticateConfig();
    const query = createParsedUrlQuery({ config, query: {} });

    const result = isPresignedUrl(config, { query } as any, createEscherRequest({ method: 'GET' }));

    expect(result).toEqual(false);
  });
});
