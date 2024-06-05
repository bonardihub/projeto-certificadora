import { useState } from "react";
import logo from "../../assets/logo.png";
import { auth } from "../../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { db } from "../../firebase";
import { setDoc, doc } from "firebase/firestore";
import { Link } from "react-router-dom";
import { toast } from "sonner";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role] = useState("user");

  const signUp = (e: React.FormEvent) => {
    e.preventDefault();

    let isValid = true;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Por favor, insira um e-mail válido.");
      isValid = false;
    }

    if (password.length < 6) {
      toast.error("A senha deve ter no mínimo 6 caracteres.");
      isValid = false;
    }

    if (!isValid) {
      return;
    }

    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        setDoc(doc(db, "users", userCredential.user.uid), {
          email: email,
          role: role,
          password: password,
          notesRated: null,
        });
        setEmail("");
        setPassword("");
        toast.success("Conta criada com sucesso!");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <>
      <div className="h-screen flex items-center justify-center">
        <div
          className="bg-fuchsia-900 p-10 rounded-lg"
          style={{ width: "440px" }}
        >
          <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
              <img className="mx-auto h-15 w-15" src={logo} alt="logo" />
              <h2 className=" text-center text-2xl font-bold leading-9 tracking-tight text-fuchsia-100">
                Registre para começar
              </h2>
            </div>

            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
              <form className="space-y-6" onSubmit={signUp}>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium leading-6 text-fuchsia-100"
                  >
                    Endereço de e-mail
                  </label>
                  <div className="mt-2">
                    <input
                      placeholder="seu@email.com"
                      id="email"
                      name="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      autoComplete="email"
                      required
                      title="Insira um e-mail válido"
                      className="pl-1 block w-full rounded-md py-1.5 text-black shadow-sm  sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium leading-6 text-fuchsia-100"
                    >
                      Senha
                    </label>
                  </div>
                  <div className="mt-2">
                    <input
                      placeholder="******"
                      id="password"
                      name="password"
                      type="password"
                      autoComplete="current-password"
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      title="A senha deve conter no mínimo 6 caracteres."
                      value={password}
                      className="pl-1 block w-full rounded-md py-1.5 text-black shadow-sm  sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>

                <div>
                  <button
                    type="submit"
                    className="flex w-full justify-center rounded-md bg-fuchsia-800 px-3 py-1.5 text-sm font-semibold leading-6 text-fuchsia-100 shadow-sm hover:bg-fuchsia-700 "
                  >
                    Registrar
                  </button>
                </div>

                <div>
                  <p className="mt-10 text-center text-sm text-fuchsia-100">
                    Já possui uma conta?
                    <Link
                      to="/"
                      className="font-semibold leading-6 ml-2 text-blue-600 hover:text-blue-500"
                    >
                      Entre aqui
                    </Link>
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
