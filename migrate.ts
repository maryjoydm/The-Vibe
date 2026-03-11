import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, serverTimestamp, getDocs, query, where } from "firebase/firestore";
import Database from "better-sqlite3";

const firebaseConfig = {
  apiKey: "AIzaSyCjubb70hBlIM6KIbkqjVveoDFVruvDBOI",
  authDomain: "the-vibe-7d1af.firebaseapp.com",
  projectId: "the-vibe-7d1af",
  storageBucket: "the-vibe-7d1af.firebasestorage.app",
  messagingSenderId: "815845132971",
  appId: "1:815845132971:web:7752fc03f767c0f29a45ee"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const sqlite = new Database("thevibe.db");

async function migrate() {
  const posts = sqlite.prepare("SELECT * FROM posts").all();
  console.log(`Found ${posts.length} posts to migrate.`);

  for (const post of posts) {
    // Check if post already exists by title to avoid duplicates
    const q = query(collection(db, "posts"), where("title", "==", post.title));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      console.log(`Migrating: ${post.title}`);
      await addDoc(collection(db, "posts"), {
        type: post.type,
        title: post.title,
        author: post.author,
        content: post.content,
        cover_url: post.cover_url,
        is_draft: post.is_draft || 0,
        is_vinyl: post.is_vinyl || 0,
        created_at: serverTimestamp()
      });
    } else {
      console.log(`Skipping (already exists): ${post.title}`);
    }
  }

  // Also migrate reflections
  const reflections = sqlite.prepare("SELECT r.*, p.title as post_title FROM reflections r JOIN posts p ON r.post_id = p.id").all();
  console.log(`Found ${reflections.length} reflections to migrate.`);

  for (const ref of reflections) {
    // We need to find the new Firestore post ID for this reflection
    const q = query(collection(db, "posts"), where("title", "==", ref.post_title));
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      const postId = querySnapshot.docs[0].id;
      
      // Check if reflection exists
      const refQ = query(collection(db, "reflections"), 
        where("post_id", "==", postId), 
        where("content", "==", ref.content)
      );
      const refSnapshot = await getDocs(refQ);
      
      if (refSnapshot.empty) {
        console.log(`Migrating reflection for: ${ref.post_title}`);
        await addDoc(collection(db, "reflections"), {
          post_id: postId,
          user_name: ref.user_name,
          content: ref.content,
          created_at: serverTimestamp()
        });
      }
    }
  }

  console.log("Migration complete!");
  process.exit(0);
}

migrate().catch(err => {
  console.error(err);
  process.exit(1);
});
