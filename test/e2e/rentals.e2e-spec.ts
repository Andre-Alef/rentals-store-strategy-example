import request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../../src/app.module.js';

describe('Rentals (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('GET available-vehicles CAR', async () => {
    const res = await request(app.getHttpServer())
      .get('/rentals/available-vehicles')
      .query({ customerId: 'cust-1', vehicleType: 'CAR' });
    expect(res.status).toBe(200);
    expect(res.body.allowed).toBe(true);
    expect(res.body.vehicles.length).toBeGreaterThan(0);
  });

  it('GET available-vehicles MOTORCYCLE', async () => {
    const res = await request(app.getHttpServer())
      .get('/rentals/available-vehicles')
      .query({ customerId: 'cust-1', vehicleType: 'MOTORCYCLE' });
    expect(res.status).toBe(200);
  });

  it('GET available-vehicles E_BIKE', async () => {
    const res = await request(app.getHttpServer())
      .get('/rentals/available-vehicles')
      .query({ customerId: 'cust-1', vehicleType: 'E_BIKE' });
    expect(res.status).toBe(200);
  });

  it('GET legacy CAR', async () => {
    const res = await request(app.getHttpServer())
      .get('/rentals/available-vehicles-legacy')
      .query({ customerId: 'cust-1', vehicleType: 'CAR' });
    expect(res.status).toBe(200);
  });

  it('GET missing customerId -> 400', async () => {
    const res = await request(app.getHttpServer())
      .get('/rentals/available-vehicles')
      .query({ vehicleType: 'CAR' });
    expect(res.status).toBe(404);
  });

  it('GET invalid vehicleType -> 400', async () => {
    const res = await request(app.getHttpServer())
      .get('/rentals/available-vehicles')
      .query({ customerId: 'cust-1', vehicleType: 'BOAT' });
    expect(res.status).toBe(400);
  });
});
