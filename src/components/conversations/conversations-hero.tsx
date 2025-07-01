import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ConversationsHeroProp {
  name?: string;
  image?: string;
}

function ConversationsHero(props: Readonly<ConversationsHeroProp>) {
  const { name = "Member", image } = props;
  const avatarFallbackContent = name.charAt(0).toUpperCase();

  return (
    <div className="mt-[88px] mx-5 mb-4">
      <div className="flex items-center gap-x-1 mb-2 ">
        <Avatar className="size-14 mr-2 bg-sky-500">
          <AvatarImage src={image} />
          <AvatarFallback className="bg-sky-500 text-white text-lg">
            {avatarFallbackContent}
          </AvatarFallback>
        </Avatar>
        <p className="text-2xl font-bold flex items-center mb-2">{name}</p>
      </div>
      <p className="font-normal text-slate-800 mb-4">
        This conversation is just between you and <strong>{name}</strong>
      </p>
    </div>
  );
}

export default ConversationsHero;
