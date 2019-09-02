import db from './DB'
import user from './userDB'

export function getAllTask(){
  return async dispatch => {
    if(! await db.initialize()){
      await db.initialize()
    }
    
    db.data.length > 0 ? console.log(db.data) : console.log(db.data, 'kosong');
    
    const tasks = await db.data
    dispatch({
      type: 'GET_ALL_TASKS',
      payload: tasks
    })
  }

}

export function createNewTask(obj){
  return async dispatch => {
    console.log(obj);
    await db.addItem(obj, user)
    console.log('uploading...');

    // await db.upload() 
    console.log('uploaded');
    return dispatch({}) 
  }

}

export function updateTask(id){
  return dispatch => {
    resetState()
  }

}

export function deleteTask(id){
  return async dispatch => {
    console.log('delete task, ACTION');
    await db.deleteItem(id, user);
    console.log('deleted, ACTION');
    resetState()
    return dispatch({})
  }

}

export function resetState(){
  return dispatch => dispatch({type: 'RESET'})
}