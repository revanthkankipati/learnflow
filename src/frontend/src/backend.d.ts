import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface CourseInput {
    difficultyLevel: string;
    title: string;
    thumbnailUrl: string;
    tags: Array<string>;
    description: string;
    durationMinutes: bigint;
    category: string;
    price: bigint;
    instructorName: string;
}
export interface Course {
    id: bigint;
    difficultyLevel: string;
    title: string;
    thumbnailUrl: string;
    tags: Array<string>;
    description: string;
    lessonIds: Array<bigint>;
    durationMinutes: bigint;
    category: string;
    price: bigint;
    instructorName: string;
}
export type Time = bigint;
export interface Lesson {
    id: bigint;
    title: string;
    description: string;
    durationMinutes: bigint;
    videoUrl: string;
    courseId: bigint;
    orderIndex: bigint;
}
export interface EnrollmentInput {
    courseId: bigint;
}
export interface QuizQuestion {
    answerOptions: Array<string>;
    questionText: string;
    correctAnswerIndex: bigint;
}
export interface LessonInput {
    title: string;
    description: string;
    durationMinutes: bigint;
    videoUrl: string;
    courseId: bigint;
    orderIndex: bigint;
}
export interface Enrollment {
    completionPercentage: bigint;
    completedLessons: Array<bigint>;
    student: Principal;
    enrollmentDate: Time;
    courseId: bigint;
}
export interface QuizSubmissionInput {
    answers: Array<bigint>;
    courseId: bigint;
}
export interface Review {
    reviewText: string;
    student: Principal;
    rating: bigint;
    courseId: bigint;
}
export interface QuizSubmission {
    answers: Array<bigint>;
    score: bigint;
    student: Principal;
    courseId: bigint;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addQuizQuestions(courseId: bigint, questions: Array<QuizQuestion>): Promise<void>;
    addReview(courseId: bigint, rating: bigint, reviewText: string): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createCourse(input: CourseInput): Promise<bigint>;
    createLesson(input: LessonInput): Promise<bigint>;
    enrollInCourse(input: EnrollmentInput): Promise<void>;
    getAllCourses(): Promise<Array<Course>>;
    getCallerUserRole(): Promise<UserRole>;
    getCourse(courseId: bigint): Promise<Course>;
    getCourseReviews(courseId: bigint): Promise<Array<Review>>;
    getCoursesByCategory(category: string): Promise<Array<Course>>;
    getCoursesSortedByPrice(): Promise<Array<Course>>;
    getLesson(lessonId: bigint): Promise<Lesson>;
    getMyEnrollments(): Promise<Array<Enrollment>>;
    getMyQuizResults(): Promise<Array<QuizSubmission>>;
    isCallerAdmin(): Promise<boolean>;
    markLessonComplete(courseId: bigint, lessonId: bigint): Promise<void>;
    submitQuiz(input: QuizSubmissionInput): Promise<bigint>;
}
