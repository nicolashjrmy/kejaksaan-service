import {
  Controller,
  Get,
  Post,
  UseGuards,
  Param,
  Body,
  Query,
} from '@nestjs/common';
import { Neo4jService } from 'src/neo4j/neo4j.service';
import { formatResponse } from 'src/neo4j/neo4j.utils';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { platform } from 'os';
import { query } from 'express';

@UseGuards(JwtAuthGuard)
@Controller('perjalanan-buronan')
export class PerjalananBuronanController {
  constructor(private readonly neo4jService: Neo4jService) {}

  @Get('suspect-journey')
  async getSuspectJourney() {
    const result = await this.neo4jService.read(
      `match p1=(a)-[:TIMELINE]->(b) 
        with p1,a,
        case when $neodash_custom1='' then a.timestamp else $neodash_custom1 end as rule1
        where a.timestamp=rule1 or b.timestamp=rule1
        return p1`,
    );
    const formatResult = formatResponse(result.records);
    return formatResult;
  }

  @Get('date-filter')
  async getDateFilter() {
    const result = await this.neo4jService.read(
      `MATCH (ca:Call_Suspicious)
      return distinct ca.timestamp`,
    );
    return result.records.map((record) => ({
      Tanggal: record.get('ca.timestamp'),
    }));
  }

  @Get('sus-number')
  async getSusNumber() {
    const result = await this.neo4jService.read(
      `match (a)-[:CALLED]->(c:Call_Suspicious)-[:RECEIVED_BY]->(b)
        with a,b,
        case when $neodash_custom1='' then c.timestamp else $neodash_custom1 end as rule1
        where c.timestamp=rule1
        return a.phone_number as Caller, b.phone_number as Recipient`,
    );
    return result.records.map((record) => ({
      Caller: record.get('Caller'),
      No_Telfon: record.get('Recipient'),
    }));
  }

  @Get('graph-network')
  async getGraphNetwork() {
    const result = await this.neo4jService.read(
      `MATCH p1=()--(a)-[r:TIMELINE]->(b)--()
        with p1,a,b,
        case when $neodash_custom1='' then b.timestamp else $neodash_custom1 end as rule1
        where none(z in nodes(p1) where z:Post) and b.timestamp=rule1 or a.timestamp=rule1
        RETURN p1`,
    );
    const formatResult = formatResponse(result.records);
    return formatResult;
  }
}
