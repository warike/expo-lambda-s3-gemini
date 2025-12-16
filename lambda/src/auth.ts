import type { APIGatewayProxyEventV2 } from "aws-lambda";
import { verifyToken } from '@clerk/backend';
import { env } from './env.js';

export const checkAccess = async (event: APIGatewayProxyEventV2): Promise<boolean> => {
  try {
    const headers = event.headers || {};
    const authHeader = headers['x-clerk-token'] ?? headers['authorization'] ?? headers['Authorization'];
    const token = authHeader?.replace(/^Bearer\s+/i, '');
    if (!token) {
      return false;
    }

    await verifyToken(token, {
      secretKey: env.CLERK_SECRET_KEY,
    });
    return true;
  } catch (error) {
    return false;
  }
}