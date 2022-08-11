import React from 'react'
import Router, { useRouter } from 'next/router'
import Layout from '../../components/Layout'
import styled from '@emotion/styled'
import Link from 'next/link'
import { gql, useQuery, useMutation } from '@apollo/client'
import { Formik } from 'formik'
import * as Yup from 'yup'
import Swal from 'sweetalert2'
import Cargando from '../../components/Cargando'
import NoSesion from '../../components/NoSesion'

/* GraphQL */
const OBTENER_CLIENTE = gql`
  query obtenerCliente($id: ID!) {
    obtenerCliente(id: $id) {
      id
      nombre
      apellido
      telefono
      direccion
      nombreNegocio
      email
      genero
    }
  }
`

const ACTUALIZAR_CLIENTE = gql`
  mutation actualizarCliente($id: ID!, $input: ClienteInput) {
    actualizarCliente(id: $id, input: $input) {
      id
      nombre
      apellido
      telefono
      direccion
      nombreNegocio
      email
      genero
    }
  }
`

const OBTENER_CLIENTES_USUARIO = gql`
  query ObtenerClientesVendedor {
    obtenerClientesVendedor {
      id
    }
  }
`

/* Estilos */
const R = styled.div`
  text-align: right;
`

const Obligatorio = styled.span`
  color: red;
  font-weight: bold;
`

const Error = styled.div`
  width: 100%;
  text-align: left;
  padding: 8px;
`

const Select = styled.select`
  width: 100%;
  height: 2rem;
  background-color: #fff;
  font-size: 1em;
  border: none;
  border-radius: 5px;
  font-weight: 300;
  letter-spacing: 1px;
  box-sizing: border-box;
`

const Container = styled.div`
  height: 80vh;
  border-radius: 10px !important;
`

