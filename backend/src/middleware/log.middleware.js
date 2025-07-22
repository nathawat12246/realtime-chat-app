export const logMiddleware = async(req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}, body: ${req.body}`);
    next();
}