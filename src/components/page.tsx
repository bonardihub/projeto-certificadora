import { ChangeEvent, useState, useEffect } from "react";
import logo from "../assets/logo.png";
import { NewNoteCard } from "../components/new-note-card";
import { NoteCard } from "../components/note-card";
import { auth, db } from "../firebase";
import { addDoc, collection, deleteDoc, setDoc, getDoc, increment, arrayUnion } from "firebase/firestore";
import { getDocs, doc } from "firebase/firestore";
import { orderBy, query } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";
import { toast } from "sonner";

interface Note {
  id: string;
  date: Date;
  content: string;
  ratings: {
    value: number;
    count: number;  
  };
}

export default function Page() {
  const navigate = useNavigate();

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
          ratings: doc.data().ratings,
        } as Note)
    );
    setNotes(noteList);
  }

  async function onNoteCreated(content: string) {
    const newNote = {
      date: new Date(),
      content,
      ratings: {value: null, count: null},
    };

    await addDoc(collection(db, "notes"), newNote);

    fetchNotes();
  }

  async function onNoteDeleted(id: string) {
    await deleteDoc(doc(db, "notes", id));

    fetchNotes();
  }

  
  async function onNoteRated(id: string, rate: number) {
    const docSnap = await getDoc(doc(db, "notes", id));
    const user = getAuth().currentUser;

    if (docSnap.exists() && user) {
      const docData = docSnap.data();

      if (docData) {
        const rating = docData['ratings'];
        const novoRating = (rating['value'] * rating['count'] + rate) / (rating['count'] + 1);
      
        try {
          await setDoc(doc(db, "users", user.uid), { notesRated: arrayUnion(id) }, { merge: true });
          await setDoc(doc(db, "notes", id), { ratings: { value: novoRating, count: increment(1) }}, { merge: true });  
          window.location.reload()
        }
        catch(error) {
          toast.error("Apenas administradores podem votar em ideias!")
        }


      } else {
          console.error("Document data is undefined.");
      }
    } else {
      console.error("Erro ao avaliar essa nota.");
    }
}


  function handleSearch(event: ChangeEvent<HTMLInputElement>) {
    const query = event.target.value;

    setSearch(query);
  }

  
  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/");
    } catch (error) {
      console.error("Error logging out: ", error);
    }
  };

  const filteredNotes =
    search != ""
      ? notes.filter((note) =>
          note.content.toLocaleLowerCase().includes(search.toLocaleLowerCase())
        )
      : notes;

  return (
    <div className="mx-auto my-6 max-w-6xl space-y-6 px-5 md:px-0">
      <div className="flex justify-between items-center">
        <a href="https://meninas.sbc.org.br/portfolio-3/meninas-digitais-utfpr-cp/">
          <img className="h-[120px]" src={logo} alt="logo" />
        </a>
                
        {getAuth().currentUser !== null ? 
          (
            <button onClick={handleLogout} className="h-10 px-4 py-2 bg-red-500 text-white font-semibold rounded-lg shadow-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-75">
              Logout
            </button>
          ) 
          : (null)
        }
      </div>
  
        <form className="w-full">
          <input
            type="text"
            placeholder="Busque em suas notas"
            className="w-full bg-transparent text-3xl font-semibold tracking-tight outline-none placeholder:text-fuchsia-100"
            onChange={handleSearch}
          />
        </form>
  
        <div className="h-px bg-fuchsia-100" />
      
        {getAuth().currentUser !== null ? 
        (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-[250px]">
          <NewNoteCard onNoteCreated={onNoteCreated} />
  
          {filteredNotes.map((note) => {
            return (
              <NoteCard key={note.id} note={note} onNoteDeleted={onNoteDeleted} onNoteRated={onNoteRated}/>
            );
          })}
        </div>
        ) : (<div> Faça <a className="text-blue-500 font-bold" href="/">login</a> para criar ou acessar notas </div>)}
    </div>
  );
}
