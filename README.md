# After School Program System (ZAN LMS)

Live demo: after-school-program-system-fronted.vercel.app

A multi-tenant Education Management System (EMS) for after-school learning centers. Built with a React/Vite frontend and a Laravel REST API, it gives every stakeholder — platform owner, center manager, teacher, student, and parent — a role-specific workspace for enrollment, curriculum, grading, attendance, billing, and reporting.

## 🧪 Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS
- **State Management**: Zustand (Auth, Notifications)
- **Forms & Validation**: React Hook Form, Zod
- **Networking**: Axios (JWT-based authentication)
- **Icons**: Lucide React
- **Notifications**: React Hot Toast

## 👥 Roles & Demo Accounts

| Role | Email | Password | Landing page |
|---|---|---|---|
| Super Admin | `superadmin@gmail.com` | `12345678` | `/super-admin/dashboard` |
| Center Admin | `centeradmin@gmail.com` | `12345678` | `/center-admin/dashboard` |
| Teacher | `teacher@gmail.com` | `12345678` | `/teacher/dashboard` |
| Student | `student1@gmail.com` | `12345678` | `/student/dashboard` |
| Parent | `suny@gmail.com` | `12345678` | `/parent/dashboard` |

All roles sign in from the same `/login` screen; the app redirects to the dashboard above based on the account's role.

---

## 🛡️ 1. Super Admin

Global authority over the entire platform — every center, account, and ledger.

### Dashboard
System-wide KPIs: total centers, students, teachers, parents, subjects, levels, center admins, and active users, plus revenue trend and student-distribution-by-center charts.

**How to use:** Log in as Super Admin → you land on **Dashboard** automatically.

![Super Admin Dashboard](docs/screenshots/super_admin-dashboard.png)

### Centers Management
Create, view, edit, and delete every learning center on the platform, and see each center's assigned admin and status at a glance.

**How to use:** Sidebar → **Centers** → **+ Add Center** to onboard a new branch, or use the eye/pencil/trash icons on a row to view, edit, or remove an existing one.

![Centers Management](docs/screenshots/super_admin-centers.png)

### Center Admin Accounts
Create new Center Admin user accounts, activate/deactivate them, and delete them.

**How to use:** Sidebar → **Center Admins** → create an account and assign it to a center; toggle the status switch to activate/deactivate.

![Center Admins](docs/screenshots/super_admin-center-admins.png)

### Students (All Centers)
Full CRUD on every student across every center, with a profile view that includes assignments, attendance, fees, and progress tabs.

**How to use:** Sidebar → **Students** → **Enroll New Student**, or open a row to view/edit a profile.

![Students Management](docs/screenshots/super_admin-students.png)

### Teachers (All Centers)
Create/edit/delete teachers, assign them to a center, and manage which students each teacher is responsible for.

**How to use:** Sidebar → **Teachers** → add a teacher and pick their center → **Manage Assignments** to assign/unassign students.

![Teachers Management](docs/screenshots/super_admin-teachers.png)

### Subjects
Define the subject catalog used across all centers and toggle subjects active/inactive.

**How to use:** Sidebar → **Subjects** → add a subject or toggle its active status.

![Subjects Management](docs/screenshots/super_admin-subjects.png)

### Levels
Define curriculum levels (e.g. grade/level bands) used to group worksheets and track student progression.

**How to use:** Sidebar → **Levels** → add, edit, or delete a level.

![Levels Management](docs/screenshots/super_admin-levels.png)

### Fees (All Centers)
Generate monthly invoices for every enrolled student, record payments, mark overdue invoices in bulk, and view paid/unpaid/overdue summaries.

**How to use:** Sidebar → **Fees** → **Generate Monthly Fees** to create the month's invoices, **Record Payment** on an unpaid invoice, or **Mark Overdue** to bulk-flag late ones.

![Fee Management](docs/screenshots/super_admin-fees.png)

### Parent Accounts
Create, edit, and delete parent user accounts and link them to their children.

**How to use:** Sidebar → **Parents** → add a parent account and link student(s).

![Parents Management](docs/screenshots/super_admin-parents.png)

