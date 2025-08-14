using api;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Adiciona serviços ao contêiner
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddDistributedMemoryCache();

builder.Services.AddSession(options =>
{
    options.IdleTimeout = TimeSpan.FromMinutes(30); // Tempo de vida da sessão
    options.Cookie.HttpOnly = true;
    options.Cookie.IsEssential = true;
});
var connectionString = $"Server={Environment.GetEnvironmentVariable("MYSQL_HOST")};" +
                       $"Port={Environment.GetEnvironmentVariable("MYSQL_PORT")};" +
                       $"Database={Environment.GetEnvironmentVariable("MYSQL_DATABASE")};" +
                       $"User={Environment.GetEnvironmentVariable("MYSQL_USER")};" +
                       $"Password={Environment.GetEnvironmentVariable("MYSQL_PASSWORD")};" +
                       $"SslMode=none";

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString))
);

builder.Services.AddCors(options =>
{
    options.AddPolicy("CorsPolicy", policy =>
    {
        policy.WithOrigins("http://localhost:5173")
            .AllowAnyMethod()
            .AllowAnyHeader()
            .AllowCredentials();
    });
});

var app = builder.Build();

app.UseCors("CorsPolicy");

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();

    // Redireciona "/" para "/swagger"
    app.Use(async (context, next) =>
    {
        if (context.Request.Path == "/")
        {
            context.Response.Redirect("/swagger");
            return;
        }
        await next();
    });
}


app.UseHttpsRedirection();

app.UseRouting();      // precisa para roteamento funcionar

app.Use(async (context, next) =>
{
    Console.WriteLine($"[HTTP Request] {context.Request.Method} {context.Request.Path}");
    await next();
});

app.UseSession();      // deve vir depois do roteamento

app.UseAuthorization();

app.MapControllers();

app.Run();