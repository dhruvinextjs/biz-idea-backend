const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const flash = require('connect-flash');
const methodOverride = require('method-override');
const path = require('path');
require('dotenv').config();

const parseFormBooleans = require('./middleware/parseForm');
const app = express();

// ─── View Engine ─────────────────────────────────
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// ─── Core Middleware ─────────────────────────────
app.use(cors({ origin: process.env.FRONTEND_URL || '*', credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(parseFormBooleans);

// ─── Session (admin panel only) ──────────────────
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 8 * 60 * 60 * 1000, httpOnly: true }, // 8 hours
}));
app.use(flash());

// ─── Public API Routes ───────────────────────────
const authRoutes = require('./routes/auth');
const ideaRoutes = require('./routes/ideas');
const { csRouter, postRouter, blogRouter, miscRouter } = require('./routes/other');
const contactRoutes = require('./routes/contact');

app.use('/api/auth', authRoutes);
app.use('/api/ideas', ideaRoutes);
app.use('/api/case-studies', csRouter);
app.use('/api/posts', postRouter);
app.use('/api/blogs', blogRouter);
app.use('/api', miscRouter);
app.use('/api', contactRoutes);

// ─── Admin API Routes (JWT based) ────────────────
const adminApiRoutes = require('./routes/admin/adminApi');
app.use('/api/admin', adminApiRoutes);


// ─── Admin Panel Routes (EJS session based) ──────
const adminPanelRoutes = require('./routes/admin/admin');
app.use('/admin', adminPanelRoutes);
app.use("/admin/skills",require("./routes/admin/adminSkillRoutes"));
app.use("/admin/stages",require("./routes/admin/adminStageRoutes"));

// ─── Root ────────────────────────────────────────
app.get('/', (req, res) => res.redirect('/admin/dashboard'));
app.get('/health', (req, res) => res.json({ status: 'OK', timestamp: new Date() }));

// ─── Error Handler ───────────────────────────────
const { errorHandler } = require('./middleware/auth');
app.use(errorHandler);

// ─── 404 ─────────────────────────────────────────
app.use((req, res) => {
  if (req.path.startsWith('/api')) return res.status(404).json({ success: false, message: 'API endpoint not found.' });
  res.status(404).send('<h2>404 - Page Not Found</h2><a href="/admin">Go to Admin</a>');
});

module.exports = app;