const EditarCliente = () => {
  const router = useRouter()
  const {
    query: { pid }
  } = router
  const id = pid

  // Consultar para obtener el cliente
  const { data, loading, client } = useQuery(OBTENER_CLIENTE, {
    variables: { id }
  })
  const datosC = useQuery(OBTENER_CLIENTES_USUARIO)
  const dataC = datosC.data
  const loadingC = datosC.loading

  // actualizar el cliente
  const [actualizarCliente] = useMutation(ACTUALIZAR_CLIENTE)

  // Schema de validacion
  const schemaValidation = Yup.object({
    nombre: Yup.string().required('El nombre del cliente es obligatorio'),
    apellido: Yup.string(),
    telefono: Yup.string().required('El telefono del cliente es obligatorio'),
    direccion: Yup.string().required('La direccion del cliente es obligatoria'),
    nombreNegocio: Yup.string().required(
      'El nombre del negocio es obligatorio'
    ),
    email: Yup.string().required('El email del cliente es obligatorio'),
    genero: Yup.string().required('El genero del cliente es obligatorio')
  })

  if (loading || loadingC) return <Cargando />

  if (!data) {
    return (id) => {
      Router.push({
        pathname: '/editarcliente/[id]',
        query: { id }
      })
    }
  }

  if (!dataC.obtenerClientesVendedor) {
    client.clearStore()
    router.push('/login')
    return <NoSesion />
  }

  const { obtenerCliente } = data

  // Modificar el cliente en la base de datos
  const actualizarInfoCliente = async (valores) => {
    const {
      nombre,
      apellido,
      telefono,
      direccion,
      nombreNegocio,
      email,
      genero
    } = valores
    try {
      await actualizarCliente({
        variables: {
          id,
          input: {
            nombre,
            apellido,
            telefono,
            direccion,
            nombreNegocio,
            email,
            genero
          }
        }
      })

      // Alerta de actualizacion
      Swal.fire(
        'Cliente actualizado',
        'El cliente se actualizo correctamente',
        'success'
      )
      // TODO: redireccionar a la pagina de clientes
      router.push('/')
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <Layout>
      <h1 className="text-2xl text-gray-800 font-light">
        Editar información de cliente
      </h1>
      <br />
      <hr />
      <Container className="overflow-x-scroll mt-3">
        <div className="">
          <Formik
            validationSchema={schemaValidation}
            enableReinitialize
            initialValues={obtenerCliente}
            onSubmit={async (valores) => {
              actualizarInfoCliente(valores)
            }}
          >
            {(props) => {
              console.log(props)
              return (
                <form
                  className="bg-white shadow-md px-8 pt-6 pb-8 mb-4"
                  onSubmit={props.handleSubmit}
                >
                  <div className="mb-4">
                    <label
                      className="block text-gray-700 text-sm font-bold mb-2"
                      htmlFor="nombre"
                    >
                      <Obligatorio>*</Obligatorio> Nombre
                      {props.touched.nombre && props.errors.nombre ? 
                      (
                        <Error className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                          <p>
                            <span className="font-bold">Error: </span>
                            {props.errors.nombre}
                          </p>
                        </Error>
                      ) : null}
                    </label>

                    <input
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      id="nombre"
                      type="text"
                      placeholder="Nombre Cliente"
                      onChange={props.handleChange}
                      onBlur={props.handleBlur}
                      value={props.values.nombre}
                    />
                  </div>

                  <div className="mb-4">
                    <label
                      className="block text-gray-700 text-sm font-bold mb-2"
                      htmlFor="apellido"
                    >
                      Apellido
                    </label>

                    <input
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      id="apellido"
                      type="text"
                      placeholder="Apellido Cliente"
                      onChange={props.handleChange}
                      onBlur={props.handleBlur}
                      value={props.values.apellido}
                    />
                  </div>

                  <div className="mb-4">
                    {/* genero */}
                    <label
                      className="block text-gray-700 text-sm font-bold mb-2"
                      htmlFor="tipoProducto"
                    >
                      <Obligatorio>*</Obligatorio> Género
                      {props.touched.genero && props.errors.genero ? (
                        <Error className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                          <p>
                            <span className="font-bold">Error: </span>
                            {props.errors.genero}
                          </p>
                        </Error>
                      ) : null}
                    </label>

                    <Select
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      name="genero"
                      value={props.values.genero}
                      onChange={props.handleChange}
                      onBlur={props.handleBlur}
                    >
                      <option value="" label="Selecciona un género">
                        Selecciona un género{" "}
                      </option>
                      <option value="Hombre" label="Hombre">
                        {" "}
                        Hombre
                      </option>
                      <option value="Mujer" label="Mujer">
                        {" "}
                        Mujer
                      </option>
                    </Select>
                    {/* Fin de Tipo de genero */}
                  </div>

                  <div className="mb-4">
                    <label
                      className="block text-gray-700 text-sm font-bold mb-2"
                      htmlFor="telefono"
                    >
                      <Obligatorio>*</Obligatorio> Teléfono
                      {props.touched.telefono && props.errors.telefono ? (
                        <Error className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                          <p>
                            <span className="font-bold">Error: </span>
                            {props.errors.telefono}
                          </p>
                        </Error>
                      ) : null}
                    </label>

                    <input
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      id="telefono"
                      type="tel"
                      placeholder="Teléfono Cliente"
                      onChange={props.handleChange}
                      onBlur={props.handleBlur}
                      value={props.values.telefono}
                    />
                  </div>

                  <div className="mb-4">
                    <label
                      className="block text-gray-700 text-sm font-bold mb-2"
                      htmlFor="direccion"
                    >
                      <Obligatorio>*</Obligatorio> Dirección
                      {props.touched.direccion && props.errors.direccion ? (
                        <Error className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                          <p>
                            <span className="font-bold">Error: </span>
                            {props.errors.direccion}
                          </p>
                        </Error>
                      ) : null}
                    </label>

                    <input
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      id="direccion"
                      type="text"
                      placeholder="Dirección del negocio"
                      onChange={props.handleChange}
                      onBlur={props.handleBlur}
                      value={props.values.direccion}
                    />
                  </div>

                  <div className="mb-4">
                    <label
                      className="block text-gray-700 text-sm font-bold mb-2"
                      htmlFor="nombreNegocio"
                    >
                      <Obligatorio>*</Obligatorio> Nombre del negocio
                      {props.touched.nombreNegocio &&
                      props.errors.nombreNegocio ? (
                        <Error className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                          <p>
                            <span className="font-bold">Error: </span>
                            {props.errors.nombreNegocio}
                          </p>
                        </Error>
                      ) : null}
                    </label>

                    <input
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      id="nombreNegocio"
                      type="text"
                      placeholder="Nombre del negocio"
                      onChange={props.handleChange}
                      onBlur={props.handleBlur}
                      value={props.values.nombreNegocio}
                    />
                  </div>

                  <div className="mb-4">
                    <label
                      className="block text-gray-700 text-sm font-bold mb-2"
                      htmlFor="email"
                    >
                      <Obligatorio>*</Obligatorio> Correo Electrónico
                    </label>
                    {props.touched.email && props.errors.email ? (
                      <Error className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                        <p>
                          <span className="font-bold">Error: </span>
                          {props.errors.email}
                        </p>
                      </Error>
                    ) : null}
                    <input
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      id="email"
                      type="email"
                      placeholder="Correo electrónico cliente"
                      onChange={props.handleChange}
                      onBlur={props.handleBlur}
                      value={props.values.email}
                    />
                  </div>

                  <R>
                    <input
                      type="submit"
                      className="bg-green-500 mt-5 p-2 text-white rounded font-bold hover:bg-green-600"
                      value="Actualizar cliente"
                    />
                    <Link href="/">
                      <input
                        type="submit"
                        className="bg-red-600 ml-3 mt-5 p-2 text-white rounded font-bold hover:bg-red-700"
                        value="Cancelar"
                      />
                    </Link>
                  </R>
                </form>
              );
            }}
          </Formik>
        </div>
      </Container>
    </Layout>
  );
};

export default EditarCliente;
