using System.ComponentModel.DataAnnotations;
using OCDBackend.Enums;

namespace OCDBackend.Models
{
    public class DashboardItem
    {
        public int Id { get; set; }
        [Required]
        public DashboardItemType ItemType { get; set; }
        public string Image { get; set; }
        public string Text { get; set; }
        public string CommandName { get; set; }
        public string CommandValue { get; set; }
        [Required]
        public int SizeX { get; set; }
        [Required]
        public int SizeY { get; set; }
        [Required]
        public int PosX { get; set; }
        [Required]
        public int PosY { get; set; }
        [Required]
        public int DashboardId { get; set; }
        //public Dashboard Dashboard { get; set; }
    }
}
