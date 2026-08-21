# Git Commit Plan

This roadmap reconstructs a practical development history for the completed SkillSwap full-stack project. Each source/configuration file is assigned to one planned commit only. The commands are for manual execution; no Git commands were run while preparing this file.

## Commit Progress

- [ ] Commit 1 - Initialize project metadata and frontend shell configuration
- [ ] Commit 2 - Set up backend runtime and shared infrastructure
- [ ] Commit 3 - Add Prisma database schema and initial migrations
- [ ] Commit 4 - Implement authentication and account recovery
- [ ] Commit 5 - Add frontend application shell and authentication UI
- [ ] Commit 6 - Add profiles and profile discovery surfaces
- [ ] Commit 7 - Add skills and skill management
- [ ] Commit 8 - Add discovery, matching, dashboard, and statistics
- [ ] Commit 9 - Add swap requests and classroom lifecycle
- [ ] Commit 10 - Add real-time classroom collaboration
- [ ] Commit 11 - Add notifications, push delivery, availability, and calendar
- [ ] Commit 12 - Add reviews, rewards, badges, and leaderboards
- [ ] Commit 13 - Add safety, moderation, administration, and account deletion
- [ ] Commit 14 - Add final integration documentation and shared assets

## Architecture Summary

SkillSwap is a Vite/React client backed by an Express HTTP server and Socket.IO. The client uses Axios against `/api`, stores short-lived access tokens in local/session storage, sends refresh tokens through cookies, and connects to Socket.IO for notifications, chat presence, classroom calls, and whiteboard synchronization. The server uses Prisma with MySQL, with feature routes delegating to controllers and services. The Prisma schema is the shared persistence contract for users, profiles, skills, swaps/classes, chat, classroom tools, notifications, reviews, moderation, and gamification.

The dependency direction used below is: repository/tooling -> server/database foundations -> authentication -> client shell/auth -> profile/skills -> discovery/swaps -> classroom realtime -> notifications/calendar -> reviews/gamification -> safety/admin.

## Commit 1 - Initialize project metadata and frontend shell configuration

### Purpose

Establish package manifests, lockfiles, Vite/Tailwind/ESLint configuration, the HTML entry point, and the minimal public/static frontend scaffold. This is the smallest repository setup before application features are introduced.

### Commit Message

`chore: initialize project metadata and frontend shell`

### Files to Add

```text
backend/.gitignore
backend/package.json
backend/package-lock.json
frontend/.gitignore
frontend/package.json
frontend/package-lock.json
frontend/eslint.config.js
frontend/index.html
frontend/tailwind.config.js
frontend/vite.config.js
frontend/public/manifest.json
frontend/public/sw.js
frontend/public/vite.svg
frontend/src/assets/react.svg
frontend/src/App.css
frontend/src/index.css
```

### Git Add Command

```bash
git add backend/.gitignore backend/package.json backend/package-lock.json frontend/.gitignore frontend/package.json frontend/package-lock.json frontend/eslint.config.js frontend/index.html frontend/tailwind.config.js frontend/vite.config.js frontend/public/manifest.json frontend/public/sw.js frontend/public/vite.svg frontend/src/assets/react.svg frontend/src/App.css frontend/src/index.css
```

### Git Commit Command

```bash
git commit -m "chore: initialize project metadata and frontend shell"
```

### Depends On

None

---

## Commit 2 - Set up backend runtime and shared infrastructure

### Purpose

Add the Express/HTTP/Socket.IO server entry point, environment configuration, Prisma client wrapper, common errors, logging, upload handling, and reusable request/auth/validation infrastructure. The later feature routes plug into this runtime.

### Commit Message

`chore: set up backend runtime and shared infrastructure`

### Files to Add

```text
backend/index.js
backend/conf/conf.js
backend/prisma/client.js
backend/errors/generic.errors.js
backend/middlewares/token.middleware.js
backend/middlewares/validation.middleware.js
backend/middlewares/upload.middleware.js
backend/utils/logger.js
backend/utils/assertUserInClass.js
```

### Git Add Command

```bash
git add backend/index.js backend/conf/conf.js backend/prisma/client.js backend/errors/generic.errors.js backend/middlewares/token.middleware.js backend/middlewares/validation.middleware.js backend/middlewares/upload.middleware.js backend/utils/logger.js backend/utils/assertUserInClass.js
```

