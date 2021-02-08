import {Router} from 'express';
const router = Router();

router.get('/', (req, res) => {
    res.json({
        tasks: {
            id: 1,
            task: 'Realizar el exámen'
        }
    })
})

// router.

export default router;