const supertest = require("supertest");
const app = require("../app.js");

const supplier = {
  id: null,
  name: "PT. Maju Jaya",
  address: "Jl. Apel, Malang",
};

describe("TEST /suppliers post endpoint", () => {
  test("Tambah supplier berhasil (positif)", async () => {
    const response = await supertest(app).post("/suppliers").send(supplier);

    expect(response.statusCode).toBe(201);
    expect(response.body).toEqual({
      status: true,
      message: "success",
      data: {
        id: expect.any(Number),
        name: supplier.name,
        address: supplier.address,
        updatedAt: response.body.data.updatedAt,
        createdAt: response.body.data.createdAt,
      },
    });

    supplier.id = response.body.data.id;
  });
});

describe("TEST /suppliers get all endpoint", () => {
  test("Get all suppliers (positif)", async () => {
    const response = await supertest(app).get("/suppliers");

    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe(true);
    expect(response.body.message).toBe("success");
    expect(response.body.data).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: expect.any(Number),
          name: expect.any(String),
          address: expect.any(String),
        }),
      ])
    );
  });
});

describe("TEST /suppliers/{id} get endpoint", () => {
  test("Get supplier by ID (positif)", async () => {
    const id = 1;

    const response = await supertest(app).get("/suppliers/" + id);

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      status: true,
      message: "success",
      data: {
        id: id,
        name: response.body.data.name,
        address: response.body.data.address,
        Components: expect.anything(),
      },
    });

    const { Components } = response.body.data;

    if (Components) {
      expect(Components).toBeInstanceOf(Array);

      expect(Components.length).toBeGreaterThanOrEqual(0);
      Components.forEach((component) => {
        expect(component).toEqual({
          id: expect.any(Number),
          name: expect.any(String),
          description: expect.any(String),
        });
      });
    }
  });

  test("Get component by ID supplier id not found (negatif)", async () => {
    const id = 99;

    const response = await supertest(app).get("/suppliers/" + id);

    expect(response.statusCode).toBe(404);
    expect(response.body).toEqual({
      status: false,
      message: `can't find supplier with id ${id}`,
      data: null,
    });
  });
});

describe("TEST /suppliers/{id} put endpoint", () => {
  test("Put suppliers by ID (positif)", async () => {
    const response = await supertest(app)
      .put("/suppliers/" + supplier.id)
      .send(supplier);

    expect(response.statusCode).toBe(201);
    expect(response.body).toEqual({
      status: true,
      message: "success",
      data: null,
    });
  });

  test("Put supplier by ID supplier_id not found (negatif)", async () => {
    const supplier1 = {
      id: 99,
      name: "PT. Maju Jaya",
      address: "Jl. Apel, Malang",
    };

    const response = await supertest(app)
      .put("/suppliers/" + supplier1.id)
      .send(supplier1);

    expect(response.statusCode).toBe(404);
    expect(response.body).toEqual({
      status: false,
      message: `can't find supplier with id ${supplier1.id}`,
      data: null,
    });
  });
});

describe("TEST /suppliers/{id} delete endpoint", () => {
  test("Delete supplier by ID (positif)", async () => {
    const response = await supertest(app).delete("/suppliers/" + supplier.id);

    expect(response.statusCode).toBe(201);
    expect(response.body).toEqual({
      status: true,
      message: "success",
      data: null,
    });
  });

  test("Delete supplier not found id (negatif)", async () => {
    const component1 = {
      id: 99,
      name: "Baterai 5000 mAh",
      description: "Baterai berkapasitas 5000 mAh",
      supplier_id: [1, 11],
    };

    const response = await supertest(app).delete("/suppliers/" + component1.id);

    expect(response.statusCode).toBe(404);
    expect(response.body).toEqual({
      status: false,
      message: `can't find supplier with id ${component1.id}`,
      data: null,
    });
  });
});
