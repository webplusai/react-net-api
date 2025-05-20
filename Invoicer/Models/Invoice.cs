namespace Invoicer.Models
{
    public class Invoice
    {
        public int ID { get; set; }
        public required string CustomerDetails { get; set; }
        public DateTime Date { get; set; }
        public double TotalAmount { get; set; }
        public virtual ICollection<LineItem>? LineItems { get; set; }
    }
}
