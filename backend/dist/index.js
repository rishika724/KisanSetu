"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const kisanSetu_routes_1 = __importDefault(require("./routes/kisanSetu.routes"));
const prisma_1 = require("./prisma");
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 4000;
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Request logger for API transparency
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});
// Health check endpoint
app.get('/health', (req, res) => {
    res.json({
        status: 'healthy',
        service: 'Kisan Setu API',
        timestamp: new Date().toISOString()
    });
});
// Mount Kisan Setu API routes
app.use('/api/kisan-setu', kisanSetu_routes_1.default);
// Global Error Handler
app.use((err, req, res, next) => {
    console.error('Unhandled Server Error:', err);
    res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});
// Start Server & Connect Database
async function bootstrap() {
    await (0, prisma_1.checkDatabaseConnection)();
    app.listen(PORT, () => {
        console.log(`🌾 Kisan Setu Backend Server running on http://localhost:${PORT}`);
        console.log(`📡 API Endpoints available at http://localhost:${PORT}/api/kisan-setu`);
    });
}
bootstrap();
exports.default = app;
