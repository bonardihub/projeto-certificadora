import { useState } from "react";
import logo from "../../assets/logo.png";
import { auth } from "../../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  let navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const signIn = (e: React.FormEvent) => {
    e.preventDefault();
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        console.log(userCredential);
        navigate("/page");
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
                Entre para continuar
              </h2>
            </div>

            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
              <form className="space-y-6" onSubmit={signIn}>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium leading-6 text-fuchsia-100"
                  >
                    Endereço de e-mail
                  </label>
                  <div className="mt-2">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      autoComplete="email"
                      required
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
                      id="password"
                      name="password"
                      type="password"
                      autoComplete="current-password"
                      onChange={(e) => setPassword(e.target.value)}
                      required
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
                    Entrar
                  </button>

                  <div>
                    <p className="mt-10 text-center text-sm text-fuchsia-100">
                      Não possui uma conta?
                      <Link
                        to="/register"
                        className="font-semibold leading-6 ml-2 text-blue-600 hover:text-blue-500"
                      >
                        Registre-se aqui
                      </Link>
                    </p>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
