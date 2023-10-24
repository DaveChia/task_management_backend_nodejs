//  Group the validation error messages by the request body keys
//  Example of output:
// {
//     "name": [
//         "This field is required.",
//         "This field must be between 10 and 255 characters inclusive."
//     ],
//     "description": [
//         "This field is required.",
//         "This field must be at least 10 chacacters inclusive."
//     ],
//     "completed": [
//         "This field must be at a boolean character."
//     ]
// }
exports.formatValidationErrors = (validationErrors) => {
  let output = {};

  validationErrors.forEach((error) => {
    if (error.path in output) {
      output[error.path].push(error.msg);
    } else {
      output[error.path] = [error.msg];
    }
  });

  return output;
};
