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
@Controller('jaringan-buronan')
export class JaringanBuronanController {
  constructor(private readonly neo4jService: Neo4jService) {}

  @Get('list-buron')
  async getListBuron() {
    const result = await this.neo4jService.read(
      `with
      ["Harun Masiku","Noordin M Top"] as fug
      unwind fug as buronan
      return buronan`,
    );
    return result.records.map((record) => record.get('buronan'));
  }

  @Get('keluarga-buron')
  async getKeluargaBuron() {
    const result = await this.neo4jService.read(
      `match (:Buronan)-[:PUNYA_KELUARGA]->(ke:Keluarga{relasi:"Harun Masiku"})
      return ke.nama as Nama, ke.hubungan as Hubungan`,
    );
    return result.records.map((record) => ({
      Nama: record.get('Nama'),
      Hubungan: record.get('Hubungan'),
    }));
  }

  @Get('teman-buron')
  async getTemanBuron() {
    const result = await this.neo4jService.read(
      `match (:Buronan)-[:PUNYA_TEMAN]->(ke:Teman{relasi:"Harun Masiku"})
      return ke.nama as Nama, ke.hubungan as Hubungan`,
    );
    return result.records.map((record) => ({
      Nama: record.get('Nama'),
      Hubungan: record.get('Hubungan'),
    }));
  }

  @Get('rekan-buron')
  async getRekanBuron() {
    const result = await this.neo4jService.read(
      `match (:Buronan)-[:PUNYA_REKAN_KERJA]->(ke:Rekan_Kerja{relasi:"Harun Masiku"})
      return ke.nama as Nama, ke.hubungan as Hubungan`,
    );
    return result.records.map((record) => ({
      Nama: record.get('Nama'),
      Hubungan: record.get('Hubungan'),
    }));
  }

  @Get('followers-sosmed')
  async getFollowersSosmed(
    @Query('platform') platform: string,
    @Query('nama_buron') nama_buron: string,
    @Query('kel1') kel1: string,
  ) {
    const result = await this.neo4jService.read(
      `MATCH p=(a)-[r:FOLLOWS]->(b{platform:"${platform}"})<-[:PUNYA_SOSMED]-({nama:"${kel1}")--(:Buronan{nama:"${nama_buron}"})
        return b.platform as Platform, b.username as Subject, a.username as Followers, a.followers as Followers_Followers, a.following as Followers_Following, a.chat_frequency as Frekuensi_Chat_Hari`,
    );
    return result.records.map((record) => ({
      Platform: record.get('Platform'),
      Subject: record.get('Subject'),
      Followers: record.get('Followers'),
      Followers_Followers: record.get('Followers_Followers'),
      Followers_Following: record.get('Followers_Folllowing'),
    }));
  }

  @Post('jaringan-buron')
  async getJaringanBuron(
    @Body('keluarga') keluarga: string,
    @Body('teman') teman: string,
    @Body('rekan_kerja') rekan_kerja: string,
    @Body('kel1') kel1: string,
    @Body('platform') platform: string,
    @Body('fol_sus1') folsus1: string,
  ) {
    const result = await this.neo4jService.read(
      `optional match p1=(bu:Buronan)-[:PUNYA_KELUARGA]->(:Keluarga{relasi:$neodash_buron1})
      optional match p2=(bu)-[:PUNYA_TEMAN]->(:Teman{relasi:$neodash_buron1})
      optional match p3=(bu)-[:PUNYA_REKAN_KERJA]->(:Rekan_Kerja{relasi:$neodash_buron1})
      optional match p4=(bu{nama:$neodash_buron1})--(a{nama:$neodash_kel1})-[r:PUNYA_SOSMED]->(b)
      optional match p5=(aa where aa.followers < 10)-[:FOLLOWS]->(b{platform:$neodash_plat1})<-[:PUNYA_SOSMED]-(ke)
      optional match p6=(aa{username:$neodash_fol_sus1})--(:FacebookAccount)
      return p1,p2,p3,p4,p5,p6`,
    );
    const formatResult = formatResponse(result.records);
    return formatResult;
  }

  @Get('jaringan-medsos') //memakai shortest path
  async getJaringanMedsos(
    @Query('fol_sus') fol_sus: string,
    @Query('sus_ph') sus_ph: string,
  ) {
    const result = await this.neo4jService.read(
      `optional match p1=shortestPath((aa:Follower{username:$neodash_fol_sus1})-[*]-(bb:Kaki_Tangan{phone_number:$neodash_sus_ph}))
      optional match p2=(bb)--(ca:Call_Suspicious)--()
      return p1,p2`,
    );
    const formatResult = formatResponse(result.records);
    return formatResult;
  }

  // @Get('rekam-sosmed')
  // async getRekamSosmed() {
  //   const result = await this.neo4jService.read(
  //     `MATCH p=(:Buronan{nama:$neodash_buron1})--(a{nama:$neodash_kel1})-[r:PUNYA_SOSMED]->(b)
  //       return a.nama as Nama, b.followers as Followers, b.following as Following, b.username as Username, b.platform as Platform`,
  //   );
  //   return result.records.map((record) => ({
  //     Nama: record.get('Nama'),
  //     Followers: record.get('Followers'),
  //     Following: record.get('Following'),
  //     Username: record.get('Username'),
  //     Platform: record.get('Platform'),
  //   }));
  // }

  // @Get('rekam-chat')
  // async getRekamChat() {
  //   const result = await this.neo4jService.read(
  //     `MATCH p=(a)-[r:FOLLOWS]->(b{platform:$neodash_plat1})<-[:PUNYA_SOSMED]-({nama:$neodash_kel1})--(:Buronan{nama:$neodash_buron1})
  //       return b.platform as Platform, b.username as Subject, a.username as Followers,
  //       a.followers as Followers_Followers, a.following as Followers_Following, a.chat_frequency as Frekuensi_Chat`,
  //   );
  //   return result.records.map((record) => ({
  //     Platform: record.get('Platform'),
  //     Subject: record.get('Subject'),
  //     Followers: record.get('Followers'),
  //     FollowersFollowers: record.get('Followers_Followers'),
  //     FollowersFollowing: record.get('Followers_Following'),
  //     FrekuensiChat: record.get('Frekuensi_Chat'),
  //   }));
  // }
}
