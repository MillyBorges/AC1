// Avaliação Contínua – Cadastro de Clientes
// VERSÃO DO ALUNO
// Objetivo: implementar as funções indicadas nos TODOs.

// -------------------- SELETORES --------------------
const form = document.querySelector("#form-cliente");
const inputNome = document.querySelector("#nome");
const inputEmail = document.querySelector("#email");
const inputCPF = document.querySelector("#cpf");
const inputTelefone = document.querySelector("#telefone");
const inputCidade = document.querySelector("#cidade");
const inputUF = document.querySelector("#uf");

const msgGlobal = document.querySelector("#msg-global");
const listaClientes = document.querySelector("#lista-clientes");

const btnSalvar = document.querySelector("#btn-salvar");
const btnCancelarEdicao = document.querySelector("#btn-cancelar-edicao");

// Erros
const erroNome = document.querySelector("#erro-nome");
const erroEmail = document.querySelector("#erro-email");
const erroCPF = document.querySelector("#erro-cpf");
const erroTelefone = document.querySelector("#erro-telefone");
const erroCidade = document.querySelector("#erro-cidade");
const erroUF = document.querySelector("#erro-uf");

// -------------------- ESTADO --------------------
const clientes = [];     // array de clientes
let cpfEmEdicao = null;  // quando for edição, guarda o CPF original

// -------------------- TODO 1: limpar erros --------------------
function limparErros() {
    erroNome.textContent = "";
    erroEmail.textContent = "";
    erroCPF.textContent = "";
    erroTelefone.textContent = "";
    erroCidade.textContent = "";
    erroUF.textContent = "";

    inputNome.classList.remove("is-error");
    inputEmail.classList.remove("is-error");
    inputCPF.classList.remove("is-error");
    inputTelefone.classList.remove("is-error");
    inputCidade.classList.remove("is-error");
    inputUF.classList.remove("is-error");
}
// -------------------- TODO 2: mostrar mensagem global --------------------
function mostrarMensagemGlobal(texto, tipo = "") {
    msgGlobal.textContent = texto;
    msgGlobal.className = "msg-global"; // reset classes
    if (tipo === "erro") {
        msgGlobal.classList.add("erro");
    } else if (tipo === "ok") {
        msgGlobal.classList.add("ok");
    }
}
// -------------------- TODO 3: validar e-mail --------------------
function emailValido(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}
// -------------------- TODO 4: validar CPF --------------------
function cpfValido(cpf) {
    const apenasNums = cpf.replace(/\D/g, "");
    return apenasNums.length === 11;
}

// -------------------- TODO 5: já existe CPF? --------------------
function cpfJaCadastrado(cpf) {
    return clientes.some(c => c.cpf === cpf);
}

// -------------------- TODO 6: já existe e-mail? --------------------
// se "cpfDoProprio" for passado, significa que é edição e deve IGNORAR o e-mail do próprio cliente
function emailJaCadastrado(email, cpfDoProprio = null) {
    return clientes.some(c => c.email === email && c.cpf !== cpfDoProprio);
}

// -------------------- TODO 7: resetar form --------------------
function resetarFormulario() {
    form.reset();
    inputCPF.disabled = false;
    btnCancelarEdicao.hidden = true;
    btnSalvar.textContent = "Cadastrar cliente";
    cpfEmEdicao = null;
    limparErros();
    mostrarMensagemGlobal("");
}
// -------------------- MONTAR OBJETO CLIENTE --------------------
function montarClienteDoFormulario() {
    return {
        nome: inputNome.value.trim(),
        email: inputEmail.value.trim(),
        cpf: inputCPF.value.trim(),
        telefone: inputTelefone.value.trim(),
        cidade: inputCidade.value.trim(),
        uf: inputUF.value.trim()
    };
}

// -------------------- TODO 8: validar cliente --------------------
// Deve validar: nome, email, cpf, uf e duplicidade (CPF/e-mail)
function validarCliente(cliente, modoEdicao = false) {
    limparErros();
    let valido = true;

    if (!cliente.nome) {
        erroNome.textContent = "Nome é obrigatório.";
        inputNome.classList.add("is-error");
        valido = false;
    }

    if (!emailValido(cliente.email)) {
        erroEmail.textContent = "E-mail inválido.";
        inputEmail.classList.add("is-error");
        valido = false;
    } else if (emailJaCadastrado(cliente.email, modoEdicao ? cliente.cpf : null)) {
        erroEmail.textContent = "E-mail já cadastrado.";
        inputEmail.classList.add("is-error");
        valido = false;
    }


    if (!cpfValido(cliente.cpf)) {
        erroCPF.textContent = "CPF inválido.";
        inputCPF.classList.add("is-error");
        valido = false;
    } else if (!modoEdicao && cpfJaCadastrado(cliente.cpf)) {
        erroCPF.textContent = "CPF já cadastrado.";
        inputCPF.classList.add("is-error");
        valido = false;
    }

    if (!cliente.uf) {
        erroUF.textContent = "UF é obrigatório.";
        inputUF.classList.add("is-error");
        valido = false;
    }



    return valido;
}

