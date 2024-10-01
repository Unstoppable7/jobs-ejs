const express = require("express");
const router = express.Router();

const {
   showAll,
   create,
   showNewEntryForm,
   showOne,
   update,
   remove
} = require("../controllers/jobs");

// GET /jobs (display all the job listings belonging to this user)
// POST /jobs (Add a new job listing)
router.route("/").get(showAll).post(create);
// GET /jobs/new (Put up the form to create a new entry)
router.route("/new").get(showNewEntryForm);
// GET /jobs/edit/:id (Get a particular entry and show it in the edit box)
router.route("/edit/:id").get(showOne);
// POST /jobs/update/:id (Update a particular entry)
router.route("/update/:id").post(update);
// POST /jobs/delete/:id (Delete an entry)
router.route("/delete/:id").post(remove);

module.exports = router;