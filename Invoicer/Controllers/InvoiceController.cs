using Invoicer.Models;
using Invoicer.Services;
using Invoicer.ViewModels;
using Microsoft.AspNetCore.Mvc;

namespace Invoicer.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class InvoiceController : ControllerBase
    {
        private readonly IInvoiceService _invoiceService;

        private readonly ILogger<InvoiceController> _logger;

        public InvoiceController(IInvoiceService invoiceService, ILogger<InvoiceController> logger)
        {
            _invoiceService = invoiceService;
            _logger = logger;
        }

        // GET: api/Invoice
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Invoice>>> Get()
        {
            try
            {
                var invoices = await _invoiceService.GetAllAsync();

                if (invoices == null || !invoices.Any())
                {
                    return NotFound("No invoices found.");
                }

                return Ok(invoices);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to retrieve invoices");
                return StatusCode(500, "Internal server error. Please try again later.");
            }
        }

        // GET: api/Invoice/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Invoice>> Get(int id)
        {
            try
            {
                var invoice = await _invoiceService.GetByIdAsync(id);

                if (invoice == null)
                {
                    return NotFound($"Invoice with ID {id} not found.");
                }

                return Ok(invoice);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to retrieve invoice {Id}", id);
                return StatusCode(500, "Internal server error. Please try again later.");
            }
        }

        // Additional methods like POST, PUT, DELETE can be added as needed.
        // POST: api/Invoice
        [HttpPost]
        public async Task<ActionResult<Invoice>> Create([FromBody] InvoiceViewModel input)
        {
            try
            {
                var invoice = await _invoiceService.CreateAsync(input);

                return Ok(invoice);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to create invoice");
                return StatusCode(500, "Internal server error. Please try again later.");
            }
        }

        // PUT: api/Invoice/5
        [HttpPut("{id}")]
        public async Task<ActionResult<Invoice>> Update([FromRoute] int id, [FromBody] InvoiceViewModel input)
        {
            try
            {
                await _invoiceService.UpdateAsync(id, input);

                return Ok();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to update invoice {Id}", id);
                return StatusCode(500, "Internal server error. Please try again later.");
            }
        }

        // DELETE: api/Invoice/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete([FromRoute] int id)
        {
            try
            {
                await _invoiceService.DeleteAsync(id);

                return Ok();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to delete invoice {Id}", id);
                return StatusCode(500, "Internal server error. Please try again later.");
            }
        }
    }
}
