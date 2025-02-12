import { createToken, verifytoken } from "../function/token";
import prisma from "../lib/prisma";
import router from "../lib/router";

router.post('/login', async (req, res) => {

    try {

        const { username, password } = req.body

        if (!username || !password) {
            throw new Error("Missing Data")
        }

        const oldData = await prisma.user.findFirst({
            where: {
                username: username as string,
            }
        })

        if (!oldData) {
            throw new Error("Can't find user data")
        }
        if (oldData?.password !== password) {
            throw new Error("Password incorrect")
        }


        const token = createToken(oldData.user_id)
        res.cookie('token', token, {
            httpOnly: true,
            secure: true,
            sameSite: 'none'
        }).json({
            msg: "Login successfuly"
        });

    } catch (err) {
        const error = err as Error
        res.status(400).json({
            msg: error.message
        })
    }

})

router.post('/register', async (req, res) => {
    try {

        const { username, password, fname, lname } = req.body;

        if (!(username || password || fname || lname)) {
            throw new Error("Missing Data")
        }

        await prisma.user.create({
            data: {
                username,
                password,
                fname,
                lname
            }
        })

        res.json({
            msg: "Register successfuly"
        })

    } catch (err) {
        const error = err as Error
        res.status(400).json({
            msg: error.message
        })
    }
})

router.get('/verify', async (req, res) => {

    try {
        const token = req.cookies['token']

        if (!token) {
            throw new Error("Can't find token")
        }

        const payload = verifytoken(token)

        if (payload == false) {
            throw new Error("Token not verify")
        }

        res.json({
            token,
            payload
        })

    } catch (err) {
        const error = err as Error
        res.status(400).json({
            msg: error.message
        })
    }

})

router.get('/logout', async (req, res) => {
    try {
        res.clearCookie('token', {
                httpOnly: true,
                secure: true,
                sameSite: 'none'
            }).status(200).json({
            success: true,
            message: 'Logged out successfully'
        });
    } catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({
            success: false,
            message: 'Error during logout'
        });
    }
});



export default router