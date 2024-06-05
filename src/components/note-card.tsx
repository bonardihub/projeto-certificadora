import { doc, getDoc } from "@firebase/firestore";
import * as Dialog from "@radix-ui/react-dialog";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { X } from "lucide-react";
import { Rating } from "react-simple-star-rating";
import { useEffect, useState } from "react";
import { db } from "../firebase";

interface NoteCardProps {
  note: {
    id: string;
    date: Date;
    content: string;
    ratings: {
      value: number;
      count: number;
    };
  };
  onNoteDeleted: (id: string) => void;
  onNoteRated: (id: string, rate: number) => void;
};


export function NoteCard({ note, onNoteDeleted, onNoteRated }: NoteCardProps) {
  
  const [voted, setVoted] = useState(false);

  useEffect(() => {
    async function hasVoted() {
      const user = localStorage.getItem("user")

      if(user) {
        const docSnap = await getDoc(doc(db, "users", user));

        if (docSnap.exists()) {
          const docData = docSnap.data();
  
          if (docData['notesRated'].includes(note.id)) {
            setVoted(true);
          }
        }
      }
    }

    hasVoted();
  }, [note.id]);
  
  return (
    <Dialog.Root>
      <Dialog.Trigger className="rounded-md text-left flex flex-col bg-fuchsia-100 p-5 gap-3 overflow-hidden relative hover:ring-2 hover:ring-fuchsia-100">
        <div className="flex fixed absolute top-0 right-0 p-5">
        <p className="mr-1 text-amber-400 font-black">{note.ratings['value'] !== null ? note.ratings['value'].toLocaleString('pt-BR', { maximumFractionDigits: 1 }) + "" : "-"}</p>
          <svg xmlns="http://www.w3.org/2000/svg" className="text-yellow-500 w-5 h-auto fill-current" viewBox="0 0 16 16">
            <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
          </svg>
        </div>
      
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

          <div className="p-5 gap-3 bg-fuchsia-100">
            <span className="text-sm text-fuchsia-800 font-medium ">
              {formatDistanceToNow(note.date, {
                locale: ptBR,
                addSuffix: true,
              })}
            </span>
            <p className="text-sm text-slate-600 leading-6">{note.content}</p>
          </div>
          <div className="items-center mt-auto flex flex-col">
            <Rating SVGclassName="inline" onClick={(rate) => onNoteRated(note.id, rate)} allowFraction readonly={voted}></Rating>
            <span className="pb-5 text-sm text-slate-600">Avaliação: {note.ratings.value !== null ? note.ratings.value.toFixed(1) : 'Seja o primeiro a avaliar essa ideia!'}</span>
            <button
              onClick={() => onNoteDeleted(note.id)}
              type="button"
              className="w-full bg-fuchsia-800 py-4 text-center text-fuchsia-100 outline-none text-sm font-medium group mt-auto"
            >
              Deseja{" "}
              <span className="text-fuchsia-100 group-hover:text-red-500 group-hover:underline">
                apagar esta nota
              </span>
              ?
            </button>
          </div>
          
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
