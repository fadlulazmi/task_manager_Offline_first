const PouchDB = require('pouchdb')

const db = new PouchDB('http://13.250.43.79:5984/my_task', {
  username: 'admin',
  password: 'iniadmin'
})

// db.replicate.to('http://13.250.43.79:5984/', {
//   username: 'admin',
//   password: 'iniadmin'
// })

module.exports = {
  getAllData : async () => {
    try {
      let data = await db.allDocs({
        include_docs: true
      })      
      let result = []
      data.rows.forEach(task => {
        if(task.doc.deletedAt === null) result.push({
          id : task.doc._id,
          task_content : task.doc.task_content,
          tags : task.doc.tags.join(', '),
          status : task.doc.complete
        })
      })
      return result
    } catch (error) {
      return error
    }
  },
  complete : async (id) => {
    try {
      let task = await db.get(id)
      await db.put({
        ...task,
        _id : task._id,
        _rev : task._rev,
        complete : true
      })
      task = await db.get(id)
      return task
    } catch (error) {
      
    }
  }
}

