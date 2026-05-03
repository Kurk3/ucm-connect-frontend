# UCM Connect Frontend

**Live:** [ucm-connect.sk](https://ucm-connect.sk) &nbsp;|&nbsp; **API:** [api.ucm-connect.sk](https://api.ucm-connect.sk)

Vue 3 SPA for **UCM Connect** — a student community platform built as a bachelor's thesis project at the University of SS. Cyril and Methodius in Trnava (UCM).

Students can browse and upload study materials organized by subject, comment on posts, like content, and manage their profile. The frontend communicates exclusively with the [UCM Connect API](https://github.com/Kurk3/ucm-connect-api).

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Vue 3 (Composition API) |
| Language | TypeScript |
| Build Tool | Vite |
| State Management | Pinia |
| Routing | Vue Router 4 |
| HTTP Client | Axios |
| UI Library | PrimeVue 4 (Aura theme) |
| Styling | Tailwind CSS 3 |
| Animations | GSAP, Motion-V |
| i18n | vue-i18n (Slovak locale) |
| Analytics | Vercel Analytics |
| Testing | Vitest + Vue Test Utils |

---

## Architecture Overview

```
Vue 3 SPA
  │
  ├── Vue Router         route guards: requiresAuth, requiresAdmin, guestOnly
  ├── Pinia (auth store) JWT token + user state persisted in localStorage
  ├── ApiService         Axios wrapper — injects Bearer token on every request,
  │                      handles 401 → redirect to /login automatically
  └── API modules        one file per resource (auth, posts, comments, …)
        │
        ▼
  UCM Connect API  (Spring Boot — JWT validated by AWS Cognito)
```

Auth flow: after login the JWT received from the backend is stored in `localStorage` and attached to every Axios request via a request interceptor. On 401 the interceptor clears auth state and redirects to `/login`.

---

## Pages & Views

| Route | View | Auth |
|-------|------|------|
| `/` | `HomeView` — paginated post feed with subject filter | required |
| `/subjects` | `CategoryView` — browse all subjects | required |
| `/posts/:id` | `PostDetailView` — post with file download + comments + likes | required |
| `/my-posts` | `MyPostsView` — current user's posts | required |
| `/users/me` | `userProfileView` — profile edit | required |
| `/admin` | `AdminView` — manage users, posts, comments, subjects | admin only |
| `/landing` | `LandingPageView` — public marketing page | public |
| `/login` | `LoginView` | guest only |
| `/register` | `RegisterView` | guest only |
| `/email-confirmation` | `EmailConfirmationView` — enter Cognito OTP | guest only |
| `/reset-password` | `ResetPasswordView` — enter OTP + new password | guest only |
| `/discord/linked` | `DiscordLinkedView` — after OAuth2 callback | required |
| `/discord/error` | `DiscordErrorView` | required |
| `/:catchAll` | `404View` | — |

---

## Project Structure

```
src/
│
├── main.ts                         # App entry — registers Vue, Pinia, Router,
│                                   # PrimeVue (custom Indigo preset), Vercel Analytics
├── App.vue                         # Root component — layout wrapper with router-view
│
├── router/
│   └── index.ts                    # All routes + beforeEach guard (auth, admin, guestOnly)
│                                   # scrollBehavior: smooth scroll / saved position
│
├── stores/
│   └── auth.ts                     # Pinia auth store — token, user, isAdmin/isModerator
│                                   # computed flags, setToken(), setUser(), logout()
│
├── services/
│   ├── api-service.ts              # Core Axios wrapper — init(), setAuthToken(),
│   │                               # request interceptor (injects Bearer),
│   │                               # response interceptor (401 → redirect, 429 warn)
│   └── api/
│       ├── index.ts                # Barrel export for all API modules
│       ├── auth-api.ts             # login, register, logout, verifyEmail,
│       │                           # forgotPassword, resetPassword, refreshToken
│       ├── posts-api.ts            # fetchPosts (paginated), getPost,
│       │                           # createPost (multipart), updatePost, deletePost
│       ├── comments-api.ts         # getComments, createComment, updateComment, deleteComment
│       ├── subjects-api.ts         # getSubjects, getSubject, createSubject,
│       │                           # updateSubject, deleteSubject
│       ├── likes-api.ts            # likePost, unlikePost, likeComment, unlikeComment
│       ├── files-api.ts            # uploadFile, downloadFile (returns pre-signed URL)
│       ├── users-api.ts            # getMe, updateMe, getUserById
│       ├── admin-api.ts            # updateUserRole
│       ├── discord-api.ts          # linkDiscord, getDiscordStatus
│       ├── cache-api.ts            # clearCache (admin only)
│       └── test-api.ts             # health check endpoint
│
├── views/
│   ├── LandingPageView.vue         # Public landing page with hero, features, team sections
│   ├── HomeView.vue                # Post feed — subject filter, pagination, QuickPostForm
│   ├── CategoryView.vue            # Subject browser
│   ├── PostDetailView.vue          # Post detail — file download, comments, like button
│   ├── MyPostsView.vue             # User's own posts with delete
│   ├── userProfileView.vue         # Profile edit (name, nickName)
│   ├── AdminView.vue               # Admin dashboard — tabs for each resource
│   ├── 404View.vue                 # Not found page
│   │
│   ├── auth/
│   │   ├── components/             # Shared auth UI: AuthCard, AuthForm, AuthHeader,
│   │   │                           # AuthFooter, AuthLegalText, FormInput, PasswordInput
│   │   ├── login/
│   │   │   ├── LoginView.vue
│   │   │   └── use-login.ts        # Login composable — form state, validation, submit
│   │   ├── register/
│   │   │   ├── RegisterView.vue
│   │   │   └── use-register.ts     # Register composable
│   │   ├── email-confirmation/
│   │   │   └── EmailConfirmationView.vue  # Enter 6-digit Cognito OTP
│   │   └── reset-password/
│   │       ├── ResetPasswordView.vue
│   │       └── use-reset-password.ts
│   │
│   └── discord/
│       ├── DiscordLinkedView.vue   # Success screen after Discord OAuth2
│       └── DiscordErrorView.vue
│
├── components/
│   ├── Header.vue                  # Top nav — logo, user menu, theme toggle, logout
│   ├── Sidebar.vue                 # Left nav — subjects list
│   ├── Footer.vue
│   ├── MainContent.vue             # Main content slot wrapper
│   ├── PostCard.vue                # Post preview — title, subject, author, stats
│   ├── CommentCard.vue             # Comment with like button + delete if owner
│   ├── QuickPostForm.vue           # Inline post creation form with file upload
│   ├── SubjectContent.vue          # Posts filtered by subject
│   ├── RoleBadge.vue               # USER / MODERATOR / ADMIN chip badge
│   ├── ThemeToggle.vue             # Dark/light mode toggle button
│   ├── CustomAccordion.vue         # Accordion wrapper around PrimeVue
│   ├── CustomGallery.vue           # Image gallery component
│   ├── CustomSelect.vue            # Styled select input
│   ├── PrimaryButton.vue           # Primary CTA button
│   ├── SecondaryButton.vue         # Secondary button
│   ├── UnderlineButton.vue         # Text underline button
│   └── admin/
│       ├── UserManagement.vue      # CRUD table for users + role assignment
│       ├── PostManagement.vue      # CRUD table for all posts
│       ├── CommentManagement.vue   # CRUD table for all comments
│       └── SubjectManagement.vue   # CRUD table for subjects
│
├── composables/
│   ├── useTheme.ts                 # Dark/light toggle — persists to localStorage,
│   │                               # applies .dark + .my-app-dark on <html>
│   └── useSidebar.ts               # Sidebar open/close state
│
├── types/
│   ├── api.ts                      # Barrel export for all types
│   ├── auth.ts                     # RegisterRequest, LoginRequest/Response, etc.
│   ├── post.ts                     # PostDTO, PostDetailDTO, PostListResponse,
│   │                               # CreatePostRequest, PostFilters, AuthorDTO, etc.
│   ├── comment.ts                  # CommentDTO, CommentDetailDTO, CommentListResponse
│   ├── subject.ts                  # SubjectDTO, SubjectListResponse
│   ├── user.ts                     # UserDTO, UpdateUserRequest
│   ├── like.ts                     # LikeDTO
│   └── common.ts                   # ErrorResponse, Pagination, FileInfo, ListResponse
│
├── utils/
│   ├── auth-helper.ts              # Token expiry check, role helpers
│   ├── jwt-decoder.ts              # Decode JWT payload (no verification — backend does it)
│   ├── password-validation.ts      # Password strength rules (min 8, upper, lower, number)
│   └── url.ts                      # API URL helpers
│
├── i18n/
│   ├── index.ts                    # vue-i18n setup
│   └── sk.ts                       # Slovak locale strings
│
└── assets/
    ├── index.css                   # Tailwind base + custom global styles
    └── img/                        # Logo variants, landing page illustrations
```

---

## State Management

One Pinia store handles all auth state:

```
auth store
  ├── token          JWT from Cognito (loaded from localStorage on init)
  ├── user           UserDTO (id, name, nickName, email, role)
  ├── isAuthenticated
  ├── isAdmin        computed: user.role === 'ADMIN'
  └── isModerator    computed: user.role === 'MODERATOR'
```

Token is persisted in `localStorage` under key `authToken`. `ApiService` reads it on startup and attaches it to every request automatically.

---

## API Integration

All API calls go through `ApiService` (Axios wrapper) which:
- Injects `Authorization: Bearer <token>` on every request
- Redirects to `/login` on 401
- Warns on 429 (rate limit hit)

Each resource has its own module in `src/services/api/`:

```typescript
// Fetch paginated posts filtered by subject
const posts = await PostsApi.fetchPosts({ page: 1, limit: 20, subjectId: 'uuid' })

// Upload a post with a file
await PostsApi.createPost({ title, subjectId, description, file })

// Get pre-signed S3 download URL
const { downloadUrl } = await FilesApi.downloadFile(fileKey)
```

---

## Local Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env`:
```
VITE_API_URL=http://localhost:8080/api/v1
```

3. Run dev server:
```bash
npm run dev
```

App runs at `http://localhost:3000`. The backend must be running — see [ucm-connect-api](https://github.com/Kurk3/ucm-connect-api).

---

## Scripts

```bash
npm run dev            # Start dev server (port 3000)
npm run build          # Type-check + Vite production build
npm run preview        # Preview production build locally
npm run type-check     # Run vue-tsc without emitting
npm run test           # Run Vitest
npm run test:coverage  # Run tests with v8 coverage report
```

---

## Testing

Vitest with `jsdom` environment. Coverage targets: composables, API modules, components, and view composables (`use-*.ts`).

```bash
npm run test:coverage
```

---

## Deployment

Deployed on Vercel. Set the environment variable in project settings:

```
VITE_API_URL=https://ucm-connect-api.onrender.com/api/v1
```

Vercel Analytics is integrated via `@vercel/analytics`.

---

## License

MIT
