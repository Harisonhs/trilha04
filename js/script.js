const logadoArmazenado = JSON.parse(sessionStorage.getItem("controleAtividade.logado"))
if (!logadoArmazenado) {
    window.location = "login.html"
}

const formulario = document.querySelector("#formulario")
const btnDeslogar = document.querySelector("#BtnLogout")

let atividadeArmazenada = localStorage.getItem("controleAtividades.atividade")

let listaAtividades = Array()
if (atividadeArmazenada != null) {
    listaAtividades = JSON.parse(atividadeArmazenada)

    listaAtividades.forEach((obj) => {
        insereNoDOM(obj)
    })
}

btnDeslogar.addEventListener('click', function(){
    sessionStorage.setItem("controleAtividade.logado", false)
    window.location = "login.html"
})

const calculaMinutos = (hora) => {
    let string_separada = hora.split(':') // '06:00' => ['06']['00']
    return parseInt(string_separada[0]) * 60 + parseInt(string_separada[1])
}

const calculaTempo = (inicio, fim) => {
    return calculaMinutos(fim) - calculaMinutos(inicio)
}

formulario.addEventListener('submit', function (evt) {
    evt.preventDefault()
    const inicio = formulario.querySelector("#inicio").value
    const fim = document.getElementById("fim").value
    const atividade = document.getElementById("atividade").value
    let minutos = calculaTempo(inicio, fim)
    let obj = {
        inicio,
        fim,
        atividade,
        minutos
    }

    if (valida(obj)) {
        if (insereEmLista(obj, listaAtividades)) {
            atualizaStorage()
            insereNoDOM(obj)
            formulario.reset()
            document.getElementById("inicio").focus()
        } else {
            alert('Atividade já existe')
        }
    }
})

function atualizaStorage() {
    localStorage.setItem("controleAtividades.atividade", JSON.stringify(listaAtividades))
}

const saoIguais = (obj1, obj2) => {
    let inicio = obj1.inicio === obj2.inicio
    let fim = obj1.fim === obj2.fim
    let atividade = obj1.atividade === obj2.atividade
    let minutos = obj1.minutos === obj2.minutos
    return inicio && fim && atividade && minutos
}

function insereEmLista(obj, lista) {
    let previamenteNaLista = lista.filter((item) => {
        if (saoIguais(item, obj)) {
            return item
        }
    })
    if (previamenteNaLista.length == 0) {
        lista.push(obj)
        return true
    }
    return false
}

function insereNoDOM(obj) {
    //tabela previamente existente no HTML
    const tabela = document.querySelector("#listaAtividades")

    //elementos a serem criados
    let linha = document.createElement('tr')
    let inicio = document.createElement('td')
    let fim = document.createElement('td')
    let minutos = document.createElement('td')
    let atividade = document.createElement('td')
    let acoes = document.createElement('td')
    let botaoExcluir = document.createElement('button')

    //criar laços entre elementos
    acoes.appendChild(botaoExcluir)
    linha.appendChild(inicio)
    linha.appendChild(fim)
    linha.appendChild(minutos)
    linha.appendChild(atividade)
    linha.appendChild(acoes)
    tabela.appendChild(linha)

    //adicionar valores
    botaoExcluir.innerHTML = 'X'
    inicio.innerHTML = obj.inicio
    fim.innerHTML = obj.fim
    minutos.innerHTML = obj.minutos
    atividade.innerHTML = obj.atividade

    botaoExcluir.addEventListener('click', (evento) => {
        removerDaLista(obj, listaAtividades)
        removerDoDOM("listaAtividades", evento.target)
        atualizaStorage()
    })

}

const removerDaLista = (obj, lista) => {
    let posicao = lista.indexOf(obj)
    if (posicao >= 0) {
        lista.splice(posicao, 1)
    } else {
        alert('A lista não possui o objeto')
    }
}

const removerDoDOM = (ID_tabela, botao) => {
    const tabela = document.querySelector("#" + ID_tabela)
    let td = botao.parentNode
    let linha = td.parentNode
    tabela.removeChild(linha)
}

// Verifica se a entrada é valida
function entradaValida(entrada, nomeCampo) {
    if (entrada == '') {
        alert("Preencha o campo " + nomeCampo)
        return false
    } else {
        return true
    }
}

function valida(obj) {
    let validas = entradaValida(obj.inicio, "inicio")
        && entradaValida(obj.fim, "fim")
        && entradaValida(obj.atividade, "atividade")
    let minutos = calculaTempo(obj.inicio, obj.fim)
    if (minutos < 0) {
        alert('O fim deve ser maior que o início')
    }
    return validas && minutos >= 0
}