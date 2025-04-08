# Project Overview

This project is a sprint management application designed to help teams manage their sprints and tasks effectively. It provides a user-friendly interface for creating sprints, adding tasks, and tracking progress.

## Project Structure

The project is organized into the following main directories and files:

- **components/**: Contains all the React components used in the application.
  - **sprint-management/**: Contains components related to sprint management.
    - **CreateSprint.tsx**: Component for creating a new sprint.
    - **CreateTask.tsx**: Component for creating a new task.
    - **SprintManagement.tsx**: Main component that integrates sprint and task management functionalities.
  - **ui/**: Contains reusable UI components.
    - **Button.tsx**: Styled button component.
    - **Input.tsx**: Styled input field component.
    - **Textarea.tsx**: Styled textarea component for multi-line input.
    - **Dialog.tsx**: Component for modal dialogs.
  - **shared/**: Contains shared components used across the application.
    - **TeamMemberDropdown.tsx**: Dropdown for selecting team members.
    - **ProjectSprints.tsx**: Displays the list of sprints associated with a project.

- **pages/**: Contains the entry point for the application.
  - **index.tsx**: Renders the main components and sets up the application layout.

- **package.json**: Configuration file for npm, listing dependencies and scripts.

- **tsconfig.json**: TypeScript configuration file specifying compiler options.

## Features

- Create and manage sprints with start and end dates.
- Add tasks to sprints with titles, descriptions, weightage, and assignees.
- View the status of tasks within each sprint.
- User-friendly interface with modal dialogs for creating sprints and tasks.

## Getting Started

To get started with the project, follow these steps:

1. Clone the repository:
   ```
   git clone <repository-url>
   ```

2. Navigate to the project directory:
   ```
   cd collab
   ```

3. Install the dependencies:
   ```
   npm install
   ```

4. Start the development server:
   ```
   npm run dev
   ```

5. Open your browser and go to `http://localhost:3000` to view the application.

## Contributing

Contributions are welcome! If you have suggestions for improvements or new features, feel free to open an issue or submit a pull request.

## License

This project is licensed under the MIT License. See the LICENSE file for more details.