### Git Commit Command

```bash
git commit -m "chore: set up backend runtime and shared infrastructure"
```

### Depends On

Commit 1

---

## Commit 3 - Add Prisma database schema and initial migrations

### Purpose

Introduce the MySQL datasource and the complete relational model. The migrations are grouped in chronological database-development order, beginning with users and then adding the base application entities and early profile/swap changes.

### Commit Message

`feat: configure Prisma schema and initial database migrations`

### Files to Add

```text
backend/prisma/schema.prisma
backend/prisma/migrations/migration_lock.toml
backend/prisma/migrations/20260201173726_users/migration.sql
backend/prisma/migrations/20260203171606_users_02/migration.sql
backend/prisma/migrations/20260217121228_add_full_schema/migration.sql
backend/prisma/migrations/20260218165054_make_teach_skill_optional_add_message/migration.sql
backend/prisma/migrations/20260219181905_add_full_profile_schema/migration.sql
backend/prisma/migrations/20260220082306_test/migration.sql
backend/prisma/migrations/20260220131715_add_refresh_tokens/migration.sql
backend/prisma/migrations/20260226190330_add_swap_reviews/migration.sql
backend/prisma/migrations/20260303070540_add_performance_indexes/migration.sql
```

### Git Add Command

```bash
git add backend/prisma/schema.prisma backend/prisma/migrations/migration_lock.toml backend/prisma/migrations/20260201173726_users/migration.sql backend/prisma/migrations/20260203171606_users_02/migration.sql backend/prisma/migrations/20260217121228_add_full_schema/migration.sql backend/prisma/migrations/20260218165054_make_teach_skill_optional_add_message/migration.sql backend/prisma/migrations/20260219181905_add_full_profile_schema/migration.sql backend/prisma/migrations/20260220082306_test/migration.sql backend/prisma/migrations/20260220131715_add_refresh_tokens/migration.sql backend/prisma/migrations/20260226190330_add_swap_reviews/migration.sql backend/prisma/migrations/20260303070540_add_performance_indexes/migration.sql
```

### Git Commit Command

```bash
git commit -m "feat: configure Prisma schema and initial database migrations"
```

### Depends On

Commit 2

---

## Commit 4 - Implement authentication and account recovery

### Purpose

Add registration, password hashing, email verification, login/logout, access and refresh token rotation, password reset, cookie handling, and authentication validation. This is the backend identity boundary required by protected features.

### Commit Message

`feat: implement authentication and account recovery`

### Files to Add

```text
backend/middlewares/auth.middleware.js
backend/controllers/auth.controller.js
backend/routes/auth.routes.js
backend/services/register.service.js
backend/services/login.service.js
backend/services/refreshToken.service.js
backend/services/sendEmail.service.js
backend/services/setpassword.service.js
backend/services/verify.service.js
backend/utils/jwt.js
backend/utils/emailTemplates.js
```

### Git Add Command

```bash
git add backend/middlewares/auth.middleware.js backend/controllers/auth.controller.js backend/routes/auth.routes.js backend/services/register.service.js backend/services/login.service.js backend/services/refreshToken.service.js backend/services/sendEmail.service.js backend/services/setpassword.service.js backend/services/verify.service.js backend/utils/jwt.js backend/utils/emailTemplates.js
```

### Git Commit Command

```bash
git commit -m "feat: implement authentication and account recovery"
```

### Depends On

Commit 3

---

## Commit 5 - Add frontend application shell and authentication UI

### Purpose

Add the React entry point, routing/provider composition, shared layout and UI primitives, API token-refresh client, auth context, and all registration/login/verification/password-recovery screens. These files connect the client to Commit 4's auth API.

### Commit Message

`feat: add frontend shell and authentication flows`

### Files to Add

```text
frontend/src/main.jsx
frontend/src/App.jsx
frontend/src/components/ErrorBoundary.jsx
frontend/src/components/layout/Layout.jsx
frontend/src/components/layout/Navbar.jsx
frontend/src/components/ui/Button.jsx
frontend/src/components/ui/ConfirmDialog.jsx
frontend/src/components/ui/Input.jsx
frontend/src/components/ui/InputDialog.jsx
frontend/src/components/ui/LoadingScreen.jsx
frontend/src/components/ui/Skeleton.jsx
frontend/src/context/AuthContext.jsx
frontend/src/services/api.js
frontend/src/services/auth.service.js
frontend/src/pages/Home.jsx
frontend/src/pages/Login.jsx
frontend/src/pages/Register.jsx
frontend/src/pages/ForgotPassword.jsx
frontend/src/pages/ResetPassword.jsx
frontend/src/pages/VerifyEmail.jsx
frontend/src/pages/NotFound.jsx
```

