/* eslint-disable @next/next/no-img-element */

import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

interface ThumbnailProps {
  url?: string | null;
}

function Thumbnail(props: Readonly<ThumbnailProps>) {
  const { url } = props;
  return (
    url && (
      <Dialog>
        <DialogTrigger>
          <div className="relative overflow-hidden max-w-[360px] border rounded-lg my-2 cursor-zoom-in">
            <img
              src={url}
              alt="message"
              className="rounded-md object-cover size-full"
            />
          </div>
        </DialogTrigger>
        <DialogContent className="max-w-[800px] border-none bg-transparent p-0 shadow-none [&>button]:hidden">
          <img
            src={url}
            alt="message"
            className="rounded-md object-cover size-full"
          />
        </DialogContent>
      </Dialog>
    )
  );
}

export default Thumbnail;
