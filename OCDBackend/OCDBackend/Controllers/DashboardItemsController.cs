using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OCDBackend.Models;

namespace OCDBackend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DashboardItemsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public DashboardItemsController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/DashboardItems
        [HttpGet]
        public async Task<ActionResult<IEnumerable<DashboardItem>>> GetDashboardItems()
        {
            return await _context.DashboardItems.ToListAsync();
        }

        // GET: api/DashboardItems/5
        [HttpGet("{id}")]
        public async Task<ActionResult<DashboardItem>> GetDashboardItem(int id)
        {
            var dashboardItem = await _context.DashboardItems.FindAsync(id);

            if (dashboardItem == null)
            {
                return NotFound();
            }

            return dashboardItem;
        }

        // PUT: api/DashboardItems/5
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for
        // more details see https://aka.ms/RazorPagesCRUD.
        [HttpPut("{id}")]
        public async Task<IActionResult> PutDashboardItem(int id, DashboardItem dashboardItem)
        {
            if (id != dashboardItem.Id)
            {
                return BadRequest();
            }

            _context.Entry(dashboardItem).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!DashboardItemExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/DashboardItems
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for
        // more details see https://aka.ms/RazorPagesCRUD.
        [HttpPost]
        public async Task<ActionResult<DashboardItem>> PostDashboardItem(DashboardItem dashboardItem)
        {
            _context.DashboardItems.Add(dashboardItem);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetDashboardItem", new { id = dashboardItem.Id }, dashboardItem);
        }

        // DELETE: api/DashboardItems/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<DashboardItem>> DeleteDashboardItem(int id)
        {
            var dashboardItem = await _context.DashboardItems.FindAsync(id);
            if (dashboardItem == null)
            {
                return NotFound();
            }

            _context.DashboardItems.Remove(dashboardItem);
            await _context.SaveChangesAsync();

            return dashboardItem;
        }

        private bool DashboardItemExists(int id)
        {
            return _context.DashboardItems.Any(e => e.Id == id);
        }
    }
}
