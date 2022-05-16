Parse.serverURL = 'https://parseapi.back4app.com'; // This is your Server URL
// Remember to inform BOTH the Back4App Application ID AND the JavaScript KEY
Parse.initialize(
  'jT5Y4di8sWdmZTlzuEGE2d1zVUZdXV9WrFJaq4Hc', // This is your Application ID
  'F3Fko4f3VRDBsTNRaTghwbTpvyZdZu3abkNppYT0' // This is your Javascript key
);

const modal = document.querySelector('.modal-container')
const tbody = document.querySelector('tbody')
const sNome = document.querySelector('#m-nome')
const sDisciplina = document.querySelector('#m-disciplina')
const sTarefa = document.querySelector('#m-tarefa')
const btnSalvar = document.querySelector('#btnSalvar')

let itens
let id

function openModal(edit = false, index = 0) {
  modal.classList.add('active')

  modal.onclick = e => {
    if (e.target.className.indexOf('modal-container') !== -1) {
      modal.classList.remove('active')
    }
  }

  if (edit) {
    sNome.value = itens[index].nome
    sDisciplina.value = itens[index].disciplina
    sTarefa.value = itens[index].tarefa
    id = index
  } else {
    sNome.value = ''
    sDisciplina.value = ''
    sTarefa.value = ''
  }
  
}

function editItem(index) {

  openModal(true, index)
}

function deleteItem(index) {
  itens.splice(index, 1)
  setItensBD()
  loadItens()
}

function insertItem(item, index) {
  let tr = document.createElement('tr')

  tr.innerHTML = `
    <td>${item.nome}</td>
    <td>${item.disciplina}</td>
    <td>${item.tarefa}</td>
    <td class="acao">
      <button onclick="editItem(${index})"><i class='bx bx-edit' ></i></button>
    </td>
    <td class="acao">
      <button onclick="deleteItem(${index})"><i class='bx bx-trash'></i></button>
    </td>
  `
  tbody.appendChild(tr)
}

btnSalvar.onclick = e => {
  
  if (sNome.value == '' || sDisciplina.value == '' || sTarefa.value == '') {
    return
  }

  e.preventDefault();

  if (id !== undefined) {
    itens[id].nome = sNome.value
    itens[id].disciplina = sDisciplina.value
    itens[id].tarefa = sTarefa.value
  } else {
    itens.push({'nome': sNome.value, 'disciplina': sDisciplina.value, 'tarefa': sTarefa.value})
  }

  setItensBD()

  modal.classList.remove('active')
  loadItens()
  id = undefined
}

function loadItens() {
  itens = getItensBD()
  tbody.innerHTML = ''
  itens.forEach((item, index) => {
    insertItem(item, index)
  })

}


const getItensBD = () => JSON.parse(localStorage.getItem('dbfunc')) ?? []
const setItensBD = () => localStorage.setItem('dbfunc', JSON.stringify(itens))

loadItens()


const lista = async () => {
  const cadastro = Parse.Object.extend('cadastro');
  const query = new Parse.Query(cadastro);
  try {
    const results = await query.find();
    vetortarefas = results;
    gerarLista();
  } catch (error) {
    console.error('Error while fetching Tarefa', error);
  }
};

const inserir = async () => {
  const myNewObject = new Parse.Object('Tarefa');
  myNewObject.set('descricao', inputdescricao.value);
  myNewObject.set('concluida', false);
  inputdescricao.value = "";
  inputdescricao.focus();
  try {
    const result = await myNewObject.save();
    console.log('Tarefa created', result);
    lista();
  } catch (error) {
    console.error('Error while creating Tarefa: ', error);
  }
};

const removertarefa = async (evt2, tarefa) => {
    tarefa.set(evt2.target.remove);
    try {
      const response = await tarefa.destroy();
      console.log('Delet ParseObject', response);
      lista();
    } catch (error) {
      console.error('Error while updating Tarefa', error);
    }
  };

const checktarefa = async (evt, tarefa, txt) => {
  tarefa.set('concluida', evt.target.checked);
  try {
    const response = await tarefa.save();
    console.log(response.get('concluida'));
    console.log('Tarefa updated', response)
  } catch (error) {
    console.error('Error while updating Tarefa', error);
  }
};