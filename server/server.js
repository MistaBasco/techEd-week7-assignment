import express from "express";
import cors from "cors";
import pg from "pg";
import dotenv from "dotenv";
import session from "express-session";
import bcrypt from "bcrypt";
const app = express();
app.use(express.json());

app.use(
  cors({
    origin: "https://teched-week7-assignment-client.onrender.com", // Your frontend URL
    credentials: true, // Allow credentials (cookies, sessions)
  })
);

dotenv.config();

const db = new pg.Pool({
  connectionString: process.env.DB_URL,
});

// Session configuration
app.use(
  session({
    secret: process.env.SESSION_SECRET || "your-secret-key", // Use a secret from .env
    resave: false, // Prevents resaving session if unmodified
    saveUninitialized: false, // Don't save uninitialized sessions
    cookie: { secure: false, httpOnly: true }, // Secure: true for HTTPS
  })
);

// create a GET endpoint (http://localhost:8080/)
app.get("/", function (request, response) {
  visitEndpoint("/");
  response.json("You are looking at my root route. How roude.");
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    // Check if the user exists
    const result = await db.query(
      "SELECT * FROM appusers WHERE username = $1",
      [username]
    );

    if (result.rows.length === 0) {
      return res.status(400).json({ error: "Invalid username or password" });
    }

    const user = result.rows[0];

    // Compare password with the hashed password in the database
    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) {
      return res.status(400).json({ error: "Invalid username or password" });
    }

    // Store the user info in the session
    req.session.userId = user.user_id;
    req.session.username = user.username;

    res.json({
      success: "Logged in successfully",
      user: { id: user.user_id, username: user.username },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Failed to login" });
  }
});

app.post("/signup", async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Check if username or email already exists
    const userCheck = await db.query(
      "SELECT * FROM appusers WHERE username = $1 OR email = $2",
      [username, email]
    );

    if (userCheck.rows.length > 0) {
      return res
        .status(400)
        .json({ error: "Username or email already exists" });
    }

    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Insert the new user into the database
    const result = await db.query(
      `INSERT INTO appusers (username, email, password_hash) VALUES ($1, $2, $3) RETURNING *`,
      [username, email, hashedPassword]
    );

    if (!result.rows || result.rows.length === 0) {
      throw new Error("User registration failed");
    }

    // Store the user session after signup
    req.session.userId = result.rows[0].user_id;
    req.session.username = result.rows[0].username;
    console.log("Inserted User:", result.rows[0]);

    res.status(201).json({
      success: "User registered successfully",
      user: {
        id: result.rows[0].user_id,
        username: result.rows[0].username,
      },
    });
  } catch (error) {
    console.error("Error during signup:", error);
    res.status(500).json({ error: "Failed to register user" });
  }
});

app.get("/session", (req, res) => {
  if (req.session.userId) {
    res.json({
      userId: req.session.userId,
      username: req.session.username,
    });
  } else {
    res.status(401).json({ error: "User not logged in" });
  }
});

app.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: "Failed to log out" });
    }
    res.clearCookie("connect.sid"); // Clear the session cookie
    res.status(200).json({ success: "Logged out successfully" });
  });
});

// GET /anime endpoint
app.get("/anime", async (req, res) => {
  try {
    visitEndpoint("/anime");
    const result = await db.query(`
      SELECT
        anime.anime_id,
        anime.title,
        anime.synopsis,
        anime.release_year,
        anime.cover_image,
        genres.genre_id,
        genres.name AS genre_name,
        array_agg(DISTINCT tags.tag_id) AS tag_ids,
        array_agg(DISTINCT tags.tag_name) AS tag_names,
        COALESCE(ROUND(AVG(reviews.rating), 1), 0) AS average_rating  -- Round to 1 decimal place
      FROM anime
      JOIN genres ON anime.genre_id = genres.genre_id
      LEFT JOIN anime_tags ON anime.anime_id = anime_tags.anime_id
      LEFT JOIN tags ON anime_tags.tag_id = tags.tag_id
      LEFT JOIN reviews ON anime.anime_id = reviews.anime_id
      GROUP BY anime.anime_id, genres.genre_id, genres.name
      ORDER BY anime.title;
    `);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch anime" });
  }
});

