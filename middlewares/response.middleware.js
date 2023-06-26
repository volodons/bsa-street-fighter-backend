const responseMiddleware = (req, res, next) => {
  console.log("req.data: ", req.data);
  console.log("req.err: ", req.err);
  // TODO: Implement middleware that returns result of the query
  if (req.data) {
    res.json(req.data);
  } else if (req.err) {
    res.status(req.err.status || 400);
    res.json({
      error: true,
      message: req.err.message,
    });
  } else {
    res.status(500);
    res.end();
  }
  next();
};

export { responseMiddleware };
