import { ChangeEvent, useState, useEffect } from "react";
import logo from "../assets/logo.png";
import { NewNoteCard } from "../components/new-note-card";
import { NoteCard } from "../components/note-card";
import { db } from "../firebase";
import { addDoc, collection, deleteDoc } from "firebase/firestore";
import { getDocs, doc } from "firebase/firestore";
import { orderBy, query } from "firebase/firestore";

interface Note {
  id: string;
  date: Date;
  content: string;
}

export default function Page() {
  const [search, setSearch] = useState("");

  const [notes, setNotes] = useState<Note[]>([]);

  useEffect(() => {
    fetchNotes();
  }, []);

  async function fetchNotes() {
    const noteCollection = collection(db, "notes");
    const noteQuery = query(noteCollection, orderBy("date", "desc"));
    const noteSnapshot = await getDocs(noteQuery);
    const noteList = noteSnapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          date: new Date(doc.data().date.seconds * 1000), // convert seconds to milliseconds
          content: doc.data().content,
        } as Note)
    );
    setNotes(noteList);
  }

  async function onNoteCreated(content: string) {
    const newNote = {
      date: new Date(),
      content,
    };

    await addDoc(collection(db, "notes"), newNote);

    fetchNotes();
  }

  async function onNoteDeleted(id: string) {
    await deleteDoc(doc(db, "notes", id));

    fetchNotes();
  }

  function handleSearch(event: ChangeEvent<HTMLInputElement>) {
    const query = event.target.value;

    setSearch(query);
  }

  const filteredNotes =
    search != ""
      ? notes.filter((note) =>
          note.content.toLocaleLowerCase().includes(search.toLocaleLowerCase())
        )
      : notes;

  return (
    <div className="mx-auto my-6 max-w-6xl space-y-6 px-5 md:px-0">
      <img className="h-[120px]" src={logo} alt="logo" />

      <form className="w-full">
        <input
          type="text"
          placeholder="Busque em suas notas"
          className="w-full bg-transparent text-3xl font-semibold tracking-tight outline-none placeholder:text-fuchsia-100"
          onChange={handleSearch}
        />
      </form>

      <div className="h-px bg-fuchsia-100" />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-[250px]">
        <NewNoteCard onNoteCreated={onNoteCreated} />

        {filteredNotes.map((note) => {
          return (
            <NoteCard key={note.id} note={note} onNoteDeleted={onNoteDeleted} />
          );
        })}
      </div>
    </div>
  );
}