// GET anime/:id Endpoint
app.get("/anime/:id", async (req, res) => {
  try {
    visitEndpoint("/anime/:id");
    const { id } = req.params;
    //Fetch anime details
    const animeResult = await db.query(
      `
      SELECT 
        anime.*, 
        genres.name AS genre_name, 
        genres.genre_id,
        COALESCE(ROUND(AVG(reviews.rating), 1), 0) AS average_rating 
      FROM anime
      JOIN genres ON anime.genre_id = genres.genre_id
      LEFT JOIN reviews ON reviews.anime_id = anime.anime_id
      WHERE anime.anime_id = $1
      GROUP BY anime.anime_id, genres.name, genres.genre_id;
    `,
      [id]
    );

    if (animeResult.rows.length === 0) {
      return res.status(404).json({ error: "Anime not found" });
    }
    //object containing anime details
    const anime = animeResult.rows[0];

    // Fetch reviews for this anime
    const reviewsResult = await db.query(
      `
          SELECT reviews.review_id, reviews.rating, reviews.review_text, reviews.likes, reviews.created_at,
                 appusers.username AS reviewer_name, appusers.user_id
          FROM reviews
          LEFT JOIN appusers ON reviews.user_id = appusers.user_id
          WHERE reviews.anime_id = $1
          ORDER BY reviews.created_at DESC
        `,
      [id]
    );
    //object containing reviews for anime
    const reviews = reviewsResult.rows;

    // Fetch tags for this anime
    const tagsResult = await db.query(
      `
          SELECT tags.tag_id, tags.tag_name
          FROM tags
          JOIN anime_tags ON tags.tag_id = anime_tags.tag_id
          WHERE anime_tags.anime_id = $1
        `,
      [id]
    );

    const tags = tagsResult.rows; // Array of tags with tag_id and tag_name

    res.json({ anime, reviews, tags });
  } catch (error) {
    console.error("Error fetching Anime details:".error);
    res.status(500).json({ error: "Failed to fetch anime details, ID: " + id });
  }
});

app.get("/user/:id", async (req, res) => {
  const { id } = req.params;

  try {
    // Fetch user details
    const userResult = await db.query(
      `
      SELECT user_id, username, email, created_at
      FROM appusers
      WHERE user_id = $1
    `,
      [id]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    const user = userResult.rows[0];

    // Fetch reviews posted by the user
    const reviewsResult = await db.query(
      `
      SELECT reviews.review_id, reviews.rating, reviews.review_text, reviews.created_at, reviews.likes,
       anime.title AS anime_title, anime.anime_id, appusers.username AS reviewer_name
      FROM reviews
      JOIN anime ON reviews.anime_id = anime.anime_id
      JOIN appusers ON reviews.user_id = appusers.user_id
      WHERE reviews.user_id = $1
      ORDER BY reviews.created_at DESC`,
      [id]
    );

    const reviews = reviewsResult.rows;

    // Send user details and their reviews as a response
    res.json({ user, reviews });
  } catch (error) {
    console.error("Error fetching user details:", error);
    res.status(500).json({ error: "Failed to fetch user details" });
  }
});

// GET /reviews using this for sidebar as non "title" specific
app.get("/reviews", async (req, res) => {
  try {
    const result = await db.query(`
      SELECT reviews.review_id, reviews.rating, reviews.review_text, reviews.likes, reviews.created_at, reviews.anime_id, reviews.user_id,
             anime.title AS anime_title, appusers.username AS reviewer_name
      FROM reviews
      LEFT JOIN anime ON reviews.anime_id = anime.anime_id
      LEFT JOIN appusers ON reviews.user_id = appusers.user_id
      ORDER BY reviews.created_at DESC
    `);
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).json({ error: "Failed to fetch reviews" });
  }
});