### Git Add Command

```bash
git add frontend/src/main.jsx frontend/src/App.jsx frontend/src/components/ErrorBoundary.jsx frontend/src/components/layout/Layout.jsx frontend/src/components/layout/Navbar.jsx frontend/src/components/ui/Button.jsx frontend/src/components/ui/ConfirmDialog.jsx frontend/src/components/ui/Input.jsx frontend/src/components/ui/InputDialog.jsx frontend/src/components/ui/LoadingScreen.jsx frontend/src/components/ui/Skeleton.jsx frontend/src/context/AuthContext.jsx frontend/src/services/api.js frontend/src/services/auth.service.js frontend/src/pages/Home.jsx frontend/src/pages/Login.jsx frontend/src/pages/Register.jsx frontend/src/pages/ForgotPassword.jsx frontend/src/pages/ResetPassword.jsx frontend/src/pages/VerifyEmail.jsx frontend/src/pages/NotFound.jsx
```

### Git Commit Command

```bash
git commit -m "feat: add frontend shell and authentication flows"
```

### Depends On

Commit 4

---

## Commit 6 - Add profiles and profile discovery surfaces

### Purpose

Implement private profile editing, public username/user profiles, profile privacy, learning goals, social links, availability display, featured profiles, profile reviews display, and the reusable profile/public-profile component groups.

### Commit Message

`feat: add user profiles and public profile discovery`

### Files to Add

```text
backend/controllers/profile.controller.js
backend/routes/profile.routes.js
backend/services/profile.service.js
frontend/src/services/profile.service.js
frontend/src/services/profilePage.service.js
frontend/src/services/publicProfile.service.js
frontend/src/hooks/useProfileConfig.js
frontend/src/components/AvailabilitySchedule.jsx
frontend/src/components/profile/index.js
frontend/src/components/profile/ProfileLearningGoalsSection.jsx
frontend/src/components/profile/ProfilePreviewSection.jsx
frontend/src/components/profile/ProfilePrivacySection.jsx
frontend/src/components/profile/ProfileReviewsModal.jsx
frontend/src/components/profile/ProfileSocialLinksSection.jsx
frontend/src/components/profile/ProfileStepProgress.jsx
frontend/src/components/publicProfile/index.js
frontend/src/components/publicProfile/PublicProfileActivitySection.jsx
frontend/src/components/publicProfile/PublicProfileAvailabilitySection.jsx
frontend/src/components/publicProfile/PublicProfileHeaderSection.jsx
frontend/src/components/publicProfile/PublicProfileModals.jsx
frontend/src/components/publicProfile/PublicProfileReviewsSection.jsx
frontend/src/components/publicProfile/PublicProfileSkillsSection.jsx
frontend/src/components/publicProfile/PublicProfileStatsSection.jsx
frontend/src/components/publicProfile/SkillCard.jsx
frontend/src/components/publicProfile/SocialLink.jsx
frontend/src/pages/Profile.jsx
frontend/src/pages/PublicProfile.jsx
```

### Git Add Command

```bash
git add backend/controllers/profile.controller.js backend/routes/profile.routes.js backend/services/profile.service.js frontend/src/services/profile.service.js frontend/src/services/profilePage.service.js frontend/src/services/publicProfile.service.js frontend/src/hooks/useProfileConfig.js frontend/src/components/AvailabilitySchedule.jsx frontend/src/components/profile/index.js frontend/src/components/profile/ProfileLearningGoalsSection.jsx frontend/src/components/profile/ProfilePreviewSection.jsx frontend/src/components/profile/ProfilePrivacySection.jsx frontend/src/components/profile/ProfileReviewsModal.jsx frontend/src/components/profile/ProfileSocialLinksSection.jsx frontend/src/components/profile/ProfileStepProgress.jsx frontend/src/components/publicProfile/index.js frontend/src/components/publicProfile/PublicProfileActivitySection.jsx frontend/src/components/publicProfile/PublicProfileAvailabilitySection.jsx frontend/src/components/publicProfile/PublicProfileHeaderSection.jsx frontend/src/components/publicProfile/PublicProfileModals.jsx frontend/src/components/publicProfile/PublicProfileReviewsSection.jsx frontend/src/components/publicProfile/PublicProfileSkillsSection.jsx frontend/src/components/publicProfile/PublicProfileStatsSection.jsx frontend/src/components/publicProfile/SkillCard.jsx frontend/src/components/publicProfile/SocialLink.jsx frontend/src/pages/Profile.jsx frontend/src/pages/PublicProfile.jsx
```

