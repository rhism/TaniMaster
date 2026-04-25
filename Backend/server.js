const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const authRoutes = require('./routes/authRoutes');
const todoRoutes = require('./routes/todoRoutes');
const ringkasanKeuanganRoutes = require('./routes/ringkasanKeuanganRoutes');
const riwayatKeuanganRoutes = require('./routes/riwayatKeuanganRoutes');
const bahanBibitRoutes = require('./routes/bahanBibitRoutes');
const bahanBakuRoutes = require('./routes/bahanBakuRoutes');
const produksiRoutes = require('./routes/produksiRoutes');
const hasilPanenRoutes = require('./routes/hasilPanenRoutes');

const app = express();

app.use(cors({
  origin: ['https://tanimaster.vercel.app', 'http://localhost:5000'],
  methods: 'GET,POST,PUT,PATCH,DELETE',
  allowedHeaders: 'Content-Type,Authorization',
  credentials: true
}));
app.options('*', cors());
app.use(bodyParser.json());

app.use((req, _res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

app.use('/api/auth', authRoutes);
app.use('/api', todoRoutes);
app.use('/api', ringkasanKeuanganRoutes);
app.use('/api', riwayatKeuanganRoutes);
app.use('/api', bahanBibitRoutes);
app.use('/api', bahanBakuRoutes);
app.use('/api', produksiRoutes);
app.use('/api', hasilPanenRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
});