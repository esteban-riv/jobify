import { UnauthenticatedError, UnauthorizedError, BadRequestError } from "../errors/customErrors.js";
import { verifyJWT } from "../utils/tokenUtils.js";

export const authenticatedUser = async (req, res, next) => {
    // check if token exists
    const { token } = req.cookies;
    if (!token) {
        throw new UnauthenticatedError('Authentication invalid');
    }

    // verify jwt
    try {
        const { userId, role } = verifyJWT(token);
        const testUser = userId === '64f9a3eabf70a82dcf8760c9'
        req.user = { userId, role, testUser };
        next();

    } catch (error) {
        throw new UnauthenticatedError('Authentication invalid');
    }

};


export const authorizePermissions = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            throw new UnauthorizedError('Unauthorized');
        }
        next()
    }
}

export const checkForTestUser = (req, res, next) => {
    if (req.user.testUser) {
        throw new BadRequestError('Test user cannot perform this action')
    }
    next()
}