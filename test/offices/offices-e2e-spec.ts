import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../../src/app.module';
import { PrismaService } from '../../src/prisma/prisma.service';

describe('Office E2E', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    app.setGlobalPrefix('api');
    prisma = app.get<PrismaService>(PrismaService);

    await app.init();

    await prisma.office.deleteMany();
  });

  afterAll(async () => {
    await app.close();
  });

  it('POST /api/offices → creates office', async () => {
    await request(app.getHttpServer())
      .post('/api/offices')
      .send({
        code: 'LON-01',
        name: 'London HQ',
        gridRegionCode: 'UK-GB-L',
      })
      .expect(201)
      .expect(res => {
        expect(res.body.code).toBe('LON-01');
      });
  });

  it('GET /api/offices → gets all offices', async () => {
    await request(app.getHttpServer())
      .get('/api/offices')
      .expect(200)
      .expect(res => {
        expect(res.body.length).toBe(1);
        expect(res.body[0].code).toBe('LON-01');
      });
  });

  it('GET /api/offices/:id → gets office by id', async () => {
    const office = await prisma.office.findFirst({ where: { code: 'LON-01' } });

    await request(app.getHttpServer())
      .get(`/api/offices/${office.id}`)
      .expect(200)
      .expect(res => {
        expect(res.body.name).toBe('London HQ');
      });
  });

  it('PATCH /api/offices/:id → updates office', async () => {
    const office = await prisma.office.findFirst();
    await request(app.getHttpServer())
      .patch(`/api/offices/${office.id}`)
      .send({ name: 'Updated Name' })
      .expect(200)
      .expect(res => {
        expect(res.body.name).toBe('Updated Name');
      });
  });

  it('DELETE /api/offices/:id → deletes office', async () => {
    const office = await prisma.office.findFirst();
    await request(app.getHttpServer()).delete(`/api/offices/${office.id}`).expect(200);

    const exists = await prisma.office.findUnique({ where: { id: office.id } });
    expect(exists).toBeNull();
  });
});
