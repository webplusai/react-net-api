using System.ComponentModel.DataAnnotations;

namespace Invoicer.ViewModels
{
    public class InvoiceViewModel
    {
        public int ID { get; set; }

        [Required]
        public string CustomerDetails { get; set; }

        [Required]
        public DateTime Date { get; set; }

        [Range(0, double.MaxValue)]
        public double TotalAmount { get; set; }

        public List<LineItemViewModel> LineItems { get; set; } = new();
    }
}
