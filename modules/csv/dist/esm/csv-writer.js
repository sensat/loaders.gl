import { encodeTableAsCSV } from './lib/encoders/encode-csv';
const DEFAULT_WRITER_OPTIONS = {
  csv: {
    useDisplayNames: false
  },
  useDisplayNames: false
};
export const CSVWriter = {
  id: 'csv',
  version: 'latest',
  module: 'csv',
  name: 'CSV',
  extensions: ['csv'],
  mimeTypes: ['text/csv'],
  options: DEFAULT_WRITER_OPTIONS,
  text: true,
  encode: async (table, options) => new TextEncoder().encode(encodeTableAsCSV(table, options)).buffer,
  encodeText: (table, options) => encodeTableAsCSV(table, options)
};
//# sourceMappingURL=csv-writer.js.map