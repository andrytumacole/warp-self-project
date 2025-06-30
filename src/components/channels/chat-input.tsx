import { useCreateMessage } from "@/api/messages/use-create-message";
import useGetChannelId from "@/hooks/use-get-channel-id";
import useGetWorkspaceId from "@/hooks/use-get-workspace-id";
import dynamic from "next/dynamic";
import Quill from "quill";
import { useRef, useState } from "react";

import { toast } from "sonner";

const Editor = dynamic(() => import("../input/editor"), { ssr: false });

interface ChatInputProps {
  placeholder: string;
}

interface SubmitType {
  body: string;
  image: File | null;
}

function ChatInput(props: Readonly<ChatInputProps>) {
  const { placeholder } = props;
  const workspaceId = useGetWorkspaceId();
  const channelId = useGetChannelId();
  const {
    data,
    mutateAsync,
    isPending: isCreatingMessage,
    error,
  } = useCreateMessage({
    onError: handleMessageError,
    onSuccess: handleMessageSuccess,
    onSettled: handleMessageSettled,
  });

  const editorRef = useRef<Quill | null>(null);

  //dirty trick that destroys old editor and rerenders a new one with a new key
  const [editorKey, setEditorKey] = useState(0);
  const [isChatPending, setIsChatPending] = useState(false);

  function handleMessageError() {
    toast.error("Something went wrong in sending the message");
    console.log("error: ", error);
  }

  function handleMessageSuccess() {
    setEditorKey((e) => e + 1);
  }

  function handleMessageSettled() {
    setIsChatPending(false);
  }

  async function handleSubmit(submitData: SubmitType) {
    console.log(submitData);
    setIsChatPending(true);
    await mutateAsync({
      workspaceId: workspaceId,
      channelId: channelId,
      body: submitData.body,
    });
  }

  return (
    <div className="px-5 w-full">
      <Editor
        key={editorKey}
        variant="create"
        onSubmit={handleSubmit}
        disabled={isChatPending}
        innerRef={editorRef}
        placeholder={placeholder}
      />
    </div>
  );
}

export default ChatInput;
