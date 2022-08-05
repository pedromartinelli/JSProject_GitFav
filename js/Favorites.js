class DataClass {
  constructor(root) {
    this.root = document.querySelector(root)

    this.load()
  }

  load() {
    this.entries = JSON.parse(localStorage.getItem('@Github-favorites:')) || []
    
    //  this.entries =  // teste para ver se a função update estava funcionando
    //    [
    //      {
    //        login: 'pedromartinelli',
    //        name: 'Pedro Martinelli',
    //        public_repos: '5',
    //        followers: '1'
    //      },
    //      {
    //        login: 'gusmanmatheus',
    //        name: 'Matheus Gusman',
    //        public_repos: '25',
    //        followers: '17'
    //      }
    //    ]
  }

  delete(user) {
    const filteredItems = this.entries.filter((entry) => entry.login !== user.login)

    this.entries = filteredItems
    this.update()
  }
}

export class ViewClass extends DataClass {
  constructor(root) {
    super(root)

    this.tbody = this.root.querySelector('table tbody')

    this.update()
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

      console.log(user)
      this.tbody.append(row)
    })


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
}