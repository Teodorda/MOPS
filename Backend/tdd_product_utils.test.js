const productUtils = require("./tdd_product_utils");
const auth_utils = require("./auth_utils");

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
  getUserData: jest.fn(),
}));

const con = require("./db_con").con;

const mockRes = {
  json: jest.fn(),
};

describe("productUtils", () => {
  const mockReq = {};

  describe("getProducts", () => {
    const expectedQuery = `SELECT * FROM products`;

    test('it calls res with products "error" if result is null', () => {
      const result = null;
      const output = "error";

      expect(result).toBeFalsy()

      con.query.mockImplementationOnce((_, fn) => {
        fn(result)
      });
      productUtils.getProducts(mockReq, mockRes);

      expect(con.query).toHaveBeenCalledWith(
        expectedQuery,
        expect.any(Function)
      );
      expect(mockRes.json).toHaveBeenCalledWith({ products: output });
    });

    test('it calls res with products "error" if result is undefined', () => {
      const result = undefined;
      const output = "error";

      expect(result).toBeFalsy()

      con.query.mockImplementationOnce((_, fn) => {
        fn(result)
      });
      productUtils.getProducts(mockReq, mockRes);

      expect(con.query).toHaveBeenCalledWith(
        expectedQuery,
        expect.any(Function)
      );
      expect(mockRes.json).toHaveBeenCalledWith({ products: output });
    });

    test('it calls res with products "error" if it errors', () => {
      const errorStatus = true;
      const output = "error";

      con.query.mockImplementationOnce((_, fn) => {
        fn(errorStatus);
      });
      productUtils.getProducts(mockReq, mockRes);

      expect(con.query).toHaveBeenCalledWith(
        expectedQuery,
        expect.any(Function)
      );
      expect(mockRes.json).toHaveBeenCalledWith({ products: output });
    });

    test("it calls res with products if it is successful", async () => {
      const errorStatus = false;
      let data = {};

      const products = [
        {
          id: "mock-product-1",
          user_id: "mock-user-1",
        },
        {
          id: "mock-product-2",
          user_id: "mock-user-1",
        },
        {
          id: "mock-product-3",
          user_id: "mock-user-2",
        },
      ];

      const expectedProducts = products.map(p => ({
        ...p,
        user: { user_id: p.user_id }
      }));

      auth_utils.getUserData.mockImplementation((user_id) => {
        data = new Promise(resolve => {
          resolve({ user_id })
        });
        return data;
      });

      expect(data).toMatchObject({});

      con.query.mockImplementationOnce((_, fn) => {
        fn(errorStatus, products);
      });

      productUtils.getProducts(mockReq, mockRes);
      await new Promise(resolve => {
        setTimeout(() => resolve());
      });

      expect(con.query).toHaveBeenCalledWith(
        expectedQuery,
        expect.any(Function)
      );

      expect(mockRes.json).toHaveBeenCalledWith({ products: expectedProducts });
    });
  });
});
