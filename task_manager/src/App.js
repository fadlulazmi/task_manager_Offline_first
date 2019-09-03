import React, {Component} from 'react';
import './App.css';
import db from './store/DB'
import user from './store/userDB'

class App extends Component {
  state = {
    task_content: '',
    tags : [],
    tags_input : '',
    isInitialized: false,
    idEdit : null
  }

  render() {
    if (!this.state.isInitialized) {
      return null;
    }
    let style = {
      data : {
        borderColor: 'black',
        textAlign: 'left',
        padding: 8
      }
    }
    return (
      <div>
        <h2>
          todos: <button onClick={this.upload}>
            {`upload (${db.countUnuploadeds()})`}
          </button>
        </h2>
        <pre>
          last upload: {JSON.stringify(new Date(db.dataMeta.tsUpload).toLocaleString())}
        </pre>
        <table style={{borderCollapse: 'collapse', width: '100%'}}>
          <tbody>
            <tr>
              <th style={style.data}>No.</th>
              <th style={style.data}>Task</th>
              <th style={style.data}>Tags</th>
              <th style={style.data}>status</th>
              <th style={style.data}>action</th>
            </tr>
            
            {
              db.data.map((todo, index) => (
                <tr key={todo._id}>
                  <td>{index + 1}</td>
                  <td>{todo.task_content}</td>
                  <td>{todo.tags.join(', ')}</td>
                  <td>{!db.checkIsUploaded(todo) ? (` ( pending ) `) : (` ( uploaded ) `)}</td>
                  <td>
                    {
                      !todo.complete ? (<><button style={{color:'green'}} onClick={() => this.completeTodo(todo)}>DONE</button> | </>) : (<><button style={{color:'green'}} disabled>COMPLETED</button> | </>)
                    }
                  <button onClick={() => this.updateTodo(todo)} style={{color:'blue'}}>EDIT</button> | <button onClick={() => this.deleteTodo(todo._id)} style={{color:'red'}}>DELETE</button>
                  </td>
                </tr>
              ))
            }
          </tbody>
        </table>

        <h2>add new todo</h2>
        {/* <form> */}
          <p>TODO : <input placeholder="Input todo task" type='text' value={this.state.task_content} onChange={this.type_task_content} /></p>
          <p> TAGS : <input placeholder="Separate tags by ',' (comma) or ' ' (space)" type='text' value={this.state.tags_input} style={{width:300}} onChange={this.add_task_tag} /> {
            this.state.tags.map((tag, i) => {
              return (
                <button key={i} onClick={() => {this.delete_single_tag(tag)}} style={{color:'red'}}>{tag}</button>
              )
            })
          } 
          {
            this.state.tags.length > 0 && <small>click to delete</small>
          } </p>
          <p></p>
          <p><button onClick={() => this.addTodo()}>submit</button></p>
        {/* </form> */}
      </div>
    );
  }

  async componentDidMount() {
    this.unsubTodos = db.subscribe(this.rerender);
    await db.setName('my_task')
    await db.initialize();
    console.log('success init');
    this.setState({
      isInitialized: true,
    });
  }

  componentWillUnmount() {
    this.unsubTodos();
  }

  updateTodo = (todo) => {
    this.setState({
      task_content : todo.task_content,
      tags : todo.tags,
      idEdit : todo._id
    })
  }

  completeTodo = async (todo) => {
    await db.editItem(todo._id, {complete : true}, user.data)
  }

  type_task_content = (event) => {
    this.setState({
      task_content: event.target.value,
    });
  }

  delete_single_tag = (input) => {
    console.log(input)
    this.setState({
      tags : this.state.tags.filter(tag => {
        if(!tag.includes(input)) return tag
      })
    })
  }

  add_task_tag = (event) => {
    console.log('event.target.value: ', event.target.value);
    this.setState({
      tags_input : event.target.value
    }, () => {
      let text = this.state.tags_input
      if((text[text.length-1] === ',' || text[text.length-1] === ' ') && text.length > 1){
        this.setState({
          tags : this.state.tags.includes(text.slice(0,text.length-1)) ? this.state.tags : this.state.tags.concat([text.slice(0,text.length-1)]),
          tags_input : ''
        }, () => {
          console.log(this.state.tags);
        })
      }
    })
  }

  addTodo = async (event) => {
    // event.preventDefault();
    if(!this.state.idEdit){
      await db.addItem({
        task_content: this.state.task_content,
        tags : this.state.tags,
        created_date : new Date(),
        complete : false
      }, user.data);
    } else {
      console.log(this.state.tags, '============');
      await db.editItem(this.state.idEdit, {
        task_content: this.state.task_content,
        tags : this.state.tags
      }, user.data )
    }
    this.setState({ 
      task_content: '',
      tags : [],
      tags_input : ''
    });
  }

  deleteTodo = async (id) => {
    await db.deleteItem(id, user.data);
  }

  upload = async () => {
    console.log('uploading...');
    try {
      await db.upload();
      console.log('upload done');
    } catch (err) {
      alert(err.message);
      console.log('upload failed');
    }
  }

  rerender = () => {
    this.setState({
      _rerender: new Date(),
    });
  }

}


export default App
