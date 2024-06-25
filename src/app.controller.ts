import { Controller, Get, UseGuards } from '@nestjs/common';
import { Neo4jService } from './neo4j/neo4j.service';
import { JwtAuthGuard } from './auth/jwt-auth.guard';

@Controller()
export class AppController {
  constructor(private readonly neo4jService: Neo4jService) {}

  @UseGuards(JwtAuthGuard)
  @Get('nodes')
  async getNodes() {
    const result = await this.neo4jService.read('MATCH (n) RETURN n LIMIT 25');
    return result.records.map((record) => record.get('n').properties);
  }

  @Get('suspects')
  async getSuspects() {
    const result = await this.neo4jService.read(
      'MATCH (n:Account) RETURN count(n) AS count',
    );
    return result.records.map(record => record.get('count').low);
  }

  @Get('numbers')
  async getNumbers() {
    const result = await this.neo4jService.read(
      'MATCH (n:PhoneNumber) RETURN count(n) AS count',
    );
    return result.records.map(record => record.get('count').low);
  }

  @Get('calls')
  async getCalls() {
    const result = await this.neo4jService.read(
      'MATCH (n:Call) RETURN count(n) AS count',
    );
    return result.records.map(record => record.get('count').low);
  }
}
