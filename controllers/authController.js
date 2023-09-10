import User from '../models/UserModel.js';
import { StatusCodes } from 'http-status-codes';
import { hashPassword, comparePasswords } from '../utils/passwordUtils.js';
import { UnauthenticatedError } from '../errors/customErrors.js';
import { createJWT } from '../utils/tokenUtils.js';

export const register = async (req, res) => {
    // check if any user exists, if not, set role to admin
    const isFirstAccount = await User.countDocuments() === 0;
    req.body.role = isFirstAccount ? 'admin' : 'user';

    // hash password
    const hashedPassword = await hashPassword(req.body.password);
    req.body.password = hashedPassword;

    // create user
    const user = await User.create(req.body);
    res.status(StatusCodes.CREATED).json({ msg: 'user created successfully' });
}

export const login = async (req, res) => {
    // verify email
    const user = await User.findOne({ email: req.body.email });
    if (!user) throw new UnauthenticatedError('invalid credentials');

    // verify password
    const isPasswordCorrect = await comparePasswords(req.body.password, user.password);
    if (!isPasswordCorrect) throw new UnauthenticatedError('invalid credentials');

    // create token
    const token = createJWT({ userId: user._id, role: user.role });

    // send token in cookie (it is httpOnly, so it is not accessible from the frontend, more secure than localStorage)
    res.cookie('token', token, {
        httpOnly: true,
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
        secure: process.env.NODE_ENV === 'production',
    });

    res.status(StatusCodes.OK).json({ msg: 'login successful' });
}

export const logout = async (req, res) => {
    res.cookie('token', 'logout', {
        httpOnly: true,
        expires: new Date(Date.now()),
    });
    res.status(StatusCodes.OK).json({ msg: 'logout successful' });
}
