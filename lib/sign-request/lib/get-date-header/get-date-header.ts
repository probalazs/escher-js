import { EscherConfig, RequestHeader } from '../../../interface';
import { pipe, trim, toLower } from 'ramda';
import { convertToAwsLongDate } from '../convert-to-aws-long-date';
const formatDate = require('dateformat');

export type GetDateHeader = (config: EscherConfig, date: Date) => RequestHeader;

export const getDateHeader: GetDateHeader = (config, date) => {
  const headerName = getHeaderName(config);
  const headerValue = getHeaderValue(date, headerName);
  return [headerName, headerValue];
};

function getHeaderName(config: EscherConfig): string {
  return pipe(
    trim,
    toLower,
  )(config.dateHeaderName);
}

function getHeaderValue(date: Date, headerName: string): string {
  return headerName === 'date' ? formatDate(date, 'GMT:ddd, dd mmm yyyy HH:MM:ss Z', true) : convertToAwsLongDate(date);
}
