CREATE DATABASE db_amt;
USE db_amt;
CREATE TABLE IF NOT EXISTS venda(
 id INT AUTO_INCREMENT,
 numComanda INT,
 nomeCliente VARCHAR(255),
 data_emissao DATETIME NOT NULL,
 formaPagamento VARCHAR(255) NOT NULL,
 statuscmd CHAR(1) NOT NULL,
 valor FLOAT,
 PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS produto(
id_produto INT AUTO_INCREMENT,
 nome VARCHAR(255) NOT NULL,
 categoria VARCHAR(255) NOT NULL,
 qntMinima FLOAT NOT NULL,
 valor FLOAT NOT NULL,
 localizacao VARCHAR(255) NOT NULL,
 unidMedida VARCHAR(255) NOT NULL,
 quantidadeTotal FLOAT NOT NULL,
 imagem VARCHAR(255) NULL,
 PRIMARY KEY (id_produto)
);

CREATE TABLE IF NOT EXISTS produtoLote(
	id_Lote INT AUTO_INCREMENT,
	id_produto INT,
	lote VARCHAR(255) NOT NULL,
	vencimento DATE NOT NULL,
	fornecedor VARCHAR(255) NOT NULL,
	quantidade FLOAT NOT NULL,
	FOREIGN KEY (id_produto) REFERENCES produto(id_produto),
	PRIMARY KEY (id_lote)	
);

CREATE TABLE IF NOT EXISTS venda_produto(
	id_produto INT NOT NULL,
	id_venda INT NOT NULL,
	qntd INT NOT NULL,
	FOREIGN KEY(id_produto) REFERENCES produto(id_produto) ON DELETE CASCADE,
	FOREIGN KEY(id_venda) REFERENCES venda(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS insumo(
id_insumo INT AUTO_INCREMENT,
 nome VARCHAR(255) NOT NULL,
 classificacao VARCHAR(255) NOT NULL,
 qntMinima FLOAT NOT NULL,
 inspReceb VARCHAR(5) NOT NULL,
 localizacao VARCHAR(255) NOT NULL,
 unidMedida VARCHAR(255) NOT NULL,
 quantidadeTotal FLOAT NOT NULL,
 PRIMARY KEY (id_insumo)
);

CREATE TABLE IF NOT EXISTS insumoLote(
	id_Lote INT AUTO_INCREMENT,
	id_insumo INT,
	lote VARCHAR(255) NOT NULL,
	vencimento DATE NOT NULL,
	fornecedor VARCHAR(255) NOT NULL,
	quantidade FLOAT NOT NULL,
	FOREIGN KEY (id_insumo) REFERENCES insumo(id_insumo),
	PRIMARY KEY (id_lote)	
);

CREATE TABLE IF NOT EXISTS produtoLoteInsumo (
  id INT AUTO_INCREMENT PRIMARY KEY,
  id_produtoLote INT,
  id_insumoLote INT,
  quantidade_utilizada FLOAT NOT NULL,

  FOREIGN KEY (id_produtoLote) REFERENCES produtoLote(id_Lote),
  FOREIGN KEY (id_insumoLote) REFERENCES insumoLote(id_Lote)
);

CREATE TABLE IF NOT EXISTS usuario(
id_usuario INT AUTO_INCREMENT,
 nome VARCHAR(255) NOT NULL,
 contato VARCHAR(255),
 username VARCHAR(255) NOT NULL,
 senha VARCHAR(255) NOT NULL,
 cargo VARCHAR(255) NOT NULL,
 ehAdm BOOLEAN NOT NULL,
 PRIMARY KEY (id_usuario)
 
);
CREATE TABLE IF NOT EXISTS pedidocompra(
id_pedido INT AUTO_INCREMENT,
 id_insumo INT NOT NULL,
 id_usuario INT NOT NULL,
 dataEmissao DATE NOT NULL,
 pedido_status VARCHAR(255) NOT NULL,
 qntComprar FLOAT NOT NULL,
 observacao VARCHAR(255) NOT NULL,
 FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario),
 FOREIGN KEY (id_insumo) REFERENCES insumo(id_insumo),
 PRIMARY KEY (id_pedido)
 
);
CREATE TABLE IF NOT EXISTS caixa(
 id_op INT AUTO_INCREMENT,
 valor_ini FLOAT NOT NULL,
 valor_final FLOAT,
 id_ini INT NOT NULL,
 id_final INT,
 nome_op VARCHAR(50) NOT NULL,
 hora_ini DATETIME NOT NULL,
 hora_final DATETIME,
 obs VARCHAR(255),
 FOREIGN KEY (id_ini) REFERENCES usuario(id_usuario),
 FOREIGN KEY (id_final) REFERENCES usuario(id_usuario),
 PRIMARY KEY (id_op)
 
);
CREATE TABLE IF NOT EXISTS dfc(
id_dfc INT AUTO_INCREMENT,
 id_usuario INT,
 titulo VARCHAR(255) NOT NULL,
 dataInicio DATE NOT NULL,
 dataFinal DATE NOT NULL,
 FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario),
 PRIMARY KEY (id_dfc)
 
);
CREATE TABLE IF NOT EXISTS linha(
id_dfc INT,
 nome VARCHAR(255) NOT NULL,
 tipo VARCHAR(255) NOT NULL,
 valor FLOAT NOT NULL,
 FOREIGN KEY (id_dfc) REFERENCES dfc(id_dfc)
 
);
CREATE TABLE IF NOT EXISTS permissao(
id_usuario INT,
 vendas BOOLEAN,
 estoque BOOLEAN,
 financeiro BOOLEAN,
 gestao BOOLEAN,
 FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario)
 
);

