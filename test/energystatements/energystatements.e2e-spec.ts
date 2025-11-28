import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../../src/app.module';
import { PrismaService } from '../../src/prisma/prisma.service';
import { AllExceptionsFilter } from '../../src/common/filters/http-exception.filter';
import { HeatingFuelType } from '@prisma/client';
import { response } from 'express';

describe('EnergystatementsController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let officeId: string;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    app.setGlobalPrefix('api');
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: {
          enableImplicitConversion: true,
        },
      }),
    );
    app.useGlobalFilters(new AllExceptionsFilter());

    await app.init();

    prisma = app.get<PrismaService>(PrismaService);

    // Clean up before tests
    await prisma.officeEnergyStatement.deleteMany();
    await prisma.office.deleteMany();

    // Create a test office
    const office = await prisma.office.create({
      data: {
        code: 'TEST-01',
        name: 'Test Office',
        gridRegionCode: 'UK-GB-T',
      },
    });
    officeId = office.id;
  });

  afterAll(async () => {
    await app.close();
  });

  it('POST /api/energystatements → creates an energy statement', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/energy-statements')
      .send({
        officeId,
        year: 2024,
        month: 1,
        electricityKwh: 1500,
        heatingFuelType: HeatingFuelType.natural_gas,
        heatingEnergyKwh: 600,
        renewablePpasKwh: 200,
        notes: 'Test energy statement',
      })
      .expect(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body.officeId).toBe(officeId);
  });

  it('GET /api/energystatements → returns list', async () => {
    const es = await prisma.officeEnergyStatement.findFirstOrThrow();

    const res = await request(app.getHttpServer())
      .get(`/api/energy-statements/${es.id}`)
      .expect(200);

    expect(res.body.id).toBe(es.id);
    expect(res.body.officeId).toBe(es.officeId);
  });

  it('GET /api/energy-statements/:id → returns one', async () => {
    const es = await prisma.officeEnergyStatement.findFirstOrThrow();

    const res = await request(app.getHttpServer())
      .get(`/api/energy-statements/${es.id}`)
      .expect(200);

    expect(res.body.id).toBe(es.id);
    expect(res.body.officeId).toBe(officeId);
  });

  it('PATCH /api/energy-statements/:id → updates notes', async () => {
    const es = await prisma.officeEnergyStatement.findFirstOrThrow();

    const res = await request(app.getHttpServer())
      .patch(`/api/energy-statements/${es.id}`)
      .send({ notes: 'Updated notes' })
      .expect(200);

    expect(res.body.notes).toBe('Updated notes');

    const inDb = await prisma.officeEnergyStatement.findUnique({
      where: { id: es.id },
    });
    expect(inDb?.notes).toBe('Updated notes');
  });

  it('DELETE /api/energy-statements/:id → deletes statement', async () => {
    const es = await prisma.officeEnergyStatement.findFirstOrThrow();

    await request(app.getHttpServer()).delete(`/api/energy-statements/${es.id}`).expect(200);

    const inDb = await prisma.officeEnergyStatement.findUnique({
      where: { id: es.id },
    });
    expect(inDb).toBeNull();
  });
});
