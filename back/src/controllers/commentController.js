const { client } = require('../database'); // Importing the 'client' property from database.js
const path = require('path');
exports.submitComment = async (req, res) => {
    const { storyId, content, parentCommentId } = req.body;
    const author = req.session.username;

    if (!storyId || !content) {
        return res.status(400).json({ error: 'Story ID and comment content are required' });
    }

    try {
        const query = parentCommentId
            ? 'INSERT INTO comments (story_id, author, content, parent_comment_id) VALUES ($1, $2, $3, $4)'
            : 'INSERT INTO comments (story_id, author, content) VALUES ($1, $2, $3)';

        const params = parentCommentId ? [storyId, author, content, parentCommentId] : [storyId, author, content];

        await client.query(query, params);

        res.status(201).json({ success: 'Comment submitted successfully' });
    } catch (error) {
        console.error('Error submitting comment:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.loadComments = async (req, res) => {
    const storyId = req.query.storyId;

    if (!storyId) {
        return res.status(400).json({ error: 'Story ID is required' });
    }

    try {
        const query = `
            WITH RECURSIVE comment_tree AS (
                SELECT comment_id, author, content, parent_comment_id
                FROM comments
                WHERE story_id = $1 AND parent_comment_id IS NULL
                UNION ALL
                SELECT c.comment_id, c.author, c.content, c.parent_comment_id
                FROM comments c
                JOIN comment_tree ct ON c.parent_comment_id = ct.comment_id
            )
            SELECT comment_id, author, content, parent_comment_id FROM comment_tree
        `;

        const result = await client.query(query, [storyId]);
        const rows = result.rows;

        res.status(200).json({ comments: rows });
    } catch (error) {
        console.error('Error fetching comments:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};


exports.deleteComment = (req, res) => {
    const commentId = req.params.commentId;
    const username = req.session.username;

    client.query('SELECT * FROM comments WHERE comment_id = $1 AND author = $2', [commentId, username], (err, results) => {
        if (err) {
            console.error('Error checking comment:', err);
            return res.status(500).json({ error: 'Internal server error' });
        }

        if (results.rows.length === 0 && username !== 'Karaï') {
            return res.status(403).json({ error: 'You are not authorized to delete this comment' });
        }

        client.query('DELETE FROM comments WHERE comment_id = $1', [commentId], (err, result) => {
            if (err) {
                console.error('Error deleting comment:', err);
                return res.status(500).json({ error: 'Internal server error' });
            }

            res.status(200).json({ success: 'Comment deleted successfully' });
        });
    });
};
