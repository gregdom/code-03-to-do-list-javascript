const inputEntries = document.querySelector('input')
const buttonSave = document.querySelector('.saveBtn')
const buttonClean = document.querySelector('.cleanBtn')
const listItems = document.querySelector('.listItems')
const emptyList = document.querySelector('.empty')

let arrDB = []
let currentItem = {}

buttonClean.style.display = 'none'

const showItems = () => {
  listItems.innerHTML = ''

  if (!localStorage.myArr || JSON.parse(localStorage.getItem('myArr')).length === 0) {
    emptyList.style.display = 'block'
  } else {
    emptyList.style.display = 'none'
    arrDB = JSON.parse(localStorage.getItem('myArr'))
    arrDB.forEach((element, index) => {
      prepareItems(element, index)
      if (element.done === true) {
        let div = document.querySelector(`[data-index="${index}"]`)
        div.firstElementChild.style.textDecorationLine = "line-through"
        div.lastElementChild.firstElementChild.innerHTML = 'task_alt'
      }
    })
  }
}

// Create the HTML elements
const prepareItems = (element, index) => {
  // Creating elements
  let div = document.createElement('div')
  let p = document.createElement('p')
  let divItemSpan = document.createElement('div')
  let spanDoneButton = document.createElement('span')
  let spanDeleteButton = document.createElement('span')

  // Setting attributes
  div.setAttribute('class', 'item')
  div.setAttribute('data-index', index)
  divItemSpan.setAttribute('class', 'itemSpan')
  spanDoneButton.setAttribute('class', 'material-symbols-outlined done')
  spanDeleteButton.setAttribute('class', 'material-symbols-outlined delete')

  // Setting values
  p.innerHTML = element.name
  spanDoneButton.innerHTML = 'radio_button_unchecked'
  spanDeleteButton.innerHTML = 'delete_forever'

  // Append elements
  divItemSpan.appendChild(spanDoneButton)
  divItemSpan.appendChild(spanDeleteButton)
  div.appendChild(p)
  div.appendChild(divItemSpan)

  listItems.prepend(div)
}

const inputValidation = () => {
  if (!inputEntries.value || !inputEntries.value.trim()) {
    alert(`(The field cannot be empty! ⛔)`)
    inputEntries.value = ''
    buttonClean.style.display = 'none'
    inputEntries.focus()
    return
  }

  saveItems(inputEntries.value)
}

const saveItems = (item) => {
  let index = currentItem.currentName
  const list = {
    name: item,
    done: false
  }

  if (index) {
    const list = {
      name: inputEntries.value,
      done: false
    }

    arrDB[index] = list
    updateDB()
    buttonClean.style.display = 'none'
    inputEntries.value = ''
    inputEntries.focus()
    currentItem = {}
  } else {
    arrDB.push(list)
    inputEntries.value = ''
    inputEntries.focus()
    updateDB()
    buttonClean.style.display = 'none'
  }
}

const updateDB = () => {
  localStorage.myArr = JSON.stringify(arrDB);
  showItems()
}

const manipulateAction = (event) => {
  if (event.target.nodeName === 'P') {
    let parent = event.target.parentElement
    parent.click()

  } else if (event.target.nodeName === 'DIV' && event.target.classList.contains('item')) {
    updateItems(event)

  } else if (event.target.classList.contains('done')) {
    let parent = event.target.parentElement.parentElement
    doneItems(parent)
  } else {
    let parent = event.target.parentElement.parentElement
    deleteItems(parent)
  }
}

const updateItems = (event) => {
  buttonClean.style.display = 'block'
  let dataIndex = event.target.dataset.index
  let arrDB = JSON.parse(localStorage.getItem('myArr'))

  inputEntries.value = arrDB[dataIndex].name
  currentItem.currentName = dataIndex
}

const doneItems = (parent) => {
  let dataIndex = parent.dataset.index

  if (parent.firstElementChild.getAttribute('style')) {
    const list = {
      name: parent.firstChild.innerHTML,
      done: false
    }

    arrDB[dataIndex] = list
    updateDB()
  } else {
    const list = {
      name: parent.firstChild.innerHTML,
      done: true
    }

    arrDB[dataIndex] = list
    updateDB()
  }
}

const deleteItems = (parent) => {
  let dataIndex = parent.dataset.index
  arrDB.splice(dataIndex, 1)
  updateDB()
}

showItems()


// Events
buttonSave.addEventListener('click', inputValidation)

buttonClean.addEventListener('click', () => {
  inputEntries.value = ''
  inputEntries.focus()
  buttonClean.style.display = 'none'
})

inputEntries.addEventListener('keypress', (event) => {
  if (event.key === 'Enter') { inputValidation() }
})

inputEntries.addEventListener('input', () => {
  if (inputEntries.value.length >= 1) {
    buttonClean.style.display = 'block'
  } else {
    buttonClean.style.display = 'none'
  }
})

  ; (() => {
    const inputEntries = document.querySelector('input')
    if (inputEntries.value.length >= 1) {
      buttonClean.style.display = 'block'
    }
  })();

listItems.addEventListener('click', manipulateAction)