// POST  reviews Endpoint
app.post("/reviews", async (req, res) => {
  try {
    visitEndpoint("/reviews");
    // Destructure the review data from the request body
    const { anime_id, user_id, rating, review_text } = req.body;

    // Validate that the required fields are provided
    if (!anime_id || !user_id || !rating) {
      return res
        .status(400)
        .json({ error: "anime_id, user_id, and rating are required" });
    }

    // Ensure the rating is within the correct range (1 to 10)
    if (rating < 1 || rating > 10) {
      return res.status(400).json({ error: "Rating must be between 1 and 10" });
    }

    // Insert the new review into the database
    const result = await db.query(
      `INSERT INTO reviews (anime_id, user_id, rating, review_text, likes)
   VALUES ($1, $2, $3, $4, 0) RETURNING *`,
      [anime_id, user_id, rating, review_text]
    );

    // Send the inserted review back in the response
    res.status(201).json(result.rows[0]);
  } catch (error) {
    // Handle any errors
    console.error("Error posting review:", error);
    res.status(500).json({ error: "Failed to post review" });
  }
});

// GET reviews/:animeId
app.get("/reviews/:animeId", async (req, res) => {
  try {
    visitEndpoint("/reviews/:animeId");
    const { animeId } = req.params;
    const result = await db.query("SELECT * FROM reviews WHERE anime_id = $1", [
      animeId,
    ]);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch review" });
  }
});

// DELETE reviews/reviewId
app.delete("/reviews/:reviewId", async (req, res) => {
  visitEndpoint("reviews/reviewId");
  const { reviewId } = req.params;
  const { current_user } = req.body;

  console.log(
    `Attempting to delete review: ${reviewId} by user: ${current_user}`
  );

  try {
    // Check if the review belongs to the user
    const result = await db.query(
      `SELECT * FROM reviews WHERE review_id = $1 AND user_id = $2`,
      [reviewId, current_user]
    );

    if (result.rows.length === 0) {
      return res
        .status(403)
        .json({ error: "You are not authorized to delete this review" });
    }

    // Delete the review
    await db.query(`DELETE FROM reviews WHERE review_id = $1`, [reviewId]);

    res.status(200).json({ success: "Review deleted successfully" });
  } catch (error) {
    console.error("Error deleting review:", error);
    res.status(500).json({ error: "Failed to delete review" });
  }
});

app.post("/reviews/:reviewId/like", async (req, res) => {
  const { reviewId } = req.params;
  const { current_user } = req.body;
  visitEndpoint("reviews/reviewId/like");

  try {
    // Check if the user has already liked this review
    const checkLike = await db.query(
      `SELECT * FROM likes WHERE user_id = $1 AND review_id = $2`,
      [current_user, reviewId]
    );

    if (checkLike.rows.length > 0) {
      await db.query(
        `DELETE FROM likes WHERE user_id = $1 AND review_id = $2`,
        [current_user, reviewId]
      );

      await db.query(
        `UPDATE reviews 
         SET likes = (SELECT COUNT(*) FROM likes WHERE review_id = $1)
         WHERE review_id = $1`,
        [reviewId]
      );
      return res.status(200).json({ success: "Review unliked successfully" });
    } else {
      // Insert into the likes table
      await db.query(`INSERT INTO likes (user_id, review_id) VALUES ($1, $2)`, [
        current_user,
        reviewId,
      ]);

      // Update the likes count in the reviews table based on the number of likes in the likes table
      await db.query(
        `UPDATE reviews 
       SET likes = (SELECT COUNT(*) FROM likes WHERE review_id = $1)
       WHERE review_id = $1`,
        [reviewId]
      );

      res.status(200).json({ success: "Review liked successfully" });
    }
  } catch (error) {
    console.error("Error liking/unliking review:", error);
    res.status(500).json({ error: "Failed to like/unlike review" });
  }
});

app.get("/reviews/:reviewId/liked", async (req, res) => {
  const { reviewId } = req.params;
  const current_user = req.query.current_user;

  try {
    const result = await db.query(
      `SELECT * FROM likes WHERE user_id = $1 AND review_id = $2`,
      [current_user, reviewId]
    );

    if (result.rows.length > 0) {
      res.status(200).json({ liked: true });
    } else {
      res.status(200).json({ liked: false });
    }
  } catch (error) {
    console.error("Error checking like status:", error);
    res.status(500).json({ error: "Failed to check like status" });
  }
});

//TODO: GET Endpoints for genre... post/delete should be admin only... surely?

// starting our express server on port 8080
app.listen(8080, function () {
  console.log("App is running on Star Wars Port");
});

function visitEndpoint(endpoint) {
  console.log("Endpoint " + endpoint + " visited");
}
