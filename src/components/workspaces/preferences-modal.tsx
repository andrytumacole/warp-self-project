import { useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { TrashIcon } from "lucide-react";
import { toast } from "sonner";
import useUpdateWorkspace from "@/app/api/use-update-workspace";
import useRemoveWorkspace from "@/app/api/use-delete-workspace";

interface PreferencesModalProp {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  initialVal: string;
}

function PreferencesModal(props: Readonly<PreferencesModalProp>) {
  const { isOpen, setIsOpen, initialVal } = props;
  const [value, setValue] = useState(initialVal);
  const {
    mutateAsync: update,
    isPending: isUpdatingWorkspace,
    error: updateError,
  } = useUpdateWorkspace({
    onSuccess: handleUpdateSuccess,
    onError: handleUpdateError,
    onSettled: handleUpdateSettled,
  });
  const {
    mutateAsync: remove,
    isPending: isRemovingWorkspace,
    error: deleteError,
  } = useRemoveWorkspace({
    onSuccess: handleDeleteSuccess,
    onError: handleDeleteError,
    onSettled: handleDeleteSettled,
  });

  function handleUpdateSuccess() {
    console.log("successfully created workspace");
    toast("Successfully updated workspace!", {
      description: initialVal,
    });
  }

  function handleUpdateError() {
    console.log("Something went wrong in updating the workspace");
    console.log("error: " + updateError);
  }

  function handleUpdateSettled() {
    console.log("Finished updating!");
    setIsOpen(false);
  }

  function handleDeleteSuccess() {
    console.log("successfully deleted workspace");
    toast("Successfully deleted workspace!", {
      description: initialVal,
    });
  }

  function handleDeleteError() {
    console.log("Something went wrong in deleting the workspace");
    console.log("error: " + deleteError);
  }

  function handleDeleteSettled() {
    console.log("Finished deleting!");
    setIsOpen(false);
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="p-0 bg-gray-100 overflow-hidden [&>button]:hidden">
        <DialogHeader className="p-4 border-b bg-white">
          <DialogTitle>{value}</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </DialogDescription>
        </DialogHeader>
        <div className="px-4 pb-4 flex flex-col gap-y-2">
          <div className="px-5 py-4 bg-white rounded-lg border cursor-pointer hover:bg-gray-100">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold">Workspace name</p>
              <p className="text-sm text-[#1264a3] hover:underline font-semibold">
                Edit
              </p>
            </div>
            <p className="text-sm">{value}</p>
          </div>
          <button
            onClick={() => {}}
            className="flex items-center gap-x-2 px-5 py-4 bg-white rounded-lg cursor-pointer border hover:bg-gray-50 text-rose-600"
          >
            <TrashIcon className="size-4" />
            <p className="text-sm font-semibold">Delete workspace</p>
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default PreferencesModal;
