import { getQueryPart } from './get-query-part';
import { v4 } from 'uuid';
import { createAuthenticateConfig } from '../../../../factory';

describe('Get Query Part', () => {
  it('should return existing query value', () => {
    const vendorKey = v4();
    const key = v4();
    const value = v4();
    const config = createAuthenticateConfig({ vendorKey });
    const query = { [`X-${vendorKey}-${key}`]: value };

    const result = getQueryPart(config, query, key);

    expect(result).toEqual(value);
  });

  it('should return empty string when query key is not exists', () => {
    const key = v4();
    const query = {};

    const result = getQueryPart(createAuthenticateConfig({ vendorKey: v4() }), query, key);

    expect(result).toEqual('');
  });
});
