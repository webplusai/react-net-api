using Invoicer.Models;
using Microsoft.EntityFrameworkCore;

namespace Invoicer.Repositories
{
    public class InvoiceRepository : IInvoiceRepository
    {
        private readonly InvoiceContext _context;

        public InvoiceRepository(InvoiceContext context)
        {
            _context = context;
        }

        public IQueryable<Invoice> GetAll()
        {
            return _context.Invoices.AsQueryable();
        }

        public async Task<IEnumerable<Invoice>> GetAllAsync() => await _context.Invoices.Include(i => i.LineItems).ToListAsync();

        public async Task<Invoice?> GetByIdAsync(int id) => await _context.Invoices.AsNoTracking().Include(i => i.LineItems).FirstOrDefaultAsync(x => x.ID == id);

        public async Task<Invoice> AddAsync(Invoice invoice)
        {
            var result = await _context.Invoices.AddAsync(invoice);
            await _context.SaveChangesAsync();
            return result.Entity;
        }

        public async Task UpdateAsync(Invoice invoice)
        {
            _context.Invoices.Update(invoice);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(int id)
        {
            var invoice = await _context.Invoices.FindAsync(id);

            if (invoice != null)
            {
                _context.Invoices.Remove(invoice);
                await _context.SaveChangesAsync();
            }
        }

        public void RemoveLineItems(IEnumerable<LineItem> items)
        {
            _context.LineItems.RemoveRange(items);
        }
    }
}
