<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# VAC Portal Project Guide

## Workspace Structure

- `VAC-Client/`: Next.js 16.2.10 client using React 19, TypeScript, Tailwind CSS, and the App Router.
- `VAC-Server/`: Express 5 API using PostgreSQL, `bcryptjs`, and JWT authentication.
- The client and server are separate applications with separate `package.json` files.

## Client Routes

- `/login`: Login screen. The current form collects email and password but still logs the values locally instead of calling the server API.
- `/student/dashboard`: Student dashboard and `Course Complete` page. It displays completed-course summary data.
- `/student/course`: Course Master. Students can browse courses and register for one.
- `/student/my-course`: My Courses. Displays locally registered courses and supports viewing or cancelling registration.
- `/course-registration`: Faculty course request form.
- `/faculty/create`: Faculty event/course creation form.
- `/faculty/my-event`: Faculty event status view.

## Course Data Model

Course records used by the student pages have this shape:

```ts
type CourseItem = {
	sno: string;
	date: string;
	name: string;
	type: string;
	mode: "Online" | "Offline";
	credit: number;
	organizer: string;
	details?: string;
	status?: string;
};
```

- Student Course Master and My Courses display `Mode` and `Credit`.
- `category` and `points` are not valid student course table fields.
- Mock course records use `credit: 4` by default.
- Mode values are `Online` and `Offline`.

## Completed Courses

- The former dashboard `Points Container` is now labeled `Course Complete`.
- The dashboard uses the `completedCourses` collection in `app/student/dashboard/page.tsx`.
- Completed-course data includes course name, type, mode, credit value, and completion date.
- The dashboard derives total credits, completed-course count, Online count, Offline count, and completion rate from that collection.
- Completed-course records are currently mock data displayed on the dashboard; they are not loaded from the server yet.

## Reusable Student UI Design

Use the Course Complete page at `app/student/course-complete/page.tsx` as the visual reference for new student-facing pages.

- Use a neutral slate base: `bg-slate-50` for the page, `bg-white` for surfaces, and `dark:bg-slate-900` / `dark:bg-slate-950` for dark mode.
- Use indigo as the single accent for active navigation, focus states, links, and key values. Keep emerald for success/completed status and amber for secondary status only.
- Prefer `rounded-xl` for cards and controls; reserve larger radii for intentionally prominent containers. Avoid gradients, glassmorphism, emoji icons, and excessive shadows.
- Use compact spacing based on 4/8/12/16/24/32px increments. Keep page headings at `text-2xl`, section headings at `text-base`, and supporting labels at `text-xs` or `text-sm`.
- Use a left navigation rail on desktop, a simple content header, restrained metric cards, and tables for repeatable course data.
- Table headers use small uppercase text with tracking; table rows use clear primary/secondary text hierarchy and subtle hover states.
- Use inline SVG icons with accessible labels for controls. Do not use text emoji as UI icons.
- Add fast `150-200ms` transitions only to hover, focus, and theme changes.
- Data views should include a useful search/filter control and an explicit empty state when no records match.
- Keep copy concrete and product-specific: describe completed courses, modes, credits, dates, and statuses rather than generic marketing language.

## Client Persistence

- Course registration is stored in browser `localStorage` under `registered_courses`.
- Registration adds `status: "Registered"` to the selected course.
- My Courses reads and updates that localStorage collection.
- Theme preference is stored under `theme` and applied through the document `dark` class.

## Server Authentication API

The server routes are mounted under the server application entry point:

- `POST /register`: Creates a user with a bcrypt password hash.
- `POST /login`: Validates email and password and returns a JWT plus sanitized user data.
- `GET /me`: Returns the authenticated user and requires a bearer token.

Supported user roles are `student`, `faculty`, and `admin`. Faculty users must use `internal` or `external` for `facultyType`.

The users table stores `full_name`, `email`, `password_hash`, `role`, `faculty_type`, and timestamps. Passwords must never be stored or documented in plaintext.

## Validation Commands

Run client commands from `VAC-Client/`:

```powershell
npm run build
npm run lint
```

`npm run build` is the required compile/type validation for client changes. ESLint currently reports existing `set-state-in-effect`, `no-explicit-any`, and unescaped-entity issues in several pages.
