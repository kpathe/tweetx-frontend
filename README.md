# 🐦 TweetX — Modern Social Media Web App

TweetX is a feature-rich, high-fidelity social networking platform inspired by Twitter/X. It delivers a fast, responsive user interface combined with a robust backend to connect people and facilitate discussions in real-time.

> [!NOTE]
> This README acts as the main user guide for the client portion of TweetX. For backend implementation details, check the `backend` folder structure.

---

## 🎨 Design & Visuals

Here is a preview of the TweetX interface in action:

| Desktop Light Mode | Desktop Dark Mode |
| --- | --- |
| ![Desktop Light Mode Placeholder](./public/screenshots/desktop-light.png) | ![Desktop Dark Mode Placeholder](./public/screenshots/desktop-dark.png) |

| Mobile Feed | Notifications & Profile |
| --- | --- |
| ![Mobile Feed Placeholder](./public/screenshots/mobile-feed.png) | ![Notifications & Profile Placeholder](./public/screenshots/mobile-profile.png) |

*(Note: Once the screenshots are attached, they will appear in the grid above.)*

---

## ✨ Features

TweetX is loaded with core and premium social features:

- 🔒 **Secure Authentication**: Complete signup and login flows supported by password hashing via `Bcrypt` and JSON Web Token (JWT) session cookies.
- 🎨 **Unified Theme Modes**: Modern, pixel-perfect Light and Dark theme configurations that instantly switch system colors via CSS Custom Variables.
- 📝 **Rich Post Creation**: Write updates and attach images. Media uploads are handled securely and hosted on the cloud via `Cloudinary`.
- 💬 **Timeline & Social Interactions**:
  - **Dynamic Feed**: Toggle between **"For you"** (global activity feed) and **"Following"** (curated posts from people you follow).
  - **Likes & Comments**: Like tweets and reply to posts.
- 🔗 **Follower Network**:
  - Discover other users on the **Connect/Follow** page.
  - Follow/unfollow users dynamically to shape your home feed.
- 🔍 **Interactive Search**: Real-time user and post discovery.
- 🔔 **Notifications Center**: Instant alerts for social interactions—receive notifications when someone likes your post, follows you, or replies to your tweet.
- 👤 **Custom Profiles**: Show off your personalized feed, display name, biography, followers count, avatar, and background banner.

---

## 🛠️ Technology Stack

### Frontend
- **Framework**: React 19 (Vite-powered for rapid development and HMR)
- **State Management**: Redux Toolkit & React Redux
- **Routing**: React Router DOM v7 (with protected auth gates)
- **Styling**: Tailwind CSS v4 & custom HSL variables
- **Form Handling**: React Hook Form
- **Icons**: Lucide React

### Backend
- **Runtime**: Node.js & Express
- **Database**: MongoDB with Mongoose ODM
- **Media Hosting**: Cloudinary & Multer
- **Email Delivery**: NodeMailer
- **Authentication**: JWT & Cookie-Parser

---

## 🚀 Getting Started

To get the TweetX client running locally, follow these steps:

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed on your machine.

### Installation & Local Run

1. **Navigate to the frontend folder**:
   ```bash
   cd frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env` file in the root of the `frontend` folder using `.env.example` as a template:
   ```env
   VITE_API_URL=http://localhost:3000/api/v1
   ```

4. **Launch the Dev Server**:
   ```bash
   npm run dev
   ```
   The application will run locally at `http://localhost:5173` (or the port specified by Vite).

---

## 🐳 Docker Deployment

A `Dockerfile` and `docker-compose.yml` are provided in the `frontend` folder. To run the frontend in a containerized environment:

```bash
docker compose up --build
```
