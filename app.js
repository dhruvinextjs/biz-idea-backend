// const express = require('express');
// const cors = require('cors');
// const cookieParser = require('cookie-parser');
// const session = require('express-session');
// const methodOverride = require('method-override');
// const path = require('path');
// require('dotenv').config();
// require("./utils/captchaCleanup");
// const globalSearchRoutes = require("./routes/globalSearchRoutes");
// const flash = require('connect-flash');
// const parseFormBooleans = require('./middleware/parseForm');

// const app = express();

// // ─── View Engine ─────────────────────────────────
// app.set('view engine', 'ejs');
// app.set('views', path.join(__dirname, 'views'));

// // ─── Core Middleware ─────────────────────────────
// const allowedOrigins = [
//   'http://localhost:3000',
//   'http://localhost:5007',
//   'https://biz-idea-backend.onrender.com',
//   'https://biz-ideas-rouge.vercel.app'
// ];

// app.use(cors({
//   origin: function (origin, callback) {

//     console.log("REQUEST ORIGIN =>", origin);

//     // Allow requests with no origin
//     if (!origin) {
//       return callback(null, true);
//     }

//     if (allowedOrigins.includes(origin)) {
//       return callback(null, true);
//     }

//     return callback(new Error("Not allowed by CORS"));
//   },
//   credentials: true
// }));



// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use(cookieParser());
// app.use(methodOverride('_method'));
// app.use(express.static(path.join(__dirname, 'public')));
// app.use(parseFormBooleans);
// app.use("/uploads", express.static(path.join(__dirname, "/uploads")));

// // ─── Session — FLASH SE PEHLE HONA ZAROORI HAI ──
// app.use(session({
//   secret: process.env.SESSION_SECRET,
//   resave: false,
//   saveUninitialized: false,
//   cookie: { maxAge: 8 * 60 * 60 * 1000, httpOnly: true },
// }));

// // Flash — session ke baad
// app.use(flash());

// // ✅ Sirf success/error inject karo — messages object NAHI
// // Ye har render me available rahega
// app.use((req, res, next) => {
//   res.locals.success = req.flash('success');
//   res.locals.error = req.flash('error');
//   next();
// });


// // ─── Public API Routes ───────────────────────────
// const authRoutes = require('./routes/auth');
// const ideaRoutes = require('./routes/ideas');
// const { csRouter, postRouter, blogRouter, miscRouter } = require('./routes/other');
// const contactRoutes = require('./routes/contact');
// const aboutRoutes = require('./routes/about');
// const Notificationroutes = require("./routes/Notificationroutes");

// app.use('/api/auth', authRoutes);
// app.use('/api/ideas', ideaRoutes);
// app.use('/api/case-studies', csRouter);
// app.use('/api/posts', postRouter);
// app.use('/api/blogs', blogRouter);
// app.use('/api', miscRouter);
// app.use('/api', contactRoutes);
// app.use('/api/privacy-policy', require('./routes/privacyPolicy'));
// app.use('/api/terms-condition', require('./routes/termsCondition'));
// app.use('/api/about', aboutRoutes);
// app.use("/api/bookmarks", require("./routes/bookmarkRoutes"));
// app.use("/api/comments", require("./routes/commentRoutes"));
// app.use("/api/global-search", globalSearchRoutes);
// app.use("/api", Notificationroutes);

// // ─── Admin API Routes (JWT based) ────────────────
// const adminApiRoutes = require('./routes/admin/adminApi');
// app.use('/api/admin', adminApiRoutes);

// // ─── Admin Panel Routes (EJS session based) ──────
// const adminPanelRoutes = require('./routes/admin/admin');
// app.use('/admin', adminPanelRoutes);
// app.use("/admin/skills", require("./routes/admin/adminSkillRoutes"));
// app.use("/admin/stages", require("./routes/admin/adminStageRoutes"));

// // ─── Root ────────────────────────────────────────
// app.get('/', (req, res) => res.redirect('/admin/dashboard'));
// app.get('/health', (req, res) => res.json({ status: 'OK', timestamp: new Date() }));

