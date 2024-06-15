// class for managing localstorage operations.
class Storage {
    static getLocalStorage() {
        return JSON.parse(localStorage.getItem('todoList'));
    }

    static saveLocalStorage(todoList) {
        localStorage.setItem('todoList', JSON.stringify(todoList));
    }
}


// class for creating a task
class Task {
    constructor(description) {
      this.description = description;
      this.completed = false;
      this.index += 1;
    }
  }


let taskList;

if (Storage.getLocalStorage() === null) {
  taskList = [];
} else {
  taskList = Storage.getLocalStorage();
}


//class for performing operations in task management system
class Features {
  static addTaskList = (task) => {
    if (task) {
      const newTask = new Task(task);
      taskList.push(newTask);
      taskList.forEach((element, number) => {
        element.index = number + 1;
      });
      Storage.saveLocalStorage(taskList);
    }
  }

  static removeTask = (index) => {
    taskList = Storage.getLocalStorage();
    taskList.splice(index, 1);
    taskList.forEach((task, index) => {
      task.index = index + 1;
    });
    Storage.saveLocalStorage(taskList);
  }

  static updateTask = (newDescribe, index) => {
    taskList = Storage.getLocalStorage();
    taskList[index].description = newDescribe;
    Storage.saveLocalStorage(taskList);
  }

  static completedTask = (index) => {
    taskList = Storage.getLocalStorage();
    taskList[index].completed = true;
    Storage.saveLocalStorage(taskList);
  }

  static uncompletedTask = (index) => {
    taskList = Storage.getLocalStorage();
    taskList[index].completed = false;
    Storage.saveLocalStorage(taskList);
  }

  static reconfigure = () => {
    taskList.forEach((element, position) => {
      element.index = position;
    });
  }

  static removeCompletedTask = () => {
    taskList = Storage.getLocalStorage();
    taskList = taskList.filter((item) => item.completed === false);
    this.reconfigure();
    Storage.saveLocalStorage(taskList);
  }
}


const ulContainer = document.getElementById('todo-list');


const renderTasks = () => {
  let taskList;

  if (Storage.getLocalStorage() === null) {
    taskList = [];
  } else {
    taskList = Storage.getLocalStorage();
  }

  let checking = '';
  let content = '';

  taskList.forEach((task, id) => {
    if (task.completed === false) {
      checking = '';
    } else {
      checking = 'checked';
    }

    content += `
    <li class="list-items">
    <div class="render-div">
      <input ${checking} class="check" type="checkbox" id="check${id}">
      <input class="task-description active" id="task${id}" value=${task.description} />
    </div>
    <div class="icon-content">
      <i id="removeTask${id}" class="sective fa-solid fa-trash-can delete"></i>
    </div>
  </li>`;
  });

  ulContainer.innerHTML = content;

  taskList.forEach((task, index) => {
    const removeTask = document.getElementById(`removeTask${index}`);
    if (removeTask) {
      removeTask.addEventListener('click', () => {
        Features.removeTask(index);
        renderTasks();
      });
    }
  });

  taskList.forEach((tasking, index) => {
    const updatedInput = document.getElementById(`task${tasking.index}`);
    if (updatedInput) {
      updatedInput.addEventListener(('keydown'), (e) => {
        if (e.code === 'Enter') {
          e.preventDefault();
          Features.updateTask(updatedInput.value, index);
          renderTasks();

          updatedInput.value = '';
        }
      });
    }
  });

  taskList.forEach((item, index) => {
    const checkElement = document.getElementById(`check${index}`);
    checkElement.addEventListener('change', () => {
      if (!(checkElement.checked)) {
        Features.uncompletedTask(index);
      } else {
        Features.completedTask(index);
      }
      renderTasks();
    });
  });
};

renderTasks();

const task = document.getElementById('add-task');
task.addEventListener(('keydown'), (event) => {
  if (event.code === 'Enter') {
    event.preventDefault();
    Features.addTaskList(task.value);
    renderTasks();

    task.value = '';
  }
});
