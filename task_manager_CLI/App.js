const readline = require("readline");
const { getAllData, complete, sync } = require('./store/Task')
// const user = require('./store/User')

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

let flag = false

let text_1 = `

    WELCOME "IN TASK MANAGER APP", 

    app usage, type one of these option to using this app !

     GET (to show all tasks)
     SYNC (to SYNC all tasks)
     COMPLETE <task_id> (complete the task)
     HELP (show help)
     EXIT (exit from app)


    choose ur option ? 
    (don't forget to hit ENTER after types)

`

let text_2 = `

    thanks for the action

`


function mainApp(){
    let q;

    flag ? q = `

` : q = text_1

    rl.question(q, async (answer) => {
        // TODO: Log the answer in a database
        answer = answer.split(' ')
        switch (answer[0]) {
            case "EXIT":
                console.log('THANKS FOR USING TASK MANAGER ! :)))')
                rl.close();
                break;
            case "GET":
                flag = true
                console.table(await getAllData());
                mainApp()
                break;
            case "SYNC":
                flag = true
                try {
                    console.log("syncronizing...")  
                    await sync()
                    console.log("syncronizing success")  
                    mainApp()
                    break;
                } catch (error) {
                    console.log("sorry you didn't have internet connection")
                    mainApp()
                    break;
                }
            case "COMPLETE":
                flag = true
                console.log(await complete(answer[1]));
                mainApp()
                break;
            case "HELP":
                flag = true
                console.log(`
                    GET (to show all tasks)
                    SYNC (to syncronization database)
                    COMPLETE <task_id> (complete the task)
                    HELP (show help)
                    EXIT (exit from app)
                `);
                mainApp()
                break;
            default:
                flag = true
                console.log('sorry ! command not found')
                mainApp()
                break;
        }
    });
    
}

mainApp()