### Reports
Full-system analytics: revenue/collection rate, average academic score, students-per-center, attendance rate, monthly collection summary, and student distribution by center.

**How to use:** Sidebar → **Reports** → switch between **System Overview** and **Efficiency Metrics**.

![System Reports](docs/screenshots/super_admin-reports.png)

### Also available
- **Profile** — view/edit own profile, change password.
- **Notifications** — bell icon in the top bar, shared across every role.

---

## 🏢 2. Center Admin

Runs the day-to-day of a single assigned center. Everything below is automatically scoped to that center.

### Dashboard
Center-specific KPIs (students, teachers, parents, revenue, attendance) for the admin's own branch only.

**How to use:** Log in as Center Admin → lands on **Dashboard**.

![Center Admin Dashboard](docs/screenshots/center_admin-dashboard.png)

### Students
Enroll, edit, and remove students within the center; open a student to see assignments, attendance, fees, and progress.

**How to use:** Sidebar → **Students** → **Enroll New Student**, or open a row to manage it.

![Center Admin Students](docs/screenshots/center_admin-students.png)

### Parents
Create/edit/delete parent accounts for the center and link them to their children.

**How to use:** Sidebar → **Parents** → add/edit/delete a parent account.

![Center Admin Parents](docs/screenshots/center_admin-parents.png)

### Teachers
Create/edit/delete teachers for the center and assign/unassign the students each teacher handles.

**How to use:** Sidebar → **Teachers** → add a teacher → **Manage Assignments** to set their student list.

![Center Admin Teachers](docs/screenshots/center_admin-teachers.png)

### Attendance (view)
Review attendance history and summary stats for the center (marking is done by teachers).

**How to use:** Sidebar → **Attendance** → browse the **History** tab and summary cards.

![Center Admin Attendance](docs/screenshots/center_admin-attendance.png)

### Fees
Generate monthly invoices, record payments, and mark overdue invoices — scoped to the center.

**How to use:** Sidebar → **Fees** → same workflow as Super Admin's Fee Management, limited to this center.

![Center Admin Fees](docs/screenshots/center_admin-fees.png)

### Reports
Detailed report for the center: financial summary, academic averages, attendance, and submission rates.

**How to use:** Sidebar → **Reports** → view the center's detailed report.

![Center Admin Reports](docs/screenshots/center_admin-reports.png)

### Also available
- **Profile** and **Notifications**, shared across roles.

---

## 👨‍🏫 3. Teacher

Owns the academic lifecycle for their assigned students.

### Dashboard
Teaching-focused KPIs: assigned students, pending submissions, worksheets published, attendance snapshot.

**How to use:** Log in as Teacher → lands on **Dashboard**.

![Teacher Dashboard](docs/screenshots/teacher-dashboard.png)

### My Students (view-only)
Browse the roster of students assigned to this teacher, with profile/assignments/attendance/progress tabs (fees tab hidden for teachers).

**How to use:** Sidebar → **My Students** → click a student to view their profile.

![My Students](docs/screenshots/teacher-my-students.png)

### Subjects / Levels (view-only)
Reference the active subject list and curriculum level structure while planning lessons.

**How to use:** Sidebar → **Subjects** or **Levels** to browse (read-only for teachers).

![Teacher Subjects](docs/screenshots/teacher-subjects.png)
![Teacher Levels](docs/screenshots/teacher-levels.png)

### Worksheets
Upload, edit, and delete curriculum worksheets that can later be assigned to students.

**How to use:** Sidebar → **Worksheets** → **Upload New Worksheet**.

![Worksheets](docs/screenshots/teacher-worksheets.png)

### Assignments
Bulk-assign an uploaded worksheet to selected students with a due date, and delete assignments.

**How to use:** Sidebar → **Assignments** → **+ Assign Worksheet** → pick students and a due date.

![Assignments](docs/screenshots/teacher-assignments.png)

### Grade Submissions
Review each student's uploaded submission and post a grade with feedback.

**How to use:** Sidebar → **Grade Submissions** → open a **Pending** item → enter grade/feedback and save (also browsable under the **Graded** tab).

![Grade Submissions](docs/screenshots/teacher-grade-submissions.png)

