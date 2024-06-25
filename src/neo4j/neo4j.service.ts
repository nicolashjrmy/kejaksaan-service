import { Injectable, Inject } from '@nestjs/common';
import { Driver, Session } from 'neo4j-driver';

@Injectable()
export class Neo4jService {
  constructor(
    @Inject('NEO4J_DRIVER') private readonly driver: Driver,
    @Inject('NEO4J_DATABASE') private readonly database: string,
  ) {}

  getSession(): Session {
    return this.driver.session({ database: this.database });
  }

  async read(query: string, params: any = {}) {
    const session = this.getSession();
    try {
      return await session.run(query, params);
    } finally {
      await session.close();
    }
  }

  async write(query: string, params: any = {}) {
    const session = this.getSession();
    try {
      return await session.run(query, params);
    } finally {
      await session.close();
    }
  }
}
