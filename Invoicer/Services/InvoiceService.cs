using Invoicer.Models;
using Invoicer.Repositories;
using Invoicer.ViewModels;

namespace Invoicer.Services
{
    public class InvoiceService : IInvoiceService
    {
        private readonly IInvoiceRepository _repository;

        public InvoiceService(IInvoiceRepository repository)
        {
            _repository = repository;
        }

        public async Task<IEnumerable<InvoiceViewModel>> GetAllAsync()
        {
            var invoices = await _repository.GetAllAsync();
            return invoices.Select(MapToViewModel);
        }

        public async Task<InvoiceViewModel?> GetByIdAsync(int id)
        {
            var invoice = await _repository.GetByIdAsync(id);
            return invoice == null ? null : MapToViewModel(invoice);
        }

        public async Task<InvoiceViewModel> CreateAsync(InvoiceViewModel vm)
        {
            var entity = MapToEntity(vm);
            var result = await _repository.AddAsync(entity);
            return MapToViewModel(result);
        }

        public async Task UpdateAsync(int id, InvoiceViewModel vm)
        {
            var invoice = await _repository.GetByIdAsync(id);
            if (invoice == null)
                throw new KeyNotFoundException("Invoice not found");

            var removedItems = invoice.LineItems?
                .Where(li => !vm.LineItems.Any(vmLi => vmLi.ID == li.ID))
                .ToList();

            invoice.CustomerDetails = vm.CustomerDetails;
            invoice.Date = vm.Date;
            invoice.TotalAmount = vm.TotalAmount;
            invoice.LineItems = vm.LineItems.Select(li => new LineItem
            {
                ID = li.ID,
                Description = li.Description,
                Quantity = li.Quantity,
                Amount = li.Amount,
                InvoiceID = invoice.ID
            }).ToList();

            // Delete removed items
            if (removedItems != null)
            {
                _repository.RemoveLineItems(removedItems);
            }

            await _repository.UpdateAsync(invoice);
        }

        public async Task DeleteAsync(int id)
        {
            await _repository.DeleteAsync(id);
        }

        private InvoiceViewModel MapToViewModel(Invoice entity)
        {
            return new InvoiceViewModel
            {
                ID = entity.ID,
                CustomerDetails = entity.CustomerDetails,
                Date = entity.Date,
                TotalAmount = entity.TotalAmount,
                LineItems = entity.LineItems?.Select(li => new LineItemViewModel
                {
                    ID = li.ID,
                    Description = li.Description,
                    Quantity = li.Quantity,
                    Amount = li.Amount
                }).ToList() ?? []
            };
        }

        private Invoice MapToEntity(InvoiceViewModel vm)
        {
            return new Invoice
            {
                ID = vm.ID,
                CustomerDetails = vm.CustomerDetails,
                Date = vm.Date,
                TotalAmount = vm.TotalAmount,
                LineItems = vm.LineItems.Select(li => new LineItem
                {
                    ID = li.ID,
                    Description = li.Description,
                    Quantity = li.Quantity,
                    Amount = li.Amount
                }).ToList()
            };
        }
    }
}
