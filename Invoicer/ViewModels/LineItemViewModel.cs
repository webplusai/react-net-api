using System.ComponentModel.DataAnnotations;

namespace Invoicer.ViewModels
{
    public class LineItemViewModel
    {
        public int ID { get; set; }

        [Required]
        public string? Description { get; set; }

        [Range(1, int.MaxValue)]
        public int Quantity { get; set; }

        [Range(0.0, double.MaxValue)]
        public double Amount { get; set; }
    }
}