### Attendance
The only role that can mark daily attendance (bulk) for assigned students, plus browse history.

**How to use:** Sidebar → **Attendance** → **Mark Attendance** tab → check each student present/absent → save.

![Teacher Attendance](docs/screenshots/teacher-attendance.png)

### Also available
- **Profile** and **Notifications**, shared across roles.

---

## 🎓 4. Student

A read-mostly panel focused on the student's own academic activity.

### Dashboard
Personal KPIs: active assignments, submitted work, current grade/level, recent activity.

**How to use:** Log in as Student → lands on **Dashboard**.

![Student Dashboard](docs/screenshots/student-dashboard.png)

### My Assignments
View assigned worksheets, due dates, and submission status; download the worksheet and past submissions.

**How to use:** Sidebar → **My Assignments** → open an item to see details, or use **Download**.

![My Assignments](docs/screenshots/student-my-assignments.png)

### Submit Work
Upload completed work (PDF/JPG/PNG) against an open assignment, with optional notes.

**How to use:** Sidebar → **Submit Work** → **Select Assignment** → drag & drop the file → **Submit Assignment**.

![Submit Work](docs/screenshots/student-submit-work.png)

### My Progress
Read-only view of current curriculum level and progression over time.

**How to use:** Sidebar → **My Progress**.

![My Progress](docs/screenshots/student-my-progress.png)

### My Reports
Personal performance report (grades, completion rate, attendance).

**How to use:** Sidebar → **My Reports**.

![My Reports](docs/screenshots/student-my-reports.png)

### Also available
- **Profile** and **Notifications**, shared across roles.

---

## 👨‍👩‍👦 5. Parent

A read-only portal for monitoring one or more children.

### Dashboard
Overview of all linked children: active centers, tasks completed/pending, and a per-child summary card with grade, center, and recent assignments.

**How to use:** Log in as Parent → lands on **Dashboard**, showing a card for each child.

![Parent Dashboard](docs/screenshots/parent-dashboard.png)

### Child Progress
Progress/report view across all of the parent's children.

**How to use:** Sidebar → **Child Progress**.

![Child Progress](docs/screenshots/parent-child-progress.png)

### Assignments
View children's assignments and download the worksheet or their submitted work (parents cannot submit on a child's behalf).

**How to use:** Sidebar → **Assignments** → select a child's assignment to view/download.

![Parent Assignments](docs/screenshots/parent-assignments.png)

### Attendance
Read-only attendance history for each child.

**How to use:** Sidebar → **Attendance**.

![Parent Attendance](docs/screenshots/parent-attendance.png)

### Fees
View and download fee/invoice history for each child (view-only — no generate/record/mark-overdue actions, unlike admin roles).

**How to use:** Sidebar → **Fees** → **Download** a receipt for any invoice.

![Parent Fees](docs/screenshots/parent-fees.png)

### Also available
- **Profile** and **Notifications**, shared across roles.

---

## 🔑 Feature Access Matrix

| Entity | Super Admin | Center Admin | Teacher | Student | Parent |
|---|---|---|---|---|---|
| Centers | Create/Edit/Delete/View | — | — | — | — |
| Center Admin accounts | Create/Activate/Delete | — | — | — | — |
| Teachers | Full CRUD, any center | Full CRUD, own center | View own profile | — | View (read-only) |
| Students | Full CRUD, any center | Full CRUD, own center | View assigned students | Own profile only | View own children |
| Parent accounts | Full CRUD | Full CRUD, own center | — | — | Own profile only |
| Subjects | Create/Edit/Toggle | — | View only | — | — |
| Levels | Create/Edit/Delete | — | View only | — | — |
| Worksheets | — | — | Create/Edit/Delete | Download | Download |
| Assignments | — | — | Create/Delete | View + Submit | View (read-only) |
| Submissions | — | — | Grade/Edit grade | Create/Download own | Download child's |
| Attendance | View, all centers | View, own center | Mark + View, own students | — | View, own children |
| Fees/Billing | Generate/Record/Edit, any center | Generate/Record/Edit, own center | — | — | View/Download only |
| Reports | Full-system | Center-detailed | — | Own report | Children's reports |
| Notifications | ✅ | ✅ | ✅ | ✅ | ✅ |
| Profile | ✅ | ✅ | ✅ | ✅ | ✅ |

