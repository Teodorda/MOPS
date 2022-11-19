const postUser = require('./user_utils').postUser
const consts = require('./const')

jest.mock('axios', () => {
    return({
        default:  {
            request: jest.fn().mockResolvedValue({
                data: "mock_data"
            })
        }
    })
})

const axios = require('axios').default

const mockReq = {
    body: {
        user_id: "123456"
    }
}

const mockRes = {
    json: jest.fn()
}

const mockAccessToken = 'ACCESS_TOKEN'

describe("post user", () => {
    test("posts user", async () => {
        const expectedOptions = {
            method: 'GET',
            url: `${consts.oauth_api_v2}users/`+mockReq.body.user_id,
            headers: {authorization: mockAccessToken}
        }
        postUser(mockReq, mockRes, mockAccessToken);
        await(new Promise(resolve => resolve()));
        expect (axios.request).toHaveBeenCalledWith(expectedOptions);
        expect (mockRes.json).toHaveBeenCalledWith({
            user: "mock_data"
        });
    })
})