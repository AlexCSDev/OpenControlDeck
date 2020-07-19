using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace OCDBackend.Models
{
    public class Dashboard
    {
        public int Id { get; set; }
        [Required]
        public string Name { get; set; }
        public List<DashboardItem> Items { get; set; }
    }
}