CREATE TABLE IF NOT EXISTS tipodespesa(
	id_tipo_despesa INT AUTO_INCREMENT,
	nome VARCHAR(255) NOT NULL,
	PRIMARY KEY(id_tipo_despesa)
 
 
);
CREATE TABLE IF NOT EXISTS despesa(
id_despesa INT AUTO_INCREMENT,
id_tipo_despesa INT,
 id_usuario INT,
descritivo VARCHAR(255) NOT NULL,
 valor FLOAT NOT NULL,
 dataInicio DATE NOT NULL,
 dataVencimento DATE NOT NULL,
 estaPago BOOLEAN NOT NULL,
 FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario),
 FOREIGN KEY (id_tipo_despesa) REFERENCES tipodespesa(id_tipo_despesa),
 PRIMARY KEY(id_despesa) 
 
);


-- CREATE TABLE IF NOT EXISTS operacao(
-- 	id INT AUTO_INCREMENT,
-- 	id_respon INT NOT NULL,
--  	valor FLOAT NOT NULL,
-- 	obs VARCHAR(300) NOT NULL,
-- 	PRIMARY KEY(id),
--  	FOREIGN KEY (id_respon) REFERENCES usuario(id_usuario)
-- );

CREATE TABLE IF NOT EXISTS alergia(
	id_alergia INT AUTO_INCREMENT,
	nome VARCHAR(255) NOT NULL,
	 observacao VARCHAR(255),
	PRIMARY KEY(id_alergia)
);

CREATE TABLE IF NOT EXISTS produto_alergia(
	id_produto INT NOT NULL,
	id_alergia INT NOT NULL,
 	FOREIGN KEY (id_produto) REFERENCES produto(id_produto),
	FOREIGN KEY (id_alergia) REFERENCES alergia(id_alergia)
);

INSERT INTO `usuario`(`nome`, `contato`, `username`, `senha`, `cargo`, `ehAdm`) VALUES ('Admin','22','admin','$2y$10$eG2q9V2GLO2Bz9yXEzxp5eQeUQYnUxPHHB0NjHWce2WyusEJCLoCG','Administrador',1);
INSERT INTO `permissao`(`id_usuario`, `vendas`, `estoque`, `financeiro`, `gestao`) VALUES (1,1,1,1,1);


INSERT INTO alergia(nome) VALUES
('Glúten'),
('Lactose'),
('Leite de vaca'),
('Ovos'),
('Amendoim'),
('Frutos secos (nozes, castanhas, amêndoas, etc.)'),
('Soja'),
('Trigo'),
('Peixes'),
('Frutos do mar (camarão, lagosta, caranguejo, etc.)'),
('Corantes artificiais'),
('Conservantes'),
('Sulfitos'),
('Aipo'),
('Mostarda'),
('Gergelim'),
('Milho'),
('Chocolate'),
('Cafeína'),
('Aspartame'),
('Frutose'),
('Histamina'),
('Glutamato monossódico (MSG)'),
('Alho'),
('Cebola');
