import { checkAccess } from '../auth';
import { verifyToken } from '@clerk/backend';
import type { APIGatewayProxyEventV2 } from 'aws-lambda';

// Mock the clerk backend
jest.mock('@clerk/backend', () => ({
    verifyToken: jest.fn(),
}));

describe('checkAccess', () => {
    const mockEvent: Partial<APIGatewayProxyEventV2> = {
        headers: {},
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should return false if no headers are provided', async () => {
        const event = { ...mockEvent, headers: undefined } as unknown as APIGatewayProxyEventV2;
        const result = await checkAccess(event);
        expect(result).toBe(false);
    });

    it('should return false if no auth headers are provided', async () => {
        const event = { ...mockEvent, headers: {} } as unknown as APIGatewayProxyEventV2;
        const result = await checkAccess(event);
        expect(result).toBe(false);
    });

    it('should return true if valid x-clerk-token is provided', async () => {
        (verifyToken as jest.Mock).mockResolvedValue({} as any);

        const event = {
            ...mockEvent,
            headers: {
                'x-clerk-token': 'valid_token',
            },
        } as unknown as APIGatewayProxyEventV2;

        const result = await checkAccess(event);

        expect(verifyToken).toHaveBeenCalledWith('valid_token', expect.objectContaining({
            secretKey: expect.any(String),
        }));
        expect(result).toBe(true);
    });

    it('should return true if valid Authorization header (Bearer) is provided', async () => {
        (verifyToken as jest.Mock).mockResolvedValue({} as any);

        const event = {
            ...mockEvent,
            headers: {
                'authorization': 'Bearer valid_jwt_token',
            },
        } as unknown as APIGatewayProxyEventV2;

        const result = await checkAccess(event);

        expect(verifyToken).toHaveBeenCalledWith('valid_jwt_token', expect.objectContaining({
            secretKey: expect.any(String),
        }));
        expect(result).toBe(true);
    });

    it('should handle case-insensitive Authorization header', async () => {
        (verifyToken as jest.Mock).mockResolvedValue({} as any);

        const event = {
            ...mockEvent,
            headers: {
                'Authorization': 'Bearer valid_jwt_token',
            },
        } as unknown as APIGatewayProxyEventV2;

        const result = await checkAccess(event);

        expect(result).toBe(true);
    });

    it('should return false if verifyToken throws an error', async () => {
        (verifyToken as jest.Mock).mockRejectedValue(new Error('Invalid token'));

        const event = {
            ...mockEvent,
            headers: {
                'x-clerk-token': 'invalid_token',
            },
        } as unknown as APIGatewayProxyEventV2;

        const result = await checkAccess(event);

        expect(result).toBe(false);
    });
});
