const initState = {
    tasks : null
}

export default function reducer (state = initState, action){
    switch (action.type) {
        case 'GET_ALL_TASKS':
            console.log(action.payload, '>>>>>>>>>>>> reducer')
            state.tasks = null
            return {
                ...state,
                tasks : action.payload
            }
        case 'RESET':
            return {
                ...state,
                tasks : null
            }
        default:
            return state
    }
}