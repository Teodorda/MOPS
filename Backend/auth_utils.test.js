const authUtils = require("./auth_utils");
const axios = require("axios").default;
const consts = require("./const");
const jwt = require("jsonwebtoken");

jest.mock("axios", () => {
  return {
    default: {
      post: jest.fn(),
      request: jest.fn(),
    },
  };
});

jest.mock("jsonwebtoken", () => ({
  sign: jest.fn(),
  verify: jest.fn(),
}));

describe("auth_utils", () => {
const mockUserId = 'mock-user-id';
const mockJwt = 'mock-jwt';
const mockAccessToken = "mock-access-token";
const mockAccessTokenBearer = `Bearer ${mockAccessToken}`;

beforeAll(() => {
    jest.spyOn(console, 'log');
    jest.spyOn(console, 'error');
});

afterEach(() => {
    jest.resetAllMocks();
});

afterAll(() => {
    jest.restoreAllMocks();
});

  describe("getManagementApiToken", () => {

    test("it makes a request to auth and sets the access token", async () => {
      axios.post.mockResolvedValue({ data: {access_token: mockAccessToken} });
      await authUtils.getManagementApiToken();

      expect(axios.post).toHaveBeenCalledWith(consts.oauth_token_url, {
        client_id: process.env.client_id,
        client_secret: process.env.client_secret,
        audience: consts.oauth_api_v2,
        grant_type: "client_credentials",
      });
      expect(authUtils.getAccessToken()).toBe(mockAccessTokenBearer);
    });
  });

  describe("generateJwtWithUserId", () => {
    test('it signs a new json web token and returns it', () => {
        jwt.sign.mockReturnValue(mockJwt);

        expect(authUtils.generateJwtWithUserId(mockUserId)).toBe(mockJwt);
        expect(jwt.sign).toHaveBeenCalledWith({user_id: mockUserId}, consts.private_key);
    });
  });

  describe("getUserIdFromJwt", () => {
    test('it verifies the jwt is valid and returns the user_id', () => {
        jwt.verify.mockReturnValue({user_id: mockUserId});

        expect(authUtils.getUserIdFromJwt(mockJwt)).toBe(mockUserId);
        expect(jwt.verify).toHaveBeenCalledWith(mockJwt, consts.private_key);
    });

    test('it verifies the jwt is valid and returns null if it is not valid', () => {
        jwt.verify.mockReturnValue({});

        expect(authUtils.getUserIdFromJwt(mockJwt)).toBe(null);
    });
  });

  describe("getUserData", () => {
    const mockOptions = {
        method: "GET",
        url: `${consts.oauth_api_v2}users/${mockUserId}`,
        headers: { authorization: mockAccessTokenBearer },
      };

    test('it returns user data for user matching the userId', async () => {
        const mockUserData = 'mock-user-data';
        axios.request.mockResolvedValue({data: mockUserData});

        expect(await authUtils.getUserData(mockUserId)).toBe(mockUserData);
        expect(axios.request).toHaveBeenCalledWith(mockOptions);
    });

    test('it returns null when not matching the userId', async () => {
        axios.request.mockRejectedValue(new Error());

        expect(await authUtils.getUserData(mockUserId)).toBe(null);
        expect(console.error).toHaveBeenCalled();
    });
  });

  describe("isUserAdmin", () => {
    test('it returns true if user metadata admin is true', async () => {
        const getUserDataSpy = jest.spyOn(authUtils, 'getUserData').mockResolvedValue({user_metadata: {admin: 'true'}});

        expect(await authUtils.isUserAdmin(mockUserId)).toBe(true);

        getUserDataSpy.mockRestore();
    });

    test('it returns false if user metadata admin is false', async () => {
        const getUserDataSpy = jest.spyOn(authUtils, 'getUserData').mockResolvedValue({user_metadata: {admin: 'false'}});

        expect(await authUtils.isUserAdmin(mockUserId)).toBe(false);

        getUserDataSpy.mockRestore();
    });
  });

  describe("canUserEditEntity", () => {
    const mockEntityId = 'mock-entity-id';
    const mockEntityFn = jest.fn();

    test('it returns false if entity was not found', async () => {
        const isUserAdminSpy = jest.spyOn(authUtils, 'isUserAdmin');
        mockEntityFn.mockResolvedValueOnce(null);
        expect(await authUtils.canUserEditEntity(mockUserId, mockEntityId, mockEntityFn)).toBe(false);

        expect(mockEntityFn).toHaveBeenCalledWith(mockEntityId);
        expect(authUtils.isUserAdmin).not.toHaveBeenCalled();

        isUserAdminSpy.mockRestore();
    });

    test('it returns true if user is admin', async () => {
        const isUserAdminSpy = jest.spyOn(authUtils, 'isUserAdmin').mockResolvedValueOnce(true);
        mockEntityFn.mockResolvedValueOnce({});
        expect(await authUtils.canUserEditEntity(mockUserId, mockEntityId, mockEntityFn)).toBe(true);

        expect(mockEntityFn).toHaveBeenCalledWith(mockEntityId);
        expect(authUtils.isUserAdmin).toHaveBeenCalledWith(mockUserId);

        isUserAdminSpy.mockRestore();
    });

    test('it returns true if user is entity\'s user', async () => {
        const isUserAdminSpy = jest.spyOn(authUtils, 'isUserAdmin').mockResolvedValueOnce(false);
        mockEntityFn.mockResolvedValueOnce({user_id: mockUserId});
        expect(await authUtils.canUserEditEntity(mockUserId, mockEntityId, mockEntityFn)).toBe(true);

        expect(mockEntityFn).toHaveBeenCalledWith(mockEntityId);
        expect(authUtils.isUserAdmin).toHaveBeenCalledWith(mockUserId);

        isUserAdminSpy.mockRestore();
    });

    test('it returns false if no userId is provided', async () => {
        const isUserAdminSpy = jest.spyOn(authUtils, 'isUserAdmin');

        expect(await authUtils.canUserEditEntity(undefined, mockEntityId, mockEntityFn)).toBe(false);
        expect(mockEntityFn).not.toHaveBeenCalled();
        expect(authUtils.isUserAdmin).not.toHaveBeenCalled();

        isUserAdminSpy.mockRestore();
    });
  });
});
