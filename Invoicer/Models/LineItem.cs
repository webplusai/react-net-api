using System.Text.Json.Serialization;

namespace Invoicer.Models
{
    public class LineItem
    {
        public int ID { get; set; }
        public int InvoiceID { get; set; }
        public string? Description { get; set; }
        public int Quantity { get; set; }
        public double Amount { get; set; }

        // Navigation property for Entity Framework
        [JsonIgnore]
        public virtual Invoice? Invoice { get; set; }
    }
}
