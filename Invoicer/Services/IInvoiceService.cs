using Invoicer.ViewModels;

namespace Invoicer.Services
{
    public interface IInvoiceService
    {
        Task<IEnumerable<InvoiceViewModel>> GetAllAsync();
        Task<InvoiceViewModel?> GetByIdAsync(int id);
        Task<InvoiceViewModel> CreateAsync(InvoiceViewModel vm);
        Task UpdateAsync(int id, InvoiceViewModel vm);
        Task DeleteAsync(int id);
    }
}
