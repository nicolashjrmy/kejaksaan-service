import { Module } from '@nestjs/common';
import { Neo4jModule } from './neo4j/neo4j.module';
import { Neo4jService } from './neo4j/neo4j.service';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { JaringanBuronanController } from './jaringan-buronan/jaringan-buronan.controller';
import { InformasiBuronanController } from './informasi-buronan/informasi-buronan.controller';
import { WiretappingController } from './wiretapping/wiretapping.controller';
import { SocialMediaController } from './social-media/social-media.controller';
import { TextAnalysisController } from './text-analysis/text-analysis.controller';

@Module({
  imports: [
    Neo4jModule.forRoot(
      'neo4j://192.168.18.16:7687',
      'neo4j',
      'Ddi12345!',
      'jamintel1',
    ),
    AuthModule,
    UserModule,
  ],
  controllers: [
    AppController,
    JaringanBuronanController,
    InformasiBuronanController,
    WiretappingController,
    SocialMediaController,
    TextAnalysisController,
  ],
  providers: [AppService, Neo4jService],
})
export class AppModule {}
