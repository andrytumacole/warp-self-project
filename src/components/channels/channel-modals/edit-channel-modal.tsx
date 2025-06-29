import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { Id } from "../../../../convex/_generated/dataModel";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface EditChannelModalProp {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  initialChannelName: string;
  setChannelName: (val: string) => void;
  channelId: Id<"channels">;
}

function EditChannelModal(props: Readonly<EditChannelModalProp>) {
  const { isOpen, setIsOpen, initialChannelName, setChannelName, channelId } =
    props;
  const [editedChannelName, setEditedChannelName] =
    useState(initialChannelName);

  useEffect(() => {
    setEditedChannelName(initialChannelName);
  }, [setEditedChannelName, initialChannelName, isOpen]);

  function handleInputChange(e: ChangeEvent<HTMLInputElement>) {
    const parsedValue = e.target.value.replace(/\s+/g, "-").toLowerCase();
    setEditedChannelName(parsedValue);
  }

  async function handleEdit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setChannelName(editedChannelName);
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <div className="px-5 py-4 bg-white rounded-lg cursor-pointer border hover:bg-gray-50">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold">Channel name</p>
            <p className="text-sm text-[#1264a3] hover:underline font-semibold">
              Edit
            </p>
          </div>
          <p className="text-sm"># {initialChannelName}</p>
        </div>
      </DialogTrigger>
      <DialogContent className="[&>button]:hidden">
        <DialogHeader>
          <DialogTitle>Rename this channel</DialogTitle>
        </DialogHeader>
        <form className="space-y-4" onSubmit={handleEdit}>
          <Input
            value={editedChannelName}
            onChange={handleInputChange}
            required
            autoFocus
            minLength={3}
            maxLength={80}
            placeholder={`Channel name e.g. "new-channel", "admin", "welcome"`}
          />
          <DialogFooter>
            <Button>Save</Button>
            <DialogClose asChild>
              <Button variant={"destructive"}>Cancel</Button>
            </DialogClose>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default EditChannelModal;
