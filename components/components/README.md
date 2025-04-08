# Project Components Overview

This directory contains the various components used in the project, each serving a specific purpose in managing sprints and tasks.

## Components

### Sprint Management
- **sprint-management.tsx**: Manages sprint-related functionalities, including creating sprints and handling tasks. It contains state management for sprints and tasks, and functions for adding sprints and tasks.

### View Sprints
- **view_sprints.tsx**: Displays the list of sprints for a project. It includes functionality to select a sprint and view its details.

### Team Members
- **team-members.tsx**: Manages the display and selection of team members for tasks or sprints. It includes a dropdown or list for selecting members.

### Tasks
- **tasks/task-form.tsx**: Responsible for rendering the form to add new tasks. It handles form submission and calls the API to create a task, then reloads the task list based on the response.
  
- **tasks/task-list.tsx**: Displays the list of tasks associated with a selected sprint. It dynamically updates to show tasks based on the current state.
  
- **tasks/task-card.tsx**: Represents an individual task in the task list. It displays task details and provides options to update or delete the task.

### UI Components
- **ui/button.tsx**: Defines a reusable button component that can be styled and used throughout the application.
  
- **ui/input.tsx**: Defines a reusable input component for text input fields, which can be used in forms.
  
- **ui/dialog.tsx**: Defines a reusable dialog component for displaying modal dialogs, which can be used for forms or confirmations.

## Usage
To use these components, import them into your desired files and utilize their functionalities as per the requirements of your project. Ensure to follow the state management practices outlined in the sprint-management component for a seamless experience.

## Setup Instructions
1. Clone the repository.
2. Install the necessary dependencies.
3. Run the application to see the components in action.

For further details, refer to the individual component files for specific implementation instructions and examples.