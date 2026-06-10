import { createActor } from "@/backend";
import type {
  AttendanceEntry,
  AttendanceStatus,
  ClassInput,
  StudentInput,
  TeacherInput,
} from "@/backend";
import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

function useActorBase() {
  return useActor(createActor);
}

export function useTeacherProfile() {
  const { actor, isFetching } = useActorBase();
  return useQuery({
    queryKey: ["teacherProfile"],
    queryFn: async () => {
      if (!actor) return null;
      const result = await actor.getTeacherProfile();
      return result;
    },
    enabled: !!actor && !isFetching,
  });
}

export function useMyClasses() {
  const { actor, isFetching } = useActorBase();
  return useQuery({
    queryKey: ["myClasses"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMyClasses();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useClassStudents(classId: string) {
  const { actor, isFetching } = useActorBase();
  return useQuery({
    queryKey: ["classStudents", classId],
    queryFn: async () => {
      if (!actor || !classId) return [];
      return actor.getClassStudents(classId);
    },
    enabled: !!actor && !isFetching && !!classId,
  });
}

export function useAttendanceByClassAndDate(classId: string, date: string) {
  const { actor, isFetching } = useActorBase();
  return useQuery({
    queryKey: ["attendance", classId, date],
    queryFn: async () => {
      if (!actor || !classId || !date) return [];
      return actor.getAttendanceByClassAndDate(classId, date);
    },
    enabled: !!actor && !isFetching && !!classId && !!date,
  });
}

export function useStudentAttendance(
  studentId: string,
  startDate: string,
  endDate: string,
) {
  const { actor, isFetching } = useActorBase();
  return useQuery({
    queryKey: ["studentAttendance", studentId, startDate, endDate],
    queryFn: async () => {
      if (!actor || !studentId) return [];
      return actor.getStudentAttendance(studentId, startDate, endDate);
    },
    enabled: !!actor && !isFetching && !!studentId,
  });
}

export function useDashboardStats() {
  const { actor, isFetching } = useActorBase();
  return useQuery({
    queryKey: ["dashboardStats"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getDashboardStats();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useDeleteStudent() {
  const { actor } = useActorBase();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      studentId,
      classId,
    }: { studentId: string; classId: string }) => {
      if (!actor) throw new Error("Actor not ready");
      await actor.deleteStudent(studentId);
      return { studentId, classId };
    },
    onSuccess: (_data, vars) => {
      queryClient.invalidateQueries({
        queryKey: ["classStudents", vars.classId],
      });
      queryClient.invalidateQueries({ queryKey: ["dashboardStats"] });
    },
  });
}

export function useDeleteClass() {
  const { actor } = useActorBase();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (classId: string) => {
      if (!actor) throw new Error("Actor not ready");
      await actor.deleteClass(classId);
      return classId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myClasses"] });
      queryClient.invalidateQueries({ queryKey: ["dashboardStats"] });
    },
  });
}

export function useUpdateClass() {
  const { actor } = useActorBase();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      classId,
      input,
    }: { classId: string; input: ClassInput }) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.updateClass(classId, input);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myClasses"] });
    },
  });
}

export function useUpdateStudent() {
  const { actor } = useActorBase();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      studentId,
      input,
    }: { studentId: string; input: StudentInput }) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.updateStudent(studentId, input);
    },
    onSuccess: (_data, vars) => {
      queryClient.invalidateQueries({ queryKey: ["classStudents"] });
      queryClient.invalidateQueries({
        queryKey: ["studentAttendance", vars.studentId],
      });
    },
  });
}

export function useEditAttendanceRecord() {
  const { actor } = useActorBase();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      recordId,
      status,
      note,
    }: {
      recordId: string;
      status: AttendanceStatus;
      note: string | null;
    }) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.editAttendanceRecord(recordId, status, note);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["attendance"] });
    },
  });
}

export function useCreateTeacherProfile() {
  const { actor } = useActorBase();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: TeacherInput) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.createTeacherProfile(input);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teacherProfile"] });
    },
  });
}

export function useUpdateTeacherProfile() {
  const { actor } = useActorBase();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: TeacherInput) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.updateTeacherProfile(input);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teacherProfile"] });
    },
  });
}

export function useCreateClass() {
  const { actor } = useActorBase();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: ClassInput) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.createClass(input);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myClasses"] });
    },
  });
}

export function useRegisterStudent() {
  const { actor } = useActorBase();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: StudentInput) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.registerStudent(input);
    },
    onSuccess: (_data, vars) => {
      queryClient.invalidateQueries({
        queryKey: ["classStudents", vars.classId],
      });
    },
  });
}

export function useMarkAttendance() {
  const { actor } = useActorBase();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      classId,
      date,
      entries,
    }: {
      classId: string;
      date: string;
      entries: AttendanceEntry[];
    }) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.markAttendance(classId, date, entries);
    },
    onSuccess: (_data, vars) => {
      queryClient.invalidateQueries({
        queryKey: ["attendance", vars.classId, vars.date],
      });
      queryClient.invalidateQueries({ queryKey: ["dashboardStats"] });
    },
  });
}

export function useGenerateStudentReport() {
  const { actor } = useActorBase();
  return useMutation({
    mutationFn: async ({
      studentId,
      startDate,
      endDate,
    }: {
      studentId: string;
      startDate: string;
      endDate: string;
    }) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.generateStudentReport(studentId, startDate, endDate);
    },
  });
}

export function useGenerateClassReport() {
  const { actor } = useActorBase();
  return useMutation({
    mutationFn: async ({
      classId,
      startDate,
      endDate,
    }: {
      classId: string;
      startDate: string;
      endDate: string;
    }) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.generateClassReport(classId, startDate, endDate);
    },
  });
}

export function useSendParentNotification() {
  const { actor } = useActorBase();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      studentId,
      message,
    }: {
      studentId: string;
      message: string;
    }) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.sendParentNotification(studentId, message);
    },
    onSuccess: (_data, vars) => {
      queryClient.invalidateQueries({
        queryKey: ["notificationLog", vars.studentId],
      });
    },
  });
}

export function useNotificationLog(studentId: string) {
  const { actor, isFetching } = useActorBase();
  return useQuery({
    queryKey: ["notificationLog", studentId],
    queryFn: async () => {
      if (!actor || !studentId) return [];
      return actor.getNotificationLog(studentId);
    },
    enabled: !!actor && !isFetching && !!studentId,
  });
}