// -------------------- RENDERIZAR LISTA --------------------
function renderizarClientes() {
    listaClientes.innerHTML = "";

    clientes.forEach((cliente) => {
        const li = document.createElement("li");
        li.className = "item-cliente";

        const info = document.createElement("div");
        info.className = "item-info";

        const nomeEl = document.createElement("span");
        nomeEl.className = "item-nome";
        nomeEl.textContent = cliente.nome;

        const metaEl = document.createElement("span");
        metaEl.className = "item-meta";
        const local = cliente.cidade
            ? `${cliente.cidade}${cliente.uf ? " - " + cliente.uf : ""}`
            : cliente.uf
                ? cliente.uf
                : "";
        metaEl.textContent = `${cliente.email} • CPF: ${cliente.cpf}${local ? " • " + local : ""}`;

        info.appendChild(nomeEl);
        info.appendChild(metaEl);

        const actions = document.createElement("div");
        actions.className = "item-actions";

        const btnEdit = document.createElement("button");
        btnEdit.textContent = "Alterar";
        btnEdit.className = "btn-sm btn-edit";
        btnEdit.dataset.cpf = cliente.cpf;

        const btnRemove = document.createElement("button");
        btnRemove.textContent = "Remover";
        btnRemove.className = "btn-sm btn-remove";
        btnRemove.dataset.cpf = cliente.cpf;

        actions.appendChild(btnEdit);
        actions.appendChild(btnRemove);

        li.appendChild(info);
        li.appendChild(actions);

        listaClientes.appendChild(li);
    });
}

// -------------------- SUBMIT DO FORMULÁRIO --------------------
form.addEventListener("submit", (e) => {
    e.preventDefault();

    const cliente = montarClienteDoFormulario();

    // MODO CADASTRO
    if (cpfEmEdicao === null) {
        if (!validarCliente(cliente, false)) {
            mostrarMensagemGlobal("Corrija os erros antes de salvar.", "erro");
            return;
        }

        clientes.push(cliente);
        renderizarClientes();
        resetarFormulario();
        mostrarMensagemGlobal("Cliente cadastrado com sucesso!", "ok");

    } else {
        
        // MODO EDIÇÃO - CPF fixo
        cliente.cpf = cpfEmEdicao;

        if (!validarCliente(cliente, true)) {
            mostrarMensagemGlobal("Corrija os erros antes de salvar.", "erro");
            return;
        }

        const index = clientes.findIndex(c => c.cpf === cpfEmEdicao);
        if (index !== -1) {
            clientes[index] = cliente;
            renderizarClientes();
            resetarFormulario();
            mostrarMensagemGlobal("Cliente atualizado com sucesso!", "ok");
        }
    }
});

// -------------------- CLIQUE NA LISTA --------------------
listaClientes.addEventListener("click", (e) => {
    const btn = e.target;
    if (btn.tagName !== "BUTTON") return;

    const cpf = btn.dataset.cpf;
    if (!cpf) return;

    if (btn.classList.contains("btn-remove")) {
        const index = clientes.findIndex(c => c.cpf === cpf);
        if (index !== -1) {
            clientes.splice(index, 1);
            renderizarClientes();
            mostrarMensagemGlobal("Cliente removido com sucesso!", "ok");
            if (cpfEmEdicao === cpf) resetarFormulario();
        }
    }

    if (btn.classList.contains("btn-edit")) {
        const cliente = clientes.find(c => c.cpf === cpf);
        if (!cliente) return;

        inputNome.value = cliente.nome;
        inputEmail.value = cliente.email;
        inputCPF.value = cliente.cpf;
        inputTelefone.value = cliente.telefone;
        inputCidade.value = cliente.cidade;
        inputUF.value = cliente.uf;

        inputCPF.disabled = true;
        btnSalvar.textContent = "Salvar alterações";
        btnCancelarEdicao.hidden = false;
        cpfEmEdicao = cpf;
        limparErros();
        mostrarMensagemGlobal("");
    }
});


// -------------------- CANCELAR EDIÇÃO --------------------
btnCancelarEdicao.addEventListener("click", () => {
    resetarFormulario();
});