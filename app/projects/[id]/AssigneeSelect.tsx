"use client";

import { Project, User } from "@prisma/client";
import toast, { Toaster } from "react-hot-toast";

import { Select } from "@radix-ui/themes";
import { Skeleton } from "@/app/components";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";

const AssigneeSelect = ({ project }: { project: Project }) => {
  const { data: users, error, isLoading } = useUsers();

  if (error) {
    return null;
  }

  if (isLoading) {
    return <Skeleton />;
  }

  const assignProject = (userId: string) => {
    axios
      .patch(`/api/projects/${project.id}`, {
        assignedToUserId: userId || null,
      })
      .catch(() => {
        toast.error("Changes could not be saved");
      });
  };

  return (
    <>
      <Select.Root
        defaultValue={project.assignedToUserId || ""}
        onValueChange={assignProject}
      >
        <Select.Trigger placeholder="Assign..." />

        <Select.Content>
          <Select.Group>
            <Select.Label>Suggestions</Select.Label>

            <Select.Item value="">Unassigned</Select.Item>

            {users?.map((user) => (
              <Select.Item key={user.id} value={user.id}>
                {user.name}
              </Select.Item>
            ))}
          </Select.Group>
        </Select.Content>
      </Select.Root>

      <Toaster />
    </>
  );
};

const useUsers = () =>
  useQuery<User[]>({
    queryKey: ["users"],
    queryFn: () => axios.get("/api/users").then((res) => res.data),
    staleTime: 60 * 1000, // 60s
    retry: 3,
  });

export default AssigneeSelect;
