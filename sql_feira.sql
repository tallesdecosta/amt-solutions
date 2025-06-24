-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3307
-- Tempo de geração: 24-Jun-2025 às 23:48
-- Versão do servidor: 10.4.24-MariaDB
-- versão do PHP: 8.1.6

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
-- Estrutura da tabela `alergia`
--

CREATE TABLE `alergia` (
  `id_alergia` int(11) NOT NULL,
  `nome` varchar(255) NOT NULL,
  `observacao` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Extraindo dados da tabela `alergia`
--

INSERT INTO `alergia` (`id_alergia`, `nome`, `observacao`) VALUES
(1, 'Glúten', NULL),
(2, 'Lactose', NULL),
(3, 'Leite de vaca', NULL),
(4, 'Ovos', NULL),
(5, 'Amendoim', NULL),
(6, 'Frutos secos (nozes, castanhas, amêndoas, etc.)', NULL),
(7, 'Soja', NULL),
(8, 'Trigo', NULL),
(9, 'Peixes', NULL),
(10, 'Frutos do mar (camarão, lagosta, caranguejo, etc.)', NULL),
(11, 'Corantes artificiais', NULL),
(12, 'Conservantes', NULL),
(13, 'Sulfitos', NULL),
(14, 'Aipo', NULL),
(15, 'Mostarda', NULL),
(16, 'Gergelim', NULL),
(17, 'Milho', NULL),
(18, 'Chocolate', NULL),
(19, 'Cafeína', NULL),
(20, 'Aspartame', NULL),
(21, 'Frutose', NULL),
(22, 'Histamina', NULL),
(23, 'Glutamato monossódico (MSG)', NULL),
(24, 'Alho', NULL),
(25, 'Cebola', NULL);

-- --------------------------------------------------------

--
-- Estrutura da tabela `caixa`
--

CREATE TABLE `caixa` (
  `id_op` int(11) NOT NULL,
  `valor_ini` float NOT NULL,
  `valor_final` float DEFAULT NULL,
  `id_ini` int(11) NOT NULL,
  `id_final` int(11) DEFAULT NULL,
  `nome_op` varchar(50) NOT NULL,
  `hora_ini` datetime NOT NULL,
  `hora_final` datetime DEFAULT NULL,
  `obs` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Extraindo dados da tabela `caixa`
--

INSERT INTO `caixa` (`id_op`, `valor_ini`, `valor_final`, `id_ini`, `id_final`, `nome_op`, `hora_ini`, `hora_final`, `obs`) VALUES
(1, 0, 100, 2, 1, 'Fechamento', '2025-06-24 18:45:55', '2025-06-24 18:46:09', 'Fechou certinho'),
(2, 200, 300, 1, 1, 'Entrada', '2025-06-24 18:46:27', '2025-06-24 18:46:27', 'Entrou 200 reais'),
(3, -20, 280, 2, 2, 'Saida', '2025-06-24 18:46:45', '2025-06-24 18:46:45', 'Comprei pão ');

-- --------------------------------------------------------

--
-- Estrutura da tabela `despesa`
--

CREATE TABLE `despesa` (
  `id_despesa` int(11) NOT NULL,
  `id_tipo_despesa` int(11) DEFAULT NULL,
  `id_usuario` int(11) DEFAULT NULL,
  `descritivo` varchar(255) NOT NULL,
  `valor` float NOT NULL,
  `dataInicio` date NOT NULL,
  `dataVencimento` date NOT NULL,
  `estaPago` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estrutura da tabela `dfc`
--

CREATE TABLE `dfc` (
  `id_dfc` int(11) NOT NULL,
  `id_usuario` int(11) DEFAULT NULL,
  `titulo` varchar(255) NOT NULL,
  `dataInicio` date NOT NULL,
  `dataFinal` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estrutura da tabela `insumo`
--

CREATE TABLE `insumo` (
  `id_insumo` int(11) NOT NULL,
  `nome` varchar(255) NOT NULL,
  `classificacao` varchar(255) NOT NULL,
  `qntMinima` float NOT NULL,
  `inspReceb` varchar(5) NOT NULL,
  `localizacao` varchar(255) NOT NULL,
  `unidMedida` varchar(255) NOT NULL,
  `quantidadeTotal` float NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Extraindo dados da tabela `insumo`
--

INSERT INTO `insumo` (`id_insumo`, `nome`, `classificacao`, `qntMinima`, `inspReceb`, `localizacao`, `unidMedida`, `quantidadeTotal`) VALUES
(1, 'Tomate', 'Frutas e polpas', 60, 'Sim', 'geladeira', '', 0),
(2, 'Sal', 'Temperos e condimentos', 100, 'Não', 'prateleira', '', 0),
(3, 'Cebola', 'Legumes e verduras', 30, 'Sim', 'geladeira', '', 0),
(4, 'Leite', 'Laticínios', 15, 'Não', 'armario', '', 0),
(5, 'Alho', 'Temperos e condimentos', 15, 'Não', 'geladeira', '', 0),
(6, 'Oregano', 'Temperos e condimentos', 10, 'Não', 'prateleira', '', 0),
(7, 'Açúcar', 'Açúcares e adoçantes', 20, 'Não', 'prateleira', '', 0);

-- --------------------------------------------------------

--
-- Estrutura da tabela `insumolote`
--

CREATE TABLE `insumolote` (
  `id_Lote` int(11) NOT NULL,
  `id_insumo` int(11) DEFAULT NULL,
  `lote` varchar(255) NOT NULL,
  `vencimento` date NOT NULL,
  `fornecedor` varchar(255) NOT NULL,
  `quantidade` float NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Extraindo dados da tabela `insumolote`
--

INSERT INTO `insumolote` (`id_Lote`, `id_insumo`, `lote`, `vencimento`, `fornecedor`, `quantidade`) VALUES
(1, 1, 'Tomate-1', '2025-07-18', 'Condor', 60),
(2, 2, 'Sal-1', '2026-01-02', 'Wallmart', 19),
(3, 3, 'Cebola-1', '2025-06-30', 'Festival', 10),
(4, 4, 'Leite-1', '2025-11-22', 'Fiesta', 10),
(5, 5, 'Alho-1', '2025-11-01', 'Cabral', 3),
(6, 6, 'Oregano-1', '2026-07-03', 'Eliza', 3),
(7, 7, 'Açúcar-1', '2026-05-15', 'Açai Atacadista', 0);

-- --------------------------------------------------------

--
-- Estrutura da tabela `linha`
--

CREATE TABLE `linha` (
  `id_dfc` int(11) DEFAULT NULL,
  `nome` varchar(255) NOT NULL,
  `tipo` varchar(255) NOT NULL,
  `valor` float NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estrutura da tabela `pedidocompra`
--

CREATE TABLE `pedidocompra` (
  `id_pedido` int(11) NOT NULL,
  `id_insumo` int(11) NOT NULL,
  `id_usuario` int(11) NOT NULL,
  `dataEmissao` date NOT NULL,
  `pedido_status` varchar(255) NOT NULL,
  `qntComprar` float NOT NULL,
  `observacao` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Extraindo dados da tabela `pedidocompra`
--

INSERT INTO `pedidocompra` (`id_pedido`, `id_insumo`, `id_usuario`, `dataEmissao`, `pedido_status`, `qntComprar`, `observacao`) VALUES
(1, 1, 2, '2025-06-24', 'Pendente', 20, 'Precisa comprar 20 tomates, pois está próximo a quantidade mínima.'),
(2, 4, 1, '2025-06-24', 'Pendente', 30, 'Leite está chegando próximo ao vencimento.');

-- --------------------------------------------------------

--
-- Estrutura da tabela `permissao`
--

CREATE TABLE `permissao` (
  `id_usuario` int(11) DEFAULT NULL,
  `vendas` tinyint(1) DEFAULT NULL,
  `estoque` tinyint(1) DEFAULT NULL,
  `financeiro` tinyint(1) DEFAULT NULL,
  `gestao` tinyint(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Extraindo dados da tabela `permissao`
--

INSERT INTO `permissao` (`id_usuario`, `vendas`, `estoque`, `financeiro`, `gestao`) VALUES
(1, 1, 1, 1, 1),
(2, 1, 0, 0, 0);

-- --------------------------------------------------------

--
-- Estrutura da tabela `produto`
--

CREATE TABLE `produto` (
  `id_produto` int(11) NOT NULL,
  `nome` varchar(255) NOT NULL,
  `categoria` varchar(255) NOT NULL,
  `qntMinima` float NOT NULL,
  `valor` float NOT NULL,
  `localizacao` varchar(255) NOT NULL,
  `unidMedida` varchar(255) NOT NULL,
  `quantidadeTotal` float NOT NULL,
  `imagem` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Extraindo dados da tabela `produto`
--

INSERT INTO `produto` (`id_produto`, `nome`, `categoria`, `qntMinima`, `valor`, `localizacao`, `unidMedida`, `quantidadeTotal`, `imagem`) VALUES
(1, 'Macarrão Molho Branco', 'Pratos principais', 1, 26.9, 'prato', '', 0, NULL),
(2, 'Macarrão Carbonara', 'Pratos principais', 1, 26.9, 'prato', '', 0, NULL),
(3, 'Coca-Cola Lata ', 'Bebidas', 50, 5.9, 'geladeira', '', 0, NULL),
(4, 'Limonada', 'Bebidas', 1, 10, 'geladeira', '', 0, NULL),
(5, 'Frango Gelhado', 'Pratos principais', 1, 23.9, 'prato', '', 0, NULL),
(6, 'Pudim', 'Sobremesas', 1, 7.99, 'geladeira', '', 0, NULL),
(7, 'Monster', 'Bebidas', 30, 10.6, 'geladeira', '', 0, NULL);

-- --------------------------------------------------------

--
-- Estrutura da tabela `produtolote`
--

CREATE TABLE `produtolote` (
  `id_Lote` int(11) NOT NULL,
  `id_produto` int(11) DEFAULT NULL,
  `lote` varchar(255) NOT NULL,
  `vencimento` date NOT NULL,
  `fornecedor` varchar(255) NOT NULL,
  `quantidade` float NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Extraindo dados da tabela `produtolote`
--

INSERT INTO `produtolote` (`id_Lote`, `id_produto`, `lote`, `vencimento`, `fornecedor`, `quantidade`) VALUES
(1, 2, 'Lote-1', '2025-06-25', 'Condor', 1),
(2, 6, 'Pudim-1', '2025-06-30', 'Wallmart', 10);

-- --------------------------------------------------------

--
-- Estrutura da tabela `produtoloteinsumo`
--

CREATE TABLE `produtoloteinsumo` (
  `id` int(11) NOT NULL,
  `id_produtoLote` int(11) DEFAULT NULL,
  `id_insumoLote` int(11) DEFAULT NULL,
  `quantidade_utilizada` float NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Extraindo dados da tabela `produtoloteinsumo`
--

INSERT INTO `produtoloteinsumo` (`id`, `id_produtoLote`, `id_insumoLote`, `quantidade_utilizada`) VALUES
(1, 1, 2, 1),
(2, 1, 1, 10),
(3, 1, 5, 5),
(4, 2, 4, 20),
(5, 2, 7, 5);

-- --------------------------------------------------------

--
-- Estrutura da tabela `produto_alergia`
--

CREATE TABLE `produto_alergia` (
  `id_produto` int(11) NOT NULL,
  `id_alergia` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Extraindo dados da tabela `produto_alergia`
--

INSERT INTO `produto_alergia` (`id_produto`, `id_alergia`) VALUES
(1, 1),
(1, 2),
(2, 1);

-- --------------------------------------------------------

--
-- Estrutura da tabela `tipodespesa`
--

CREATE TABLE `tipodespesa` (
  `id_tipo_despesa` int(11) NOT NULL,
  `nome` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estrutura da tabela `usuario`
--

CREATE TABLE `usuario` (
  `id_usuario` int(11) NOT NULL,
  `nome` varchar(255) NOT NULL,
  `contato` varchar(255) DEFAULT NULL,
  `username` varchar(255) NOT NULL,
  `senha` varchar(255) NOT NULL,
  `cargo` varchar(255) NOT NULL,
  `ehAdm` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Extraindo dados da tabela `usuario`
--

INSERT INTO `usuario` (`id_usuario`, `nome`, `contato`, `username`, `senha`, `cargo`, `ehAdm`) VALUES
(1, 'Admin', '22', 'admin', '$2y$10$eG2q9V2GLO2Bz9yXEzxp5eQeUQYnUxPHHB0NjHWce2WyusEJCLoCG', 'Administrador', 1),
(2, 'Matheus Lucas', '419999999999', 'matheus.1', '$2y$10$ncDlxx9fxwaTy5CKhDDRE.WsQvRilpQ2s1BniHFrlzVsFo89xwO52', 'Atendente', 0);

-- --------------------------------------------------------

--
-- Estrutura da tabela `venda`
--

CREATE TABLE `venda` (
  `id` int(11) NOT NULL,
  `numComanda` int(11) DEFAULT NULL,
  `nomeCliente` varchar(255) DEFAULT NULL,
  `data_emissao` datetime NOT NULL,
  `formaPagamento` varchar(255) NOT NULL,
  `statuscmd` char(1) NOT NULL,
  `valor` float DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Extraindo dados da tabela `venda`
--

INSERT INTO `venda` (`id`, `numComanda`, `nomeCliente`, `data_emissao`, `formaPagamento`, `statuscmd`, `valor`) VALUES
(1, 1, 'Jose', '2025-06-24 18:43:46', 'Débito', 'F', 92.5),
(2, 2, 'Maria', '2025-06-24 18:44:15', 'Dinheiro', 'F', 59.7),
(3, 3, 'Pipinho', '2025-06-24 18:44:29', 'Crédito', 'F', 37.18),
(4, 12, 'João', '2025-06-24 18:44:54', 'Débito', 'F', 57.8),
(5, 1, 'Matheus', '2025-06-24 18:45:34', 'Dinheiro', 'F', 48.1),
(6, 1, 'Matheus', '2025-06-24 18:47:03', 'Crédito', 'A', NULL),
(7, 2, 'João', '2025-06-24 18:47:19', '', 'A', NULL),
(8, 3, 'Luana', '2025-06-24 18:47:36', '', 'A', NULL);

-- --------------------------------------------------------

--
-- Estrutura da tabela `venda_produto`
--

CREATE TABLE `venda_produto` (
  `id_produto` int(11) NOT NULL,
  `id_venda` int(11) NOT NULL,
  `qntd` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Extraindo dados da tabela `venda_produto`
--

INSERT INTO `venda_produto` (`id_produto`, `id_venda`, `qntd`) VALUES
(1, 1, 3),
(3, 1, 2),
(1, 2, 1),
(2, 2, 1),
(3, 2, 1),
(6, 3, 2),
(7, 3, 2),
(4, 4, 1),
(5, 4, 2),
(1, 5, 1),
(7, 5, 2),
(2, 6, 1),
(3, 6, 2),
(5, 7, 1),
(7, 7, 1),
(1, 8, 2),
(3, 8, 2);

--
-- Índices para tabelas despejadas
--

--
-- Índices para tabela `alergia`
--
ALTER TABLE `alergia`
  ADD PRIMARY KEY (`id_alergia`);

--
-- Índices para tabela `caixa`
--
ALTER TABLE `caixa`
  ADD PRIMARY KEY (`id_op`),
  ADD KEY `id_ini` (`id_ini`),
  ADD KEY `id_final` (`id_final`);

--
-- Índices para tabela `despesa`
--
ALTER TABLE `despesa`
  ADD PRIMARY KEY (`id_despesa`),
  ADD KEY `id_usuario` (`id_usuario`),
  ADD KEY `id_tipo_despesa` (`id_tipo_despesa`);

--
-- Índices para tabela `dfc`
--
ALTER TABLE `dfc`
  ADD PRIMARY KEY (`id_dfc`),
  ADD KEY `id_usuario` (`id_usuario`);

--
-- Índices para tabela `insumo`
--
ALTER TABLE `insumo`
  ADD PRIMARY KEY (`id_insumo`);

--
-- Índices para tabela `insumolote`
--
ALTER TABLE `insumolote`
  ADD PRIMARY KEY (`id_Lote`),
  ADD KEY `id_insumo` (`id_insumo`);

--
-- Índices para tabela `linha`
--
ALTER TABLE `linha`
  ADD KEY `id_dfc` (`id_dfc`);

--
-- Índices para tabela `pedidocompra`
--
ALTER TABLE `pedidocompra`
  ADD PRIMARY KEY (`id_pedido`),
  ADD KEY `id_usuario` (`id_usuario`),
  ADD KEY `id_insumo` (`id_insumo`);

--
-- Índices para tabela `permissao`
--
ALTER TABLE `permissao`
  ADD KEY `id_usuario` (`id_usuario`);

--
-- Índices para tabela `produto`
--
ALTER TABLE `produto`
  ADD PRIMARY KEY (`id_produto`);

--
-- Índices para tabela `produtolote`
--
ALTER TABLE `produtolote`
  ADD PRIMARY KEY (`id_Lote`),
  ADD KEY `id_produto` (`id_produto`);

--
-- Índices para tabela `produtoloteinsumo`
--
ALTER TABLE `produtoloteinsumo`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_produtoLote` (`id_produtoLote`),
  ADD KEY `id_insumoLote` (`id_insumoLote`);

--
-- Índices para tabela `produto_alergia`
--
ALTER TABLE `produto_alergia`
  ADD KEY `id_produto` (`id_produto`),
  ADD KEY `id_alergia` (`id_alergia`);

--
-- Índices para tabela `tipodespesa`
--
ALTER TABLE `tipodespesa`
  ADD PRIMARY KEY (`id_tipo_despesa`);

--
-- Índices para tabela `usuario`
--
ALTER TABLE `usuario`
  ADD PRIMARY KEY (`id_usuario`);

--
-- Índices para tabela `venda`
--
ALTER TABLE `venda`
  ADD PRIMARY KEY (`id`);

--
-- Índices para tabela `venda_produto`
--
ALTER TABLE `venda_produto`
  ADD KEY `id_produto` (`id_produto`),
  ADD KEY `id_venda` (`id_venda`);

--
-- AUTO_INCREMENT de tabelas despejadas
--

--
-- AUTO_INCREMENT de tabela `alergia`
--
ALTER TABLE `alergia`
  MODIFY `id_alergia` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

--
-- AUTO_INCREMENT de tabela `caixa`
--
ALTER TABLE `caixa`
  MODIFY `id_op` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

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
  MODIFY `id_insumo` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT de tabela `insumolote`
--
ALTER TABLE `insumolote`
  MODIFY `id_Lote` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT de tabela `pedidocompra`
--
ALTER TABLE `pedidocompra`
  MODIFY `id_pedido` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de tabela `produto`
--
ALTER TABLE `produto`
  MODIFY `id_produto` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT de tabela `produtolote`
--
ALTER TABLE `produtolote`
  MODIFY `id_Lote` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de tabela `produtoloteinsumo`
--
ALTER TABLE `produtoloteinsumo`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de tabela `tipodespesa`
--
ALTER TABLE `tipodespesa`
  MODIFY `id_tipo_despesa` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `usuario`
--
ALTER TABLE `usuario`
  MODIFY `id_usuario` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de tabela `venda`
--
ALTER TABLE `venda`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- Restrições para despejos de tabelas
--

--
-- Limitadores para a tabela `caixa`
--
ALTER TABLE `caixa`
  ADD CONSTRAINT `caixa_ibfk_1` FOREIGN KEY (`id_ini`) REFERENCES `usuario` (`id_usuario`),
  ADD CONSTRAINT `caixa_ibfk_2` FOREIGN KEY (`id_final`) REFERENCES `usuario` (`id_usuario`);

--
-- Limitadores para a tabela `despesa`
--
ALTER TABLE `despesa`
  ADD CONSTRAINT `despesa_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`),
  ADD CONSTRAINT `despesa_ibfk_2` FOREIGN KEY (`id_tipo_despesa`) REFERENCES `tipodespesa` (`id_tipo_despesa`);

--
-- Limitadores para a tabela `dfc`
--
ALTER TABLE `dfc`
  ADD CONSTRAINT `dfc_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`);

--
-- Limitadores para a tabela `insumolote`
--
ALTER TABLE `insumolote`
  ADD CONSTRAINT `insumolote_ibfk_1` FOREIGN KEY (`id_insumo`) REFERENCES `insumo` (`id_insumo`);

--
-- Limitadores para a tabela `linha`
--
ALTER TABLE `linha`
  ADD CONSTRAINT `linha_ibfk_1` FOREIGN KEY (`id_dfc`) REFERENCES `dfc` (`id_dfc`);

--
-- Limitadores para a tabela `pedidocompra`
--
ALTER TABLE `pedidocompra`
  ADD CONSTRAINT `pedidocompra_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`),
  ADD CONSTRAINT `pedidocompra_ibfk_2` FOREIGN KEY (`id_insumo`) REFERENCES `insumo` (`id_insumo`);

--
-- Limitadores para a tabela `permissao`
--
ALTER TABLE `permissao`
  ADD CONSTRAINT `permissao_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`);

--
-- Limitadores para a tabela `produtolote`
--
ALTER TABLE `produtolote`
  ADD CONSTRAINT `produtolote_ibfk_1` FOREIGN KEY (`id_produto`) REFERENCES `produto` (`id_produto`);

--
-- Limitadores para a tabela `produtoloteinsumo`
--
ALTER TABLE `produtoloteinsumo`
  ADD CONSTRAINT `produtoloteinsumo_ibfk_1` FOREIGN KEY (`id_produtoLote`) REFERENCES `produtolote` (`id_Lote`),
  ADD CONSTRAINT `produtoloteinsumo_ibfk_2` FOREIGN KEY (`id_insumoLote`) REFERENCES `insumolote` (`id_Lote`);

--
-- Limitadores para a tabela `produto_alergia`
--
ALTER TABLE `produto_alergia`
  ADD CONSTRAINT `produto_alergia_ibfk_1` FOREIGN KEY (`id_produto`) REFERENCES `produto` (`id_produto`),
  ADD CONSTRAINT `produto_alergia_ibfk_2` FOREIGN KEY (`id_alergia`) REFERENCES `alergia` (`id_alergia`);

--
-- Limitadores para a tabela `venda_produto`
--
ALTER TABLE `venda_produto`
  ADD CONSTRAINT `venda_produto_ibfk_1` FOREIGN KEY (`id_produto`) REFERENCES `produto` (`id_produto`) ON DELETE CASCADE,
  ADD CONSTRAINT `venda_produto_ibfk_2` FOREIGN KEY (`id_venda`) REFERENCES `venda` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
