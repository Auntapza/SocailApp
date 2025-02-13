import router from '../lib/router'
import prisma from '../lib/prisma'
import { verifytoken } from '../function/token'
import { JwtPayload } from 'jsonwebtoken'

router.post('/comment/:postid', async(req, res) => {

    const token = req.cookies['token']
    const { commentDetail } = req.body
    const { postid } = req.params

    try {

        if (!verifytoken(token)) {
            throw new Error("Can't find token")
        }
         
        const { userId } = verifytoken(token) as JwtPayload;

        await prisma.comment.create({
            data: {
                comment_detail: commentDetail,
                user_id: Number(userId),
                post_id: Number(postid)
            }
        })

        res.json({
            msg: "Comment post!"
        })

    } catch(err) {
        const error = err as Error
        res.status(400).json({
            msg: error.message
        })
    }

})

export default router