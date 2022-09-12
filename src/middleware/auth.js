let jwt = require("jsonwebtoken");
const blogModel = require("../models/blogModel");

// Authentication:->>>====================================================================>>>

const authentication = async function (req, res, next) {
  try {
    // check token :
    let token = req.headers["x-api-key"];
    if (!token) req.headers["x-api-key"];
    if (!token)
      return res.status(400).send({ status: false, msg: "Token Must be Filled" });
    
    // verify token :
    let decodedToken = jwt.verify(token, "project1");
    if (!decodedToken)
      return res.status(400).send({status: false,msg: "Token Not Verified Please Enter Valid Token"});

    req.token = decodedToken;

    next();
  } catch (err) {
    res.status(500).send({ status: false, msg: err.message });
  }
};

// Authorization:->>>=======================================================================>>>

 const authorization = async function (req, res, next) {
  try {
    let authorLoggedIn = req.token.authorId;
    let blogId = req.params.blogId;
    let checkBlogId = await blogModel.findById(blogId)
    if (!checkBlogId) {
      return res.status(404).send({status: false, message: "Blog not Found"})
  }
    if (checkBlogId.authorId != authorLoggedIn) {
      return res.status(403).send({status: false,msg: "loggedin author not allowed to modify changes"});
    }
    next();
  } catch (err) {
    return res.status(500).send({ status: false, msg: err.messge });
  }
};
//================================================================
const authoriseByQuery = async function (req, res, next) {
  try {
      let authorLoggedIn = req.token.authorId    //Accessing authorId from attribute

      let conditions = req.query
      //Checks if condition for deletion is coming or not
      if (Object.keys(conditions).length == 0) {
          return res.status(400).send({status: false,msg: "Provide information for deletion"})
      }
      if (conditions.authorId) {
          if (!conditions.authorId.match(/^[0-9a-f]{24}$/)) {
              return res.status(400).send({status: false,msg: "Not a valid ObjectId"})
          }

          if (conditions.authorId != authorLoggedIn) {
              return res.status(403).send({status: false,msg: 'Author not authorised'})
          }
      }
      let authorAccessing = await blogModel.find({ $and: [conditions, { isDeleted: false }] })
     
      if (authorAccessing.length == 0) {
          return res.status(404).send({status: false,msg: "No Blogs Found" })
      }

      let accessedBlog = authorAccessing.filter(blogs => blogs.authorId == authorLoggedIn)
      
      if (accessedBlog.length == 0) {
          return res.status(403).send({status: false,msg: "User Not Authorised"})
      }
      req.id = authorLoggedIn //attribute to store the author id from token
      next()
  }
  catch (err) {
      console.log("this error is from authorisation by query", err.message)
      res.status(500).send({ msg: err.message })
  }
}
//============================================================================================

module.exports.authentication = authentication;
module.exports.authorization = authorization;
module.exports.authoriseByQuery = authoriseByQuery;