### Git Commit Command

```bash
git commit -m "feat: add user profiles and public profile discovery"
```

### Depends On

Commit 5

---

## Commit 7 - Add skills and skill management

### Purpose

Add the skill catalog, teach/learn user skills, skill levels and ordering, skill demo uploads, and the corresponding frontend pages and API service.

### Commit Message

`feat: add skill catalog and user skill management`

### Files to Add

```text
backend/controllers/skill.controller.js
backend/routes/skill.routes.js
backend/services/skill.service.js
frontend/src/services/skill.service.js
frontend/src/pages/Skills.jsx
frontend/src/pages/MySkills.jsx
frontend/src/pages/AddSkill.jsx
```

### Git Add Command

```bash
git add backend/controllers/skill.controller.js backend/routes/skill.routes.js backend/services/skill.service.js frontend/src/services/skill.service.js frontend/src/pages/Skills.jsx frontend/src/pages/MySkills.jsx frontend/src/pages/AddSkill.jsx
```

### Git Commit Command

```bash
git commit -m "feat: add skill catalog and user skill management"
```

### Depends On

Commit 6

---

## Commit 8 - Add discovery, matching, dashboard, and statistics

### Purpose

Connect users through matched/discoverable skills, saved discovery filters, dashboard summaries, community statistics, and the dashboard/discovery UI.

### Commit Message

`feat: add matching discovery and dashboard data`

### Files to Add

```text
backend/controllers/matching.controller.js
backend/controllers/stats.controller.js
backend/routes/matching.routes.js
backend/routes/discover.routes.js
backend/routes/stats.routes.js
backend/services/matching.service.js
backend/services/stats.service.js
frontend/src/services/matching.service.js
frontend/src/services/stats.service.js
frontend/src/components/dashboard/index.js
frontend/src/components/dashboard/DashboardActiveSwapsSection.jsx
frontend/src/components/dashboard/DashboardNextSessionCard.jsx
frontend/src/components/dashboard/DashboardOnlineNowSection.jsx
frontend/src/components/dashboard/DashboardStatsGrid.jsx
frontend/src/components/dashboard/DashboardSuggestedSwapsSection.jsx
frontend/src/pages/DiscoverSkills.jsx
frontend/src/pages/Dashboard.jsx
```

### Git Add Command

```bash
git add backend/controllers/matching.controller.js backend/controllers/stats.controller.js backend/routes/matching.routes.js backend/routes/discover.routes.js backend/routes/stats.routes.js backend/services/matching.service.js backend/services/stats.service.js frontend/src/services/matching.service.js frontend/src/services/stats.service.js frontend/src/components/dashboard/index.js frontend/src/components/dashboard/DashboardActiveSwapsSection.jsx frontend/src/components/dashboard/DashboardNextSessionCard.jsx frontend/src/components/dashboard/DashboardOnlineNowSection.jsx frontend/src/components/dashboard/DashboardStatsGrid.jsx frontend/src/components/dashboard/DashboardSuggestedSwapsSection.jsx frontend/src/pages/DiscoverSkills.jsx frontend/src/pages/Dashboard.jsx
```

### Git Commit Command

```bash
git commit -m "feat: add matching discovery and dashboard data"
```

### Depends On

Commit 7

---

## Commit 9 - Add swap requests and classroom lifecycle

### Purpose

Implement the core exchange workflow: create and manage requests, accept/reject/cancel them, create swap classes, track todos and completion, and expose the swaps UI.

### Commit Message

`feat: add skill swap requests and class lifecycle`

### Files to Add

