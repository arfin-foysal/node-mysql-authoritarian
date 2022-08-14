const postRouter = require('express').Router();
const auth = require('../middlewares/authUser');

const { createPost, getAllPosts, getPost, updatePost, deletePost } = require('../controllers/postController');


postRouter.post('/', auth, createPost);
postRouter.get('/', getAllPosts);



module.exports=postRouter;