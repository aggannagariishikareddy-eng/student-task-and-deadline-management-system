# Project Report: Student Task and Deadline Management System

## 1. Introduction
Students often need to manage assignments, laboratory work, examinations, and project deadlines. This project provides a simple menu-driven system to organize those tasks.

## 2. Objectives
- Maintain a list of academic tasks.
- Store a deadline and priority for every task.
- Track pending and completed tasks.
- Search, update status, and delete task records.
- Preserve task information between program runs.

## 3. Tools and technologies
- Programming language: C
- Compiler: GCC
- Concepts: structures, arrays, searching, traversal, and file handling.

## 4. Data representation
Each task contains:
- Task ID
- Task title
- Deadline
- Priority (High, Medium, Low)
- Completion status

## 5. Algorithms
### Add task
1. Check whether the task array has free space.
2. Read the title, deadline, and priority.
3. Assign a unique ID.
4. Add the task to the array.
5. Save all tasks to the data file.

### Search task
1. Read the task ID.
2. Scan the array from the first task to the last.
3. If an ID matches, display the task.
4. Otherwise, display “Task not found”.

### Delete task
1. Find the task by ID.
2. Shift later array elements one position to the left.
3. Reduce the task count.
4. Save the updated records.

## 6. Complexity analysis
Let `n` be the number of stored tasks.

| Operation | Time complexity |
|---|---|
| Add task | O(1) average, excluding file save |
| View tasks | O(n) |
| Search by ID | O(n) |
| Mark completed | O(n) |
| Delete task | O(n) |
| Display by priority | O(n) |

Saving the complete file takes O(n) time.

## 7. Limitations
- Stores up to 100 tasks.
- Date format is accepted as text and is not calendar-validated.
- No automatic notifications.
- Data is stored locally in a text file.

## 8. Future enhancements
- Use a linked list for dynamic task storage.
- Use a priority queue to retrieve the most urgent task.
- Add date validation and overdue-task detection.
- Add a graphical or web interface.
- Add student accounts and a database.

## 9. Conclusion
The project demonstrates how basic data structures and file handling can be used to build a useful student task manager. It provides core task-management operations in a simple C application.
