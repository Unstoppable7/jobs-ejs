const parseValidationErrors = (e, req) => {
   const keys = Object.keys(e.errors);
   keys.forEach((key) => {
     req.flash("errors", e.errors[key].properties.message);
   });
 };
 
 module.exports = parseValidationErrors;