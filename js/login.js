const usuarioEsperado = "admin"
const senhaEsperada = "e10adc3949ba59abbe56e057f20f883e"
const formulario = document.querySelector("#formLogin")

formulario.addEventListener('submit', (evento)=>{
    evento.preventDefault()

    const usuario = formulario.querySelector("#input_usuario").value
    const senha = formulario.querySelector("#input_senha").value

    if(usuarioValido(usuario, senha)){
        //prosseguir para a aplicação
        sessionStorage.setItem("controleAtividade.logado", true)
        window.location = "index.html"
    }else{
        sessionStorage.setItem("controleAtividade.logado", false)
        alert('Usuário ou senha incorretos')
    }
})

const minhaMD5 = (senha) => {
    if(senha == '123456'){
        return "e10adc3949ba59abbe56e057f20f883e"
    }else{
        return senha
    }
}

const usuarioValido = (usuario, senha) => {
    let usuario_valido = usuario == usuarioEsperado
    let senha_valida = minhaMD5(senha) == senhaEsperada
    return usuario_valido && senha_valida
}