> Note for contributors: the backend returns the role string `"parent"`, but the frontend normalizes it to `"parents"` (plural) everywhere — routes, sidebar keys, and role checks. See `src/store/authStore.js`.

---

## 📖 User Stories

### Super Admin
- As a Super Admin, I want to create and manage centers so that new branches can be onboarded onto the platform.
- As a Super Admin, I want to create Center Admin accounts so that each center has someone to run its daily operations.
- As a Super Admin, I want to view a full-system report so that I can see revenue, attendance, and academic performance across all centers.
- As a Super Admin, I want to manage subjects and curriculum levels centrally so that all centers follow a consistent curriculum structure.
- As a Super Admin, I want to view and manage every student, teacher, and parent account across all centers so that I can resolve issues without depending on center staff.

### Center Admin
- As a Center Admin, I want to enroll students and link them to parents so that my center's roster is accurate and families can monitor progress.
- As a Center Admin, I want to create teacher accounts and assign students to them so that every student has a responsible teacher.
- As a Center Admin, I want to generate monthly fee invoices and record payments so that I can track my center's billing cycle.
- As a Center Admin, I want to view my center's detailed report so that I can identify students or classes that need support.

### Teacher
- As a Teacher, I want to upload worksheets and assign them to my students so that they have clear, trackable coursework.
- As a Teacher, I want to review and grade student submissions so that students get timely feedback on their work.
- As a Teacher, I want to mark daily attendance for my students so that the center has an accurate attendance record.
- As a Teacher, I want to view my students' progress and curriculum level so that I can tailor instruction to their needs.

### Student
- As a Student, I want to see my active assignments and due dates so that I don't miss deadlines.
- As a Student, I want to download a worksheet and upload my completed work so that my teacher can grade it.
- As a Student, I want to view my grades and progress so that I understand how I'm performing.

### Parent
- As a Parent, I want to see all of my children's progress in one dashboard so that I don't have to log into multiple places.
- As a Parent, I want to view my children's assignments and attendance so that I can support their learning at home.
- As a Parent, I want to view and download fee invoices/receipts so that I can keep track of payments.
- As a Parent, I want to receive notifications about my children's academic activity so that I stay informed without constantly checking the app.

---

## ✅ Requirements (derived from the User Stories)

### Functional Requirements (FR)

| ID | Requirement | Primary Role(s) |
|---|---|---|
| FR-1 | The system shall allow authentication via email/password and route the user to a role-specific dashboard. | All |
| FR-2 | The system shall allow Super Admin to create, update, view, and delete Centers. | Super Admin |
| FR-3 | The system shall allow Super Admin to create, activate/deactivate, and delete Center Admin accounts. | Super Admin |
| FR-4 | The system shall allow Super Admin and Center Admin to create, update, view, and delete Student records, scoped to all centers (Super Admin) or one center (Center Admin). | Super Admin, Center Admin |
| FR-5 | The system shall allow Super Admin and Center Admin to create, update, and delete Teacher accounts and assign/unassign students to a teacher. | Super Admin, Center Admin |
| FR-6 | The system shall allow Super Admin and Center Admin to create, update, and delete Parent accounts and link them to one or more students. | Super Admin, Center Admin |
| FR-7 | The system shall allow Super Admin to create, update, and toggle the active status of Subjects. | Super Admin |
| FR-8 | The system shall allow Super Admin to create, update, and delete curriculum Levels. | Super Admin |
| FR-9 | The system shall allow Teachers to upload, update, and delete Worksheets. | Teacher |
| FR-10 | The system shall allow Teachers to assign a Worksheet to one or more Students with a due date, and delete Assignments. | Teacher |
| FR-11 | The system shall allow Students to view assigned work, download worksheets, and upload a Submission file against an Assignment. | Student |
| FR-12 | The system shall allow Teachers to view pending Submissions, assign a grade/score, and attach feedback. | Teacher |
| FR-13 | The system shall allow Teachers to mark daily Attendance (present/absent) in bulk for their assigned students. | Teacher |
| FR-14 | The system shall allow Center Admin, Super Admin, and Parent to view Attendance history and summary statistics, scoped to their center/children. | Center Admin, Super Admin, Parent |
| FR-15 | The system shall allow Super Admin and Center Admin to generate monthly Fee invoices for enrolled students, record payments, and mark invoices overdue. | Super Admin, Center Admin |
| FR-16 | The system shall allow Parents to view and download Fee invoices/receipts for their children (read-only). | Parent |
| FR-17 | The system shall provide Super Admin with a full-system Report (revenue, collection rate, academic score, attendance, student distribution). | Super Admin |
| FR-18 | The system shall provide Center Admin with a detailed Report scoped to their center. | Center Admin |
| FR-19 | The system shall provide Students and Parents with a personal/children's progress and performance Report. | Student, Parent |
| FR-20 | The system shall notify users (via an in-app notification center) of relevant academic and billing events. | All |
| FR-21 | The system shall allow every authenticated user to view and update their own profile and change their password. | All |
| FR-22 | The system shall restrict every page and action to the roles authorized for it, redirecting unauthorized access attempts to the user's own dashboard. | All |

