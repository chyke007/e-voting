var express = require('express');
var voteRouter = require('./routes');

var app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/vote', voteRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  res.json({message: "Route not found"});
});

// error handler
app.use(function(err, req, res, next) {
  
    // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  });

const port = process.env.PORT || 4000;
app.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log("Server running on port", `${port}`);
});
  
