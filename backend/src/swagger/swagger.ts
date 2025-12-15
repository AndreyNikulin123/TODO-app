import swaggerUi from 'swagger-ui-express';
import fs from 'fs';
import path from 'path';
import yaml from 'yaml';
import { Express } from 'express';

export function setupSwagger(app: Express) {
  const filePath = path.resolve(process.cwd(), 'docs/openapi.yaml');
  const file = fs.readFileSync(filePath, 'utf8');
  const swaggerDocument = yaml.parse(file);

  app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
}
