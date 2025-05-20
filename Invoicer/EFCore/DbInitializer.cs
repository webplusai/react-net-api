using Invoicer.Models;

namespace Invoicer.Data
{
    public static class DbInitializer
    {
        public static void Initialize(IServiceProvider serviceProvider)
        {
            using var scope = serviceProvider.CreateScope();
            var context = scope.ServiceProvider.GetRequiredService<InvoiceContext>();

            context.Database.EnsureCreated(); // Ensure the database is created.

            // Check if there are any invoices already (to avoid duplicating seed data).
            if (context.Invoices.Any())
            {
                return;   // Database has been seeded.
            }

            var invoices = new[]
            {
                new Invoice
                {
                    CustomerDetails = "John Doe, 123 Elm Street, Springfield",
                    Date = DateTime.Now.AddDays(-10),
                    TotalAmount = 150.00,
                    LineItems = new[]
                    {
                        new LineItem { Description = "Product A", Quantity = 2, Amount = 50.00 },
                        new LineItem { Description = "Product B", Quantity = 1, Amount = 50.00 }
                    }
                },
                new Invoice
                {
                    CustomerDetails = "Jane Smith, 456 Maple Street, Shelbyville",
                    Date = DateTime.Now.AddDays(-5),
                    TotalAmount = 200.00,
                    LineItems = new[]
                    {
                        new LineItem { Description = "Product C", Quantity = 2, Amount = 100.00 }
                    }
                }
            };

            foreach (Invoice invoice in invoices)
            {
                context.Invoices.Add(invoice);
            }

            context.SaveChanges();
        }
    }
}
