"use client";

import { AlertDialog, Button, Flex } from "@radix-ui/themes";

import { Spinner } from "@/app/components";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface Props {
  projectId: number;
}

const DeleteProjectButton = ({ projectId }: Props) => {
  const router = useRouter();

  const [error, setError] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const deleteProject = async () => {
    try {
      setIsDeleting(true);
      await axios.delete(`/api/projects/${projectId}`);
      router.push("/projects/list");
      router.refresh();
    } catch (error) {
      setError(true);
      setIsDeleting(false);
    }
  };

  return (
    <>
      <AlertDialog.Root>
        <AlertDialog.Trigger>
          <Button color="red" disabled={isDeleting}>
            Delete Project
            {isDeleting && <Spinner />}
          </Button>
        </AlertDialog.Trigger>

        <AlertDialog.Content>
          <AlertDialog.Title>Confirm Deletion</AlertDialog.Title>

          <AlertDialog.Description>
            Are you sure you want to delete this project ? This action cannot be
            undone.
          </AlertDialog.Description>

          <Flex mt="4" gap="3">
            <AlertDialog.Cancel>
              <Button variant="soft" color="gray">
                Cancel
              </Button>
            </AlertDialog.Cancel>

            <AlertDialog.Action>
              <Button color="red" onClick={deleteProject}>
                Delete Project
              </Button>
            </AlertDialog.Action>
          </Flex>
        </AlertDialog.Content>
      </AlertDialog.Root>

      <AlertDialog.Root open={error}>
        <AlertDialog.Content>
          <AlertDialog.Title>Error</AlertDialog.Title>
          <AlertDialog.Description>
            This project could not be deleted
          </AlertDialog.Description>
          <Button
            color="gray"
            variant="soft"
            mt="2"
            onClick={() => setError(false)}
          >
            OK
          </Button>
        </AlertDialog.Content>
      </AlertDialog.Root>
    </>
  );
};

export default DeleteProjectButton;