```text
backend/controllers/swap.controller.js
backend/routes/swap.routes.js
backend/services/swap.service.js
frontend/src/services/swap.service.js
frontend/src/services/swapsPage.service.js
frontend/src/components/swaps/index.js
frontend/src/components/swaps/EmptyState.jsx
frontend/src/components/swaps/StatusBadge.jsx
frontend/src/components/swaps/SwapsControlPanel.jsx
frontend/src/components/swaps/SwapsHeaderStats.jsx
frontend/src/components/swaps/SwapsModals.jsx
frontend/src/components/swaps/SwapTimeline.jsx
frontend/src/pages/NewSwapRequest.jsx
frontend/src/pages/Swaps.jsx
```

### Git Add Command

```bash
git add backend/controllers/swap.controller.js backend/routes/swap.routes.js backend/services/swap.service.js frontend/src/services/swap.service.js frontend/src/services/swapsPage.service.js frontend/src/components/swaps/index.js frontend/src/components/swaps/EmptyState.jsx frontend/src/components/swaps/StatusBadge.jsx frontend/src/components/swaps/SwapsControlPanel.jsx frontend/src/components/swaps/SwapsHeaderStats.jsx frontend/src/components/swaps/SwapsModals.jsx frontend/src/components/swaps/SwapTimeline.jsx frontend/src/pages/NewSwapRequest.jsx frontend/src/pages/Swaps.jsx
```

### Git Commit Command

```bash
git commit -m "feat: add skill swap requests and class lifecycle"
```

### Depends On

Commit 8

---

## Commit 10 - Add real-time classroom collaboration

### Purpose

Add class chat and message search/attachments, Socket.IO presence and call signaling, shared notes, tasks, pinned resources, code snippets, classroom files, reviews panel wiring, and Excalidraw whiteboard state. This commit includes the client hooks/components and backend realtime/server behavior together.

### Commit Message

`feat: add real-time classroom collaboration tools`

### Files to Add

```text
backend/controllers/chat.controller.js
backend/routes/chat.routes.js
backend/services/chat.service.js
backend/utils/pushNotification.js
frontend/src/context/SocketContext.jsx
frontend/src/services/chat.service.js
frontend/src/services/classroom.service.js
frontend/src/hooks/useClassroomDerivedState.js
frontend/src/hooks/useSwapClassroomChat.js
frontend/src/hooks/useSwapClassroomUtils.js
frontend/src/hooks/swap-classroom/swapClassroomHooks.js
frontend/src/hooks/swap-classroom/useSwapClassroomCall.js
frontend/src/hooks/swap-classroom/useSwapClassroomChat.js
frontend/src/hooks/swap-classroom/useSwapClassroomFiles.js
frontend/src/hooks/swap-classroom/useSwapClassroomNotes.js
frontend/src/hooks/swap-classroom/useSwapClassroomResources.js
frontend/src/hooks/swap-classroom/useSwapClassroomReviews.js
frontend/src/hooks/swap-classroom/useSwapClassroomSnippets.js
frontend/src/hooks/swap-classroom/useSwapClassroomTasks.js
frontend/src/hooks/swap-classroom/useSwapClassroomUtils.js
frontend/src/hooks/swap-classroom/useSwapClassroomWhiteboard.js
frontend/src/components/classroom/index.js
frontend/src/components/classroom/PanelSection.jsx
frontend/src/components/classroom/ClassroomCallOverlay.jsx
frontend/src/components/classroom/ClassroomChatDrawer.jsx
frontend/src/components/classroom/ClassroomFilePreviewModal.jsx
frontend/src/components/classroom/ClassroomFilesPanel.jsx
frontend/src/components/classroom/ClassroomNotesPanel.jsx
frontend/src/components/classroom/ClassroomResourcesPanel.jsx
frontend/src/components/classroom/ClassroomReviewsPanel.jsx
frontend/src/components/classroom/ClassroomSnippetsPanel.jsx
frontend/src/components/classroom/ClassroomState.jsx
frontend/src/components/classroom/ClassroomTasksPanel.jsx
frontend/src/components/classroom/WhiteboardModal.jsx
frontend/src/components/classroom/classroomUtils.jsx
frontend/src/pages/SwapClassroom.jsx
```

### Git Add Command

