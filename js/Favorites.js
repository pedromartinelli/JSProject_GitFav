class GithubUser {
  static search(username) {
    const endpoint = `https://api.github.com/users/${username}`

    return fetch(endpoint)
      .then(data => data.json())
      .then(({ login, name, public_repos, followers }) => ({
        login, name, public_repos, followers
      }))
  }
}
class DataClass {
  constructor(root) {
    this.root = document.querySelector(root)

    this.load()
  }

  load() {
    this.entries = JSON.parse(localStorage.getItem('@Github-favorites:')) || []
  }

  save() {
    localStorage.setItem('@Github-favorites:', JSON.stringify(this.entries))
  }

  async add(username) {
    try {
      const userExists = this.entries.find(entry => entry.login.toLowerCase() === username.toLowerCase())

      // console.log(userExists)

      if (userExists) {
        throw new Error('User already registered.')
      }

      const user = await GithubUser.search(username)

      console.log(user)
      if (user.login === undefined) {
        throw new Error('User not found!')
      }

      const input = document.querySelector('.search input')
      input.value = ''

      this.entries = [user, ...this.entries]
      this.update()
      this.save()

    } catch (error) {
      alert(error.message)
    }
  }

  delete(user) {
    const filteredItems = this.entries.filter((entry) => entry.login !== user.login)

    this.entries = filteredItems
    this.update()
    this.save()
    this.isEmpty()

  }
}

export class ViewClass extends DataClass {
  constructor(root) {
    super(root)

    this.tbody = this.root.querySelector('table tbody')

    this.update()
    this.onadd()
    this.isEmpty()
    this.enterKey()
  }

  update() {
    this.removeAllTr()


    this.entries.forEach(user => {

      const row = this.createRow()

      row.querySelector('.user img').src = `https://github.com/${user.login}.png`
      row.querySelector('.user img').alt = `Profile image of ${user.name}`
      row.querySelector('.user a').href = `https://github.com/${user.login}`
      row.querySelector('.user p').textContent = `${user.name}`
      row.querySelector('.user span').textContent = `/${user.login}`
      row.querySelector('.repos').textContent = `${user.public_repos}`
      row.querySelector('.followers').textContent = `${user.followers}`

      row.querySelector('.buttonRemove').onclick = () => {
        const isOk = confirm('Are you sure that you want to remove this profile?')
        if (isOk) {
          this.delete(user)
        }
      }
      this.tbody.append(row)
    })
    this.isEmpty()

  }

  onadd() {
    const addButton = this.root.querySelector('.search button').onclick = () => {
      const { value } = this.root.querySelector('.search input')

      this.add(value)
    }
  }

  createRow() {
    const tr = document.createElement('tr')

    tr.innerHTML =
      `
      <td class="user">
      <img src="https://github.com/PedroMartinelli.png" alt="Profile image of Pedro Martinelli">
      
      <a href="https://github.com/PedroMartinelli" target="_blank">
      <p>Pedro Martinelli</p>
      <span>/pedromartinelli</span>
      </a>
      </td>
      <td class="repos">5</td>
      <td class="followers">0</td>
      <td>
      <button class="buttonRemove">Remove</button>
      </td>
      `
    return tr
  }

  removeAllTr() {
    this.tbody.querySelectorAll('tr').forEach((tr) => {
      tr.remove()
    });
  }

  isEmpty() {
    let trExists = this.tbody.querySelector('tr')
    const fullMessage = document.querySelector('.emptyfullMessage')

    if (trExists) {
      fullMessage.classList.remove('empty')
      fullMessage.classList.add('full')
      console.log('Está cheio')
    } else {
      fullMessage.classList.remove('full')
      fullMessage.classList.add('empty')
      console.log('Está vazio')
    }
  }

  enterKey() {
    const input = document.querySelector('.search input')
    input.addEventListener('keypress', function(event) {
      if (event.key ==='Enter') {
        event.preventDefault()
        document.querySelector('.search button').click()
        input.value = ''
      }
    })
  }
}