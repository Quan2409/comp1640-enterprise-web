using BackEndC_.Models;
using BackEndC_.Service;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Cors.Infrastructure;

var builder = WebApplication.CreateBuilder(args);
// ghép FE
var corsBuilder = new CorsPolicyBuilder();
corsBuilder.AllowAnyHeader();
corsBuilder.AllowAnyMethod();
corsBuilder.AllowAnyOrigin();
corsBuilder.AllowCredentials(); // Cho phép sử dụng credentials từ origin của frontend
corsBuilder.WithOrigins("http://localhost:5173"); // Thiết lập origin của frontend

builder.Services.AddCors(options =>
{
    options.AddPolicy("SiteCorsPolicy", corsBuilder.Build());
});


// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.Configure<Connect>(builder.Configuration.GetSection("ConnectionStrings"));

// Import Services !!!!!
builder.Services.AddScoped<IAccountService, AccountService>();
builder.Services.AddScoped<IFacultyService, FacultyService>();
builder.Services.AddScoped<IStudentService, StudentService>();
builder.Services.AddScoped<IEventService, EventService>();
builder.Services.AddScoped<IContributionService, ContributionService>();
builder.Services.AddScoped<IDocumentService, DocumentService>();
builder.Services.AddScoped<IGuestService, GuestService>();
builder.Services.AddScoped<ICommentService, CommentService>();
builder.Services.AddScoped<ICoordinatorService, CoordinatorService>();

var emailSettings = new EmailSettings
{
    SmtpServer = "smtp.gmail.com",
    Port = 587,
    UseSsl = true,
    Username = "duyanh20gg@gmail.com",
    Password = "$2y$04$hqkM4fI7g9jHOw4LdkiVTukad4XAhRUDjBjSrOeSPZiLCsQz4FLzS",
    SenderName = "Hello khoẻ không anh em",
    SenderEmail = "duyanh20gg@gmail.com"
};
builder.Services.Configure<EmailSettings>(builder.Configuration.GetSection("EmailSettings"));
builder.Services.AddScoped<EmailSettings>();
builder.Services.AddScoped<dbCRUD>();
builder.Services.AddDistributedMemoryCache();
builder.Services.AddDistributedMemoryCache();
builder.Services.AddSession();
builder.Services.AddHttpContextAccessor();
// cau hinh cookie cho auth
builder.Services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme).AddCookie
    (options =>
    {
        //options.Cookie.Name = "YourCookieName"; // Tên của cookie
        //options.Cookie.Path = "/"; // Đường dẫn của cookie, mặc định là '/'
        //options.Cookie.Domain = "yourdomain.com"; // Tên miền của cookie, chỉ cần đặt nếu muốn chia sẻ cookie giữa các subdomain
        //options.Cookie.HttpOnly = true; // Chỉ gửi cookie qua HTTP, không cho JavaScript truy cập
        //options.Cookie.SameSite = SameSiteMode.Strict; // Bảo vệ khỏi CSRF
        //options.Cookie.SecurePolicy = CookieSecurePolicy.Always; // Chỉ gửi cookie qua HTTPS
        options.SlidingExpiration = true;
        //options.Cookie.HttpOnly = true; // Chỉ gửi cookie qua HTTP, không cho JavaScript truy cập
        //options.Cookie.SameSite = SameSiteMode.Strict; // Bảo vệ khỏi CSRF
        //options.Cookie.SecurePolicy = CookieSecurePolicy.Always; // Chỉ gửi cookie qua HTTPS
    }

);
var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// Bỏ chặn CORS
app.UseCors("SiteCorsPolicy");

app.UseStaticFiles();
app.UseSession();
app.UseRouting();
app.UseCookiePolicy();
app.UseStaticFiles();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();




app.Run();

