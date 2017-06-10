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
    }

    console.log(dino.id)
    this.addDino(dino)

    ev.target.reset()
  },

  save() {
    localStorage
      .setItem('dinos', JSON.stringify(this.dinos))
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
