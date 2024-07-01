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
  },
  node_color: {
    Buronan: '#FF0000',
    TTL: '#FFA500',
    NIK: '#FFFF00',
    NPWP: '#008000',
    KK: '#00FFFF',
    NO_REKENING: '#0000FF',
    NO_CC: '#800080',
    NO_HP: '#FFC0CB',
    EMAIL: '#A52A2A',
    Keluarga: '#808080',
  },
};

export function formatResponse(records: any[]): any {
  const nodes = new Map();
  const edges = [];

  records.forEach((record) => {
    record._fields.forEach((_field) => {
      _field.segments.forEach((segment) => {
        const startNode = segment.start;
        const endNode = segment.end;
        const relationship = segment.relationship;

        const startNodeLabels = startNode.labels;
        const endNodeLabels = endNode.labels;

        startNodeLabels.forEach((label: string) => {
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
        });

        endNodeLabels.forEach((label: string) => {
          if (!nodes.has(endNode.elementId)) {
            nodes.set(endNode.elementId, {
              id: endNode.elementId,
              label: endNode.labels,
              properties: endNode.properties,
              icon: meta.node_icon[label],
              color: meta.node_color[label],
              title: startNode.labels,
            });
          }
        });

        edges.push({
          id: relationship.elementId,
          from: relationship.startNodeElementId,
          to: relationship.endNodeElementId,
          // label: relationship.type,
          properties: relationship.properties,
        });
      });
    });
  });

  return { nodes: Array.from(nodes.values()), edges, meta };
}
