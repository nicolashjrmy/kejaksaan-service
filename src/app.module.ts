import { Module } from '@nestjs/common';
import { Neo4jModule } from './neo4j/neo4j.module';
import { Neo4jService } from './neo4j/neo4j.service';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    Neo4jModule.forRoot(
      'neo4j://192.168.18.16:7687',
      'neo4j',
      'Ddi12345!',
      'jamintel2',
    ),
  ],
  controllers: [AppController],
  providers: [AppService, Neo4jService],
})
export class AppModule {}
