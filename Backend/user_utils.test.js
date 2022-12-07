const getUser = require("./user_utils").getUser;

jest.mock("./auth_utils", () => {
  return {
    getUserData: jest.fn().mockResolvedValue("mock_data"),
  };
});

const auth_utils = require("./auth_utils");

const mockReq = {
  body: {
    user_id: "123456",
  },
};

const mockRes = {
  json: jest.fn(),
};

describe("get user", () => {
  test("gets user", async () => {
    getUser(mockReq, mockRes);
    await new Promise((resolve) => resolve());
    expect(auth_utils.getUserData).toHaveBeenCalledWith(mockReq.body.user_id);
    expect(mockRes.json).toHaveBeenCalledWith({
      user: "mock_data",
    });
  });
});
