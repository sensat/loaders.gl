import { ExcelLoader as ExcelWorkerLoader } from './excel-loader';
import { parseExcel } from './lib/parse-excel';
export { ExcelWorkerLoader };
export const ExcelLoader = {
  ...ExcelWorkerLoader,
  async parse(arrayBuffer, options) {
    const data = parseExcel(arrayBuffer, options);
    return {
      shape: 'object-row-table',
      data
    };
  }
};
//# sourceMappingURL=index.js.map