// // ─── Error Handler ───────────────────────────────
// const { errorHandler } = require('./middleware/auth');
// app.use(errorHandler);

// // ─── 404 ─────────────────────────────────────────
// app.use((req, res) => {
//   if (req.path.startsWith('/api')) return res.status(404).json({ success: false, message: 'API endpoint not found.' });
//   res.status(404).send('<h2>404 - Page Not Found</h2><a href="/admin">Go to Admin</a>');
// });

// module.exports = app;


const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const methodOverride = require('method-override');
const path = require('path');
require('dotenv').config();
require("./utils/captchaCleanup");
const globalSearchRoutes = require("./routes/globalSearchRoutes");
const flash = require('connect-flash');
const parseFormBooleans = require('./middleware/parseForm');

const app = express();

// ─── View Engine ─────────────────────────────────
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// ─── Core Middleware ─────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(parseFormBooleans);
app.use("/uploads", express.static(path.join(__dirname, "/uploads")));

// ─── Session ─────────────────────────────────────
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 8 * 60 * 60 * 1000, httpOnly: true },
}));

// ─── Flash (session ke baad) ─────────────────────
app.use(flash());
app.use((req, res, next) => {
  res.locals.success = req.flash('success');
  res.locals.error   = req.flash('error');
  next();
});

// ─── CORS — sirf /api routes ke liye ─────────────
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5007',
  'https://biz-idea-backend.onrender.com',
  'https://biz-ideas-rouge.vercel.app',
];

const corsOptions = {
  origin: function (origin, callback) {
    // No origin = same-origin / server-to-server — allow karo
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
};

// ✅ CORS sirf /api pe — admin panel routes pe nahi
app.use('/api', cors(corsOptions));

// ─── Public API Routes ───────────────────────────
const authRoutes       = require('./routes/auth');
const ideaRoutes       = require('./routes/ideas');
const { csRouter, postRouter, blogRouter, miscRouter } = require('./routes/other');
const contactRoutes    = require('./routes/contact');
const aboutRoutes      = require('./routes/about');
const Notificationroutes = require("./routes/Notificationroutes");

app.use('/api/auth',           authRoutes);
app.use('/api/ideas',          ideaRoutes);
app.use('/api/case-studies',   csRouter);
app.use('/api/posts',          postRouter);
app.use('/api/blogs',          blogRouter);
app.use('/api',                miscRouter);
app.use('/api',                contactRoutes);
app.use('/api/privacy-policy', require('./routes/privacyPolicy'));
app.use('/api/terms-condition',require('./routes/termsCondition'));
app.use('/api/about',          aboutRoutes);
app.use('/api/bookmarks',      require('./routes/bookmarkRoutes'));
app.use('/api/comments',       require('./routes/commentRoutes'));
app.use('/api/global-search',  globalSearchRoutes);
app.use('/api',                Notificationroutes);

// ─── Admin API Routes (JWT based) ────────────────
const adminApiRoutes = require('./routes/admin/adminApi');
app.use('/api/admin', adminApiRoutes);

// ─── Admin Panel Routes (EJS session — NO CORS needed) ──
const adminPanelRoutes = require('./routes/admin/admin');
app.use('/admin', adminPanelRoutes);
app.use('/admin/skills', require('./routes/admin/adminSkillRoutes'));
app.use('/admin/stages', require('./routes/admin/adminStageRoutes'));

// ─── Root ────────────────────────────────────────
app.get('/', (req, res) => res.redirect('/admin/dashboard'));
app.get('/health', (req, res) => res.json({ status: 'OK', timestamp: new Date() }));

// ─── Error Handler ───────────────────────────────
const { errorHandler } = require('./middleware/auth');
app.use(errorHandler);

// ─── 404 ─────────────────────────────────────────
app.use((req, res) => {
  if (req.path.startsWith('/api'))
    return res.status(404).json({ success: false, message: 'API endpoint not found.' });
  res.status(404).send('<h2>404 - Page Not Found</h2><a href="/admin">Go to Admin</a>');
});

module.exports = app;