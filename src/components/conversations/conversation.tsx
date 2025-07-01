import { Id } from "../../../convex/_generated/dataModel";

interface ConversationProps {
  id: Id<"conversations">;
}

function Conversation(props: Readonly<ConversationProps>) {
  const { id } = props;

  return <div></div>;
}

export default Conversation;