### Non-Functional Requirements (NFR)

| ID | Requirement | Category |
|---|---|---|
| NFR-1 | The system shall authenticate requests using JWT tokens and reject expired/invalid tokens. | Security |
| NFR-2 | The system shall enforce role-based access control on both the frontend routes and the backend API, not the UI alone. | Security |
| NFR-3 | The system shall scope all data queries (students, fees, attendance, reports) to the requesting user's center/children/class so that no cross-tenant data is exposed. | Security / Multi-tenancy |
| NFR-4 | The system shall validate all form input client-side (via schema validation) before submission to reduce invalid API calls. | Reliability |
| NFR-5 | Core dashboard and list pages shall load within 2 seconds under normal network conditions. | Performance |
| NFR-6 | File uploads (worksheets, submissions, profile photos) shall be limited in size (e.g. 10MB) and restricted to safe file types (PDF/JPG/PNG). | Security / Reliability |
| NFR-7 | The UI shall be responsive and usable on both desktop and tablet viewports, since parents and students may access it on mobile devices. | Usability |
| NFR-8 | The system shall present clear, actionable error messages (e.g. invalid credentials, validation errors) rather than raw API errors. | Usability |
| NFR-9 | The system shall maintain an audit-friendly data trail for financial actions (who recorded a payment, when an invoice was generated). | Auditability |
| NFR-10 | The frontend build shall be deployable as a static bundle (Vite production build) independent of the backend, configured via environment variables. | Maintainability / Deployability |
| NFR-11 | The system shall degrade gracefully with clear empty/loading states when a role has no data yet (e.g. "No pending assignments", "All caught up!"). | Usability |

---

## 🔄 Core Working Process

### Phase 1 — Infrastructure & Enrollment
1. **Super Admin** creates a new **Center** and its **Center Admin**.
2. **Center Admin** enrolls **Teachers**, **Students**, and links **Parents** to their children.

### Phase 2 — Academic Engagement
1. **Teachers** upload curriculum-based **Worksheets** and assign them to students.
2. **Students** download the material and upload their completed **Submissions**.
3. **Teachers** grade submissions; student **Progress** updates accordingly.

### Phase 3 — Financial Management
1. **Center Admins** (or Super Admin) run **Generate Monthly Fees** to create invoices for all enrolled students.
2. **Parents** view pending fees and make payment outside the system.
3. **Admins** record the payment (**Record Payment**) and update invoice status.

### Phase 4 — Analytics & Optimization
1. Admins and teachers use **Report** modules to spot students/centers needing support.
2. Metrics like Submission Rate, Attendance Rate, and Collection Efficiency guide program improvements.

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v16+)
- NPM or Yarn
- A running instance of the backend API

### Installation
1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file based on `.env.example` and configure `VITE_API_BASE_URL`.
4. Run the development server:
   ```bash
   npm run dev
   ```

### Deployment
Build for production:
```bash
npm run build
```
