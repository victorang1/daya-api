const db = require('../../services/db');

exports.getPlaceById = async (req, res) => {

    try {
        const rawQuery = 'SELECT * FROM `place` WHERE place_id = ?';
        const rows = await db.query(rawQuery, [req.params.place_id]);
        res.status(200).send({
            status: 200,
            message: '',
            data: rows.length !== 0 ? rows[0] : {}
        });
    } catch (ex) {
        res.status(500).send({
            status: 500,
            message: ex.message
        })
    }
}