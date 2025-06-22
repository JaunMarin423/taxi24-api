import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { resolve, join } from 'path';
import { config } from 'dotenv';

// Load environment variables
config({ path: resolve(__dirname, '../.env') });

// Configure path aliases
import { register } from 'tsconfig-paths';
import * as fs from 'fs';

const tsConfigPath = join(process.cwd(), 'tsconfig.json');
const tsConfig = JSON.parse(fs.readFileSync(tsConfigPath, 'utf8'));

const baseUrl = tsConfig.compilerOptions.baseUrl || './';
const paths = tsConfig.compilerOptions.paths;

register({
  baseUrl,
  paths: Object.keys(paths).reduce<Record<string, string[]>>(
    (aliases, alias) => ({
      ...aliases,
      [alias]: paths[alias].map((p: string) => resolve(baseUrl, p)),
    }),
    {},
  ),
});

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
