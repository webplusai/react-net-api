using Invoicer.Models;

namespace Invoicer.Repositories
{
    public interface IInvoiceRepository
    {
        IQueryable<Invoice> GetAll();
        Task<IEnumerable<Invoice>> GetAllAsync();
        Task<Invoice?> GetByIdAsync(int id);
        Task<Invoice> AddAsync(Invoice invoice);
        Task UpdateAsync(Invoice invoice);
        Task DeleteAsync(int id);
        void RemoveLineItems(IEnumerable<LineItem> lineItems);
    }
}
