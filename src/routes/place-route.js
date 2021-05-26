module.exports = (app) => {
    const placeController = require('../controllers/place-controller');

    app.get('/place/:place_id', placeController.getPlaceById)
}