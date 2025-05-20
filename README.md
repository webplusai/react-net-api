## Setup Instructions

1. Clone the repository to local
2. Open **Invoicer.sln** with Visual Studio
3. Run the web app (Debug->Start Debugging or F5)

## Challenges

1. **Handling LineItem deletions on update:** Entity Framework doesn't automatically detect removed child entities on update. To resolve this, manual sync logic was implemented in the service layer.
2. **Form validation with Ant Design:** Some validation rules (e.g, min on Quantity, Amount) didn't behave as expected. This was fixed by using { type: 'number', min: 1 } in the validation rules.

## Decision made

1. **Repository and Service Pattern:** Used to separate data access from business logic for maintainability.
2. **Serilog for Logging:** Chosen for structured logging and flexible sinks, with file and debug output
