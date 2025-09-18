using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Models;
using Microsoft.EntityFrameworkCore;

namespace api
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<User> Users { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<User>().HasData([
                new User {
                    Id = 1,
                    Name = "Admin",
                    LastName = "Admin",
                    Email = "admin@admin.admin",
                    Password = BCrypt.Net.BCrypt.HashPassword("admin123")
                }
            ]);
        }
    }
}