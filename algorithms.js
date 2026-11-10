// LINEAR SEARCH
function searchTask() {
    let name = document.getElementById("searchTask").value.toLowerCase();

    let result = linearSearch(tasks, name);

    document.getElementById("adsResult").innerHTML =
        result ? "Task Found: " + result.title : "Task Not Found";
}

function linearSearch(tasks, name) {
    for (let task of tasks) {
        if (task.title.toLowerCase() === name) {
            return task;
        }
    }
    return null;
}

// MERGE SORT
function mergeSort(tasks) {
    if (tasks.length <= 1) return tasks;

    let mid = Math.floor(tasks.length / 2);

    let left = mergeSort(tasks.slice(0, mid));
    let right = mergeSort(tasks.slice(mid));

    return merge(left, right);
}

function merge(left, right) {
    let result = [];

    while (left.length && right.length) {
        if (left[0].deadline <= right[0].deadline) {
            result.push(left.shift());
        } else {
            result.push(right.shift());
        }
    }

    return result.concat(left, right);
}

function sortTasks() {
    tasks = mergeSort(tasks);
    persist();
    render();

    document.getElementById("adsResult").innerHTML =
        "Tasks sorted by deadline!";
}

// PRIORITY QUEUE
class PriorityQueue {
    constructor() {
        this.tasks = [];
    }

    enqueue(task) {
        this.tasks.push(task);
    }

    dequeue() {
        let priority = { high: 3, medium: 2, low: 1 };

        this.tasks.sort((a, b) =>
            (priority[b.priority] || 0) -
            (priority[a.priority] || 0)
        );

        return this.tasks.shift();
    }
}

function showUrgentTasks() {
    let queue = new PriorityQueue();

    tasks.forEach(task => queue.enqueue(task));

    let urgent = tasks.filter(task =>
        task.priority === "high"
    );

    document.getElementById("adsResult").innerHTML =
        urgent.length
        ? "Urgent Tasks: " + urgent.map(t => t.title).join(", ")
        : "No urgent tasks!";
}
class Node {
    constructor(deadline, task) {
        this.deadline = deadline;
        this.task = task;
        this.left = null;
        this.right = null;
    }
}

class BST {
    constructor() {
        this.root = null;
    }

    insert(root, deadline, task) {
        if (root === null)
            return new Node(deadline, task);

        if (deadline < root.deadline)
            root.left = this.insert(root.left, deadline, task);
        else
            root.right = this.insert(root.right, deadline, task);

        return root;
    }

    inorder(root) {
        if (root !== null) {
            this.inorder(root.left);
            console.log(root.task);
            this.inorder(root.right);
        }
    }
}
function testBST() {
    taskTree.root = null;

    tasks.forEach(task => {
        let deadline = new Date(task.deadline).getTime();
        let name = task.title || task.name || task.subject || "Student Task";

        taskTree.root = taskTree.insert(
            taskTree.root,
            deadline,
            name
        );
    });

    let result = [];

    function display(root) {
        if (root !== null) {
            display(root.left);
            result.push(root.task);
            display(root.right);
        }
    }

    display(taskTree.root);

    document.getElementById("bstResult").innerHTML =
        result.length ? result.join("<br>") : "No tasks available";
}
let taskTree = new BST();