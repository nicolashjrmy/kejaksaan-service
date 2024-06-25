import { Controller, Get } from '@nestjs/common';
import { Neo4jService } from './neo4j/neo4j.service';

@Controller()
export class AppController {
  constructor(private readonly neo4jService: Neo4jService) {}

  @Get('nodes')
  async getNodes() {
    const result = await this.neo4jService.read('MATCH (n) RETURN n LIMIT 25');
    return result.records.map((record) => record.get('n').properties);
  }
}
