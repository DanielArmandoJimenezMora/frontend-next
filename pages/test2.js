const { gql } = require("apollo-server");
// Schema
const typeDefs = gql`
  type Usuario {
    id: ID
    nombre: String
    apellido: String
    genero: String
    email: String
    creado: String
  }

  type Token {
    token: String
  }

  type Producto {
    id: ID
    nombre: String
    presentacion: String
    existencia: Int
    existenciaDeseada: Int
    precio: Int
    preCompra: Int
    tipoProducto: String
    creado: String
  }

  type Cliente {
    id: ID
    nombre: String
    apellido: String
    telefono: String
    direccion: String
    nombreNegocio: String
    email: String
    genero: String
    vendedor: ID
  }

  type Proveedor {
    id: ID
    nombre: String
    telefono: String
    direccion: String
    email: String
    categoria: String
    creado: String
  }

  type Pedido {
    id: ID
    pedido: [PedidoGrupo]
    total: Float
    subTotal: Float
    cliente: Cliente
    vendedor: ID
    fecha: String
    estado: EstadoPedido
  }

  type PedidoGrupo {
    id: ID
    cantidad: Int
    nombre: String
    precio: Float
  }

  type TopCliente {
    total: Float
    cliente: [Cliente]
  }

  type TopVendedor {
    total: Float
    vendedor: [Usuario]
  }

  input UsuarioInput {
    nombre: String!
    apellido: String!
    genero: String!
    email: String!
    password: String!
  }

  input AutenticarInput {
    email: String!
    password: String!
  }

  input ProductoInput {
    nombre: String!
    presentacion: String
    existencia: Int!
    existenciaDeseada: Int!
    precio: Float!
    preCompra: Float
    tipoProducto: String!
  }

  input ClienteInput {
    nombre: String!
    apellido: String
    telefono: String!
    direccion: String
    nombreNegocio: String
    email: String
    genero: String!
  }

  input ProveedorInput {
    nombre: String!
    telefono: String!
    direccion: String
    email: String
    categoria: String
  }

  input PedidoProductoInput {
    id: ID
    cantidad: Int
    nombre: String
    precio: Float
    preCompra
  }

  input PedidoInput {
    pedido: [PedidoProductoInput]
    total: Float
    cliente: ID
    estado: EstadoPedido
  }

  enum EstadoPedido {
    PENDIENTE
    COMPLETADO
    CANCELADO
  }

  type Query {
    # Usuarios
    obtenerUsuario: Usuario

    # Productos
    obtenerProductos: [Producto]
    obtenerProducto(id: ID!): Producto

    # Clientes
    obtenerClientes: [Cliente]
    obtenerClientesVendedor: [Cliente]
    obtenerCliente(id: ID!): Cliente

    # Proveedores
    obtenerProveedores: [Proveedor]
    obtenerProveedor(id: ID!): Proveedor

    # Pedidos
    obtenerPedidos: [Pedido]
    obtenerPedidosVendedor: [Pedido]
    obtenerPedido(id: ID!): Pedido
    obtenerPedidosEstado(estado: String!): [Producto]

    # Busquedas Avanzadas
    mejoresClientes: [TopCliente]
    mejoresVendedores: [TopVendedor]
    buscarProducto(texto: String!): [Producto]
  }

  type Mutation {
    # Usuarios
    nuevoUsuario(input: UsuarioInput): Usuario
    autenticarUsuario(input: AutenticarInput): Token

    # Productos
    nuevoProducto(input: ProductoInput): Producto
    actualizarProducto(id: ID!, input: ProductoInput): Producto
    eliminarProducto(id: ID!): String

    # Clientes
    nuevoCliente(input: ClienteInput): Cliente
    actualizarCliente(id: ID!, input: ClienteInput): Cliente
    eliminarCliente(id: ID!): String

    #Proveedores
    nuevoProveedor(input: ProveedorInput): Proveedor
    actualizarProveedor(id: ID!, input: ProveedorInput): Proveedor
    eliminarProveedor(id: ID!): String

    # Pedidos
    nuevoPedido(input: PedidoInput): Pedido
    actualizarPedido(id: ID!, input: Input): Pedido
    eliminarPedido(id: ID!): String
  }
`;

module.exports = typeDefs;
