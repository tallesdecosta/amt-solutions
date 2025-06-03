async function iniciar() {

    despesas = await pesquisarDespesas();

    tiposDespesa = await pesquisarTiposDespesas();

    atualizarTiposDespesas(tiposDespesa);
    atualizarResumo(despesas);
    atualizarDespesas(despesas);


}



async function pesquisarDespesas() {

const hoje = new Date();
const diasAtras = 90;

const data90DiasAtras = new Date();
data90DiasAtras.setDate(hoje.getDate() - diasAtras);

    inicio = formatarData(data90DiasAtras);
    fim = formatarData(hoje);

    try {

    res = await fetch(`../php/api/despesa.php?inicio=${inicio}&fim=${fim}`, {
        method: "GET"
    });

    if (res.redirected) {
    window.location.href = res.url;
    return;
  }

    if (!res.ok) {
        throw new Error(`HTTP ERROR! Status: ${res.status}`)
    } else {
        data = await res.json();
        return data;
    }

    

    } catch(erro) {
        alerta(0, 0, "Estamos com problemas de conexão, por favor tente novamente mais tarde.", 1)
        console.log(erro)
    }

}

function formatarData(data) {
  const ano = data.getFullYear();
  const mes = String(data.getMonth() + 1).padStart(2, '0'); // +1 porque janeiro é 0
  const dia = String(data.getDate()).padStart(2, '0');
  return `${ano}-${mes}-${dia}`;
}

async function pesquisarTiposDespesas() {

    res = await fetch('../php/api/tipo_despesa.php', {
        method: "GET"
    });

    data = await res.json();

    return data;

}

function atualizarResumo(data) {

    valor = 0;

    for (despesa in despesas) {
        if(despesas[despesa].estaPago == 0) {
            valor += parseFloat(despesas[despesa].valor);
        }
        

    };

    document.getElementById('resumo').textContent = valor.toLocaleString('pt-BR', {
  style: 'currency',
  currency: 'BRL'
}).replace(/\s/g, '');

}

function mostrarPopup (despesa, event) {
    document.getElementById('popup-wrapper').style.display = 'block';
    document.getElementById('bg-blur').style.display = 'block';
    document.getElementById('descritivo').value = despesas[despesa].descritivo;
    document.getElementById('valor').value = despesas[despesa].valor;
    document.getElementById('data-inicio').value = despesas[despesa].dataInicio;
    document.getElementById('data-fim').value = despesas[despesa].dataVencimento;
    document.getElementById('alterar-despesa').setAttribute('id_despesa', despesas[despesa].id_despesa);
    document.getElementById('status').checked =  parseInt(despesas[despesa].estaPago) == 1;
    mostrarTipoDespesaAlterarDespesa(despesa);
    


}

