using Invoicer.Models;
using Microsoft.EntityFrameworkCore;

namespace Invoicer
{
    public class InvoiceContext : DbContext
    {
        public DbSet<Invoice> Invoices { get; set; }
        public DbSet<LineItem> LineItems { get; set; }

        public InvoiceContext(DbContextOptions<InvoiceContext> options)
            : base(options)
        {
        }
    }
}