```bash
git add backend/controllers/chat.controller.js backend/routes/chat.routes.js backend/services/chat.service.js backend/utils/pushNotification.js backend/prisma/migrations/20260319080000_add_chatmessage_isread/migration.sql backend/prisma/migrations/20260319100000_chat_modern_features/migration.sql backend/prisma/migrations/20260319195000_add_classroom_productivity_tools/migration.sql frontend/src/context/SocketContext.jsx frontend/src/services/chat.service.js frontend/src/services/classroom.service.js frontend/src/hooks/useClassroomDerivedState.js frontend/src/hooks/useSwapClassroomChat.js frontend/src/hooks/useSwapClassroomUtils.js frontend/src/hooks/swap-classroom/swapClassroomHooks.js frontend/src/hooks/swap-classroom/useSwapClassroomCall.js frontend/src/hooks/swap-classroom/useSwapClassroomChat.js frontend/src/hooks/swap-classroom/useSwapClassroomFiles.js frontend/src/hooks/swap-classroom/useSwapClassroomNotes.js frontend/src/hooks/swap-classroom/useSwapClassroomResources.js frontend/src/hooks/swap-classroom/useSwapClassroomReviews.js frontend/src/hooks/swap-classroom/useSwapClassroomSnippets.js frontend/src/hooks/swap-classroom/useSwapClassroomTasks.js frontend/src/hooks/swap-classroom/useSwapClassroomUtils.js frontend/src/hooks/swap-classroom/useSwapClassroomWhiteboard.js frontend/src/components/classroom/index.js frontend/src/components/classroom/PanelSection.jsx frontend/src/components/classroom/ClassroomCallOverlay.jsx frontend/src/components/classroom/ClassroomChatDrawer.jsx frontend/src/components/classroom/ClassroomFilePreviewModal.jsx frontend/src/components/classroom/ClassroomFilesPanel.jsx frontend/src/components/classroom/ClassroomNotesPanel.jsx frontend/src/components/classroom/ClassroomResourcesPanel.jsx frontend/src/components/classroom/ClassroomReviewsPanel.jsx frontend/src/components/classroom/ClassroomSnippetsPanel.jsx frontend/src/components/classroom/ClassroomState.jsx frontend/src/components/classroom/ClassroomTasksPanel.jsx frontend/src/components/classroom/WhiteboardModal.jsx frontend/src/components/classroom/classroomUtils.jsx frontend/src/pages/SwapClassroom.jsx
```

### Git Commit Command

```bash
git commit -m "feat: add real-time classroom collaboration tools"
```

### Depends On

Commit 9

---

## Commit 11 - Add notifications, push delivery, availability, and calendar

### Purpose

Add persistent and realtime notifications, notification preferences, browser push subscriptions, class reminders, availability slots, calendar events, and the associated pages/services.

### Commit Message

`feat: add notifications push delivery and calendar scheduling`

### Files to Add

```text
backend/controllers/meta.controller.js
backend/routes/meta.routes.js
backend/services/meta.service.js
backend/services/notification.service.js
backend/services/classReminder.service.js
backend/services/webPush.service.js
frontend/src/services/meta.service.js
frontend/src/utils/timezone.js
frontend/src/pages/Notifications.jsx
frontend/src/pages/NotificationSettings.jsx
frontend/src/pages/Calendar.jsx
```

### Git Add Command

```bash
git add backend/controllers/meta.controller.js backend/routes/meta.routes.js backend/services/meta.service.js backend/services/notification.service.js backend/services/classReminder.service.js backend/services/webPush.service.js backend/prisma/migrations/20260320091500_advanced_notifications/migration.sql backend/prisma/migrations/20260320113000_add_saved_filters/migration.sql backend/prisma/migrations/20260322120000_profile_enhancements/migration.sql backend/prisma/migrations/20260322143000_add_teaching_styles_json/migration.sql backend/prisma/migrations/20260323193000_add_userskill_display_order/migration.sql frontend/src/services/meta.service.js frontend/src/utils/timezone.js frontend/src/pages/Notifications.jsx frontend/src/pages/NotificationSettings.jsx frontend/src/pages/Calendar.jsx
```

### Git Commit Command

```bash
git commit -m "feat: add notifications push delivery and calendar scheduling"
```

### Depends On

Commit 10

---

## Commit 12 - Add reviews, rewards, badges, and leaderboards

### Purpose

Add verified structured reviews and helpful votes, review ratings in the classroom/profile experience, badge evaluation, rewards history, and leaderboard presentation.

### Commit Message

`feat: add reviews rewards badges and leaderboard`

### Files to Add

```text
backend/controllers/review.controller.js
backend/routes/review.routes.js
backend/services/review.service.js
backend/utils/badgeEvaluator.js
frontend/src/services/review.service.js
frontend/src/pages/Rewards.jsx
frontend/src/pages/Leaderboard.jsx
```