function atualizarDespesas(despesas) {

    containerFechadas = document.getElementById('despesas-fechadas');
    containerAbertas = document.getElementById('despesas-abertas');
    countAbertas = 1;
    countFechadas = 1;

    for (despesa in despesas) {
        if (despesas[despesa].estaPago == 0) {
        linha = document.createElement('tr');

        if (countAbertas % 2 != 0 && despesas[despesa].estaPago == '0') {
            linha.setAttribute('par', true);
        } else {
            linha.setAttribute('par', false);
        }

        linha.addEventListener('mouseover', function () {

            this.style.backgroundColor = '#A6A6A6';
            this.style.cursor = 'pointer';

        });

        linha.addEventListener('click', mostrarPopup.bind(null, despesa));

        linha.addEventListener('mouseleave', function () {
            if (this.getAttribute('par') == 'true') {

                this.style.backgroundColor = '#F2F2F2';
                
            } else {
                this.style.backgroundColor = 'transparent';
            }
            this.style.cursor = 'default';
            
            
        })



        if (countAbertas % 2 != 0 && despesas[despesa].estaPago == '0') {

            linha.style.backgroundColor = '#F2F2F2';

        } else if (countFechadas % 2 != 0 && despesas[despesa].estaPago == '1') {
            linha.style.backgroundColor = 'transparent';
        }
        linha.setAttribute('td-id', despesas[despesa].id_tipo_despesa);
        colaborador = document.createElement('p');
        colaborador.textContent = despesas[despesa].nome;
        colaborador.setAttribute('td-id', despesas[despesa].id_despesa);
        colaborador_td = document.createElement('td');
        colaborador_td.appendChild(colaborador);

        descritivo = document.createElement('p');
        descritivo.textContent = despesas[despesa].descritivo;
        descritivo.setAttribute('td-id', despesas[despesa].id_despesa);
        descritivo_td = document.createElement('td');
        descritivo_td.appendChild(descritivo);

        valor = document.createElement('p');
        valor.textContent = parseFloat(despesas[despesa].valor).toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
        }).replace(/\s/g, '');
        valor.style.color = "#8C0000";
        valor.setAttribute('td-id', despesas[despesa].id_despesa);
        valor_td = document.createElement('td');
        valor_td.appendChild(valor);

        dataInicio = document.createElement('p');
        dataInicio.textContent = despesas[despesa].dataInicio;
        dataInicio.setAttribute('td-id', despesas[despesa].id_despesa);
        dataInicio_td = document.createElement('td');
        dataInicio_td.appendChild(dataInicio);
        
        linha.appendChild(colaborador_td);
        linha.appendChild(descritivo_td);
        linha.appendChild(valor_td);
        linha.appendChild(dataInicio_td);

        

        if (despesas[despesa].estaPago == '0') {
            containerAbertas.appendChild(linha);
            countAbertas += 1;


        } else {

            containerFechadas.appendChild(linha);
            countFechadas += 1;
        }
    }

    };

    count = 1;

    for (despesa in despesas) {

        if (despesas[despesa].estaPago == 1) {
 

        linha = document.createElement('tr');

        if (count % 2 != 0) {
            linha.setAttribute('par', true);
        } else {
            linha.setAttribute('par', false);
        }

        linha.addEventListener('mouseover', function () {

            this.style.backgroundColor = '#A6A6A6';
            this.style.cursor = 'pointer';

        });

        linha.addEventListener('click', mostrarPopup.bind(null, despesa));

        linha.addEventListener('mouseleave', function () {
            if (this.getAttribute('par') == 'true') {

                this.style.backgroundColor = '#F2F2F2';
                
            } else {
                this.style.backgroundColor = 'transparent';
            }
            this.style.cursor = 'default';
            
            
        })



        if (count % 2 != 0) {

            linha.style.backgroundColor = '#F2F2F2';

        } else if (count % 2 == 0) {
            linha.style.backgroundColor = 'transparent';
        }
        linha.setAttribute('td-id', despesas[despesa].id_tipo_despesa);
        colaborador = document.createElement('p');
        colaborador.textContent = despesas[despesa].nome;
        colaborador.setAttribute('td-id', despesas[despesa].id_despesa);
        colaborador_td = document.createElement('td');
        colaborador_td.appendChild(colaborador);

        descritivo = document.createElement('p');
        descritivo.textContent = despesas[despesa].descritivo;
        descritivo.setAttribute('td-id', despesas[despesa].id_despesa);
        descritivo_td = document.createElement('td');
        descritivo_td.appendChild(descritivo);

        valor = document.createElement('p');
        valor.textContent = parseFloat(despesas[despesa].valor).toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
        }).replace(/\s/g, '');
        valor.style.color = "#3B209B";
        valor.setAttribute('td-id', despesas[despesa].id_despesa);
        valor_td = document.createElement('td');
        valor_td.appendChild(valor);

        dataInicio = document.createElement('p');
        dataInicio.textContent = despesas[despesa].dataInicio;
        dataInicio.setAttribute('td-id', despesas[despesa].id_despesa);
        dataInicio_td = document.createElement('td');
        dataInicio_td.appendChild(dataInicio);
        
        linha.appendChild(colaborador_td);
        linha.appendChild(descritivo_td);
        linha.appendChild(valor_td);
        linha.appendChild(dataInicio_td);

    

        containerFechadas.appendChild(linha);
        count += 1;
        
        }
    };

}

