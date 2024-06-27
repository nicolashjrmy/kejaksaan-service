import neo4j from 'neo4j-driver';

export function createDriver(uri: string, user: string, password: string) {
  return neo4j.driver(uri, neo4j.auth.basic(user, password));
}

export function formatResponse(records: any[]): any {
  const nodes = [];
  const edges = [];

  records.forEach((record) => {
    record._fields.forEach((field) => {
      if (field.start) {
        nodes.push({
          id: field.start.identity.toString(),
          label: field.start.labels,
          properties: field.start.properties,
        });
      }
      if (field.relationship) {
        edges.push({
          id: field.relationship.identity.toString(),
          from: field.relationship.start.toString(),
          to: field.relationship.end.toString(),
          label: field.relationship.type,
          properties: field.relationship.properties,
        });
      }
      if (field.end) {
        nodes.push({
          id: field.end.identity.toString(),
          label: field.end.labels,
          properties: field.end.properties,
        });
      }
    });
  });

  return { nodes, edges };
}
