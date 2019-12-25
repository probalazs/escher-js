import { EscherConfig, Request } from '../../interface';
import { getEscherConfig, checkPartialEscherConfig } from './lib';
import { validateMandatorySignedHeaders } from '../validate-mandatory-signed-headers';
import { validateRequest } from '../validate-request';
import { signRequest } from '../sign-request';
import { presignUrl } from '../presign-url';
const DeprecatedEscher = require('./deprecated-escher');

export class Escher {
  private _config: EscherConfig;

  constructor(partialConfig?: any) {
    checkPartialEscherConfig(partialConfig);
    this._config = getEscherConfig(partialConfig);
  }

  preSignUrl(url: string, expiration: number): string {
    return presignUrl(this._config, url, expiration, new Date());
  }

  signRequest(requestOptions: any, body: any, headersToSign: any): any {
    return signRequest(this._config, requestOptions, body, headersToSign);
  }

  authenticate(request: any, keyDB: any, mandatorySignedHeaders: any): any {
    return new DeprecatedEscher(this._config).authenticate(request, keyDB, mandatorySignedHeaders);
  }

  validateRequest(request: Request, body?: any): void {
    validateRequest(request, body);
  }

  validateMandatorySignedHeaders(headers?: any): void {
    validateMandatorySignedHeaders(headers);
  }

  public static create(configToMerge?: Partial<EscherConfig>): any {
    return new Escher(configToMerge);
  }
}
