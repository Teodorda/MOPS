const productUtils = require("./tdd_product_utils");
const auth_utils = require("./auth_utils");

jest.mock("./db_con.js", () => {
  return {
    con: {
      query: jest.fn(),
    },
  };
});

jest.mock("./auth_utils", () => ({
  getUserData: jest.fn(),
  getUserIdFromJwt: jest.fn(),
}));

const con = require("./db_con").con;

const mockRes = {
  json: jest.fn(),
};

describe("productUtils", () => {
  const generate_user = (id) => {
    return {
      user_id: id,
      username: "mock_username-" + id,
      email: "mock_email-" + id,
    };
  };

  const generate_product = (id, user_id) => {
    return {
      id: id,
      nume: "nume-produs-" + id,
      cantitate: "10",
      tip: "tip-produs-" + id,
      data_expirare: Date.now(),
      adresa: "adresa-" + id,
      luna: "luna",
      an: "an",
      user_id: user_id,
    };
  };

  const generate_request = (id, user_id) => {
    return {
      id: id,
      nume: "nume-cerere-" + id,
      cantitate: "10",
      adresa: "adresa-" + id,
      luna: "luna",
      an: "an",
      user_id: user_id,
    };
  };

  const generate_products = (users, count) => {
    const arr = [];

    users.forEach((user) => {
      for (let i = 0; i < count; ++i) {
        arr.push(generate_product(i, user.user_id));
      }
    });

    return arr;
  };

  const generate_requests = (users, count) => {
    const arr = [];

    users.forEach((user) => {
      for (let i = 0; i < count; ++i) {
        arr.push(generate_request(i, user.user_id));
      }
    });

    return arr;
  };

  const generate_users = (count) => {
    const arr = [];

    for (let i = 0; i < count; ++i) {
      arr.push(generate_user(i));
    }

    return arr;
  };

  beforeAll(() => {
    jest.spyOn(console, "log").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    jest.resetAllMocks();
  });

  describe("getProducts", () => {
    const expectedQuery = `SELECT * FROM products`;
    const userCount = 5;
    const mockUsers = generate_users(userCount);
    const mockProducts = generate_products(mockUsers, 5);

    test("it calls res with products that have userData if successful", async () => {
      const expectedProducts = mockProducts.map((p) => ({
        ...p,
        user: mockUsers.find((user) => user.user_id === p.user_id),
      }));
      auth_utils.getUserData.mockImplementation(
        (user_id) =>
          new Promise((resolve) =>
            resolve(mockUsers.find((user) => user.user_id === user_id))
          )
      );

      con.query.mockImplementation((query, cb) => {
        cb(null, mockProducts);
      });

      productUtils.getProducts(mockRes);
      await new Promise((resolve) => setTimeout(resolve, 500));

      expect(con.query).toHaveBeenCalledWith(
        expectedQuery,
        expect.any(Function)
      );
      expect(auth_utils.getUserData).toHaveBeenCalledTimes(userCount);
      expect(console.log).not.toHaveBeenCalled();
      expect(mockRes.json).toHaveBeenCalledTimes(1);
      expect(mockRes.json).toHaveBeenCalledWith({ products: expectedProducts });
    });

    test("it calls res with products error if not successful", async () => {
      const err = new Error();
      con.query.mockImplementation((query, cb) => {
        cb(err, []);
      });

      productUtils.getProducts(mockRes);
      await new Promise((resolve) => setTimeout(resolve, 500));

      expect(con.query).toHaveBeenCalledWith(
        expectedQuery,
        expect.any(Function)
      );
      expect(auth_utils.getUserData).not.toHaveBeenCalled();
      expect(console.log).toHaveBeenCalledWith(err);
      expect(mockRes.json).toHaveBeenCalledTimes(1);
      expect(mockRes.json).toHaveBeenCalledWith({ products: "error" });
    });

    test("it calls res with products error if userData failed to be fetched", async () => {
      const err = new Error();
      auth_utils.getUserData.mockImplementation(
        () => new Promise((resolve, reject) => reject(err))
      );

      con.query.mockImplementation((query, cb) => {
        cb(null, mockProducts);
      });

      productUtils.getProducts(mockRes);
      await new Promise((resolve) => setTimeout(resolve, 500));

      expect(con.query).toHaveBeenCalledWith(
        expectedQuery,
        expect.any(Function)
      );
      expect(auth_utils.getUserData).toHaveBeenCalled();
      expect(console.log).toHaveBeenCalledWith(err);
      expect(mockRes.json).toHaveBeenCalledTimes(1);
      expect(mockRes.json).toHaveBeenCalledWith({ products: "error" });
    });
  });

  describe("postProducts", () => {
    const mockCurrentMonth = 12;
    const mockFullYear = 2022;

    const mockUserJwt = "mock-user-jwt";
    const mockUserId = "mock-user-id";

    const mockReq = {
      body: {
        nume: "mock-nume",
        cantitate: "10",
        tip: "mock-tip",
        data_expirare: Date.now(),
        adresa: "mock-adresa",
        userJwt: mockUserJwt,
      },
    };

    const expectedQuery = `INSERT INTO products (nume, cantitate, tip, data_expirare, adresa, luna, an, user_id) value ('${
      mockReq.body.nume
    }', '${mockReq.body.cantitate}', '${mockReq.body.tip}', '${
      mockReq.body.data_expirare
    }', '${mockCurrentMonth + 1}', '${mockFullYear}', '${mockUserId}')`;

    beforeAll(() => {
      jest.spyOn(Date.prototype, "getMonth").mockReturnValue(mockCurrentMonth);
      jest.spyOn(Date.prototype, "getFullYear").mockReturnValue(mockFullYear);
    });

    test("it calls res with add true if successful", async () => {
      con.query.mockImplementation((query, cb) => {
        cb(null);
      });
      auth_utils.getUserIdFromJwt.mockReturnValue(mockUserId);

      productUtils.postProduct(mockReq, mockRes);

      expect(con.query).toHaveBeenCalledWith(
        expectedQuery,
        expect.any(Function)
      );
      expect(auth_utils.getUserIdFromJwt).toHaveBeenCalledWith(mockUserJwt);
      expect(mockRes.json).toHaveBeenCalledTimes(1);
      expect(mockRes.json).toHaveBeenCalledWith({ add: "true" });
    });

    test("it calls res with add false if auth_utils fails", () => {
      const err = new Error();
      auth_utils.getUserIdFromJwt.mockImplementation(() => {
        throw err;
      });

      productUtils.postProduct(mockReq, mockRes);

      expect(con.query).not.toHaveBeenCalled();
      expect(auth_utils.getUserIdFromJwt).toHaveBeenCalledWith(mockUserJwt);
      expect(mockRes.json).toHaveBeenCalledTimes(1);
      expect(mockRes.json).toHaveBeenCalledWith({ add: "false" });
      expect(console.log).toHaveBeenCalledWith(err);
    });

    test("it calls res with add false if user_id is not found", () => {
      auth_utils.getUserIdFromJwt.mockReturnValue(null);

      productUtils.postProduct(mockReq, mockRes);

      expect(con.query).not.toHaveBeenCalled();
      expect(auth_utils.getUserIdFromJwt).toHaveBeenCalledWith(mockUserJwt);
      expect(mockRes.json).toHaveBeenCalledTimes(1);
      expect(mockRes.json).toHaveBeenCalledWith({ add: "false" });
      expect(console.log).toHaveBeenCalledWith(expect.any(Error));
    });

    test("it calls res with add false if db query fails", async () => {
      const err = new Error();
      con.query.mockImplementation((query, cb) => {
        cb(err);
      });
      auth_utils.getUserIdFromJwt.mockReturnValue(mockUserId);

      productUtils.postProduct(mockReq, mockRes);

      expect(con.query).toHaveBeenCalledWith(
        expectedQuery,
        expect.any(Function)
      );
      expect(auth_utils.getUserIdFromJwt).toHaveBeenCalledWith(mockUserJwt);
      expect(mockRes.json).toHaveBeenCalledTimes(1);
      expect(mockRes.json).toHaveBeenCalledWith({ add: "false" });
      expect(console.log).toHaveBeenCalledWith(err);
    });

    test("it calls res with add false if req body is not supplied", () => {
      productUtils.postProduct({}, mockRes);

      expect(con.query).not.toHaveBeenCalled();
      expect(auth_utils.getUserIdFromJwt).not.toHaveBeenCalled();
      expect(mockRes.json).toHaveBeenCalledTimes(1);
      expect(mockRes.json).toHaveBeenCalledWith({ add: "false" });
      expect(console.log).toHaveBeenCalledWith(expect.any(Error));
    });
  });

  describe("getRequests", () => {
    const expectedQuery = `SELECT * FROM cereri`;
    const userCount = 5;
    const mockUsers = generate_users(userCount);
    const mockRequests = generate_requests(mockUsers, 5);

    test("it calls res with requests that have userData if successful", async () => {
      const expectedRequests = mockRequests.map((r) => ({
        ...r,
        user: mockUsers.find((user) => user.user_id === r.user_id),
      }));
      auth_utils.getUserData.mockImplementation(
        (user_id) =>
          new Promise((resolve) =>
            resolve(mockUsers.find((user) => user.user_id === user_id))
          )
      );

      con.query.mockImplementation((query, cb) => {
        cb(null, mockRequests);
      });

      productUtils.getRequests(mockRes);
      await new Promise((resolve) => setTimeout(resolve, 500));

      expect(con.query).toHaveBeenCalledWith(
        expectedQuery,
        expect.any(Function)
      );
      expect(auth_utils.getUserData).toHaveBeenCalledTimes(userCount);
      expect(console.log).not.toHaveBeenCalled();
      expect(mockRes.json).toHaveBeenCalledTimes(1);
      expect(mockRes.json).toHaveBeenCalledWith({ requests: expectedRequests });
    });

    test("it calls res with requests error if not successful", async () => {
      const err = new Error();
      con.query.mockImplementation((query, cb) => {
        cb(err, []);
      });

      productUtils.getRequests(mockRes);
      await new Promise((resolve) => setTimeout(resolve, 500));

      expect(con.query).toHaveBeenCalledWith(
        expectedQuery,
        expect.any(Function)
      );
      expect(auth_utils.getUserData).not.toHaveBeenCalled();
      expect(console.log).toHaveBeenCalledWith(err);
      expect(mockRes.json).toHaveBeenCalledTimes(1);
      expect(mockRes.json).toHaveBeenCalledWith({ requests: "error" });
    });

    test("it calls res with requests error if userData failed to be fetched", async () => {
      const err = new Error();
      auth_utils.getUserData.mockImplementation(
        () => new Promise((resolve, reject) => reject(err))
      );

      con.query.mockImplementation((query, cb) => {
        cb(null, mockRequests);
      });

      productUtils.getRequests(mockRes);
      await new Promise((resolve) => setTimeout(resolve, 500));

      expect(con.query).toHaveBeenCalledWith(
        expectedQuery,
        expect.any(Function)
      );
      expect(auth_utils.getUserData).toHaveBeenCalled();
      expect(console.log).toHaveBeenCalledWith(err);
      expect(mockRes.json).toHaveBeenCalledTimes(1);
      expect(mockRes.json).toHaveBeenCalledWith({ requests: "error" });
    });
  });
});
