import { format } from "date-fns";

interface ChannelMessagesHeroProps {
  name: string;
  creationTime: number;
}

function ChannelMessagesHero(props: Readonly<ChannelMessagesHeroProps>) {
  const { name, creationTime } = props;
  return (
    <div className="mt-[88px] mx-5 mb-4">
      <p className="text-2xl font-bold flex items-center mb-2"># {name}</p>
      <p className="font-normal text-slate-800 mb-4">
        The <strong>{name}</strong> channel was created on{" "}
        {format(creationTime, "MMMM do, yyyy")}. Send messages to start your
        discussions.
      </p>
    </div>
  );
}

export default ChannelMessagesHero;
