#ifndef TASK_H
#define TASK_H

#define MAX_TASKS 100
#define TITLE_LENGTH 100
#define DATE_LENGTH 20

typedef struct {
    int id;
    char title[TITLE_LENGTH];
    char deadline[DATE_LENGTH]; /* Enter date as DD-MM-YYYY */
    int priority;               /* 1 = High, 2 = Medium, 3 = Low */
    int completed;              /* 0 = Pending, 1 = Completed */
} Task;

void loadTasks(void);
void saveTasks(void);
void addTask(void);
void displayTasks(void);
void searchTask(void);
void completeTask(void);
void deleteTask(void);
void displayByPriority(void);

#endif
