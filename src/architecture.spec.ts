import { describe, expect, it } from 'vitest';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const features = ['orders', 'drivers'];
const layers = ['domain', 'application', 'infrastructure', 'api'];

function filesUnder(path: string): string[] {
  return readdirSync(path).flatMap((entry) => {
    const fullPath = join(path, entry);
    return statSync(fullPath).isDirectory() ? filesUnder(fullPath) : [fullPath];
  });
}

describe('architecture', () => {
  it('organizes each business feature with clean architecture layers', () => {
    for (const feature of features) {
      for (const layer of layers) {
        expect(statSync(join('src', feature, layer)).isDirectory()).toBe(true);
      }
    }
  });

  it('keeps domain independent from frameworks and outer layers', () => {
    for (const feature of features) {
      for (const file of filesUnder(join('src', feature, 'domain')).filter((item) => item.endsWith('.ts'))) {
        const source = readFileSync(file, 'utf8');
        expect(source, relative(process.cwd(), file)).not.toMatch(/@nestjs|mssql|infrastructure|\/api|config/);
      }
    }
  });

  it('keeps application use cases independent from database adapters and controllers', () => {
    for (const feature of features) {
      for (const file of filesUnder(join('src', feature, 'application')).filter((item) => item.endsWith('.ts'))) {
        const source = readFileSync(file, 'utf8');
        expect(source, relative(process.cwd(), file)).not.toMatch(/mssql|azure-sql|infrastructure|\/api|controller/);
      }
    }
  });
});
