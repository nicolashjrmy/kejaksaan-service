import { formatResponse } from './neo4j.utils';

describe('formatResponse', () => {
  it('should format the response correctly', () => {
    const mockRecords = [
      {
        _fields: [
          {
            start: {
              identity: 10013,
              labels: ['Saham'],
              properties: { securitycode: 'KBLI' },
            },
            relationship: {
              identity: 14810,
              start: 10009,
              end: 10013,
              type: 'MEMILIKI_SAHAM',
              properties: {},
            },
            end: {
              identity: 10009,
              labels: [
                'Portofolio Saham Sekuritas',
                'Portofolio_Saham_Sekuritas',
              ],
              properties: {
                nominalsheet: '155',
                securitycompanycode: 'BK',
                fairmarketvaluepertotalporto: '0.004860244123313868',
                securitytypename: 'Equity',
                liabilitiesrankingvalue: 'null',
                affiliated: 'TIDAK TERAFILIASI',
                fairmarketprice: '414',
                securitysk: '88',
                calendardate: '2021-01-04',
                periode: '20210104',
                gainperloss: '11005',
                acquisitionprice: '343',
                securitycompanysk: '727',
                securitycompanyname: 'J.P. MORGAN SEKURITAS INDONESIA',
                securitycode: 'KBLI',
                fairmarketvalue: '6417',
              },
            },
          },
        ],
      },
    ];

    const expectedResult = {
      nodes: [
        {
          id: '10013',
          label: ['Saham'],
          properties: { securitycode: 'KBLI' },
        },
        {
          id: '10009',
          label: ['Portofolio Saham Sekuritas', 'Portofolio_Saham_Sekuritas'],
          properties: {
            nominalsheet: '155',
            securitycompanycode: 'BK',
            fairmarketvaluepertotalporto: '0.004860244123313868',
            securitytypename: 'Equity',
            liabilitiesrankingvalue: 'null',
            affiliated: 'TIDAK TERAFILIASI',
            fairmarketprice: '414',
            securitysk: '88',
            calendardate: '2021-01-04',
            periode: '20210104',
            gainperloss: '11005',
            acquisitionprice: '343',
            securitycompanysk: '727',
            securitycompanyname: 'J.P. MORGAN SEKURITAS INDONESIA',
            securitycode: 'KBLI',
            fairmarketvalue: '6417',
          },
        },
      ],
      edges: [
        {
          id: '14810',
          from: '10009',
          to: '10013',
          label: 'MEMILIKI_SAHAM',
          properties: {},
        },
      ],
    };

    const result = formatResponse(mockRecords);
    console.log(result);
    expect(result).toEqual(expectedResult);
  });
});
