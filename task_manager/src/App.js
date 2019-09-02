import React, {useEffect, useState, Fragment, Component} from 'react';
import './App.css';
import db from './store/DB'
import user from './store/userDB'
// import {createNewTask, getAllTask, updateTask, deleteTask, resetState} from './store/action'
// import {connect} from 'react-redux'
// import {Input, Form, Button} from 'semantic-ui-react'

class App extends Component {
  state = {
    task_content: '',
    tags : [],
    tags_input : '',
    isInitialized: false,
  }

  render() {
    if (!this.state.isInitialized) {
      return null;
    }
    return (
      <div>
        <h2>
          todos: <button onClick={this.upload}>
            {`upload (${db.countUnuploadeds()})`}
          </button>
        </h2>
        <pre>
          last upload: {db.dataMeta.tsUpload}
        </pre>
        {
          db.data.map((todo, index) => (
            <p key={todo._id}>
              {index + 1}. {todo.task_content}, {JSON.stringify(todo.tags)}
              {
                !db.checkIsUploaded(todo) && (
                  ` (belum upload)`
                )
              }
              {` `}
              <button onClick={() => this.deleteTodo(todo._id)}>
                X
              </button>
            </p>
          ))
        }

        <h2>add new todo</h2>
        <form onSubmit={this.addTodo}>
          <p><input type='text' value={this.state.task_content} onChange={this.type_task_content} /></p>
          <p><input type='text' value={this.state.tags_input} onChange={this.add_task_tag} /></p>
          <p>{JSON.stringify(this.state.tags)}</p>
          <p><button>submit</button></p>
        </form>
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

  type_task_content = (event) => {
    this.setState({
      task_content: event.target.value,
    });
  }

  add_task_tag = (event) => {
    console.log('event.target.value: ', event.target.value);
    this.setState({
      tags_input : event.target.value
    }, () => {
      let text = this.state.tags_input
      if(text[text.length-1] === ',' || text[text.length-1] === ' ' ){

        this.setState({
          tags : this.state.tags.includes(text.slice(0,text.length-1)) ? this.state.tags : this.state.tags.concat([text.slice(0,text.length-1)]),
          tags_input : ''
        })
      }
    })
  }

  addTodo = async (event) => {
    event.preventDefault();
    await db.addItem({
      task_content: this.state.task_content,
      tags : this.state.tags,
      created_date : new Date()
    }, user.data);
    this.setState({ 
      task_content: '', 
      tags : [],
      tags_input : ''
    });
  }

  deleteTodo = async (id) => {
    db.deleteItem(id, user.data);
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
