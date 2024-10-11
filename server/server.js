/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const helmet = require("helmet"); 
const app = express();
require("dotenv").config();

const PORT = process.env.PORT || 8070;

// Disable the X-Powered-By header
app.disable('x-powered-by');





// Middleware to restrict access to sensitive files
app.use((req, res, next) => {
  const sensitiveFiles = ['.env', '.git', '.gitignore', 'node_modules'];
  if (sensitiveFiles.some(file => req.url.includes(file))) {
    res.status(403).send('Access denied');
  } else {
    next();
  }
});

// Serve static files with additional security
app.use(express.static('public', {
  dotfiles: 'deny'
}));

// Middleware to sanitize responses and handle errors
app.use((req, res, next) => {
  const oldSend = res.send;
  res.send = function (data) {
    if (typeof data === 'string') {
      try {
        const jsonData = JSON.parse(data);
        if (jsonData.timestamp) {
          delete jsonData.timestamp;
        }
        arguments[0] = JSON.stringify(jsonData);
      } catch (e) {
        // Not JSON, do nothing
      }
    }
    oldSend.apply(res, arguments);
  };
  next();
});

// Use Helmet to set security headers
app.use(helmet());
app.disable('x-powered-by');
app.disable('x-forwarded-for');

// Middleware for removing sensitive headers
app.use((req, res, next) => {
  res.removeHeader('Date'); // Remove Date header
  res.removeHeader('Last-Modified'); // Remove Last-Modified header
  next();
});

// Define allowed origins for CORS
const allowedOrigins = ['http://localhost:3000'];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  }
}));


app.use(bodyParser.json());

// Middleware to block requests to the cloud metadata service
app.use((req, res, next) => {
  if (req.hostname === '169.254.169.254' || req.get('Host') === '169.254.169.254') {
    res.status(403).send('Access denied');
  } else {
    next();
  }
});


// Set X-Frame-Options header to DENY
app.use(helmet.frameguard({ action: 'deny' }));

// Set X-Content-Type-Options header to nosniff
app.use(helmet.noSniff());

// Configure Content Security Policy
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:"],
      frameAncestors: ["'none'"], // Prevent framing by any site
    },
  })
);

const URL = process.env.MONGODB_URL;

mongoose.connect(URL, {
  useNewUrlParser: true,
});

app.use("/user", require("./routes/userRoutes"));
app.use("/game", require("./routes/gameRoutes"));
app.use("/translate", require("./routes/translateRoutes.js"));
app.use("/bookmark", require("./routes/bookmarkRoutes.js"));

const connection = mongoose.connection;
connection.once("open", () => {
  console.log("Mongodb Connection success!");
});

app.listen(PORT, () => {
  console.log(`Server is up and running on port ${PORT}`);
});
