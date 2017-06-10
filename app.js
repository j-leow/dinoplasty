const app = {
  init(selectors) {
    this.dinos = []
    this.max = 0
    this.list = document
      .querySelector(selectors.listSelector)
    this.template = document
      .querySelector(selectors.templateSelector)
    document
      .querySelector(selectors.formSelector)
      .addEventListener('submit', this.addDinoFromForm.bind(this))

    this.load()

  },

  load() {
    // load the JSON from localStorage
    const dinoJSON = localStorage.getItem('dinos')

    // convert the JSON back into an array
    const dinoArray = JSON.parse(dinoJSON)

    // set this.dinos with the dinos from that array
    if (dinoArray) {
      dinoArray
        .reverse()
        .map(this.addDino.bind(this))
    }
  },

  addDino(dino) {
    const listItem = this.renderListItem(dino)
    this.list.insertBefore(listItem, this.list.firstChild)

    this.dinos.unshift(dino)

    if (dino.id > this.max) {
      this.max = dino.id
    }

    this.save()
  },

  addDinoFromForm(ev) {
    ev.preventDefault()

    const dino = {
      id: this.max + 1,
      name: ev.target.dinoName.value,
      era: ev.target.dinoEra.value,
    }

    this.addDino(dino)

    ev.target.reset()
  },

  save() {
    localStorage
      .setItem('dinos', JSON.stringify(this.dinos))
    //console.log(this.dinos)  //Uncomment to check that array is correctly stored.
  },

  renderListItem(dino) {
    const item = this.template.cloneNode(true)
    item.classList.remove('template')
    item.dataset.id = dino.id

    item
      .querySelector('.dino-name')
      .textContent = dino.name

    item
      .querySelector('button.remove')
      .addEventListener('click', this.removeDino.bind(this))

    item
      .querySelector('button.fav')
      .addEventListener('click', this.addFav.bind(this))

    item
      .querySelector('button.up')
      .addEventListener('click', this.moveUp.bind(this, dino))

    item
      .querySelector('button.down')
      .addEventListener('click', this.moveDown.bind(this, dino))

    return item
  },

  addFav(ev){
    const listItem = ev.target
    const element = listItem.closest('.dino')

    listItem
      .parentElement.parentElement
      .style.backgroundColor = 'gold'

    listItem
      .addEventListener('click', this.removeFav.bind(this))
  },

  removeFav(ev) {
    const listItem = ev.target

    listItem
      .parentElement.parentElement
      .style.background = 'none'
    listItem
      .addEventListener('click', this.addFav.bind(this))
  },

  moveUp(dino, ev) {
    ev.preventDefault()
    const listItem = ev.target.closest('.dino')
    this.list
      .insertBefore(listItem, listItem.previousElementSibling)
    //Now change the index of the array
    const index = this.dinos.findIndex((listItem, i) => {
      return listItem.id === dino.id
    })

    const swapDinos = this.dinos[index]
    this.dinos[index] = this.dinos[index-1]
    this.dinos[index-1] = swapDinos
    this.save()
  },

  moveDown(dino, ev) {
    ev.preventDefault()
    const listItem = ev.target.closest('.dino')
    this.list
      .insertBefore(listItem.nextSibling, listItem)
    //Now change the index of the array
    const index = this.dinos.findIndex((listItem, i) => {
      return listItem.id === dino.id
    })

    const swapDinos = this.dinos[index]
    this.dinos[index] = this.dinos[index+1]
    this.dinos[index+1] = swapDinos
    this.save()
  },

  editItem() {
    //TODO: Make the edit item method
  },

  removeDino(ev) {
    const listItem = ev.target.closest('.dino')
    listItem.remove()


    for (let i = 0; i < this.dinos.length; i++) {
      const currentId = this.dinos[i].id.toString()
      if (listItem.dataset.id === currentId) {
        this.dinos.splice(i, 1)
        break;
      }
    }

    this.save()
  },
}

app.init({
  formSelector: '#dino-form',
  listSelector: '#dino-list',
  templateSelector: '.dino.template',
})
