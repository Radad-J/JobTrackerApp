/*const errorHandler = (err, req, res, next) => {
    const statusCode = res.statusCode ? res.statusCode : 500;
    res.status(statusCode);
    res.json({
        message: err.message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
};*/
const errorHandler = (err) => {
  console.log(err.message);

  let errors = [];

  // Duplicate key error (e.g., unique constraint)
  if (err.code === 11000) {
    errors.push({ path: "email", message: "This email is already registered" });
    return errors;
  }

  // Validation errors (e.g., incorrect email or password)
  if (err.message === "incorrect email") {
    errors.push({ path: "email", message: "That email is not registered" });
  }
  if (err.message === "incorrect password") {
    errors.push({ path: "password", message: "That password is incorrect" });
  }

  // Schema validation errors
  if (err.message.includes("validation failed")) {
    Object.values(err.errors).forEach(({ properties }) => {
      errors.push({ path: properties.path, message: properties.message });
    });
  }

  return errors;
};

module.exports = { errorHandler };
