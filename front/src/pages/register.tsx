"use client";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, gql } from "@apollo/client";
import Title from "@/components/ui/Title";
import Label from "@/components/ui/Label";
import Input from "@/components/ui/Input";
import Layout from "@/components/Layout";


const NUEVA_CUENTA = gql`
  mutation Mutation($input: UserInput) {
    createUser(input: $input) {
      id
      name
      lastName
      email
      create
    }
  }
`;

const register = () => {

  //STATE PARA MENSAJE
  const [isMSG, setIsMSG] = useState<string>("") 
 
  //TODO: PASAR A HUK
  const [email, setEmail] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [passwordV, setPasswordV] = useState<string>("");

  const [createUser] = useMutation(NUEVA_CUENTA);

  const router = useRouter();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const {data} = await createUser({
        variables: {
          input: {
            email,
            name,
            lastName,
            password,
          },
        },
      });
      setIsMSG("Usuario creado")

      setTimeout(() => {
        router.push("/login")
      }, 3000);

      setEmail("")
      setLastName("")
      setName("")
      setPassword("")
      setPasswordV("")
      console.log(data)
      //TODO PASAR ERROR true/false
      //TODO ALERTA DE CREACION
      //TODO REDIRECCION
    } catch (error: any) {
      setIsMSG(error.message);
     setTimeout(() => {
      
      setIsMSG("");
     }, 3000);
    }
  };

  const showMsg = () =>{
    return(
      <div className="bg-red-600 w-full block py-2 mt-2 text-white max-w-sm
      uppercase text-center font-bold
      text-sm rounded">
          <p>{isMSG}</p>
      </div>
    )
  }


  return (
    <>
      <Layout>
      
        <div className="flex justify-center mt-5">
          <div className="w-full max-w-sm">
            <form
              onSubmit={handleSubmit}
              className="bg-white rounded shadow-md px-8 pt-6 pb-8 mb-4"
            >
                <div className="text-center">
                <Title>Registro</Title>
                </div>
              {isMSG && showMsg()}
              <div>
                <Label htmlFor="correo">Correo</Label>
                <Input
                  id="correo"
                  placeholder="correo@ejemplo.cl"
                  type="email"
                  name="correo"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="name">Nombre</Label>
                <Input
                  id="name"
                  placeholder="Fernando"
                  name="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="lastname">Apellido</Label>
                <Input
                  id="lastname"
                  placeholder="Moya"
                  name="lastname"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="password">Contraseña</Label>
                <Input
                  id="password"
                  placeholder="******"
                  type="password"
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="passwordv">Verificar Contraseña</Label>
                <Input
                  id="passwordv"
                  placeholder="******"
                  type="password"
                  name="passwordv"
                  value={passwordV}
                  onChange={(e) => setPasswordV(e.target.value)}
                />
              </div>
              <div>
                <input
                  className=" bg-sky-600 w-full block py-2 mt-4 text-white uppercase font-bold
                 hover:bg-sky-900
                 "
                  type="submit"
                  value="Enviar"
                />
              </div>
            </form>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default register;
