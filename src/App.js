// import logo from './logo.svg';
// import './App.css';

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

// export default App;
import "./App.css";
import { useState, useEffect } from "react";
import Header from "./components/Header";
import Tasks from "./components/Tasks";
import AddTask from "./components/AddTask";
import Footer from "./components/Footer";
function App() {
  const [showAddTask, setShowAddTask] = useState(false)
  const [tasks, setTasks] = useState([])

  useEffect(()=>{
    const getTasks = async () => {
      const tasksFromServer = await fetchTasks()
      setTasks(tasksFromServer)
    }
   getTasks()
  }, [])

  //Fetch Task
  const fetchTasks= async() =>{
    const res = await fetch('http://localhost:5000/tasks')
    const data = await res.json()

  return data
  }

    //Fetch Task
    const fetchTask= async(id) =>{
      const res = await fetch(`http://localhost:5000/tasks/${id}`)
      const data = await res.json()
  
    return data
    }
  //Add Task
  const addTask = async(task) =>{
    // const id= Math.floor(Math.random() * 1000) + 1
    // const newTask = {id, ...task}
    // setTasks([...tasks, newTask])

    const res = await fetch('http://localhost:5000/tasks',{
      method:'POST',
      headers:{
        'Content-type':'application/json'
      },
      body: JSON.stringify(task),
    })

    const data = await res.json()
    setTasks([...tasks, data])
  }
  

  //Delete Task
  const deleteTask = async (id) => {
    await fetch(`http://localhost:5000/tasks/${id}`,{
      method:'DELETE',
    })

    setTasks(tasks.filter((task) => task.id !== id));
  };

  //Toggle Reminder
  const toggleReminder = async (id) =>{
    const taskToToggle = await fetchTask(id)
      const updateTask={...taskToToggle, reminder: !taskToToggle.reminder}
    const res = await fetch(`http://localhost:5000/tasks/${id}`,{
      method:'PUT',
      headers: {
        'Content-type':'application/json',
      },
      body: JSON.stringify(updateTask),
    })

    const data = await res.json()
    setTasks(tasks.map((task) => task.id === id? {...task, reminder: data.reminder}: task))
  }
  return (
    <>
      <div className="container">
        <Header onAdd={()=> setShowAddTask(!showAddTask)} showAdd={showAddTask}/>
        {showAddTask && <AddTask onAdd={addTask}/>}
        {tasks.length > 0 ? (
          <Tasks tasks={tasks} onDelete={deleteTask} onToggle={toggleReminder} />
        ) : (
          "No Current Task"
        )}
        <Footer/>
      </div>
    </>
  );
}

export default App;

