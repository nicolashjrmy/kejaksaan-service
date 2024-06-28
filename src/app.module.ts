import { Module } from '@nestjs/common';
import { Neo4jModule } from './neo4j/neo4j.module';
import { Neo4jService } from './neo4j/neo4j.service';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { JaringanBuronanController } from './routes/jaringan-buronan/jaringan-buronan.controller';
import { InformasiBuronanController } from './routes/informasi-buronan/informasi-buronan.controller';
import { WiretappingController } from './routes/wiretapping/wiretapping.controller';
import { SocialMediaController } from './routes/social-media/social-media.controller';
import { TextAnalysisController } from './routes/text-analysis/text-analysis.controller';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

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
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'client', 'dist'),
    }),
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
