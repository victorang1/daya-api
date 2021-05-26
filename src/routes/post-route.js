module.exports = (app) => {
    const postController = require('../controllers/post-controller');

    app.post('/place/:place_id/posts', postController.getPostsByPlaceId)
    app.post('/place/:place_id/post', postController.createPost);

    app.post('/post/:post_id/favorite', postController.postLike);
}