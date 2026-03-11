import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database("thevibe.db");

// Initialize database
db.exec(`
  CREATE TABLE IF NOT EXISTS posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    type TEXT CHECK(type IN ('music', 'poetry')),
    title TEXT NOT NULL,
    author TEXT,
    content TEXT NOT NULL,
    cover_url TEXT,
    is_draft INTEGER DEFAULT 0,
    is_vinyl INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

// Migration: Add cover_url if it doesn't exist
const tableInfo = db.prepare("PRAGMA table_info(posts)").all() as any[];
const hasCoverUrl = tableInfo.some(col => col.name === 'cover_url');
if (!hasCoverUrl) {
  db.exec("ALTER TABLE posts ADD COLUMN cover_url TEXT");
}

db.exec(`
  CREATE TABLE IF NOT EXISTS reflections (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    post_id INTEGER,
    user_name TEXT,
    content TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(post_id) REFERENCES posts(id)
  );

  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL DEFAULT 'password',
    bio TEXT,
    avatar_url TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS musings_likes (
    user_id INTEGER,
    post_id INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY(user_id, post_id),
    FOREIGN KEY(user_id) REFERENCES users(id),
    FOREIGN KEY(post_id) REFERENCES posts(id)
  );
`);

// Seed initial data if empty
const userCount = db.prepare("SELECT COUNT(*) as count FROM users").get() as { count: number };
if (userCount.count === 0) {
  db.prepare(`
    INSERT INTO users (username, email, bio, avatar_url)
    VALUES ('Mary Joy', 'mary@thevibe.com', 'Finding the melody in the silence and the poetry in the noise.', 'https://i.imgur.com/JzqRZ0E.png')
  `).run();
} else {
  // Update existing admin user's picture
  db.prepare("UPDATE users SET avatar_url = ? WHERE email = ?").run('https://i.imgur.com/JzqRZ0E.png', 'mary@thevibe.com');
}

const postCount = db.prepare("SELECT COUNT(*) as count FROM posts").get() as { count: number };
if (postCount.count === 0) {
  db.prepare(`
    INSERT INTO posts (type, title, author, content, cover_url, is_draft, is_vinyl)
    VALUES 
    ('music', 'The Life of a Showgirl', 'Mary Joy', '### The Eras of the Soul\n\n*The Life of a Showgirl* is a cinematic exploration of performance, identity, and the price of the spotlight. Taylor Swift has captured the exact frequency of our current collective fascination with legacy and the digital stage.\n\n#### The Architecture of the Performance\nThe album opens with "Curtain Call," a track that strips away the traditional percussion of pop in favor of atmospheric synths and a heartbeat-like pulse. Taylor''s delivery is hushed, almost conspiratorial, as she questions the nature of reality in an age of artificial intelligence and deepfakes. "Is the applause a sequence or a spark?" she asks, setting the stage for the next 74 minutes of introspection.\n\n#### A Recommendation for the Deep Listener\nIf you are looking for background music, this is not for you. This is an album that demands your full attention. We recommend listening on vinyl, through a pair of high-quality open-back headphones, in a room with the lights dimmed. Let the layers of live instrumentation wash over you.\n\n#### Why it Matters Now\nIn 2026, as we navigate the complexities of a hyper-connected yet deeply lonely world, *The Life of a Showgirl* serves as a lighthouse. It reminds us that despite the digital noise, there is still a core of human experience that cannot be replicated by an algorithm. It is, without a doubt, a definitive sound of the mid-20s.', 'https://i.imgur.com/NQ9quT9.jpg', 0, 1),
    ('music', 'Lana', 'Mary Joy', '### The Evolution of the SOS Era\n\nSZA''s *Lana* is a masterclass in vulnerability. Following the monumental success of *SOS*, many wondered where the St. Louis native could go next. The answer is inward—deeper than ever before. *Lana* blends psychedelic soul with raw, diary-like lyricism that feels almost too intimate to share.\n\n#### The Sound of Healing\nThe production on *Lana* is lush and expansive. Tracks like "Saturn" and "Joni" showcase a new level of vocal maturity, with SZA navigating complex melodies with ease. The album feels like a long, warm sunset—beautiful, slightly melancholic, and deeply restorative.\n\n#### Recommendation\nThis is the perfect companion for a long drive or a quiet night of reflection. It''s an album about the messy, non-linear process of healing and finding oneself. We recommend paying close attention to the lyrics; SZA has always been a poet, but on *Lana*, her words have a new weight and clarity.', 'https://i.imgur.com/0ERQM4x.jpg', 0, 0),
    ('music', 'Blue', 'Mary Joy', '### A Minimalist Masterpiece\n\nBillie Eilish and her brother Finneas have done it again. *Blue* is a haunting, minimalist journey into the depths of fame and vulnerability. It is an album that breathes, using silence as effectively as sound.\n\n#### The Power of Less\nIn an era of maximalist pop, *Blue* stands out by doing less. Many tracks feature nothing more than a soft piano or a distant, distorted guitar, allowing Billie''s whisper-quiet vocals to take center stage. The result is an experience that feels like someone is whispering their deepest secrets directly into your ear.\n\n#### Recommendation\nListen to this when you need to feel grounded. It''s a reminder that there is power in softness and strength in vulnerability. It''s a bold step forward for one of the most important artists of our generation.', 'https://i.imgur.com/t1MXdkJ.jpg', 0, 1),
    ('music', 'Water & Fire', 'Tyla', '### The Global Sound of Summer\n\nTyla''s *Water & Fire* is a celebration of movement and rhythm. Blending Amapiano with contemporary pop perfection, it is the global sound of the summer of 2026. It''s an album that is impossible to listen to without moving.\n\n#### A Fusion of Worlds\nThe album seamlessly integrates the deep house grooves of South Africa with the polished hooks of global pop. Tyla''s voice is effortless and charismatic, carrying the listener through a series of high-energy anthems and sultry mid-tempo tracks.\n\n#### Recommendation\nTurn this up loud at your next gathering. It''s an album designed to be shared, to be danced to, and to be enjoyed in the sun. It''s a testament to the power of music to transcend borders and bring people together.', 'https://picsum.photos/seed/waterfire/800/800', 0, 0),
    ('music', 'Actual Life 4', 'Fred again..', '### A Communal Diary of the Post-Digital Age\n\nFred again.. continues his *Actual Life* series with a fourth installment that is as emotional as it is energetic. Capturing the pulse of the dancefloor and the heart, it is a communal diary of our times.\n\n#### The Magic of the Sample\nFred''s genius lies in his ability to take snippets of everyday life—voice notes from friends, sounds from the street—and turn them into soaring electronic anthems. *Actual Life 4* feels like a celebration of human connection in an increasingly digital world.\n\n#### Recommendation\nThis is an album for the moments when you feel most alive. Whether you''re in the middle of a crowded club or walking through a quiet city at night, Fred''s music provides a sense of belonging and hope. It''s a beautiful, chaotic, and ultimately uplifting experience.', 'https://picsum.photos/seed/fredagain/800/800', 0, 0),
    ('music', 'Kind of Blue', 'Miles Davis', '### The Zenith of Modal Jazz\n\nMiles Davis''s *Kind of Blue* is widely regarded as the greatest jazz album of all time. Recorded in 1959, it marked a shift away from the complex chord progressions of bebop toward a more open, modal approach that allowed for greater improvisational freedom.\n\n#### A Masterclass in Atmosphere\nFrom the opening notes of "So What," the album establishes a mood that is both cool and deeply emotional. The interplay between Davis, John Coltrane, and Cannonball Adderley is legendary, creating a sound that is as fresh today as it was over sixty years ago.\n\n#### Recommendation\nThis is essential listening for anyone interested in music, regardless of genre. It''s the perfect late-night album—sophisticated, soulful, and timeless. We recommend listening to it in its entirety, allowing the modal shifts to transport you to another time and place.', 'https://picsum.photos/seed/miles/800/800', 0, 1),
    ('music', 'To Pimp a Butterfly', 'Kendrick Lamar', '### A Modern Epic\n\nKendrick Lamar''s *To Pimp a Butterfly* is more than just an album; it''s a cultural landmark. Released in 2015, it blends hip-hop, jazz, funk, and spoken word into a powerful exploration of race, identity, and the American experience.\n\n#### The Weight of the Word\nKendrick''s lyricism is at its peak here, navigating complex themes with a level of depth and nuance rarely seen in popular music. The album''s structure, built around a recurring poem, gives it a sense of cohesion and purpose that is truly epic.\n\n#### Recommendation\nThis is an album that requires multiple listens to fully grasp. It''s challenging, provocative, and ultimately rewarding. We recommend reading along with the lyrics to fully appreciate the intricate wordplay and social commentary.', 'https://picsum.photos/seed/kendrick/800/800', 0, 1),
    ('music', 'Rumours', 'Fleetwood Mac', '### The Sound of Heartbreak and Harmony\n\nFleetwood Mac''s *Rumours* is one of the best-selling albums of all time, and for good reason. Recorded amidst intense personal turmoil within the band, it is a raw and honest exploration of love, loss, and the complexities of human relationships.\n\n#### Perfect Pop Craftsmanship\nDespite the behind-the-scenes drama, the music on *Rumours* is incredibly polished and infectious. From the driving rhythm of "Go Your Own Way" to the ethereal beauty of "Dreams," every track is a masterclass in pop songwriting and production.\n\n#### Recommendation\nThis is the ultimate "breakup" album, but it''s also so much more. It''s a testament to the power of art to emerge from pain. We recommend listening to it on a sunny afternoon with the windows rolled down—it''s the perfect soundtrack for a journey, both literal and metaphorical.', 'https://picsum.photos/seed/rumours/800/800', 0, 1),
    ('poetry', 'The Waste Land', 'T.S. Eliot', '### A Landmark of Modernist Poetry\n\nT.S. Eliot''s *The Waste Land* is one of the most important poems of the 20th century. Published in 1922, it captures the disillusionment and fragmentation of the post-World War I era.\n\n#### A Tapestry of Allusions\nThe poem is famous for its dense web of literary and historical allusions, ranging from Dante and Shakespeare to Hindu philosophy. It is a challenging but deeply rewarding work that continues to resonate with readers today.\n\n#### Recommendation\nApproach this poem with patience and an open mind. Don''t worry about catching every allusion on the first read. Instead, let the imagery and rhythm wash over you. It''s a powerful meditation on the search for meaning in a broken world.', 'https://picsum.photos/seed/wasteland/800/800', 0, 0),
    ('poetry', 'Ariel', 'Sylvia Plath', '### The Raw Power of the Confessional\n\nSylvia Plath''s *Ariel* is a collection of poems that are as beautiful as they are brutal. Published posthumously in 1965, it is a landmark of confessional poetry, exploring themes of identity, motherhood, and mental health.\n\n#### The Voice of a Generation\nPlath''s voice in *Ariel* is unmistakable—sharp, vivid, and deeply personal. The poems are characterized by their intense emotional honesty and their innovative use of language and metaphor.\n\n#### Recommendation\nThis is a collection that demands to be read aloud. The rhythm and sound of the words are as important as their meaning. It''s a powerful and often unsettling experience, but one that is essential for anyone interested in the power of poetry.', 'https://picsum.photos/seed/ariel/800/800', 0, 0),
    ('poetry', 'Citizen: An American Lyric', 'Claudia Rankine', '### A Powerful Exploration of Race and Identity\n\nClaudia Rankine''s *Citizen* is a groundbreaking work that blends poetry, essay, and visual art. Published in 2014, it is a powerful exploration of the everyday realities of racism in America.\n\n#### The Lyric as Witness\nRankine uses the "lyric" form to witness and document the microaggressions and systemic injustices that shape the lives of Black Americans. The result is a work that is both deeply personal and profoundly political.\n\n#### Recommendation\nThis is an essential read for our times. It''s a work that challenges the reader to confront their own biases and to consider the impact of language and imagery on our understanding of race and identity.', 'https://picsum.photos/seed/citizen/800/800', 0, 0)
  `).run();

  const firstPost = db.prepare("SELECT id FROM posts LIMIT 1").get() as { id: number };
  db.prepare(`
    INSERT INTO reflections (post_id, user_name, content)
    VALUES (?, 'MARY JOY', 'Listening to The Life of a Showgirl in 2026 feels like reading a prophecy that already came true. Taylor has captured the exact frequency of our current collective fascination.')
  `).run(firstPost.id);
}

// Apply updates to existing records if they exist
db.prepare("UPDATE posts SET cover_url = ? WHERE title LIKE ? AND author LIKE ?").run('https://i.imgur.com/NQ9quT9.jpg', '%Life of a Showgirl%', '%Taylor%');
db.prepare("UPDATE posts SET cover_url = ? WHERE title LIKE ? AND author LIKE ?").run('https://i.imgur.com/t1MXdkJ.jpg', '%Blue%', '%Billie%');
db.prepare("UPDATE posts SET cover_url = ? WHERE title LIKE ? AND author LIKE ?").run('https://i.imgur.com/0ERQM4x.jpg', '%Lana%', '%SZA%');
db.prepare("UPDATE posts SET title = ?, author = ?, content = REPLACE(content, 'Gnosis', 'The Life of a Showgirl'), content = REPLACE(content, 'Kendrick Lamar', 'Taylor Swift'), content = REPLACE(content, 'Kendrick', 'Taylor') WHERE title = ? AND author = ?").run('The Life of a Showgirl', 'Taylor Swift', 'Gnosis', 'Kendrick Lamar');
db.prepare("UPDATE reflections SET content = REPLACE(content, 'Gnosis', 'The Life of a Showgirl'), content = REPLACE(content, 'Kendrick', 'Taylor') WHERE content LIKE '%Gnosis%'").run();

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ limit: '50mb', extended: true }));

  // API Routes
  app.get("/api/posts", (req, res) => {
    const posts = db.prepare("SELECT * FROM posts WHERE is_draft = 0 ORDER BY created_at DESC").all();
    res.json(posts);
  });

  app.get("/api/posts/all", (req, res) => {
    const posts = db.prepare("SELECT * FROM posts ORDER BY created_at DESC").all();
    res.json(posts);
  });

  app.get("/api/posts/:id", (req, res) => {
    const post = db.prepare("SELECT * FROM posts WHERE id = ?").get(req.params.id);
    const reflections = db.prepare("SELECT * FROM reflections WHERE post_id = ? ORDER BY created_at DESC").all(req.params.id);
    res.json({ ...post, reflections });
  });

  app.post("/api/posts", (req, res) => {
    try {
      const { type, title, author, content, cover_url, is_draft } = req.body;
      
      const createPost = db.transaction(() => {
        const info = db.prepare(`
          INSERT INTO posts (type, title, author, content, cover_url, is_draft)
          VALUES (?, ?, ?, ?, ?, ?)
        `).run(type, title, author, content, cover_url, is_draft ? 1 : 0);
        
        const lastId = info.lastInsertRowid;
        
        if (currentUser) {
          db.prepare("INSERT OR IGNORE INTO musings_likes (user_id, post_id) VALUES (?, ?)").run(currentUser.id, lastId);
        }
        
        return lastId;
      });

      const id = createPost();
      res.json({ id });
    } catch (error) {
      console.error("Error creating post:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.put("/api/posts/:id", (req, res) => {
    try {
      const { title, author, content, cover_url, is_draft, is_vinyl } = req.body;
      const id = req.params.id;
      
      db.prepare(`
        UPDATE posts 
        SET title = ?, author = ?, content = ?, cover_url = ?, is_draft = ?, is_vinyl = ?
        WHERE id = ?
      `).run(title, author, content, cover_url, is_draft ? 1 : 0, is_vinyl ? 1 : 0, id);
      
      res.json({ success: true });
    } catch (error) {
      console.error("Error updating post:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.delete("/api/posts/:id", (req, res) => {
    try {
      const id = req.params.id;
      const deleteTransaction = db.transaction((postId) => {
        db.prepare("DELETE FROM reflections WHERE post_id = ?").run(postId);
        db.prepare("DELETE FROM musings_likes WHERE post_id = ?").run(postId);
        const result = db.prepare("DELETE FROM posts WHERE id = ?").run(postId);
        return result.changes;
      });

      const changes = deleteTransaction(id);
      
      if (changes > 0) {
        res.json({ success: true });
      } else {
        res.status(404).json({ error: "Post not found" });
      }
    } catch (error) {
      console.error("Error deleting post:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/reflections", (req, res) => {
    const { post_id, user_name, content } = req.body;
    const info = db.prepare(`
      INSERT INTO reflections (post_id, user_name, content)
      VALUES (?, ?, ?)
    `).run(post_id, user_name, content);
    res.json({ id: info.lastInsertRowid });
  });

  app.get("/api/stats", (req, res) => {
    const musicCount = db.prepare("SELECT COUNT(*) as count FROM posts WHERE type = 'music'").get() as { count: number };
    const poetryCount = db.prepare("SELECT COUNT(*) as count FROM posts WHERE type = 'poetry'").get() as { count: number };
    res.json({ music: musicCount.count, poetry: poetryCount.count });
  });

  // Mock Session (In a real app, use express-session or JWT)
  let currentUser: any = null;

  app.get("/api/auth/me", (req, res) => {
    if (!currentUser) return res.status(401).json({ error: "Not authenticated" });
    const likedMusings = db.prepare("SELECT post_id FROM musings_likes WHERE user_id = ?").all(currentUser.id).map((row: any) => row.post_id);
    res.json({ user: currentUser, likedMusings });
  });

  app.post("/api/auth/signup", (req, res) => {
    try {
      const { email, password, username } = req.body;
      const info = db.prepare(`
        INSERT INTO users (username, email, password, bio, avatar_url)
        VALUES (?, ?, ?, ?, ?)
      `).run(username, email, password, 'A soul wandering through the archives.', `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`);
      
      const user = db.prepare("SELECT * FROM users WHERE id = ?").get(info.lastInsertRowid) as any;
      currentUser = user;
      res.json(user);
    } catch (error: any) {
      if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
        res.status(400).json({ message: "Email already in use" });
      } else {
        console.error("Signup error:", error);
        res.status(500).json({ message: "Internal server error" });
      }
    }
  });

  app.post("/api/auth/login", (req, res) => {
    const { email, password } = req.body;
    const user = db.prepare("SELECT * FROM users WHERE email = ?").get(email) as any;
    if (user && user.password === password) {
      currentUser = user;
      const likedMusings = db.prepare("SELECT post_id FROM musings_likes WHERE user_id = ?").all(user.id).map((row: any) => row.post_id);
      res.json({ user, likedMusings });
    } else {
      res.status(401).json({ error: "Invalid credentials" });
    }
  });

  app.post("/api/auth/logout", (req, res) => {
    currentUser = null;
    res.json({ success: true });
  });

  app.put("/api/user/settings", (req, res) => {
    if (!currentUser) return res.status(401).json({ error: "Not authenticated" });
    const { username, bio, avatar_url } = req.body;
    db.prepare("UPDATE users SET username = ?, bio = ?, avatar_url = ? WHERE id = ?")
      .run(username, bio, avatar_url, currentUser.id);
    currentUser = db.prepare("SELECT * FROM users WHERE id = ?").get(currentUser.id);
    res.json(currentUser);
  });

  app.post("/api/posts/:id/like", (req, res) => {
    if (!currentUser) return res.status(401).json({ error: "Not authenticated" });
    const postId = req.params.id;
    const existing = db.prepare("SELECT * FROM musings_likes WHERE user_id = ? AND post_id = ?").get(currentUser.id, postId);
    
    if (existing) {
      db.prepare("DELETE FROM musings_likes WHERE user_id = ? AND post_id = ?").run(currentUser.id, postId);
    } else {
      db.prepare("INSERT INTO musings_likes (user_id, post_id) VALUES (?, ?)").run(currentUser.id, postId);
    }
    
    const likedMusings = db.prepare("SELECT post_id FROM musings_likes WHERE user_id = ?").all(currentUser.id).map((row: any) => row.post_id);
    res.json({ likedMusings });
  });

  app.get("/api/user/liked-musings", (req, res) => {
    if (!currentUser) return res.status(401).json({ error: "Not authenticated" });
    const posts = db.prepare(`
      SELECT p.* FROM posts p
      JOIN musings_likes ml ON p.id = ml.post_id
      WHERE ml.user_id = ?
      ORDER BY ml.created_at DESC
    `).all(currentUser.id);
    res.json(posts);
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  const PORT = 3000;
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
