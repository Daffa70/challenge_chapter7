const supertest = require("supertest");
const app = require("../app.js");

const product = {
  id: null,
  name: "Redmi 5 Plus",
  quantity: 5,
  component_id: [2, 11],
};

describe("TEST /products post endpoint", () => {
  test("Tambah products berhasil (positif)", async () => {
    const response = await supertest(app).post("/products").send(product);

    expect(response.statusCode).toBe(201);
    expect(response.body).toEqual({
      status: true,
      message: "success",
      data: {
        id: expect.any(Number),
        name: product.name,
        quantity: product.quantity,
        updatedAt: response.body.data.updatedAt,
        createdAt: response.body.data.createdAt,
      },
    });

    product.id = response.body.data.id;
  });

  test("Tambah product nama kosong (negatif)", async () => {
    const product1 = {
      name: "",
      quantity: 5,
      component_id: [2, 11],
    };

    const response = await supertest(app).post("/products").send(product1);

    expect(response.statusCode).toBe(401);
    expect(response.body).toEqual({
      status: false,
      message: "name must be provided",
      data: null,
    });
  });

  test("Tambah product component_id kosong (negatif)", async () => {
    const product1 = {
      name: "Redmi 5 plus",
      quantity: 5,
      component_id: "",
    };

    const response = await supertest(app).post("/products").send(product1);

    expect(response.statusCode).toBe(401);
    expect(response.body).toEqual({
      status: false,
      message: "component_id cannot be null",
      data: null,
    });
  });

  test("Tambah product component_id not found (negatif)", async () => {
    const product1 = {
      name: "Redmi 5 plus",
      quantity: 5,
      component_id: [99],
    };

    const response = await supertest(app).post("/products").send(product1);

    expect(response.statusCode).toBe(404);
    expect(response.body).toEqual({
      status: false,
      message: "One or more component IDs not found",
      data: null,
    });
  });
});

describe("TEST /products get all endpoint", () => {
  test("Get all products (positif)", async () => {
    const response = await supertest(app).get("/products");

    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe(true);
    expect(response.body.message).toBe("success");
    expect(response.body.data).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: expect.any(Number),
          name: expect.any(String),
          quantity: expect.any(Number),
        }),
      ])
    );
  });
});

describe("TEST /products/{id} get endpoint", () => {
  test("Get product by ID (positive)", async () => {
    const response = await supertest(app).get("/products/" + product.id);

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      status: true,
      message: "success",
      data: {
        id: product.id,
        name: expect.any(String),
        quantity: expect.any(Number),
        Components: expect.arrayContaining([
          expect.objectContaining({
            id: expect.any(Number),
            name: expect.any(String),
            description: expect.anything(),
          }),
        ]),
      },
    });
  });

  test("Get product by ID not found (negatif)", async () => {
    const id = 99;

    const response = await supertest(app).get("/products/" + id);

    expect(response.statusCode).toBe(404);
    expect(response.body).toEqual({
      status: false,
      message: `can't find product with id ${id}`,
      data: null,
    });
  });
});

describe("TEST /products/{id} put endpoint", () => {
  test("Put product by ID (positif)", async () => {
    const response = await supertest(app)
      .put("/products/" + product.id)
      .send(product);

    expect(response.statusCode).toBe(201);
    expect(response.body).toEqual({
      status: true,
      message: "success",
      data: null,
    });
  });

  test("Put product by ID, ID not found (negatif)", async () => {
    const product1 = {
      id: 99,
      name: "Redmi 5 Plus",
      quantity: 5,
      component_id: [1, 11],
    };

    const response = await supertest(app)
      .put("/products/" + product1.id)
      .send(product1);

    expect(response.statusCode).toBe(404);
    expect(response.body).toEqual({
      status: false,
      message: `cannot find product with id ${product1.id}`,
      data: null,
    });
  });

  test("Put product by ID, ID not found (negatif)", async () => {
    const product1 = {
      id: product.id,
      name: "Redmi 5 Plus",
      quantity: 5,
      component_id: [99],
    };

    const response = await supertest(app)
      .put("/products/" + product1.id)
      .send(product1);

    expect(response.statusCode).toBe(404);
    expect(response.body).toEqual({
      status: false,
      message: `One or more component IDs not found`,
      data: null,
    });
  });
});

