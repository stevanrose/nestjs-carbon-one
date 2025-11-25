import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../../src/app.module';
import { PrismaService } from '../../src/prisma/prisma.service';
import { AllExceptionsFilter } from '../../src/common/filters/http-exception.filter';

describe('Employee E2E', () => {
  let app: INestApplication;
  let prisma: PrismaService;

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

    prisma = app.get<PrismaService>(PrismaService);
    await app.init();

    await prisma.employee.deleteMany();
    await prisma.office.deleteMany();
  });

  afterAll(async () => {
    await app.close();
  });

  it('POST /api/employees → returns 400 when invalid', async () => {
    await request(app.getHttpServer())
      .post('/api/employees')
      .send({}) // missing email
      .expect(400);
  });

  it('POST /api/employees → creates an employee', async () => {
    await request(app.getHttpServer())
      .post('/api/employees')
      .send({
        email: 'alice@example.com',
        department: 'Engineering',
        employmentType: 'full_time',
        workPattern: 'hybrid',
      })
      .expect(201)
      .expect(res => {
        expect(res.body.email).toBe('alice@example.com');
        expect(res.body.employmentType).toBe('full_time');
        expect(res.body.workPattern).toBe('hybrid');
      });
  });

  it('GET /api/employees → returns paged list', async () => {
    const res = await request(app.getHttpServer())
      .get('/api/employees')
      .query({ page: 0, size: 10, sort: 'email,asc' })
      .expect(200);

    expect(res.body).toHaveProperty('content');
    expect(Array.isArray(res.body.content)).toBe(true);
    expect(res.body.content.length).toBeGreaterThanOrEqual(1);
    expect(res.body.page).toBe(0);
    expect(res.body.size).toBe(10);
  });

  it('GET /api/employees/:id → returns employee', async () => {
    const employee = await prisma.employee.findFirstOrThrow();

    const res = await request(app.getHttpServer()).get(`/api/employees/${employee.id}`).expect(200);

    expect(res.body.id).toBe(employee.id);
    expect(res.body.email).toBe(employee.email);
  });

  it('PATCH /api/employees/:id → updates employee', async () => {
    const employee = await prisma.employee.findFirstOrThrow();

    const res = await request(app.getHttpServer())
      .patch(`/api/employees/${employee.id}`)
      .send({ department: 'Platform' })
      .expect(200);

    expect(res.body.department).toBe('Platform');

    const inDb = await prisma.employee.findUnique({ where: { id: employee.id } });
    expect(inDb?.department).toBe('Platform');
  });

  it('DELETE /api/employees/:id → deletes employee', async () => {
    const employee = await prisma.employee.findFirstOrThrow();

    await request(app.getHttpServer()).delete(`/api/employees/${employee.id}`).expect(200);

    const inDb = await prisma.employee.findUnique({ where: { id: employee.id } });
    expect(inDb).toBeNull();
  });
});
