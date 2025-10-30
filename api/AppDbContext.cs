using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.DTOs;
using api.Models;
using Microsoft.EntityFrameworkCore;

namespace api
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options) { }

        public DbSet<User> Users { get; set; }
        public DbSet<Sistema> Sistemas { get; set; }
        public DbSet<RefreshToken> RefreshTokens { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder
                .Entity<User>()
                .HasData(
                    [
                        new User
                        {
                            Id = Guid.NewGuid().ToString(),
                            Name = "Admin",
                            LastName = "Admin",
                            Username = "admin",
                            Email = "admin@admin.admin",
                            Password = BCrypt.Net.BCrypt.HashPassword("admin123"),
                            Admin = true,
                        },
                    ]
                );
            modelBuilder.Ignore<SelectOption>();
            modelBuilder
                .Entity<RefreshToken>()
                .HasOne(rt => rt.User)
                .WithMany(u => u.RefreshTokens)
                .HasForeignKey(rt => rt.UserId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
