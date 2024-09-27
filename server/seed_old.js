import dotenv from "dotenv";
import pg from "pg";

dotenv.config();

const db = new pg.Pool({
  connectionString: process.env.DB_URL,
});

const seedDatabase = async () => {
  try {
    // Drop tables in the correct order to prevent foreign key conflicts
    await db.query(`
      DROP TABLE IF EXISTS reviews;
      DROP TABLE IF EXISTS anime_tags;
      DROP TABLE IF EXISTS tags;
      DROP TABLE IF EXISTS anime;
      DROP TABLE IF EXISTS genres;
      DROP TABLE IF EXISTS appusers;
    `);

    // Create Users table
    await db.query(`
      CREATE TABLE appusers (
        user_id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
        username VARCHAR(50) NOT NULL UNIQUE,
        email VARCHAR(100) NOT NULL UNIQUE,
        password_hash VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create Genres table
    await db.query(`
      CREATE TABLE genres (
        genre_id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
        name VARCHAR(50) NOT NULL UNIQUE
      );
    `);

    // Create Anime table
    await db.query(`
      CREATE TABLE anime (
        anime_id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
        title VARCHAR(255) NOT NULL,
        synopsis TEXT,
        release_year INTEGER,
        genre_id INTEGER REFERENCES genres(genre_id),
        cover_image VARCHAR(255)
      );
    `);

    // Create Tags table
    await db.query(`
      CREATE TABLE tags (
        tag_id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
        tag_name VARCHAR(50) NOT NULL UNIQUE
      );
    `);

    // Create Anime_Tags table (many-to-many relationship between anime and tags)
    await db.query(`
      CREATE TABLE anime_tags (
        anime_id INTEGER REFERENCES anime(anime_id),
        tag_id INTEGER REFERENCES tags(tag_id),
        PRIMARY KEY (anime_id, tag_id)
      );
    `);

    // Create Reviews table with the added "likes" column
    await db.query(`
      CREATE TABLE reviews (
        review_id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
        anime_id INTEGER REFERENCES anime(anime_id),
        user_id INTEGER REFERENCES appusers(user_id),
        rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 10),
        review_text TEXT,
        likes INTEGER DEFAULT 0, -- Added the likes column
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Insert seed data into Genres table
    await db.query(`
      INSERT INTO genres (name) VALUES
      ('Action'),
      ('Romance'),
      ('Fantasy'),
      ('Sci-Fi'),
      ('Comedy');
    `);

    // Insert seed data into Users table
    await db.query(`
      INSERT INTO appusers (username, email, password_hash) VALUES
      ('animefan01', 'animefan01@example.com', 'hashedpassword1'),
      ('otaku42', 'otaku42@example.com', 'hashedpassword2');
    `);

    // Insert seed data into Anime table
    await db.query(`
      INSERT INTO anime (title, synopsis, release_year, genre_id, cover_image) VALUES
      ('Attack on Titan', 'Humanity fights for survival against titans.', 2013, 1, 'https://example.com/aot.jpg'),
      ('Your Name', 'A romantic story across time and space.', 2016, 2, 'https://example.com/yourname.jpg');
    `);

    // Insert seed data into Tags table
    await db.query(`
      INSERT INTO tags (tag_name) VALUES
      ('Post-Apocalyptic'),
      ('Mecha'),
      ('Survival'),
      ('Time Travel'),
      ('Fantasy'),
      ('School');
    `);

    // Insert seed data into Anime_Tags table (link anime to tags)
    await db.query(`
      INSERT INTO anime_tags (anime_id, tag_id) VALUES
      (1, 1), -- Attack on Titan is Post-Apocalyptic
      (1, 2), -- Attack on Titan is Mecha
      (1, 3), -- Attack on Titan is Survival
      (2, 4), -- Your Name involves Time Travel
      (2, 5), -- Your Name is Fantasy
      (2, 6); -- Your Name has School elements
    `);

    // Insert seed data into Reviews table with likes
    await db.query(`
      INSERT INTO reviews (anime_id, user_id, rating, review_text, likes) VALUES
      (1, 1, 9, 'Amazing plot and visuals!', 5),
      (2, 2, 8, 'Beautiful animation and heartfelt story.', 10);
    `);

    // Create Indexes for performance optimization
    await db.query(`
      CREATE INDEX idx_reviews_anime_id ON reviews (anime_id);
    `);

    await db.query(`
      CREATE INDEX idx_reviews_user_id ON reviews (user_id);
    `);

    await db.query(`
      CREATE INDEX idx_anime_genre_id ON anime (genre_id);
    `);

    await db.query(`
      CREATE INDEX idx_anime_tags_tag_id ON anime_tags (tag_id);
    `);

    console.log("Database seeded and indexed successfully!");
  } catch (error) {
    console.error("Error seeding database", error);
  } finally {
    db.end();
  }
};

seedDatabase();
