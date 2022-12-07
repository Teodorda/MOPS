const productUtils = require("./product_utils");

const mockUserId = "mock-userId";
jest.mock("./db_con.js", () => {
  return {
    con: {
      query: jest.fn(),
    },
  };
});

jest.mock("./auth_utils", () => ({
  getUserIdFromJwt: () => mockUserId,
  canUserEditEntity: jest.fn().mockResolvedValue(true),
}));

const con = require("./db_con").con;

const mockRes = {
  json: jest.fn(),
};

describe("productUtils", () => {
  const mockReq = {
    body: {
      nume: "mock-nume",
      cantitate: 2,
      tip: "mock-tip",
      data_expirare: "1669461638798",
      adresa: "mock-adresa",
      id: "mock-id",
      userJwt: "mockUserJwt",
    },
  };
  const mockCurrentMonth = 3;
  const mockCurrentYear = 2022;

  beforeAll(() => {
    jest.spyOn(Date.prototype, "getMonth").mockReturnValue(mockCurrentMonth);
    jest.spyOn(Date.prototype, "getFullYear").mockReturnValue(mockCurrentYear);
  });

  afterAll(() => {
    jest.resetAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("postProduct", () => {
    const expectedQuery = `INSERT INTO products (nume, cantitate, tip, data_expirare, adresa, luna, an, user_id) value ('${
      mockReq.body.nume
    }', '${mockReq.body.cantitate}', '${mockReq.body.tip}', '${
      mockReq.body.data_expirare
    }', '${mockReq.body.adresa}', '${
      mockCurrentMonth + 1
    }', '${mockCurrentYear}', '${mockUserId}')`;

    test("it posts a product", () => {
      productUtils.postProduct(mockReq, mockRes);

      expect(con.query).toHaveBeenCalledWith(
        expectedQuery,
        expect.any(Function)
      );
    });

    test('it calls res with add "false" if it errors', () => {
      const errorStatus = true;
      con.query.mockImplementationOnce((_, fn) => {
        fn(errorStatus);
      });
      productUtils.postProduct(mockReq, mockRes);

      expect(con.query).toHaveBeenCalledWith(
        expectedQuery,
        expect.any(Function)
      );
      expect(mockRes.json).toHaveBeenCalledWith({ add: "false" });
    });

    test('it calls res with add "true" if it is successful', () => {
      const errorStatus = false;
      con.query.mockImplementationOnce((_, fn) => {
        fn(errorStatus);
      });
      productUtils.postProduct(mockReq, mockRes);

      expect(con.query).toHaveBeenCalledWith(
        expectedQuery,
        expect.any(Function)
      );
      expect(mockRes.json).toHaveBeenCalledWith({ add: "true" });
    });
  });

  describe("putProduct", () => {
    const expectedQuery = `UPDATE products SET nume='${mockReq.body.nume}', cantitate='${mockReq.body.cantitate}', tip='${mockReq.body.tip}', data_expirare='${mockReq.body.data_expirare}', adresa='${mockReq.body.adresa}' WHERE id=${mockReq.body.id}`;

    test("it modifies a product", async () => {
      await productUtils.putProduct(mockReq, mockRes);

      expect(con.query).toHaveBeenCalledWith(
        expectedQuery,
        expect.any(Function)
      );
    });

    test('it calls res with modify "false" if it errors', async () => {
      const errorStatus = true;
      con.query.mockImplementationOnce((_, fn) => {
        fn(errorStatus);
      });
      await productUtils.putProduct(mockReq, mockRes);

      expect(con.query).toHaveBeenCalledWith(
        expectedQuery,
        expect.any(Function)
      );
      expect(mockRes.json).toHaveBeenCalledWith({ modify: "false" });
    });

    test('it calls res with modify "true" if it is successful', async () => {
      const errorStatus = false;
      con.query.mockImplementationOnce((_, fn) => {
        fn(errorStatus);
      });
      await productUtils.putProduct(mockReq, mockRes);

      expect(con.query).toHaveBeenCalledWith(
        expectedQuery,
        expect.any(Function)
      );
      expect(mockRes.json).toHaveBeenCalledWith({ modify: "true" });
    });
  });

  describe("deleteProduct", () => {
    const expectedQuery = `DELETE FROM products WHERE id=${mockReq.body.id}`;

    test("it modifies a product", async () => {
      await productUtils.deleteProduct(mockReq, mockRes);

      expect(con.query).toHaveBeenCalledWith(
        expectedQuery,
        expect.any(Function)
      );
    });

    test('it calls res with delete "false" if it errors', async () => {
      const errorStatus = true;
      con.query.mockImplementationOnce((_, fn) => {
        fn(errorStatus);
      });
      await productUtils.deleteProduct(mockReq, mockRes);

      expect(con.query).toHaveBeenCalledWith(
        expectedQuery,
        expect.any(Function)
      );
      expect(mockRes.json).toHaveBeenCalledWith({ delete: "false" });
    });

    test('it calls res with delete "true" if it is successful', async () => {
      const errorStatus = false;
      con.query.mockImplementationOnce((_, fn) => {
        fn(errorStatus);
      });
      await productUtils.deleteProduct(mockReq, mockRes);

      expect(con.query).toHaveBeenCalledWith(
        expectedQuery,
        expect.any(Function)
      );
      expect(mockRes.json).toHaveBeenCalledWith({ delete: "true" });
    });
  });

  describe("getProducts", () => {
    const expectedQuery = `SELECT * FROM products`;

    test("it modifies a product", () => {
      productUtils.getProducts(mockReq, mockRes);

      expect(con.query).toHaveBeenCalledWith(
        expectedQuery,
        expect.any(Function)
      );
    });

    test('it calls res with products "error" if it errors', () => {
      const errorStatus = true;
      con.query.mockImplementationOnce((_, fn) => {
        fn(errorStatus);
      });
      productUtils.getProducts(mockReq, mockRes);

      expect(con.query).toHaveBeenCalledWith(
        expectedQuery,
        expect.any(Function)
      );
      expect(mockRes.json).toHaveBeenCalledWith({ products: "error" });
    });

    test("it calls res with products if it is successful", () => {
      const errorStatus = false;
      const products = "mock-products";
      con.query.mockImplementationOnce((_, fn) => {
        fn(errorStatus, products);
      });
      productUtils.getProducts(mockReq, mockRes);

      expect(con.query).toHaveBeenCalledWith(
        expectedQuery,
        expect.any(Function)
      );
      expect(mockRes.json).toHaveBeenCalledWith({ products });
    });
  });
});
