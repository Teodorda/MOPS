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
    jest.spyOn(console, 'log').mockImplementation(() => { });
  })

  afterEach(() => { jest.clearAllMocks() })

  afterAll(() => {
    jest.resetAllMocks();
  })

  const mockUserId = 'mock-user-id';

  const mockReq = {
    body: {
      user_id: mockUserId
    },
  };

  const generate_history_donator = (id) => {
    return {
      id: id,
      name: 'name-' + id,
      cantitate: '10',
      donator: 'mock-donator-' + id,
      user_id: mockUserId
    }
  }

  const generate_history_beneficiary = (id) => {
    return {
      id: id,
      name: 'name-' + id,
      cantitate: '10',
      beneficiar: 'mock-beneficiar-' + id,
      user_id: mockUserId
    }
  }

  const generate_histories = (count, generate_fn) => {
    const arr = []

    for (let i = 0; i < count; ++i) {
      arr.push(generate_fn(i));
    }

    return arr;
  }

  describe("getHistoryDonator", () => {
    const expectedQuery = "SELECT * FROM history_donator WHERE user_id='" + mockUserId + "'";
    const mockHistDonator = generate_histories(5, generate_history_donator);

    test('it calls res with history result if successful', () => {
      con.query.mockImplementation((query, cb) => {
        cb(null, mockHistDonator);
      });

      transactionUtils.getHistoryDonator(mockReq, mockRes);

      expect(con.query).toHaveBeenCalledWith(expectedQuery, expect.any(Function));
      expect(console.log).not.toHaveBeenCalled();
      expect(mockRes.json).toHaveBeenCalledTimes(1);
      expect(mockRes.json).toHaveBeenCalledWith({ history: mockHistDonator });
    });

    test('it calls res with history error if not successful', () => {
      const err = new Error();

      con.query.mockImplementation((query, cb) => {
        cb(err, []);
      });

      transactionUtils.getHistoryDonator(mockReq, mockRes);

      expect(con.query).toHaveBeenCalledWith(expectedQuery, expect.any(Function));
      expect(console.log).toHaveBeenCalledWith(err);
      expect(mockRes.json).toHaveBeenCalledTimes(1);
      expect(mockRes.json).toHaveBeenCalledWith({ history: 'error' });
    });
  });

  describe("getHistoryBeneficiary", () => {
    const expectedQuery = "SELECT * FROM history_beneficiar WHERE user_id='" + mockUserId + "'";
    const mockHistBeneficiary = generate_histories(5, generate_history_beneficiary);

    test('it calls res with history result if successful', () => {
      con.query.mockImplementation((query, cb) => {
        cb(null, mockHistBeneficiary);
      });

      transactionUtils.getHistoryBeneficiary(mockReq, mockRes);

      expect(con.query).toHaveBeenCalledWith(expectedQuery, expect.any(Function));
      expect(console.log).not.toHaveBeenCalled();
      expect(mockRes.json).toHaveBeenCalledTimes(1);
      expect(mockRes.json).toHaveBeenCalledWith({ history: mockHistBeneficiary });
    });

    test('it calls res with history error if not successful', () => {
      const err = new Error();

      con.query.mockImplementation((query, cb) => {
        cb(err, []);
      });

      transactionUtils.getHistoryBeneficiary(mockReq, mockRes);

      expect(con.query).toHaveBeenCalledWith(expectedQuery, expect.any(Function));
      expect(console.log).toHaveBeenCalledWith(err);
      expect(mockRes.json).toHaveBeenCalledTimes(1);
      expect(mockRes.json).toHaveBeenCalledWith({ history: 'error' });
    });
  });
})