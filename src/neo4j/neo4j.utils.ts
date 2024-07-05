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
    Buronan: '#ff3232',
    TTL: '#FFD9B3',
    NIK: '#FFFFB3',
    NPWP: '#B3FFB3',
    KK: '#B3FFFF',
    NO_REKENING: '#32FFFF',
    NO_CC: '#E6B3E6',
    NO_HP: '#329932',
    EMAIL: '#D9B3B3',
    Keluarga: '#1919FF',
    Contact_Phone: '#FFA500',
    Transaction_Mutation: '#329932',
  },
};

export function formatResponse(records: any[]): any {
  const nodes = new Map();
  const edges = new Map<string, any>();

  records.forEach((record) => {
    if (record && record._fields) {
      record._fields.forEach((_field) => {
        if (_field && _field.segments) {
          _field.segments.forEach((segments) => {
            if (
              segments &&
              segments.start &&
              segments.end &&
              segments.relationship
            ) {
              const startNode = segments.start;
              const endNode = segments.end;
              const relationship = segments.relationship;

              const startNodeLabels = startNode.labels || [];
              const endNodeLabels = endNode.labels || [];

              startNodeLabels.forEach((label: string) => {
                if (startNode && !nodes.has(startNode.elementId)) {
                  nodes.set(startNode.elementId, {
                    id: startNode.elementId,
                    label: startNodeLabels,
                    properties: startNode.properties,
                    icon: meta.node_icon[label],
                    color: meta.node_color[label],
                    title: label,
                  });
                }
              });

              endNodeLabels.forEach((label: string) => {
                if (endNode && !nodes.has(endNode.elementId)) {
                  nodes.set(endNode.elementId, {
                    id: endNode.elementId,
                    label: endNodeLabels,
                    properties: endNode.properties,
                    icon: meta.node_icon[label],
                    color: meta.node_color[label],
                    title: label,
                  });
                }
              });

              if (relationship) {
                if (!edges.has(relationship.elementId)) {
                  edges.set(relationship.elementId, {
                    id: relationship.elementId,
                    from: relationship.startNodeElementId,
                    to: relationship.endNodeElementId,
                    label: relationship.type,
                    // properties: relationship.properties,
                  });
                }
              }
            }
          });
        }
      });
    }
  });
  const uniqueEdges = Array.from(edges.values());

  return { nodes: Array.from(nodes.values()), edges: uniqueEdges, meta };
}
