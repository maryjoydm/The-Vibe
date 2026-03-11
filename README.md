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

<img width="1142" height="1013" alt="image" src="https://github.com/user-attachments/assets/5aa1f94e-8e7d-4d8f-a549-39f2b7783944" />

Draft & Vinyl System: Allows admins to save progress and highlight physical media with unique "Vinyl" visual cues.

<img width="1126" height="1066" alt="image" src="https://github.com/user-attachments/assets/6776a77f-bd1b-491d-93f4-2be749b75f45" />

Rich Media Integration: Uses high-quality cover images and Markdown for expressive, styled storytelling.

<img width="926" height="687" alt="image" src="https://github.com/user-attachments/assets/18b39f25-0f4e-4f87-a2da-b6a2a8212835" />

Admin Workspace: A comprehensive CMS featuring live Markdown previews, local autosave, and drag-and-drop image handling.

User Experience & Interaction

<img width="1903" height="1069" alt="image" src="https://github.com/user-attachments/assets/42fd8db6-bb8a-4f41-bcbf-91708f01d682" />

The Sanctuary (Library): A personal collection space where users save liked "musings" for future reading.

<img width="1916" height="1079" alt="image" src="https://github.com/user-attachments/assets/ba1f8267-c3a7-4ac0-a28c-bcfcf2a68d31" />

Reflections: A community discussion framework integrated into every post for reader comments.

<img width="1892" height="1066" alt="image" src="https://github.com/user-attachments/assets/e5be55db-0131-4411-9bdd-da83d84c1a38" />

Personalized Identity: Custom user profiles featuring unique bios and avatars.

Engagement Loops: Intelligent prompts that encourage guests to join the community during interaction.

Navigation & Specialized Views

<img width="1917" height="1065" alt="image" src="https://github.com/user-attachments/assets/588b424c-f9d9-4b86-881e-87aab902d779" />

Home & Explore: Curated feeds of "Chief Editor" reflections paired with a dedicated search and discovery interface.

<img width="1883" height="1020" alt="image" src="https://github.com/user-attachments/assets/98953c2d-273d-458d-a447-eaf71d1de93c" />

The Manifesto: A landing page designed to establish the blog’s specific aesthetic and philosophical tone.

<img width="1871" height="998" alt="image" src="https://github.com/user-attachments/assets/15bf2327-5650-4792-a79e-91f279eb0622" />


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
