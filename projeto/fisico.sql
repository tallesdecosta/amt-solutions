CREATE DATABASE db_amt;
USE db_amt;
CREATE TABLE IF NOT EXISTS venda(
 id INT AUTO_INCREMENT,
 numComanda INT,
 nomeCliente VARCHAR(255),
 data_emissao DATE NOT NULL,
 formaPagamento VARCHAR(255) NOT NULL,
 statuscmd CHAR(1) NOT NULL,
 PRIMARY KEY (id)
);
CREATE TABLE IF NOT EXISTS produto(
id_produto INT AUTO_INCREMENT,
 nome VARCHAR(255) NOT NULL,
 valor FLOAT NOT NULL,
 categoria VARCHAR(255) NOT NULL,
 lote VARCHAR(255),
 vencimento DATE,
 PRIMARY KEY (id_produto)
 
);

CREATE TABLE IF NOT EXISTS venda_produto(
	id_produto INT NOT NULL,
    id_venda INT NOT NULL,
    qntd INT NOT NULL,
    FOREIGN KEY(id_produto) REFERENCES produto(id_produto),
	FOREIGN KEY(id_venda) REFERENCES produto(id)
);

CREATE TABLE IF NOT EXISTS insumo(
id_insumo INT AUTO_INCREMENT,
 nome VARCHAR(255) NOT NULL,
 classificacao VARCHAR(255) NOT NULL,
 qntMinima FLOAT NOT NULL,
 lote VARCHAR(255) NOT NULL,
 vencimento DATE NOT NULL,
 inspReceb BOOLEAN NOT NULL,
 fornecedor VARCHAR(255) NOT NULL,
 localizacao VARCHAR(255) NOT NULL,
 quantidade FLOAT NOT NULL,
 unidMedida VARCHAR(255) NOT NULL,
 PRIMARY KEY (id_insumo)
 
);
CREATE TABLE IF NOT EXISTS produtoinsumo(
 id_produto INT,
 id_insumo INT,
 quantidade VARCHAR(255),
 observacoes VARCHAR(255),
 FOREIGN KEY (id_produto) REFERENCES produto(id_produto),
 FOREIGN KEY (id_insumo) REFERENCES insumo(id_insumo)
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
 id_insumo INT,
 id_usuario INT,
 dataEmissao DATE NOT NULL,
 pedido_status VARCHAR(255) NOT NULL,
 qntComprar FLOAT NOT NULL,
 observacao VARCHAR(255) NOT NULL,
 FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario),
 FOREIGN KEY (id_insumo) REFERENCES insumo(id_insumo),
 PRIMARY KEY (id_pedido)
 
);
CREATE TABLE IF NOT EXISTS caixa(
 id_usuario INT,
 valorTotal FLOAT NOT NULL,
 data_caixa DATE NOT NULL,
 horaAbertura DATETIME NOT NULL,
 horaFecha DATETIME NOT NULL,
 FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario)
 
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
CREATE TABLE IF NOT EXISTS despesa(
id_despesa INT AUTO_INCREMENT,
 id_usuario INT,
descritivo VARCHAR(255) NOT NULL,
 valor FLOAT NOT NULL,
 dataInicio DATE NOT NULL,
 dataVencimento DATE NOT NULL,
 estaPago BOOLEAN NOT NULL,
 FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario),
 PRIMARY KEY(id_despesa) 
 
);
CREATE TABLE IF NOT EXISTS tipodespesa(
id_despesa INT,
 nome VARCHAR(255) NOT NULL,
 FOREIGN KEY (id_despesa) REFERENCES despesa(id_despesa)
 
);