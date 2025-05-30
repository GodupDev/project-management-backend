import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

/**
 * Lớp lỗi tùy chỉnh để xử lý các lỗi ứng dụng
 */
export class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Xử lý lỗi CastError của Mongoose (ID không hợp lệ)
 */
const handleCastErrorDB = (err) => {
  const message = `Không hợp lệ ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};

/**
 * Xử lý lỗi trùng lặp dữ liệu trong Mongoose
 */
const handleDuplicateFieldsDB = (err) => {
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
  const message = `Giá trị trùng lặp: ${value}. Vui lòng sử dụng giá trị khác!`;
  return new AppError(message, 400);
};

/**
 * Xử lý lỗi validation của Mongoose
 */
const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map(el => el.message);
  const message = `Dữ liệu đầu vào không hợp lệ. ${errors.join('. ')}`;
  return new AppError(message, 400);
};

/**
 * Xử lý lỗi JWT không hợp lệ
 */
const handleJWTError = () => 
  new AppError('Token không hợp lệ. Vui lòng đăng nhập lại!', 401);

/**
 * Xử lý lỗi JWT hết hạn
 */
const handleJWTExpiredError = () => 
  new AppError('Token đã hết hạn! Vui lòng đăng nhập lại.', 401);

/**
 * Gửi lỗi trong môi trường phát triển với thông tin chi tiết
 */
const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    success: false,
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack
  });
};

/**
 * Gửi lỗi trong môi trường sản xuất với thông tin hạn chế
 */
const sendErrorProd = (err, res) => {
  // Lỗi hoạt động, được tin cậy: gửi thông báo đến client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      success: false,
      status: err.status,
      message: err.message
    });
  } 
  // Lỗi lập trình hoặc lỗi không xác định: không rò rỉ chi tiết lỗi
  else {
    // Log lỗi
    console.error('LỖI 💥', err);

    // Gửi thông báo chung
    res.status(500).json({
      success: false,
      status: 'error',
      message: 'Đã xảy ra lỗi. Vui lòng thử lại sau!'
    });
  }
};

/**
 * Middleware xử lý lỗi chung
 */
export const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  // Xử lý khác nhau dựa trên môi trường
  if (process.env.ENV === 'development') {
    sendErrorDev(err, res);
  } else {
    let error = { ...err };
    error.message = err.message;
    
    // Xử lý các loại lỗi cụ thể
    if (err instanceof mongoose.Error.CastError) error = handleCastErrorDB(err);
    if (err.code === 11000) error = handleDuplicateFieldsDB(err);
    if (err instanceof mongoose.Error.ValidationError) error = handleValidationErrorDB(err);
    if (err.name === 'JsonWebTokenError') error = handleJWTError();
    if (err.name === 'TokenExpiredError') error = handleJWTExpiredError();

    sendErrorProd(error, res);
  }
};

/**
 * Middleware catch lỗi không đồng bộ
 */
export const catchAsync = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};

/**
 * Handler 404 - Không tìm thấy
 */
export const notFound = (req, res, next) => {
  next(new AppError(`Không thể tìm thấy ${req.originalUrl} trên máy chủ này!`, 404));
};