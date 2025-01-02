
# Roadmap

This roadmap outlines the features and improvements that are planned for future releases. These tasks address known gaps and aim to enhance the functionality, security, and user experience of the project.

---

## Features Yet to Be Implemented

### **1. Candidate Pictures**
   - Add support for uploading and displaying candidate pictures in ballots.

### **2. Ballot Management**
   - Restrict ballot editing: Ensure ballots can only be edited until the election start date.
   - Automate the `active` column: Dynamically set the `active` state of a ballot based on the current date.
   - Implement error handling to provide meaningful user feedback while concealing technical details.

### **3. Logging for Ballot Operations**
   - Log the following operations:
     - **Creating** a ballot.
     - **Editing** a ballot.
     - **Deleting** a ballot.
   - Use the existing logging table and include details like the user performing the action and the timestamp.

### **4. User and Society Management**
   - **Society Management**:
     - Add CRUD functionality for societies.
   - **User Management**:
     - Add CRUD functionality for users.

### **5. Voting System Enhancements**
   - Improve vote visualizations to display:
     - Voting progress and participation rates.
     - Election results in a user-friendly, interactive format.
   - Prevent users from having multiple active sessions to enhance security.

### **6. UI/UX Improvements**
   - Redesign the user interface for better usability and aesthetics.
   - Implement user feedback mechanisms:
     - Success notifications (e.g., "Ballot created successfully").
     - Error alerts (e.g., "Something went wrong while creating the ballot").
   - Support real-time feedback and improved navigation.

### **7. Security Enhancements**
   - Prevent duplicate user sessions by restricting users to one active session at a time.
   - Ensure only minimal error information is displayed to users while logging detailed errors for developers.
   - Encrypt sensitive data beyond passwords, where applicable.

### **8. Error Handling**
   - Implement error handling to:
     - Provide generic messages for end users to protect sensitive information.
     - Log detailed technical errors for developers to debug issues effectively.

### **9. Testing**
   - Create unit tests from scratch to validate business logic and database interactions.
   - Plan and execute stress testing to assess the system’s performance under load.
   - Include automated regression tests to replace manual processes.

### **10. Deployment and CI/CD**
   - Automate deployment pipelines for staging and production environments.
   - Utilize tools like Docker for containerized deployments.

### **11. Documentation**
   - Expand API documentation using Swagger.
   - Create a comprehensive user manual for non-technical users.
   - Write developer onboarding documentation to help new contributors understand the codebase.

---

## Next Steps

These features will be prioritized based on their importance to the project and user needs. Contributions and feedback are welcome to help improve the project further.
