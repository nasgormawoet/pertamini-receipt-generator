const express = require('express');
const cors = require('cors');
const apiRoutes = require('./routes/apiRoutes');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Server Backend Pertamini API Berjalan dengan Baik! 🚀');
});

app.use('/api', apiRoutes);

app.listen(PORT, () => {
    console.log(`Backend server berjalan di http://localhost:${PORT}`);
});