function atualizarTiposDespesas(despesas) {

    container = document.getElementById('tipos-despesas');
    count = 1;

    for (despesa in despesas) {

        linha = document.createElement('div');
        linha.style.padding = '15px 19px';

        if (count % 2 != 0) {

            linha.style.backgroundColor = '#F2F2F2';

        }

        btn = document.createElement('button');
        btn.textContent = despesas[despesa].nome;
        btn.style.cursor = "pointer";
        btn.setAttribute('td-id', despesas[despesa].id_tipo_despesa);
        btn.addEventListener('click', function()  {
            btn = this;
            for (i of this.parentNode.parentNode.children) {


                if(i.children[0] == btn) {
                    console.log(btn)
                    this.style.fontWeight = "500";

                } else 
                {
                    
                    i.children[0].style.fontWeight = "400";
                }
            }
            id = this.getAttribute('td-id');
            despesasFechadas = document.getElementById('despesas-fechadas').children;
            despesasAbertas = document.getElementById('despesas-abertas').children;


            for (i of despesasFechadas) {
                

                if (i.getAttribute('td-id') != id) {

                    i.style.display = 'none';
                } else {
                    i.style.display = '';

                }

                
                

            }

            for (i of despesasAbertas) {
                if (parseInt(i.getAttribute('td-id')) != id) {
                    i.style.display = 'none';
                } else {
                    i.style.display = '';

                }

                    
            }

        });

        linha.appendChild(btn);

        container.appendChild(linha);
        count += 1;

    };

    
}

async function addDespesa() {

    body = new URLSearchParams();

    if (!document.getElementById('descritivo-novo').checkValidity()) {

        document.getElementById('descritivo-novo').reportValidity(); 
        return;

    }

    if (!document.getElementById('valor-novo').checkValidity()) {

        document.getElementById('valor-novo').reportValidity(); 
        return;

    }

    if (!document.getElementById('data-inicio-novo').checkValidity()) {

        document.getElementById('data-inicio-novo').reportValidity(); 
        return;

    }

    if (!document.getElementById('data-fim-novo').checkValidity()) {

        document.getElementById('data-fim-novo').reportValidity(); 
        return;

    }

    if (!document.getElementById('tipo-despesa-select-novo').checkValidity()) {

        document.getElementById('tipo-despesa-select-novo').reportValidity(); 
        return;

    }

    body.append('descritivo', document.getElementById('descritivo-novo').value);
    body.append('valor', document.getElementById('valor-novo').value);
    body.append('dataInicio', document.getElementById('data-inicio-novo').value);
    body.append('dataVencimento', document.getElementById('data-fim-novo').value);
    body.append('tipo_despesa', document.getElementById('tipo-despesa-select-novo').value);

    try {

            res = await fetch('../php/api/despesa.php', {
            method: 'POST',
            body: body,
            credentials: "include"
        });

        if (res.redirected) {
    window.location.href = res.url;
    return;
  }

        if (res.ok) {
            window.location.reload();
        } else {
            throw new Error(`HTTP ERROR! Status: ${res.status}`)
        }

    }  catch(erro) {
        alerta(0, 0, "Estamos com problemas de conexão, por favor tente novamente mais tarde.", 1)
        console.log(erro)

    }
        

    
}

async function alterarDespesa() {

    body = new URLSearchParams();

        if (!document.getElementById('descritivo').checkValidity()) {

        document.getElementById('descritivo').reportValidity(); 
        return;

    }

    if (!document.getElementById('valor').checkValidity()) {

        document.getElementById('valor').reportValidity(); 
        return;

    }

    if (!document.getElementById('data-inicio').checkValidity()) {

        document.getElementById('data-inicio').reportValidity(); 
        return;

    }

    if (!document.getElementById('data-fim').checkValidity()) {

        document.getElementById('data-fim').reportValidity(); 
        return;

    }

    if (!document.getElementById('status').checkValidity()) {

        document.getElementById('status').reportValidity(); 
        return;

    }

    body.append('descritivo', document.getElementById('descritivo').value);
    body.append('valor', document.getElementById('valor').value);
    body.append('data-inicio', document.getElementById('data-inicio').value);
    body.append('data-fim', document.getElementById('data-fim').value);
    body.append('status', document.getElementById('status').checked == true ? 1 : 0);
    body.append('id_despesa', document.getElementById('alterar-despesa').getAttribute('id_despesa'));
    body.append('id_tipo_despesa', document.getElementById('tipo-despesa-select-alterar').value);
    try {
    
            res = await fetch('../php/api/despesa.php', {
            method: 'PUT',
            body: body,
            credentials: "include"
        });

        if (res.redirected) {
    window.location.href = res.url;
    return;
  }

        if (res.ok) {
            window.location.reload();
        } else {
            throw new Error(`HTTP ERROR! Status: ${res.status}`)
        }
    } catch(erro) {
        alerta(0, 0, "Estamos com problemas de conexão, por favor tente novamente mais tarde.", 1)
        console.log(erro)

    }
    
}

