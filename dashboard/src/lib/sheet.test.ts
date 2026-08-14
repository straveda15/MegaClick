import { describe, expect, it } from 'vitest';
import * as XLSX from 'xlsx';
import { parseSheetFile } from './sheet';

const COLUMNS = [
  { key: 'serviceTitle' as const, header: 'Service', aliases: ['service name'] },
  { key: 'clientName' as const, header: 'Client', aliases: ['client name', 'customer'] },
  { key: 'clientPhone' as const, header: 'Client Phone', aliases: ['phone', 'mobile no'] },
  { key: 'dueAt' as const, header: 'Deadline', aliases: ['due date'] },
];

const csvFile = (contents: string) =>
  new File([contents], 'test.csv', { type: 'text/csv' });

/** Builds a real .xlsx File from a 2D grid, the way a client's Excel export looks. */
const xlsxFile = (grid: unknown[][]) => {
  const book = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(book, XLSX.utils.aoa_to_sheet(grid), 'Sheet1');
  const buffer = XLSX.write(book, { bookType: 'xlsx', type: 'array' }) as ArrayBuffer;
  return new File([buffer], 'test.xlsx', {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
};

describe('parseSheetFile', () => {
  it('parses a CSV whose headers match exactly', async () => {
    const rows = await parseSheetFile(
      csvFile('Service,Client,Client Phone\nGST Registration,Rahul Singh,9876543210'),
      COLUMNS
    );

    expect(rows).toEqual([
      { serviceTitle: 'GST Registration', clientName: 'Rahul Singh', clientPhone: '9876543210' },
    ]);
  });

  it('matches headers regardless of case, spacing and punctuation', async () => {
    const rows = await parseSheetFile(
      csvFile('SERVICE NAME,client_name,Mobile No.\nTrademark,Divya Gupta,9000000000'),
      COLUMNS
    );

    expect(rows[0]).toMatchObject({
      serviceTitle: 'Trademark',
      clientName: 'Divya Gupta',
      clientPhone: '9000000000',
    });
  });

  it('skips title and blank rows sitting above the real header row', async () => {
    const rows = await parseSheetFile(
      xlsxFile([
        ['Service Register — August 2026'],
        [],
        ['Service', 'Client'],
        ['Passport', 'Rajesh Chopra'],
      ]),
      COLUMNS
    );

    expect(rows).toEqual([{ serviceTitle: 'Passport', clientName: 'Rajesh Chopra' }]);
  });

  it('ignores unrecognized columns and drops fully blank rows', async () => {
    const rows = await parseSheetFile(
      xlsxFile([
        ['Service', 'Internal Ref', 'Client'],
        ['Patent', 'XYZ-1', 'Arjun Pandey'],
        ['', '', ''],
        ['Income Tax', 'XYZ-2', 'Rohan Joshi'],
      ]),
      COLUMNS
    );

    expect(rows).toHaveLength(2);
    expect(rows[0]).not.toHaveProperty('Internal Ref');
    expect(rows[1].clientName).toBe('Rohan Joshi');
  });

  it('normalizes real Excel date cells to ISO yyyy-mm-dd', async () => {
    const rows = await parseSheetFile(
      xlsxFile([
        ['Service', 'Client', 'Deadline'],
        ['Marriage Registration', 'Pooja Mehta', new Date(Date.UTC(2026, 7, 21))],
      ]),
      COLUMNS
    );

    expect(rows[0].dueAt).toBe('2026-08-21');
  });

  it('rejects a sheet whose headers match nothing, naming what was expected', async () => {
    await expect(
      parseSheetFile(csvFile('Foo,Bar\n1,2'), COLUMNS)
    ).rejects.toThrow(/No recognizable column headers/);
  });

  it('rejects a sheet that has headers but no data rows', async () => {
    await expect(
      parseSheetFile(csvFile('Service,Client'), COLUMNS)
    ).rejects.toThrow(/No data rows/);
  });
});
