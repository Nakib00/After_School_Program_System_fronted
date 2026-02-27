# After School Program System (ZAN LMS)

A state-of-the-art, multi-tenant Education Management System (EMS) specifically designed for after-school programs. Built with a robust React/Vite frontend and a secure Laravel API, the system provides a seamless experience for administrators, educators, parents, and students.

## 🌟 Overview

ZAN LMS centralizes all aspects of educational management, from financial operations and center-wide analytics to individual student progress tracking. It offers a premium, data-driven interface that empowers stakeholders to make informed decisions and improve educational outcomes.

## 🧪 Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS (Vanilla CSS for custom components)
- **State Management**: Zustand (Auth, Notifications)
- **Forms & Validation**: React Hook Form, Zod
- **Networking**: Axios (JWT-based authentication)
- **Icons**: Lucide React
- **Notifications**: React Hot Toast

## 👥 User Roles & Permissions

### 1. 🛡️ Super Admin (System Owner)

_Global authority over the entire platform._

- **Center Management**: Create, update, and monitor all learning centers.
- **Financial Audit**: Access global revenue reports and unpaid fee summaries across all centers.
- **System Analysis**: View "Full System Reports" encompassing all centers, students, and teachers.
- **User Management**: oversees Center Admin accounts.

### 2. 🏢 Center Admin (Branch Manager)

_Responsible for the daily operations of a specific center._

- **Onboarding**: Manages Teachers, Students, and Parents within their center.
- **Fee Management**: Generates monthly fee invoices, updates payment records, and tracks overdue payments.
- **Center Reports**: Accesses "Detailed Center Reports" covering financial summary, academic score averages, and operational health.
- **Monitoring**: Tracks center-wide attendance and submission rates.

### 3. 👨‍🏫 Teacher (Educational Lead)

_Manages the academic lifecycle._

- **Assignment System**: Creates and publishes assignments with downloadable worksheets.
- **Grading & Feedback**: Reviews student submissions, assigns scores, and provides textual feedback.
- **Attendance**: Marks daily attendance for assigned students.
- **Student Progress**: Monitors individual student levels and progression through the curriculum.

### 4. 👨‍👩‍👦 Parent (Subscriber)

_Monitors child performance and handles financial obligations._

- **Child Overview**: Tracks multiple children's progress, attendance, and assignment status.
- **Payment Portal**: Views monthly fee records and manages payments.
- **Dashboard**: Accesses a personalized dashboard summarizing academic stats for their children.

### 5. 🎓 Student (Learner)

_The core participant in the learning process._

- **My Assignments**: Views active assignments, downloads worksheets, and tracks deadlines.
- **Submissions**: Uploads completed work for teacher review.
- **Progress Tracking**: Monitors their current level, scores, and academic history.

## 🔄 Core Working Process

### Phase 1: Infrastructure & Enrollment

1. **Super Admin** initializes a new **Center** and sets up the **Center Admin**.
2. **Center Admin** enrolls **Teachers**, **Students**, and links **Parents** to their children.

### Phase 2: Academic Engagement

1. **Teachers** upload curriculum-based **Worksheets** and assign them to specific **Levels** or students.
2. **Students** log in to their panel, download the material, and upload their completed **Submissions**.
3. **Teachers** receive submissions, grade them, and the **Student Progress** is automatically updated.

### Phase 3: Financial Management

1. At the beginning of each billing cycle, **Center Admins** use the **Fee Generation** tool to create monthly invoices for all enrolled students.
2. **Parents** are notified of the pending fees.
3. Once payments are handled, **Center Admins** update the fee status and record transaction details (Method, ID, Date).

### Phase 4: Analytics & Optimization

1. **Admins** and **Teachers** use specialized **Report Modules** to identify students or centers that need additional support.
2. Metrics like **Submission Rate**, **Attendance Rate**, and **Collection Efficiency** are used to optimize program performance.

## 🚀 Getting Started

### Prerequisites

- Node.js (v16+)
- NPM or Yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file based on `.env.example` and configure your `VITE_API_BASE_URL`.
4. Run the development server:
   ```bash
   npm run dev
   ```

### Deployment

Build for production:

```bash
npm run build
```
