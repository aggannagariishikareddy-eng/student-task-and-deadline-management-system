#include <stdio.h>
#include <string.h>
#include "task.h"

#define DATA_FILE "data/tasks.txt"

static Task tasks[MAX_TASKS];
static int taskCount = 0;
static int nextId = 1;

static void clearInputBuffer(void) {
    int ch;
    while ((ch = getchar()) != '\n' && ch != EOF) { }
}

static int findIndexById(int id) {
    for (int i = 0; i < taskCount; i++) {
        if (tasks[i].id == id) return i;
    }
    return -1;
}

void loadTasks(void) {
    FILE *file = fopen(DATA_FILE, "r");
    if (file == NULL) return;

    while (taskCount < MAX_TASKS &&
           fscanf(file, "%d|%99[^|]|%19[^|]|%d|%d\n",
                  &tasks[taskCount].id,
                  tasks[taskCount].title,
                  tasks[taskCount].deadline,
                  &tasks[taskCount].priority,
                  &tasks[taskCount].completed) == 5) {
        if (tasks[taskCount].id >= nextId)
            nextId = tasks[taskCount].id + 1;
        taskCount++;
    }
    fclose(file);
}

void saveTasks(void) {
    FILE *file = fopen(DATA_FILE, "w");
    if (file == NULL) {
        printf("Error: Could not save tasks. Check that the data folder exists.\n");
        return;
    }

    for (int i = 0; i < taskCount; i++) {
        fprintf(file, "%d|%s|%s|%d|%d\n",
                tasks[i].id, tasks[i].title, tasks[i].deadline,
                tasks[i].priority, tasks[i].completed);
    }
    fclose(file);
}

void addTask(void) {
    if (taskCount >= MAX_TASKS) {
        printf("Task list is full.\n");
        return;
    }

    Task newTask;
    newTask.id = nextId++;

    clearInputBuffer();
    printf("Enter task title (no | character): ");
    if (fgets(newTask.title, TITLE_LENGTH, stdin) == NULL) return;
    newTask.title[strcspn(newTask.title, "\n")] = '\0';

    if (strlen(newTask.title) == 0 || strchr(newTask.title, '|') != NULL) {
        printf("Invalid title.\n");
        nextId--;
        return;
    }

    printf("Enter deadline (DD-MM-YYYY): ");
    if (fgets(newTask.deadline, DATE_LENGTH, stdin) == NULL) return;
    newTask.deadline[strcspn(newTask.deadline, "\n")] = '\0';

    printf("Priority (1=High, 2=Medium, 3=Low): ");
    if (scanf("%d", &newTask.priority) != 1 ||
        newTask.priority < 1 || newTask.priority > 3) {
        printf("Invalid priority. Task not added.\n");
        clearInputBuffer();
        nextId--;
        return;
    }

    newTask.completed = 0;
    tasks[taskCount++] = newTask;
    saveTasks();
    printf("Task added successfully. Task ID: %d\n", newTask.id);
}

void displayTasks(void) {
    if (taskCount == 0) {
        printf("No tasks found.\n");
        return;
    }

    printf("\n%-5s %-30s %-15s %-10s %-12s\n",
           "ID", "TITLE", "DEADLINE", "PRIORITY", "STATUS");
    printf("--------------------------------------------------------------------------\n");

    for (int i = 0; i < taskCount; i++) {
        const char *priority = tasks[i].priority == 1 ? "High" :
                               tasks[i].priority == 2 ? "Medium" : "Low";
        printf("%-5d %-30.30s %-15s %-10s %-12s\n",
               tasks[i].id, tasks[i].title, tasks[i].deadline, priority,
               tasks[i].completed ? "Completed" : "Pending");
    }
}

void searchTask(void) {
    int id;
    printf("Enter task ID to search: ");
    if (scanf("%d", &id) != 1) {
        printf("Invalid ID.\n");
        clearInputBuffer();
        return;
    }

    int index = findIndexById(id);
    if (index == -1) {
        printf("Task not found.\n");
        return;
    }

    printf("ID: %d\nTitle: %s\nDeadline: %s\nPriority: %s\nStatus: %s\n",
           tasks[index].id, tasks[index].title, tasks[index].deadline,
           tasks[index].priority == 1 ? "High" :
           tasks[index].priority == 2 ? "Medium" : "Low",
           tasks[index].completed ? "Completed" : "Pending");
}

void completeTask(void) {
    int id;
    printf("Enter task ID to mark completed: ");
    if (scanf("%d", &id) != 1) {
        printf("Invalid ID.\n");
        clearInputBuffer();
        return;
    }

    int index = findIndexById(id);
    if (index == -1) {
        printf("Task not found.\n");
        return;
    }

    tasks[index].completed = 1;
    saveTasks();
    printf("Task marked as completed.\n");
}

void deleteTask(void) {
    int id;
    printf("Enter task ID to delete: ");
    if (scanf("%d", &id) != 1) {
        printf("Invalid ID.\n");
        clearInputBuffer();
        return;
    }

    int index = findIndexById(id);
    if (index == -1) {
        printf("Task not found.\n");
        return;
    }

    for (int i = index; i < taskCount - 1; i++)
        tasks[i] = tasks[i + 1];

    taskCount--;
    saveTasks();
    printf("Task deleted successfully.\n");
}

void displayByPriority(void) {
    if (taskCount == 0) {
        printf("No tasks found.\n");
        return;
    }

    /* Display in priority order without changing stored task order. */
    for (int p = 1; p <= 3; p++) {
        printf("\n%s Priority Tasks:\n",
               p == 1 ? "High" : p == 2 ? "Medium" : "Low");
        int found = 0;
        for (int i = 0; i < taskCount; i++) {
            if (tasks[i].priority == p) {
                printf("  [%d] %s | Due: %s | %s\n",
                       tasks[i].id, tasks[i].title, tasks[i].deadline,
                       tasks[i].completed ? "Completed" : "Pending");
                found = 1;
            }
        }
        if (!found) printf("  None\n");
    }
}
