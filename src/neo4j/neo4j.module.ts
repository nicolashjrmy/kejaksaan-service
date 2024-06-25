import { Module, Global, DynamicModule } from '@nestjs/common';
import { createDriver } from './neo4j.utils';

@Global()
@Module({})
export class Neo4jModule {
  static forRoot(
    uri: string,
    user: string,
    password: string,
    database: string,
  ): DynamicModule {
    const driver = createDriver(uri, user, password);

    return {
      module: Neo4jModule,
      providers: [
        {
          provide: 'NEO4J_DRIVER',
          useValue: driver,
        },
        {
          provide: 'NEO4J_DATABASE',
          useValue: database,
        },
      ],
      exports: ['NEO4J_DRIVER', 'NEO4J_DATABASE'],
    };
  }
}
