# Student Task and Deadline Management System

An Advanced Data Structures (ADS) mini-project written in C. It helps a student add, view, search, prioritize, complete, and delete academic tasks. Task records are stored in a text file so they remain available after the program closes.

## Features
- Add tasks with a title, deadline, and priority.
- View all tasks and their status.
- Search for a task using its ID.
- Mark a task as completed.
- Delete a task.
- View tasks grouped by priority.
- Save and load task records using file handling.

## Data structures and concepts
- **Structure (`struct Task`)**: groups each task's fields.
- **Array of structures**: stores up to 100 tasks in memory.
- **Linear search**: finds a task by its ID.
- **Array traversal**: displays and groups tasks.
- **File handling**: persists records in `data/tasks.txt`.

> This version uses an array and linear search. It does not claim to implement a linked list, queue, stack, or priority queue.

## Requirements
- GCC or another C compiler.
- A terminal / command prompt.

## Run
Run these commands from the project root:

```bash
gcc src/main.c src/task.c -o student_tasks
./student_tasks
```

On Windows with MinGW:

```bash
gcc src/main.c src/task.c -o student_tasks.exe
student_tasks.exe
```

Keep the current working directory at the project root so the program can access `data/tasks.txt`.

## Priority values
- `1` = High
- `2` = Medium
- `3` = Low

Enter deadlines in `DD-MM-YYYY` format. The program stores the date as entered; it does not yet validate calendar dates or send automatic notifications.

## GitHub
Upload the complete project folder, including `src`, `data`, `docs`, `README.md`, and `.gitignore`.
