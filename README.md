<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/6eb0e568-8c6d-4fbf-a1ad-f8947b6e97ef

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

   Core Content & Management
The Archives: Supports specialized multimedia formats for music reviews and poetic narratives.

Draft & Vinyl System: Allows admins to save progress and highlight physical media with unique "Vinyl" visual cues.

Rich Media Integration: Uses high-quality cover images and Markdown for expressive, styled storytelling.

Admin Workspace: A comprehensive CMS featuring live Markdown previews, local autosave, and drag-and-drop image handling.

User Experience & Interaction
The Sanctuary (Library): A personal collection space where users save liked "musings" for future reading.

Reflections: A community discussion framework integrated into every post for reader comments.

Personalized Identity: Custom user profiles featuring unique bios and avatars.

Engagement Loops: Intelligent prompts that encourage guests to join the community during interaction.

Navigation & Specialized Views
Home & Explore: Curated feeds of "Chief Editor" reflections paired with a dedicated search and discovery interface.

The Manifesto: A landing page designed to establish the blog’s specific aesthetic and philosophical tone.

Admin Console: A private interface for full-scale archive management (Create, Update, Delete).

Technical Architecture
Modern Frontend: Built with React and Vite, utilizing Framer Motion for cinematic UI transitions.

Hybrid Data Layer: Combines Firebase (Auth/Storage) with SQLite for high-performance content delivery.

Aesthetic Design: A custom "Cream & Deep-Red" theme utilizing glassmorphism and modern typography.

AI Integration: Leverages Gemini-3-Flash for automated poetry critique and sophisticated editorial assistance.

Cinematic UX & Resilience
Micro-interactions: Context-aware animations, such as pulse effects that differ between music and poetry posts.

Orchestrated Transitions: Uses AnimatePresence to ensure seamless movement between different site sections.

Connection Resilience: Built-in monitoring to sync administrative actions once the user returns online.
