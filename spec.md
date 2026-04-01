# LearnFlow E-Learning Platform

## Current State
New project with empty backend and no frontend implemented.

## Requested Changes (Diff)

### Add
- User authentication and role-based access (student / instructor / admin)
- Course catalog with categories, search, and filtering
- Course detail page with curriculum/syllabus outline
- Video lesson player with progress tracking
- Quiz/assessment system with multiple choice questions
- Student dashboard showing enrolled courses, progress, and achievements
- Instructor dashboard to create/manage courses and lessons
- Enrollment system (enroll/unenroll)
- Lesson completion marking
- Course rating and review system

### Modify
- N/A (new project)

### Remove
- N/A (new project)

## Implementation Plan
1. Select authorization component for role-based access
2. Generate Motoko backend with courses, lessons, enrollments, quizzes, reviews data models and APIs
3. Build React frontend with:
   - Landing/home page with featured courses
   - Course catalog with search and category filter
   - Course detail page
   - Lesson viewer with video embed and progress
   - Quiz page
   - Student dashboard
   - Instructor course management
   - Auth-gated routes
