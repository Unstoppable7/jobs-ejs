const Job = require("../models/Job");
const indexUrl = "/jobs";
const parseVErr = require("../utils/parseValidationErr");

const showAll = async (req, res) => {
   const jobs = await Job.find({createdBy: req.user._id});
   res.render("jobs", { jobs });
};
const create = async (req, res) => {
   req.body.createdBy = req.user._id;

   try {
      await Job.create(req.body);
   } catch (e) {
      if (e.constructor.name === "ValidationError") {
         parseVErr(e, req);
      } else {
         return next(e);
      }
      return res.render("job", { errors: req.flash("errors"), job: null });
   }
   req.flash("info", "The job has been created successfully");
   res.redirect(indexUrl);
};
const showNewEntryForm = (req, res) => {
   res.render("job", { job: null });
};
const showOne = async (req, res) => {
   const job = await Job.findOne({createdBy: req.user._id, _id: req.params.id});
   if (!job) {
      req.flash("errors", "The job was not found");
      res.redirect(indexUrl);
   }
   res.render("job", { job: job });
};

const update = async (req, res) => {
   try {
      await Job.findOneAndUpdate({createdBy: req.user._id, _id: req.params.id}, req.body, {
         runValidators: true,
      });
   } catch (e) {
      if (e.constructor.name === "ValidationError") {
         parseVErr(e, req);
      } else {
         return next(e);
      }
      return res.render("job", { errors: req.flash("errors"), job: req.body });
   }
   req.flash("info", "The job has been updated successfully");
   res.redirect(indexUrl);
};
const remove = async (req, res) => {
   await Job.findByIdAndDelete(req.params.id);
   req.flash("info", "The job has been deleted successfully");
   res.redirect(indexUrl);
};

module.exports = {
   showAll,
   create,
   showNewEntryForm,
   showOne,
   update,
   remove,
};
