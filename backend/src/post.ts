import router from '../lib/router'
import prisma from '../lib/prisma'
import uploadImage from '../function/imageUpload';
import { verifytoken } from '../function/token';
import { JwtPayload } from 'jsonwebtoken';

// POST /post - Create a new post
router.post("/post", async (req, res) => {
  const { postDes, postImg } = req.body;

  const token = req.cookies['token'];

  try {

    let data = {
      post_detail: postDes,
      user_id: 1,
      post_image: ''
    }

    if (token && verifytoken(token) != false) {
      const { userId } = verifytoken(token) as JwtPayload
      data = {
        ...data,
        user_id: Number(userId)
      }
    } else {
      throw new Error("Token not verify")
    }

    if (postImg) {
      const imageUrl = uploadImage(postImg)
      data = {
        ...data,
        post_image: imageUrl
      }
    }

    await prisma.post.create({
      data
    });

    res.status(201).json({
      msg: "Create post successfuly"
    });
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /post - Get all posts
router.get("/post", async (req, res) => {
  try {
    const posts = await prisma.post.findMany({
      include: {
        User: true, // Include related user data
        Commnet: true
      },
      orderBy: {
        post_id: 'desc'
      }
    });

    const format = posts.map(e => ({
      id: e.post_id,
      user: {
        name: `${e.User.fname} ${e.User.lname}`,
        avatar: e.User.profile_img
      },
      content: e.post_detail,
      image: e.post_image,
      comments: e.Commnet.reduce((sum, data) => {
        return sum + (data.comment_id)
      }, 0)
    }))

    res.json(format);
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
router.get("/post/:postId", async (req, res) => {
  try {

    const { postId } = req.params

    const posts = await prisma.post.findUnique({
      where: {
        post_id: Number(postId)
      },
      include: {
        User: true, // Include related user data
        Commnet: true
      }
    });

    const format = {
      id: posts?.post_id,
      user: {
        name: `${posts?.User.fname} ${posts?.User.lname}`,
        avatar: posts?.User.profile_img
      },
      content: posts?.post_detail,
      image: posts?.post_image,
      comments: posts?.Commnet.reduce((sum, data) => {
        return sum + (data.comment_id)
      }, 0)
    }

    res.json(format);
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get('/ownPost', async (req, res) => {
  try {

    if (!verifytoken(req.cookies['token'])) {
      throw new Error("Can't find token")
    }

    const { userId } = verifytoken(req.cookies['token']) as JwtPayload;

    const posts = await prisma.post.findMany({
      where: {
        user_id: userId
      },
      include: {
        User: true, // Include related user data
        Commnet: true
      },
      orderBy: {
        post_id: 'desc'
      }
    });

    const format = posts.map(e => ({
      id: e.post_id,
      user: {
        name: `${e.User.fname} ${e.User.lname}`,
        avatar: e.User.profile_img
      },
      content: e.post_detail,
      image: e.post_image,
      comments: e.Commnet.reduce((sum, data) => {
        return sum + (data.comment_id)
      }, 0)
    }))

    res.json(format);
  } catch (error:any) {
    console.error("Error fetching posts:", error);
    res.status(400).json({ error: error.message });
  }
})

// PUT /post/:postId - Update a post by ID
router.put("/post/:postId", async (req, res) => {
  const { postId } = req.params;
  const { postDes, postImg } = req.body;

  try {

    if (postImg) {

      const imageData = uploadImage(postImg);

      await prisma.post.update({
        where: {
          post_id: parseInt(postId),
        },
        data: {
          post_detail: postDes,
          post_image: imageData
        },
      });
    } else {
      await prisma.post.update({
        where: {
          post_id: parseInt(postId),
        },
        data: {
          post_detail: postDes
        },
      });

    }

    res.json({
      msg: "update post successfuly"
    });
  } catch (error) {
    console.error("Error updating post:", error);

    res.status(400).json({ error: "Internal server error" });
  }
});

router.delete('/post/:postId', async(req, res) => {

  const { postId } = req.params;

  try {
    await prisma.post.delete({
      where: {
        post_id: Number(postId)
      }
    })

    res.json({
      msg: "delete post successfuly"
    })
  } catch(err:any) {
    res.status(500).json({
      msg: "Internal server error",
      error: err.message
    })
  }
})

export default router