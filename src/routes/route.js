const express = require("express");
const router = express.Router();
const authorController = require("../controllers/authorController");
const blogController = require("../controllers/blogController");

//==============================>>>Phase-1<<<==================================================

//______________________________post api (author)___________________________________________>>>

router.post("/author", authorController.createAuthor);

//______________________________post api (blog)_____________________________________________>>>

router.post("/blog", blogController.createBlog);

//______________________________get api (blog document)______________________________________>>>

// router.get("/getBlogs", authorController.getBlogs);
router.get('/getBlogs', blogController.getBlogs);
router.get('/updateBlog', authorController.updateBlog);

//______________________________update api __________________________________________________>>>





//=============================================================================================


module.exports = router;
