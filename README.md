# Video Streaming Backend API 

A comprehensive, production-ready RESTful API backend mimicking the core features of a video streaming platform (like YouTube). Built with a clean MVC architecture to handle user authentication, video uploads, interactions, and complex database relationships.

## Database Architecture (ER Diagram)
You can view the complete database schema and entity relationships for this project here:
👉 [**View Data Model on Eraser.io**](http://app.eraser.io/workspace/YtPqZ1VogxGy1jzIDkzj?origin=share)

## Tech Stack & Dependencies
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB & Mongoose (`mongoose-aggregate-paginate-v2`)
- **Authentication:** JSON Web Tokens (JWT) & bcrypt
- **File Handling:** Multer (Local) & Cloudinary (Cloud Storage)
- **Utilities:** Cookie Parser, CORS, dotenv

## Project Architecture
The project follows a standard MVC (Model-View-Controller) structure for clean separation of concerns:
- **`/models`**: Mongoose schemas (User, Video, Comment, Like, Tweet, Playlist, Subscription).
- **`/controllers`**: Business logic handling requests and returning API responses.
- **`/routes`**: Express routers directing endpoints to specific controllers.
- **`/middlewares`**: Custom middlewares for JWT verification (`verifyJWT`) and file uploading (`multer`).
- **`/utils`**: Standardized `ApiError`, `ApiResponse`, and `asyncHandler` classes for robust error handling.

## Core Features
- **Robust Authentication:** Secure JWT-based registration and login with Access & Refresh tokens stored in HTTP-only cookies.
- **Secure Password Handling:** Passwords encrypted via `bcrypt` using Mongoose pre-save hooks.
- **Media Uploads:** Seamless integration with Cloudinary for handling User Avatars, Cover Images, and Video files.
- **Engagement System:** Endpoints to support liking videos/comments, creating playlists, subscribing to channels, and user watch history.

## Local Setup & Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/PrakhrS/Backend.git
   cd Backend

2. **Install dependencies:**
   npm install

3. **Environment Configuration:**
   ```bash
    PORT=8000
    MONGODB_URI=your_mongodb_connection_string
    CORS_ORIGIN=*
    ACCESS_TOKEN_SECRET=your_access_token_secret
    ACCESS_TOKEN_EXPIRY=1d
    REFRESH_TOKEN_SECRET=your_refresh_token_secret
    REFRESH_TOKEN_EXPIRY=10d
    CLOUDINARY_CLOUD_NAME=your_cloud_name
    CLOUDINARY_API_KEY=your_api_key
    CLOUDINARY_API_SECRET=your_api_secret

5. **Run the Development Server:**
   ```bash
    npm run dev

**Key API Routes**
The API is versioned at /api/v1.

User Routes (/api/v1/users)

POST _/register_ - Register user (with avatar/cover upload)

POST _/login_ - Authenticate user

POST _/logout_ - Logout user (Secured)

POST _/refresh-token_ - Renew access token

PATCH _/update-account_ - Update user details (Secured)

GET _/c/:username_ - Get channel profile (Secured)

GET _/history_ - Get user watch history (Secured)

**Other Modules included:**

_/videos_ - Video CRUD operations

_/comments_ - Comment system

_/like_ - Like/Dislike logic

_/subscription_ - Channel subscriptions

_/playlist_ - Playlist management

_/dashboard_ - Channel statistics

**Note**: _This repository serves as the backend infrastructure and is designed to be tested via API clients like Postman or integrated with a frontend application._