async function addTipoDespesa() {

    if (!document.getElementById('nome-tipo-despesa-nova').checkValidity()) {

        document.getElementById('nome-tipo-despesa-nova').reportValidity(); 
        return;

    }

    body = new URLSearchParams();
    body.append('nome', document.getElementById('nome-tipo-despesa-nova').value);

    
    try {

    
        res = await fetch('../php/api/tipo_despesa.php', {
            method: "POST",
            body: body
        });

        if (res.redirected) {
    window.location.href = res.url;
    return;
  }

        if (res.ok) {

            window.location.reload();

        } else {
            throw new Error(`HTTP ERROR! Status: ${res.status}`)
            
        } 
    } catch(error) {
        alerta(0, 0, "Estamos com problemas de conexão, por favor tente novamente mais tarde.", 1)
        console.log(error)
    }

}

async function mostrarTipoDespesaCriarDespesa() {

    data = await pesquisarTiposDespesas();

    select = document.getElementById('tipo-despesa-select-novo');

    if (select.children) {
        select.innerHTML = '';

    }

    for (i in data) {

        opt = document.createElement('option');
        opt.value = data[i].id_tipo_despesa;
        opt.textContent = data[i].nome;
        select.appendChild(opt)

    }

}

async function mostrarTipoDespesaAlterarDespesa(despesa) {

    data = await pesquisarTiposDespesas();

    select = document.getElementById('tipo-despesa-select-alterar');
    if (select.children) {
        select.innerHTML = '';

    }
    for (i in data) {

        opt = document.createElement('option');
        opt.value = data[i].id_tipo_despesa;
        opt.textContent = data[i].nome;
        select.appendChild(opt)

    }

    document.getElementById('tipo-despesa-select-alterar').value = despesas[despesa].id_tipo_despesa;

}




function alerta(icone, cor, text, nBotoes) {

  let icones = ['bi bi-cone-striped', 'bi bi-check-circle-fill', 'bi bi-exclamation-diamond-fill'] // 0 = cone, 1 = check, 2 = alert

  let cores = ['#d0ae3f', '#73df77', '#ebeb31', '#dd3f3f']// 0 = laranja, 1 = verder, 2 = amarelo, 3 = vermelho

  let alerta = document.getElementById('alertaPadrão')

  let body = document.querySelector('body')

  body.style.overflow = 'hidden'

  alerta.style.display = 'flex'

  let p = document.getElementById('pAlerta')
  let i = document.getElementById('iconeAlerta')

  i.className = icones[icone]
  i.style.color = `${cores[cor]}`
  p.innerText = text

  if (nBotoes == 2) {

    let botoes = document.getElementById('botoesAlerta')

    but1 = '<button class="but1" id="confirmAlerta">Confirmar</button>'
    but2 = '<button class="but2" id="cancelAlerta">Cancelar</button>'

    botoes.innerHtml = but1 + but2

    botoes.style.justifyContent = 'center'

    let cancel = document.getElementById('cancelAlerta')

    cancel.addEventListener("click", () => {

      alerta.style.display = 'none'

      body.style.overflow = 'auto'

    })

  } else if (nBotoes == 1) {

    let botoes = document.getElementById('botoesAlerta')

    but1 = '<button class="but1" id="confirmAlerta">Confirmar</button>'

    botoes.innerHTML = but1

    botoes.style.justifyContent = 'end'

    but1 = document.getElementById("confirmAlerta")

    but1.innerText = 'OK'

    but1.addEventListener("click", () => {

      alerta.style.display = 'none'

      body.style.overflow = 'auto'

    })
  }

}