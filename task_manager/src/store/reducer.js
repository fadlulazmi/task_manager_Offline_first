const initState = {
    tasks : null
}

export default function reducer (state = initState, action){
    switch (action.type) {
        case 'GET_ALL_TASKS':
            return {
                ...state,
                tasks : action.payload
            }
        default:
            return state
    }
}