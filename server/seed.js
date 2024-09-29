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
      DROP TABLE IF EXISTS likes;
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

    await db.query(`
      CREATE TABLE likes (
        like_id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES appusers(user_id),
        review_id INTEGER REFERENCES reviews(review_id),
        UNIQUE (user_id, review_id)  -- Ensure that each user can only like a review once
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

    // Insert seed data into Users table (10 users)
    await db.query(`
      INSERT INTO appusers (username, email, password_hash) VALUES
      ('animefan01', 'animefan01@example.com', 'hashedpassword1'),
      ('otaku42', 'otaku42@example.com', 'hashedpassword2'),
      ('weebmaster', 'weebmaster@example.com', 'hashedpassword3'),
      ('shinobi_killer', 'shinobikiller@example.com', 'hashedpassword4'),
      ('samuraijack', 'samuraijack@example.com', 'hashedpassword5'),
      ('chihiro2020', 'chihiro2020@example.com', 'hashedpassword6'),
      ('gokublack', 'gokublack@example.com', 'hashedpassword7'),
      ('astro_boy', 'astroboy@example.com', 'hashedpassword8'),
      ('akira_fan', 'akira_fan@example.com', 'hashedpassword9'),
      ('otaku_no_sensei', 'otaku_no_sensei@example.com', 'hashedpassword10');
    `);

    // Insert seed data into Anime table (20 anime)
    await db.query(`
      INSERT INTO anime (title, synopsis, release_year, genre_id, cover_image) VALUES
      ('Attack on Titan', 'Humanity fights for survival against titans.', 2013, 1, 'https://example.com/aot.jpg'),
      ('Your Name', 'A romantic story across time and space.', 2016, 2, 'https://example.com/yourname.jpg'),
      ('Naruto', 'A young ninja striving for recognition.', 2002, 1, 'https://example.com/naruto.jpg'),
      ('One Piece', 'The quest for the ultimate treasure, One Piece.', 1999, 1, 'https://example.com/onepiece.jpg'),
      ('Spirited Away', 'A young girl must navigate a mystical world.', 2001, 3, 'https://example.com/spiritedaway.jpg'),
      ('Cowboy Bebop', 'Bounty hunters in a futuristic world.', 1998, 4, 'https://example.com/cowboybebop.jpg'),
      ('My Hero Academia', 'Students train to become heroes.', 2016, 1, 'https://example.com/myheroacademia.jpg'),
      ('Death Note', 'A student discovers a notebook with deadly powers.', 2006, 4, 'https://example.com/deathnote.jpg'),
      ('Dragon Ball Z', 'Goku and his friends defend Earth from powerful foes.', 1989, 1, 'https://example.com/dragonballz.jpg'),
      ('Akira', 'A post-apocalyptic world dominated by chaos.', 1988, 3, 'https://example.com/akira.jpg'),
      ('Neon Genesis Evangelion', 'Teenagers pilot mechas to save humanity.', 1995, 4, 'https://example.com/evangelion.jpg'),
      ('Fruits Basket', 'A girl lives with members of the Chinese Zodiac.', 2001, 2, 'https://example.com/fruitsbasket.jpg'),
      ('Demon Slayer', 'A boy fights demons to save his sister.', 2019, 1, 'https://example.com/demonslayer.jpg'),
      ('Steins;Gate', 'A group of friends discover time travel.', 2011, 4, 'https://example.com/steinsgate.jpg'),
      ('Sword Art Online', 'Players trapped in a virtual MMORPG must fight to survive.', 2012, 3, 'https://example.com/sao.jpg'),
      ('Tokyo Ghoul', 'A student becomes a half-ghoul and must adapt to his new life.', 2014, 3, 'https://example.com/tokyoghoul.jpg'),
      ('Mob Psycho 100', 'A young psychic battles supernatural forces.', 2016, 4, 'https://example.com/mobpsycho100.jpg'),
      ('One Punch Man', 'A hero defeats his enemies with a single punch.', 2015, 5, 'https://example.com/onepunchman.jpg'),
      ('Fullmetal Alchemist', 'Two brothers seek the Philosopher''s Stone.', 2003, 3, 'https://example.com/fullmetalalchemist.jpg'),
      ('Samurai Champloo', 'Samurai in an alternative Edo-era Japan.', 2004, 1, 'https://example.com/samuraichamploo.jpg');
    `);

    // Insert seed data into Tags table
    await db.query(`
      INSERT INTO tags (tag_name) VALUES
      ('Action'), ('Romance'), ('Fantasy'), ('Mecha'), ('Psychological'), ('Shounen'), ('Adventure'), ('Supernatural');
    `);

    // Insert seed data into Anime_Tags table (link anime to tags)
    await db.query(`
      INSERT INTO anime_tags (anime_id, tag_id) VALUES
      (1, 1), (1, 6), (2, 2), (2, 7), (3, 1), (3, 6), (4, 1), (4, 7), (5, 3), 
      (6, 4), (7, 1), (7, 6), (8, 5), (9, 1), (9, 6), (10, 3), (11, 4), (11, 5), 
      (12, 2), (13, 1), (14, 4), (15, 3), (16, 8), (17, 1), (17, 7), (18, 3), (19, 1), (19, 7), (20, 1);
    `);

    // Insert seed data into Reviews table (50 reviews, mixing short and long)
    await db.query(`INSERT INTO reviews (anime_id, user_id, rating, review_text, likes) VALUES
    (1, 1, 9, 'Amazing plot and action scenes! It keeps you on the edge of your seat.', 0),
    (1, 2, 8, 'Great anime, though it can be a bit too intense at times.', 0),
    (2, 3, 10, 'A masterpiece. One of the best anime movies ever made.', 0),
    (3, 4, 7, 'I enjoyed the growth of the characters but felt the story dragged in places.', 0),
    (4, 5, 9, 'One Piece has an epic scale and unforgettable characters.', 0),
    (5, 6, 10, 'Visually stunning and deeply emotional.', 0),
    (6, 7, 9, 'A philosophical journey wrapped in an action-packed narrative.', 0),
    (7, 8, 8, 'A bit too predictable, but overall a fun series to watch.', 0),
    (8, 9, 10, 'A thrilling psychological battle between good and evil.', 0),
    (9, 10, 8, 'Classic anime with timeless battles and characters.', 0),
    -- Long reviews with escaped characters
    (10, 1, 9, 'Akira is a tour de force. The animation is phenomenal, especially for its time. The dystopian future it paints is haunting and thought-provoking. The storyline, while complex, is gripping from start to finish. Tetsuo''s character arc is deeply disturbing yet fascinating, and the climax leaves you questioning the very nature of power and control.', 0),
    (11, 2, 10, 'Neon Genesis Evangelion changed my perception of anime. It''s not just an action-packed mecha show; it delves into the psychological aspects of its characters, exploring depression, anxiety, and existentialism. The series finale was unexpected and left me pondering for days.', 0),
    (12, 3, 9, 'Fruits Basket is a beautiful blend of heartwarming moments and emotional depth. Every character has a backstory that tugs at your heartstrings, and the supernatural elements enhance the story without overpowering the human drama.', 0),
    (13, 4, 10, 'Demon Slayer is visually breathtaking. The animation during the fight scenes is some of the best I''ve seen, and the character development is top-notch. Tanjiro''s journey is one of perseverance, and you root for him every step of the way.', 0),
    (14, 5, 7, 'Steins;Gate takes its time to build, but once it gets going, it''s an emotional rollercoaster. The concept of time travel is handled intelligently, and the stakes are raised in every episode.', 0);
  `);

    // Insert seed data into Likes table (example likes data)
    await db.query(`
      INSERT INTO likes (user_id, review_id) VALUES
      (1, 1),  -- User 1 liked Review 1
      (2, 2),  -- User 2 liked Review 2
      (3, 3),  -- User 3 liked Review 3
      (4, 4),  -- User 4 liked Review 4
      (5, 5),  -- User 5 liked Review 5
      (1, 6);  -- User 1 liked Review 6
    `);

    // Update the likes count in the reviews table based on the number of likes in the likes table
    await db.query(`
          UPDATE reviews 
          SET likes = (SELECT COUNT(*) FROM likes WHERE review_id = reviews.review_id);
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
