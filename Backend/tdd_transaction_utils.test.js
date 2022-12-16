const transactionUtils = require("./tdd_transaction_utils");

jest.mock("./db_con.js", () => {
  return {
    con: {
      query: jest.fn(),
    },
  };
});

const mockRes = {
  json: jest.fn(),
};

const con = require("./db_con").con;

describe("transactionUtils", () => {
  beforeAll(() => {
    jest.spyOn(console, "log").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    jest.resetAllMocks();
  });

  const mockUserId = "mock-user-id";

  const generate_history_donator = (id) => {
    return {
      id: id,
      name: "name-" + id,
      cantitate: "10",
      donator: "mock-donator-" + id,
      user_id: mockUserId,
    };
  };

  const generate_history_beneficiary = (id) => {
    return {
      id: id,
      name: "name-" + id,
      cantitate: "10",
      beneficiar: "mock-beneficiar-" + id,
      user_id: mockUserId,
    };
  };

  const generate_histories = (count, generate_fn) => {
    const arr = [];

    for (let i = 0; i < count; ++i) {
      arr.push(generate_fn(i));
    }

    return arr;
  };

  describe("getHistoryDonator", () => {
    const mockReq = {
      body: {
        user_id: mockUserId,
      },
    };

    const expectedQuery =
      "SELECT * FROM history_donator WHERE user_id='" + mockUserId + "'";
    const mockHistDonator = generate_histories(5, generate_history_donator);

    test("it calls res with history result if successful", () => {
      con.query.mockImplementation((query, cb) => {
        cb(null, mockHistDonator);
      });

      transactionUtils.getHistoryDonator(mockReq, mockRes);

      expect(con.query).toHaveBeenCalledWith(
        expectedQuery,
        expect.any(Function)
      );
      expect(console.log).not.toHaveBeenCalled();
      expect(mockRes.json).toHaveBeenCalledTimes(1);
      expect(mockRes.json).toHaveBeenCalledWith({ history: mockHistDonator });
    });

    test("it calls res with history error if not successful", () => {
      const err = new Error();

      con.query.mockImplementation((query, cb) => {
        cb(err, []);
      });

      transactionUtils.getHistoryDonator(mockReq, mockRes);

      expect(con.query).toHaveBeenCalledWith(
        expectedQuery,
        expect.any(Function)
      );
      expect(console.log).toHaveBeenCalledWith(err);
      expect(mockRes.json).toHaveBeenCalledTimes(1);
      expect(mockRes.json).toHaveBeenCalledWith({ history: "error" });
    });
  });

  describe("getHistoryBeneficiary", () => {
    const mockReq = {
      body: {
        user_id: mockUserId,
      },
    };

    const expectedQuery =
      "SELECT * FROM history_beneficiar WHERE user_id='" + mockUserId + "'";
    const mockHistBeneficiary = generate_histories(
      5,
      generate_history_beneficiary
    );

    test("it calls res with history result if successful", () => {
      con.query.mockImplementation((query, cb) => {
        cb(null, mockHistBeneficiary);
      });

      transactionUtils.getHistoryBeneficiary(mockReq, mockRes);

      expect(con.query).toHaveBeenCalledWith(
        expectedQuery,
        expect.any(Function)
      );
      expect(console.log).not.toHaveBeenCalled();
      expect(mockRes.json).toHaveBeenCalledTimes(1);
      expect(mockRes.json).toHaveBeenCalledWith({
        history: mockHistBeneficiary,
      });
    });

    test("it calls res with history error if not successful", () => {
      const err = new Error();

      con.query.mockImplementation((query, cb) => {
        cb(err, []);
      });

      transactionUtils.getHistoryBeneficiary(mockReq, mockRes);

      expect(con.query).toHaveBeenCalledWith(
        expectedQuery,
        expect.any(Function)
      );
      expect(console.log).toHaveBeenCalledWith(err);
      expect(mockRes.json).toHaveBeenCalledTimes(1);
      expect(mockRes.json).toHaveBeenCalledWith({ history: "error" });
    });
  });

  describe("postHistoryDonator", () => {
    const mockReq = {
      body: {
        name: "mock-product-name",
        cantitate: "10",
        donator: "mock-donator-id",
        user_id: mockUserId,
      },
    };

    const expectedQuery = `INSERT INTO history_donator (name, cantitate, donator, user_id) value ('${mockReq.body.name}', '${mockReq.body.cantitate}', '${mockReq.body.donator}', '${mockReq.body.user_id}')`;

    test("it calls res with add true if successful", () => {
      con.query.mockImplementation((query, cb) => {
        cb(null);
      });

      transactionUtils.postHistoryDonator(mockReq, mockRes);

      expect(con.query).toHaveBeenCalledWith(
        expectedQuery,
        expect.any(Function)
      );
      expect(mockRes.json).toHaveBeenCalledTimes(1);
      expect(mockRes.json).toHaveBeenCalledWith({ add: "true" });
    });

    test("it calls res with add false if req body is missing", () => {
      transactionUtils.postHistoryDonator({}, mockRes);

      expect(con.query).not.toHaveBeenCalled();
      expect(mockRes.json).toHaveBeenCalledTimes(1);
      expect(mockRes.json).toHaveBeenCalledWith({ add: "false" });
      expect(console.log).toHaveBeenCalledWith(expect.any(Error));
    });
    
    test("it calls res with add false if query fails", () => {
      const err = new Error();
      con.query.mockImplementation((query, cb) => {
        cb(err);
      });

      transactionUtils.postHistoryDonator(mockReq, mockRes);

      expect(con.query).toHaveBeenCalledWith(
        expectedQuery,
        expect.any(Function)
      );
      expect(mockRes.json).toHaveBeenCalledTimes(1);
      expect(mockRes.json).toHaveBeenCalledWith({ add: "false" });
      expect(console.log).toHaveBeenCalledWith(err);
    });
  });

  describe("postHistoryBeneficiary", () => {
    const mockReq = {
      body: {
        name: "mock-product-name",
        cantitate: "10",
        beneficiar: "mock-beneficiary-id",
        user_id: mockUserId,
      },
    };

    const expectedQuery = `INSERT INTO history_beneficiar (name, cantitate, beneficiar, user_id) value ('${mockReq.body.name}', '${mockReq.body.cantitate}', '${mockReq.body.beneficiar}', '${mockReq.body.user_id}')`;

    test("it calls res with add true if successful", () => {
      con.query.mockImplementation((query, cb) => {
        cb(null);
      });

      transactionUtils.postHistoryBeneficiary(mockReq, mockRes);

      expect(con.query).toHaveBeenCalledWith(
        expectedQuery,
        expect.any(Function)
      );
      expect(mockRes.json).toHaveBeenCalledTimes(1);
      expect(mockRes.json).toHaveBeenCalledWith({ add: "true" });
    });

    test("it calls res with add false if req body is missing", () => {
      transactionUtils.postHistoryBeneficiary({}, mockRes);

      expect(con.query).not.toHaveBeenCalled();
      expect(mockRes.json).toHaveBeenCalledTimes(1);
      expect(mockRes.json).toHaveBeenCalledWith({ add: "false" });
      expect(console.log).toHaveBeenCalledWith(expect.any(Error));
    });
    
    test("it calls res with add false if query fails", () => {
      const err = new Error();
      con.query.mockImplementation((query, cb) => {
        cb(err);
      });

      transactionUtils.postHistoryBeneficiary(mockReq, mockRes);

      expect(con.query).toHaveBeenCalledWith(
        expectedQuery,
        expect.any(Function)
      );
      expect(mockRes.json).toHaveBeenCalledTimes(1);
      expect(mockRes.json).toHaveBeenCalledWith({ add: "false" });
      expect(console.log).toHaveBeenCalledWith(err);
    });
  });
});
