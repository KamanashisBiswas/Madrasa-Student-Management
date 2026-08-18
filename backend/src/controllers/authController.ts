import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import { User } from '../models/User.js';
import { Teacher } from '../models/Teacher.js';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils/jwt.js';
import { sendResponse } from '../utils/apiResponse.js';
import { ApiError } from '../utils/apiError.js';
import { loginSchema, refreshTokenSchema, changePasswordSchema } from '../validators/authValidator.js';
import { AuthenticatedRequest } from '../middleware/auth.js';

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = loginSchema.parse(req.body);

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return next(new ApiError(401, 'Invalid email or password', 'INVALID_CREDENTIALS'));
    }

    if (user.status !== 'ACTIVE') {
      return next(new ApiError(403, 'Your account is deactivated. Please contact Principal.', 'ACCOUNT_INACTIVE'));
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return next(new ApiError(401, 'Invalid email or password', 'INVALID_CREDENTIALS'));
    }

    const payload = {
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
      refId: user.refId ? user.refId.toString() : undefined,
    };

    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    // Save refresh token
    user.refreshTokens.push(refreshToken);
    user.lastLogin = new Date();
    await user.save();

    // Fetch teacher profile info if role is TEACHER
    let profileData: any = null;
    if (user.role === 'TEACHER' && user.refId) {
      profileData = await Teacher.findById(user.refId);
    }

    return sendResponse({
      res,
      message: 'Login successful',
      data: {
        accessToken,
        refreshToken,
        user: {
          id: user._id,
          email: user.email,
          role: user.role,
          refId: user.refId,
          profile: profileData,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

export const refreshToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { refreshToken: token } = refreshTokenSchema.parse(req.body);

    const payload = verifyRefreshToken(token);

    const user = await User.findById(payload.userId);
    if (!user || !user.refreshTokens.includes(token)) {
      return next(new ApiError(401, 'Invalid refresh token', 'INVALID_TOKEN'));
    }

    const newAccessToken = generateAccessToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
      refId: user.refId ? user.refId.toString() : undefined,
    });

    return sendResponse({
      res,
      message: 'Token refreshed successfully',
      data: {
        accessToken: newAccessToken,
      },
    });
  } catch (error) {
    next(new ApiError(401, 'Invalid or expired refresh token', 'INVALID_TOKEN'));
  }
};

export const logout = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { refreshToken: token } = req.body;

    if (req.user && token) {
      await User.findByIdAndUpdate(req.user.userId, {
        $pull: { refreshTokens: token },
      });
    }

    return sendResponse({
      res,
      message: 'Logged out successfully',
    });
  } catch (error) {
    next(error);
  }
};

export const changePassword = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { currentPassword, newPassword } = changePasswordSchema.parse(req.body);
    const userId = req.user?.userId;

    const user = await User.findById(userId);
    if (!user) {
      return next(new ApiError(404, 'User not found', 'USER_NOT_FOUND'));
    }

    const isMatch = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!isMatch) {
      return next(new ApiError(400, 'Current password is incorrect', 'INCORRECT_PASSWORD'));
    }

    user.passwordHash = await bcrypt.hash(newPassword, 10);
    user.refreshTokens = []; // Revoke all active sessions
    await user.save();

    return sendResponse({
      res,
      message: 'Password changed successfully. Please log in again.',
    });
  } catch (error) {
    next(error);
  }
};

export const getMe = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.userId;
    const user = await User.findById(userId).select('-passwordHash -refreshTokens');

    if (!user) {
      return next(new ApiError(404, 'User not found', 'USER_NOT_FOUND'));
    }

    let profileData: any = null;
    if (user.role === 'TEACHER' && user.refId) {
      profileData = await Teacher.findById(user.refId);
    }

    return sendResponse({
      res,
      data: {
        user: {
          id: user._id,
          email: user.email,
          role: user.role,
          refId: user.refId,
          profile: profileData,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};
