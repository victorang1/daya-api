const db = require('../../services/db');

exports.getPostsByPlaceId = async (req, res) => {

    try {
        const rawQuery = `
            SELECT 
                p.description,
                p.username,
                p.created_at,
                COUNT(f.favorite_id) as totalLike,
                CASE WHEN EXISTS(SELECT * FROM favorite WHERE user_id = ? AND post_id = p.post_id)
                    THEN 1
                    ELSE 0
                END as isFavorite
                FROM post p
            LEFT JOIN favorite f ON p.post_id = f.post_id
            WHERE place_id = ?
            GROUP BY p.post_id, p.place_id, p.description, p.username, p.created_at
            ORDER BY created_at ASC
        `;
        const rows = await db.query(rawQuery, [req.body.userId, req.params.place_id]);
        res.status(200).send({
            status: 200,
            message: '',
            data: rows
        });
    } catch (ex) {
        res.status(500).send({
            status: 500,
            message: ex.message
        })
    }
}

exports.createPost = async (req, res) => {

    try {
        const rawQuery = 'INSERT INTO `post`(`post_id`, `place_id`, `description`, `username`, `user_id`) VALUES (?, ?, ?, ?, ?)';
        await db.query(rawQuery, [req.body.postId, req.body.placeId, req.body.description, req.body.username, req.body.user_id]);
        res.status(200).send({
            status: 200,
            message: 'Post success',
            data: null
        });
    } catch (ex) {
        res.status(500).send({
            status: 500,
            message: ex.message
        })
    }
}

exports.postLike = async (req, res) => {

    try {
        const queryCheckLikeStatus = 'SELECT * FROM `favorite` WHERE post_id = ? AND user_id = ?';
        const likeStatus = await db.query(queryCheckLikeStatus, [req.params.post_id, req.body.userId]);
        if (likeStatus.length !== 0) {
            likeQuery = 'DELETE FROM `favorite` WHERE post_id = ? AND user_id = ?';
            await db.query(likeQuery, [req.params.post_id, req.body.userId]);
            res.status(200).send({
                status: 200,
                message: 'Unlike success',
                data: null
            });
        }
        else {
            likeQuery = 'INSERT INTO `favorite`(`post_id`, `user_id`) VALUES (?, ?)';
            await db.query(likeQuery, [req.params.post_id, req.body.userId]);
            res.status(200).send({
                status: 200,
                message: 'Like success',
                data: null
            });
        }
        
    } catch (ex) {
        res.status(500).send({
            status: 500,
            message: ex
        })
    }
}