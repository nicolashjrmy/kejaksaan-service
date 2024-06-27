import { Controller, Get, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { formatResponse } from 'src/neo4j/neo4j.utils';
import { Neo4jService } from 'src/neo4j/neo4j.service';

@UseGuards(JwtAuthGuard)
@Controller('informasi-buronan')
export class InformasiBuronanController {
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

  //   @Get('loc-buronan')
  //   async getLocationBuronan() {
  //     const result = await this.neo4jService.read(
  //       'match p=(:Buronan)-[]-() where none(z in nodes(p) where z:Website) return p',
  //     );
  //     return result.records.map((record) => record.get('p').properties);
  //   }

  @Get('one-buron')
  async getOneBuron() {
    const result = await this.neo4jService.read(
      'MATCH (n:Buronan) RETURN n LIMIT 1',
    );
    return result.records.map((record) => record.get('n').properties);
  }

  @Get('website')
  async getWebsite() {
    const result = await this.neo4jService.read(
      `match (we:Website)
        where we.content contains 'harunmasiku@example.com'
        return we.url,we.content`,
    );
    return result.records.map((record) => ({
      URL: record.get('we.url'),
      Content: record.get('we.content'),
    }));
  }

  @Get('transaksi-bank')
  async getTransaksiBank() {
    const result = await this.neo4jService.read(
      `MATCH p=(a{no_rekening:'2907991604'})-[r:HAS_TRANSACTION]->(b) 
      RETURN a.no_rekening,b.tx_date,b.type,b.vendor
      order by b.tx_date desc`,
    );
    return result.records.map((record) => ({
      NoRekening: record.get('a.no_rekening'),
      TanggalTransaksi: record.get('b.tx_date'),
      Tipe: record.get('b.type'),
      Vendor: record.get('b.vendor'),
    }));
  }

  @Get('graph-email')
  async getGraphEmail() {
    const result = await this.neo4jService.read(
      `match (we:Website)
       where we.content contains $neodash_email1
       return we.url,we.content as p`,
    );
    return result.records.map((record) => record.get('p').properties);
  }

  @Get('timeline')
  async getTimeline(field) {
    const result = await this.neo4jService.read(
      `match p1=(a)-[:TIMELINE]->(b) 
        with p1,a,b,
        case when ${field} then b.dateTime else $neodash_custom1 end as rule1
        where b.dateTime=rule1
        return p1`,
    );
    return result.records.map((record) => record.get('p').properties);
  }

  @Get('phone-call')
  async getPhonecall() {
    const result = await this.neo4jService.read(
      `MATCH p1=(ph1:PhoneNumber)--(a:Call)-[r:TIMELINE]->(b:Call{dateTime:"2024-06-04T18:16:35.094618"})--(ph2:PhoneNumber)
        with collect(ph1.phone_number) as pho1
        unwind pho1 as phone1
        return distinct phone1`,
    );
    return result.records.map((record) => ({
      Telfon: record.get('phone1'),
    }));
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