describe("TEST /products/{id} delete endpoint", () => {
  test("Delete product by ID (positif)", async () => {
    const response = await supertest(app).delete("/products/" + product.id);

    expect(response.statusCode).toBe(201);
    expect(response.body).toEqual({
      status: true,
      message: "success",
      data: null,
    });
  });

  test("Delete product by ID , ID not found (negatif)", async () => {
    const response = await supertest(app).delete("/products/" + product.id);

    expect(response.statusCode).toBe(404);
    expect(response.body).toEqual({
      status: false,
      message: `can't find product with id ${product.id}`,
      data: null,
    });
  });
});

describe("TEST /add-product-component post endpoint", () => {
  test("Tambah component product berhasil (positif)", async () => {
    const component_product = {
      product_id: 5,
      component_id: 13,
    };

    const response = await supertest(app)
      .post("/add-product-component")
      .send(component_product);

    expect(response.statusCode).toBe(201);
    expect(response.body).toEqual({
      status: true,
      message: "success",
      data: {
        product_id: component_product.product_id,
        component_id: component_product.component_id,
        updatedAt: response.body.data.updatedAt,
        createdAt: response.body.data.createdAt,
      },
    });
  });

  test("Tambah component product gagal, product_exist (negatif)", async () => {
    const component_product = {
      product_id: 5,
      component_id: 13,
    };

    const response = await supertest(app)
      .post("/add-product-component")
      .send(component_product);

    expect(response.statusCode).toBe(401);
    expect(response.body).toEqual({
      status: false,
      message: "data already exist",
      data: null,
    });
  });

  test("Tambah component product gagal, product_id not found (negatif)", async () => {
    const component_product = {
      product_id: 99,
      component_id: 13,
    };

    const response = await supertest(app)
      .post("/add-product-component")
      .send(component_product);

    expect(response.statusCode).toBe(404);
    expect(response.body).toEqual({
      status: false,
      message: `can't find product with id ${component_product.product_id}`,
      data: null,
    });
  });

  test("Tambah component product gagal, component_id not found (negatif)", async () => {
    const component_product = {
      product_id: 5,
      component_id: 99,
    };

    const response = await supertest(app)
      .post("/add-product-component")
      .send(component_product);

    expect(response.statusCode).toBe(404);
    expect(response.body).toEqual({
      status: false,
      message: `can't find component with id ${component_product.component_id}`,
      data: null,
    });
  });

  test("Tambah component product gagal, product_id null (negatif)", async () => {
    const component_product = {
      product_id: "",
      component_id: 99,
    };

    const response = await supertest(app)
      .post("/add-product-component")
      .send(component_product);

    expect(response.statusCode).toBe(401);
    expect(response.body).toEqual({
      status: false,
      message: `product_id cannot be null`,
      data: null,
    });
  });

  test("Tambah component product gagal, component_id null (negatif)", async () => {
    const component_product = {
      product_id: 5,
      component_id: "",
    };

    const response = await supertest(app)
      .post("/add-product-component")
      .send(component_product);

    expect(response.statusCode).toBe(401);
    expect(response.body).toEqual({
      status: false,
      message: `component_id cannot be null`,
      data: null,
    });
  });
});

describe("TEST /delete-product-component/{component_id}/{product_id} delete endpoint", () => {
  test("Hapus component product berhasil (positif)", async () => {
    const component_product = {
      product_id: 5,
      component_id: 13,
    };

    const response = await supertest(app).delete(
      `/delete-product-component/${component_product.component_id}/${component_product.product_id}`
    );

    expect(response.statusCode).toBe(201);
    expect(response.body).toEqual({
      status: true,
      message: "success",
      data: null,
    });
  });

  test("Hapus component supplier product data not found (negatif)", async () => {
    const component_product = {
      product_id: 5,
      component_id: 13,
    };

    const response = await supertest(app).delete(
      `/delete-product-component/${component_product.component_id}/${component_product.product_id}`
    );

    expect(response.statusCode).toBe(404);
    expect(response.body).toEqual({
      status: false,
      message: "data not exist",
      data: null,
    });
  });
});
