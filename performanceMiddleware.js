// performanceMiddleware.js
const monitorPerformance = (req, res, next) => {
  const start = Date.now();

  res.on("finish", () => {
    const duration = Date.now() - start;
    PerformanceModel.create({
      endpoint: req.path,
      method: req.method,
      duration,
      timestamp: new Date(),
    });
  });

  next();
};
