import db from './DB'

export function getAllTask(){
  return async dispatch => {
    if(! await db.initialize()){
      await db.initialize()
    }
    await db.subscribe(new Date())
    db.data.length > 0 ? db.data.forEach((datum, i) => console.log(datum, 'data ke - ', i )) : console.log(db.data, 'kosong');
    
    const tasks = db.data
    dispatch({
      type: 'GET_ALL_TASKS',
      actiion: tasks
    })
  }

}

export function createNewTask(obj){
  return async dispatch => {
    console.log(obj);
    await db.addItem(obj)
    console.log('uploading...');
    await db.upload() 
    console.log('uploaded');
    return dispatch 
  }

}

export function updateTask(id){
  return dispatch => {
    
  }

}

export function deleteTask(id){
  return dispatch => {
    
  }

}