create database pdv;

create table
    usuarios (
        id serial primary key,
        nome text not null,
        email text not null unique,
        senha text not null
    );

create table categorias (
  id serial primary key,
  descricao text not null
  );

INSERT INTO categorias (descricao) VALUES
('Informática'),
('Celulares'),
('Beleza e Perfumaria'),
('Mercado'),
('Livros e Papelaria'),
('Brinquedos'),
('Moda'),
('Bebê'),
('Games');

create table produtos (
    id serial primary key,
    descricao text not null,
    quantidade_estoque integer not null,
    valor integer not null,
    categoria_id integer references categorias(id)
);

create table clientes (
    id serial primary key,
    nome text not null,
    email text not null unique,
    cpf text not null unique,
    cep integer,
    rua text,
    numero integer,
    bairro text,
    cidade text,
    estado text
);

ALTER TABLE produtos
ADD COLUMN produto_imagem TEXT;

CREATE TABLE pedidos (
    id SERIAL PRIMARY KEY,
    cliente_id INT REFERENCES clientes(id),
    observacao TEXT,
    valor_total INT
);

CREATE TABLE pedido_produtos (
    id SERIAL PRIMARY KEY,
    pedido_id INT REFERENCES pedidos(id),
    produto_id INT REFERENCES produtos(id),
    quantidade_produto INT,
    valor_produto INT
);