const axios = require("axios").default;
const consts = require("./const");

const auth_utils = require("./auth_utils");

const user_utils = require("./user_utils");
jest.mock("axios", () => {
  return {
    default: {
      post: jest.fn().mockResolvedValue(),
      request: jest.fn(),
    },
  };
});

const mockRes = {
  json: jest.fn(),
};

describe("user_utils", () => {
  beforeAll(() => {
    jest.spyOn(console, "log");
    jest.spyOn(console, "error");
  });

  beforeEach(() => {
    jest.spyOn(auth_utils, "getUserData").mockResolvedValue("mock_data");
    jest.spyOn(auth_utils, "getAccessToken");
    jest.spyOn(auth_utils, "generateJwtWithUserId");
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  describe("get user", () => {
    const mockReq = {
      body: {
        user_id: "123456",
      },
    };

    test("gets user", async () => {
      user_utils.getUser(mockReq, mockRes);
      await new Promise((resolve) => resolve());
      expect(auth_utils.getUserData).toHaveBeenCalledWith(mockReq.body.user_id);
      expect(mockRes.json).toHaveBeenCalledWith({
        user: "mock_data",
      });
    });
  });

  describe("registerUser", () => {
    const mockReq = {
      body: {
        fname: "mock-first-name",
        lname: "mock-last-name",
        email: "mock-email",
        phone: "mock-phone",
        address: "mock-address",
        password: "mock-password",
        repeatpassword: "mock-password",
      },
    };

    const axiosPostData = {
      email: mockReq.body.email,
      username: mockReq.body.fname + "" + mockReq.body.lname,
      given_name: mockReq.body.fname,
      family_name: mockReq.body.lname,
      connection: "Username-Password-Authentication",
      password: mockReq.body.password,
      user_metadata: {
        phone: mockReq.body.phone,
        address: mockReq.body.address,
        admin: "false",
      },
    };

    test("it returns register 'false' if password and repeat pass do not match", () => {
      const _mockReq = {
        body: {
          ...mockReq.body,
          repeatpassword: "another-pass",
        },
      };

      user_utils.registerUser(_mockReq, mockRes);

      expect(axios.post).not.toHaveBeenCalled();
      expect(mockRes.json).toHaveBeenCalledWith({ register: "false" });
    });

    test("it returns register 'false' if axios request fails", async () => {
      axios.post.mockRejectedValueOnce(new Error());

      user_utils.registerUser(mockReq, mockRes);
      await new Promise((resolve) => setTimeout(resolve));

      expect(axios.post).toHaveBeenCalledWith(
        `${consts.oauth_api_v2}users`,
        axiosPostData,
        {
          headers: {
            Authorization: auth_utils.getAccessToken(),
          },
        }
      );
      expect(mockRes.json).toHaveBeenCalledWith({ register: "false" });
    });

    test("it returns register 'true' if successful", async () => {
      axios.post.mockResolvedValueOnce();

      user_utils.registerUser(mockReq, mockRes);
      await new Promise((resolve) => setTimeout(resolve));

      expect(axios.post).toHaveBeenCalledWith(
        `${consts.oauth_api_v2}users`,
        axiosPostData,
        {
          headers: {
            Authorization: auth_utils.getAccessToken(),
          },
        }
      );
      expect(mockRes.json).toHaveBeenCalledWith({ register: "true" });
    });
  });

  describe("loginUser", () => {
    const mockReq = {
      body: {
        email: "mock-email",
        password: "mock-password",
      },
    };
    const mockAccessToken = "mock-access-token";

    const axiosPostLoginData = {
      grant_type: "password",
      username: mockReq.body.email,
      password: mockReq.body.password,
      audience: `${consts.oauth_api_v2}`,
      scope: "read:current_user",
      client_id: process.env.client_id,
      client_secret: process.env.client_secret,
    };

    const axiosGetRequestOptions = {
      method: "GET",
      url: `${consts.oauth_api_v2}users-by-email`,
      params: { email: mockReq.body.email },
      headers: { authorization: mockAccessToken },
    };

    test("it returns userJwt 'false' if auth0 fails while trying to login", async () => {
      axios.post.mockRejectedValueOnce(new Error());
      user_utils.loginUser(mockReq, mockRes);
      await new Promise((resolve) => setTimeout(resolve));

      expect(axios.post).toHaveBeenCalledWith(
        consts.oauth_token_url,
        axiosPostLoginData
      );
      expect(mockRes.json).toHaveBeenCalledWith({ userJwt: "false" });
    });

    test("it returns userJwt 'false' if auth0 fails while trying to get user data", async () => {
      axios.post.mockResolvedValueOnce();
      axios.request.mockRejectedValueOnce(new Error());
      user_utils.loginUser(mockReq, mockRes);
      await new Promise((resolve) => setTimeout(resolve, 1000));

      expect(axios.post).toHaveBeenCalledWith(
        consts.oauth_token_url,
        axiosPostLoginData
      );
      expect(axios.request).toHaveBeenCalled();
      expect(mockRes.json).toHaveBeenCalledWith({ userJwt: "false" });
    });

    test("it returns userJwt if auth0 is successful", async () => {
      const mockUserId = "mock-user-id";
      const mockJwt = "mock-jwt";
      axios.post.mockResolvedValueOnce();
      auth_utils.getAccessToken.mockReturnValue(mockAccessToken);
      axios.request.mockResolvedValueOnce({
        data: [{ user_id: mockUserId }],
      });
      auth_utils.generateJwtWithUserId.mockReturnValue(mockJwt);
      user_utils.loginUser(mockReq, mockRes);
      await new Promise((resolve) => setTimeout(resolve));

      expect(axios.post).toHaveBeenCalledWith(
        consts.oauth_token_url,
        axiosPostLoginData
      );
      expect(axios.request).toHaveBeenCalledWith(axiosGetRequestOptions);
      expect(auth_utils.generateJwtWithUserId).toHaveBeenCalledWith(mockUserId);

      expect(mockRes.json).toHaveBeenCalledWith({ userJwt: mockJwt });
    });
  });
});
