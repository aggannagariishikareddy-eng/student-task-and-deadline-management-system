#include <stdio.h>
#include <stdlib.h>
#include "task.h"

int main(void) {
    int choice;
    loadTasks();

    do {
        printf("\n====================================\n");
        printf(" STUDENT TASK & DEADLINE MANAGER\n");
        printf("====================================\n");
        printf("1. Add task\n");
        printf("2. View all tasks\n");
        printf("3. Search task by ID\n");
        printf("4. Mark task as completed\n");
        printf("5. Delete task\n");
        printf("6. View tasks by priority\n");
        printf("0. Save and exit\n");
        printf("Enter choice: ");

        if (scanf("%d", &choice) != 1) {
            printf("Invalid input. Exiting safely.\n");
            break;
        }

        switch (choice) {
            case 1: addTask(); break;
            case 2: displayTasks(); break;
            case 3: searchTask(); break;
            case 4: completeTask(); break;
            case 5: deleteTask(); break;
            case 6: displayByPriority(); break;
            case 0:
                saveTasks();
                printf("Tasks saved. Goodbye!\n");
                break;
            default:
                printf("Please enter a valid menu option.\n");
        }
    } while (choice != 0);

    return 0;
}