### Git Add Command

```bash
git add backend/controllers/review.controller.js backend/routes/review.routes.js backend/services/review.service.js backend/utils/badgeEvaluator.js backend/prisma/migrations/20260320131500_structured_reviews/migration.sql frontend/src/services/review.service.js frontend/src/pages/Rewards.jsx frontend/src/pages/Leaderboard.jsx
```

### Git Commit Command

```bash
git commit -m "feat: add reviews rewards badges and leaderboard"
```

### Depends On

Commit 10 and Commit 11

---

## Commit 13 - Add safety, moderation, administration, and account deletion

### Purpose

Add blocking, reporting, admin moderation actions and penalties, badge administration, safety API calls, and account deletion. The admin route checks in the frontend depend on the backend admin middleware and moderation endpoints.

### Commit Message

`feat: add safety moderation and administration tools`

### Files to Add

```text
backend/middlewares/admin.middleware.js
backend/controllers/block.controller.js
backend/routes/block.routes.js
backend/routes/report.routes.js
backend/services/block.service.js
backend/services/deleteAccount.service.js
frontend/src/services/safety.service.js
frontend/src/pages/AdminReports.jsx
frontend/src/pages/AdminPenalties.jsx
frontend/src/pages/AdminBadges.jsx
```

### Git Add Command

```bash
git add backend/middlewares/admin.middleware.js backend/controllers/block.controller.js backend/routes/block.routes.js backend/routes/report.routes.js backend/services/block.service.js backend/services/deleteAccount.service.js backend/prisma/migrations/20260319183000_add_blocked_users/migration.sql backend/prisma/migrations/20260505063111_account_delete_cascades/migration.sql frontend/src/services/safety.service.js frontend/src/pages/AdminReports.jsx frontend/src/pages/AdminPenalties.jsx frontend/src/pages/AdminBadges.jsx
```

### Git Commit Command

```bash
git commit -m "feat: add safety moderation and administration tools"
```

### Depends On

Commit 12

---

## Commit 14 - Add final integration documentation and shared assets

### Purpose

Add the remaining project documentation and route-prefetch helper. This closes the repository with the frontend README and the small shared utility that optimizes navigation across the completed route set.

### Commit Message

`docs: document frontend setup and finalize integration helpers`

### Files to Add

```text
frontend/README.md
frontend/src/utils/routePrefetch.js
```

### Git Add Command

```bash
git add frontend/README.md frontend/src/utils/routePrefetch.js
```

### Git Commit Command

```bash
git commit -m "docs: document frontend setup and finalize integration helpers"
```

### Depends On

Commit 13

---

## Database Migration Follow-Up

The complete schema is introduced in Commit 3, while the following migrations are intentionally assigned to the feature commits where they became meaningful. Because the repository contains the final schema, those later migrations must be manually added alongside the corresponding feature rather than added in a single database mega-commit.

### Commit 10 migration files

```text
backend/prisma/migrations/20260319080000_add_chatmessage_isread/migration.sql
backend/prisma/migrations/20260319100000_chat_modern_features/migration.sql
backend/prisma/migrations/20260319195000_add_classroom_productivity_tools/migration.sql
```

### Commit 11 migration files

```text
backend/prisma/migrations/20260320091500_advanced_notifications/migration.sql
backend/prisma/migrations/20260320113000_add_saved_filters/migration.sql
backend/prisma/migrations/20260322120000_profile_enhancements/migration.sql
backend/prisma/migrations/20260322143000_add_teaching_styles_json/migration.sql
backend/prisma/migrations/20260323193000_add_userskill_display_order/migration.sql
```

### Commit 12 migration files

```text
backend/prisma/migrations/20260320131500_structured_reviews/migration.sql
```

### Commit 13 migration files

```text
backend/prisma/migrations/20260319183000_add_blocked_users/migration.sql
backend/prisma/migrations/20260505063111_account_delete_cascades/migration.sql
```

The migration paths are included directly in the respective `git add` commands above and are repeated here only as an audit index.

## Coverage Check

Repository scan performed outside `.git`, excluding the generated plan file itself:

- Files in project: **227**
- Files assigned to commits: **210**
- Files intentionally ignored/excluded: **17**
- Planned commits: **14**
- Identified feature areas: **13** (tooling/infrastructure, authentication, profiles, skills, discovery, swaps, classroom realtime, notifications/calendar, reviews/gamification, safety/admin, styling/runtime integration, database, documentation)

The 17 excluded files are:

```text
backend/src/generated/browser.ts
backend/src/generated/client.ts
backend/src/generated/commonInputTypes.ts
backend/src/generated/enums.ts
backend/src/generated/models.ts
backend/src/generated/internal/class.ts
backend/src/generated/internal/prismaNamespace.ts
backend/src/generated/internal/prismaNamespaceBrowser.ts
backend/src/generated/models/Users.ts
backend/src/generated/query_engine-windows.dll.node
backend/uploads/avatars/64cfb47f-4cb4-4488-8ff6-26d91cca9989-ChatGPT Image Mar 19, 2026, 01_14_11 AM.png
backend/uploads/avatars/85fed60b-d383-458f-8485-8d98491a4a31-charusat portal.jpeg
backend/uploads/chat/0b6251d1-0696-455d-877b-1484a4e813af-Pr7.pdf
backend/uploads/classroom-files/57dd030a-15a5-41c2-a974-d9d0330a9fee-CRNS_PR10_23IT073.pdf
backend/uploads/classroom-files/8f595109-298e-4680-aedc-7a73f1d55fa7-CRNS_PR10_23IT073.pdf
backend/uploads/skills/dc92a8d5-a3d1-4872-ad74-adfea3732b35-Satyanarayan Puja and Griha Pravesh Ceremony Invitation Template - Made with PosterMyWall (1).mp4
backend/uploads/whiteboard-scenes/class-8.json
```

Generated Prisma TypeScript files and the Windows query-engine binary should be regenerated with Prisma from `schema.prisma`; they should not be treated as authored source. The upload files are user/runtime data and may contain private or large content.

The existing ignore files cover `node_modules`, `.env`, logs, `dist`, and common IDE files. They do **not** currently cover the checked-in runtime upload directories or all generated Prisma output. Since application files were explicitly not to be modified, this plan intentionally excludes those paths and recommends adding the following patterns manually before the first real push:

```gitignore
backend/uploads/
backend/src/generated/
```

There is no root `.gitignore` in the current repository. Environment secrets are referenced by `backend/conf/conf.js` and frontend configuration reads `VITE_API_URL`; keep actual `.env` files out of Git and commit only sanitized example configuration if one is created later.

## Feature Summary

### Frontend features

React/Vite application shell, protected/public/admin routing, authentication screens, token refresh, profile editing and public profiles, skill management, discovery and matching, dashboard, swap management, classroom workspace, chat/call/whiteboard UI, notifications, browser push registration, calendar/availability, reviews, rewards, leaderboard, moderation screens, responsive dark styling, reusable controls, lazy loading, and service-worker registration.

### Backend features

Express API, Socket.IO server, CORS/Helmet/rate limiting, Prisma/MySQL persistence, validation and uploads, registration/login/email verification/password reset, refresh-token rotation, profiles, skills, matching/discovery/saved filters, swaps/classes/todos/completion, chat and attachments, classroom resources/notes/snippets/files, realtime presence/calls/whiteboard persistence, notifications/push/reminders, calendar/availability, reviews, badges/rewards/stats, blocks/reports/admin moderation, logging, and account deletion cascades.

### Full-stack/integration features

Axios API integration with bearer access tokens and cookie refresh, auth context and protected routes, Socket.IO authenticated connections, realtime notification/chat delivery, browser service-worker notifications, Prisma-backed feature contracts, file upload flows, and coordinated classroom hooks/components with backend routes.

### Files intentionally ignored

The 17 generated/runtime files listed in the coverage check. No files were categorized as ambiguous after the full inventory. `GIT_COMMIT_PLAN.md` is the newly created planning artifact and is intentionally not counted in the pre-existing project coverage total; add it separately when you are ready to commit the roadmap itself.

## Verification Notes

- No `git add`, `git commit`, `git push`, `git reset`, or other Git mutation command was executed.
- No project/application file was modified.
- Every pre-existing non-generated, non-upload file is assigned to one feature commit in this plan.
- The migration follow-up paths are assigned to feature commits and must be included in those commands before execution.
- The only categorization caveat is generated Prisma output and runtime uploads, which are explicitly excluded rather than committed.
