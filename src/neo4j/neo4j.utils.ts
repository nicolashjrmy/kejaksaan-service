import neo4j from 'neo4j-driver';

export function createDriver(uri: string, user: string, password: string) {
  return neo4j.driver(uri, neo4j.auth.basic(user, password));
}

export function formatResponse(records: any[]): any {
  const nodes = new Map();
  const edges = [];

  records.forEach((record) => {
    record._fields.forEach((_field) => {
      _field.segments.forEach((segment) => {
        const startNode = segment.start;
        const endNode = segment.end;
        const relationship = segment.relationship;

        if (!nodes.has(startNode.elementId)) {
          nodes.set(startNode.elementId, {
            id: startNode.elementId,
            label: startNode.labels,
            properties: startNode.properties,
          });
        }

        if (!nodes.has(endNode.elementId)) {
          nodes.set(endNode.elementId, {
            id: endNode.elementId,
            label: endNode.labels,
            properties: endNode.properties,
          });
        }

        edges.push({
          id: relationship.elementId,
          from: relationship.startNodeElementId,
          to: relationship.endNodeElementId,
          label: relationship.type,
          properties: relationship.properties,
        });
      });
    });
  });

  return { nodes: Array.from(nodes.values()), edges };
}

// export function returnMeta()
