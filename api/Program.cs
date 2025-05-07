var builder = WebApplication.CreateBuilder(args);

// Adiciona serviços ao contêiner
builder.Services.AddEndpointsApiExplorer();  // Para a exploração dos endpoints
builder.Services.AddSwaggerGen();  // Para adicionar a geração de Swagger

var app = builder.Build();

// Configura o pipeline de requisição HTTP
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();  // Ativa o Swagger
    app.UseSwaggerUI();  // Interface do Swagger UI
}

app.UseHttpsRedirection();

app.Run();
