# PROMPTS.md

> The following prompts were used during development to get guidance, review implementation decisions, generate boilerplate, and improve testing. The final implementation, debugging, integration, and verification were completed manually.

---

# Commit: feat(auth): Set up authentication module

## ChatGPT

### Prompt 1

```
Review my authentication architecture for an Express + TypeScript application.

Suggest improvements in folder structure, validation, middleware separation, and security. I only need guidance, not the complete implementation.
```

### Prompt 2

```
Explain the JWT authentication flow in Express and recommend best practices for protecting routes.
```

### Prompt 3

```
Review my authentication test cases and suggest important edge cases I may have missed.
```

## GitHub Copilot

### Prompt 1

```
Generate a basic Express authentication controller template with register and login methods using TypeScript.
```

### Prompt 2

```
Generate a Jest test skeleton for authentication endpoints.
```

---

# Commit: feat(user): Add User model

## ChatGPT

### Prompt 1

```
Review my Mongoose User schema.

Suggest validation improvements, indexing recommendations, and any missing constraints.
```

### Prompt 2

```
Suggest meaningful unit tests for validating a User model.
```

---

# Commit: feat(registration): Registration service and endpoint

## GitHub Copilot

### Prompt 1

```
Generate a registration service template using Express, bcrypt, and Mongoose.

Keep business logic separate from the controller.
```

## ChatGPT

### Prompt 2

```
Review my registration workflow and suggest additional validation or error-handling scenarios.
```

---

# Commit: feat(login): Login service and endpoint

## GitHub Copilot

### Prompt 1

```
Generate a basic login controller template that delegates authentication to a service layer.
```

## ChatGPT

### Prompt 2

```
Review my JWT login flow and suggest security improvements or missing edge cases.
```

---

# Commit: feat(auth): JWT authentication middleware

## GitHub Copilot

### Prompt 1

```
Generate a middleware template that validates JWT tokens and attaches the authenticated user to the request.
```

## ChatGPT

### Prompt 2

```
Review my JWT middleware and suggest improvements for security and error handling.
```

---

# Commit: feat(vehicle): Vehicle model and service

## ChatGPT

### Prompt 1

```
Review my Vehicle schema and suggest validation rules or indexing improvements for better data integrity.
```

### Prompt 2

```
Suggest meaningful unit test scenarios for the Vehicle service.
```

## GitHub Copilot

### Prompt 3

```
Generate a basic Vehicle model template and service method signatures using TypeScript.
```

---

# Commit: feat(vehicle): CRUD operations

## GitHub Copilot

### Prompt 1

```
Generate Express controller templates for Create, Read, Update, and Delete operations following REST conventions.
```

## ChatGPT

### Prompt 2

```
Review my CRUD API design and suggest edge cases or validation scenarios that should be tested.
```

---

# Commit: feat(inventory): Purchase service and API

## ChatGPT

### Prompt 1

```
Review my purchase workflow for an inventory system.

Suggest edge cases related to stock validation and error handling.
```

## GitHub Copilot

### Prompt 2

```
Generate a purchase service template that updates inventory after validating available stock.
```

---

# Commit: feat(inventory): Restock service and API

## ChatGPT

### Prompt 1

```
Review my inventory restock logic and suggest additional validation rules and test cases.
```

## GitHub Copilot

### Prompt 2

```
Generate a service template for increasing vehicle inventory while keeping business logic inside the service layer.
```

---

# Commit: feat(frontend): Frontend setup, authentication, and dashboard

## ChatGPT

### Prompt 1

```
Review my React folder structure and suggest improvements for organizing components, pages, hooks, and API services.
```

### Prompt 2

```
Review my authentication pages and dashboard UI.

Suggest improvements for responsiveness, accessibility, and user experience.
```

## GitHub Copilot

### Prompt 3

```
Generate a reusable React login form component using TypeScript and Tailwind CSS.
```

### Prompt 4

```
Generate a React dashboard component template with reusable cards and loading state placeholders.
```

---

# Commit: feat(frontend): Search, purchase, and dashboard enhancements

## ChatGPT

### Prompt 1

```
Review my vehicle search flow and suggest UX improvements and important edge cases.
```

### Prompt 2

```
Review my purchase workflow and recommend improvements for loading states, disabled actions, and error messages.
```

## GitHub Copilot

### Prompt 3

```
Generate a reusable React search component using TypeScript and Tailwind CSS.
```

### Prompt 4

```
Generate a reusable Vehicle Card component with a Purchase button and props for displaying inventory information.
```