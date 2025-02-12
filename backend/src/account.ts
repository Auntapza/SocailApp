import router from '../lib/router'
import prisma from '../lib/prisma';
import uploadImage from '../function/imageUpload';
import { verifytoken } from '../function/token';
import { JwtPayload } from 'jsonwebtoken';

// GET /account - Fetch user data
router.get("/account", async(req, res) => {
  try {

    const token = req.cookies['token']
    
    if (!token) {
        throw new Error("Can't find token")
    }

    const payload = verifytoken(token) as JwtPayload

    const user = await prisma.user.findUnique({
      where: {
        user_id: parseInt(payload.userId),
      },
    });

    if (!user) {
      res.status(404).json({ error: "User not found" });
    }

    res.json(user);
  } catch (err) {

    const error = err as Error

    res.status(400).json({ msg: error.message });
}})

// PUT /account/:id - Update user data
router.put("/account/:id", async (req, res) => {
  const { id } = req.params;
  const { fname, lname, profileImage } = req.body;

  try {

    if (!(fname || lname || id)) {
        throw new Error("Missing Data")
    }
    let payload:object = {}
    if (profileImage) {
      const imageData = uploadImage(profileImage)
      payload = {
        fname,
        lname,
        profile_img: imageData
      }
    } else {
      payload = {
        fname,
        lname
      }
    }
    await prisma.user.update({
      where: {
        user_id: parseInt(id),
      },
      data: payload
    });

    
    
    res.json({
      msg: "Update data successfuly"
    });
  } catch (err) {
    console.log(err);

    const error = err as Error

    res.status(400).json({ msg: error.message });
  }
});

export default router
