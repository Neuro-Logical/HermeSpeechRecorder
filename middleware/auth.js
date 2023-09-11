const jwt = require('jsonwebtoken')
require('dotenv').config();
const jwtSecret_DEV = require('../config/jwt.json')['jwtSecret']
const jwtSecret = process.env.JWT_SECRET || jwtSecret_DEV;

exports.adminAuth = (req, res, next) => {
    const token = req.cookies.jwt
    if (token) {
      jwt.verify(token, jwtSecret, (err, decodedToken) => {
        if (err) {
          return res.status(203).json({ message: "Not authorized" })
        } else {
          if (decodedToken.role !== "admin") {
            return res.status(203).json({ message: "Not authorized" })
          } else {
            next()
          }
        }
      })
    } else {
      return res
        .status(203)
        .json({ message: "Not authorized, token not available" })
    }
  }

  exports.userAuth = (req, res, next) => {
    const token = req.cookies.jwt
    if (token) {
      jwt.verify(token, jwtSecret, (err, decodedToken) => {
        if (err) {
          return res.status(203).json({ message: "Not authorized" })
        } else {
          if (decodedToken.role !== "user") {
            return res.status(203).json({ message: "Not authorized" })
          } else {
            next()
          }
        }
      })
    } else {
      return res
        .status(203)
        .json({ message: "Not authorized, token not available" })
    }
  }