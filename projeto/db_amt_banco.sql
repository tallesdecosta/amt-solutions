-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Tempo de geração: 20/05/2025 às 21:31
-- Versão do servidor: 10.4.32-MariaDB
-- Versão do PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Banco de dados: `db_amt`
--

-- --------------------------------------------------------

--
-- Estrutura para tabela `alergia`
--

CREATE TABLE `alergia` (
  `id_alergia` int(11) NOT NULL,
  `nome` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `caixa`
--

CREATE TABLE `caixa` (
  `id_op` int(11) NOT NULL,
  `id_usuario` int(11) DEFAULT NULL,
  `id_fech` int(11) DEFAULT NULL,
  `ajuste` tinyint(1) NOT NULL,
  `valorAber` float NOT NULL,
  `valorFech` double NOT NULL,
  `horaAbertura` datetime NOT NULL,
  `horaFecha` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `caixa`
--

INSERT INTO `caixa` (`id_op`, `id_usuario`, `id_fech`, `ajuste`, `valorAber`, `valorFech`, `horaAbertura`, `horaFecha`) VALUES
(1, 1, 3, 0, 400, 900, '2025-05-13 16:22:56', '2025-05-13 16:24:40'),
(2, 3, 1, 0, 900, 1000, '2025-05-13 16:27:11', '2025-05-13 16:27:33'),
(3, 1, 3, 0, 1000, 1200, '2025-05-20 15:31:30', '2025-05-20 15:32:17'),
(4, 1, 1, 1, 1200, 1500, '2025-05-20 15:43:19', '2025-05-20 15:43:19'),
(5, 3, 3, 1, -400, 1100, '2025-05-20 15:44:24', '2025-05-20 15:44:24'),
(6, 1, 1, 1, 900, 900, '2025-05-20 16:18:31', '2025-05-20 16:18:31');

-- --------------------------------------------------------

--
-- Estrutura para tabela `despesa`
--

CREATE TABLE `despesa` (
  `id_despesa` int(11) NOT NULL,
  `id_usuario` int(11) DEFAULT NULL,
  `descritivo` varchar(255) NOT NULL,
  `valor` float NOT NULL,
  `dataInicio` date NOT NULL,
  `dataVencimento` date NOT NULL,
  `estaPago` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `dfc`
--

CREATE TABLE `dfc` (
  `id_dfc` int(11) NOT NULL,
  `id_usuario` int(11) DEFAULT NULL,
  `titulo` varchar(255) NOT NULL,
  `dataInicio` date NOT NULL,
  `dataFinal` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `insumo`
--

CREATE TABLE `insumo` (
  `id_insumo` int(11) NOT NULL,
  `nome` varchar(255) NOT NULL,
  `classificacao` varchar(255) NOT NULL,
  `qntMinima` float NOT NULL,
  `lote` varchar(255) NOT NULL,
  `vencimento` date NOT NULL,
  `inspReceb` varchar(5) NOT NULL,
  `fornecedor` varchar(255) NOT NULL,
  `localizacao` varchar(255) NOT NULL,
  `quantidade` float NOT NULL,
  `unidMedida` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `linha`
--

CREATE TABLE `linha` (
  `id_dfc` int(11) DEFAULT NULL,
  `nome` varchar(255) NOT NULL,
  `tipo` varchar(255) NOT NULL,
  `valor` float NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `operacao`
--

CREATE TABLE `operacao` (
  `id` int(11) NOT NULL,
  `id_respon` int(11) NOT NULL,
  `valor` float NOT NULL,
  `obs` varchar(300) DEFAULT NULL,
  `data_op` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `operacao`
--

INSERT INTO `operacao` (`id`, `id_respon`, `valor`, `obs`, `data_op`) VALUES
(3, 1, 900, 'asknaoskdnasdsad', '2025-05-20 16:18:31');

-- --------------------------------------------------------

--
-- Estrutura para tabela `pedidocompra`
--

CREATE TABLE `pedidocompra` (
  `id_pedido` int(11) NOT NULL,
  `id_insumo` int(11) DEFAULT NULL,
  `id_usuario` int(11) DEFAULT NULL,
  `dataEmissao` date NOT NULL,
  `pedido_status` varchar(255) NOT NULL,
  `qntComprar` float NOT NULL,
  `observacao` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `permissao`
--

CREATE TABLE `permissao` (
  `id_usuario` int(11) DEFAULT NULL,
  `vendas` tinyint(1) DEFAULT NULL,
  `estoque` tinyint(1) DEFAULT NULL,
  `financeiro` tinyint(1) DEFAULT NULL,
  `gestao` tinyint(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `permissao`
--

INSERT INTO `permissao` (`id_usuario`, `vendas`, `estoque`, `financeiro`, `gestao`) VALUES
(1, 1, 1, 1, 1);

-- --------------------------------------------------------

--
-- Estrutura para tabela `produto`
--

CREATE TABLE `produto` (
  `id_produto` int(11) NOT NULL,
  `nome` varchar(255) NOT NULL,
  `categoria` varchar(255) NOT NULL,
  `valor` float NOT NULL,
  `quantidade` float NOT NULL,
  `lote` varchar(255) DEFAULT NULL,
  `vencimento` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `produto`
--

INSERT INTO `produto` (`id_produto`, `nome`, `categoria`, `valor`, `quantidade`, `lote`, `vencimento`) VALUES
(1, 'Coca-Cola lata', 'Bebida', 7.8, 30, '1', '2025-04-29'),
(2, 'Macarrão', 'Prato', 24.9, 1, '2', '2025-04-29');

-- --------------------------------------------------------

--
-- Estrutura para tabela `produtoinsumo`
--

CREATE TABLE `produtoinsumo` (
  `id_produto` int(11) DEFAULT NULL,
  `id_insumo` int(11) DEFAULT NULL,
  `quantidade` varchar(255) DEFAULT NULL,
  `observacoes` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `produto_alergia`
--

CREATE TABLE `produto_alergia` (
  `id_produto` int(11) NOT NULL,
  `id_alergia` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `tipodespesa`
--

CREATE TABLE `tipodespesa` (
  `id_despesa` int(11) DEFAULT NULL,
  `nome` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `usuario`
--

CREATE TABLE `usuario` (
  `id_usuario` int(11) NOT NULL,
  `nome` varchar(255) NOT NULL,
  `contato` varchar(255) DEFAULT NULL,
  `username` varchar(255) NOT NULL,
  `senha` varchar(255) NOT NULL,
  `cargo` varchar(255) NOT NULL,
  `ehAdm` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `usuario`
--

INSERT INTO `usuario` (`id_usuario`, `nome`, `contato`, `username`, `senha`, `cargo`, `ehAdm`) VALUES
(1, 'Matheus Lucas da Silva', '41999999999', 'matheus.ls', '123', 'Gestor', 1),
(3, 'Danton Talles Costa', NULL, 'Talles.costa', '123', 'Financeiro', 0);

-- --------------------------------------------------------

--
-- Estrutura para tabela `venda`
--

CREATE TABLE `venda` (
  `id` int(11) NOT NULL,
  `numComanda` int(11) DEFAULT NULL,
  `nomeCliente` varchar(255) DEFAULT NULL,
  `data_emissao` date NOT NULL,
  `formaPagamento` varchar(255) NOT NULL,
  `statuscmd` char(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `venda`
--

INSERT INTO `venda` (`id`, `numComanda`, `nomeCliente`, `data_emissao`, `formaPagamento`, `statuscmd`) VALUES
(1, 1, 'Matheus', '2025-04-29', 'Débito', 'F'),
(4, 2, 'Luana', '2025-04-29', '', 'F'),
(5, 3, 'Pipinho', '2025-04-29', '', 'F'),
(6, 4, 'Felipe', '2025-04-29', '', 'F'),
(7, 5, 'Zé', '2025-04-29', 'Débito', 'F'),
(8, 6, 'Jefersson', '2025-04-29', '', 'F'),
(12, 1, 'Matheus', '2025-05-13', '', 'F'),
(13, 2, 'Pipinho', '2025-05-13', '', 'F');

-- --------------------------------------------------------

--
-- Estrutura para tabela `venda_produto`
--

CREATE TABLE `venda_produto` (
  `id_produto` int(11) NOT NULL,
  `id_venda` int(11) NOT NULL,
  `qntd` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `venda_produto`
--

INSERT INTO `venda_produto` (`id_produto`, `id_venda`, `qntd`) VALUES
(1, 1, 1),
(2, 1, 1),
(1, 4, 7),
(2, 4, 10),
(1, 5, 1),
(1, 6, 2),
(1, 8, 2),
(2, 8, 1),
(1, 7, 2),
(1, 12, 2),
(2, 12, 4),
(1, 13, 9);

--
-- Índices para tabelas despejadas
--

--
-- Índices de tabela `alergia`
--
ALTER TABLE `alergia`
  ADD PRIMARY KEY (`id_alergia`);

--
-- Índices de tabela `caixa`
--
ALTER TABLE `caixa`
  ADD PRIMARY KEY (`id_op`),
  ADD KEY `id_usuario` (`id_usuario`);

--
-- Índices de tabela `despesa`
--
ALTER TABLE `despesa`
  ADD PRIMARY KEY (`id_despesa`),
  ADD KEY `id_usuario` (`id_usuario`);

--
-- Índices de tabela `dfc`
--
ALTER TABLE `dfc`
  ADD PRIMARY KEY (`id_dfc`),
  ADD KEY `id_usuario` (`id_usuario`);

--
-- Índices de tabela `insumo`
--
ALTER TABLE `insumo`
  ADD PRIMARY KEY (`id_insumo`);

--
-- Índices de tabela `linha`
--
ALTER TABLE `linha`
  ADD KEY `id_dfc` (`id_dfc`);

--
-- Índices de tabela `operacao`
--
ALTER TABLE `operacao`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_respon` (`id_respon`);

--
-- Índices de tabela `pedidocompra`
--
ALTER TABLE `pedidocompra`
  ADD PRIMARY KEY (`id_pedido`),
  ADD KEY `id_usuario` (`id_usuario`),
  ADD KEY `id_insumo` (`id_insumo`);

--
-- Índices de tabela `permissao`
--
ALTER TABLE `permissao`
  ADD KEY `id_usuario` (`id_usuario`);

--
-- Índices de tabela `produto`
--
ALTER TABLE `produto`
  ADD PRIMARY KEY (`id_produto`);

--
-- Índices de tabela `produtoinsumo`
--
ALTER TABLE `produtoinsumo`
  ADD KEY `id_produto` (`id_produto`),
  ADD KEY `id_insumo` (`id_insumo`);

--
-- Índices de tabela `produto_alergia`
--
ALTER TABLE `produto_alergia`
  ADD KEY `id_produto` (`id_produto`),
  ADD KEY `id_alergia` (`id_alergia`);

--
-- Índices de tabela `tipodespesa`
--
ALTER TABLE `tipodespesa`
  ADD KEY `id_despesa` (`id_despesa`);

--
-- Índices de tabela `usuario`
--
ALTER TABLE `usuario`
  ADD PRIMARY KEY (`id_usuario`);

--
-- Índices de tabela `venda`
--
ALTER TABLE `venda`
  ADD PRIMARY KEY (`id`);

--
-- Índices de tabela `venda_produto`
--
ALTER TABLE `venda_produto`
  ADD KEY `id_produto` (`id_produto`),
  ADD KEY `id_venda` (`id_venda`);

--
-- AUTO_INCREMENT para tabelas despejadas
--

--
-- AUTO_INCREMENT de tabela `alergia`
--
ALTER TABLE `alergia`
  MODIFY `id_alergia` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `caixa`
--
ALTER TABLE `caixa`
  MODIFY `id_op` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT de tabela `despesa`
--
ALTER TABLE `despesa`
  MODIFY `id_despesa` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `dfc`
--
ALTER TABLE `dfc`
  MODIFY `id_dfc` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `insumo`
--
ALTER TABLE `insumo`
  MODIFY `id_insumo` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `operacao`
--
ALTER TABLE `operacao`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de tabela `pedidocompra`
--
ALTER TABLE `pedidocompra`
  MODIFY `id_pedido` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `produto`
--
ALTER TABLE `produto`
  MODIFY `id_produto` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de tabela `usuario`
--
ALTER TABLE `usuario`
  MODIFY `id_usuario` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de tabela `venda`
--
ALTER TABLE `venda`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- Restrições para tabelas despejadas
--

--
-- Restrições para tabelas `caixa`
--
ALTER TABLE `caixa`
  ADD CONSTRAINT `caixa_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`);

--
-- Restrições para tabelas `despesa`
--
ALTER TABLE `despesa`
  ADD CONSTRAINT `despesa_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`);

--
-- Restrições para tabelas `dfc`
--
ALTER TABLE `dfc`
  ADD CONSTRAINT `dfc_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`);

--
-- Restrições para tabelas `linha`
--
ALTER TABLE `linha`
  ADD CONSTRAINT `linha_ibfk_1` FOREIGN KEY (`id_dfc`) REFERENCES `dfc` (`id_dfc`);

--
-- Restrições para tabelas `operacao`
--
ALTER TABLE `operacao`
  ADD CONSTRAINT `operacao_ibfk_1` FOREIGN KEY (`id_respon`) REFERENCES `usuario` (`id_usuario`);

--
-- Restrições para tabelas `pedidocompra`
--
ALTER TABLE `pedidocompra`
  ADD CONSTRAINT `pedidocompra_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`),
  ADD CONSTRAINT `pedidocompra_ibfk_2` FOREIGN KEY (`id_insumo`) REFERENCES `insumo` (`id_insumo`);

--
-- Restrições para tabelas `permissao`
--
ALTER TABLE `permissao`
  ADD CONSTRAINT `permissao_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`);

--
-- Restrições para tabelas `produtoinsumo`
--
ALTER TABLE `produtoinsumo`
  ADD CONSTRAINT `produtoinsumo_ibfk_1` FOREIGN KEY (`id_produto`) REFERENCES `produto` (`id_produto`),
  ADD CONSTRAINT `produtoinsumo_ibfk_2` FOREIGN KEY (`id_insumo`) REFERENCES `insumo` (`id_insumo`);

--
-- Restrições para tabelas `produto_alergia`
--
ALTER TABLE `produto_alergia`
  ADD CONSTRAINT `produto_alergia_ibfk_1` FOREIGN KEY (`id_produto`) REFERENCES `produto` (`id_produto`),
  ADD CONSTRAINT `produto_alergia_ibfk_2` FOREIGN KEY (`id_alergia`) REFERENCES `alergia` (`id_alergia`);

--
-- Restrições para tabelas `tipodespesa`
--
ALTER TABLE `tipodespesa`
  ADD CONSTRAINT `tipodespesa_ibfk_1` FOREIGN KEY (`id_despesa`) REFERENCES `despesa` (`id_despesa`);

--
-- Restrições para tabelas `venda_produto`
--
ALTER TABLE `venda_produto`
  ADD CONSTRAINT `venda_produto_ibfk_1` FOREIGN KEY (`id_produto`) REFERENCES `produto` (`id_produto`) ON DELETE CASCADE,
  ADD CONSTRAINT `venda_produto_ibfk_2` FOREIGN KEY (`id_venda`) REFERENCES `venda` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
