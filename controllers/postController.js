const Post = require("../models/postModel");
const User = require("../models/userModel");

const createPost = async (req, res) => {

    const { title, des } = req.body;
    const userId = req.user.id;
    const post = {
        title,
        des,
        userId,
    };
   await Post.create(post)
        .then((post) => {
        res.status(201).json({
            message: "Post added successfully",
            post,
        });
        }).catch((error) => {
        res.status(400).json({
            message: "Error adding post",
            error,
        });
        }
        );
};

const getAllPosts = async (req, res) => {
    await Post.findAll({
        include: [{
            model: User,
            attributes: ["id", "name", "email"],
        }],
    }).then((posts) => {
        res.status(200).json({
            message: "All posts",
            posts,
        });
    }).catch((error) => {
        res.status(400).json({
            message: "Error getting all posts",
            error,
        });
    }
    );
};



    
module.exports = {
    createPost,
    getAllPosts,

};