import * as Dialog from "@radix-ui/react-dialog";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { X } from "lucide-react";

interface NoteCardProps {
  note: {
    id: string;
    date: Date;
    content: string;
  };
  onNoteDeleted: (id: string) => void;
}

export function NoteCard({ note, onNoteDeleted }: NoteCardProps) {
  return (
    <Dialog.Root>
      <Dialog.Trigger className="rounded-md text-left flex flex-col bg-fuchsia-100 p-5 gap-3 overflow-hidden relative hover:ring-2 hover:ring-fuchsia-100">
        <span className="text-sm text-fuchsia-800 font-medium ">
          {formatDistanceToNow(note.date, { locale: ptBR, addSuffix: true })}
        </span>
        <p className="text-sm text-slate-600 leading-6">{note.content}</p>

        <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black/40 to-black/0 pointer-events-none" />
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="inset-0 fixed bg-black/50" />
        <Dialog.Content className="inset-0 md:inset-auto overflow-hidden fixed md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:rounded-md flex flex-col bg-fuchsia-100 w-full md:max-w-[640px] md:h-[68vh] outline-none">
          <Dialog.Close className="absolute right-0 top-0 bg-fuchsia-100 p-[6px] text-fuchsia-800 hover:text-red-500">
            <X className="size-5" />
          </Dialog.Close>

          <div className="flex flex-1 flex-col p-5 gap-3 bg-fuchsia-100">
            <span className="text-sm text-fuchsia-800 font-medium ">
              {formatDistanceToNow(note.date, {
                locale: ptBR,
                addSuffix: true,
              })}
            </span>
            <p className="text-sm text-slate-600 leading-6">{note.content}</p>
          </div>

          <button
            onClick={() => onNoteDeleted(note.id)}
            type="button"
            className="w-full bg-fuchsia-800 py-4 text-center text-fuchsia-100 outline-none text-sm font-medium group "
          >
            Deseja{" "}
            <span className="text-fuchsia-100 group-hover:text-red-500 group-hover:underline">
              apagar esta nota
            </span>
            ?
          </button>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
