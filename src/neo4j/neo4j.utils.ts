import neo4j from 'neo4j-driver';

export function createDriver(uri: string, user: string, password: string) {
  return neo4j.driver(uri, neo4j.auth.basic(user, password));
}

const meta = {
  node_icon: {
    Buronan: '/buronan.svg',
    TTL: '/ttl.svg',
    NIK: '/nik.svg',
    NPWP: '/npwp.svg',
    KK: '/kk.svg',
    NO_REKENING: '/norek.svg',
    NO_CC: '/nocc.svg',
    NO_HP: '/nohp.svg',
    EMAIL: '/email.svg',
    Keluarga: '/keluarga.svg',
    Contact_Phone: '/nohp.svg',
    Transaction_Mutation: '/nocc.svg',
  },
  node_color: {
    Buronan: '#FFB3B3',
    TTL: '#FFD9B3',
    NIK: '#FFFFB3',
    NPWP: '#B3FFB3',
    KK: '#B3FFFF',
    NO_REKENING: '#B3B3FF',
    NO_CC: '#E6B3E6',
    NO_HP: '#FFE6F2',
    EMAIL: '#D9B3B3',
    Keluarga: '#FFB3FF',
    Contact_Phone: '#B3FFB3',
    Transaction_Mutation: '#FFE6F2',
  },
};

export function formatResponse(records: any[]): any {
  if (!records || !Array.isArray(records)) {
    return { nodes: [], edges: [], meta };
  }
  const nodes = new Map();
  const edges = [];

  for (const record of records) {
    if (!record || !record._fields || !Array.isArray(record._fields)) {
      console.error('Invalid record:', record);
      continue;
    }

    for (const _field of record._fields) {
      if (!_field || !_field.segments || !Array.isArray(_field.segments)) {
        console.error('Invalid _field:', _field);
        continue;
      }

      for (const segment of _field.segments) {
        if (
          !segment ||
          !segment.start ||
          !segment.end ||
          !segment.relationship
        ) {
          console.error('Invalid segment:', segment);
          continue;
        }

        const startNode = segment.start;
        const endNode = segment.end;
        const relationship = segment.relationship;

        if (
          !startNode.labels ||
          !Array.isArray(startNode.labels) ||
          !endNode.labels ||
          !Array.isArray(endNode.labels)
        ) {
          console.error(
            'Invalid node labels:',
            startNode.labels,
            endNode.labels,
          );
          continue;
        }

        for (const label of startNode.labels) {
          if (!nodes.has(startNode.elementId)) {
            nodes.set(startNode.elementId, {
              id: startNode.elementId,
              label: startNode.labels,
              properties: startNode.properties,
              icon: meta.node_icon[label],
              color: meta.node_color[label],
              title: startNode.labels,
            });
          }
        }

        for (const label of endNode.labels) {
          if (!nodes.has(endNode.elementId)) {
            nodes.set(endNode.elementId, {
              id: endNode.elementId,
              label: endNode.labels,
              properties: endNode.properties,
              icon: meta.node_icon[label],
              color: meta.node_color[label],
              title: endNode.labels,
            });
          }
        }

        edges.push({
          id: relationship.elementId,
          from: relationship.startNodeElementId,
          to: relationship.endNodeElementId,
          // label: relationship.type,
          // properties: relationship.properties,
        });
      }
    }
  }

  return { nodes: Array.from(nodes.values()), edges, meta };
}
