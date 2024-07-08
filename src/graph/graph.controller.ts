import {
  Controller,
  Get,
  Post,
  UseGuards,
  Param,
  Body,
  Query,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { formatResponse } from 'src/neo4j/neo4j.utils';
import { Neo4jService } from 'src/neo4j/neo4j.service';
import { Relationship, Result } from 'neo4j-driver';

UseGuards(JwtAuthGuard);
@Controller('graph')
export class GraphController {
  constructor(private readonly neo4jService: Neo4jService) {}

  @Get('expand-list')
  async getExpandList(@Param('id') id: string) {
    const result = await this.neo4jService.read(
      `match p = (n)-[r]-()
        where elementId(n) = "${id}"
        return type(r), count(r)`,
    );
    return result.records.map((record) => ({
      Relationship: record.get('type(r)'),
      Jumlah: record.get('count(r)').low,
    }));
  }

  @Get('expand')
  async getExpand(@Param('id') id: string, @Param('rel') rel: string) {
    const result = await this.neo4jService.read(
      `match p = (n)-[r]-()
        where elementId(n) = "${id}" and type(r) = "${rel}" 
        return p`,
    );
    const formatResult = formatResponse(result.records);
    return formatResult;
  }
}
