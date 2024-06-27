import { Controller, Get, Post, UseGuards } from '@nestjs/common';
import { Neo4jService } from './neo4j/neo4j.service';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { formatResponse } from './neo4j/neo4j.utils';

@UseGuards(JwtAuthGuard)
@Controller()
export class AppController {
  constructor(private readonly neo4jService: Neo4jService) {}

  @Get('nodes')
  async getNodes() {
    const result = await this.neo4jService.read('MATCH (n) RETURN n LIMIT 25');
    return result.records.map((record) => record.get('n').properties);
  }

  @Get('suspects')
  async getSuspects() {
    const result = await this.neo4jService.read(
      'MATCH (n:Buronan) RETURN count(n) AS count',
    );
    return result.records.map((record) => record.get('count').low);
  }

  @Get('numbers')
  async getNumbers() {
    const result = await this.neo4jService.read(
      'MATCH (n:NO_HP) RETURN count(n) AS count',
    );
    return result.records.map((record) => record.get('count').low);
  }

  @Get('calls')
  async getCalls() {
    const result = await this.neo4jService.read(
      'MATCH (n:Call) RETURN count(n) AS count',
    );
    return result.records.map((record) => record.get('count').low);
  }

  @Get('loc-buronan')
  async getLocationBuronan() {
    const result = await this.neo4jService.read(
      'match p=(:Buronan)-[]-() where none(z in nodes(p) where z:Website) return p',
    );
    return result.records.map((record) => record.get('p').properties);
  }

  @Get('one-buron')
  async getOneBuron() {
    const result = await this.neo4jService.read(
      'MATCH (n:Buronan) RETURN n LIMIT 1',
    );
    return result.records.map((record) => record.get('n').properties);
  }

  @Get('graph-website')
  async getGraphWebsite() {
    const result = await this.neo4jService.read(
      `match p=(:Buronan)-[]-() 
      where none(z in nodes(p) where z:Website) 
      return p`,
    );
    const formatResult = formatResponse(result.records);
    return formatResult;
  }

  @Get('transaksi-bank')
  async getTransaksiBank() {
    const result = await this.neo4jService.read(
      `MATCH p=(a{no_rekening:$neodash_norek})-[r:HAS_TRANSACTION]->(b) RETURN a.no_rekening,b.tx_date,b.type,b.vendor
order by b.tx_date desc`,
    );
    return result.records.map((record) => record.get('p'));
  }

  @Get('graph-email')
  async getGraphEmail() {
    const result = await this.neo4jService.read(
      `match (we:Website)
       where we.content contains $neodash_email1
r      return we.url,we.content as p`,
    );
    return result.records.map((record) => record.get('p').properties);
  }

  @Get('timeline')
  async getTimeline() {
    const result = await this.neo4jService.read(
      `match p1=(a)-[:TIMELINE]->(b) 
      with p1,a,b,
      case when $neodash_custom1='' then b.dateTime else $neodash_custom1 end as rule1
      where b.dateTime=rule1
      return p1`,
    );
    return result.records.map((record) => record.get('p').properties);
  }

  @Get('phone-call')
  async getPhonecall() {
    const result = await this.neo4jService.read(
      `MATCH p1=(ph1:PhoneNumber)--(a:Call)-[r:TIMELINE]->(b:Call{dateTime:$neodash_custom1})--(ph2:PhoneNumber)
      with collect(ph1.phone_number) as pho1
      unwind pho1 as phone1
      return distinct phone1`,
    );
    return result.records.map((record) => record.get('p').properties);
  }

  @Get('analysis')
  async getAnalysis() {
    const result = await this.neo4jService.read(
      `MATCH p1=()--(a)-[r:TIMELINE]->(b)--()
      with p1,a,b,
      case when $neodash_custom1='' then b.dateTime else $neodash_custom1 end as rule1
      where none(z in nodes(p1) where z:Post) and b.dateTime=rule1
      RETURN p1`,
    );
    return result.records.map((record) => record.get('p').properties);
  }

  @Get('graph-profil-buron')
  async getGraphProfilBuron() {
    const result = await this.neo4jService.read(
      `MATCH p=(:Buronan)--() RETURN p LIMIT 25`,
    );
    const formatResult = formatResponse(result.records);
    return formatResult;
  }
}
