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
import { formatResponse, formatProperties } from 'src/neo4j/neo4j.utils';
import { Neo4jService } from 'src/neo4j/neo4j.service';
import { Relationship, Result } from 'neo4j-driver';
import { log } from 'console';
import { start } from 'repl';

@UseGuards(JwtAuthGuard)
@Controller('informasi-buronan')
export class InformasiBuronanController {
  constructor(private readonly neo4jService: Neo4jService) {}

  @Get('nodes')
  async getNodes() {
    const result = await this.neo4jService.read('MATCH (n) RETURN n LIMIT 25');
    return result.records.map((record) => record.get('n').properties);
  }

  @Get('one-buron')
  async getOneBuron() {
    const result = await this.neo4jService.read(
      'MATCH (n:Buronan) RETURN n LIMIT 1',
    );
    return result.records.map((record) => record.get('n').properties);
  }

  @Get('website')
  async getWebsite(@Query('email') email: string) {
    const result = await this.neo4jService.read(
      `match (we:Website)
        where we.content contains '${email}'
        return we.url,we.content`,
    );
    return result.records.map((record) => ({
      URL: record.get('we.url'),
      Content: record.get('we.content'),
    }));
  }

  @Get('transaksi-bank')
  async getTransaksiBank(@Query('no_rek') no_rek: string) {
    const result = await this.neo4jService.read(
      `MATCH p=(a{no_rekening:'${no_rek}'})-[r:HAS_TRANSACTION]->(b) 
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

  @Get('phone-call')
  async getPhonecall(
    @Param('start_date') start_date: any,
    @Param('end_date') end_date: any,
    @Query('no_hp') no_hp: string,
  ) {
    const result = await this.neo4jService.read(
      `match (a:Buronan{nama:"Harun Masiku"})-[:PUNYA_HP]->(b:NO_HP)-[:HAS_CONTACT_PHONE]->(c:Contact_Phone)
      where "${start_date}" <= c.dateTime <= "${end_date}"
      and
      b.no_hp[0]="${no_hp}" or b.no_hp[1]="${no_hp}"
      return  c.added_date as Tanggal_Ditambah, c.number as No_Kontak, c.provider as Provider
      order by Tanggal_Ditambah desc`,
    );
    return result.records.map((record) => ({
      Tanggal_Ditambah: formatProperties(record.get('Tanggal_Ditambah')),
      No_Kontak: record.get('No_Kontak'),
      Provider: record.get('Provider'),
    }));
  }

  @Get('nik-web')
  async getNikWeb(@Query('nik') nik: string) {
    const result = await this.neo4jService.read(
      `MATCH (n:NIK {nik: "${nik}"})-[r:NIK_FOUND_IN]->(w: Website_New)
      RETURN w.found_date as tanggal, w.url as website order by tanggal desc`,
    );
    return result.records.map((record) => ({
      Used_in_Website: record.get('website'),
      Tanggal: formatProperties(record.get('tanggal')),
    }));
  }

  // @Get('analysis')
  // async getAnalysis() {
  //   const result = await this.neo4jService.read(
  //     `MATCH p1=()--(a)-[r:TIMELINE]->(b)--()
  //       with p1,a,b,
  //       case when $neodash_custom1='' then b.dateTime else $neodash_custom1 end as rule1
  //       where none(z in nodes(p1) where z:Post) and b.dateTime=rule1
  //       RETURN p1`,
  //   );
  //   return result.records.map((record) => record.get('p').properties);
  // }

  @Get('startdate')
  async getStartDate() {
    const result = await this.neo4jService.read(
      `MATCH (n:Transaction_Mutation) RETURN distinct n.dateTime
      order by n.dateTime asc`,
    );
    return result.records.map((record) => ({
      Startdate: record.get('n.dateTime'),
    }));
  }

  @Get('enddate')
  async getEndDate() {
    const result = await this.neo4jService.read(
      `MATCH (n:Transaction_Mutation) RETURN distinct n.dateTime
      order by n.dateTime desc`,
    );
    return result.records.map((record) => ({
      Enddate: record.get('n.dateTime'),
    }));
  }

  @Get('no-hp')
  async getNoHp() {
    const result = await this.neo4jService.read(
      `with ["081181234455","087777812345"] as ph
      unwind ph as phone
      return phone`,
    );
    return result.records.map((record) => ({
      NoHp: record.get('phone'),
    }));
  }

  @Get('nik')
  async getNik() {
    const result = await this.neo4jService.read(
      `with ["3174010102700009"] as ph
      unwind ph as nik1
      return nik1`,
    );
    return result.records.map((record) => ({
      Nik: record.get('nik1'),
    }));
  }

  @Get('no-rek')
  async getNoRek() {
    const result = await this.neo4jService.read(
      `with ["2907991604"] as ph
      unwind ph as rekening1
      return rekening1`,
    );
    return result.records.map((record) => ({
      NoRekening: record.get('rekening1'),
    }));
  }

  @Get('kontak_KT')
  async getKontakKT() {
    const result = await this.neo4jService.read(
      `MATCH (n: Kaki_Tangan)
        return n.phone_number as nomor, n.provider as provider`,
    );
    return result.records.map((record) => ({
      Kontak: record.get('kontak'),
      Provider: record.get('provider'),
    }));
  }

  @Get('email')
  async getEmail() {
    const result = await this.neo4jService.read(
      `with ["harunmasiku@example.com","hmasiku@corporate.com"] as ph
      unwind ph as email1
      return email1`,
    );
    return result.records.map((record) => ({
      Email: record.get('email1'),
    }));
  }

  @Get('daftar-kontak')
  async getDaftarKontak(
    @Param('nama_buron') nama_buron: string,
    @Param('no_hp') no_hp: string,
    @Param('start_date') start_date: any,
    @Param('end_date') end_date: any,
  ) {
    const result = await this.neo4jService.read(
      `match (a:Buronan{nama:"${nama_buron}"})-[:PUNYA_HP]->(b:NO_HP)-[:HAS_CONTACT_PHONE]->(c:Contact_Phone)
      where "${start_date}" <= c.dateTime <= "${end_date}"
      and
      b.no_hp[0]="${no_hp}" or b.no_hp[1]="${no_hp}"
      return  c.added_date as Tanggal_Ditambah, c.number as No_Kontak, c.provider as Provider
      order by Tanggal_Ditambah desc`,
    );
    return result.records.map((record) => ({
      Tanggal_Ditambah: record.get('Tanggal_Ditambah'),
      No_Kontak: record.get('No_Kontak'),
      Provider: record.get('Provider'),
    }));
  }

  @Get('data-cctv')
  async getDataCctv(
    @Param('nama_buron') nama_buron: string,
    @Param('start_date') start_date: any,
    @Param('end_date') end_date: any,
  ) {
    const result = await this.neo4jService.read(
      `MATCH (n:CCTVData {buronan:"${nama_buron}"} where "${start_date}" <= n.dateTime <= "${end_date}") 
      where n.city ='Medan' or n.city='Balikpapan' or n.city='Makassar'
      RETURN
      n.recorded_date as Tanggal,
      n.latitude as Lat,
      n.longitude as Long,
      n.city as Kota,
      n.location as Location
      order by Tanggal desc`,
    );
    return result.records.map((record) => ({
      Tanggal: record.get('Tanggal'),
      Latitude: record.get('Lat'),
      Longitude: record.get('Long'),
      Kota: record.get('Kota'),
      Lokasi: record.get('Location'),
    }));
  }

  @Get('graph-profil-buron')
  async getGraphProfilBuron(
    @Query('nik') nik: string,
    @Query('no_hp') no_hp: string,
    @Query('no_rek') no_rek: string,
    @Query('start_date') start_date: string,
    @Query('end_date') end_date: string,
    @Query('email') email: string,
    @Query('n_kontak1') n_kontak1: string,
    @Query('tgl_cctv') tgl_cctv: string,
  ) {
    const result = await this.neo4jService.read(
      `optional match p1=(bu1:Buronan)-[]->(:NIK{nik:"${nik}"})
       optional match p2=(bu1)-[]->(n1:NO_HP where n1.no_hp[0]="${no_hp}")
       optional match p3=(bu1)-[]->(n2:NO_HP where n2.no_hp[1]="${no_hp}")
       optional match p4=(bu1)-[]->(:NO_REKENING{no_rekening:"${no_rek}"})
       optional match p5=(bu1)-[]->(:EMAIL{email:"${email}"})
       optional match p6=(a1)-[:PUNYA_HP]->(b1:NO_HP)-[:HAS_CONTACT_PHONE]->(c1:Contact_Phone where "${start_date}" <= toString(c1.dateTime) <= "${end_date}" and b1.no_hp[0]="${no_hp}" or b1.no_hp[1]="${no_hp}")
       optional match p7 = (a1 { no_rekening: "${no_rek}" })-[r2:HAS_TX_MUTATION]->(b2:Transaction_Mutation) where b2.dateTime >= "${start_date}" AND b2.dateTime <= "${end_date}"
       optional match p8=(c1)--(n:Kaki_Tangan{phone_number:"${n_kontak1}"})-[]-(:Call_Suspicious)
       optional match p9=(bu1)-[:TERTANGKAP_CCTV]->(:CCTVData{recorded_date:"${tgl_cctv}"})

       return p1,p2,p3,p4,p5,p6,p7,p8,p9 LIMIT 100`,
    );
    // console.log(result.records);
    const formatResult = formatResponse(result.records);
    return formatResult;
    // return result.records;
  }

  @Get('graph-profil-buron/expand')
  async getGraphProfilBuronExpandList(
    @Query('id') id: string,
    @Query('rel') rel: string,
  ) {
    const result = await this.neo4jService.read(
      `match p = (n)-[r]-()
      where elementId(n) = "${id}" ${rel != undefined ? `and type(r) = "${rel}"` : ''} 
      return ${rel ? `p LIMIT 100` : `type(r), count(r)`}`,
    );
    return id && rel
      ? formatResponse(result.records)
      : result.records.map((record) => ({
          Relationship: record.get('type(r)'),
          Jumlah: record.get('count(r)').low,
        }));
  }

  @Get('graph-profil-buron/shortest-path')
  async getGraphProfilBuronShortestPath(
    @Query('id1') id1: string,
    @Query('id2') id2: string,
  ) {
    const result = await this.neo4jService.read(
      `match (n), (m)
      where elementId(n)="${id1}" and elementId(m)= "${id2}"
      match p = shortestPath((n)-[*]-(m))
      return p`,
    );
    const formatResult = formatResponse(result.records);
    return formatResult;
  }
}
