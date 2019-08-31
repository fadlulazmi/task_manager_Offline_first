import React, {useEffect, useState, Fragment} from 'react';
import './App.css';
import db from './store/DB'
import user from './store/userDB'
import {createNewTask, getAllTask, updateTask, deleteTask} from './store/action'
import {connect} from 'react-redux'
import {Input, Form, Button} from 'semantic-ui-react'

const mapStateToProps = state => {
  return {
    ...state
  }
}

const mapDispatchToProps = {
  createNewTask,
  getAllTask,
  updateTask,
  deleteTask
}

function App(props) {

  const [task, setTask] = useState(null)
  const [tags, setTags] = useState(null)
  const [allTasks, setAllTasks] = useState(props.tasks)

  const initDB = async () => {
    if (!db.isInitialized) {
      db.setName('my_task');	// to set databasename for model
      await db.initialize(); // to initialize database locally by getting synced
    }
  }

  useEffect(() => {
    initDB()
  }, [])

  
  useEffect(() => {
    if(!allTasks) props.getAllTask()
    console.log(allTasks, '===========')
  }, [allTasks])
  
  const type_task = (task) => {
    setTask(task)
    // console.log(task)
  }

  const type_tags = (tags) => {
    setTags(tags)
    // console.log(tags)
  }

  const submit_new_task = async () => {
    if(tags && task){
      await props.createNewTask({
        task_content : task,
        tags,
        created_date : new Date()
      }, user.data)

      // await props.createNewTask()

      setAllTasks(null)
      props.getAllTask()

    }
  }

  return (
    <Fragment>
      <Form onSubmit={() => submit_new_task()}>
        <Input placeholder={'Input New Task ...'} onChange={(_,text) => type_task(text.value)}/>
        <Input
          icon='tags'
          iconPosition='left'
          label={{ tag: true, content: 'Add Tag' }}
          labelPosition='right'
          placeholder='Enter tags'
          onChange={(_,tags) => type_tags(tags.value)}
        />
        <br/>
        <Button type="submit">Click Here</Button>
        <br/>
        {
          allTasks ? allTasks.map(task => {
            return (
              <>
                <p>{JSON.stringify(task, null, 2)}</p>
                <br/>
              </>
            )
          }) : <p>loading...</p>
        }
      </Form>
    </Fragment>
  );
}

export default connect(mapStateToProps,mapDispatchToProps)(App);
