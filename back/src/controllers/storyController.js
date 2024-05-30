const { client } = require('../database'); // Importing the 'client' property from database.js
const path = require('path');

exports.submitStory = async (req, res) => {
    const { content } = req.body;
    const author = req.session.username;
    if (!content) {
        return res.status(400).json({ error: 'Story content is required' });
    }

    try {
        const query = 'INSERT INTO stories (author, content) VALUES ($1, $2)';
        const params = [author, content];

        await client.query(query, params);

        res.status(201).json({ success: 'Story submitted successfully' });
    } catch (error) {
        console.error('Error submitting story:', error);
        res.status(500).json({ error: 'Internal server error' });
    }

}


exports.loadStories = async (req, res) => {
    const page = req.query.page || 1; // Get the page number from the query parameters, default to 1 if not provided
    const storiesPerPage = 10; // Number of stories per page

    try {
        // Calculate the offset based on the page number
        const offset = (page - 1) * storiesPerPage;

        // Construct the SQL query with pagination
        const query = `
            SELECT story_id, author, content 
            FROM stories 
            ORDER BY story_id DESC
            LIMIT $1 OFFSET $2
        `;

        // Execute the query with parameters
        const result = await client.query(query, [storiesPerPage, offset]);
        const rows = result.rows;

        // fetch the number of stories
        const countQuery = 'SELECT COUNT(*) FROM stories';
        const countResult = await client.query(countQuery);
        const totalStories = countResult.rows[0];
        res.status(200).json({ stories: rows, totalStories: totalStories });
    } catch (error) {
        console.error('Error fetching stories:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};


exports.deleteStory = (req, res) => {
    const storyId = req.params.storyId;
    const username = req.session.username;

    const query = 'DELETE FROM stories WHERE story_id = $1 AND author = $2 RETURNING *';

    client.query(query, [storyId, username], (err, results) => {
        if (err) {
            console.error('Error deleting story:', err);
            return res.status(500).json({ error: 'Internal server error' });
        }

        if (results.rows.length === 0 && username !== 'Karaï') {
            return res.status(403).json({ error: 'You are not authorized to delete this story' });
        }

        res.status(200).json({ success: 'Story deleted' });
    });
};
